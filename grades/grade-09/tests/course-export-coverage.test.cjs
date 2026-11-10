"use strict";
/* Source-level preservation regression tests; no learner/browser data is accessed.
 * Run from repository root: node --test grades/grade-09/tests/course-export-coverage.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"../../..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const inventory=JSON.parse(read("grades/grade-09/audit/course-export-coverage-v1.json"));
const english=read("courses/language-arts/english-9/index.html");
const englishExtras=read("courses/language-arts/english-9/assets/course.js");
const science=read("courses/science/integrated-science-9/index.html");
const pe=read("courses/physical-education/index.html");
test("English full backup and rich-artifact separate stores remain discoverable",()=>{
 assert.ok(english.includes('schema:"khaemenes-english9-backup-v3"'));
 assert.ok(english.includes("function collectStandaloneEvidence()"));
 for(const k of ["khaemenes-reading-notebook-v1:","khaemenes-book-report-v1:english-"])
   assert.ok(englishExtras.includes(k),k);
 assert.ok(inventory.courses.find(x=>x.id==="english-9").omitsOrSeparate.length>=2);
});
test("Science portal state export must not be mistaken for complete assessments",()=>{
 assert.ok(science.includes('JSON.stringify({version:1,exported:new Date().toISOString(),state}'));
 const keys=["khaemenes_science_units01_04_benchmark_v1","khaemenes_science_midterm_u00_06_v1","khaemenes_science_units05_07_benchmark_v1","khaemenes_science_units08_09_benchmark_v1","khaemenes_science_units10_12_benchmark_v1","khaemenes_science9_final_exam_v1"];
 for(const key of keys)assert.ok(science.includes(key),key);
 assert.ok(inventory.courses.find(x=>x.id==="integrated-science-9").omitsOrSeparate.some(x=>x.includes("Monte Carlo")));
});
test("PE exports all daily weeks and referenced attempt snapshots",()=>{
 assert.ok(pe.includes('Array.from({length:36},(_,i)=>[i+1,dailyRecords(i+1)])'));
 assert.ok(pe.includes('assessmentSnapshots'));
 assert.ok(pe.includes('assessmentAttempts'));
});
test("PE missing imported daily records never delete originals",()=>{
 assert.ok(pe.includes('Missing imported days never delete preserved browser evidence'));
 assert.ok(!pe.includes('else localStorage.removeItem(dailyKey(w))'));
});
test("export readiness contract remains explicitly blocked",()=>{
 assert.equal(inventory.status,"incomplete-do-not-cutover");
 assert.equal(inventory.courses.length,3);
 assert.ok(inventory.invariants.includes("no-learner-data-in-git"));
 assert.ok(inventory.releaseGates.includes("byte-identical-recovery-on-second-device"));
});
