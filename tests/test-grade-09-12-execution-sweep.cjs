#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"courses/shared/grade-09-12-execution-sweep-v1.json"),"utf8"));
assert.equal(manifest.policy.mastery_floor_percent,80);
assert.equal(manifest.entries.length,24);
const seen=new Set();
for(const entry of manifest.entries){
 assert(!seen.has(entry.id),"Duplicate course: "+entry.id);seen.add(entry.id);
 assert(fs.existsSync(path.join(root,entry.entry)),"Missing route: "+entry.entry);
 const html=fs.readFileSync(path.join(root,entry.entry),"utf8");
 assert(/<title\b/i.test(html),"Missing title: "+entry.entry);
 assert(/<body\b/i.test(html),"Missing body: "+entry.entry);
 if(["precalculus-trigonometry","calculus-1"].includes(entry.id))
   assert.equal(entry.release_status,"handoff-not-certified");
}
const expectedByGrade={9:5,10:4,11:4,12:5};
for(const grade of [9,10,11,12]){
 const entries=manifest.entries.filter(x=>x.grade===grade);
 assert.equal(entries.length,expectedByGrade[grade],"Unexpected Grade "+grade+" route count");
}
assert(manifest.entries.some(x=>x.id==="physical-education-9"));
assert(manifest.entries.some(x=>x.id==="psychology-101"));
assert(manifest.entries.some(x=>x.id==="physical-education-10"));
assert(manifest.entries.some(x=>x.id==="physical-education-11"));
assert(manifest.entries.some(x=>x.id==="physical-education-12"));
assert(manifest.entries.some(x=>x.id==="senior-capstone"));
console.log("PASS 24 core/elective/placement routes across Grades 9–12; PE 9–12, Psychology, Grade 12 Capstone and handoff status preserved");
