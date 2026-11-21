import test from 'node:test';
import assert from 'node:assert/strict';
import {GRADE09_SUBJECTS,reviewGrade09Reconciliation as review} from '../account-cloud/grade09-family-course-reconciliation.mjs';
const trusted=(other={})=>({source:'trusted-protected-runtime',verified:true,...other});
const valid=()=>({identityEvidence:trusted(),familyLinkEvidence:trusted(),gradeEvidence:trusted({grade:'09'}),
 assessmentEvidence:trusted({owner:'course-assessment-authority',learnerMatched:true}),
 cloudEvidence:trusted({commissioned:true,sessionAuthorized:true,durableReadback:true})});
test('eight Grade 9 subject slots are source-referenced, not auto-enrolled',()=>{
 assert.equal(GRADE09_SUBJECTS.length,8);
 assert.equal(GRADE09_SUBJECTS[0].courseCandidates.length,2);
 assert.deepEqual([...GRADE09_SUBJECTS[5].courseCandidates],[]);
});
test('absence of trusted learner identity fails closed',()=>{
 const x=valid();x.identityEvidence={source:'browser-localStorage',verified:true};
 assert.equal(review(x).code,'learner_identity_unverified');
});
test('family link cannot be inferred from a selected local adult',()=>{
 const x=valid();x.familyLinkEvidence=undefined;
 assert.equal(review(x).status,'HOLD');
});
test('grade 9 designation is mandatory',()=>{
 const x=valid();x.gradeEvidence.grade='10';
 assert.equal(review(x).code,'grade09_placement_unverified');
});
test('reported assessment passing score cannot substitute for matched owner evidence',()=>{
 const x=valid();x.assessmentEvidence={score:36,possible:36,reportedPassed:true};
 assert.equal(review(x).code,'assessment_attribution_unverified');
});
test('wrong owner or learner mismatch blocks assessment linkage',()=>{
 for(const field of [{owner:'user-report'}, {learnerMatched:false}]){
  const x=valid();x.assessmentEvidence=trusted({owner:'course-assessment-authority',learnerMatched:true,...field});
  assert.equal(review(x).status,'HOLD');
 }
});
test('uncommissioned cloud cannot synchronize or accept records',()=>{
 const x=valid();x.cloudEvidence.commissioned=false;
 assert.equal(review(x).code,'protected_account_cloud_unverified');
});
test('no durable readback or authorized session prevents claimed cloud sync',()=>{
 for(const field of [{sessionAuthorized:false},{durableReadback:false}]){
  const x=valid();x.cloudEvidence=trusted({commissioned:true,sessionAuthorized:true,durableReadback:true,...field});
  assert.equal(review(x).status,'HOLD');
 }
});
test('sensitive account IDs and raw records cannot be accepted by review plan',()=>{
 for(const k of ['accountId','learnerId','parentId','familyId','rawAssessment','token','studentRecord']){
  const x=valid();x[k]='private';
  assert.equal(review(x).code,'unexpected_or_sensitive_field');
 }
});
test('even all asserted witness flags only permit review, never writes or enrollment',()=>{
 const r=review(valid());
 assert.equal(r.status,'INDEPENDENT_REVIEW_REQUIRED');
 assert.equal(r.recordWrites,0);
 assert.equal(r.cloudSynced,false);
 assert.equal(r.claimEnrollment,false);
});
test('invalid arguments fail closed',()=>{
 for(const x of [null,[],undefined,'',42]) assert.equal(review(x).status,'HOLD');
});
