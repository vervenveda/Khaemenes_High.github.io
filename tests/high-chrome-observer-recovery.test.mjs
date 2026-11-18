import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source=(path)=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");
const chrome=source("assets/high-school-global-chrome-v2.js");
const nav=source("assets/high-navigation-v1.js");
const publicPages=[
 "index.html",
 "grades/grade-09/index.html",
 "grades/grade-12/index.html",
 "grades/grade-09/student-profile/index.html",
 "courses/science/integrated-science-9/diagnostic/index.html",
 "courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html",
 "courses/language-arts/english-9/weeks/week-01/day-01/index.html"
];

test("minimal chrome owns only a missing header and ecosystem toolbar",()=>{
 assert.match(chrome,/minimal canonical chrome v3\.0\.0/);
 assert.match(chrome,/const HEADER="vnv-header-autopopulate\.js"/);
 assert.match(chrome,/const TOOLBAR="vnv-ecosystem-toolbar\.js"/);
 assert.match(chrome,/async function ensureHeader\(\)/);
 assert.match(chrome,/async function ensureToolbar\(\)/);
 assert.match(chrome,/replaceLegacy:false/);
});

test("minimal chrome cannot continuously mutate or scan course documents",()=>{
 assert.doesNotMatch(chrome,/new\\s+MutationObserver/);
 assert.doesNotMatch(chrome,/requestAnimationFrame/);
 assert.doesNotMatch(chrome,/setInterval/);
 assert.doesNotMatch(chrome,/getComputedStyle/);
 assert.doesNotMatch(chrome,/querySelectorAll\("\*"\)/);
 assert.doesNotMatch(chrome,/style\.setProperty/);
 assert.doesNotMatch(chrome,/\.remove\(\)/);
 assert.doesNotMatch(chrome,/main\.style\.zoom/);
});

test("minimal chrome does not own tickers, course tools, or course-specific helpers",()=>{
 assert.doesNotMatch(chrome,/vnv-333-ticker\.js/);
 assert.doesNotMatch(chrome,/vnv-ticker-autopopulate\.js/);
 assert.doesNotMatch(chrome,/high-school-class-tools-left-v1\.js/);
 assert.doesNotMatch(chrome,/geometry-presentation-unifier-v1\.js/);
 assert.doesNotMatch(chrome,/prealgebra-game-registry-bridge-v1\.js/);
 assert.doesNotMatch(chrome,/english-unified-lesson-engine-v1\.js/);
 assert.doesNotMatch(chrome,/normalizeHierarchy|enforceReadableTextFloor|installTypographyStandard/);
});

test("navigation keeps ticker ownership but has no toolbar mutation observer",()=>{
 assert.match(nav,/ensureDualTickerGuard\(\)/);
 assert.match(nav,/vnv-dual-ticker-v1\.js/);
 assert.doesNotMatch(nav,/new MutationObserver/);
 assert.match(nav,/minimal global chrome is the primary toolbar owner/);
});

test("opt-in forensic apps are not loaded on published entry pages",()=>{
 for(const path of publicPages){
  const page=source(path);
  assert.doesNotMatch(page,/high-vnv-chrome-audit-optin\.js|vnv-chrome-forensic-probe\.js|vnv-forensic-ui-inspector\.js|unit00-chrome-forensic-probe-v3\.js|readiness-chrome-forensic-probe-v2\.js|vnv-lesson-forensic-probe\.js/i,path);
  assert.doesNotMatch(page,/id="high-vnv-chrome-audit-optin-loader"/,path);
 }
});

test("learner route and assessment engine remain independent of chrome rewrite",()=>{
 const diagnostic=source("courses/mathematics/algebra-1/diagnostic/index.html");
 assert.match(diagnostic,/id="questionHost"/);
 assert.match(diagnostic,/assets\/exam-engine\.js/);
 assert.match(diagnostic,/id="startAssessmentButton"/);
});
