// Week 03 Social Studies source and course-ownership regression.
// No live student work, grades, mastery or assessment state touched.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(p,"utf8");
const js=read("courses/shared/social-studies-lesson-engine-v0.1.js");
const routes=[
["9","courses/social-studies/grade-09/weeks/week-03/student-packet.html",["Monday · Mobility, Adaptation, and Deep Human Time","Tuesday · Reading an Early Village Through Material Evidence","Wednesday · Independent Domestication and Agricultural Transition","Thursday · Surplus, Specialization, and Unequal Access","Friday · Agricultural Revolution Mastery Audit"]],
["10","courses/social-studies/grade-10/week-03/student-packet.html",["Monday · Frame the Inquiry","Tuesday · Source, Contextualize, and Corroborate","Wednesday · Map, Measure, and Model","Thursday · Deliberate and Write","Friday · Synthesize, Assess, and Correct"]],
["10","courses/social-studies/grade-10/weeks/week-03/student-packet.html",["Monday · Frame the Inquiry","Tuesday · Source, Contextualize, and Corroborate","Wednesday · Map, Measure, and Model","Thursday · Deliberate and Write","Friday · Synthesize, Assess, and Correct"]],
["11","courses/social-studies/grade-11/weeks/week-03/student-packet.html",["Monday · Frame the Inquiry","Tuesday · Source, Case, or Contract Laboratory","Wednesday · Model, Measure, and Test","Thursday · Argument, Deliberation, and Policy","Friday · Assess, Correct, and Transfer"]],
["12","courses/social-studies/grade-12/weeks/week-03/student-packet.html",["Monday · Concept and Inquiry Laboratory","Tuesday · Primary and Authoritative Source Laboratory","Wednesday · Comparative Data and Case Laboratory","Thursday · Argument, Seminar, and Performance Studio","Friday · Mastery, Correction, and Capstone Checkpoint"]]
];
for(const [grade,path,headings] of routes){
 const html=read(path);
 assert.ok(html.includes('data-social-studies-engine="'+grade+'"'),path+" missing grade opt-in");
 assert.ok(html.includes("social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5"),path+" wrong shared engine");
 assert.equal(headings.length,5,path+" expected five original daily lessons");
 for(const title of headings){
  assert.ok(html.includes(">"+title+"</h3>"),path+" original lesson heading absent "+title);
  assert.ok(js.includes(title),"Engine missing native Week 03 heading "+title);
 }
 assert.ok(html.includes("high-school-formative-evidence-v1.js"),path+" course-owned evidence module missing");
}
const cases=[
["Early Humanity and the Agricultural Revolution","agricultural","archaeological"],
["Revolution, Independence, and Competing Liberties","Haudenosaunee","Loyalist"],
["Declaration, Revolution, and the Articles","grievances","Confederation"],
["Power, Authority, Legitimacy, and Sovereignty","Weber","sovereignty"]
];
for(const row of cases)for(const phrase of row)assert.ok(js.toLowerCase().includes(phrase.toLowerCase()),"Week 03 curriculum map omitted "+phrase);
assert.ok(js.includes('const isGrade9Workspace=grade==="9"&&!demo&&!week02&&!week03&&!laterWeek;'),"Grade 09 Week 01 interactive native controls not preserved");
assert.ok(js.includes('const specific=week03?WEEK03[grade]:week02?WEEK02[grade]:null;'),"Week 03 must not overwrite Weeks 01–02 guidance");
assert.ok(js.includes('if(targets&&(!targets.length||targets.some(x=>!x)||new Set(targets).size!==5))return false'),"Missing fail-open on unmatched packet");
for(const banned of ["localStorage","sessionStorage","indexedDB","fetch(","XMLHttpRequest","document.cookie"]){
 assert.ok(!js.includes(banned),"New engine must not manage storage: "+banned);
}
const context={window:{},document:{readyState:"loading",addEventListener:()=>{}}};
vm.runInNewContext(js,context);
assert.equal(Object.keys(context.window.KhaemenesSocialStudiesLessonEngineV01.curriculum).length,4);
console.log("PASS Week 03 Social Studies: four canonical packet paths, 20 native lesson headings, curriculum-specific guide, preserved evidence ownership");
