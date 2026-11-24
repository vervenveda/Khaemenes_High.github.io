// Khaemenes Social Studies Week 02 curriculum-specific integration guard.
// Source-only checks; no learner grade, assessment or state mutation.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(p,"utf8");
const js=read("courses/shared/social-studies-lesson-engine-v0.1.js");
const list=[
 ["9","courses/social-studies/grade-09/weeks/week-02/student-packet.html",["Monday · Location, Scale, and the Geographic Question","Tuesday · Map Projections Are Purposeful Tradeoffs","Wednesday · Settlement, Migration, and Pattern Evidence","Thursday · Environment, Choice, and Geographic Determinism","Friday · Mastery Lab — Read the World Critically"]],
 ["10","courses/social-studies/grade-10/week-02/student-packet.html",["Monday · Frame the Inquiry","Tuesday · Source, Contextualize, and Corroborate","Wednesday · Map, Measure, and Model","Thursday · Deliberate and Write","Friday · Synthesize, Assess, and Correct"]],
 ["10","courses/social-studies/grade-10/weeks/week-02/student-packet.html",["Monday · Frame the Inquiry","Tuesday · Source, Contextualize, and Corroborate","Wednesday · Map, Measure, and Model","Thursday · Deliberate and Write","Friday · Synthesize, Assess, and Correct"]],
 ["11","courses/social-studies/grade-11/weeks/week-02/student-packet.html",["Monday · Frame the Inquiry","Tuesday · Source, Case, or Contract Laboratory","Wednesday · Model, Measure, and Test","Thursday · Argument, Deliberation, and Policy","Friday · Assess, Correct, and Transfer"]],
 ["12","courses/social-studies/grade-12/weeks/week-02/student-packet.html",["Monday · Concept and Inquiry Laboratory","Tuesday · Primary and Authoritative Source Laboratory","Wednesday · Comparative Data and Case Laboratory","Thursday · Argument, Seminar, and Performance Studio","Friday · Mastery, Correction, and Capstone Checkpoint"]]
];
for(const [grade,path,headings] of list){
 const html=read(path);
 assert.ok(html.includes('data-social-studies-engine="'+grade+'"'),path+" missing opt-in");
 assert.ok(html.includes("social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5"),path+" old engine URL");
 assert.equal(headings.length,5,"Expected five original weekday activities");
 for(const heading of headings){
  assert.ok(html.includes(">"+heading+"</h3>"),path+" missing original lesson: "+heading);
  assert.ok(js.includes(heading),"Missing engine mapping: "+heading);
 }
 assert.ok(html.includes("high-school-formative-evidence-v1.js"),"Existing formative evidence owner removed: "+path);
}
assert.ok(js.includes('const week02=weekNumber===2'),"Week 02 context guard absent");
assert.ok(js.includes('const isGrade9Workspace=grade==="9"&&!demo&&!week02&&!week03&&!laterWeek;'),"Week 01 Grade 09 native controls not isolated");
assert.ok(js.includes('if(targets&&(!targets.length||targets.some(x=>!x)||new Set(targets).size!==5))return false'),"Missing fail-open and five-target uniqueness behavior");
assert.ok(js.includes('heading?.closest("article.lesson,section.card,article")'),"Must navigate the original lesson rather than redraw it");
for(const forbidden of ["localStorage","sessionStorage","indexedDB","fetch(","XMLHttpRequest","document.cookie"]){
 assert.ok(!js.includes(forbidden),"Unexpected new engine persistence: "+forbidden);
}
const sandbox={window:{},document:{readyState:"loading",addEventListener:()=>{}}};
vm.runInNewContext(js,sandbox);
const api=sandbox.window.KhaemenesSocialStudiesLessonEngineV01;
assert.ok(api&&api.curriculum,"All-four-grade engine missing");
assert.ok(js.includes("Geography and Human Systems")&&js.includes("Map Projections"),"Grade 9 Week 02 geography specialization missing");
assert.ok(js.includes("Indigenous Nations, Atlantic Encounters")&&js.includes("Native diplomacy"),"Grade 10 Week 02 source specialization missing");
assert.ok(js.includes("Philosophical Foundations of Government")&&js.includes("natural rights"),"Grade 11 Week 02 political philosophy specialization missing");
assert.ok(js.includes("Evidence, Methodology, and Academic Integrity")&&js.includes("Research Integrity"),"Grade 12 Week 02 research specialization missing");
console.log("PASS Social Studies Week 02: 4 canonical packets, 20 day headings, explicit curriculum guidance, no independent assessment/storage");
