#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../../..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const contract=JSON.parse(read("courses/science/high-school-science-program-contract-v2.json"));

assert.equal(contract.schema,"khaemenes.high-school-science.program-contract.v2");
assert.equal(contract.masteryFloor,80);
assert.deepEqual(contract.lessonInventory,{grades:4,lessonsPerGrade:180,total:720});
assert.equal(contract.certificationPolicy.courseSpecificCertificationIsAuthoritative,true);
assert.equal(contract.certificationPolicy.genericKeywordCoverageIsDiagnosticNotCourseCertification,true);
assert.equal(contract.certificationPolicy.protectedAssessmentWeeksMayUseDistinctIntegrityContract,true);

for(const p of Object.values(contract.canonicalDocuments)) assert(exists(p),"Missing canonical science program document: "+p);

const progression=read(contract.canonicalDocuments.progression);
for(const token of ["Grade 9","Grade 10","Grade 11","Grade 12","Required inherited competencies","Exit profile"]) assert(progression.includes(token),"Progression map missing "+token);

const retrieval=read(contract.canonicalDocuments.retrieval);
for(const token of ["Near retrieval","Unit retrieval","Semester retrieval","Prior-year retrieval","Biology 10","Chemistry 11","Physics & Engineering 12","5–10%"]) assert(retrieval.includes(token),"Retrieval map missing "+token);

const lab=read(contract.canonicalDocuments.laboratory);
for(const token of ["Level 1 — Grade 9","Level 2 — Grade 10","Level 3 — Grade 11","Level 4 — Grade 12","residual","prototype"]) assert(lab.includes(token),"Lab ladder missing "+token);

const assessment=read(contract.canonicalDocuments.assessmentRetention);
for(const token of ["5–10%","Protected midterm/final boundary","Required correction evidence","Biology 10","Chemistry 11","Physics 12"]) assert(assessment.includes(token),"Assessment retention contract missing "+token);

for(const c of contract.courses){
  assert(exists(c.releaseEvidence),"Missing course release evidence "+c.releaseEvidence);
  const release=read(c.releaseEvidence);
  assert(/180\/180|36 weeks|36\/36/i.test(release),"Release evidence lacks full inventory signal for "+c.id);
}
const expected={
 "biology-10":["integrated-science-9"],
 "chemistry-11":["integrated-science-9","biology-10"],
 "physics-engineering-12":["integrated-science-9","biology-10","chemistry-11"]
};
for(const [id,inherited] of Object.entries(expected)){
 const map=JSON.parse(read("courses/science/"+id+"/course-map.json"));
 const r=map.prior_year_retrieval;
 assert(r,id+" missing prior_year_retrieval contract");
 assert.deepEqual(r.inherited_from,inherited,id+" inherited course chain drift");
 assert.equal(r.target_public_cumulative_practice_percent,"5-10",id+" retrieval percentage drift");
 assert(Array.isArray(r.required_anchors)&&r.required_anchors.length>=7,id+" needs at least seven inherited anchors");
 assert(Array.isArray(r.checkpoint_weeks)&&r.checkpoint_weeks.includes(18)&&r.checkpoint_weeks.includes(36),id+" must include MID and FINAL checkpoints");
 assert(/changed-context transfer/i.test(r.correction_requirement),id+" correction contract lost transfer check");
 assert(/protected items\/keys must not be exposed/i.test(r.protected_assessment_boundary),id+" protected assessment boundary weakened");
}

console.log("PASS High School Science v2 coherence contract: progression, retrieval, laboratory mastery, assessment retention, and course-specific certification boundaries are bound.");
