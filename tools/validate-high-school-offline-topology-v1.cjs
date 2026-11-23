#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const matrix=JSON.parse(read("courses/shared/course-execution-matrix-v1.json"));
const sw=read("service-worker.js");
assert(sw.includes('khaemenes-high-v44-topology-hardening-20261123'),"Service worker cache generation is stale");
const missing=[];
for(const course of matrix.courses){
  if(!sw.includes("./"+course.entry)&&!sw.includes(course.entry))missing.push(course.id+" -> "+course.entry);
}
assert.equal(missing.length,0,"Canonical course entries missing from service-worker topology cache:\n"+missing.join("\n"));
const manifest=JSON.parse(read("manifest.webmanifest"));
for(const grade of [9,10,11,12]){
  assert(manifest.shortcuts.some(x=>x.url==="./grades/grade-"+String(grade).padStart(2,"0")+"/"),"PWA manifest missing Grade "+grade+" portal shortcut");
}
console.log("PASS PWA topology cache covers all "+matrix.courses.length+" execution-matrix entries and Grades 9–12 shortcuts.");
