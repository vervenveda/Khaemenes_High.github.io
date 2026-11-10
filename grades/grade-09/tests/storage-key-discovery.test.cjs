"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const discovery=require("../migration/storage-key-discovery-v1.js");
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,"../audit/account-cloud-migration-inventory-v1.json"),"utf8"));
function source(keys){
  let touches=0;
  const storage={length:keys.length,key:i=>keys[i],
    getItem(){touches++;throw Error("values must never be read")},
    setItem(){touches++;throw Error("writes prohibited")},
    removeItem(){touches++;throw Error("deletion prohibited")}};
  return {storage,touches:()=>touches};
}
const origin="https://academy.example.test";
test("discovery is explicitly invoked; requires real versioned manifest and HTTPS origin",()=>{
  const s=source(["khae.pe.v1.grade9"]);
  assert.throws(()=>discovery.inspect(s.storage,{},origin));
  assert.throws(()=>discovery.inspect(s.storage,manifest,"http://example.test"));
  assert.equal(s.touches(),0);
});
test("PE Grade 9 grade-wide and assessment keys are never auto-claimed",()=>{
  const s=source(["khae.pe.v1.grade9","khae-pe-g9-w03-days-v1","khae-pe-assessment-v1-session_03"]);
  const r=discovery.inspect(s.storage,manifest,origin);
  assert.equal(r.known_keys,3);
  assert.ok(r.known_records.every(x=>x.record_group==="pe9"&&x.ownership_status==="ambiguous-unclaimed"));
  assert.equal(r.owner_verified,false);
  assert.equal(s.touches(),0);
});
test("scoped learner suffix is merely an ownership hint",()=>{
  const s=source(["psych101_grade9_journal_v1:learner:synthetic-A","khae-ela9-progress-v1:learner:synthetic-B"]);
  const r=discovery.inspect(s.storage,manifest,origin);
  assert.ok(r.known_records.every(x=>x.ownership_status==="scoped-owner-unverified"));
  assert.equal(r.migration_ready,false);
  assert.equal(s.touches(),0);
});
test("unknown keys are counted but never included",()=>{
  const s=source(["app_api_key_secret","khaemenes_grade09_social_studies_v1:learner:synthetic-X"]);
  const r=discovery.inspect(s.storage,manifest,origin);
  assert.equal(r.unmapped_count,1);
  assert.equal(r.known_keys,1);
  assert.ok(!JSON.stringify(r).includes("app_api_key_secret"));
  assert.equal(s.touches(),0);
});
test("discovery never reads or writes browser values and does not transfer records",()=>{
  const s=source(["khaemenes-algebra1-unit01-progress-v1","khaemenes-reading-notebook-v1:english-9:unit-01:learner:synthetic-X"]);
  const r=discovery.inspect(s.storage,manifest,origin);
  assert.equal(r.known_keys,2);
  assert.equal(r.values_read,false);
  assert.equal(r.cloud_uploaded,false);
  assert.equal(s.touches(),0);
});
test("excessive storage and missing origin fail closed",()=>{
  const s={length:10001,key:()=>null};
  assert.throws(()=>discovery.inspect(s,manifest,origin),RangeError);
  assert.throws(()=>discovery.inspect(source([]).storage,manifest,""),TypeError);
});

test("targeted inventory limits details to the selected learner and redacts other learner keys",()=>{
 const s=source([
   "khae-ela9-progress-v1:learner:target-A",
   "khae-ela9-progress-v1:learner:other-B",
   "psych101_grade9_journal_v1:learner:target-A",
   "khae.pe.v1.grade9",
   "unmapped-private-key"
 ]);
 const result=discovery.inspectForLearner(s.storage,manifest,origin,"target-A");
 assert.equal(result.target_record_count,2);
 assert.equal(result.other_learner_record_count,1);
 assert.equal(result.ambiguous_record_count,1);
 assert.equal(result.unmapped_count,1);
 assert.ok(result.target_records.every(r=>r.ownership_status==="target-learner-suffix-unverified"));
 assert.ok(!JSON.stringify(result).includes("other-B"));
 assert.ok(!JSON.stringify(result).includes("unmapped-private-key"));
 assert.equal(result.backup_completed,false);
 assert.equal(result.ownership_verified,false);
 assert.equal(s.touches(),0);
});
test("targeted inventory requires an explicit learner ID",()=>{
 const s=source(["khae-ela9-progress-v1:learner:target-A"]);
 assert.throws(()=>discovery.inspectForLearner(s.storage,manifest,origin,""),TypeError);
 assert.equal(s.touches(),0);
});
