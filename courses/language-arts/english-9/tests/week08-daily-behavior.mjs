import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(base,"assets/week08-daily.js"),"utf8");
const assess=fs.readFileSync(path.join(base,"assets/week08-assessment.js"),"utf8");
class E{
 constructor(){this.value="";this.textContent="";this.checked=false;this.disabled=false;this.hidden=true;this.readOnly=false;this.dataset={};this.events=new Map();this.children=[];this.classList={toggle(){}};}
 addEventListener(k,fn){const items=this.events.get(k)||[];items.push(fn);this.events.set(k,items);}
 fire(k,extra={}){for(const fn of this.events.get(k)||[])fn({type:k,...extra});}
 dispatchEvent(e){this.fire(e.type);}
 append(...x){this.children.push(...x);}
 prepend(...x){this.children.unshift(...x);}
 setAttribute(){}
 getAttribute(k){return this.dataset[k]??"";}
}
function boot(day,storage=new Map(),learner="A"){
 storage.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const html=fs.readFileSync(path.join(base,"weeks/week-08/day-"+day+"/index.html"),"utf8");
 const nodes=new Map(),el=id=>{if(!nodes.has(id))nodes.set(id,new E());return nodes.get(id);};
 const fields=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const f=new E();f.dataset.saveField=m[1];return f;});
 const choices=[];
 const doc={body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelectorAll:sel=>sel==='[data-save-field][data-managed-save="week8"]'?fields:
   sel==='[data-workshop-part]'?el("workshop").children:[],
  querySelector:sel=>{const m=sel.match(/input\[name="w8q-(\d+)"\]:checked/);
   return m&&choices[Number(m[1])]!==undefined?{value:String(choices[Number(m[1])])}:null;},
  createElement:()=>new E(),createTextNode:t=>({textContent:t})};
 const local={getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:learner}),readJSON:()=>({}),isReady:()=>true,
  scopedKey:(key,p)=>key+":learner:"+p.learnerId},addEventListener(){}};
 if(day<40){
  el("week8-question-data").textContent=html.match(/id="week8-question-data">([\s\S]*?)<\/script>/)[1];
  for(let i=0;i<4;i++){const x=new E();x.dataset.workshopPart="Part "+i;el("workshop").children.push(x);}
 }
 if(day===40)fields.find(x=>x.dataset.saveField==="week-08-day40-perspective-character").value="coach";
 const ctx={window,document:doc,localStorage:local,Date,JSON,Math,Number,String,Object,Set,Map,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(daily,ctx);if(day===40)vm.runInContext(assess,ctx);
 return {el,fields,choices,storage,key:s=>s+":learner:"+learner};
}
const first=boot(36);
assert.equal(first.el("week8-next-wrap").hidden,true);
const bank=JSON.parse(first.el("week8-question-data").textContent).questions;
bank.forEach((q,i)=>first.choices[i]=i===0?(q.answer+1)%3:q.answer);
first.el("week8-check").fire("click");
assert.equal(JSON.parse(first.storage.get(first.key("khae-ela9-field:week-08-day-36-practice-v1"))).best,80);
assert.equal(first.el("week8-next-wrap").hidden,false,"80% immediate unlock");
assert.equal(boot(36,first.storage).el("week8-next-wrap").hidden,false,"Saved quiz mastery survives reopening");
assert.equal(boot(36,first.storage,"B").el("week8-next-wrap").hidden,true,"No cross-learner inheritance");
const stale=boot(37,new Map(),"C"),sKey=stale.key("khae-ela9-field:week-08-day37");
stale.storage.set(sKey,"A newer version");
stale.fields[0].value="Old tab writing";stale.fields[0].fire("input");
assert.equal(stale.storage.get(sKey),"A newer version","Stale-tab write blocked");
const work=boot(39);
const rewrite=work.fields.find(x=>x.dataset.saveField==="week-08-day39-perspective-draft");
rewrite.value="This original student perspective is stored separately from the planning field.";
rewrite.fire("input");
assert.equal(work.storage.get(work.key("khae-ela9-field:week-08-day39-perspective-draft")),rewrite.value);
const exam=boot(40),map=Object.fromEntries(exam.fields.map(x=>[x.dataset.saveField,x]));
const F=x=>map["week-08-day40-"+x],WC=t=>t.trim().split(/\s+/).length;
const analysis=("The narrator conceals the reason for fearing the red envelope while an earlier omission shapes both the reader's expectation and the final judgment of responsibility. ").repeat(18);
const perspective=("Coach Ren notices the unopened envelope and the student's hesitation, but his knowledge of the selection differs from the student's interpretation of being summoned. ").repeat(9);
const craft=("Changing the narrator from the student to Coach Ren reveals who knows the selection result and who lacks that knowledge. This change creates different reader expectations and allows the same gesture to carry a different meaning. ").repeat(3);
assert.ok(WC(analysis)>=350&&WC(analysis)<=500);
assert.ok(WC(perspective)>=180&&WC(perspective)<=260);
assert.ok(WC(craft)>=100&&WC(craft)<=140);
assert.equal(exam.el("week8-next-wrap").hidden,true);
F("analysis-draft").value=analysis;F("analysis-draft").fire("input");
exam.el("week8-lock-analysis").fire("click");
assert.equal(F("analysis-draft").readOnly,true,"Analysis Draft 1 locked");
F("analysis-final").value=analysis;F("analysis-final").fire("input");
F("perspective-draft").value=perspective;F("perspective-draft").fire("input");
exam.el("week8-lock-perspective").fire("click");
assert.equal(F("perspective-draft").readOnly,true,"Perspective Draft 1 locked");
F("perspective-final").value=perspective;F("perspective-final").fire("input");
F("craft-note").value=craft;F("craft-note").fire("input");
F("revision").value="I clarified the causal links in my evidence and revised which information Coach Ren notices at the start, preserving the two original independent drafts.";
F("revision").fire("input");
exam.el("week8-independent-check").checked=true;exam.el("week8-independent-check").fire("change");
exam.el("week8-revision-check").checked=true;exam.el("week8-revision-check").fire("change");
assert.equal(exam.el("week8-submit").disabled,false,"All requirements prepared");
exam.el("week8-submit").fire("click");
assert.equal(exam.el("week8-next-wrap").hidden,true,"Submitting is not passing");
for(const [k,v] of Object.entries({pov:2,structure:2,irony:1,evidence:1,language:1})){
 exam.el("week8-rubric-"+k).value=String(v);exam.el("week8-rubric-"+k).fire("change");
}
exam.el("week8-evaluator").value="Parent Educator";
exam.el("week8-feedback").value="Strengthen how the narrator's delayed disclosure changes the reader's interpretation.";
exam.el("week8-record-review").fire("click");
assert.equal(exam.el("week8-next-wrap").hidden,true,"7/10 cannot unlock next week");
exam.el("week8-rubric-evidence").value="2";exam.el("week8-rubric-evidence").fire("change");
exam.el("week8-record-review").fire("click");
assert.equal(exam.el("week8-next-wrap").hidden,false,"Human-entered 8/10 unlocks");
assert.equal(boot(40,exam.storage).el("week8-next-wrap").hidden,false,"Passing review persists");
F("perspective-final").value+=" Unreviewed edit.";F("perspective-final").fire("input");
assert.equal(exam.el("week8-next-wrap").hidden,true,"Changed writing invalidates previous review");
console.log("PASS Week08 behavior: learner-specific 80% unlock, independent draft records, stale-tab guard, 350–500 analysis, 180–260 perspective, 100–140 craft, 7/10 remediation, 8/10 educator unlock and revision invalidation.");
