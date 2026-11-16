/* Khaemenes Academy | English 9–12 Evidence Studio regression
 * node --test courses/language-arts/tests/english-9-12-evidence-studio-regression.mjs
 * Native Node; synthetic learner IDs; never writes student accounts or gradebooks.
 */
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const languageArts=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const shared=path.resolve(languageArts,"..","shared");
const js=fs.readFileSync(path.join(shared,"english-evidence-studio-v1.js"),"utf8");
const css=fs.readFileSync(path.join(shared,"english-evidence-studio-v1.css"),"utf8");
const file=(grade,suffix)=>fs.readFileSync(path.join(languageArts,"english-"+grade,suffix),"utf8");
const prefix="khae-english-evidence-studio-v1";

class Node {
 constructor(tag="div"){this.tagName=tag.toUpperCase();this.children=[];this.textContent="";this.value="";this.disabled=false;this.hidden=false;this.style={};this.dataset={};this.handlers={};this.href="";}
 append(...nodes){this.children.push(...nodes)}
 click(){this.clicked=true}
 remove(){this.removed=true}
 replaceChildren(...nodes){this.children=[...nodes]}
 addEventListener(type,handler){this.handlers[type]=handler}
}

function mock(grade,learnerId="demo-A",entries=new Map(),simulateStorageFailure=false){
 const names=["evidenceStudio","es-save-status","es-week","es-source","es-grade-goals","es-coaching","es-checklist","es-indicator","es-week-heading","es-grade-heading","es-question","es-reading-link","es-log-link","es-week-link","es-portfolio-link","es-progress-link","es-second-chain","es-third-chain","es-defensive","es-save","es-export","es-print","es-claim","es-evidence1","es-locator1","es-reason1","es-evidence2","es-locator2","es-reason2","es-evidence3","es-locator3","es-reason3","es-counter","es-sourceNotes","es-draft","es-feedback","es-revised","es-reflection","es-defense"];
 const nodes=Object.fromEntries(names.map(key=>[key,new Node()]));
 const profile=learnerId?{learnerId,name:"Synthetic Learner"}:null;
 const exported=[];
 let printCalls=0;
 class MockURL extends URL{
  static createObjectURL(blob){exported.push(JSON.parse(blob.parts.join("")));return "blob:synthetic"}
  static revokeObjectURL(){}
 }
 class MockBlob{constructor(parts){this.parts=parts}}
 const storageKey=base=>base+":learner:"+encodeURIComponent(learnerId);
 const contract={
   readAcademyProfile:()=>profile,
   readJSON:(key,alternative)=>entries.has(storageKey(key))?JSON.parse(JSON.stringify(entries.get(storageKey(key)))):alternative,
   writeJSON:(key,value)=>{
     if(!profile)throw Error("Cannot save anonymous records");
     if(simulateStorageFailure)throw Error("QuotaExceededError");
     entries.set(storageKey(key),JSON.parse(JSON.stringify(value)));
   },
   scopedKey:storageKey
 };
 const curriculum=grade===9
  ?{weekPlans:Array.from({length:36},(_,i)=>({n:i+1,unit:Math.ceil((i+1)/3),title:"Week "+(i+1),readingSuggestion:{title:"Story "+(i+1),author:"Author",purpose:"Evidence practice"}}))}
  :{weeks:Array.from({length:36},(_,i)=>({week:i+1,title:"Week "+(i+1)})),readingAssignments:Array.from({length:36},(_,i)=>({week:i+1,unit:Math.ceil((i+1)/3),title:"Story "+(i+1),author:"Author",purpose:"Evidence practice"}))};
 const events={};
 const win={KhaemenesCourseEntryContract:contract,addEventListener:(type,handler)=>{events[type]=handler},print:()=>{printCalls++}};
 win["ENGLISH_"+grade+"_CURRICULUM"]=curriculum;
 const doc={documentElement:{dataset:{evidenceGrade:String(grade)}},getElementById:key=>nodes[key]||null,querySelector:()=>null,createElement:tag=>new Node(tag),createTextNode:value=>({textContent:value}),body:{append(){}}};
 const sandbox={window:win,document:doc,location:{search:"?week=1"},URL:MockURL,URLSearchParams,Blob:MockBlob,setTimeout};
 vm.runInNewContext(js,sandbox,{timeout:2000,filename:"english-evidence-studio-v1.js"});
 return {nodes,entries,storageKey,events,exported,get printCalls(){return printCalls}};
}
test("shared engine compiles, never touches official scores or mastery, and preserves VNV/KA layout",()=>{
 new vm.Script(js);
 assert.match(js,/writeJSON\(weekKey\(currentWeek\)/);
 assert.doesNotMatch(js,/assessment\.best\s*=|projectScore\s*=|mastery\.approved\s*=|certification\s*=/);
 assert.match(css,/--es-radius:7px/);
 assert.match(css,/max-width:1100px/);
 assert.match(css,/font:400/);
});
test("four student pages contain complete, valid studio field surface",()=>{
 const ids=["evidenceStudio","es-week","es-claim","es-evidence1","es-evidence2","es-evidence3","es-reason1","es-counter","es-draft","es-feedback","es-revised","es-reflection","es-save","es-export","es-print"];
 for(const grade of [9,10,11,12]){
  const html=file(grade,"evidence-studio.html");
  assert.match(html,new RegExp('data-evidence-grade="'+grade+'"'));
  for(const id of ids)assert.ok(html.includes('id="'+id+'"'),"English "+grade+": missing "+id);
  assert.match(html,/english-evidence-studio-v1\.js/);
  assert.match(html,/curriculum-data\.js/);
  assert.match(html,/Student Portfolio/);
 }
});
test("all four courses expose studio in home, Reading Headquarters, Student Progress, and Portfolio",()=>{
 for(const grade of [9,10,11,12]){
  assert.match(file(grade,"index.html"),/href="evidence-studio\.html"/);
  assert.match(file(grade,"reading-list.html"),/href="evidence-studio\.html/);
  for(const suffix of ["records/progress-report.html","portfolio/index.html"]){
   const html=file(grade,suffix);
   assert.match(html,/data-evidence-studio-summary/);
   assert.match(html,/english-evidence-studio-v1\.js/);
  }
 }
});
test("canonical 36-week reading assignments remain present and reused, never copied into new course data",()=>{
 for(const grade of [9,10,11,12]){
  const code=file(grade,"assets/curriculum-data.js");
  const sandbox={window:{}};
  vm.runInNewContext(code,sandbox,{timeout:4000});
  const data=sandbox.window["ENGLISH_"+grade+"_CURRICULUM"];
  const readings=grade===9?data.weekPlans.map(w=>w.readingSuggestion):data.readingAssignments;
  assert.equal(readings.length,36);
  assert.ok(readings.every(x=>x&&x.title&&x.author),"English "+grade+" missing canonical assignment");
 }
});
test("four-grade draft, revision, week isolation and challenge visibility",()=>{
 const entries=new Map();
 for(const grade of [9,10,11,12]){
  const {nodes,storageKey}=mock(grade,"demo-A",entries);
  assert.match(nodes["es-grade-heading"].textContent,new RegExp("English "+grade));
  assert.match(nodes["es-source"].children[0].textContent,/Story 1/);
  nodes["es-claim"].value="An arguable thesis";nodes["es-claim"].handlers.input();
  nodes["es-draft"].value="An original analytical draft";nodes["es-draft"].handlers.input();
  nodes["es-revised"].value="An improved, revised analytical draft";nodes["es-revised"].handlers.input();
  const saved=entries.get(storageKey(prefix+":english-"+grade+":week-01"));
  assert.equal(saved.fields.revised,"An improved, revised analytical draft");
  assert.equal(nodes["es-third-chain"].hidden,grade<11);
  assert.equal(nodes["es-defensive"].hidden,grade!==12);
  nodes["es-week"].value="2";nodes["es-week"].handlers.change();
  assert.match(nodes["es-source"].children[0].textContent,/Story 2/);
  assert.equal(nodes["es-claim"].value,"");
 }
});
test("learner isolation is strict; anonymous record cannot be saved",()=>{
 const records=new Map();
 const {nodes,storageKey}=mock(11,"demo-A",records);
 nodes["es-claim"].value="Private learner A claim";nodes["es-claim"].handlers.input();
 assert.ok(records.has(storageKey(prefix+":english-11:week-01")));
 const second=mock(11,"demo-B",records);
 assert.equal(second.nodes["es-claim"].value,"");
 assert.equal(second.entries.has(second.storageKey(prefix+":english-11:week-01")),false);
 const anonymous=mock(11,null,records);
 assert.equal(anonymous.nodes["es-claim"].disabled,true);
 assert.equal(anonymous.nodes["es-save-status"].dataset.status,"warning");
});

test("cross-tab change strictly locks all future saves and exports for the stale record",()=>{
 for(const grade of [9,10,11,12]){
  const entries=new Map();
  const {nodes,storageKey,events}=mock(grade,"demo-A",entries);
  nodes["es-claim"].value="First saved version";
  nodes["es-claim"].handlers.input();
  const key=storageKey(prefix+":english-"+grade+":week-01");
  const newer=JSON.parse(JSON.stringify(entries.get(key)));
  newer.fields.claim="Newer version from another tab";
  entries.set(key,newer);
  events.storage({key});
  assert.equal(nodes["es-save"].disabled,true);
  assert.equal(nodes["es-export"].disabled,true);
  nodes["es-claim"].value="Stale overwrite attempt";
  nodes["es-save"].handlers.click();
  assert.equal(entries.get(key).fields.claim,"Newer version from another tab","English "+grade+" must not overwrite another tab");
  assert.match(nodes["es-save-status"].textContent,/Save blocked/);
 }
});
test("active learner event also locks save, even without an unsaved edit",()=>{
 const {nodes,events}=mock(11,"demo-A",new Map());
 events.storage({key:"khaemenes_active_learner_v1"});
 assert.equal(nodes["es-save"].disabled,true);
 assert.equal(nodes["es-export"].disabled,true);
 assert.equal(nodes["es-claim"].disabled,true);
 assert.match(nodes["es-save-status"].textContent,/saving paused/i);
});

test("all four grades can export and print an unsaved draft after local storage failure",()=>{
 for(const grade of [9,10,11,12]){
  const session=mock(grade,"demo-A",new Map(),true);
  const {nodes,exported}=session;
  nodes["es-claim"].value="A thesis preserved despite QuotaExceededError";
  nodes["es-claim"].handlers.input();
  assert.equal(nodes["es-save-status"].dataset.status,"warning");
  nodes["es-export"].handlers.click();
  assert.equal(exported.length,1,"English "+grade+" should create a recovery export");
  assert.equal(exported[0].persistedOnDevice,false);
  assert.equal(exported[0].record.fields.claim,"A thesis preserved despite QuotaExceededError");
  assert.equal(exported[0].learnerId,"demo-A");
  assert.match(nodes["es-save-status"].textContent,/NOT safely stored/);
  nodes["es-print"].handlers.click();
  assert.equal(session.printCalls,1,"English "+grade+" should allow printing after save fails");
 }
});
test("conflict lock prevents export and printing stale drafts",()=>{
 const session=mock(12,"demo-A",new Map());
 session.events.storage({key:"khaemenes_active_learner_v1"});
 session.nodes["es-export"].handlers.click();
 session.nodes["es-print"].handlers.click();
 assert.equal(session.exported.length,0);
 assert.equal(session.printCalls,0);
});
test("anonymous learner cannot export or print a student draft",()=>{
 const session=mock(9,null,new Map());
 session.nodes["es-export"].handlers.click();
 session.nodes["es-print"].handlers.click();
 assert.equal(session.exported.length,0);
 assert.equal(session.printCalls,0);
});
