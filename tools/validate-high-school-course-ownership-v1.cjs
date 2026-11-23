#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const manifest=JSON.parse(read("courses/shared/high-school-course-ownership-manifest-v1.json"));
const matrix=JSON.parse(read("courses/shared/course-execution-matrix-v1.json"));
const problems=[],record=(ok,msg)=>{if(!ok)problems.push(msg)};
record(manifest.schema==="khaemenes-high-school-course-ownership-v1","wrong ownership manifest schema");
record(manifest.policy?.academicAuthorityRoot==="courses/","academic authority root must remain courses/");
record(manifest.policy?.compatibilityRoutesOwnCurriculum===false,"compatibility routes must never own curriculum");
record(manifest.policy?.previewRoutesOwnCurriculum===false,"preview routes must never own curriculum");
const families=new Set(manifest.families.map(x=>x.id));
const ids=new Set(),matrixIds=new Set(matrix.courses.map(x=>x.id));
for(const c of manifest.courses){
 record(!ids.has(c.id),"duplicate manifest course "+c.id);ids.add(c.id);
 record(families.has(c.family),"unknown family for "+c.id+": "+c.family);
 record(exists(c.canonicalEntry),"canonical entry missing for "+c.id+": "+c.canonicalEntry);
 if(c.contentRoot)record(exists(c.contentRoot),"content root missing for "+c.id+": "+c.contentRoot);
 if(c.classification==="active-course"||c.classification==="active-course-compatibility-content-root"){
   record(matrixIds.has(c.id),"active executable course missing execution-matrix registration: "+c.id);
 }
 if(c.classification==="catalog-plan"){
   record(!matrixIds.has(c.id),"catalog plan falsely appears as executable matrix course: "+c.id);
   if(c.curriculumMap)record(exists(c.curriculumMap),"catalog plan curriculum map missing: "+c.id+" -> "+c.curriculumMap);
   if(c.curriculumStatus==="architecture-complete-production-pending"){
     record(c.authority==="none","curriculum-ready catalog plan gained authority early: "+c.id);
     record(c.promotionGate==="courses/electives/ELECTIVE_QUALITY_STANDARD_V1.md","catalog plan promotion gate drift: "+c.id);
   }
 }
 if(c.classification==="federated-handoff"){
   const row=matrix.courses.find(x=>x.id===c.id);
   record(row?.status==="placement-handoff","federated math handoff lost placement-handoff status: "+c.id);
 }
}
for(const route of manifest.compatibilityRoutes){
 record(exists(route.path),"compatibility route missing: "+route.path);
 record(exists(route.target),"compatibility target missing: "+route.target);
}
for(const route of manifest.previewRoutes){
 record(exists(route.path),"preview route missing: "+route.path);
 record(route.ownsCurriculum===false&&route.ownsAssessment===false,"preview route gained authority: "+route.path);
}
record(manifest.sharedTopology?.nestedLegacyClassification==="compatibility-existing-do-not-add-new-dependencies","nested shared layer must remain compatibility-only");
record(exists(manifest.sharedTopology?.readinessTemplate),"nested readiness template missing");
record(exists(manifest.sharedTopology?.assessmentAuthority),"nested assessment authority compatibility root missing");
for(const id of ["physical-education-9","psychology-101","senior-capstone"])record(ids.has(id),"ownership manifest missing "+id);
for(const id of ["physical-education-9","physical-education-10","physical-education-11","physical-education-12"])record(matrixIds.has(id),"execution matrix missing "+id);
if(problems.length){console.error("FAIL High School ownership topology ("+problems.length+")\n"+problems.join("\n"));process.exit(1)}
console.log("PASS High School ownership topology: "+manifest.courses.length+" owned course/catalog surfaces; "+matrix.courses.length+" executable matrix courses; compatibility/preview/federated boundaries preserved.");
