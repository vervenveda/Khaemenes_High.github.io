import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(base,"assets/week11-daily.js"),"utf8");
const assess=fs.readFileSync(path.join(base,"assets/week11-assessment.js"),"utf8");
class El{
 constructor(){this.value="";this.textContent="";this.checked=false;this.disabled=false;this.hidden=true;this.readOnly=false;this.dataset={};this.children=[];this.listeners=new Map();this.classList={toggle(){}};}
 addEventListener(name,fn){const a=this.listeners.get(name)||[];a.push(fn);this.listeners.set(name,a);}
 fire(name,extra={}){for(const f of this.listeners.get(name)||[])f({type:name,...extra});}
 dispatchEvent(e){this.fire(e.type);}
 append(...c){this.children.push(...c);}
 prepend(...c){this.children.unshift(...c);}
 setAttribute(){}
 getAttribute(k){return this.dataset[k]??"";}
}
function load(day,records=new Map(),learner="A"){
 records.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const page=fs.readFileSync(path.join(base,"weeks/week-11/day-"+day+"/index.html"),"utf8");
 const els=new Map(),el=k=>{if(!els.has(k))els.set(k,new El());return els.get(k);};
 const fields=[...page.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{
  const f=new El();f.dataset.saveField=m[1];return f;
 });
 const choices=[];
 const document={body:{getAttribute:()=>String(day),append(){}},
  getElementById:el,
  querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week11"]'?fields:
   sel==='[data-workshop-part]'?el("workshop").children:[],
  querySelector:sel=>{
   const m=sel.match(/input\[name="w11q-(\d+)"\]:checked/);
   return m&&choices[Number(m[1])]!==undefined?{value:String(choices[Number(m[1])])}:null;
  },
  createElement:()=>new El(),createTextNode:s=>({textContent:s})
 };
 const localStorage={getItem:k=>records.has(k)?records.get(k):null,setItem:(k,v)=>records.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>({learnerId:learner}),readJSON:()=>({}),isReady:()=>true,
  scopedKey:(key,p)=>key+":learner:"+p.learnerId
 },addEventListener(){}};
 if(day<55){
  const raw=page.match(/id="week11-question-data" type="application\/json">([\s\S]*?)<\/script>/);
  el("week11-question-data").textContent=raw[1];
  for(let i=0;i<4;i++){const p=new El();p.dataset.workshopPart="Part "+i;el("workshop").children.push(p);}
 }
 const ctx={document,window,localStorage,Date,JSON,Math,Number,String,Object,Map,Set,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);
 vm.runInContext(daily,ctx);
 if(day===55)vm.runInContext(assess,ctx);
 return {el,fields,choices,records,key:k=>k+":learner:"+learner};
}
const a=load(51);
assert.equal(a.el("week11-next-wrap").hidden,true,"Next lesson initially hidden");
const bank=JSON.parse(a.el("week11-question-data").textContent).questions;
bank.forEach((q,i)=>a.choices[i]=i===0?(q.answer+1)%3:q.answer);
a.el("week11-check").fire("click");
assert.equal(JSON.parse(a.records.get(a.key("khae-ela9-field:week-11-day-51-practice-v1"))).best,80);
assert.equal(a.el("week11-next-wrap").hidden,false,"80% immediately reveals next");
assert.equal(load(51,a.records).el("week11-next-wrap").hidden,false,"Mastery persists");
assert.equal(load(51,a.records,"B").el("week11-next-wrap").hidden,true,"Another learner cannot inherit mastery");
const stale=load(52,new Map(),"C");
const staleKey=stale.key("khae-ela9-field:week-11-day-52");
stale.records.set(staleKey,"Newer work from a second tab");
stale.fields.find(x=>x.dataset.saveField==="week-11-day-52").value="Stale writing";
stale.fields.find(x=>x.dataset.saveField==="week-11-day-52").fire("input");
assert.equal(stale.records.get(staleKey),"Newer work from a second tab","Stale tab must not overwrite");
const shared=new Map(),d54=load(54,shared);
const F54=x=>d54.fields.find(f=>f.dataset.saveField==="week-11-day54-"+x);
const original=Array.from({length:14},(_,i)=>"At hour "+(i+1)+" the clock marks footsteps in the waiting room.").join("\n");
F54("poem-draft").value=original;F54("poem-draft").fire("input");
F54("rule").value="I will use fourteen lines with a turn after the eighth line to shift from work to silence.";
F54("rule").fire("input");
F54("form").value="volta";F54("form").fire("change");
assert.equal(d54.records.get(d54.key("khae-ela9-field:week-11-day54-poem-draft")),original);
const exam=load(55,shared),by=Object.fromEntries(exam.fields.map(e=>[e.dataset.saveField,e]));
const F=k=>by["week-11-day55-"+k],wc=t=>t.trim().split(/\s+/).length;
assert.equal(exam.el("week11-next-wrap").hidden,true);
exam.el("week11-import-day54").fire("click");
assert.equal(F("draft").value,original,"Day54 original poem copied without overwriting source");
assert.equal(F("form").value,"volta","Selected form transferred");
exam.el("week11-lock-draft").fire("click");
assert.equal(F("draft").readOnly,true,"Original independent poem locked");
const revised=Array.from({length:14},(_,i)=>"The careful clock rests above the workbench in the afternoon "+(i+1)+".").join("\n");
F("final").value=revised;F("final").fire("input");
const analysis=("The workshop poem uses audible consonants and varied pauses to contrast mechanical work with an unexpected silence, changing the reader's sense of the unfinished chain. ").repeat(17);
assert.ok(wc(analysis)>=350&&wc(analysis)<=500);
F("analysis").value=analysis;F("analysis").fire("input");
const craft=("The repeated metallic consonants establish an expectation of motion and steady work, but the short sentence and pause change the reader's focus. I revised the line break to give silence a clear turn. ").repeat(6);
assert.ok(wc(craft)>=160&&wc(craft)<=220);
F("craft").value=craft;F("craft").fire("input");
F("revision").value="Before the read aloud revision my final turn was buried inside one stanza. Afterwards I moved the pause and shortened the sentence to stress quiet.";
F("revision").fire("input");
F("reflection").value="This week I learned to identify an audible pattern and connect it to a defensible effect. I want to improve scansion without forcing speech.";
F("reflection").fire("input");
const annotation="Line or quotation: The clock marks footsteps at the workshop threshold.\n"+
 "Feature or decision: Consonant repetition and a delayed turn build anticipation.\n"+
 "Effect on the reader: A later pause shifts emphasis from busy motion into silence and memory.";
for(let i=1;i<=4;i++){F("annotation-"+i).value=annotation;F("annotation-"+i).fire("input");}
exam.el("week11-independent").checked=true;exam.el("week11-independent").fire("change");
exam.el("week11-revision-confirm").checked=true;exam.el("week11-revision-confirm").fire("change");
assert.equal(exam.el("week11-submit").disabled,false,"All independent portfolio conditions met");
exam.el("week11-submit").fire("click");
assert.equal(exam.el("week11-next-wrap").hidden,true,"Submitting alone is not mastery");
for(const [k,v] of Object.entries({claim:2,evidence:2,poem:1,annotations:1,craft:1})){
 exam.el("week11-rubric-"+k).value=String(v);exam.el("week11-rubric-"+k).fire("change");
}
exam.el("week11-evaluator").value="Parent Educator";
exam.el("week11-feedback").value="Strengthen the evidence that supports the caesura and formal turn in the final poem.";
exam.el("week11-record-review").fire("click");
assert.equal(exam.el("week11-next-wrap").hidden,true,"7/10 does not unlock");
exam.el("week11-rubric-poem").value="2";exam.el("week11-rubric-poem").fire("change");
exam.el("week11-record-review").fire("click");
assert.equal(exam.el("week11-next-wrap").hidden,false,"Educator-recorded 8/10 unlocks");
assert.equal(load(55,shared).el("week11-next-wrap").hidden,false,"Reviewed mastery persists");
F("final").value+="\nUnreviewed new ending.";F("final").fire("input");
assert.equal(exam.el("week11-next-wrap").hidden,true,"Edited work invalidates previous review");
console.log("PASS Week11 behavior: 80% quiz, learner isolation, stale-tab protection, Day54 poem transfer, locked Draft 1, independent 350–500 analysis, 4 annotations, 160–220 commentary, 7/10 remediation and 8/10 evaluator gate.");
