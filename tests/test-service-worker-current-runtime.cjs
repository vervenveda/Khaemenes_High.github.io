#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const sw=fs.readFileSync(path.join(root,"service-worker.js"),"utf8");
assert.match(sw,/khaemenes-high-v44-topology-hardening-20261123/);
for(const legacy of ["seven-class-schedule.js","upper-grade-seven-class.js"]){
  assert(!sw.includes(legacy),"legacy seven-class asset still precached: "+legacy);
}
for(const required of [
  "./courses/shared/high-school-eight-class.js",
  "./courses/shared/high-school-eight-class-views.js",
  "./grades/shared/grade09-blueprint-upper-grade.js",
  "./grades/shared/high-school-profile-grade-context.js",
  "./grades/shared/upper-grade-class-progress-dialog.js",
  "./portfolio/index.html",
  "./portfolio/portfolio-academic-report.js",
  "./portfolio/portfolio-evidence-receipts.js",
  "./portfolio/portfolio-student-record-connections.js",
  "./courses/physical-education/grade-12.html",
  "./courses/physical-education/grade-12-instruction.json",
  "./courses/capstone/senior-capstone/index.html",
  "./courses/capstone/senior-capstone/course-map.json"
]){
  assert(sw.includes(JSON.stringify(required)),"current runtime missing from precache: "+required);
  assert(fs.existsSync(path.join(root,required.replace(/^\.\//,""))),"precache target missing from repository: "+required);
}
console.log("PASS service-worker v44 topology/profile/portfolio precache contract");
