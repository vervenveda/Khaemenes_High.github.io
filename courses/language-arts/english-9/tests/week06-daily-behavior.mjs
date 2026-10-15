import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(root,"assets/week06-daily.js"),"utf8"),
 assessment=fs.readFileSync(path.join(root,"assets/week06-assessment.js"),"utf8");
class El {
 constructor(){this.value="";this.dataset={};this.checked=false;this.disabled=false;this.hidden=true;this.readOnly=false;this.textContent="";this.children=[];this.events=new Map();this.classList={toggle(){}};}
 addEventListener(n,f){const a=this.events.get(n)||[];a.push(f);this.events.set(n,a);}
 fire(n,x={}){for(const f of this.events.get(n)||[])f({type:n,...x});}
 dispatchEvent(e){this.fire(e.type);}
 append(...c){this.children.push(...c);}
 prepend(...c){this.children.unshift(...c);}
 setAttribute(){}
 getAttribute(k){return this.dataset[k]??"";}
}
function load(day,store=new Map(),student="A"){
 store.set("khaemenes_active_learner_v1",JSON.stringify(student));
 const html=fs.readFileSync(path.join(root,"weeks/week-06/day-"+day+"/index.html"),"utf8");
 const nodes=new Map(),el=k=>{if(!nodes.has(k))nodes.set(k,new El());return nodes.get(k);};
 const fields=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{
  const f=new El();f.dataset.saveField=m[1];return f;
 });
 const picks=[];
 const doc={body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week6"]'?fields:
    sel==='[data-workshop-part]'?el("parts").children:[],
  querySelector:sel=>{
   const m=sel.match(/input\[name="w6q-(\d+)"\]:checked/);
   return m&&picks[Number(m[1])]!==undefined?{value:String(picks[Number(m[1])])}:null;
  },createElement:()=>new El(),createTextNode:t=>({textContent:t})};
 const local={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
 const win={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>({learnerId:student}),readJSON:()=>({}),isReady:()=>true,
  scopedKey:(k,p)=>k+":learner:"+p.learnerId
 },addEventListener(){}};
 if(day<30){
  el("week6-question-data").textContent=html.match(/id="week6-question-data">([\s\S]*?)<\/script>/)[1];
  for(let i=0;i<4;i++){const f=new El();f.dataset.workshopPart="Part "+i;el("parts").children.push(f);}
 }else el("week6-defense-mode").value="written";
 const ctx={window:win,document:doc,localStorage:local,Date,JSON,Math,Number,String,Object,Map,Set,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(daily,ctx);
 if(day===30)vm.runInContext(assessment,ctx);
 return {store,picks,fields,el,key:k=>k+":learner:"+student};
}
const a=load(26);assert.equal(a.el("week6-next-wrap").hidden,true);
const qs=JSON.parse(a.el("week6-question-data").textContent).questions;
qs.forEach((q,i)=>a.picks[i]=i===0?(q.answer+1)%3:q.answer);
a.el("week6-check").fire("click");
assert.equal(JSON.parse(a.store.get(a.key("khae-ela9-field:week-06-day-26-practice-v1"))).best,80);
assert.equal(a.el("week6-next-wrap").hidden,false);
assert.equal(load(26,a.store).el("week6-next-wrap").hidden,false);
assert.equal(load(26,a.store,"B").el("week6-next-wrap").hidden,true);
const stale=load(27,new Map(),"C"),sk=stale.key("khae-ela9-field:week-06-day-27");
stale.store.set(sk,"Newest text");stale.fields[0].value="Stale";stale.fields[0].fire("input");
assert.equal(stale.store.get(sk),"Newest text");
const e=load(30),by=Object.fromEntries(e.fields.map(f=>[f.dataset.saveField,f]));
const F=id=>by["week-06-day-30-"+id],wc=t=>t.trim().split(/\s+/).length;
const essay=("The first narrative tests communal responsibility through imperfect authority while the second examines whether expertise can accept necessary correction. ").repeat(40);
assert.ok(wc(essay)>=700&&wc(essay)<=900);
F("draft1").value=essay;F("draft1").fire("input");e.el("week6-lock-draft").fire("click");
assert.equal(F("draft1").readOnly,true);
F("final").value=essay.replaceAll("necessary correction","responsible judgment");F("final").fire("input");
F("sources").value="The two studied texts use identified editions, translations, contextual resources and attributed evidence from both sources.";F("sources").fire("input");
const pattern=["Pattern name: A recurring responsibility theme","Text A: A source event illustrates an obligation","Text B: Another source event illustrates an obligation","Similarity: Both sources test responsibility in practice","Difference: The context changes who bears the cost","Meaning: Interpretation depends on cultural and textual context","Evidence: Each claim draws on a consulted narrative detail"].join("\n");
for(let i=1;i<=4;i++){F("pattern-"+i).value=pattern;F("pattern-"+i).fire("input");}
F("defense").value=("My strongest comparison joins two stories through a question about responsibility while preserving distinct contexts, consequences and the evidence that changed my initial thinking. ").repeat(8);F("defense").fire("input");
assert.ok(wc(F("defense").value)>=180&&wc(F("defense").value)<=250);
F("revision").value="I originally underestimated the importance of context but revised my claim after examining specific source evidence and contrasting consequences.";F("revision").fire("input");
e.el("week6-independent").checked=true;e.el("week6-independent").fire("change");
e.el("week6-attribution-confirm").checked=true;e.el("week6-attribution-confirm").fire("change");
assert.equal(e.el("week6-submit").disabled,false,"Valid evidence can be submitted");
e.el("week6-submit").fire("click");
assert.equal(e.el("week6-next-wrap").hidden,true,"Submission does not award mastery");
for(const [k,v] of Object.entries({thesis:2,evidence:2,synthesis:2,context:1,language:1})){
 e.el("week6-rubric-"+k).value=String(v);e.el("week6-rubric-"+k).fire("change");
}
e.el("week6-evaluator").value="Parent Educator";
e.el("week6-feedback").value="Preserve distinct contexts and continue strengthening precise source attribution.";
e.el("week6-record-review").fire("click");
assert.equal(e.el("week6-next-wrap").hidden,false,"8/10 educator review unlocks Unit 03");
assert.equal(load(30,e.store).el("week6-next-wrap").hidden,false,"Reviewed mastery persists");
F("final").value+=" Not yet reviewed.";F("final").fire("input");
assert.equal(e.el("week6-next-wrap").hidden,true,"Unreviewed changes revoke prior unlock");
console.log("PASS Week06 behavior: 80% quiz unlock, learner isolation, stale-tab guard, 700–900-word draft, four pattern entries, defense, 8/10 human-entered mastery and invalidation.");
