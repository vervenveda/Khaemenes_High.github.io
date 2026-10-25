import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const base=path.resolve(import.meta.dirname,"..");
const read=rel=>fs.readFileSync(path.join(base,rel),"utf8");

const authoritySrc=read("assets/mastery-authority-v1.js");
const examEngine=read("assets/exam-engine.js");
const recordEngine=read("assets/record-engine.js");

for(const marker of [
  'version:"1.4"',
  "function validEvaluatorReview(attempt)",
  'schema==="khaemenes-algebra1-evaluator-review-v1"',
  "review?.attestation===true",
  "name.length>=2",
  "note.length>=12",
  "id.length>=8",
  "REVIEW_ROLES.has(role)",
  "Number.isFinite(reviewedAt)",
  "rejected_unstructured_review_attempts"
]) assert.ok(authoritySrc.includes(marker),"mastery authority missing "+marker);

for(const marker of [
  "reviewerName",
  "reviewerRole",
  "reviewerNote",
  "reviewerAttestation",
  'schema:"khaemenes-algebra1-evaluator-review-v1"',
  "review_id:reviewId",
  "reviewer_name:reviewerName",
  "reviewer_role:reviewerRole",
  "reviewer_note:reviewerNote",
  "attestation:true",
  "identity_authenticated:false"
]) assert.ok(examEngine.includes(marker),"exam evaluator UI/runtime missing "+marker);

for(const marker of [
  "structured evaluator review v1 + attestation + reviewer identity",
  "rejected_unstructured_review_attempts",
  "cumulative_structured_evaluator_review_required:true",
  'cumulative_evaluator_review_schema:"khaemenes-algebra1-evaluator-review-v1"'
]) assert.ok(recordEngine.includes(marker),"completion record contract missing "+marker);

const store={};
const context={
 window:{},
 localStorage:{getItem:key=>store[key]??null}
};
vm.createContext(context);
vm.runInContext(authoritySrc,context,{filename:"mastery-authority-v1.js"});
const A=context.window.KhaemenesAlgebra1MasteryAuthority;
assert.equal(A.version,"1.4","authority version drift");
assert.equal(typeof A.validEvaluatorReview,"function","authority must expose review validator");

const key=A.keys.midterm;
const bare={
 id:"KH-MATH-A1-MIDTERM-U01-U06",
 mastery:true,
 overall_percent:92,
 legacy_selected_only:false,
 constructed_response:{review_complete:true}
};
store[key]=JSON.stringify({attempt_history:[bare]});
assert.equal(A.midtermMastered(),false,"bare review_complete boolean must not unlock Midterm mastery");
assert.equal(A.midtermEvidence().rejected_unstructured_review_attempts,1,"bare review should be counted as rejected");

const malformed={
 ...bare,
 evaluator_review:{
  schema:"khaemenes-algebra1-evaluator-review-v1",
  review_id:"review-12345",
  reviewer_name:"A",
  reviewer_role:"teacher",
  reviewer_note:"Too short",
  attestation:true,
  review_complete:true,
  reviewed_at:"2026-10-25T16:00:00.000Z"
 }
};
store[key]=JSON.stringify({attempt_history:[malformed]});
assert.equal(A.midtermMastered(),false,"incomplete reviewer identity/note must fail closed");

const valid={
 ...bare,
 evaluator_review:{
  schema:"khaemenes-algebra1-evaluator-review-v1",
  review_id:"a1-review-test-001",
  reviewer_name:"Jordan Reviewer",
  reviewer_role:"parent-guardian",
  reviewer_note:"Reviewed all written reasoning and discussed corrections.",
  attestation:true,
  review_complete:true,
  reviewed_at:"2026-10-25T16:00:00.000Z",
  authoritative:false,
  identity_authenticated:false,
  digitally_signed:false
 }
};
store[key]=JSON.stringify({attempt_history:[bare,valid]});
assert.equal(A.midtermMastered(),true,"valid structured evaluator review must unlock Midterm mastery");
assert.equal(A.midtermEvidence().best,92,"valid structured review score must be authoritative cumulative best");
assert.equal(A.midtermEvidence().reviewed_mastery_attempts,1,"only the structured reviewed mastery attempt should count");
assert.equal(A.midtermEvidence().rejected_unstructured_review_attempts,1,"legacy/bare reviewed attempt must remain rejected history");

const finalKey=A.keys.final;
store[finalKey]=JSON.stringify({attempt_history:[{...valid,id:"KH-MATH-A1-FINAL-36W",overall_percent:94}]});
assert.equal(A.finalMastered(),true,"Final mastery must accept the same structured reviewer contract");

console.log("PASS cumulative review authority: boolean-only review is rejected; structured reviewer identity, role, note, attestation, review ID, and timestamp are required");
