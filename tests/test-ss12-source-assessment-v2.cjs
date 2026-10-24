#!/usr/bin/env node
"use strict";
/* Grade 12 public formative QA; read-only and independent of private exam banks. */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const page=fs.readFileSync(path.join(root,"courses/social-studies/grade-12/index.html"),"utf8");
const start=page.indexOf("const APP = "),end=page.indexOf(";\n",start);
assert(start>=0&&end>start,"Embedded Grade 12 course missing");
const course=JSON.parse(page.slice(start+"const APP = ".length,end));
assert.equal(course.passingTarget,80);
assert.equal(course.weeks.length,36);
assert.match(page,/if\(draw\.unavailable\|\|!draw\.opened\|\|!qs\.length\)return alert/);
assert.match(page,/questions:\[\],storageKey:null,unavailable:true/);
const bank=course.weeks[0].quiz;
assert.equal(bank.length,10);
const positions=[0,0,0,0],skills=new Set();
for(const q of bank){
 assert.equal(q.version,2);
 assert.match(q.id,/^ss12-w01-transfer-v2-/);
 assert.equal(q.choices.length,4);
 assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
 assert(q.choices[q.answer]===q.explain,"Answer key mismatches correct response");
 assert(q.sourceType==="fictional-instructional-stimulus");
 assert(q.q.length>=90,"Question missing substantial source/case stimulus");
 skills.add(q.skill);positions[q.answer]++;
}
assert(skills.size>=6);
assert(positions.every(n=>n>=1),"Correct answers overly concentrated in one position");
console.log("PASS SS12 Week 1 transfer bank: 10 questions, "+skills.size+" cognitive skills, option positions "+positions.join(",")+", 80% gate, adapter fail-closed");
