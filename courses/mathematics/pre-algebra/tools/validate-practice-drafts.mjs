import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const base="courses/mathematics/pre-algebra/",source=fs.readFileSync(base+"assets/prealgebra-answer-draft-v1.js","utf8");
new vm.Script(source);
for(let unit=2;unit<=13;unit++){
 const path=base+"units/unit-"+String(unit).padStart(2,"0")+"/assets/lesson-engine.js";
 const wrapper=fs.readFileSync(path,"utf8");
 new vm.Script(wrapper);
 assert.ok(wrapper.includes("prealgebra-answer-draft-v1.js"),"Unit "+unit+" lesson engine missing draft helper");
 assert.ok(wrapper.includes("loadAnswerDraft"),"Unit "+unit+" core must launch recovery after reading gate");
}
const backing=new Map([["official-mastered","88"]]);
function open(unit,id){
 const options=Array.from({length:20},()=>({options:["A","B","C","D"]}));
 let chosen={};const listeners={};
 const host={parentNode:{insertBefore(){}},querySelector(selector){
  const named=/input\[name="q(\d+)"\](?::checked|\[value="(\d+)"\])/.exec(selector);
  if(!named)return null;
  const i=Number(named[1]);
  if(selector.endsWith(":checked"))return chosen[i]===undefined?null:{value:String(chosen[i])};
  return {set checked(flag){if(flag)chosen[i]=Number(named[2]);}};
 },addEventListener:(event,fn)=>listeners[event]=fn};
 const resetListeners={};
 const notice={id:"",style:{},textContent:"",setAttribute(){}};
 const doc={
  getElementById:key=>key==="questionList"?host:key==="resetPractice"?{addEventListener:(event,fn)=>resetListeners[event]=fn}:key==="preAlgebraDraftStatus"?notice:null,
  createElement:()=>notice
 };
 const localStorage={getItem:k=>backing.get(k)||null,setItem:(k,v)=>backing.set(k,String(v)),removeItem:k=>backing.delete(k)};
 const wind={LESSON_DATA:{id,questions:options},UNIT_MAP_FALLBACK:{unit:{number:unit}},addEventListener:(name,fn)=>listeners[name]=fn};
 vm.runInNewContext(source,{document:doc,window:wind,localStorage,Date,console,Math});
 return {chosen,host,notice,listeners,resetListeners,
 select:(i,v)=>{chosen[i]=v;listeners.change({target:{matches:q=>q==='input[type="radio"]'}});}};
}
const original=open(2,"l01");
original.select(0,2);original.select(3,1);original.select(19,0);
assert.equal(backing.get("official-mastered"),"88","drafts do not modify scoring or official evidence");
const reopened=open(2,"l01");
assert.equal(reopened.chosen[0],2);
assert.equal(reopened.chosen[3],1);
assert.equal(reopened.chosen[19],0);
assert.ok(reopened.notice.textContent.includes("restored"));
const another=open(3,"l01");
assert.deepEqual(another.chosen,{},"different unit cannot inherit old drafts");
const otherLesson=open(2,"l03");
assert.deepEqual(otherLesson.chosen,{},"different lesson cannot inherit old drafts");
reopened.resetListeners.click();
assert.ok(!backing.has("khaemenes-prealgebra-lesson-draft-v1:u02:l01"),"reset removes only local unscored choices");
assert.equal(backing.get("official-mastered"),"88");
backing.set("khaemenes-prealgebra-lesson-draft-v1:u02:l02",'{"schema":1,"lesson":"l02","unit":2,"answers":[999]}');
const bad=open(2,"l02");assert.deepEqual(bad.chosen,{},"tampered or malformed draft cannot be applied");
console.log("PASS Pre-Algebra Units 02–13 draft recovery: per-lesson/per-unit keys, shuffled original option IDs, reset behavior, malformed draft rejection, official score separation.");
