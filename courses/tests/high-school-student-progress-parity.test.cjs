"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"../..");
function source(relative){return fs.readFileSync(path.join(root,relative),"utf8")}
for(const grade of ["09","10","11","12"]){
 const html=source(`grades/grade-${grade}/student-profile/index.html`);
 const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]);
 const position=part=>scripts.findIndex(src=>src.includes(part));
 const dialog=grade==="09"?"class-progress-dialog.js":"upper-grade-class-progress-dialog.js";
 const chart="student-course-progress-bars.js";
 for(const module of ["course-entry-contract.js","high-school-course-pins.js","high-school-eight-class.js","khaemenes-learning-continuation.js","khaemenes-student-profile-v2.js",chart,dialog]){
  assert.notEqual(position(module),-1,`Grade ${grade}: missing ${module}`);
 }
 assert.ok(position("khaemenes-learning-continuation.js")<position(chart),`Grade ${grade}: continuation must load before progress`);
 assert.ok(position("khaemenes-learning-continuation.js")<position(dialog),`Grade ${grade}: continuation must load before dialog`);
 assert.ok(position("high-school-eight-class.js")<position(chart),`Grade ${grade}: catalog must load before graph`);
 assert.ok(position("khaemenes-student-profile-v2.js")<position(chart),`Grade ${grade}: learner identity must load before graph`);
 assert.ok(position(grade==="09"?"dashboard-layout.js":"grade09-blueprint-upper-grade.js")>=0,`Grade ${grade}: progress toolbar missing`);
}
const gradeNine=source("grades/shared/student-course-progress-bars.js");
const upper=source("grades/shared/upper-grade-class-progress-dialog.js");
assert.match(gradeNine,/readLearner\?\.\(learner\)/);
assert.match(upper,/readLearner\?\.\(learner\)/);
assert.match(gradeNine,/percent!==null/);
assert.match(gradeNine,/function gradeSummary\(snapshot\)/);
assert.match(gradeNine,/Math\.round\(1000\*earned\/possible\)\/10/);
assert.match(gradeNine,/Current Quiz & Test Grades/);
assert.match(gradeNine,/Grade average: not reported|Grade average: not yet available|Grade average:|Quiz\/test average:/);
assert.match(gradeNine,/Quizzes:/);
assert.match(gradeNine,/Tests:/);
assert.match(gradeNine,/grade09-progress-connection-row/);
assert.doesNotMatch(gradeNine,/localStorage\.setItem\(/);
const dialog=source("grades/grade-09/student-profile/class-progress-dialog.js");
assert.match(dialog,/grade09-checkpoints-disclosure/);
assert.match(dialog,/khaemenes-grade09-progress-refresh/);
assert.match(upper,/percent!==null/);
assert.match(upper,/khaemenes-learning-continuation-ready/);
assert.match(upper,/window\.addEventListener\("storage"/);
assert.match(upper,/if\(!dialog\.open\)return/);
console.log("Grades 09–12 Student Progress source parity PASS. Browser interaction and course publishers remain separately testable.");
