#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const matrix=JSON.parse(read("courses/shared/course-execution-matrix-v1.json"));
const cert=JSON.parse(read("courses/shared/high-school-release-certification-v1.json"));
assert.equal(cert.schema,"khaemenes-high-release-certification-v1");
assert.equal(cert.policy.routeExistenceIsNotReleaseCertification,true);
assert.equal(cert.courses.length,matrix.courses.length,"Release certification matrix drift");
const allowed=new Set(cert.policy.orderedStates);
for(const course of matrix.courses){
  const row=cert.courses.find(x=>x.id===course.id);
  assert(row,"Missing release certification row for "+course.id);
  assert.equal(row.entry,course.entry,"Release entry drift for "+course.id);
  assert(allowed.has(row.releaseState),"Unknown release state for "+course.id);
  if(row.releaseState==="release-certified"){
    assert.equal(row.browserRuntime,"pass",course.id+" certified without browser runtime PASS");
    assert.equal(row.deviceAcceptance,"pass",course.id+" certified without device PASS");
    assert.equal(row.offlineAcceptance,"pass",course.id+" certified without offline PASS");
  }
  if(course.status==="placement-handoff")assert.notEqual(row.releaseState,"release-certified",course.id+" federated handoff cannot be locally release-certified");
}
console.log("PASS explicit release-state machine covers "+cert.courses.length+" High School course routes; route presence cannot masquerade as release certification.");
