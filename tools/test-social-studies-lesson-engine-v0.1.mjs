// Curriculum-specific Social Studies engine source firewall; no learner changes.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(p,"utf8");
const jsPath="courses/shared/social-studies-lesson-engine-v0.1.js";
const pilotPath="courses/social-studies/grade-09/weeks/week-01/student-packet.html";
const demoPath="workflow/engines/social-studies/social-studies-engine-prototype-v0.1.html";
const js=read(jsPath),pilot=read(pilotPath),demo=read(demoPath);
assert.ok(pilot.includes('data-ss9-require-entry data-social-studies-engine="9"'),"Original Grade 09 readiness gate must remain authoritative");
assert.ok(pilot.includes('social-studies-lesson-engine-v0.1.js?v='),"Grade 09 pilot loader absent");
assert.ok(demo.includes('social-studies-lesson-engine-v0.1.js?v='),"Standalone workflow demo must use identical engine owner");
for(let d=1;d<=5;d++){
 assert.ok(pilot.includes('data-day-select="'+d+'"'),"Grade 09 native day button missing "+d);
 for(const phase of ["read","practice","write","check"]){
  assert.ok(pilot.includes('data-day="'+d+'" data-phase="'+phase+'"'),"Grade 09 native phase lost: "+d+"/"+phase);
 }
}
assert.ok(pilot.includes('id="source-pack"'),"Grade 09 fictional source dossier must remain");
for(const name of ["week01-workspace.js","grade09-entry-gate.js","high-school-formative-evidence-v1.js"]){
 assert.ok(pilot.includes(name),"Existing Grade 09 learner/evidence owner removed: "+name);
}
for(const forbid of ["localStorage","sessionStorage","indexedDB","fetch(","XMLHttpRequest","document.cookie","data-page-complete"]){
 assert.ok(!js.includes(forbid),"Forbidden engine capability introduced: "+forbid);
}
assert.ok(js.includes('day?.click();phase?.click()'),"Grade 09 must reuse original day-phase controls");
assert.ok(js.includes('if(isGrade9Workspace&&('),"Grade 09 must fail open if original controls absent");
assert.ok(js.includes('const demo=document.body.hasAttribute("data-social-studies-demo")'),"Prototype isolation missing");
assert.ok(js.includes('Source Analysis & Corroboration Studio'),"Source analysis tool missing");
const context={window:{},document:{readyState:"loading",addEventListener:()=>{}}};
vm.runInNewContext(js,context,{filename:"social-studies-lesson-engine-v0.1.js"});
const config=context.window.KhaemenesSocialStudiesLessonEngineV01?.curriculum;
assert.ok(config,"Curriculum owner did not register");
assert.equal(Object.keys(config).length,4,"Only the four approved courses may be exposed");
const expected={
 "9":{focus:"Historical Inquiry",must:["How We Know the Past","Corroborate"]},
 "10":{focus:"Historical Evidence",must:["History, Memory, and the American Story","Indigenous oral tradition"]},
 "11":{focus:"Constitutional Case",must:["Civic Inquiry and Constitutional Citizenship","public records"]},
 "12":{focus:"Comparative Research",must:["Senior Inquiry and the Social Sciences","UN development data"]}
};
for(const [grade,expect] of Object.entries(expected)){
 const course=config[grade];
 assert.ok(course.focus.includes(expect.focus),"Wrong specialization Grade "+grade);
 assert.equal(course.steps.length,5,"Exactly five curriculum inquiry stages Grade "+grade);
 const text=course.mission+" "+course.steps.map(x=>x.join(" ")).join(" ");
 for(const signal of expect.must)assert.ok(text.includes(signal),"Missing curriculum-specific Grade "+grade+" detail: "+signal);
}
const weekOne={
 "10":{path:"courses/social-studies/grade-10/weeks/week-01/student-packet.html",names:["Monday · Frame the Inquiry","Tuesday · Source, Contextualize, and Corroborate","Wednesday · Map, Measure, and Model","Thursday · Deliberate and Write","Friday · Synthesize, Assess, and Correct"]},
 "11":{path:"courses/social-studies/grade-11/weeks/week-01/student-packet.html",names:["Monday · Frame the Inquiry","Tuesday · Source, Case, or Contract Laboratory","Wednesday · Model, Measure, and Test","Thursday · Argument, Deliberation, and Policy","Friday · Assess, Correct, and Transfer"]},
 "12":{path:"courses/social-studies/grade-12/weeks/week-01/student-packet.html",names:["Monday · Concept and Inquiry Laboratory","Tuesday · Primary and Authoritative Source Laboratory","Wednesday · Comparative Data and Case Laboratory","Thursday · Argument, Seminar, and Performance Studio","Friday · Mastery, Correction, and Capstone Checkpoint"]}
};
for(const [grade,{path,names}] of Object.entries(weekOne)){
 assert.ok(fs.existsSync(path),"Original upper-grade packet missing: "+path);
 const html=read(path);
 assert.ok(html.includes('data-social-studies-engine="'+grade+'"'),"Grade "+grade+" packet not opted in");
 assert.ok(html.includes("social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5"),"Missing shared source on Grade "+grade);
 for(const heading of names){
  assert.ok(html.includes(">"+heading+"</h3>"),"Grade "+grade+" daily lesson anchor absent: "+heading);
  assert.ok(js.includes(heading),"Shared engine lacks Grade "+grade+" native anchor: "+heading);
 }
}
assert.ok(js.includes('heading?.closest("article.lesson,section.card,article")'),"Upper-grade adapter must target actual original instructional sections");
assert.ok(js.includes('if(targets&&(!targets.length||targets.some(x=>!x)||new Set(targets).size!==5))return false'),"Upper-grade adapter must fail open on missing, duplicate, or unrecognized five-day lesson targets");
assert.ok(pilot.includes("social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5"),"Grade 09 must refresh latest shared engine");

console.log("PASS Social Studies 9–12 Week 01 engine adapters, source-aligned day targets, Grade 09 original controls, no learner storage authority");
