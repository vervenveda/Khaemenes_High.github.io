#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const registry=JSON.parse(read("courses/language-arts/authentic-reading-spine-v1.json"));
assert.equal(registry.schema,"khaemenes-english-authentic-reading-spine-v1");
const required=["title","author","publicationYear","genre","assignedSpan","provenance","publicDomainBasis","sourceUrl","focus","evidenceTask"];
let total=0;
for(const grade of [9,10,11,12]){
 const key="english-"+grade,rows=registry.unit01[key];
 assert.ok(Array.isArray(rows),key+" rows missing");
 assert.equal(rows.length,3,key+" must have three Unit 01 authentic readings");
 assert.deepEqual(rows.map(r=>r.week),[1,2,3],key+" must cover Weeks 1–3");
 for(const row of rows){
  total++;
  for(const field of required)assert.ok(row[field]!==undefined&&row[field]!==null&&String(row[field]).trim(),key+" week "+row.week+" missing "+field);
  assert.ok(/^https:\/\//.test(row.sourceUrl),key+" week "+row.week+" source must be https");
  assert.ok(/public domain/i.test(row.publicDomainBasis),key+" week "+row.week+" must state public-domain basis");
  assert.ok(row.evidenceTask.length>=80,key+" week "+row.week+" evidence task is too thin");
 }
 const unit="courses/language-arts/"+key+"/units/unit-01/";
 const page=read(unit+"reading-spine.html");
 const index=read(unit+"index.html");
 assert.ok(index.includes('href="reading-spine.html"'),key+" Unit 01 does not link reading spine");
 assert.ok(page.includes("The Academy microtexts remain"),key+" must preserve first-party modeling text");
 assert.ok(page.includes("creates no parallel grade, mastery gate, learner record, or assessment authority"),key+" authority boundary missing");
 const retiredChrome=["high-school-global","chrome-v2.js"].join("-");
 assert.ok(!page.includes(retiredChrome),key+" resurrects retired chrome");
 for(const row of rows){
  assert.ok(page.includes(row.title),key+" page missing "+row.title);
  assert.ok(page.includes(row.sourceUrl),key+" page missing source URL for "+row.title);
 }
}
assert.equal(total,12,"expected 12 Unit 01 authentic readings");
const levels={
  "english-9":registry.unit01["english-9"].map(x=>x.focus).join(" "),
  "english-10":registry.unit01["english-10"].map(x=>x.focus).join(" "),
  "english-11":registry.unit01["english-11"].map(x=>x.focus).join(" "),
  "english-12":registry.unit01["english-12"].map(x=>x.focus).join(" ")
};
assert.match(levels["english-9"],/observation|inference/i);
assert.match(levels["english-10"],/source version|perspective|provenance/i);
assert.match(levels["english-11"],/historical|scholarly|concept|synthesis/i);
assert.match(levels["english-12"],/satire|argument|method|falsifiability/i);
console.log("PASS: English 9–12 Unit 01 authentic reading spine — 12/12 readings, custody and progression verified.");
