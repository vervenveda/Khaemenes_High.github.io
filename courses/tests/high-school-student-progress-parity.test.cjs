"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"../..");
function source(relative){return fs.readFileSync(path.join(root,relative),"utf8")}
for(const grade of ["09","10","11","12"]){
 const html=source(`grades/grade-${grade}/student-profile/index.html`);
 const scripts=[...html.matchAll(/<script\\s+src="([^"]+)"/g)].map(m=>m[1]);
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
assert.match(upper,/percent!==null/);
assert.match(upper,/khaemenes-learning-continuation-ready/);
assert.match(upper,/window\.addEventListener\("storage"/);
assert.match(upper,/if\(!dialog\.open\)return/);
console.log("Four-grade Student Progress source parity PASS; actual live course publishing and browser DOM remain to be tested.");
