"use strict";
/* High School blocking-dialog presentation + progression regression.
 * No credentials, network calls or student-record mutations.
 * Run: node tests/high-school-mastery-gate-ui.test.cjs
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
let checked=0;
function parse(label,code){assert.doesNotThrow(()=>new vm.Script(code,{filename:label}),label+" must remain syntactically valid");checked++;}
function requireGateUI(label,code,id){
 assert.ok(code.includes("#"+id+" article"),label+" must style the actual blocking dialog");
 assert.ok(code.includes("background:#f7f1e5!important"),label+" needs the approved parchment card");
 assert.match(code,/color:#(?:27302d|272b28|252b28)!important/i,label+" must use readable dark ink");
 assert.ok(code.includes("font-size:16px!important"),label+" must give controls readable font sizes");
 assert.ok(code.includes('setAttribute("role","dialog")'),label+" must announce a dialog");
 assert.ok(code.includes('setAttribute("aria-modal","true")'),label+" must announce modality");
 assert.ok(code.includes('setAttribute("aria-labelledby"'),label+" must label its title");
 assert.ok(code.includes('setAttribute("aria-describedby"'),label+" must identify its description");
 assert.ok(code.includes('?.focus()'),label+" must focus the exit action");
 assert.ok(!code.includes("background:#17251f;text-align:center"),label+" must not regress to the dark-green popup");
 checked++;
}
function runUnitGate(source,score){
 const appended=[],head=[],map={unit:{number:2}};
 const record=score===null?{}:{"khaemenes-prealgebra-u01-mastery-v2":JSON.stringify({best_percent:score})};
 const localStorage={
  get length(){return Object.keys(record).length;},
  key:i=>Object.keys(record)[i]||null,
  getItem:k=>Object.hasOwn(record,k)?record[k]:null
 };
 const node=tag=>({
  tagName:tag,id:"",attrs:{},textContent:"",innerHTML:"",
  setAttribute(k,v){this.attrs[k]=v},
  querySelector(){return {focus(){}}}
 });
 const document={
  currentScript:{src:"https://example.test/Khaemenes_High.github.io/courses/mathematics/pre-algebra/units/unit-02/assets/unit-dashboard.js"},
  body:{appendChild(x){appended.push(x)}},
  head:{appendChild(x){head.push(x)}},
  createElement:node
 };
 const context={document,window:{UNIT_MAP_FALLBACK:map},localStorage,URL,
  location:{pathname:"/Khaemenes_High.github.io/courses/mathematics/pre-algebra/units/unit-02/"},console,
  addEventListener(){}};
 vm.runInNewContext(source,context,{timeout:1000});
 return {appended,head};
}
for(let n=2;n<=13;n++){
 const unit="unit-"+String(n).padStart(2,"0");
 const dir="courses/mathematics/pre-algebra/units/"+unit+"/assets/";
 const dashboard=read(dir+"unit-dashboard.js"),lesson=read(dir+"lesson-engine.js");
 parse(unit+" dashboard",dashboard);
 parse(unit+" lesson",lesson);
 requireGateUI(unit+" dashboard",dashboard,"academyUnitGate");
 requireGateUI(unit+" lesson",lesson,"academyDirectGate");
 assert.ok(dashboard.includes("const MIN=80")&&dashboard.includes("previousUnitMastered()"),unit+" must preserve unit mastery logic");
 assert.ok(lesson.includes("const MIN=80")&&lesson.includes("unitMastered("),unit+" must preserve lesson mastery logic");
}
const u2=read("courses/mathematics/pre-algebra/units/unit-02/assets/unit-dashboard.js");
const blocked=runUnitGate(u2,79);
assert.equal(blocked.appended.length,1,"79% must show a blocking dialog");
assert.equal(blocked.appended[0].id,"academyUnitGate");
assert.equal(blocked.appended[0].attrs["aria-labelledby"],"academyUnitGateTitle");
assert.match(blocked.appended[0].innerHTML,/80% mastery/);
assert.equal(blocked.head.some(x=>x.tagName==="script"),false,"79% cannot launch learning engine");
const passed=runUnitGate(u2,80);
assert.equal(passed.appended.length,0,"80% must not show a blocking dialog");
assert.equal(passed.head.some(x=>x.tagName==="script"),true,"80% can load the original learning engine");
const missing=runUnitGate(u2,null);
assert.equal(missing.appended.length,1,"missing evidence must remain fail closed");
checked+=3;
const science=read("courses/science/integrated-science-9/assets/science9-entry-gate.js");
parse("Science 9 entrance",science);
assert.ok(science.includes('setAttribute("aria-labelledby","science9EntryTitle")'));
assert.ok(science.includes('setAttribute("aria-describedby","science9EntryDescription")'));
assert.ok(science.includes("background:#f7f1e5!important"));
assert.ok(science.includes("font:400 18px/1.65"));
assert.ok(science.includes("font:400 16px/1.4"));
assert.ok(science.includes("contract.isReady("),"Science readiness must remain evidence gated");
checked++;
// Algebra I, Algebra II and Geometry use full-page lock messages, not this modal.
// Do not change or force them into the blocking-dialog interaction model.
console.log("PASS High School mastery/entrance dialog regression: "+checked+" assertions/groups, 12 Pre-Algebra unit gates, 12 lesson gates, Science 9, 79/80/no-score boundaries.");
