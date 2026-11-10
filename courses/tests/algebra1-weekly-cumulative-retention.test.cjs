"use strict";
/* Regression: node --test courses/tests/algebra1-weekly-cumulative-retention.test.cjs */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const weekly=read("mathematics/algebra-1/assessments/assets/weekly-mastery-engine-v2.js");
const exam=read("mathematics/algebra-1/assets/exam-engine.js");
test("weekly mastery writer confirms readback and protects concurrent browser tabs",()=>{
 const snippet=weekly.match(/let expectedStoreRaw=null,storageConflict=false;[\s\S]*?(?=function weekState\()/)?.[0];
 assert.ok(snippet);
 const kv=new Map(),ls={getItem:k=>kv.get(k)??null,setItem:(k,v)=>kv.set(k,v)};
 const f=vm.runInNewContext('const STORE="weekly";'+snippet+';({write, conflict:()=>storageConflict})',{
  localStorage:ls,window:{addEventListener(){}},document:{getElementById(){return null}}
 });
 assert.equal(f.write({version:2,weeks:{"2":{best:80}}}),true);
 kv.set("weekly","changed-in-another-tab");
 assert.equal(f.write({version:2,weeks:{"2":{best:100}}}),false);
 assert.equal(f.conflict(),true);
});
test("weekly mastery refuses malformed historical storage instead of replacing it",()=>{
 const snippet=weekly.match(/let expectedStoreRaw=null,storageConflict=false;[\s\S]*?(?=function weekState\()/)?.[0];
 const ls={getItem:()=>"{not json",setItem(){throw Error("must not write")}};
 const f=vm.runInNewContext('const STORE="weekly";'+snippet+';({write, conflict:()=>storageConflict})',{
  localStorage:ls,window:{addEventListener(){}},document:{getElementById(){return null}}
 });
 assert.equal(f.conflict(),true);assert.equal(f.write({version:2,weeks:{}}),false);
});
test("cumulative exam record writer verifies write and rejects conflicting tabs",()=>{
 const helper=exam.match(/function saveEvidence\(ev\)\{[\s\S]*?\n \}/)?.[0];
 assert.ok(helper);
 function build(ls){return vm.runInNewContext('const C={result_key:"result"};let resultSnapshot=null,resultFrozen=false;'+helper+';({saveEvidence})',{localStorage:ls})}
 const state=new Map(),good=build({getItem:k=>state.get(k)??null,setItem:(k,v)=>state.set(k,v)});
 assert.equal(good.saveEvidence({attempt_history:[{id:"a"}]}),true);
 assert.equal(build({getItem:()=>"other-tab",setItem(){}}).saveEvidence({}),false);
 assert.equal(build({getItem:()=>null,setItem(){throw Error("quota")}}).saveEvidence({}),false);
});
test("midterm/final no longer show success after unsaved attempt or evaluator review",()=>{
 assert.ok(exam.includes("if(!ev){"));
 assert.ok(exam.includes("if(!saveEvidence(ev))"));
 assert.ok(exam.includes("if(idx<0){"));
 assert.ok(exam.includes("if(!saveDraft()){draft.submitted=false;return}"));
 assert.ok(exam.includes("const previous=draft;draft={answers:{}"));
});
for(const unit of ["02","03","04","05","06","07","08","09"]){
 test("Algebra I Unit "+unit+" synthesis confirms exact stored bytes",()=>{
  const src=read("mathematics/algebra-1/units/unit-"+unit+"/assets/unit"+unit+"-core.js");
  assert.ok(src.includes('if(localStorage.getItem(draftKey)!==encoded)throw Error("Synthesis write not verified")'));
 });
}
