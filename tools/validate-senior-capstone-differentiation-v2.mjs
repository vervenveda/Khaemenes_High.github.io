#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const p="courses/capstone/senior-capstone/course-map.json";
const data=JSON.parse(fs.readFileSync(p,"utf8"));
assert.equal(data.schema,"khaemenes-senior-capstone-v1");
assert.equal(data.grade,12);
assert.equal(data.weeks.length,36);
assert.equal(data.instructionArchitecture?.version,"senior-capstone-differentiated-pedagogy-v2");

const expectedCheckpoints=[9,18,24,34,35,36];
assert.deepEqual(data.weeks.filter(w=>w.evaluatorCheckpoint).map(w=>w.week),expectedCheckpoints);

const tasks=new Set(), phases=new Set(), modes=new Set();
const oldPatterns=[
  /^Define this week's decision/i,
  /^Gather or inspect the strongest evidence needed/i,
  /^Produce the central artifact for/i,
  /^Test the week's artifact against/i,
  /^Revise the artifact, score it against/i
];

for(const w of data.weeks){
  assert.equal(w.days.length,5,"Week "+w.week+" must have five instructional days");
  assert.ok(w.instructionMode,"Week "+w.week+" missing instructionMode");
  modes.add(w.instructionMode);
  assert.ok(Array.isArray(w.rubric)&&w.rubric.length===5,"Week "+w.week+" must preserve five-part rubric");
  assert.ok(typeof w.deliverable==="string"&&w.deliverable.length>40,"Week "+w.week+" deliverable missing");
  assert.ok(typeof w.sourceRequirement==="string"&&w.sourceRequirement.length>40,"Week "+w.week+" source requirement missing");
  assert.ok(typeof w.defensePrompt==="string"&&w.defensePrompt.length>30,"Week "+w.week+" defense prompt missing");
  for(const d of w.days){
    assert.ok(d.phase&&d.task&&d.evidence,"Week "+w.week+" day "+d.day+" incomplete");
    assert.ok(d.task.length>=70,"Week "+w.week+" day "+d.day+" task too thin");
    assert.ok(d.evidence.length>=20,"Week "+w.week+" day "+d.day+" evidence too thin");
    for(const rx of oldPatterns)assert.ok(!rx.test(d.task),"Week "+w.week+" day "+d.day+" still uses legacy generic template");
    const key=d.task.toLowerCase();
    assert.ok(!tasks.has(key),"Duplicate daily task at week "+w.week+" day "+d.day);
    tasks.add(key); phases.add(d.phase);
  }
}
assert.equal(tasks.size,180);
assert.ok(modes.size>=30,"Need at least 30 differentiated instructional modes; got "+modes.size);
assert.ok(phases.size>=80,"Daily phase vocabulary remains too repetitive; got "+phases.size);

const checkpoints=data.weeks.filter(w=>w.evaluatorCheckpoint);
for(const w of checkpoints){
  assert.ok(/evaluator|checkpoint|conference|defense|archive/i.test(w.days.map(d=>d.task+" "+d.evidence).join(" ")),
    "Checkpoint week "+w.week+" lacks explicit evaluator/checkpoint pedagogy");
}

const families=[
 [1,2,3],"framing/stakeholder",
 [4,5,6,7],"research",
 [8,9,10,11],"proposal/method",
 [12,24,28,29],"prototype/build",
 [13,14,15,21,22,26],"evidence/analysis",
 [16,17,19,25],"feedback/revision/testing",
 [23],"ethics/accessibility",
 [27],"production planning",
 [30],"documentation",
 [31,32,33,34],"public communication/defense",
 [35,36],"archive/transition"
];
for(let i=0;i<families.length;i+=2){
 const weeks=families[i],label=families[i+1];
 const sigs=new Set(weeks.map(n=>data.weeks[n-1].instructionMode));
 assert.ok(sigs.size>=Math.min(weeks.length,2),label+" is not differentiated");
}

console.log("PASS: Senior Capstone differentiated pedagogy");
console.log("36 weeks · 180 unique daily tasks · "+modes.size+" instructional modes · "+phases.size+" distinct phase labels · checkpoints "+expectedCheckpoints.join(","));
