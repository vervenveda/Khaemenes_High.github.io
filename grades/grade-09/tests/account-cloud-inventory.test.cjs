"use strict";
/* Manifest-only regression checks. Never reads browser data or contacts Account Cloud.
 * Run: node --test grades/grade-09/tests/account-cloud-inventory.test.cjs
 */
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"../../..");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"grades/grade-09/audit/account-cloud-migration-inventory-v1.json"),"utf8"));
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");
test("all Grade 9 record domains are inventoried",()=>{
 const ids=new Set(manifest.groups.map(x=>x.id));
 for(const name of ["profile","math-prealgebra","math-algebra1","english9","science9","social9","psych101","pe9","elective-language","elective-other"])
   assert.ok(ids.has(name),name);
 assert.equal(ids.size,manifest.groups.length);
});
test("all inventory source files resolve under the High repository",()=>{
 for(const group of manifest.groups)
  for(const source of group.sources){
    assert.ok(!source.includes(".."),source);
    assert.ok(fs.existsSync(path.join(root,source)),source);
  }
});
test("the migration plan must be read-only and fail-closed",()=>{
 assert.equal(manifest.migrationState,"not-active");
 assert.equal(manifest.migrationContract.upload.mode,"disabled-pending-STOS-T03-commissioning");
 assert.equal(manifest.migrationContract.cutover.mode,"blocked");
 for(const rule of ["copy-before-cutover","never-delete-original-on-import","never-attribute-legacy-record-without-proof","preserve-original-raw-value-and-source-key"])
   assert.ok(manifest.invariants.includes(rule));
});
test("ambiguous PE keys and external-language handoff cannot be auto-claimed",()=>{
 assert.equal(manifest.groups.find(g=>g.id==="pe9").ownership,"ambiguous-grade-wide-keys");
 assert.equal(manifest.groups.find(g=>g.id==="elective-language").ownership,"external-repository-not-yet-audited");
 assert.ok(manifest.migrationContract.restore.requires.includes("no-destructive-overwrite"));
});
test("source contract recognizes critical record formats",()=>{
 const checks=[
 ["courses/language-arts/english-9/assets/course.js","khae-ela9-progress-v1"],
 ["courses/science/integrated-science-9/index.html","khae-grade09-integrated-science-portal-v1"],
 ["courses/social-studies/grade-09/assets/grade09-records.js","khaemenes_grade09_social_studies_v1"],
 ["electives/grades/grade-09/psych-101/assets/psych101.js","psych101_grade9_assessments_v1"],
 ["courses/physical-education/index.html","khae.pe.v1.grade"],
 ["courses/mathematics/pre-algebra/index.html","KHAE_OPEN_PREALGEBRA_FORGE_V2"],
 ["courses/mathematics/algebra-1/assets/mastery-authority-v1.js","khaemenes-algebra1-weekly-mastery-v2"],
 ["grades/grade-09/student-profile/student-course-registry.js","khaemenes-grade09-course-launches-v1"]
 ];
 for(const [file,key] of checks) assert.ok(read(file).includes(key),file+" "+key);
});
test("never write student data or secrets into the manifest",()=>{
 const raw=JSON.stringify(manifest);
 assert.ok(!/(?:token|password|private_key)\s*[:=]\s*[^",}]+/i.test(raw));
 assert.ok(!Object.hasOwn(manifest,"records"));
 assert.equal(manifest.classification,"source-contract-only-no-learner-records");
});
