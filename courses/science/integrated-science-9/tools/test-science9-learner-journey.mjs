// Source-backed learner-journey regression suite. Read-only: never touches real student records.
// Run: node courses/science/integrated-science-9/tools/test-science9-learner-journey.mjs
import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";
const root=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),"utf8");
const commonKey="kh_sci9_u04_active_learner_v1";
let tests=0;
function check(value,message){assert.ok(value,message);tests++}
function activeFromSource(src,unit,common,previous,academy){
  const start=src.indexOf("function active(){");
  const end=src.indexOf("function key(){",start);
  check(start>=0&&end>start,"Unit "+unit+" active learner implementation exists");
  const selector=src.slice(start,end).trim();
  const memory=new Map();
  if(common!==null)memory.set(commonKey,common);
  if(previous!==null)memory.set("kh_sci9_u"+unit+"_active_learner_v1",previous);
  if(unit<5&&common!==null)memory.set("kh_sci9_u04_active_learner_v1",common);
  const scope={
    ACTIVE:unit<5?commonKey:"kh_sci9_u"+unit+"_active_learner_v1",
    safeId:v=>typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null,
    sessionStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)},
    window:{KhaemenesCourseEntryContract:academy===null?undefined:{readAcademyProfile:()=>({learnerId:academy})}}
  };
  const selected=vm.runInNewContext("("+selector+")()",scope);
  return {selected,stored:memory.get(commonKey)??null};
}
for(let i=1;i<=12;i++){
 const unit=String(i).padStart(2,"0"),src=read("units/unit-"+unit+"/unit"+unit+".js");
 const common="learner_a",other="learner_b";
 check(activeFromSource(src,i,common,null,common).selected===common,"Unit "+unit+" accepts matching Academy learner");
 check(activeFromSource(src,i,common,null,other).selected===null,"Unit "+unit+" rejects conflicting Academy learner");
 check(activeFromSource(src,i,null,null,null).selected===null,"Unit "+unit+" blocks an absent learner");
 if(i>=5){
   const recovered=activeFromSource(src,i,null,other,null);
   check(recovered.selected===other&&recovered.stored===other,"Unit "+unit+" safely bridges legacy selection");
   const start=src.indexOf("function verifiedScore(item)");
   const end=src.indexOf("function done(id)",start);
   check(start>=0&&end>start,"Unit "+unit+" provides score verification");
   const verify=vm.runInNewContext("("+src.slice(start,end).trim()+")");
   for(const [item,want,label] of [
     [{passed:true,score:16,total:20},true,"80 percent pass"],
     [{passed:true,score:15,total:20},false,"75 percent fail"],
     [{passed:true,score:0,total:20},false,"zero fail"],
     [{passed:false,score:20,total:20},false,"unverified pass"],
     [{passed:true,score:21,total:20},false,"impossible score"],
     [{passed:true,score:"invalid",total:20},false,"invalid score"]
   ])check(verify(item)===want,"Unit "+unit+" "+label);
   check(src.includes("return verifiedScore(state[id])"),"Unit "+unit+" scored requirements use verification");
   check(src.includes("if(!window.KhaemenesScienceU"+unit+"Scope.active())"),"Unit "+unit+" learner-bound sync and save");
   check(src.includes('else set.delete("u'+unit+'")'),"Unit "+unit+" reverses incomplete dashboard mastery");
   check(src.includes("scienceConflict"),"Unit "+unit+" guards concurrent writes");
 }
}
console.log("PASS: "+tests+" source-backed learner isolation and mastery scenarios.");
