#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"courses/shared/grade-09-12-execution-sweep-v1.json"),"utf8"));
assert.equal(manifest.policy.mastery_floor_percent,80);
assert.equal(manifest.entries.length,20);
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
for(const grade of [9,10,11]){
 const entries=manifest.entries.filter(x=>x.grade===grade);
 assert.equal(entries.length,3,"Missing grade "+grade+" core");
}
assert.equal(manifest.entries.filter(x=>x.grade===12).length,5,"Grade 12 must include English, Science, Social Studies, PE and Senior Capstone");
assert(manifest.entries.some(x=>x.id==="physical-education-12"));
assert(manifest.entries.some(x=>x.id==="senior-capstone"));
console.log("PASS 20 core/placement routes across Grades 9–12; Grade 12 PE/Capstone included; handoff status preserved");
