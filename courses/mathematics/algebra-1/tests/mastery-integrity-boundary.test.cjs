"use strict";
// Synthetic trust-boundary regression; never accesses real browser records.
// Run: node --test courses/mathematics/algebra-1/tests/mastery-integrity-boundary.test.cjs
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const script=fs.readFileSync(path.join(__dirname,"../assets/mastery-authority-v1.js"),"utf8");
function fixture(){
  const records=new Map(),win={};
  const doc={currentScript:{src:"https://example.invalid/algebra-1/assets/mastery-authority-v1.js"},
    body:{dataset:{}},head:{appendChild(){}},querySelector(){return null},createElement(){return {dataset:{}}}};
  const ctx={window:win,document:doc,location:{pathname:"/algebra-1/",href:"https://example.invalid/algebra-1/"},
    localStorage:{getItem:k=>records.get(k)||null},setTimeout(){},URL};
  vm.runInNewContext(script,ctx,{timeout:1000});
  return {records,api:win.KhaemenesAlgebra1MasteryAuthority,put:(k,v)=>records.set(k,JSON.stringify(v))};
}
test("mastery authority describes browser evidence as unverified",()=>{
  const {api}=fixture();
  assert.equal(api.evidenceTrust.authoritative,false);
  assert.equal(api.evidenceTrust.approvedForOfficialRecords,false);
  assert.equal(api.evidenceTrust.courseProgressionOnly,true);
});
test("teacher advisory queue cannot change unit, weekly, or cumulative gates",()=>{
  const f=fixture(),a=f.api;
  const initial=[a.unitMastered(1),a.lessonMastered(1,1),a.weekMastered(2),a.midtermMastered(),a.finalMastered()];
  f.put("khaemenes.evidence-review-holds.v1",[{assessmentId:"synthetic",resolved:true,authorityStatus:"unverified-browser-local-advisory"}]);
  assert.deepEqual([a.unitMastered(1),a.lessonMastered(1,1),a.weekMastered(2),a.midtermMastered(),a.finalMastered()],initial);
});
test("legacy completion indicators currently count as browser progression",()=>{
  const f=fixture(),a=f.api;
  assert.equal(a.unitMastered(1),false);
  f.put("khaemenes-algebra1-unit01-progress-v1",{completed:["mastery","u01-l01"]});
  assert.equal(a.unitMastered(1),true);
  assert.equal(a.lessonMastered(1,1),true);
  assert.equal(a.unitEvidence(1).source,"shared-progress-completed");
  assert.equal(a.evidenceTrust.approvedForOfficialRecords,false);
});
test("legacy weekly mastery flag currently counts without a numeric best score",()=>{
  const f=fixture(),a=f.api;
  f.put("khaemenes-algebra1-weekly-mastery-v2",{weeks:{"2":{attempts:[{mastery_met:true}]}}});
  assert.equal(a.weekEvidence(2).mastery,true);
  assert.equal(a.weekEvidence(2).best,null);
});
test("typed evaluator attestation remains browser-local, not verified identity",()=>{
  const f=fixture(),a=f.api;
  const attempt={mastery:true,overall_percent:90,constructed_response:{review_complete:true},
    evaluator_review:{schema:"khaemenes-algebra1-evaluator-review-v1",review_complete:true,
      attestation:true,reviewer_name:"Synthetic Reviewer",reviewer_note:"Synthetic evaluation note",
      review_id:"SYNTHETIC123",reviewer_role:"teacher",reviewed_at:"2026-11-09T12:00:00Z"}};
  f.put("khaemenes-algebra1-midterm-result-v1",{attempt_history:[attempt]});
  assert.equal(a.midtermMastered(),true);
  assert.equal(a.evidenceTrust.evaluatorIdentityAuthenticated,false);
});
