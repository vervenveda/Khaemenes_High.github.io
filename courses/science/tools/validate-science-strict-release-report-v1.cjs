#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const assert=require("node:assert/strict");
const file=process.argv[2]||"high-school-science-certification.json";
const report=JSON.parse(fs.readFileSync(file,"utf8"));
assert.equal(report.schema,"khaemenes.high-school-science.department-certification.v2");
assert.equal(report.expectedDailyLessons,720,"Science denominator must remain 720 lessons");
assert.equal(report.totals?.lessons,720,"Strict science report must account for all 720 lessons");
assert.equal(report.verdict,"PASS","Strict science department verdict must be PASS");
assert.equal(report.courses?.length,4,"Strict science report must include Grades 9–12");
for(const grade of [9,10,11,12]){
  const row=report.courses.find(x=>x.grade===grade);
  assert(row,"Missing Grade "+grade+" science certification row");
  assert.equal(row.lessons,180,"Grade "+grade+" must retain 180 daily lessons");
  assert.equal(row.expected,180,"Grade "+grade+" expected lesson denominator drifted");
  assert.equal(row.sourceEvidencePass,true,"Grade "+grade+" source evidence is not certified");
}
for(const [key,value] of Object.entries(report.programCoherence||{})){
  assert.equal(value,true,"Science program coherence HOLD: "+key);
}
assert.deepEqual(report.holds,[],"Strict science report contains unresolved holds");
console.log("PASS: strict High School Science release report certifies 720/720 lessons, four course evidence rows, and all coherence gates.");
