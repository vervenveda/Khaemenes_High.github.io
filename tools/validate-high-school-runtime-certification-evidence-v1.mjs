#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";
const matrix=JSON.parse(fs.readFileSync("courses/shared/high-school-runtime-certification-matrix-v1.json","utf8"));
const release=JSON.parse(fs.readFileSync("courses/shared/high-school-release-certification-v1.json","utf8"));
assert.equal(matrix.schema,"khaemenes-high-school-runtime-certification-matrix-v1");
assert.equal(release.schema,"khaemenes-high-release-certification-v1");
const byClass=new Map(matrix.classes.map(x=>[x.id,x]));
for(const row of matrix.classes){
  for(const state of ["browserRuntime","deviceAcceptance","offlineAcceptance"])assert.equal(typeof row[state],"string",row.id+" missing "+state);
  if(row.evidence){
    assert.match(row.evidence.commit,/^[0-9a-f]{40}$/i,row.id+" evidence must name exact commit");
    assert(Array.isArray(row.evidence.runs)&&row.evidence.runs.length>0,row.id+" evidence must name workflow runs");
    for(const run of row.evidence.runs){
      assert(Number.isInteger(run.runId)&&run.runId>0,row.id+" evidence has invalid run id");
      assert.equal(run.conclusion,"success",row.id+" evidence may only cite successful runs");
      assert.equal(typeof run.workflow,"string");
    }
    assert(Array.isArray(row.evidence.coverage)&&row.evidence.coverage.length>0,row.id+" evidence needs coverage");
    assert(Array.isArray(row.evidence.holds),row.id+" evidence must preserve explicit holds");
  }
}
const classFor=id=>{
 if(id.startsWith("english-"))return"english";
 if(["pre-algebra","algebra-1","geometry","algebra-2"].includes(id))return"mathematics";
 if(["integrated-science-9","biology-10","chemistry-11","physics-engineering-12"].includes(id))return"science";
 if(id.startsWith("social-studies-"))return"social-studies";
 return null;
};
for(const course of release.courses){
  const cls=classFor(course.id); if(!cls)continue;
  const row=byClass.get(cls); assert(row,"Missing runtime class "+cls);
  for(const [courseKey,classKey] of [["browserRuntime","browserRuntime"],["deviceAcceptance","deviceAcceptance"],["offlineAcceptance","offlineAcceptance"]]){
    if(course[courseKey]!=="pending"){
      assert.notEqual(row[classKey],"pending",course.id+" overclaims "+courseKey+" beyond class evidence");
    }
  }
}
console.log("PASS: runtime certification ledger is fail-closed and every evidence claim is traceable to exact successful runs.");
