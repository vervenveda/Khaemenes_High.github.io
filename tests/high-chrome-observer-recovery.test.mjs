import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source=(path)=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");
const chrome=source("assets/high-school-global-chrome-v2.js");
const publicPages=[
 "index.html",
 "grades/grade-09/index.html",
 "grades/grade-12/index.html",
 "grades/grade-09/student-profile/index.html",
 "courses/science/integrated-science-9/diagnostic/index.html",
 "courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html",
 "courses/language-arts/english-9/weeks/week-01/day-01/index.html"
];

test("shared high-school chrome mounts once and does not observe all child mutations",()=>{
 assert.match(chrome,/mountHeader\(canonicalLessonHeader\)/);
 assert.match(chrome,/mountToolbar\(\)/);
 assert.doesNotMatch(chrome,/new MutationObserver\(\(\)=>\{mountHeader/);
 assert.doesNotMatch(chrome,/new MutationObserver\(scheduleHierarchy\)/);
 assert.match(chrome,/normalizeHierarchy\(document\)/);
});

test("opt-in forensic apps are not loaded on published entry pages",()=>{
 for(const path of publicPages){
  const page=source(path);
  assert.doesNotMatch(page,/high-vnv-chrome-audit-optin\.js|vnv-chrome-forensic-probe\.js|vnv-forensic-ui-inspector\.js|unit00-chrome-forensic-probe-v3\.js|readiness-chrome-forensic-probe-v2\.js|vnv-lesson-forensic-probe\.js/i,path);
  assert.doesNotMatch(page,/id="high-vnv-chrome-audit-optin-loader"/,path);
 }
});

test("canonical header and toolbar scripts remain in place",()=>{
 assert.match(chrome,/const HEADER="vnv-header-autopopulate\.js"/);
 assert.match(chrome,/const TOOLBAR="vnv-ecosystem-toolbar\.js"/);
 assert.match(chrome,/await load\(VNV\+HEADER/);
 assert.match(chrome,/await load\(VNV\+TOOLBAR/);
});

test("learner route and assessment engine remain independent of this recovery",()=>{
 const diagnostic=source("courses/mathematics/algebra-1/diagnostic/index.html");
 assert.match(diagnostic,/id="questionHost"/);
 assert.match(diagnostic,/assets\/exam-engine\.js/);
 assert.match(diagnostic,/id="startAssessmentButton"/);
});
