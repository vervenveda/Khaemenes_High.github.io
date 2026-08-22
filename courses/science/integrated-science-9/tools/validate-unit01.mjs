import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const U = path.join(ROOT,'courses/science/integrated-science-9/units/unit-01');
const COURSE = path.join(ROOT,'courses/science/integrated-science-9');
const failures=[];
const warnings=[];
const pass=[];

function read(rel){return fs.readFileSync(path.join(ROOT,rel),'utf8')}
function exists(rel){return fs.existsSync(path.join(ROOT,rel))}
function requireCheck(ok,label,detail=''){(ok?pass:failures).push({label,detail})}
function warnCheck(ok,label,detail=''){if(!ok)warnings.push({label,detail});else pass.push({label,detail})}

const lessonPaths=Array.from({length:10},(_,i)=>`courses/science/integrated-science-9/units/unit-01/lessons/day-${String(i+1).padStart(2,'0')}.html`);
for(const p of lessonPaths){
  requireCheck(exists(p),`lesson exists: ${p}`);
  if(!exists(p)) continue;
  const s=read(p);
  requireCheck(/Learning objectives/i.test(s),`objectives present: ${p}`);
  requireCheck(/safety/i.test(s),`safety language present: ${p}`);
  requireCheck(/Mastery|80%|≥80%/i.test(s),`mastery boundary present: ${p}`);
  requireCheck(/unit01\.js/i.test(s),`shared Unit 01 runtime loaded: ${p}`);
}

const requiredFiles=[
 'courses/science/integrated-science-9/units/unit-01/STANDARDS_MAPPING.md',
 'courses/science/integrated-science-9/units/unit-01/paper-helicopter-investigation.html',
 'courses/science/integrated-science-9/units/unit-01/dataset-laboratory.html',
 'courses/science/integrated-science-9/units/unit-01/investigation-design-task.html',
 'courses/science/integrated-science-9/units/unit-01/mastery-quiz.html',
 'courses/science/integrated-science-9/units/unit-01/quiz-app.js',
 'courses/science/integrated-science-9/units/unit-01/unit-assessment.html',
 'courses/science/integrated-science-9/units/unit-01/assessment-app.js',
 'courses/science/integrated-science-9/units/unit-01/student-record.html',
 'courses/science/integrated-science-9/units/unit-01/TEACHER_SCORING_GUIDE.md'
];
for(const p of requiredFiles) requireCheck(exists(p),`required Unit 01 file: ${p}`);

const unitJS=read('courses/science/integrated-science-9/units/unit-01/unit01.js');
requireCheck(/bestScore/.test(unitJS), 'best demonstrated objective score is preserved');
requireCheck(/designScore/.test(unitJS) && />=32/.test(unitJS), 'design task requires 32/40 mastery');
requireCheck(/cr1Score/.test(unitJS) && />=16/.test(unitJS), 'constructed response 1 requires 16/20 mastery');
requireCheck(/cr2Score/.test(unitJS) && />=16/.test(unitJS), 'constructed response 2 requires 16/20 mastery');
requireCheck(/verification/.test(unitJS), 'human verification participates in unit completion');
requireCheck(/completed\.add\("u01"\)|completed\.add\('u01'\)|completed\.add\(`u01`\)/.test(unitJS), 'Unit 01 synchronizes to course completedUnits');

const quiz=read('courses/science/integrated-science-9/units/unit-01/quiz-app.js');
requireCheck(/PASSING\s*=\s*Math\.ceil\(TOTAL\*0\.80\)|PASSING\s*=\s*12/.test(quiz), 'quiz threshold is 12/15 or computed ≥80%');
requireCheck(/TOTAL\s*=\s*QUESTIONS\.length|TOTAL\s*=\s*15/.test(quiz), 'quiz total is 15');

const assessment=read('courses/science/integrated-science-9/units/unit-01/assessment-app.js');
requireCheck(/PASSING\s*=\s*20/.test(assessment), 'objective assessment threshold is 20/24');
requireCheck(/TOTAL\s*=\s*QUESTIONS\.length|TOTAL\s*=\s*24/.test(assessment), 'objective assessment total is 24');

const themeLoader=read('courses/science/integrated-science-9/science-theme-loader.js');
requireCheck(/vnv-beta-link\.js/.test(themeLoader), 'shared Science layer loads Beta Program widget');
requireCheck(/khaemenes-mentor-link\.js/.test(themeLoader), 'shared Science layer loads Mentor widget');
requireCheck(/sanitized|never read student names|localStorage/i.test(themeLoader), 'mentor/beta privacy boundary is documented');

const unit1Pages=[...lessonPaths,
 'courses/science/integrated-science-9/units/unit-01/paper-helicopter-investigation.html',
 'courses/science/integrated-science-9/units/unit-01/dataset-laboratory.html',
 'courses/science/integrated-science-9/units/unit-01/investigation-design-task.html',
 'courses/science/integrated-science-9/units/unit-01/mastery-quiz.html',
 'courses/science/integrated-science-9/units/unit-01/unit-assessment.html',
 'courses/science/integrated-science-9/units/unit-01/student-record.html'
];
for(const p of unit1Pages){if(!exists(p))continue;const s=read(p);requireCheck(/unit01\.js/.test(s),`Beta/Mentor inheritance path via unit01.js: ${p}`)}

const design=read('courses/science/integrated-science-9/units/unit-01/investigation-design-task.html');
requireCheck(/32\/40/.test(design), 'design task publishes 32/40 mastery benchmark');
requireCheck(/independent/i.test(design) && /Mentor|PROSE/.test(design), 'design task distinguishes independent evidence from assisted revision');

const record=read('courses/science/integrated-science-9/units/unit-01/student-record.html');
requireCheck(/designScore/.test(record), 'student record collects design rubric score');
requireCheck(/cr1Score/.test(record) && /cr2Score/.test(record), 'student record collects both constructed-response scores');
requireCheck(/verificationAck/.test(record), 'student record requires human review acknowledgement');

const u2=read('courses/science/integrated-science-9/units/unit-02/unit02.js');
requireCheck(/u01/.test(u2) && /prereq|prerequisite|locked/i.test(u2), 'Unit 02 contains a Unit 01 prerequisite lock');

const publicKeyIssue=/\banswer\s*:\s*[0-9]/.test(quiz)||/\banswer\s*:\s*[0-9]/.test(assessment);
warnCheck(!publicKeyIssue,'objective answer keys are not visible in client-delivered source','Static client-side auto-grading currently exposes correct-answer indexes to deliberate source inspection. This is acceptable only as a documented low-stakes/local-first limitation; truly secret keys require protected grading.');

const scoringGuide=read('courses/science/integrated-science-9/units/unit-01/TEACHER_SCORING_GUIDE.md');
requireCheck(/public static-course answer-key boundary/i.test(scoringGuide), 'teacher guide documents public static answer-key limitation');

console.log(`\nUNIT 01 RELEASE VALIDATOR`);
console.log(`PASS: ${pass.length}  WARN: ${warnings.length}  FAIL: ${failures.length}\n`);
for(const x of failures) console.error(`FAIL  ${x.label}${x.detail?` — ${x.detail}`:''}`);
for(const x of warnings) console.warn(`WARN  ${x.label}${x.detail?` — ${x.detail}`:''}`);
for(const x of pass) console.log(`PASS  ${x.label}`);

if(failures.length){
 console.error(`\nRELEASE BLOCKED: ${failures.length} required check(s) failed.`);
 process.exit(1);
}
console.log(`\nRELEASE STATUS: structural checks passed${warnings.length?' with documented warning(s).':'.'}`);
