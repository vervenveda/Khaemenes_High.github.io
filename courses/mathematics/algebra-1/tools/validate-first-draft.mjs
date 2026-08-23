import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve('courses/mathematics/algebra-1');
let problems = 0;
const ok = (condition, label) => { if (condition) console.log(`OK ${label}`); else { console.error(`FAIL ${label}`); problems += 1; } };
const exists = rel => fs.existsSync(path.join(root, rel));
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const json = rel => JSON.parse(read(rel));

const map = json('course-map.json');
ok(map.course?.code === 'KH-MATH-A1', 'course map belongs to Algebra I');
ok(map.calendar?.total_weeks === 36, 'course remains 36 weeks');
ok(map.course?.mastery_target === 80, 'course mastery target is 80%');
ok(Array.isArray(map.units) && map.units.length === 13, 'course contains 13 units');
ok(map.units.reduce((n,u)=>n+(u.lesson_count||0),0) === 87, 'course map contains 87 lessons');
ok(map.calendar?.midterm_after_week === 18, 'midterm remains after week 18');
ok(map.calendar?.final_week === 36, 'final remains week 36');

for (const unit of map.units ?? []) {
  const id = String(unit.number).padStart(2,'0');
  const base = `units/unit-${id}`;
  ok(exists(`${base}/index.html`), `Unit ${id} index exists`);
  ok(exists(`${base}/lessons`), `Unit ${id} lessons directory exists`);
  ok(exists(`${base}/practice`), `Unit ${id} practice directory exists`);
  ok(exists(`${base}/assessment`), `Unit ${id} assessment directory exists`);
  ok(exists(`${base}/projects`), `Unit ${id} projects directory exists`);
  ok(exists(`${base}/teacher-guide.html`), `Unit ${id} teacher guide exists`);
  ok(exists(`${base}/family-guide.html`), `Unit ${id} family guide exists`);
  ok(exists(`${base}/vocabulary.json`), `Unit ${id} vocabulary exists`);
  ok(exists(`${base}/standards-map.json`), `Unit ${id} standards map exists`);
  ok(exists(`${base}/unit-map.json`), `Unit ${id} unit map exists`);
  if (exists(`${base}/lessons`)) {
    const count = fs.readdirSync(path.join(root, `${base}/lessons`)).filter(f=>/\.html$/i.test(f)).length;
    ok(count === unit.lesson_count, `Unit ${id} has ${unit.lesson_count} lesson files`);
  }
}

ok(exists('diagnostic'), 'readiness diagnostic exists');
ok(exists('assessments/midterm-units-01-06.html'), 'midterm exists');
ok(exists('assessments/final-exam-36-weeks.html'), 'final exists');
ok(exists('records/course-completion-certificate.html'), 'completion certificate exists');
ok(exists('records/readiness-evidence-template.json'), 'readiness evidence template exists');
ok(exists('records/index.html'), 'records landing page exists');
ok(exists('readiness/index.html'), 'readiness landing page exists');
ok(exists('readiness/transition-contract.json'), 'cross-course readiness contract exists');
ok(exists('readiness/validate-transition-contract.mjs'), 'readiness bridge validator exists');

const midterm = read('assessments/midterm-units-01-06.html');
const finalExam = read('assessments/final-exam-36-weeks.html');
const examEngine = read('assets/exam-engine.js');
ok(midterm.includes('"question_count": 60'), 'midterm declares 60 questions');
ok(finalExam.includes('"question_count": 100'), 'final declares 100 questions');
ok(examEngine.includes('attempt_history') && examEngine.includes('bestScore') && examEngine.includes('mastery'), 'shared exam engine preserves attempt history, best score, and mastery evidence');
ok(examEngine.includes('localStorage.removeItem(C.storage_key)') && !examEngine.includes('localStorage.removeItem(C.result_key)'), 'exam reset clears only the draft and preserves scored evidence');

const assessmentMap = json('assessments/assessment-map.json');
ok((assessmentMap.midterm?.questions === 60) || (assessmentMap.midterm?.selected_response_questions === 60), 'assessment map midterm selected-response count is 60');
ok((assessmentMap.final?.questions === 100) || (assessmentMap.final?.selected_response_questions === 100), 'assessment map final selected-response count is 100');
ok(assessmentMap.definitive_answer_policy === true, 'definitive-answer policy remains enabled');

ok(exists('assessments/answer-key.json'), 'canonical singular answer key exists');
ok(!exists('assessments/answer-keys.json'), 'unused plural answer-key duplicate is absent');
ok(!exists('units/unit-13/unit-13'), 'nested duplicate Unit 13 tree is absent');
ok(!exists('lessons'), 'duplicate root Unit 06 lessons directory is absent');
const key = json('assessments/answer-key.json');
ok(key.schema === 'khaemenes-algebra1-unit-answer-key', 'canonical answer key schema is valid');
ok(key.unit === 13, 'canonical answer key belongs to Unit 13');
ok(key.question_count === 100, 'canonical Unit 13 answer key has 100 entries declared');
ok(Array.isArray(key.answers) && key.answers.length === 100, 'canonical Unit 13 answer key contains 100 answers');
ok(new Set((key.answers||[]).map(x=>x.id)).size === (key.answers||[]).length, 'canonical Unit 13 answer IDs are unique');
ok((key.answers||[]).every(x=>Number.isInteger(x.answer) && x.answer>=0 && typeof x.explanation==='string' && x.explanation.trim()), 'canonical Unit 13 answers have valid indexes and explanations');

const transition = json('readiness/transition-contract.json');
ok(transition.schema === 'khaemenes.math.transition.v1', 'readiness transition schema is canonical');
ok(transition.incoming?.from === 'KH-MATH-PA', 'Pre-Algebra incoming bridge is declared');
ok(transition.outgoing?.geometry?.course === 'KH-MATH-GEO', 'Geometry outgoing bridge is declared');
ok(transition.outgoing?.algebra2?.course === 'KH-MATH-A2', 'Algebra II outgoing bridge is declared');
ok(transition.principles?.courseGradeIsNotReadinessProfile === true, 'grade and readiness remain separate');
ok(transition.principles?.unfinishedLearningDoesNotAutomaticallyBlockProgression === true, 'unfinished learning does not automatically block progression');

const surfaces = ['index.html','teacher/index.html','family/index.html','remediation/index.html','labs/index.html','projects/index.html','readiness/index.html','records/index.html','records/course-completion-certificate.html'];
for (const file of surfaces) {
  ok(exists(file), `${file} exists`);
  if (exists(file)) {
    const html = read(file);
    ok(/<main\b/i.test(html) && /href=["']#/.test(html), `${file} exposes accessibility/navigation surface`);
  }
}

const courseHome = read('index.html');
ok(/Algebra I/i.test(courseHome) && /id=["']units["']/.test(courseHome), 'course home identifies Algebra I and exposes unit navigation');
ok(!/Unit 06 · The Linear Model Laboratory/i.test(courseHome), 'course root is not a leaked Unit 06 shell');
const teacher = read('teacher/index.html');
ok(!teacher.includes('answer-keys.json'), 'teacher portal does not reference deleted plural answer-key path');
ok(teacher.includes('../assessments/answer-key.json'), 'teacher portal points to canonical singular Unit 13 answer key');
ok(/Unit 13 Answer Key/i.test(teacher), 'teacher portal labels canonical key accurately');

ok(!exists('GRADE10_ALGEBRA1_FILE_MANIFEST.md'), 'legacy grade manifest removed from production root');
ok(!exists('MATHEMATICS_PORTAL_GRADE10_INTEGRATION.md'), 'legacy integration note removed from production root');
ok(!exists('UNIT_13_QA_REPORT.json'), 'legacy Unit 13 QA report removed from production root');
ok(!exists('UPDATE_NOTES.md'), 'legacy update notes removed from production root');
ok(!exists('UPLOAD_GRADE10_ALGEBRA1_FIRST.md'), 'legacy upload instructions removed from production root');
ok(!exists('UPLOAD_MAP.md'), 'legacy upload map removed from production root');
ok(exists('docs/internal/legacy'), 'legacy development archive is preserved');

if (problems) { console.error(`Algebra I whole-course validation failed: ${problems} problem(s).`); process.exit(1); }
console.log('Algebra I whole-course validation passed.');