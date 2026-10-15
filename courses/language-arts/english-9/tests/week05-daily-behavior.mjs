import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(root,"assets/week05-daily.js"),"utf8");
const assessment=fs.readFileSync(path.join(root,"assets/week05-assessment.js"),"utf8");
class El{
 constructor(){this.value="";this.textContent="";this.dataset={};this.hidden=true;this.disabled=false;this.checked=false;this.readOnly=false;this.children=[];this.listeners=new Map();this.classList={toggle(){}};this.style={};}
 addEventListener(name,fn){const a=this.listeners.get(name)||[];a.push(fn);this.listeners.set(name,a);}
 trigger(name,extra={}){for(const fn of this.listeners.get(name)||[])fn({type:name,...extra});}
 dispatchEvent(e){this.trigger(e.type);}
 setAttribute(){}
 getAttribute(k){return this.dataset[k]??"";}
 append(...xs){this.children.push(...xs);}
 prepend(...xs){this.children.unshift(...xs);}
}
function launch(day,store=new Map(),learner="A"){
 store.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const h=fs.readFileSync(path.join(root,"weeks/week-05/day-"+day+"/index.html"),"utf8");
 const lookup=new Map(),el=id=>{if(!lookup.has(id))lookup.set(id,new El());return lookup.get(id);};
 const fields=[...h.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const f=new El();f.dataset.saveField=m[1];return f;});
 const picks=[];
 const document={
  body:{getAttribute:()=>String(day),append(){}},
  getElementById:el,
  querySelectorAll:sel=>{
   if(sel==='[data-save-field][data-managed-save="week5"]')return fields;
   if(sel==='[data-workshop-part]')return el("studio").children;
   return [];
  },
  querySelector:sel=>{
   const m=sel.match(/input\[name="w5q-(\d+)"\]:checked/);
   return m&&picks[Number(m[1])]!==undefined?{value:String(picks[Number(m[1])])}:null;
  },
  createElement:()=>new El(),createTextNode:t=>({textContent:t})
 };
 const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>learner?{learnerId:learner}:null,readJSON:()=>({}),isReady:()=>!!learner,
  scopedKey:(key,p)=>key+":learner:"+p.learnerId
 },addEventListener(){}};
 if(day<25){
  const data=h.match(/id="week5-question-data">([\s\S]*?)<\/script>/);
  el("week5-question-data").textContent=data[1];
  for(let i=0;i<4;i++){const f=new El();f.dataset.workshopPart="Part "+i;el("studio").children.push(f);}
 }else for(const m of h.matchAll(/data-week5-rubric="([^"]+)"/g))el("week5-rubric-"+m[1]).value="";
 const globals={document,window,localStorage,Date,JSON,Math,Number,String,Set,Map,Object,Blob,console,
  Event:class{constructor(type){this.type=type;}},URL:{createObjectURL(){return"blob:test"},revokeObjectURL(){}},
  setTimeout(){},setInterval(){return 1},clearInterval(){},confirm:()=>true};
 vm.createContext(globals);
 vm.runInContext(daily,globals);
 if(day===25)vm.runInContext(assessment,globals);
 return {el,fields,picks,store,scoped:key=>key+":learner:"+learner,h};
}
const a=launch(21);
assert.equal(a.el("week5-next-wrap").hidden,true,"Next is hidden before mastery");
const bank=JSON.parse(a.el("week5-question-data").textContent);
bank.questions.forEach((q,i)=>a.picks[i]=i===0?(q.answer+1)%3:q.answer);
a.el("week5-check").trigger("click");
assert.equal(JSON.parse(a.store.get(a.scoped("khae-ela9-field:week-05-day-21-practice-v1"))).best,80);
assert.equal(a.el("week5-next-wrap").hidden,false,"80% immediately unlocks next daily lesson");
assert.equal(launch(21,a.store).el("week5-next-wrap").hidden,false,"Saved mastery survives refresh");
assert.equal(launch(21,a.store,"B").el("week5-next-wrap").hidden,true,"Another learner cannot inherit quiz mastery");
const stale=launch(22,new Map(),"C"),staleKey=stale.scoped("khae-ela9-field:week-05-day22");
stale.store.set(staleKey,"Newer writing");
stale.fields[0].value="Stale tab";stale.fields[0].trigger("input");
assert.equal(stale.store.get(staleKey),"Newer writing","Compare-before-write prevents overwrites");
const exam=launch(25,new Map(),"A");
assert.equal(exam.el("week5-next-wrap").hidden,true);
assert.equal(exam.el("week5-clock").textContent,"45:00 remaining","Timer is non-punitive and optional");
const fields=Object.fromEntries(exam.fields.map(f=>[f.dataset.saveField.replace("week-05-day25","")||"notes",f]));
fields["-annotations"].value="Iren makes the city secure, but costly quotas damage the harvest while Sela learns to attend to another observer.";
fields["-annotations"].trigger("input");
fields["-matrix"].value="Text A offers Iren's wall and farm losses, followed by reopened royal storehouses. Text B offers Sela's storm expertise and her refusal to listen, followed by changed course and mentorship. Each hero accepts a new responsibility.";
fields["-matrix"].trigger("input");
fields["-draft1"].value=("The original course text depicts a skilled heroic figure whose expertise protects a community but also creates costly blind spots. ").repeat(24);
fields["-draft1"].trigger("input");
const count=t=>t.trim().split(/\s+/).length;
assert.ok(count(fields["-draft1"].value)>=400&&count(fields["-draft1"].value)<=550,"Fixture meets 400–550 words");
exam.el("week5-lock-draft").trigger("click");
assert.equal(fields["-draft1"].readOnly,true,"First draft preserved");
fields["-final"].value=("The two unfamiliar narratives contrast expertise with a responsibility to listen to others and acknowledge consequences for the wider community. ").repeat(23);
fields["-final"].trigger("input");
assert.ok(count(fields["-final"].value)>=400&&count(fields["-final"].value)<=550);
fields["-revision"].value="I strengthened my comparative claim, revised attribution, and clarified how Iren and Sela respond differently to the limits of their expertise.";
fields["-revision"].trigger("input");
exam.el("week5-independent").checked=true;exam.el("week5-independent").trigger("change");
exam.el("week5-evidence-confirm").checked=true;exam.el("week5-evidence-confirm").trigger("change");
assert.equal(exam.el("week5-submit").disabled,false,"Independent evidence is ready for human review");
exam.el("week5-submit").trigger("click");
assert.equal(exam.el("week5-next-wrap").hidden,true,"Submitting cannot self-award mastery");
const rows={claim:2,evidence:2,reasoning:2,comparison:1,language:1};
for(const [k,v] of Object.entries(rows)){exam.el("week5-rubric-"+k).value=String(v);exam.el("week5-rubric-"+k).trigger("change");}
exam.el("week5-evaluator").value="Parent Reviewer";
exam.el("week5-feedback").value="Interpret each source's cause and consequence with greater precision; preserve the sound comparison.";
assert.equal(exam.el("week5-record-review").disabled,false);
exam.el("week5-record-review").trigger("click");
assert.equal(exam.el("week5-next-wrap").hidden,false,"Recorded human 8/10 allows Week 06");
assert.equal(launch(25,exam.store).el("week5-next-wrap").hidden,false,"Reviewed mastery persists after refresh");
fields["-final"].value+=" New unreviewed changes.";fields["-final"].trigger("input");
assert.equal(exam.el("week5-next-wrap").hidden,true,"Modified work invalidates old review for current version");
console.log("PASS Week 05 behavior: independent learner records, stale-tab protection, 80% formative unlock, draft lock, 400–550-word review, recorded 8/10 unlock and change invalidation");
