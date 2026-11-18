import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const theme=read("courses/mathematics/assets/math-assessment-workspace-v1.css");
const tools=read("courses/mathematics/assets/math-learning-tools-v2.js");
const engine=read("courses/mathematics/algebra-1/assets/exam-engine.js");
const pre=read("courses/mathematics/pre-algebra/index.html");
const algebraWeekly=read("courses/mathematics/algebra-1/assessments/weekly-mastery.html");
const algebraWeeklyEngine=read("courses/mathematics/algebra-1/assessments/assets/weekly-mastery-engine-v2.js");
const algebraUnitEnhancer=read("courses/mathematics/algebra-1/assets/unit-assessment-workspace-v1.js");
const focused=read("courses/mathematics/algebra-1/assets/focused-assessment-v1.js");
const algebraPages=[
 "courses/mathematics/algebra-1/diagnostic/index.html",
 "courses/mathematics/algebra-1/assessments/midterm-units-01-06.html",
 "courses/mathematics/algebra-1/assessments/final-exam-36-weeks.html"
];

test("Algebra I assessment pages share the professional worksheet theme and existing tool launcher",()=>{
 for(const path of algebraPages){
  const page=read(path);
  assert.match(page,/class="math-assessment-surface"/,path);
  assert.match(page,/math-assessment-workspace-v1\.css/,path);
  assert.match(page,/math-learning-tools-v2\.js/,path);
 }
});

test("assessment worksheet surface is one-column and preserves problem-solving room",()=>{
 assert.match(theme,/#questionHost \.question-list[\s\S]*grid-template-columns:1fr/);
 assert.match(theme,/\.math-workspace[\s\S]*min-height:145px/);
 assert.match(theme,/\.practice-layout[\s\S]*flex-direction:column/);
 assert.match(theme,/#assessmentWorkspace/);
});

test("the existing lower-left math Tools launcher is reused rather than duplicated",()=>{
 assert.match(tools,/#khae-math-tools\{position:fixed;left:14px;bottom:16px/);
 assert.match(tools,/Notepad/);
 assert.match(tools,/Calculator/);
 assert.match(tools,/Whiteboard/);
 assert.match(tools,/Graph/);
 assert.match(tools,/Formula/);
 assert.match(tools,/Help/);
 assert.doesNotMatch(tools,/new\s+MutationObserver/);
});

test("closed-book final disables formula support without removing scratch tools",()=>{
 assert.match(tools,/isClosedBookNow/);
 assert.match(tools,/Formula sheet unavailable during the closed-book final/);
 assert.match(tools,/formula\.disabled=finalNow/);
});

test("Algebra I workspaces are draft evidence but not scoring inputs",()=>{
 assert.match(engine,/data-math-work/);
 assert.match(engine,/draft\.scratch/);
 assert.match(engine,/work_snapshot:\{\.\.\.draft\.scratch\}/);
 const selected=engine.slice(engine.indexOf("function selectedResult()"),engine.indexOf("function persistAttempt"));
 assert.doesNotMatch(selected,/correct\+\+.*scratch|scratch.*correct\+\+/s);
});

test("Pre-Algebra assessment view uses the same surface and preserves work snapshots",()=>{
 assert.match(pre,/math-assessment-workspace-v1\.css/);
 assert.match(pre,/classList\.toggle\("math-assessment-surface",enabled\)/);
 assert.match(pre,/math-workspace/);
 assert.match(pre,/work_snapshot/);
 assert.match(pre,/khaemenes-math-assessment-mode/);
});

test("Pre-Algebra weekly mastery checks use a dedicated worksheet surface",()=>{
 assert.match(pre,/weeklyMasteryMode/);
 assert.match(pre,/function weeklyMasteryAssessment\(w,r\)/);
 assert.match(pre,/Start mastery check/);
 assert.match(pre,/prealgebra-weekly-mastery-draft-v1/);
 assert.match(pre,/assessmentVersion:WEEKLY_MASTERY_VERSION/);
 assert.match(pre,/weeklyMasteryMode\?"weekly"/);
 assert.match(pre,/Show your work · ungraded workspace/);
});

test("Pre-Algebra weekly mastery drafts keep stable questions, answers, and work",()=>{
 assert.match(pre,/prior\.questions\.every\(q=>sourceIds\.includes\(q\.id\)\)/);
 assert.match(pre,/draft\.answers\[String\(index\)\]/);
 assert.match(pre,/draft\.work\[String\(index\)\]/);
 assert.match(pre,/work_snapshot:\{\.\.\.\(draft\.work\|\|\{\}\)\}/);
 assert.match(pre,/r\.quiz\.draft=null/);
});

test("weekly mastery is removed from planner clutter and opened explicitly",()=>{
 assert.match(pre,/weeklyMasterySummary\(w,r\)/);
 assert.match(pre,/Open the check in the dedicated one-column assessment workspace/);
 assert.match(pre,/Return to Weekly Planner/);
});


test("Algebra I weekly mastery uses the shared one-column worksheet surface",()=>{
 assert.match(algebraWeekly,/class="math-assessment-surface"/);
 assert.match(algebraWeekly,/data-math-assessment-mode="weekly"/);
 assert.match(algebraWeekly,/math-assessment-workspace-v1\.css/);
 assert.match(algebraWeekly,/math-learning-tools-v2\.js/);
 assert.match(theme,/\.weekly-shell[\s\S]*flex-direction:column/);
 assert.match(theme,/\.weekly-side[\s\S]*position:static/);
});

test("Algebra I weekly mastery preserves ungraded problem-solving work with the draft",()=>{
 assert.match(algebraWeeklyEngine,/draft:\{answers:\{\},scratch:\{\}\}/);
 assert.match(algebraWeeklyEngine,/data-weekly-work/);
 assert.match(algebraWeeklyEngine,/math-workspace/);
 assert.match(algebraWeeklyEngine,/work_snapshot:\{\.\.\.\(r\.draft\.scratch\|\|\{\}\)\}/);
 assert.match(algebraWeeklyEngine,/r\.draft=\{answers:\{\},scratch:\{\},attempt_number:/);
});

test("all 13 Algebra I unit mastery pages use one worksheet surface and one math tools launcher",()=>{
 for(let unit=1;unit<=13;unit++){
  const id=String(unit).padStart(2,"0");
  const path=`courses/mathematics/algebra-1/units/unit-${id}/assessment/mastery-check.html`;
  const page=read(path);
  assert.match(page,/math-assessment-surface algebra1-unit-mastery/,path);
  assert.match(page,/data-math-assessment-mode="unit"/,path);
  assert.match(page,/math-assessment-workspace-v1\.css/,path);
  assert.match(page,/math-learning-tools-v2\.js/,path);
  assert.match(page,/unit-assessment-workspace-v1\.js/,path);
 }
});

test("unit mastery scratch enhancer is presentation-only and observer-free",()=>{
 assert.match(algebraUnitEnhancer,/sessionStorage/);
 assert.match(algebraUnitEnhancer,/Show your work · ungraded session workspace/);
 assert.doesNotMatch(algebraUnitEnhancer,/localStorage/);
 assert.doesNotMatch(algebraUnitEnhancer,/new\s+MutationObserver/);
 assert.doesNotMatch(algebraUnitEnhancer,/mastery_met\s*=|best\s*\[/);
});

test("focused question viewer stands down on worksheet-style mastery pages",()=>{
 assert.match(focused,/classList\?\.contains\("math-assessment-surface"\)\)return false/);
});

test("assessment theme overrides legacy 14px and 55px embedded typography",()=>{
 assert.match(theme,/html:root:root body\.math-assessment-surface\{/);
 assert.match(theme,/font-size:18px!important/);
 assert.match(theme,/html:root:root body\.math-assessment-surface :is\(\.eyebrow/);
});

