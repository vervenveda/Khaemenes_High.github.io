"use strict";
/* Synthetic English 9 weekly evidence writers; run with:
 * node --test courses/tests/english9-weeks02-36-retention.test.cjs
 * No actual student records or browsers are used.
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const weekPath=n=>"language-arts/english-9/assets/week"+String(n).padStart(2,"0")+"-daily.js";
for(let n=2;n<=13;n++){
 const code=read(weekPath(n));
 test("Week "+n+" requires learner-family linkage, no tab conflict and verified write",()=>{
  assert.ok(code.includes('localStorage.getItem("khaemenes_active_learner_v1")!==identity'));
  assert.ok(code.includes('localStorage.getItem("khaemenes_active_family_v1")'));
  assert.ok(code.includes('family.learnerIds.includes(profile.learnerId)'));
  assert.ok(code.includes('window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId'));
  assert.ok(code.includes("localStorage.getItem(key)!=="));
  assert.ok(code.includes("browser write could not be verified")||code.includes("Browser write could not be verified."));
  assert.ok(code.includes('"khaemenes_active_family_v1","khaemenes_family_registry_v1"].includes('));
 });
}
test("Weeks 14–36 use a common writer with readback and conflict detection",()=>{
 const code=read("language-arts/english-9/assets/course.js");
 assert.ok(code.includes('if(localStorage.getItem(courseKey)!==lastStoredProgress)'));
 assert.ok(code.includes('if(localStorage.getItem(courseKey)!==encoded)'));
 assert.ok(code.includes('if(!save(progress)){progress[key]=previous;return}'));
 assert.ok(code.includes('if(localStorage.getItem(key)!==value)'));
});
test("synthetic Week 02 save confirms written work and rejects a no-op storage implementation",()=>{
 const code=read(weekPath(2));
 const writer=code.slice(code.indexOf("function write(key,value){"),code.indexOf("function validProgress(obj)"));
 assert.ok(writer.startsWith("function write(key,value){"));
 const state=new Map([
  ["khaemenes_active_learner_v1",JSON.stringify("learner-a")],
  ["khaemenes_active_family_v1",JSON.stringify("family-a")],
  ["khaemenes_family_registry_v1",JSON.stringify({families:{"family-a":{familyId:"family-a",learnerIds:["learner-a"]}},learners:{"learner-a":{learnerId:"learner-a",familyId:"family-a"}}})]
 ]);
 const notices=[];
 const storage={getItem:k=>state.get(k)??null,setItem:(k,v)=>state.set(k,v)};
 const contract={readAcademyProfile:()=>({learnerId:"learner-a"})};
 const execute=store=>{
  const context={localStorage:store,window:{KhaemenesCourseEntryContract:contract},identity:JSON.stringify("learner-a"),profile:{learnerId:"learner-a"},frozen:false,ready:true,snapshot:new Map([["field",null]]),report:m=>notices.push(m),freeze:m=>notices.push(m),Date,JSON};
  return vm.runInNewContext(writer+';write("field","saved-writing")',context);
 };
 assert.equal(execute(storage),true);
 assert.equal(state.get("field"),"saved-writing");
 assert.equal(execute({getItem:storage.getItem,setItem(){}}),false);
});
test("synthetic Week 02 save rejects sibling switching before writing",()=>{
 const code=read(weekPath(2)),writer=code.slice(code.indexOf("function write(key,value){"),code.indexOf("function validProgress(obj)"));
 const store=new Map([
  ["khaemenes_active_learner_v1",JSON.stringify("learner-b")],
  ["khaemenes_active_family_v1",JSON.stringify("family-a")],
  ["khaemenes_family_registry_v1",JSON.stringify({families:{"family-a":{familyId:"family-a",learnerIds:["learner-a","learner-b"]}},learners:{"learner-a":{learnerId:"learner-a",familyId:"family-a"}}})]
 ]);
 const context={localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},window:{KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:"learner-b"})}},identity:JSON.stringify("learner-a"),profile:{learnerId:"learner-a"},frozen:false,ready:true,snapshot:new Map([["field",null]]),freeze(){},report(){},Date,JSON};
 assert.equal(vm.runInNewContext(writer+';write("field","wrong-child")',context),false);
 assert.equal(store.has("field"),false);
});
