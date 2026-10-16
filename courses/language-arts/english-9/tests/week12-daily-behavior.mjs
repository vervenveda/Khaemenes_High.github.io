import fs from "node:fs";import vm from "node:vm";import path from "node:path";
import assert from "node:assert/strict";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(root,"assets/week12-daily.js"),"utf8");
const assessment=fs.readFileSync(path.join(root,"assets/week12-assessment.js"),"utf8");
class Element{
 constructor(){this.value="";this.textContent="";this.checked=false;this.disabled=false;this.hidden=true;this.readOnly=false;this.dataset={};this.children=[];this.listeners=new Map();this.classList={toggle(){}};}
 addEventListener(k,fn){const xs=this.listeners.get(k)||[];xs.push(fn);this.listeners.set(k,xs);}
 fire(k,extra={}){for(const fn of this.listeners.get(k)||[])fn({type:k,...extra});}
 dispatchEvent(e){this.fire(e.type);}append(...x){this.children.push(...x);}prepend(...x){this.children.unshift(...x);}
 setAttribute(){}getAttribute(key){return key==="data-week12-import"?this.dataset.week12Import??"":this.dataset[key]??"";}
}
function boot(day,storage=new Map(),learner="A"){
 storage.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const html=fs.readFileSync(path.join(root,"weeks/week-12/day-"+day+"/index.html"),"utf8");
 const nodes=new Map(),el=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
 const writing=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(x=>{const f=new Element();f.dataset.saveField=x[1];return f;});
 const picks=[],imports=[];
 if(day===60)for(let i=1;i<=4;i++){const btn=new Element();btn.dataset.week12Import=String(i);imports.push(btn);}
 const doc={
  body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week12"]'?writing:
   sel==='[data-workshop-part]'?el("studio").children:
   sel==='[data-week12-import]'?imports:[],
  querySelector:sel=>{
   const m=sel.match(/input\[name="w12q-(\d+)"\]:checked/);
   return m&&picks[Number(m[1])]!==undefined?{value:String(picks[Number(m[1])])}:null;
  },createElement:()=>new Element(),createTextNode:x=>({textContent:x})
 };
 const localStorage={getItem:key=>storage.has(key)?storage.get(key):null,setItem:(key,v)=>storage.set(key,String(v))};
 const window={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>({learnerId:learner}),readJSON:()=>({}),isReady:()=>true,
  scopedKey:(key,profile)=>key+":learner:"+profile.learnerId},addEventListener(){}};
 if(day<60){
  el("week12-question-data").textContent=html.match(/id="week12-question-data">([\s\S]*?)<\/script>/)[1];
  for(let i=0;i<4;i++){const e=new Element();e.dataset.workshopPart="Part "+i;el("studio").children.push(e);}
 }
 const ctx={window,document:doc,localStorage,Date,JSON,Math,Number,String,Object,Map,Set,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(daily,ctx);if(day===60)vm.runInContext(assessment,ctx);
 return {el,writing,picks,imports,storage,key:k=>k+":learner:"+learner};
}
const a=boot(56);
assert.equal(a.el("week12-next-wrap").hidden,true);
const bank=JSON.parse(a.el("week12-question-data").textContent).questions;
bank.forEach((q,i)=>a.picks[i]=i===0?(q.answer+1)%3:q.answer);
a.el("week12-check").fire("click");
assert.equal(JSON.parse(a.storage.get(a.key("khae-ela9-field:week-12-day-56-practice-v1"))).best,80);
assert.equal(a.el("week12-next-wrap").hidden,false,"Four correct reveals next lesson");
assert.equal(boot(56,a.storage).el("week12-next-wrap").hidden,false,"Formative mastery persists");
assert.equal(boot(56,a.storage,"B").el("week12-next-wrap").hidden,true,"Learners are independent");
const stale=boot(57,new Map(),"C"),key=stale.key("khae-ela9-field:week-12-day57");
stale.storage.set(key,"Newer writing from another tab");
stale.writing.find(x=>x.dataset.saveField==="week-12-day57").value="Old writing";
stale.writing.find(x=>x.dataset.saveField==="week-12-day57").fire("input");
assert.equal(stale.storage.get(key),"Newer writing from another tab");
const records=new Map(),prefix=":learner:A";
const savedOriginal="Cloud\nStair\nLantern\nRivers\nThe street\nA door\nA voice\nComing";
records.set("khae-ela9-field:week-10-day50-poem1-draft"+prefix,savedOriginal);
records.set("khae-ela9-field:week-10-day50-poem1-final"+prefix,savedOriginal+"\nTurning back");
records.set("khae-ela9-field:week-10-day50-poem1-revision"+prefix,"Before the ending named fear. After it slows the final image. This changes the reader's expectation.");
const e=boot(60,records);
const fields=Object.fromEntries(e.writing.map(el=>[el.dataset.saveField,el]));
const F=k=>fields["week-12-day60-"+k],wc=x=>x.trim().split(/\s+/).length;
e.imports[0].fire("click");
assert.equal(F("poem1-draft").value,savedOriginal,"Copies prior original draft");
assert.equal(records.get("khae-ela9-field:week-10-day50-poem1-draft"+prefix),savedOriginal,"Source preserved");
for(let i=1;i<=4;i++){
 const original=Array.from({length:8},(_,n)=>"Verse "+i+" "+n+" opens a quiet door and remembers the distant bell").join("\n");
 const revised=original+"\nA deliberately revised concluding image suggests a different listener";
 if(i>1){F("poem"+i+"-draft").value=original;F("poem"+i+"-draft").fire("input");
  F("poem"+i+"-final").value=revised;F("poem"+i+"-final").fire("input");
  F("poem"+i+"-revision").value="Before the final image closed the thought. After revision the changed ending offers a different audience relationship and pace.";
  F("poem"+i+"-revision").fire("input");}
}
const analysis=("The first version positions the speaker at a distance while the second version chooses more specific sensory details. That alteration shapes interpretation while leaving the simulated source language completely unknowable. ").repeat(20);
const reflection=("My strongest revision changed the effect of silence and pacing in the fourth poem. Reading it aloud revealed that the line break invited a pause which concealed the turn until later. ").repeat(9);
assert.ok(wc(analysis)>=500&&wc(analysis)<=700);
assert.ok(wc(reflection)>=200&&wc(reflection)<=300);
F("source-mode").value="simulation";F("source-mode").fire("input");
F("source-note").value="This is a Day 56 course-created simulation using a fictional meaning packet and two English versions, not an authentic source-language translation.";
F("source-note").fire("input");
F("translation").value=analysis;F("translation").fire("input");
F("reflection").value=reflection;F("reflection").fire("input");
F("performance-map").value="Breath: the first two lines need quiet air. Emphasis: the door image matters. Pace: a slower cadence before the transition. Turn: the final line offers changed understanding, not a loud climax.";
F("performance-map").fire("input");
F("delivery").value="The fourth original poem was read with a short introduction, in an approved spoken or accessible format, for approximately two to three minutes with an evaluator present.";
F("delivery").fire("input");
e.el("week12-delivered").checked=true;e.el("week12-delivered").fire("change");
e.el("week12-independent").checked=true;e.el("week12-independent").fire("change");
e.el("week12-portfolio-confirm").checked=true;e.el("week12-portfolio-confirm").fire("change");
assert.equal(e.el("week12-submit").disabled,false,"Full independent poetry portfolio may be submitted");
e.el("week12-submit").fire("click");
assert.equal(e.el("week12-next-wrap").hidden,true,"Submission alone never unlocks Unit05");
for(const [k,v] of Object.entries({portfolio:2,translation:2,performance:1,craft:1,reflection:1})){
 e.el("week12-rubric-"+k).value=String(v);e.el("week12-rubric-"+k).fire("change");
}
e.el("week12-evaluator").value="Parent Educator";
e.el("week12-feedback").value="Clarify the connection between syntactic pause and changed listener interpretation.";
e.el("week12-record-review").fire("click");
assert.equal(e.el("week12-next-wrap").hidden,true,"7/10 stays locked");
e.el("week12-rubric-performance").value="2";e.el("week12-rubric-performance").fire("change");
e.el("week12-record-review").fire("click");
assert.equal(e.el("week12-next-wrap").hidden,false,"Human-entered 8/10 allows next unit");
assert.equal(boot(60,records).el("week12-next-wrap").hidden,false,"Approved result persists after refresh");
F("translation").value+=" Unreviewed sentence.";F("translation").fire("input");
assert.equal(e.el("week12-next-wrap").hidden,true,"Changing the submitted analysis invalidates old review");
console.log("PASS Week12 behavior: mastery, persistence, learner isolation, stale tab protection, original source import, four revised poems, simulation attribution, 500–700 analysis, 200–300 reflection, 7/10 remedial gate and 8/10 educator review.");
