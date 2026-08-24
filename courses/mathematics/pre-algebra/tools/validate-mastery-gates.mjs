import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');let failures=[];const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function must(cond,msg){if(!cond)failures.push(msg)}
const course=JSON.parse(read('course-map.json'));
must(course.course?.duration_weeks===36,'course-map: official duration must be 36 weeks');
must(course.course?.supported_duration_weeks===42,'course-map: supported duration must be 42 weeks');
must(course.readiness_gateway?.counts_toward_official_duration===false,'course-map: readiness assessment must not count as a course week');
must(course.readiness_gateway?.mastery_threshold_percent===80,'course-map: readiness threshold must be 80%');
must(course.conditional_unit_0?.duration_weeks===6,'course-map: conditional Unit 0 must be six weeks');
must(course.conditional_unit_0?.supported_pathway_total_weeks===42,'course-map: Unit 0 supported pathway must total 42 weeks');

const bootstrap=read('assets/prealgebra-assessment-depth-v2.js');
must(/prealgebra-assessment-depth-v2-core\.js/.test(bootstrap),'root bootstrap: assessment-depth core is not preserved');
must(/prealgebra-course-gates-v1\.js/.test(bootstrap),'root bootstrap: course mastery gate is not loaded');
const rootGate=read('assets/prealgebra-course-gates-v1.js');
must(/NAIB_KEY/.test(rootGate)&&/EXIT_KEY/.test(rootGate),'root gate: NAIB/Unit0 entrance routing missing');
must(/weekMastered\(n-1\)/.test(rootGate)&&/quizBest\(n\)>=MIN/.test(rootGate),'root gate: prior weekly quiz 80% gate missing');
must(/MIN=80/.test(rootGate),'root gate: Academy threshold must be 80%');

const u0=JSON.parse(read('units/unit-00/unit-map.json'));
must(u0.unit?.duration_weeks===6,'Unit 0 map: duration must be six weeks');
must(u0.unit?.official_course_duration_weeks===36,'Unit 0 map: official course must remain 36 weeks');
must(u0.unit?.supported_course_duration_weeks===42,'Unit 0 map: supported route must be 42 weeks');
must(u0.unit?.readiness_gateway_counts_as_course_week===false,'Unit 0 map: readiness gateway must remain pre-course');
must(u0.unit?.lesson_mastery_threshold_percent===80,'Unit 0 map: lesson threshold must be 80%');
must(u0.unit?.weekly_quiz_threshold_percent===80,'Unit 0 map: weekly quiz threshold must be 80%');
must(u0.unit?.exit_threshold_percent===80,'Unit 0 map: exit threshold must be 80%');
must(Array.isArray(u0.lessons)&&u0.lessons.length===6,'Unit 0 map: exactly six refresher weeks required');
const u0Index=read('units/unit-00/index.html');
must(/36/.test(u0Index)&&/42/.test(u0Index)&&/practice \+ quiz both require 80%/.test(u0Index),'Unit 0 index: 36/42 and weekly gating language missing');
const refresher=read('units/unit-00/assets/refresher-engine.js');
must(/make\(W\.week,20/.test(refresher)&&/make\(W\.week,10/.test(refresher),'Unit 0 engine: 20-question lesson / 10-question quiz generation missing');
must(/practice\.best/.test(refresher)&&/quiz\.best/.test(refresher),'Unit 0 engine: best mastery evidence missing');
must(/W\.week>1/.test(refresher)&&/W\.week-1/.test(refresher),'Unit 0 engine: prior-week direct-entry gate missing');
const names=['number-foundations','rational-proportional','algebraic-reasoning','functions-coordinates','geometry-measurement','data-probability'];
for(let n=1;n<=6;n++){const f=read(`units/unit-00/lessons/lesson-${String(n).padStart(2,'0')}-${names[n-1]}.html`);must(/20 Questions/.test(f),`Unit0 Week ${n}: 20-question lesson practice missing`);must(/10 Questions/.test(f),`Unit0 Week ${n}: 10-question weekly quiz missing`);must(/Reach 80%/.test(f),`Unit0 Week ${n}: 80% gate language missing`)}
const exitPage=read('units/unit-00/assessment/exit-mastery.html'),exitEngine=read('units/unit-00/assets/refresher-exit.js');
must(/30 Questions/.test(exitPage)&&/requires 80%/.test(exitPage),'Unit0 exit: 30-question 80% gate missing');
must(/active_form/.test(exitEngine)&&/\?"B":"A"/.test(exitEngine),'Unit0 exit: parallel form switching missing');
must(/corrections/.test(exitEngine)&&/20 characters/.test(exitEngine),'Unit0 exit: reasoning-correction retake gate missing');
must(/best_percent/.test(exitEngine)&&/rec\.passed=rec\.best_percent>=MIN/.test(exitEngine),'Unit0 exit: best demonstrated mastery not preserved');

const u1Lesson=read('units/unit-01/assets/lesson-engine.js'),u1LessonCore=read('units/unit-01/assets/lesson-engine-core.js');
must(/lesson-engine-core\.js/.test(u1Lesson)&&/lessonBestScores/.test(u1Lesson)&&/MIN=80/.test(u1Lesson),'Unit 1: rich lesson wrapper / best mastery gate missing');
must(/NAIB_KEY/.test(u1Lesson)&&/EXIT_KEY/.test(u1Lesson)&&/sequence\(\)/.test(u1Lesson),'Unit 1: lesson direct-entry NAIB/sequential guard missing');
must(/renderFactorLab/.test(u1LessonCore)&&/renderNumberInspector/.test(u1LessonCore),'Unit 1: rich instructional lesson core was not preserved');
const u1Dash=read('units/unit-01/assets/unit-dashboard.js'),u1DashCore=read('units/unit-01/assets/unit-dashboard-core.js');
must(/unit-dashboard-core\.js/.test(u1Dash)&&/Prior lesson requires/.test(u1Dash),'Unit 1: dashboard sequential lesson wrapper missing');
must(/NAIB_KEY/.test(u1Dash)&&/EXIT_KEY/.test(u1Dash),'Unit 1: dashboard direct-entry NAIB guard missing');
must(/unitIsMastered/.test(u1DashCore)&&/data-mastery-gate/.test(u1DashCore),'Unit 1: original unit mastery gate core was not preserved');

for(let n=2;n<=13;n++){
  const id=String(n).padStart(2,'0'),le=read(`units/unit-${id}/assets/lesson-engine.js`),leCore=read(`units/unit-${id}/assets/lesson-engine-core.js`),dash=read(`units/unit-${id}/assets/unit-dashboard.js`),dashCore=read(`units/unit-${id}/assets/unit-dashboard-core.js`);
  must(/lesson-engine-core\.js/.test(le)&&/unitMastered\(unitNo-1\)/.test(le),`Unit ${n}: direct-entry previous-unit lesson guard missing`);
  must(/lessonBest/.test(le)&&/(?:idx|i)>0/.test(le)&&/prior/.test(le)&&/requires at least 80% mastery before this lesson begins/.test(le),`Unit ${n}: direct-entry prior-lesson guard missing`);
  must(!/percent\s*>=\s*70|>=\s*70/.test(leCore),`Unit ${n}: legacy 70% threshold found in lesson core`);
  must(/MIN=Math\.max\(80/.test(leCore),`Unit ${n}: hardened 80% lesson core missing`);
  must(/lessonBestScores/.test(leCore)&&/lessonAttempts/.test(leCore),`Unit ${n}: best-score attempt history missing`);
  must(/aria-disabled/.test(leCore)&&/renderNavigation/.test(leCore),`Unit ${n}: sequential next-lesson gate missing`);
  must(/unit-dashboard-core\.js/.test(dash)&&/previousUnitMastered/.test(dash),`Unit ${n}: dashboard previous-unit direct-entry gate missing`);
  must(/Prior lesson requires 80%/.test(dashCore),`Unit ${n}: dashboard sequential lesson gate missing`);
  must(/data-review/.test(dashCore)&&!/data-complete/.test(dashCore),`Unit ${n}: dashboard review/mastery separation missing`);
  must(/allLessons\(\)/.test(dashCore)&&/assessment\/mastery-check\.html/.test(dashCore),`Unit ${n}: unit assessment link must remain locked until all lessons reach mastery`);
}
for(let n=1;n<=13;n++){
  const id=String(n).padStart(2,'0'),ae=read(`units/unit-${id}/assets/assessment-engine.js`);
  must(/best_percent/.test(ae)&&/attempts/.test(ae),`Unit ${n}: mastery assessment attempt history/best mastery missing`);
  must(/MIN=80/.test(ae),`Unit ${n}: mastery assessment wrapper must enforce 80%`);
  must(/lessonGate\(\)/.test(ae)&&/Every required lesson must reach at least 80% mastery first/.test(ae),`Unit ${n}: direct mastery-check lesson prerequisite guard missing`);
  must(/entranceGate\(\)/.test(ae),`Unit ${n}: direct mastery-check unit-entry guard missing`);
}
if(failures.length){console.error('\nPRE-ALGEBRA MASTERY GATE VALIDATION FAILED');for(const f of failures)console.error(' - '+f);process.exit(1)}
console.log('OK Pre-Algebra Academy Mastery Contract');
console.log(' - readiness assessment is pre-course and non-week');
console.log(' - official route: 36 weeks');
console.log(' - NAIB refresher route: 6 + 36 = 42 weeks');
console.log(' - lesson, weekly quiz, unit, and Unit 0 exit gates: 80%');
console.log(' - reviewed is separate from mastered');
console.log(' - best demonstrated mastery and attempt history preserved');
console.log(' - direct lesson, unit, and mastery-check URLs fail closed when prerequisites are unmet');
