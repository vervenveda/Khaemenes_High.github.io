import fs from "node:fs";import vm from "node:vm";import path from "node:path";
import assert from "node:assert/strict";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(root,"assets/week13-daily.js"),"utf8"),
 assess=fs.readFileSync(path.join(root,"assets/week13-assessment.js"),"utf8");
class E{
 constructor(){this.value="";this.textContent="";this.checked=false;this.disabled=false;this.hidden=true;this.readOnly=false;this.dataset={};this.children=[];this.events=new Map();this.classList={toggle(){}};}
 addEventListener(k,f){const v=this.events.get(k)||[];v.push(f);this.events.set(k,v);}
 fire(k,arg={}){for(const f of this.events.get(k)||[])f({type:k,...arg});}
 dispatchEvent(x){this.fire(x.type);}append(...a){this.children.push(...a);}prepend(...a){this.children.unshift(...a);}
 setAttribute(){}getAttribute(k){return this.dataset[k]||"";}
}
function boot(day,store=new Map(),student="A"){
 store.set("khaemenes_active_learner_v1",JSON.stringify(student));
 const html=fs.readFileSync(path.join(root,"weeks/week-13/day-"+day+"/index.html"),"utf8");
 const nodes=new Map(),el=id=>{if(!nodes.has(id))nodes.set(id,new E());return nodes.get(id);};
 const writing=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const f=new E();f.dataset.saveField=m[1];return f;});
 const picks=[];
 const doc={body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelectorAll:selector=>selector==='[data-save-field][data-managed-save="week13"]'?writing:
    selector==='[data-workshop-part]'?el("parts").children:[],
  querySelector:selector=>{const m=selector.match(/input\[name="w13q-(\d+)"\]:checked/);
   return m&&picks[Number(m[1])]!==undefined?{value:String(picks[Number(m[1])])}:null;},
  createElement:()=>new E(),createTextNode:t=>({textContent:t})};
 const storage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>student?{learnerId:student}:null,
  readJSON:()=>({}),isReady:()=>!!student,
  scopedKey:(k,p)=>k+":learner:"+p.learnerId
 },addEventListener(){}};
 if(day<65){
  el("week13-question-data").textContent=html.match(/id="week13-question-data">([\s\S]*?)<\/script>/)[1];
  for(let i=0;i<4;i++){const e=new E();e.dataset.workshopPart="Part "+i;el("parts").children.push(e);}
 }
 const ctx={window,document:doc,localStorage:storage,Date,JSON,Math,Object,Number,String,Map,Set,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(daily,ctx);
 if(day===65)vm.runInContext(assess,ctx);
 return {el,writing,picks,store,key:k=>k+":learner:"+student};
}
const a=boot(61);
assert.equal(a.el("week13-next-wrap").hidden,true,"Next button hidden before mastery");
const q=JSON.parse(a.el("week13-question-data").textContent).questions;
q.forEach((x,i)=>a.picks[i]=i===0?(x.answer+1)%3:x.answer);
a.el("week13-check").fire("click");
assert.equal(JSON.parse(a.store.get(a.key("khae-ela9-field:week-13-day-61-practice-v1"))).best,80);
assert.equal(a.el("week13-next-wrap").hidden,false,"80% immediately unlocks Day 62");
assert.equal(boot(61,a.store).el("week13-next-wrap").hidden,false,"Quiz score persists");
assert.equal(boot(61,a.store,"B").el("week13-next-wrap").hidden,true,"Learner B cannot inherit A score");
const stale=boot(62,new Map(),"C");
const k=stale.key("khae-ela9-field:week-13-day-62");
stale.store.set(k,"Newer learner writing");
stale.writing[0].value="Stale tab";stale.writing[0].fire("input");
assert.equal(stale.store.get(k),"Newer learner writing","Concurrent tab protection");
const exam=boot(65),by=Object.fromEntries(exam.writing.map(x=>[x.dataset.saveField,x]));
const f=key=>by[key?"week-13-day65-"+key:"week-13-day-65"],wc=x=>x.trim().split(/\s+/).length;
const analysis=("Mara and Elias reveal competing objectives through interrupted gestures and narrowly framed statements while the audience still lacks complete knowledge about the envelope. ").repeat(19);
const reflection=("The scene shows that dialogue and physical staging create different interpretive possibilities. I can support a choice without claiming the characters' unseen motives are certain. ").repeat(8);
assert.ok(wc(analysis)>=400&&wc(analysis)<=550);
assert.ok(wc(reflection)>=150&&wc(reflection)<=250);
f("analysis").value=analysis;f("analysis").fire("input");
f("reflection").value=reflection;f("reflection").fire("input");
f("plan-a").value="Mara stands beside the envelope close to the audience while Elias watches from the doorway. She faces out on the last line and allows a deliberate silence before it.";
f("plan-a").fire("input");
f("plan-b").value="Elias stands near the envelope, but refuses to cross the space. Mara stays by the window until the train sounds, then slowly turns toward the audience, creating a different focus.";
f("plan-b").fire("input");
f("director-note").value="The envelope placement draws attention to the unspoken argument. The halted reach signals possible withholding without proving motive, and Mara's audience-facing gaze invites the viewers to test the wording of Elias's denial.";
f("director-note").fire("input");
f("rehearsal").value="After a table read, I slowed Mara's final turn and shortened the earlier pause. That lets Elias's distinction register before Mara confronts the audience.";
f("rehearsal").fire("input");
exam.el("week13-independent").checked=true;exam.el("week13-independent").fire("change");
exam.el("week13-evidence-confirm").checked=true;exam.el("week13-evidence-confirm").fire("change");
assert.equal(exam.el("week13-submit").disabled,false,"Complete independent evidence can submit");
exam.el("week13-submit").fire("click");
assert.equal(exam.el("week13-next-wrap").hidden,true,"Submission does not award mastery");
for(const [key,val] of Object.entries({interpretation:2,evidence:2,directing:1,alternative:1,conventions:1})){
 exam.el("week13-rubric-"+key).value=String(val);
 exam.el("week13-rubric-"+key).fire("change");
}
exam.el("week13-evaluator").value="Parent Educator";
exam.el("week13-feedback").value="Clarify how the actor's sight line and purposeful silence support a competing interpretation.";
exam.el("week13-record-review").fire("click");
assert.equal(exam.el("week13-next-wrap").hidden,true,"7/10 stays locked");
exam.el("week13-rubric-directing").value="2";exam.el("week13-rubric-directing").fire("change");
exam.el("week13-record-review").fire("click");
assert.equal(exam.el("week13-next-wrap").hidden,false,"8/10 human review unlocks next lesson");
assert.equal(boot(65,exam.store).el("week13-next-wrap").hidden,false,"Pass persists reload");
f("analysis").value+=" A new unreviewed detail.";f("analysis").fire("input");
assert.equal(exam.el("week13-next-wrap").hidden,true,"Changed writing invalidates old rubric");
console.log("PASS Week13 behavior: 80% formative navigation, learner isolation, cross-tab safety, 400–550 scene analysis, 150–250 reflection, director's notebook, 7/10 correction and 8/10 reviewed progression.");
