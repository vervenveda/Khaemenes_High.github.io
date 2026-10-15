import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const code=fs.readFileSync(path.join(base,"assets/week03-daily.js"),"utf8");
class El {
 constructor(id=""){this.id=id;this.dataset={};this.value="";this.textContent="";this.readOnly=false;this.checked=false;this.disabled=false;this.hidden=true;this.events=new Map();this.children=[];this.style={};this.classList={toggle(){}};}
 addEventListener(type,fn){const list=this.events.get(type)||[];list.push(fn);this.events.set(type,list);}
 trigger(type){for(const f of this.events.get(type)||[])f({type});}
 dispatchEvent(event){this.trigger(event.type);}
 append(...nodes){this.children.push(...nodes);}
 prepend(...nodes){this.children.unshift(...nodes);}
 setAttribute(){}
 getAttribute(k){return this.attributes?.[k]||"";}
 querySelectorAll(sel){return sel==="[data-workshop-part]"?this.children.filter(x=>x.dataset.workshopPart):[];}
}
function boot(day,store=new Map(),learner="A"){
 store.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const html=fs.readFileSync(path.join(base,"weeks/week-03/day-"+day+"/index.html"),"utf8");
 const ids=new Map(),el=id=>{if(!ids.has(id))ids.set(id,new El(id));return ids.get(id);};
 const fields=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const x=new El();x.dataset.saveField=m[1];return x;});
 const selected=[];
 const query=s=>{
  const m=s.match(/input\[name="w2q-(\d+)"\]:checked/);
  if(m)return selected[Number(m[1])]===undefined?null:{value:String(selected[Number(m[1])])};
  return null;
 };
 const document={body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelector:query,querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week3"]'?fields:[],
  createElement:k=>new El(k),createTextNode:text=>({textContent:text})};
 const storage={getItem:key=>store.has(key)?store.get(key):null,setItem:(key,v)=>store.set(key,String(v))};
 const win={KhaemenesCourseEntryContract:{readAcademyProfile:()=>learner?{learnerId:learner}:null,
  scopedKey:(key,p)=>key+":learner:"+p.learnerId,readJSON:()=>({}),isReady:()=>!!learner},addEventListener(){}};
 const data=html.match(/id="week3-questions-data">([\s\S]*?)<\/script>/);
 if(data){
  el("week3-questions-data").textContent=data[1];
  el("week3-lab").dataset.targetField=fields[0].dataset.saveField;
  for(let i=0;i<4;i++){let p=new El();p.dataset.workshopPart="Part "+i;el("week3-lab").children.push(p);}
 }
 vm.runInNewContext(code,{document,window:win,localStorage:storage,Date,Number,String,Math,Map,Object,JSON,Set,Event:class{constructor(type){this.type=type}},setTimeout(){},console});
 return {store,el,fields,selected,scoped:key=>key+":learner:"+learner};
}
const a=boot(11);
assert.equal(a.el("week3-next-wrap").hidden,true,"Next lesson starts concealed");
a.fields[0].value="Student-created analysis";a.fields[0].trigger("input");
assert.equal(a.store.get(a.scoped("khae-ela9-field:week-03-day11")),"Student-created analysis");
const bank=JSON.parse(a.el("week3-questions-data").textContent);
bank.questions.forEach((q,i)=>a.selected[i]=i===0?(q.answer+1)%q.options.length:q.answer);
a.el("week3-check").trigger("click");
assert.equal(JSON.parse(a.store.get(a.scoped("khae-ela9-field:week-03-day11-exercise-v1"))).best,80);
assert.equal(a.el("week3-next-wrap").hidden,false,"80% immediately shows next action");
const reopened=boot(11,a.store);
assert.equal(reopened.el("week3-next-wrap").hidden,false,"Next action persists across reload");
const other=boot(11,a.store,"B");
assert.equal(other.el("week3-next-wrap").hidden,true,"Other learner must pass independently");
const stale=boot(12,new Map(),"C");
const staleKey=stale.scoped("khae-ela9-field:week-03-day12");
stale.store.set(staleKey,"More recent writing");
stale.fields[0].value="Stale data";stale.fields[0].trigger("input");
assert.equal(stale.store.get(staleKey),"More recent writing");
const exam=boot(15);
assert.equal(exam.el("week3-next-wrap").hidden,true);
const f=Object.fromEntries(exam.fields.map(x=>[x.dataset.saveField.split("day15-")[1],x]));
f.draft1.value="Original independent analysis sentence with evidence. ".repeat(85);f.draft1.trigger("input");
exam.el("week3-lock-draft").trigger("click");assert.equal(f.draft1.readOnly,true);
f.final.value="Revised independent analysis sentence with evidence. ".repeat(85);f.final.trigger("input");
f.conventions.value=Array.from({length:10},(_,i)=>(i+1)+". Edited sentence; explanation.").join("\n");
f.conventions.trigger("input");f.revision.value="I revised the evidence, synthesis, and attribution.";f.revision.trigger("input");
exam.el("week3-independent").checked=true;exam.el("week3-independent").trigger("change");
exam.el("week3-acknowledge").checked=true;exam.el("week3-acknowledge").trigger("change");
assert.equal(exam.el("week3-finish").disabled,false);
exam.el("week3-finish").trigger("click");
assert.equal(exam.el("week3-next-wrap").hidden,true,"Submitting independent work cannot confer mastery");
const receiptKey=exam.scoped("khae-ela9-field:week-03-day15-review-receipt-v1");
const receipt=JSON.parse(exam.store.get(receiptKey));
assert.equal(receipt.masteryAwarded,false);
Object.assign(receipt,{gradeStatus:"passed",masteryAwarded:true,rubricScore:8,
 evaluatedBy:"School evaluator record",evaluatedAt:"2026-10-15T12:00:00Z"});
exam.store.set(receiptKey,JSON.stringify(receipt));
const reviewed=boot(15,exam.store);
assert.equal(reviewed.el("week3-next-wrap").hidden,false,"Recorded 8/10 review reveals next unit");
assert.equal(JSON.parse(exam.store.get(exam.scoped("khae-ela9-progress-v1")))["week-03"],undefined,"No automatic unit completion grade");
console.log("PASS Week03 behavior: learner isolation, real addEventListener semantics, 80% unlock, reload, stale-tab defense, locked first draft, no self-grading, 8/10 evaluator record");
