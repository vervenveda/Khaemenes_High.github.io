import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const failures=[];
const warnings=[];
const pass=[];
function read(rel){return fs.readFileSync(path.join(ROOT,rel),'utf8')}
function exists(rel){return fs.existsSync(path.join(ROOT,rel))}
function requireCheck(ok,label,detail=''){(ok?pass:failures).push({label,detail})}
function warnCheck(ok,label,detail=''){if(!ok)warnings.push({label,detail});else pass.push({label,detail})}

const base='courses/science/integrated-science-9/units/unit-01';
const lessonPaths=Array.from({length:10},(_,i)=>`${base}/lessons/day-${String(i+1).padStart(2,'0')}.html`);
for(const p of lessonPaths){
  requireCheck(exists(p),`lesson exists: ${p}`);
  if(!exists(p))continue;
  const s=read(p);
  requireCheck(/Learning objectives/i.test(s),`objectives present: ${p}`);
  requireCheck(/safety/i.test(s),`safety language present: ${p}`);
  requireCheck(/Mastery|80%|≥80%/i.test(s),`mastery boundary present: ${p}`);
  requireCheck(/unit01\.js/i.test(s),`shared Unit 01 runtime loaded: ${p}`);
}

const requiredFiles=[
 `${base}/STANDARDS_MAPPING.md`,`${base}/paper-helicopter-investigation.html`,`${base}/dataset-laboratory.html`,`${base}/investigation-design-task.html`,`${base}/mastery-quiz.html`,`${base}/quiz-app.js`,`${base}/unit-assessment.html`,`${base}/assessment-app.js`,`${base}/student-record.html`,`${base}/UNIT01_STUDENT_CHECKLIST.md`,`${base}/TEACHER_SCORING_GUIDE.md`,`${base}/index.html`
];
for(const p of requiredFiles)requireCheck(exists(p),`required Unit 01 file: ${p}`);

const unitJS=read(`${base}/unit01.js`);
requireCheck(/bestScore/.test(unitJS),'best demonstrated objective score is preserved');
requireCheck(/designScore/.test(unitJS)&&/>=32/.test(unitJS),'design task requires 32/40 mastery');
requireCheck(/cr1Score/.test(unitJS)&&/>=16/.test(unitJS),'constructed response 1 requires 16/20 mastery');
requireCheck(/cr2Score/.test(unitJS)&&/>=16/.test(unitJS),'constructed response 2 requires 16/20 mastery');
requireCheck(/verification/.test(unitJS),'human verification participates in unit completion');
requireCheck(/REQUIREMENTS=.*verification/.test(unitJS.replace(/\s+/g,'')),'verification is an explicit Unit 01 requirement');
requireCheck(/completed\.add\("u01"\)|completed\.add\('u01'\)|completed\.add\(`u01`\)/.test(unitJS),'Unit 01 synchronizes to course completedUnits');

const dashboard=read(`${base}/index.html`);
requireCheck(/17[^<]{0,30}Mastery Requirements/i.test(dashboard.replace(/\s+/g,' ')),'dashboard advertises 17 mastery requirements');
requireCheck(/0 of 17 requirements/i.test(dashboard),'dashboard initial progress count matches runtime');
requireCheck(/data-requirement="verification"/.test(dashboard),'dashboard exposes human verification requirement');
requireCheck(/12\/15/.test(dashboard)&&/20\/24/.test(dashboard)&&/32\/40/.test(dashboard)&&/16\/20/.test(dashboard),'dashboard publishes all objective and human-scored mastery thresholds');
requireCheck(/Unit 02 remains locked/i.test(dashboard),'dashboard tells learners Unit 02 remains locked until mastery verification');

const quiz=read(`${base}/quiz-app.js`);
requireCheck(/PASSING\s*=\s*Math\.ceil\(TOTAL\*0\.80\)|PASSING\s*=\s*12/.test(quiz),'quiz threshold is 12/15 or computed ≥80%');
requireCheck(/TOTAL\s*=\s*QUESTIONS\.length|TOTAL\s*=\s*15/.test(quiz),'quiz total is 15');
requireCheck(/bestScore/.test(quiz),'quiz preserves best demonstrated score');

const assessment=read(`${base}/assessment-app.js`);
requireCheck(/PASSING\s*=\s*20/.test(assessment),'objective assessment threshold is 20/24');
requireCheck(/TOTAL\s*=\s*QUESTIONS\.length|TOTAL\s*=\s*24/.test(assessment),'objective assessment total is 24');
requireCheck(/bestScore/.test(assessment),'objective assessment preserves best demonstrated score');

const themeLoader=read('courses/science/integrated-science-9/science-theme-loader.js');
requireCheck(/vnv-beta-link\.js/.test(themeLoader),'shared Science layer loads Beta Program widget');
requireCheck(/khaemenes-mentor-link\.js/.test(themeLoader),'shared Science layer loads Mentor widget');
requireCheck(/sanitized|never read student names|localStorage/i.test(themeLoader),'mentor/beta privacy boundary is documented');

const unit1Pages=[...lessonPaths,`${base}/paper-helicopter-investigation.html`,`${base}/dataset-laboratory.html`,`${base}/investigation-design-task.html`,`${base}/mastery-quiz.html`,`${base}/unit-assessment.html`,`${base}/student-record.html`,`${base}/index.html`];
for(const p of unit1Pages){if(!exists(p))continue;const s=read(p);requireCheck(/unit01\.js/.test(s),`Beta/Mentor inheritance path via unit01.js: ${p}`)}

const design=read(`${base}/investigation-design-task.html`);
requireCheck(/32\/40/.test(design),'design task publishes 32/40 mastery benchmark');
requireCheck(/independent/i.test(design)&&/Mentor|PROSE/.test(design),'design task distinguishes independent evidence from assisted revision');
requireCheck(/do not conduct|Planning task only/i.test(design),'design task preserves planning-only safety boundary');

const record=read(`${base}/student-record.html`);
requireCheck(/designScore/.test(record),'student record collects design rubric score');
requireCheck(/cr1Score/.test(record)&&/cr2Score/.test(record),'student record collects both constructed-response scores');
requireCheck(/verificationAck/.test(record),'student record requires human review acknowledgement');
requireCheck(/32\/40/.test(record)&&/16\/20/.test(record),'student record publishes human-scored mastery thresholds');

const checklist=read(`${base}/UNIT01_STUDENT_CHECKLIST.md`);
requireCheck(/32\/40/.test(checklist)&&/16\/20/.test(checklist),'student checklist matches human-scored mastery thresholds');
requireCheck(/12\/15/.test(checklist)&&/20\/24/.test(checklist),'student checklist matches objective mastery thresholds');
requireCheck(/Beta/i.test(checklist)&&/Mentor/i.test(checklist),'student checklist confirms Beta and Mentor availability/boundary');

const standards=read(`${base}/STANDARDS_MAPPING.md`);
requireCheck(/assessment|evidence/i.test(standards),'standards map identifies assessment/evidence locations');
requireCheck(/review|reviewer|date/i.test(standards),'standards map includes review-governance language');

const u2=read('courses/science/integrated-science-9/units/unit-02/unit02.js');
requireCheck(/u01/.test(u2)&&/prereq|prerequisite|locked/i.test(u2),'Unit 02 contains a Unit 01 prerequisite lock');
requireCheck(/completedUnits/.test(u2),'Unit 02 checks course-level completion state');

const publicKeyIssue=/\banswer\s*:\s*[0-9]/.test(quiz)||/\banswer\s*:\s*[0-9]/.test(assessment);
warnCheck(!publicKeyIssue,'objective answer keys are not visible in client-delivered source','Static client-side auto-grading exposes correct-answer indexes to deliberate source inspection. This is a documented local-first limitation; truly secret keys require protected grading.');

const scoringGuide=read(`${base}/TEACHER_SCORING_GUIDE.md`);
requireCheck(/public static-course answer-key boundary/i.test(scoringGuide),'teacher guide documents public static answer-key limitation');
requireCheck(/32\/40/.test(scoringGuide)&&/16\/20/.test(scoringGuide),'teacher scoring guide matches runtime mastery thresholds');

console.log(`\nUNIT 01 RELEASE VALIDATOR`);
console.log(`PASS: ${pass.length}  WARN: ${warnings.length}  FAIL: ${failures.length}\n`);
for(const x of failures)console.error(`FAIL  ${x.label}${x.detail?` — ${x.detail}`:''}`);
for(const x of warnings)console.warn(`WARN  ${x.label}${x.detail?` — ${x.detail}`:''}`);
for(const x of pass)console.log(`PASS  ${x.label}`);
if(failures.length){console.error(`\nRELEASE BLOCKED: ${failures.length} required check(s) failed.`);process.exit(1)}
console.log(`\nRELEASE STATUS: structural checks passed${warnings.length?' with documented warning(s).':'.'}`);
