import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(base,"assets/week07-daily.js"),"utf8");
const assess=fs.readFileSync(path.join(base,"assets/week07-assessment.js"),"utf8");
class E{
 constructor(){this.value="";this.textContent="";this.checked=false;this.disabled=false;this.hidden=true;this.readOnly=false;this.dataset={};this.listeners=new Map();this.children=[];this.classList={toggle(){}};}
 addEventListener(name,handler){const a=this.listeners.get(name)||[];a.push(handler);this.listeners.set(name,a);}
 fire(name,extra={}){for(const handler of this.listeners.get(name)||[])handler({type:name,...extra});}
 dispatchEvent(e){this.fire(e.type);}
 append(...child){this.children.push(...child);}
 prepend(...child){this.children.unshift(...child);}
 setAttribute(){}
 getAttribute(name){return this.dataset[name]||"";}
}
function boot(day,store=new Map(),learner="A"){
 store.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const html=fs.readFileSync(path.join(base,"weeks/week-07/day-"+day+"/index.html"),"utf8");
 const elMap=new Map(),el=id=>{if(!elMap.has(id))elMap.set(id,new E());return elMap.get(id);};
 const writing=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const e=new E();e.dataset.saveField=m[1];return e;});
 const selection=[];
 const document={body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week7"]'?writing:
   sel==='[data-workshop-part]'?el("workshop").children:[],
  querySelector:sel=>{
   const m=sel.match(/input\[name="w7q-(\d+)"\]:checked/);
   return m&&selection[Number(m[1])]!==undefined?{value:String(selection[Number(m[1])])}:null;
  },createElement:()=>new E(),createTextNode:text=>({textContent:text})};
 const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>({learnerId:learner}),readJSON:()=>({}),isReady:()=>true,
  scopedKey:(key,profile)=>key+":learner:"+profile.learnerId
 },addEventListener(){}};
 if(day<35){
  el("week7-question-data").textContent=html.match(/id="week7-question-data">([\s\S]*?)<\/script>/)[1];
  for(let i=0;i<4;i++){const e=new E();e.dataset.workshopPart="Part "+i;el("workshop").children.push(e);}
 }
 const ctx={window,document,localStorage,Date,JSON,Math,String,Number,Object,Map,Set,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(daily,ctx);
 if(day===35)vm.runInContext(assess,ctx);
 return {el,writing,selection,store,scoped:key=>key+":learner:"+learner};
}
const a=boot(31);
assert.equal(a.el("week7-next-wrap").hidden,true,"Next hidden before practice passing");
const bank=JSON.parse(a.el("week7-question-data").textContent).questions;
bank.forEach((q,i)=>a.selection[i]=i===0?(q.answer+1)%3:q.answer);
a.el("week7-check").fire("click");
assert.equal(JSON.parse(a.store.get(a.scoped("khae-ela9-field:week-07-day-31-practice-v1"))).best,80);
assert.equal(a.el("week7-next-wrap").hidden,false,"Passing 80% reveals next button");
assert.equal(boot(31,a.store).el("week7-next-wrap").hidden,false,"Mastery survives reopening");
assert.equal(boot(31,a.store,"B").el("week7-next-wrap").hidden,true,"Other learner cannot inherit mastery");
const stale=boot(32,new Map(),"C");
const key=stale.scoped("khae-ela9-field:week-07-day32");
stale.store.set(key,"Newer student writing");
stale.writing[0].value="Old tab response";stale.writing[0].fire("input");
assert.equal(stale.store.get(key),"Newer student writing","Competing tab save blocked");
const b=boot(34);
const draft34=b.writing.find(x=>x.dataset.saveField==="week-07-day34-scene-draft");
draft34.value="A complete original scene, preserved separately from planning notes.";
draft34.fire("input");
assert.equal(b.store.get(b.scoped("khae-ela9-field:week-07-day34-scene-draft")),draft34.value);
const e=boot(35);
assert.equal(e.el("week7-next-wrap").hidden,true);
const fields=Object.fromEntries(e.writing.map(x=>[x.dataset.saveField,x]));
const F=key=>fields["week-07-day35-"+key],wc=x=>x.trim().split(/\s+/).length;
const analysis="The emergency lights expose Mara's conflict between promised family obligations and the frightened animal while the unsafe passage makes her request for help meaningful. ".repeat(17);
const scene="In the library a student faced a deadline and a difficult choice. The storm cut off the safe bus while a neighbor waited. She paused by the door and called her mother. ".repeat(14);
const revised="The original scene places the character at a deadline while the physical setting changes her available choices and reveals her values through action. ".repeat(17);
const commentary="I changed the setting detail to intensify the conflict and replaced general verbs with precise actions, while keeping the decisive turn visible through the character's behavior. ".repeat(5);
assert.ok(wc(analysis)>=300&&wc(analysis)<=450);
assert.ok(wc(scene)>=350&&wc(scene)<=550);
assert.ok(wc(revised)>=350&&wc(revised)<=550);
assert.ok(wc(commentary)>=100&&wc(commentary)<=150);
F("analysis").value=analysis;F("analysis").fire("input");
F("scene-draft").value=scene;F("scene-draft").fire("input");
e.el("week7-lock-draft").fire("click");
assert.equal(F("scene-draft").readOnly,true,"Original student draft locked");
F("scene-final").value=revised;F("scene-final").fire("input");
F("commentary").value=commentary;F("commentary").fire("input");
F("growth").value="I made a deliberate structural revision, tightened setting details, and improved precise verbs while preserving the reader's uncertainty about character.";
F("growth").fire("input");
e.el("week7-independent").checked=true;e.el("week7-independent").fire("change");
e.el("week7-evidence-confirm").checked=true;e.el("week7-evidence-confirm").fire("change");
assert.equal(e.el("week7-submit").disabled,false,"Full independent evidence prepared");
e.el("week7-submit").fire("click");
assert.equal(e.el("week7-next-wrap").hidden,true,"Submission is not a pass");
for(const [k,v] of Object.entries({character:2,conflict:2,setting:2,craft:1,language:1})){
 e.el("week7-rubric-"+k).value=String(v);e.el("week7-rubric-"+k).fire("change");
}
e.el("week7-evaluator").value="Parent Educator";
e.el("week7-feedback").value="Strengthen how each precise setting detail changes the character's options and choices.";
e.el("week7-record-review").fire("click");
assert.equal(e.el("week7-next-wrap").hidden,false,"Human-entered 8/10 unlocks next week");
assert.equal(boot(35,e.store).el("week7-next-wrap").hidden,false,"Reviewed mastery persists across reload");
F("scene-final").value+=" A new unreviewed sentence.";F("scene-final").fire("input");
assert.equal(e.el("week7-next-wrap").hidden,true,"Unreviewed edit invalidates passing status");
console.log("PASS Week07 behavior: 80% formative unlock, student isolation, multi-tab guard, Day34 scene record, 350–550 original draft lock, 300–450 analysis, 100–150 commentary, 8/10 local evaluator review and revision invalidation.");
