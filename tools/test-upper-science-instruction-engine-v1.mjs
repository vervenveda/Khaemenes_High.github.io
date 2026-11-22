import fs from "node:fs";
import assert from "node:assert/strict";

const enginePath="courses/shared/upper-science-instruction-engine-v1.js";
const pilotPath="courses/science/biology-10/weeks/week-01/lessons/day-01.html";
const engine=fs.readFileSync(enginePath,"utf8");
const pilot=fs.readFileSync(pilotPath,"utf8");

assert.ok(engine.includes('const VERSION="1.2.0"'),"Upper Science engine version missing");
for(const stage of ["Recall & Prepare","Learn & Model","Guided Reasoning","Investigate & Analyze","Check & Correct","Explain & Revise","Reflect & Transfer"]){
 assert.ok(engine.includes(stage),"Missing stage: "+stage);
}
assert.ok(engine.includes('data.scienceEngine!=="upper-science-v1"')||engine.includes('dataset.scienceEngine!=="upper-science-v1"'),"Explicit opt-in guard missing");
assert.ok(engine.includes("safetyNodes"),"Safety persistence contract missing");
assert.ok(engine.includes("visits are navigation only, not mastery"),"Navigation/mastery boundary missing");
assert.ok(engine.includes("mastery:false"),"Mastery false lifecycle signal missing");
assert.ok(engine.includes("persistence:false"),"Persistence false lifecycle signal missing");
assert.ok(engine.includes("chrome:false"),"Chrome false lifecycle signal missing");
assert.ok(engine.includes('const layout=String(document.body?.dataset.scienceLayout||"guided")'),"Science presentation mode contract missing");
assert.ok(engine.includes('layout,curriculum:inspectContract(document)'),"Curriculum lifecycle signal missing");
for(const forbidden of [
 "localStorage","sessionStorage","indexedDB","document.cookie","fetch(","XMLHttpRequest",
 "high-school-global-chrome","vnv-333-ticker","vnv-ticker-autopopulate","vnv-header-autopopulate",
 "vnv-ecosystem-toolbar","vnv-language","data-page-complete"
]){
 assert.ok(!engine.includes(forbidden),"Upper Science engine must not own "+forbidden);
}
assert.ok(pilot.includes('data-science-engine="upper-science-v1"'),"Biology 10 pilot opt-in missing");
assert.ok(pilot.includes('data-science-layout="accordion"'),"Biology 10 accordion layout opt-in missing");
assert.ok(pilot.indexOf("vnv-333-ticker.js")<pilot.indexOf("science-lesson-breadcrumb"),"333 ticker must load before breadcrumb/page content");
assert.ok(pilot.indexOf("vnv-ticker-autopopulate.js")<pilot.indexOf("science-lesson-breadcrumb"),"Auto ticker must load before breadcrumb/page content");
assert.ok(pilot.includes("science-lesson-header-mount-v1.js"),"Compact Science lesson header mount missing");
assert.ok(pilot.includes('class="science-lesson-breadcrumb"'),"Breadcrumb missing beneath shell header");
assert.ok(pilot.includes('<p class="eyebrow">Khaemenes Academy</p>'),"Khaemenes Academy must be the sole lesson eyebrow");
assert.ok(pilot.includes("<h1>Biology 10</h1>"),"Biology 10 subject title missing");
assert.ok(pilot.includes("Week 01 · Lesson 01"),"Unit/lesson identity missing");
assert.ok(pilot.includes('class="lesson-guidance-grid"'),"2x2 lesson guidance grid missing");
assert.equal((pilot.match(/class="lesson-guidance-card"/g)||[]).length,4,"Lesson guidance must contain four cards");
assert.ok((pilot.match(/<details class="lesson-accordion/g)||[]).length>=8,"Collapsed accordion lesson sections missing");
assert.ok(!pilot.includes("<details class=\"lesson-accordion\" open"),"Lesson accordions must default collapsed");
assert.ok(pilot.includes('shared/upper-science-instruction-engine-v1.js'),"Biology 10 pilot engine loader missing");
for(const label of ["Explicit science instruction","Worked example","Guided question","Independent work","Misconception check","Formative understanding check","Mentor evidence conference","Teacher guidance"]){
 assert.ok(pilot.includes(label),"Pilot curriculum section missing: "+label);
}
assert.ok(pilot.includes("Jennifer Kay Pearl"),"Pilot footer/provenance changed");
assert.ok(pilot.includes("high-school-formative-evidence-v1.js"),"Existing formative evidence bridge removed");
console.log("PASS: Upper Science Instruction Engine v1 is opt-in, fail-open, instructional-only, and Biology 10 pilot curriculum is preserved.");
