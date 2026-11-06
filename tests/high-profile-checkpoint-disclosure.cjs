#!/usr/bin/env node
"use strict";
/* Source-only gate for all four High School checkpoint disclosure implementations. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const shared=read("grades/shared/student-checkpoints-disclosure.js");
const css=read("grades/shared/student-checkpoints-disclosure.css");
const upper=read("grades/shared/upper-grade-daily-focus.js");
const grade09=read("grades/grade-09/student-profile/student-daily-focus.js");
assert.match(shared,/\["09","11","12"\]/);
assert.match(shared,/if\(!node\)return/);
assert.match(shared,/document\.createElement\("details"\)/);
assert.match(shared,/support\.insertAdjacentElement\("beforebegin",host\)/);
assert.match(shared,/new MutationObserver/);
assert.match(css,/repeat\(4,minmax\(0,1fr\)\)/);
assert.match(upper,/const activities=\[/);
assert.match(upper,/index\*2\+activityIndex\+1/);
assert.match(grade09,/academics\.id="grade09AcademicCheckpoints"/);
assert.match(grade09,/80%\+ reported today/);
for(const grade of [9,10,11,12]){
 const g=String(grade).padStart(2,"0");
 const file="grades/grade-"+g+"/student-profile/index.html";
 const html=read(file);
 if(grade===10){
  assert.match(html,/grade10CheckpointsDisclosure/);
  assert.match(html,/support\.insertAdjacentElement\("beforebegin",wrapper\)/);
  assert.doesNotMatch(html,/student-checkpoints-disclosure\.js/);
 }else{
  assert.equal((html.match(/src="[^"]*student-checkpoints-disclosure\.js/g)||[]).length,1,file+" duplicate loader");
  assert.equal((html.match(/href="[^"]*student-checkpoints-disclosure\.css/g)||[]).length,1,file+" duplicate stylesheet");
  assert.ok(html.lastIndexOf("student-checkpoints-disclosure.js")>html.indexOf("student-rooms-placement.js"),file+" premature placement");
 }
 console.log("PASS Grade "+g+" — one disclosure, retained checkpoint owner, contribution positioning");
}
console.log("PASS four-grade checkpoint disclosure source contract");
