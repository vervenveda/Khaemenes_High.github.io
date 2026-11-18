import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const theme=read("courses/mathematics/assets/math-assessment-workspace-v1.css");
const tools=read("courses/mathematics/assets/math-learning-tools-v2.js");
const engine=read("courses/mathematics/algebra-1/assets/exam-engine.js");
const pre=read("courses/mathematics/pre-algebra/index.html");
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
