#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";
const p="courses/physical-education/grade-12-instruction.json";
const data=JSON.parse(fs.readFileSync(p,"utf8"));
assert.equal(data.schema,"khae-pe-grade12-instruction-v1");
assert.equal(data.grade,12);
assert.equal(data.masteryThreshold,80);
assert.equal(data.weeks.length,36);
assert.equal(data.bankQuality?.version,"grade12-diverse-assessment-bank-v2");
assert.equal(data.bankQuality?.weeklyItems,25);
assert.equal(data.bankQuality?.totalItems,900);

const strands=["evidence","safety","planning","data","access"];
const legacy=/^(Which evidence practice is strongest\?|Which safety decision is strongest\?|Which planning decision is strongest\?|Which data interpretation is strongest\?|Which independence decision is strongest\?)/i;
const ids=new Set(),prompts=new Set(),answerPos=[0,0,0,0],starts=new Set(),all=[];
for(const w of data.weeks){
 assert.equal(w.checks.length,25,"Week "+w.week+" must expose 25 assessment items");
 assert.equal(w.assessmentDesign,"senior-diverse-25-v2","Week "+w.week+" missing assessment design marker");
 const counts=Object.fromEntries(strands.map(s=>[s,0]));
 const types=new Set();
 for(const q of w.checks){
  assert.ok(q.id&&typeof q.id==="string","Week "+w.week+" missing item id");
  assert.ok(!ids.has(q.id),"Duplicate item id "+q.id); ids.add(q.id);
  assert.ok(q.prompt&&q.prompt.length>=80,q.id+" prompt is too thin");
  assert.ok(!legacy.test(q.prompt),q.id+" still uses a legacy repeated stem");
  assert.ok(!prompts.has(q.prompt.toLowerCase()),q.id+" duplicates another prompt"); prompts.add(q.prompt.toLowerCase());
  assert.ok(strands.includes(q.strand),q.id+" invalid strand"); counts[q.strand]++;
  assert.ok(q.itemType&&typeof q.itemType==="string",q.id+" missing itemType"); types.add(q.itemType);
  assert.ok(q.misconceptionCode&&typeof q.misconceptionCode==="string",q.id+" missing misconception code");
  assert.ok(Array.isArray(q.options)&&q.options.length===4,q.id+" must have four options");
  assert.equal(new Set(q.options.map(x=>String(x).trim().toLowerCase())).size,4,q.id+" has duplicate options");
  assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4,q.id+" invalid answer index");
  answerPos[q.correct]++;
  assert.ok(q.rationale&&q.rationale.length>=120,q.id+" rationale is too thin");
  starts.add(q.prompt.slice(0,55).toLowerCase());
  all.push(q);
 }
 for(const s of strands)assert.equal(counts[s],5,"Week "+w.week+" must have five "+s+" items");
 assert.equal(types.size,25,"Week "+w.week+" must have 25 distinct item types");
}
assert.equal(ids.size,900);
assert.equal(prompts.size,900);
assert.ok(starts.size>=24,"Opening-pattern diversity too low: "+starts.size);
assert.ok(Math.max(...answerPos)-Math.min(...answerPos)<=30,"Answer positions are imbalanced: "+answerPos.join("/"));
assert.equal(data.retentionPolicy.week1,"20 current");
assert.equal(data.retentionPolicy.weeks2to36,"15 current + 5 delayed retrieval");
console.log("PASS: Grade 12 PE assessment diversity");
console.log("36 weeks · 900 unique items · 25/week · 5 strands × 5 item types · answer positions "+answerPos.join("/")+" · opening patterns "+starts.size);
