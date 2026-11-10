"use strict";
/* Synthetic-only tests of shared records, quarantined PE and Science portfolio. */
const test=require("node:test"),assert=require("node:assert/strict");
const guard=require("../migration/legacy-shared-record-guard-v1.js");
const supplement=require("../migration/supplementary-course-export-v1.js");
const origin="https://academy.example.test";
test("English shared dashboard projects exactly selected learner without sibling data",()=>{
 const value={students:[
  {id:"student-1",academyLearnerId:"learner-A",name:"Target",progress:{weeks:{"1":{notes:{one:"test"}}},exams:{}}},
  {id:"student-2",academyLearnerId:"learner-B",name:"Sibling",progress:{weeks:{"1":{notes:{secret:"sibling confidential"}}},exams:{}}}
 ],activeId:"student-2"};
 const raw=JSON.stringify(value);let reads=0;
 const s={getItem:key=>{assert.equal(key,"ELA9_36_WEEK_PORTAL_V2");reads++;return raw}};
 const result=guard.extractEnglishDashboard(s,"learner-A");
 assert.equal(result.records.length,1);
 assert.equal(result.records[0].student_record.academyLearnerId,"learner-A");
 assert.ok(!JSON.stringify(result).includes("sibling confidential"));
 assert.ok(!JSON.stringify(result).includes("student-2"));
 assert.equal(result.ownership_verified,false);
 assert.equal(result.source_complete,false);
 assert.equal(reads,2);
});
test("English refuses name-only, missing match, duplicate ID, and mid-read changes",()=>{
 const base={students:[{id:"synthetic",name:"Display only",progress:{weeks:{}}}]};
 let raw=JSON.stringify(base),s={getItem:()=>raw};
 assert.equal(guard.extractEnglishDashboard(s,"learner-A").status,"no-verified-identity-match");
 raw=JSON.stringify({students:[
 {id:"a",academyLearnerId:"learner-A",progress:{}},
 {id:"b",academyLearnerId:"learner-A",progress:{}}
 ]});
 assert.throws(()=>guard.extractEnglishDashboard(s,"learner-A"),/Duplicate learner/);
 let n=0;
 s={getItem:()=>++n===1?JSON.stringify({students:[{id:"a",academyLearnerId:"learner-A",progress:{}}]}):"changed"};
 assert.throws(()=>guard.extractEnglishDashboard(s,"learner-A"),/changed/);
});
test("PE quarantine counts never read private record values or assign ownership",()=>{
 const keys=["khae.pe.v1.grade9","khae-pe-g9-w03-days-v1","khae-pe-assessment-v1-attempt1","sibling-private"];
 let read=0,write=0;
 const s={length:keys.length,key:i=>keys[i],getItem(){read++},setItem(){write++}};
 const result=guard.quarantinePE(s);
 assert.equal(result.matched_count,3);
 assert.equal(result.assigned_to_active_learner,false);
 assert.equal(result.ownership_verified,false);
 assert.equal(read,0);assert.equal(write,0);
 assert.ok(!JSON.stringify(result).includes("sibling-private"));
 assert.ok(!JSON.stringify(result).includes("attempt1"));
});
test("Science portfolio export matches only exact normalized learner token",()=>{
 const a="kh_sci9_formative_v1:learner-a:units/unit-04/investigation.html";
 const b="kh_sci9_formative_v1:learner-b:units/unit-04/investigation.html";
 const values={[a]:'{"schema":"khaemenes-science-formative-v1","learner":"learner-a"}',[b]:"other"};
 const keys=Object.keys(values),reads=[];
 const storage={length:keys.length,key:i=>keys[i],getItem:k=>(reads.push(k),values[k])};
 const r=supplement.collect(storage,"learner-A",origin);
 assert.equal(r.records.length,1);
 assert.equal(r.records[0].record_type,"science-formative-portfolio-raw");
 assert.equal(r.records[0].raw_value,values[a]);
 assert.deepEqual(reads,[a,a]);
 assert.equal(r.excluded_counts.ambiguous,1);
});
test("unsafe paths or invalid portfolio learner tokens are never collected",()=>{
 for(const key of [
  "kh_sci9_formative_v1:learner-a:units/unit-04/../../secrets.html",
  "kh_sci9_formative_v1:learner-a:units/unit-01/lesson.html",
  "kh_sci9_formative_v1:learner-a:units/unit-04/notes.txt"
 ])assert.equal(supplement.classify(key,"learner-A"),null);
});
