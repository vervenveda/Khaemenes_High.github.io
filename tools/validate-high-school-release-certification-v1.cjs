#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const matrix=JSON.parse(read("courses/shared/course-execution-matrix-v1.json"));
const cert=JSON.parse(read("courses/shared/high-school-release-certification-v1.json"));
const ownership=JSON.parse(read("courses/shared/high-school-course-ownership-manifest-v1.json"));
assert.equal(cert.schema,"khaemenes-high-release-certification-v1");
assert.equal(cert.policy.routeExistenceIsNotReleaseCertification,true);
assert.equal(cert.policy.programContract,"courses/shared/high-school-program-contract-v1.json");
assert.equal(cert.policy.runtimeCertificationMatrix,"courses/shared/high-school-runtime-certification-matrix-v1.json");
assert.equal(cert.policy.federatedReturnRecordContract,"courses/shared/high-school-federated-return-record-v1.json");
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
const expectedElectiveSurfaces=ownership.courses.filter(x=>x.family==="electives"&&x.classification!=="active-course"&&x.classification!=="active-course-compatibility-content-root");
assert(Array.isArray(cert.catalogAndFederatedSurfaces),"Catalog/federated release surface ledger missing");
assert.equal(cert.catalogAndFederatedSurfaces.length,expectedElectiveSurfaces.length,"Elective surface release ledger drift");
for(const course of expectedElectiveSurfaces){
  const row=cert.catalogAndFederatedSurfaces.find(x=>x.id===course.id);
  assert(row,"Missing catalog/federated surface row for "+course.id);
  assert.equal(row.entry,course.canonicalEntry,"Catalog/federated entry drift for "+course.id);
  assert.equal(row.classification,course.classification,"Catalog/federated classification drift for "+course.id);
  assert.equal(row.route,"pass",course.id+" catalog/federated landing route not recorded PASS");
  if(course.classification==="catalog-plan"){
    assert.equal(row.authority,"none"+(course.id==="career-professional-studies"?"-until-promotion":""),course.id+" catalog plan gained academic authority");
    assert.equal(row.surfaceState,course.curriculumStatus,course.id+" catalog surface state drift");
    assert.notEqual(row.surfaceState,"release-certified",course.id+" catalog plan falsely release-certified");
  }
  if(course.classification==="catalog-plan-federated"){
    assert.equal(row.authority,"federated",course.id+" lost federated authority boundary");
    assert.equal(row.transcriptReturn,"pending-audited-record-bridge",course.id+" falsely claims transcript return");
    assert.equal(row.surfaceState,"federated-route-present",course.id+" federated surface state drift");
  }
}
console.log("PASS explicit release-state machine covers "+cert.courses.length+" executable High School course routes plus "+cert.catalogAndFederatedSurfaces.length+" catalog/federated elective surfaces; route presence cannot masquerade as release certification.");
