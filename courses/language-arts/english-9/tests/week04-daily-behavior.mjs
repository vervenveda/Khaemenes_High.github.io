import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const main=fs.readFileSync(path.join(base,"assets/week04-daily.js"),"utf8");
const assessment=fs.readFileSync(path.join(base,"assets/week04-assessment.js"),"utf8");
class E{
 constructor(){this.value="";this.dataset={};this.hidden=true;this.disabled=false;this.readOnly=false;this.checked=false;this.textContent="";this.children=[];this.handlers=new Map();this.classList={toggle(){}};this.style={};}
 addEventListener(k,f){const a=this.handlers.get(k)||[];a.push(f);this.handlers.set(k,a);}
 trigger(k,event={}){for(const f of this.handlers.get(k)||[])f({type:k,...event});}
 dispatchEvent(e){this.trigger(e.type);}
 append(...n){this.children.push(...n);}
 prepend(...n){this.children.unshift(...n);}
 setAttribute(){}
 getAttribute(k){return this.dataset[k]||"";}
}
function instance(day,store=new Map(),learner="A"){
 store.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const html=fs.readFileSync(path.join(base,"weeks/week-04/day-"+day+"/index.html"),"utf8");
 const elMap=new Map(),el=id=>{if(!elMap.has(id))elMap.set(id,new E());return elMap.get(id);};
 const fields=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const v=new E();v.dataset.saveField=m[1];return v;});
 const picks=[];
 const docs={
  body:{getAttribute:()=>String(day),append(){}},
  getElementById:el,
  querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week4"]'?fields:
   sel==="[data-workshop-part]"?el("studio").children:
   sel==="[data-week04-advance]"?[]:[],
  querySelector:sel=>{const m=sel.match(/input\[name="w4q-(\d+)"\]:checked/);return m&&picks[Number(m[1])]!==undefined?{value:String(picks[Number(m[1])])}:null;},
  createElement:()=>new E(),createTextNode:t=>({textContent:t})
 };
 const storage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
 const win={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>learner?{learnerId:learner}:null,readJSON:()=>({}),isReady:()=>!!learner,
  scopedKey:(key,p)=>key+":learner:"+p.learnerId},addEventListener(){}};
 if(day<20){
  const data=html.match(/id="week4-question-data">([\s\S]*?)<\/script>/);
  el("week4-question-data").textContent=data[1];
  for(let i=0;i<4;i++){const f=new E();f.dataset.workshopPart="Part "+i;el("studio").children.push(f);}
 }else{for(const m of html.matchAll(/data-week4-rubric="([^"]+)"/g))el("week4-score-"+m[1]).value="";}
 const context={document:docs,window:win,localStorage:storage,Date,JSON,Number,String,Object,Map,Set,Math,Blob,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},URL:{createObjectURL(){return"blob:test"},revokeObjectURL(){}},console,confirm:()=>true};
 vm.runInNewContext(main,context);
 if(day===20)vm.runInNewContext(assessment,context);
 return {el,fields,picks,store,win,scoped:key=>key+":learner:"+learner,html};
}
const a=instance(16);
assert.equal(a.el("week4-next-wrap").hidden,true);
const bank=JSON.parse(a.el("week4-question-data").textContent);
a.picks.push(...bank.questions.map((q,i)=>i===0?(q.answer+1)%3:q.answer));
a.el("week4-check").trigger("click");
assert.equal(a.el("week4-next-wrap").hidden,false,"Four of five reveals next");
assert.equal(JSON.parse(a.store.get(a.scoped("khae-ela9-field:week-04-day-16-practice-v1"))).best,80);
assert.equal(instance(16,a.store).el("week4-next-wrap").hidden,false,"Practice mastery persists");
assert.equal(instance(16,a.store,"B").el("week4-next-wrap").hidden,true,"Other learner has independent progress");
const first=new Map(),d=instance(20,first);
assert.equal(d.el("week4-next-wrap").hidden,true);
const by=Object.fromEntries(d.fields.map(x=>[x.dataset.saveField.split("day-20")[1]||"draft",x]));
by.draft.value=("The narrative shows a community disputing responsibility while carefully considering consequences. ").repeat(30);
by.draft.trigger("input");
assert.ok(by.draft.value.trim().split(/\s+/).length>=300);
d.el("week4-lock-draft").trigger("click");
assert.equal(by.draft.readOnly,true,"First draft is preserved");
by["-final"].value=("The story contrasts ownership with shared responsibility through the changing river and village councils. ").repeat(24);
by["-final"].trigger("input");
by["-pattern"].value="Recurring Situation: a repeated dispute across villages with evidence. Repeated Motif: contested boundaries and walls with an example. Central Symbol: open stone gates, explained with detail. Cultural Function: warns about ownership and models shared obligations in context.";
by["-pattern"].trigger("input");
by["-reflection"].value="I clarified pronoun references, strengthened my evidence, and explained the shift from walls to gates instead of restating the plot.";
by["-reflection"].trigger("input");
d.el("week4-independent").checked=true;d.el("week4-independent").trigger("change");
assert.equal(d.el("week4-submit").disabled,false,"Complete independent assessment can be submitted");
d.el("week4-submit").trigger("click");
assert.equal(d.el("week4-next-wrap").hidden,true,"Submission alone must never unlock");
const rows={claim:2,evidence:2,reasoning:2,pattern:1,clarity:1};
for(const [k,v] of Object.entries(rows)){d.el("week4-score-"+k).value=String(v);d.el("week4-score-"+k).trigger("change");}
d.el("week4-reviewer").value="Parent Evaluator";
d.el("week4-feedback").value="Provide a more developed account of why the recurring water imagery supports the function.";
assert.equal(d.el("week4-record-review").disabled,false);
d.el("week4-record-review").trigger("click");
assert.equal(d.el("week4-next-wrap").hidden,false,"Human-entered 8/10 reveals next");
const rk=d.scoped("khae-ela9-field:week-04-day20-review-v1");
const record=JSON.parse(first.get(rk));
assert.equal(record.score,8);assert.equal(record.passed,true);
assert.equal(instance(20,first).el("week4-next-wrap").hidden,false,"Human review persists");
by["-final"].value+=" An additional revision.";by["-final"].trigger("input");
assert.equal(d.el("week4-next-wrap").hidden,true,"Changed work invalidates old review for current version");
const rejected=instance(20,new Map(),"Another");
assert.equal(rejected.el("week4-next-wrap").hidden,true);
console.log("PASS Week04 learner behavior: 80% unlock, persisted score, learner isolation, original-draft lock, human 8/10 review, submission gate, stale evaluation invalidation");
