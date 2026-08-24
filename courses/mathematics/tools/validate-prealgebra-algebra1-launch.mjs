import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve("courses/mathematics");
const pa = path.join(root, "pre-algebra");
const a1 = path.join(root, "algebra-1");
let failures = 0;

const ok = (condition, message) => {
  if (condition) console.log(`OK ${message}`);
  else { console.error(`FAIL ${message}`); failures += 1; }
};
const read = file => fs.readFileSync(file, "utf8");
const json = file => JSON.parse(read(file));
const exists = file => fs.existsSync(file);

console.log("\n=== PRE-ALGEBRA LAUNCH CONTRACT ===");
const paMap = json(path.join(pa, "course-map.json"));
ok(paMap.course?.duration_weeks === 36, "Pre-Algebra official route remains 36 weeks");
ok(paMap.course?.supported_duration_weeks === 42, "Pre-Algebra supported route remains 42 weeks");
ok(paMap.readiness_gateway?.counts_toward_official_duration === false, "Pre-Algebra readiness remains pre-course");
ok(paMap.readiness_gateway?.mastery_threshold_percent === 80, "Pre-Algebra readiness threshold is 80%");
ok(paMap.conditional_unit_0?.duration_weeks === 6, "Pre-Algebra conditional Unit 0 remains six weeks");
ok(paMap.conditional_unit_0?.exit_threshold_percent === 80, "Pre-Algebra Unit 0 exit threshold is 80%");
ok(paMap.conditional_unit_0?.supported_pathway_total_weeks === 42, "Pre-Algebra Unit 0 + official route totals 42 weeks");

const paCore = read(path.join(pa, "assets/prealgebra-archaemenes-upgrade-core.js"));
ok(paCore.includes("function hardenedOverview()"), "Pre-Algebra production overview hardening is installed");
ok(paCore.includes("checked task is never mistaken for mathematical mastery"), "Pre-Algebra public copy separates completion from mastery");
ok(paCore.includes("Weekly work, mastery checks, cumulative assessments, corrections, and the modelling capstone"), "Pre-Algebra public evidence model is current");

const paDiagnostic = read(path.join(pa, "diagnostic/index.html"));
const paIds = [...paDiagnostic.matchAll(/"PA-RDY-[A-Z]+-\d{3}"/g)].map(m => m[0]);
ok(new Set(paIds).size === 30, "Pre-Algebra readiness diagnostic exposes 30 stable question IDs");
ok(paDiagnostic.includes('return"unit_0_refresher"'), "Pre-Algebra diagnostic retains conditional Unit 0 routing");
ok(paDiagnostic.includes("essentialReady") && paDiagnostic.includes("s.percent>=80"), "Pre-Algebra diagnostic applies 80% essential-strand readiness");
ok(paDiagnostic.includes('href="../units/unit-00/"') && paDiagnostic.includes('href="../units/unit-01/"'), "Pre-Algebra diagnostic routes to Unit 0 or Official Unit 1");

const paU0 = json(path.join(pa, "units/unit-00/unit-map.json"));
ok(Array.isArray(paU0.lessons) && paU0.lessons.length === 6, "Pre-Algebra Unit 0 contains six refresher weeks");
ok(paU0.unit?.lesson_mastery_threshold_percent === 80, "Pre-Algebra Unit 0 lesson threshold is 80%");
ok(paU0.unit?.weekly_quiz_threshold_percent === 80, "Pre-Algebra Unit 0 weekly quiz threshold is 80%");
ok(paU0.unit?.exit_threshold_percent === 80, "Pre-Algebra Unit 0 exit threshold is 80%");
ok(exists(path.join(pa, "tools/validate-mastery-gates.mjs")), "Pre-Algebra mastery validator exists");

console.log("\n=== ALGEBRA I LAUNCH CONTRACT ===");
const a1Map = json(path.join(a1, "course-map.json"));
ok(a1Map.course?.code === "KH-MATH-A1", "Algebra I course code is canonical");
ok(a1Map.calendar?.total_weeks === 36, "Algebra I remains 36 weeks");
ok(a1Map.course?.mastery_target === 80, "Algebra I mastery target is 80%");
ok(Array.isArray(a1Map.units) && a1Map.units.length === 13, "Algebra I contains 13 units");
ok(a1Map.units.reduce((sum, unit) => sum + Number(unit.lesson_count || 0), 0) === 87, "Algebra I course map contains 87 lessons");
ok(a1Map.calendar?.midterm_after_week === 18, "Algebra I Midterm remains after Week 18");
ok(a1Map.calendar?.final_week === 36, "Algebra I Final remains Week 36");

const landing = read(path.join(a1, "index.html"));
ok(landing.includes('class="network-ticker"'), "Algebra I landing carries the Verve N Veda ticker");
ok(landing.includes('class="portal-menu"'), "Algebra I landing carries the dropdown course menu");
ok(landing.includes('id="lessonLibrary"'), "Algebra I landing carries the lesson drawer directory");
ok(landing.includes("87 Lesson Directory"), "Algebra I menu exposes the 87-lesson directory");
ok(landing.includes("Capstone Planning Runway") && landing.includes("Weeks 33–35"), "Algebra I landing preserves capstone planning language");
const authorityPos = landing.indexOf('assets/mastery-authority-v1.js');
const progressionPos = landing.indexOf('assets/course-progression-gates.js');
ok(authorityPos >= 0 && progressionPos > authorityPos, "Algebra I landing loads mastery authority before progression gates");
ok(landing.includes("lessonGate(unit,lesson)") && landing.includes("A.weekMastered(previousWeek)"), "Algebra I lesson buttons honor lesson and weekly prerequisites");

let mappedLessons = 0;
const mappedFiles = new Set();
for (const unit of a1Map.units) {
  const id = String(unit.number).padStart(2, "0");
  const unitRoot = path.join(a1, `units/unit-${id}`);
  const unitMapFile = path.join(unitRoot, "unit-map.json");
  ok(exists(unitMapFile), `Algebra I Unit ${id} unit-map exists`);
  if (!exists(unitMapFile)) continue;
  const unitMap = json(unitMapFile);
  const lessons = Array.isArray(unitMap.lessons) ? unitMap.lessons : [];
  ok(lessons.length === unit.lesson_count, `Algebra I Unit ${id} map lists ${unit.lesson_count} lessons`);
  for (const lesson of lessons) {
    mappedLessons += 1;
    const target = path.join(unitRoot, lesson.file || "");
    ok(Boolean(lesson.file) && exists(target), `Algebra I Unit ${id} lesson ${String(lesson.number).padStart(2,"0")} target exists`);
    if (lesson.file) mappedFiles.add(path.normalize(target));
  }
  if (unitMap.mastery) ok(exists(path.join(unitRoot, unitMap.mastery)), `Algebra I Unit ${id} mastery target exists`);
  if (unitMap.project) ok(exists(path.join(unitRoot, unitMap.project)), `Algebra I Unit ${id} project target exists`);
  for (const practice of Array.isArray(unitMap.practice) ? unitMap.practice : []) {
    ok(exists(path.join(unitRoot, practice)), `Algebra I Unit ${id} practice target ${practice} exists`);
  }
}
ok(mappedLessons === 87, "Algebra I unit maps expose exactly 87 lessons");
ok(mappedFiles.size === 87, "Algebra I lesson map targets are unique");

const diagnosticHtml = read(path.join(a1, "diagnostic/index.html"));
ok(!diagnosticHtml.includes("Grade 10 · Algebra I"), "Algebra I diagnostic is placement-based rather than grade-labeled");
ok(diagnosticHtml.includes("Readiness evidence, not a grade"), "Algebra I diagnostic explains readiness/grade separation");
const match = diagnosticHtml.match(/<script>window\.EXAM_CONFIG=(\{[\s\S]*?\});<\/script>/);
ok(Boolean(match), "Algebra I diagnostic configuration is extractable");
if (match) {
  const diagnostic = JSON.parse(match[1]);
  const questions = Array.isArray(diagnostic.questions) ? diagnostic.questions : [];
  ok(diagnostic.question_count === 36 && questions.length === 36, "Algebra I diagnostic contains 36 questions");
  ok(new Set(questions.map(q => q.prompt)).size === 36, "Algebra I diagnostic prompts are non-duplicated");
  ok(questions.every(q => Array.isArray(q.options) && q.options.length === 4), "Algebra I diagnostic uses four-option items");
  ok(questions.every(q => Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length), "Algebra I diagnostic answer indexes are valid");
  ok(questions.every(q => q.answer_text === q.options[q.answer]), "Algebra I diagnostic answer text matches keyed option");
  ok(questions.every(q => !q.options.some(option => /\+\s*3$/.test(String(option)))), "Algebra I diagnostic malformed '+ 3' distractors are absent");
  const categories = new Map();
  for (const q of questions) {
    const list = categories.get(q.category) || [];
    list.push(q.difficulty);
    categories.set(q.category, list);
  }
  ok(categories.size === 18, "Algebra I diagnostic covers 18 prerequisite categories");
  ok([...categories.values()].every(v => v.length === 2 && v.includes(1) && v.includes(2)), "Each Algebra I diagnostic category has difficulty 1 and 2 evidence");
}

const readiness = read(path.join(a1, "readiness/index.html"));
ok(readiness.includes("does not replace the Algebra I diagnostic"), "Algebra I readiness bridge does not replace Week 1 diagnostic");
ok(readiness.includes("separate from the official course grade"), "Algebra I readiness bridge keeps grade and readiness separate");

const sw = read(path.join(a1, "service-worker.js"));
for (let unit = 1; unit <= 13; unit++) {
  const id = String(unit).padStart(2, "0");
  ok(sw.includes(`./units/unit-${id}/unit-map.json`), `Algebra I offline release caches Unit ${id} lesson map`);
}
ok(sw.includes("./diagnostic/index.html") && sw.includes("./readiness/index.html"), "Algebra I offline release caches launch entry surfaces");
ok(sw.includes("v6-applied-labs-landing-v1"), "Algebra I offline cache version reflects landing upgrade");

if (failures) {
  console.error(`\nLAUNCH VALIDATION FAILED: ${failures} problem(s).`);
  process.exit(1);
}
console.log("\nPASS Pre-Algebra + Algebra I launch-day contract.");
