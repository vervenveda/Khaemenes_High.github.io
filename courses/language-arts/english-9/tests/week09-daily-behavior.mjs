import fs from "node:fs";import vm from "node:vm";import path from "node:path";
import assert from "node:assert/strict";import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(base,"assets/week09-daily.js"),"utf8");
const assessment=fs.readFileSync(path.join(base,"assets/week09-assessment.js"),"utf8");
class E{
 constructor(){this.value="";this.textContent="";this.checked=false;this.disabled=false;this.hidden=true;this.readOnly=false;this.dataset={};this.handlers=new Map();this.children=[];this.classList={toggle(){}};}
 addEventListener(k,f){const x=this.handlers.get(k)||[];x.push(f);this.handlers.set(k,x);}
 fire(k,extra={}){for(const f of this.handlers.get(k)||[])f({type:k,...extra});}
 dispatchEvent(e){this.fire(e.type);}append(...v){this.children.push(...v);}prepend(...v){this.children.unshift(...v);}
 setAttribute(){}getAttribute(k){return this.dataset[k]||"";}
}
function boot(day,store=new Map(),learner="A"){
 store.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const h=fs.readFileSync(path.join(base,"weeks/week-09/day-"+day+"/index.html"),"utf8");
 const nodes=new Map(),el=id=>{if(!nodes.has(id))nodes.set(id,new E());return nodes.get(id);};
 const writing=[...h.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const e=new E();e.dataset.saveField=m[1];return e;});
 const selected=[];
 const doc={body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week9"]'?writing:sel==='[data-workshop-part]'?el("parts").children:[],
  querySelector:sel=>{const m=sel.match(/input\[name="w9q-(\d+)"\]:checked/);return m&&selected[Number(m[1])]!==undefined?{value:String(selected[Number(m[1])])}:null;},
  createElement:()=>new E(),createTextNode:t=>({textContent:t})};
 const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:learner}),readJSON:()=>({}),isReady:()=>true,scopedKey:(key,p)=>key+":learner:"+p.learnerId},addEventListener(){}};
 if(day<45){el("week9-question-data").textContent=h.match(/id="week9-question-data">([\s\S]*?)<\/script>/)[1];
  for(let i=0;i<4;i++){const f=new E();f.dataset.workshopPart="Part "+i;el("parts").children.push(f);}}
 const ctx={window,document:doc,localStorage,Date,JSON,Math,Number,String,Object,Map,Set,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(daily,ctx);if(day===45)vm.runInContext(assessment,ctx);
 return {el,writing,store,selected,key:k=>k+":learner:"+learner};
}
const a=boot(41);
assert.equal(a.el("week9-next-wrap").hidden,true);
const bank=JSON.parse(a.el("week9-question-data").textContent).questions;
bank.forEach((q,i)=>a.selected[i]=i===0?(q.answer+1)%3:q.answer);
a.el("week9-check").fire("click");
assert.equal(JSON.parse(a.store.get(a.key("khae-ela9-field:week-09-day-41-practice-v1"))).best,80);
assert.equal(a.el("week9-next-wrap").hidden,false,"80% reveals next lesson");
assert.equal(boot(41,a.store).el("week9-next-wrap").hidden,false,"Mastery survives reload");
assert.equal(boot(41,a.store,"B").el("week9-next-wrap").hidden,true,"Other learner isolation");
const stale=boot(42,new Map(),"C"),key=stale.key("khae-ela9-field:week-09-day42");
stale.store.set(key,"Latest from another tab");stale.writing[0].value="Old text";stale.writing[0].fire("input");
assert.equal(stale.store.get(key),"Latest from another tab","Stale-tab save blocked");
const saved=boot(43),longDraft=saved.writing.find(x=>x.dataset.saveField==="week-09-day43-draft");
longDraft.value="Student authored a separate full draft";longDraft.fire("input");
assert.equal(saved.store.get(saved.key("khae-ela9-field:week-09-day43-draft")),longDraft.value);
const exam=boot(45),by=Object.fromEntries(exam.writing.map(e=>[e.dataset.saveField,e]));
const F=k=>by["week-09-day45-"+k],wc=t=>t.trim().split(/\s+/).length;
const original=("The character carried the old key to the door and had to choose whether loyalty or fear would guide the next irreversible action. ").repeat(49);
const revised=("The character carried the spare key toward the door and faced a hard choice about asking for help, family promises and the cost of waiting. ").repeat(46);
const commentary=("This revision places the central decision later so the reader can feel the character's hesitation. I used concise summary before the turn and expanded action in the most consequential scene. ").repeat(9);
assert.ok(wc(original)>=900&&wc(original)<=1400);
assert.ok(wc(revised)>=900&&wc(revised)<=1400);
assert.ok(wc(commentary)>=250&&wc(commentary)<=350);
F("story-draft").value=original;F("story-draft").fire("input");exam.el("week9-lock-draft").fire("click");
assert.equal(F("story-draft").readOnly,true,"Original full draft locked");
F("story-final").value=revised;F("story-final").fire("input");
F("commentary").value=commentary;F("commentary").fire("input");
F("revision-note").value="Before: the turn arrived too quickly. After: an extra scene developed the dilemma. Why: the reader sees the costs of each available option more clearly before the protagonist acts.";
F("revision-note").fire("input");
F("reflection").value="Compared with my Week 7 scene I now make setting and narrator knowledge shape how the reader understands the decisive choice; I will practice clearer consequences in my next story.";
F("reflection").fire("input");
F("self-score").value="Purpose two, character two, structure two, language one and revision one. I want to improve dialogue transitions.";
F("self-score").fire("input");
for(let i=1;i<=6;i++){
 F("craft-"+i).value="Location or quotation: In scene "+i+", the character notices an object before taking action and responding to others.\n"+
 "Craft choice: A deliberate change in attention, pacing or dialogue reveals an unspoken concern.\n"+
 "Effect on the reader: The tension becomes clearer because the reader understands the competing values and consequences.";
 F("craft-"+i).fire("input");
}
exam.el("week9-independent").checked=true;exam.el("week9-independent").fire("change");
exam.el("week9-revision-confirm").checked=true;exam.el("week9-revision-confirm").fire("change");
assert.equal(exam.el("week9-submit").disabled,false,"Complete portfolio is ready");
exam.el("week9-submit").fire("click");assert.equal(exam.el("week9-next-wrap").hidden,true,"Submission cannot auto-award grade");
for(const [k,v] of Object.entries({purpose:2,character:2,structure:1,language:1,revision:1})){
 exam.el("week9-rubric-"+k).value=String(v);exam.el("week9-rubric-"+k).fire("change");
}
exam.el("week9-evaluator").value="Parent Educator";
exam.el("week9-feedback").value="Reconsider how dialogue and scene timing contribute to the decisive turn.";
exam.el("week9-record-review").fire("click");
assert.equal(exam.el("week9-next-wrap").hidden,true,"7/10 stays locked");
exam.el("week9-rubric-structure").value="2";exam.el("week9-rubric-structure").fire("change");
exam.el("week9-record-review").fire("click");
assert.equal(exam.el("week9-next-wrap").hidden,false,"8/10 unlock");
assert.equal(boot(45,exam.store).el("week9-next-wrap").hidden,false,"Reviewed mastery survives reload");
F("story-final").value+=" Unreviewed change.";F("story-final").fire("input");
assert.equal(exam.el("week9-next-wrap").hidden,true,"Revised writing invalidates review");
console.log("PASS English 9 Week09: formative 80%, learner isolation, concurrency, story draft lock, six annotations, commentary, 7/10 corrective gate, 8/10 mastery and revision invalidation.");
