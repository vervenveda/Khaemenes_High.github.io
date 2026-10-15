import fs from "node:fs";import path from "node:path";import vm from "node:vm";
import assert from "node:assert/strict";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const daily=fs.readFileSync(path.join(root,"assets/week10-daily.js"),"utf8");
const assessment=fs.readFileSync(path.join(root,"assets/week10-assessment.js"),"utf8");
class El{
 constructor(){this.value="";this.textContent="";this.hidden=true;this.disabled=false;this.readOnly=false;this.checked=false;this.dataset={};this.handlers=new Map();this.children=[];this.classList={toggle(){}};}
 addEventListener(k,f){const a=this.handlers.get(k)||[];a.push(f);this.handlers.set(k,a);}
 fire(k,extra={}){for(const f of this.handlers.get(k)||[])f({type:k,...extra});}
 dispatchEvent(e){this.fire(e.type);}
 append(...v){this.children.push(...v);}prepend(...v){this.children.unshift(...v);}
 setAttribute(){}getAttribute(k){return this.dataset[k]||"";}
}
function launch(day,storage=new Map(),learner="A"){
 storage.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 const html=fs.readFileSync(path.join(root,"weeks/week-10/day-"+day+"/index.html"),"utf8");
 const elements=new Map(),el=id=>{if(!elements.has(id))elements.set(id,new El());return elements.get(id);};
 const fields=[...html.matchAll(/data-save-field="([^"]+)"/g)].map(m=>{const f=new El();f.dataset.saveField=m[1];return f;});
 const picks=[];
 const document={body:{getAttribute:()=>String(day),append(){}},getElementById:el,
  querySelectorAll:selector=>selector==='[data-save-field][data-managed-save="week10"]'?fields:
  selector==='[data-workshop-part]'?el("workshop").children:[],
  querySelector:selector=>{const m=selector.match(/input\[name="w10q-(\d+)"\]:checked/);
   return m&&picks[Number(m[1])]!==undefined?{value:String(picks[Number(m[1])])}:null;},
  createElement:()=>new El(),createTextNode:t=>({textContent:t})};
 const localStorage={getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{
  readAcademyProfile:()=>({learnerId:learner}),readJSON:()=>({}),isReady:()=>true,
  scopedKey:(k,p)=>k+":learner:"+p.learnerId},addEventListener(){}};
 if(day<50){
  el("week10-question-data").textContent=html.match(/id="week10-question-data">([\s\S]*?)<\/script>/)[1];
  for(let i=0;i<4;i++){const f=new El();f.dataset.workshopPart="Part "+i;el("workshop").children.push(f);}
 }
 const ctx={document,window,localStorage,Date,JSON,Math,Number,String,Object,Set,Map,Blob,console,
  Event:class{constructor(type){this.type=type;}},setTimeout(){},confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(daily,ctx);if(day===50)vm.runInContext(assessment,ctx);
 return {el,picks,storage,fields,key:s=>s+":learner:"+learner};
}
const a=launch(46);
assert.equal(a.el("week10-next-wrap").hidden,true);
const questions=JSON.parse(a.el("week10-question-data").textContent).questions;
questions.forEach((q,i)=>a.picks[i]=i===0?(q.answer+1)%3:q.answer);
a.el("week10-check").fire("click");
assert.equal(JSON.parse(a.storage.get(a.key("khae-ela9-field:week-10-day-46-practice-v1"))).best,80);
assert.equal(a.el("week10-next-wrap").hidden,false,"80% immediate next lesson");
assert.equal(launch(46,a.storage).el("week10-next-wrap").hidden,false,"Mastery persists");
assert.equal(launch(46,a.storage,"B").el("week10-next-wrap").hidden,true,"Learner isolation");
const stale=launch(47,new Map(),"C");
const key=stale.key("khae-ela9-field:week-10-day-47");
stale.storage.set(key,"Newer writing");stale.fields[0].value="Stale writing";stale.fields[0].fire("input");
assert.equal(stale.storage.get(key),"Newer writing","Stale tab protection");
const student=launch(49),f=Object.fromEntries(student.fields.map(x=>[x.dataset.saveField,x]));
f["week-10-day49-poem1-draft"].value="New image\n".repeat(14);f["week-10-day49-poem1-draft"].fire("input");
assert.equal(student.storage.get(student.key("khae-ela9-field:week-10-day49-poem1-draft")),f["week-10-day49-poem1-draft"].value);
const exam=launch(50),parts=Object.fromEntries(exam.fields.map(x=>[x.dataset.saveField,x]));
const F=k=>parts["week-10-day50-"+k],wordCount=t=>t.trim().split(/\s+/).length;
const poemA=Array.from({length:15},(_,i)=>"The sidewalk gathers the quiet image "+(i+1)+".").join("\n");
const poemB=Array.from({length:10},(_,i)=>"A blue bowl remembers another road "+(i+1)+".").join("\n");
const analysis=("The speaker observes everyday objects, and the withheld explanations invite more than one interpretation. Specific images and a gradual structural shift create the poem's restrained tone. ").repeat(12);
const craft=("I chose a single sensory image to keep the attention close to the speaker. Changing the viewpoint altered how the object felt. I moved one line break to emphasize the final hesitation. ").repeat(4);
assert.ok(wordCount(analysis)>=300&&wordCount(analysis)<=450);
assert.ok(wordCount(craft)>=120&&wordCount(craft)<=180);
F("poem1-draft").value=poemA;F("poem1-draft").fire("input");
exam.el("week10-lock-poem1").fire("click");assert.equal(F("poem1-draft").readOnly,true,"Poem 1 original preserved");
F("poem2-draft").value=poemB;F("poem2-draft").fire("input");
exam.el("week10-lock-poem2").fire("click");assert.equal(F("poem2-draft").readOnly,true,"Poem 2 original preserved");
F("poem1-final").value=poemA.replace("quiet image","silver shadow");F("poem1-final").fire("input");
F("poem2-final").value=poemB.replace("blue bowl","lost mitten");F("poem2-final").fire("input");
F("poem1-revision").value="Before I used a generic image. After I chose silver shadow so readers could feel the storm's residue.";F("poem1-revision").fire("input");
F("poem2-revision").value="Before I held the object without emphasis. After I repositioned the second line to change how the speaker sounds.";F("poem2-revision").fire("input");
F("analysis").value=analysis;F("analysis").fire("input");
F("craft-note").value=craft;F("craft-note").fire("input");
F("reflection").value="I connect evidence and inference more carefully and choose line breaks based on their effect, not just how they look on the screen.";F("reflection").fire("input");
exam.el("week10-independent").checked=true;exam.el("week10-independent").fire("change");
exam.el("week10-revision-check").checked=true;exam.el("week10-revision-check").fire("change");
assert.equal(exam.el("week10-submit").disabled,false,"Prepared assessment may be submitted");
exam.el("week10-submit").fire("click");
assert.equal(exam.el("week10-next-wrap").hidden,true,"Submission alone never unlocks");
for(const [k,v] of Object.entries({claim:2,evidence:2,craft:1,revision:1,clarity:1})){
 exam.el("week10-rubric-"+k).value=String(v);exam.el("week10-rubric-"+k).fire("change");
}
exam.el("week10-evaluator").value="Parent Reviewer";exam.el("week10-feedback").value="Deepen the inference and explain why the structural feature changes the closing tone.";
exam.el("week10-record-review").fire("click");
assert.equal(exam.el("week10-next-wrap").hidden,true,"7/10 must not unlock");
exam.el("week10-rubric-craft").value="2";exam.el("week10-rubric-craft").fire("change");
exam.el("week10-record-review").fire("click");
assert.equal(exam.el("week10-next-wrap").hidden,false,"Human-entered 8/10 unlocks");
assert.equal(launch(50,exam.storage).el("week10-next-wrap").hidden,false,"Reviewed mastery survives reload");
F("poem1-final").value+="\nUnreviewed line.";F("poem1-final").fire("input");
assert.equal(exam.el("week10-next-wrap").hidden,true,"Revision invalidates matching review");
console.log("PASS English9 Week10 behavior: learner 80% quiz mastery, separate poem drafts, stale-tab protection, analysis and craft ranges, locked originals, 7/10 remediation, 8/10 human review and stale-review invalidation.");
