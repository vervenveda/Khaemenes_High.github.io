#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const cfg=JSON.parse(read("grades/shared/high-school-profile-runtime-v2.json"));
assert.equal(cfg.schema,"khaemenes-high-profile-runtime-v2");
assert.equal(cfg.policy.canonicalMarkupBlueprint,"grades/grade-09/student-profile/index.html");
assert.equal(cfg.policy.upperGradeRuntimeOwner,"grades/shared/grade09-blueprint-upper-grade.js");
assert.equal(cfg.policy.noIndependentUpperGradeProgressionEngine,true);
assert.equal(cfg.policy.noIndependentUpperGradeLearnerIdentity,true);
for(const grade of ["09","10","11","12"]){
  const row=cfg.grades[grade],full=path.join(root,row.entry);
  assert(fs.existsSync(full),"Missing Grade "+grade+" profile entry");
  const html=fs.readFileSync(full,"utf8");
  assert(new RegExp('data-grade=["\\\']'+grade+'["\\\']').test(html),"Grade "+grade+" profile lost data-grade context");
  for(const token of cfg.forbiddenRuntimeOwners)assert(!html.includes(token),"Grade "+grade+" loads forbidden legacy runtime "+token);
  if(grade!=="09"){
    for(const token of cfg.requiredUpperGradeRuntime){
      const count=html.split(token).length-1;
      assert.equal(count,1,"Grade "+grade+" must load shared runtime exactly once: "+token+" (found "+count+")");
    }
    assert(!html.includes("KhaemenesUpperGrade09Blueprint="),"Grade "+grade+" defines an independent upper-grade runtime owner");
  }
}
const runtime=read(cfg.policy.upperGradeRuntimeOwner);
assert(runtime.includes("window.KhaemenesUpperGrade09Blueprint"),"Shared upper-grade runtime export missing");
assert(runtime.includes("KhaemenesHighProfileGradeContext"),"Shared runtime lost registered-grade authority");
assert(runtime.includes("mastery")||runtime.includes("course"),"Shared runtime no longer delegates learning authority to course records");
console.log("PASS one declared High School profile runtime owner governs Grades 10–12; Grade 09 remains the canonical markup blueprint.");
