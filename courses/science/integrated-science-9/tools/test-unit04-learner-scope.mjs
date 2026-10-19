import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const code=fs.readFileSync(path.join(here,"../units/unit-04/learner-scope.js"),"utf8");
function store(initial={}){
 const m=new Map(Object.entries(initial));
 return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};
}
function setup(answer="student_a",accept=false){
 const local=store({"khaemenes_science_u04_v1":JSON.stringify({quiz:{score:16,passed:true}})});
 const session=store();let reloads=0,downloads=0;
 const document={addEventListener(){},getElementById(){return null},createElement(tag){
  return {style:{},append(){},addEventListener(){},click(){if(tag==="a")downloads++},setAttribute(){},textContent:""};
 }};
 const URL={createObjectURL(){return "blob:test"},revokeObjectURL(){}};
 const window={prompt(){return answer},confirm(){return accept},alert(){},location:{reload(){reloads++}}};
 const context={window,document,localStorage:local,sessionStorage:session,URL,Blob,
   setTimeout(){},console};
 vm.runInNewContext(code,context,{filename:"learner-scope.js",timeout:2000});
 return {api:window.KhaemenesScienceU04Scope,local,session,get reloads(){return reloads},get downloads(){return downloads}};
}
const a=setup("student_a",true),b=setup("student_b",false);
assert.equal(a.api.active(),null);
assert.equal(a.api.key(),null);
assert.equal(a.api.choose(),true);
assert.equal(b.api.choose(),true);
assert.notEqual(a.api.key(),b.api.key());
assert.equal(a.api.active(),"student_a");
assert.equal(a.api.recoverLegacy(),true);
assert.equal(a.local.getItem(a.api.key()),a.local.getItem(a.api.legacyKey));
assert.equal(a.api.recoverLegacy(),false,"existing scoped record must not be overwritten");
assert.equal(a.downloads,1,"backup requested once");
assert.equal(b.api.recoverLegacy(),false,"cancel must not migrate");
assert.equal(b.local.getItem(b.api.key()),null);
assert.ok(a.local.getItem(a.api.legacyKey),"legacy record must be preserved");
const invalid=setup("bad id!",true);
assert.equal(invalid.api.choose(),false);
assert.equal(invalid.api.active(),null);
for(const [file,contract] of [
 ["quiz-app.js",{formCount:15}],
 ["assessment-app.js",{formCount:25}],
 ["cell-cycle-app.js",{literalThreshold:7}],
 ["meiosis-app.js",{literalThreshold:7}]
]){
 const src=fs.readFileSync(path.join(here,"../units/unit-04",file),"utf8");
 new vm.Script(src,{filename:file});
 assert.ok(src.includes("KhaemenesScienceU04Scope"),file+" missing scope");
 if(contract.formCount){
   assert.ok(src.includes("FORM_COUNT="+contract.formCount),file+" form count changed; review mastery threshold");
   assert.ok(src.includes("PASSING=Math.ceil(FORM_COUNT*.80)"),file+" should derive pass threshold from 80% mastery");
   assert.ok(src.includes("passed=best>=PASSING"),file+" should derive saved mastery from best score and 80% threshold");
   assert.equal(Math.ceil(contract.formCount*.80),contract.formCount===15?12:20,file+" expected 80% threshold");
 }else{
   assert.ok(src.includes("passed:bestScore>="+contract.literalThreshold),file+" missing best-score threshold");
 }
 assert.ok(src.includes("lastScore:score"),file+" missing latest-attempt record");
}
console.log("PASS: Unit 04 two-learner keys, recovery confirmation, overwrite protection, backup request, invalid ID, and scored activity contracts.");
