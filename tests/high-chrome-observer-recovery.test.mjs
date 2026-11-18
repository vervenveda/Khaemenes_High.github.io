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

test("Friday landing fallback suppresses only post-Friday chrome on grade and course entries",()=>{
 const marker="function KHAE_FRIDAY_LANDING_ROLLBACK";
 const begin=chrome.indexOf(marker);
 const end=chrome.indexOf('(()=>{"use strict";',begin);
 assert.ok(begin>=0&&end>begin,"rollback predicate exists");
 const isLanding=new Function(chrome.slice(begin,end)+"return KHAE_FRIDAY_LANDING_ROLLBACK")();
 const yes=[
  "/Khaemenes_High.github.io/grades/grade-09/",
  "/Khaemenes_High.github.io/grades/grade-12/index.html",
  "/Khaemenes_High.github.io/courses/",
  "/Khaemenes_High.github.io/courses/mathematics/algebra-1/",
  "/Khaemenes_High.github.io/courses/language-arts/english-9/",
  "/Khaemenes_High.github.io/courses/science/integrated-science-9/",
  "/Khaemenes_High.github.io/courses/social-studies/grade-09/"
 ];
 const no=[
  "/Khaemenes_High.github.io/",
  "/Khaemenes_High.github.io/grades/grade-09/student-profile/",
  "/Khaemenes_High.github.io/courses/mathematics/algebra-1/diagnostic/",
  "/Khaemenes_High.github.io/courses/mathematics/algebra-1/units/unit-01/"
 ];
 for(const path of yes)assert.equal(isLanding(path),true,path);
 for(const path of no)assert.equal(isLanding(path),false,path);
 assert.equal((chrome.match(/if\(KHAE_FRIDAY_LANDING_ROLLBACK\(location.pathname\)\)return;/g)||[]).length,2);
});
