"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const exporter=require("../migration/supplementary-course-export-v1.js");
const origin="https://academy.example.test";
function source(values){const keys=Object.keys(values),seen=[];return {
 storage:{length:keys.length,key:i=>keys[i],getItem:k=>{seen.push(k);return values[k]},setItem(){throw Error("Must never write")},removeItem(){throw Error("Must never delete")}},
 reads:()=>seen.slice()
}}
test("captures only selected learner's writing, notebook, reports, science cumulative and weekly raw values",()=>{
 const suf=":learner:test-A",other=":learner:test-B";
 const values={
  ["khae-ela9-progress-v1"+suf]:'{"a":"value"}',
  ["khae-ela9-field:draft-01"+suf]:"Writing draft unchanged",
  ["khaemenes-reading-notebook-v1:english-9:unit-01"+suf]:"[{\"note\":\"test\"}]",
  ["khaemenes-book-report-v1:english-9:report-1"+suf]:"Report text",
  ["khaemenes_science_midterm_u00_06_v1"+suf]:"Midterm raw evidence",
  ["khae-grade09-integrated-science-portal-v1"+suf+"::weekly-mc::01"]:"Weekly MC state",
  ["khae-grade09-integrated-science-portal-v1"+suf+"::weekly-mc::unit11-space-v2::31"]:"Weekly MC 31",
  ["khae-ela9-progress-v1"+other]:"Other learner",
  "ELA9_36_WEEK_PORTAL_V2":"Shared dashboard"
 };
 const s=source(values),result=exporter.collect(s.storage,"test-A",origin);
 assert.equal(result.records.length,7);
 assert.equal(s.reads().length,7);
 assert.ok(result.records.every(r=>r.source_key.endsWith(suf)||r.source_key.includes(suf+"::weekly-mc")));
 assert.ok(!JSON.stringify(result).includes("Other learner"));
 assert.ok(!JSON.stringify(result).includes("Shared dashboard"));
 assert.equal(result.records.find(r=>r.record_type==="english-writing-field").raw_value,"Writing draft unchanged");
 assert.equal(result.complete_grade09_backup,false);
 assert.equal(result.owner_verified,false);
});
test("unscoped and other-learner values are never read or exported",()=>{
 const s=source({"ELA9_36_WEEK_PORTAL_V2":"Unscoped secret","khae-ela9-progress-v1":"Shared","khae-ela9-progress-v1:learner:other":"Sibling","unmapped-password":"Confidential"});
 const result=exporter.collect(s.storage,"test-A",origin);
 assert.equal(result.records.length,0);
 assert.deepEqual(s.reads(),[]);
 assert.equal(result.excluded_counts.ambiguous,2);
});
test("missing learner ID and invalid origins fail closed",()=>{
 const s=source({});
 assert.throws(()=>exporter.collect(s.storage,"",origin));
 assert.throws(()=>exporter.collect(s.storage,"test-A","http://insecure.example.test"));
});
test("failed reading one selected key aborts the entire archive",()=>{
 const s={length:2,key:i=>["khae-ela9-progress-v1:learner:test-A","khae-ela9-field:writing:learner:test-A"][i],getItem:k=>k.includes("writing")?null:"hello"};
 assert.throws(()=>exporter.collect(s,"test-A",origin),/changed/);
});
test("maximum record count and size guards abort rather than truncate exports",()=>{
 const large="x".repeat(11*1024*1024);
 const s=source({"khae-ela9-progress-v1:learner:test-A":large});
 assert.throws(()=>exporter.collect(s.storage,"test-A",origin),/exceeds 20 MiB/);
});
test("unrelated origins, other grade patterns, and PE remain outside this supplemental export",()=>{
 assert.equal(exporter.classify("khae.pe.v1.grade9","test-A"),null);
 assert.equal(exporter.classify("khaemenes-book-report-v1:english-10:report-1:learner:test-A","test-A"),null);
});
