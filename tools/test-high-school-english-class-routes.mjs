// English 9–12 instructional route and retired regulator source firewall.
// Source-only verification; no browser records or assessment authority changed.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(p,"utf8");
const exists=p=>fs.existsSync(p);
const env={window:{}};
vm.runInNewContext(read("courses/shared/high-school-eight-class.js"),env);
const first=env.window.KhaemenesHighEightClass.FIRST_STEPS;
const expected={
 "english-9":"weeks/week-01/day-01/index.html",
 "english-10":"weeks/week-01/monday/index.html",
 "english-11":"weeks/week-01/lessons/day-01.html",
 "english-12":"weeks/week-01/lessons/day-01.html"
};
for(let grade=9;grade<=12;grade++){
 const id="english-"+grade,root="courses/language-arts/"+id+"/";
 const url=new URL(first[id]);
 assert.equal(url.origin,"https://vervenveda.com");
 assert.ok(url.pathname.startsWith("/Khaemenes_High.github.io/"+root));
 assert.ok(exists(root+expected[id]),id+" first lesson missing");
 assert.ok(exists(root+"assessments/index.html"),id+" assessment index missing");
 const landing=read(root+"index.html");
 assert.ok(!landing.includes('high-school-global-chrome-v2.js'),id+" reintroduced retired page regulator");
}
for(let grade=10;grade<=12;grade++){
 const html=read("grades/grade-"+grade+"/student-profile/index.html");
 assert.ok(html.includes("english-continuation-alias-v1"),"Grade "+grade+" missing refreshed shared continuation");
 assert.ok(exists("courses/language-arts/english-"+grade+"/weeks/week-01/index.html"));
 const publisher=read("courses/shared/high-school-english-continuation.js");
 assert.ok(publisher.includes('courseId:"ela'+grade+'"'),"legacy English "+grade+" evidence identity must be preserved");
}
const manager=read("grades/shared/grade09-blueprint-upper-grade.js");
for(let grade=10;grade<=12;grade++){
 assert.ok(manager.includes('"english-'+grade+'":"ela'+grade+'"'),"English "+grade+" legacy continuation alias missing");
}
assert.ok(manager.includes('const englishCourse=/^english-(?:10|11|12)$/.test(item.id||"");'),"English same-course route confinement missing");
assert.ok(manager.includes('target.origin===home.origin&&target.pathname.startsWith(coursePath)'),"Continuation must not escape approved course path");
console.log("PASS: four English first steps and assessment indexes; old chrome removed; upper-grade continuation aliases guarded");
