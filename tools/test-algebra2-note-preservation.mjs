import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const source=fs.readFileSync("courses/mathematics/algebra-2/assets/lesson-tools.js","utf8");
new vm.Script(source);
function store(){
 const data=new Map();
 return {data,get length(){return data.size;},key:i=>[...data.keys()][i]??null,
 getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),
 removeItem:k=>data.delete(k)};
}
const storage=store();
const lessonKey="khaemenes-algebra2-lesson-progress-v1";
let count=0,blocked=false,clock=1_790_000_000_000;
const reports=[];
function page({lesson="u11-l08",learner="student-a",session=store(),existingStore=storage}={}){
 let created=0;
 const elements=new Map();
 function make(tag,id="generated-"+(++created)){
  const callbacks=new Map();
  const node={tagName:tag.toUpperCase(),id,textContent:"",value:"",checked:false,disabled:false,
   hidden:false,style:{cssText:""},dataset:{},parentNode:null,children:[],attrs:{},files:null,callbacks,
   addEventListener:(key,fn)=>callbacks.set(key,fn),setAttribute:(k,v)=>{node.attrs[k]=v;},
   appendChild:(c)=>{c.parentNode=node;node.children.push(c);return c;},
   append(...kids){for(const kid of kids)this.appendChild(kid);},
   get firstChild(){return this.children[0]||null;},
   closest:()=>null,click(){callbacks.get("click")?.();}
  };
  elements.set(id,node);return node;
 }
 const main=make("main","main"),card=make("article","card"),actions=make("div","actions");
 const note=make("textarea","lessonNote"),save=make("button","saveLessonNote"),complete=make("input","lessonComplete");
 const status=make("p","lessonStatus"),print=make("button","printLesson");
 main.appendChild(card);card.append(note,complete,status,actions);actions.appendChild(save);actions.appendChild(print);
 const body={dataset:{lessonId:lesson}};
 let activeLearner=learner;
 const scope=(key)=>key+":learner:"+activeLearner;
 const progression={
  storageKey:scope,
  readJSON:(key,fallback)=>{try{return JSON.parse(existingStore.getItem(scope(key))||"null")||fallback;}catch{return fallback;}},
  writeJSON:(key,value)=>{if(blocked)return false;existingStore.setItem(scope(key),JSON.stringify(value));return true;}
 };
 const document={body,currentScript:{src:"https://academy.example/courses/mathematics/algebra-2/assets/lesson-tools.js"},
  createElement:tag=>make(tag),getElementById:id=>elements.get(id)||null,
  querySelector:key=>key==="main"?main:null,head:{appendChild(){}}};
 const listeners=new Map(),pending=[];
 const window={KhaemenesAlgebra2Progression:progression,confirm:()=>true,
  addEventListener:(key,fn)=>listeners.set(key,fn)};
 const download=[];
 const localBlob=class {constructor(parts,options){this.parts=parts;this.options=options;}};
 const url={createObjectURL:obj=>{download.push(obj);return "blob:test";},revokeObjectURL(){}};
 const context=vm.createContext({document,window,localStorage:existingStore,sessionStorage:session,
  URL:{...url},Blob:localBlob,console,Math,Date:class extends Date{constructor(...args){super(...(args.length?args:[clock]));}static now(){return clock;}},
  setTimeout:fn=>{pending.push(fn);return pending.length;},clearTimeout:()=>{},
  print:()=>{},location:{reload(){}}});
 // The only URL use is from the lazy script recovery path; normal progression is ready.
 vm.runInContext(source,context,{timeout:2500});
 const buttons=()=>card.children.flatMap(c=>c.children||[]).filter(c=>c.tagName==="BUTTON");
 const label=s=>buttons().find(b=>b.textContent===s);
 const event=(el,type,fields={})=>{const cb=el.callbacks.get(type);assert.ok(cb,"listener "+type);return cb({target:el,...fields});};
 const state=()=>window.KhaemenesAlgebra2NoteRecovery?.status;
 const key=scope(lessonKey);
 const record=()=>progression.readJSON(lessonKey,{})[lesson]||{};
 const setText=text=>{note.value=text;event(note,"input");};
 const flush=()=>listeners.get("pagehide")?.();
 const clickSave=()=>event(save,"click");
 const switchLearner=id=>{activeLearner=id;listeners.get("storage")?.({key:"khaemenes_active_learner_v1"});};
 return {window,document,elements,main,card,actions,buttons,label,event,flush,setText,clickSave,state,key,record,
  note,complete,status,save,session,progression,storage:existingStore,learner,lesson,downloads:download,pending,scope,switchLearner};
}
let a=page();
assert.equal(a.state().seenNote,"");
assert.ok(a.label("Export note JSON"),"export button available");
assert.ok(a.label("Import note JSON"),"import button available");
a.setText("An unfinished triangle solution");
a.flush();
assert.ok([...storage.data.keys()].some(k=>k.includes("note-drafts-v2")&&k.includes("u11-l08")),
 "unsaved draft is held in learner-scoped storage");
let reload=page({session:a.session});
assert.equal(reload.note.value,"An unfinished triangle solution","unfinished text survives reload");
assert.ok(reload.main.children.includes(reload.card),"lesson intact");
reload.clickSave();
assert.equal(reload.record().note,"An unfinished triangle solution");
assert.ok(reload.card.children.some(n=>n.id==="algebra2NoteFeedback"&&n.attrs["aria-live"]==="polite"));
let b=page({lesson:"u11-l07"});
b.setText("Work on a different lesson");b.clickSave();
assert.equal(b.record().note,"Work on a different lesson");
assert.equal(reload.record().note,"An unfinished triangle solution","other lesson saved without overwrite");
a=page({session:a.session});
b=page({session:b.session});
a.complete.checked=true;a.event(a.complete,"change");
assert.equal(a.record().complete,true,"completion persisted");
const before=b.record().note;
b.setText("A second independent note");
b.clickSave();
assert.equal(b.record().complete,true,"saving text preserves newer completion");
assert.equal(b.record().note,"A second independent note");
assert.notEqual(before,b.record().note);
const p1=page({lesson:"u11-l06"});
const p2=page({lesson:"u11-l06"});
p1.setText("First tab's evidence");p1.clickSave();
p2.setText("Second tab's different evidence");p2.flush();p2.clickSave();
assert.equal(p2.record().note,"First tab's evidence","conflicting stale save blocked");
assert.equal(p2.state().conflict,true);
assert.equal(p2.label("Review and overwrite newer saved note").hidden,false);
assert.ok(p2.state().draftPresent);
assert.ok(p2.card.children.find(n=>n.id==="algebra2NoteFeedback")?.textContent.includes("Another tab"));
const exportBtn=p2.label("Export note JSON");
p2.event(exportBtn,"click");
assert.equal(p2.downloads.length,1);
const payload=JSON.parse(p2.downloads[0].parts[0]);
assert.equal(payload.note,"Second tab's different evidence");
assert.equal(payload.lesson,"u11-l06");
assert.equal(payload.schema,"khaemenes-algebra2-lesson-note-v1");
const conflictButton=p2.label("Review and overwrite newer saved note");
p2.event(conflictButton,"click");
assert.equal(p2.record().note,"Second tab's different evidence","explicit confirmation allows replacement");
assert.equal(p2.state().conflict,false);
assert.ok([...storage.data.values()].some(raw=>{
 try{return JSON.parse(raw)?.reason==="overwritten-saved-copy"&&JSON.parse(raw).note==="First tab's evidence";}
 catch{return false;}
}),"previous saved text archived before replacement");
// A different learner cannot inherit draft or progress from this profile.
const otherStudent=page({learner:"student-b",lesson:"u11-l06"});
assert.equal(otherStudent.note.value,"");
assert.equal(otherStudent.record().note,undefined);
assert.equal(otherStudent.state().draftPresent,false);
otherStudent.setText("Different student");otherStudent.clickSave();
assert.equal(otherStudent.record().note,"Different student");
assert.equal(p2.record().note,"Second tab's different evidence");
// A failing storage write must not report success or destroy the unsaved text.
const fail=page({lesson:"u11-l05"});
fail.setText("Do not lose this proof");blocked=true;fail.clickSave();blocked=false;
assert.equal(fail.record().note,undefined);
assert.ok(fail.card.children.find(n=>n.id==="algebra2NoteFeedback")?.textContent.includes("Saving failed"));
const reOpen=page({lesson:"u11-l05",session:fail.session});
assert.equal(reOpen.note.value,"Do not lose this proof","failed-save draft recovered");
reOpen.clickSave();assert.equal(reOpen.record().note,"Do not lose this proof");
// Import only imports correct-lesson JSON as an uncommitted draft.
const importPage=page({lesson:"u11-l04"});
const fileInput=importPage.card.children.find(n=>n.tagName==="INPUT"&&n.attrs["aria-label"]?.includes("Import"));
assert.ok(fileInput);
const original="Stable work";
importPage.setText(original);importPage.clickSave();
fileInput.files=[{size:250,text:async()=>JSON.stringify({...payload,lesson:"u11-l04",note:"Imported notes"})}];
await importPage.event(fileInput,"change");
assert.equal(importPage.note.value,"Imported notes");
assert.equal(importPage.record().note,original,"import must not overwrite official note without Save");
importPage.clickSave();assert.equal(importPage.record().note,"Imported notes");
fileInput.files=[{size:180,text:async()=>JSON.stringify({...payload,lesson:"u11-l09"})}];
await importPage.event(fileInput,"change");
assert.equal(importPage.record().note,"Imported notes","wrong-lesson import rejected");
// Duplicated tabs may inherit sessionStorage values. Their drafts must still be separate.
const copiedSession=store();
copiedSession.setItem("cloned-session-placeholder","same-session-value");
const originalTab=page({lesson:"u11-l03",session:copiedSession});
const clonedSession=store();
for(const [key,value] of copiedSession.data)clonedSession.setItem(key,value);
const duplicateTab=page({lesson:"u11-l03",session:clonedSession});
originalTab.setText("Original tab's unfinished paragraph");
originalTab.flush();
duplicateTab.setText("Duplicated tab's separate notes");
duplicateTab.flush();
const siblingDrafts=[...storage.data].filter(([key])=>key.includes("note-drafts-v2")&&key.includes("u11-l03"))
 .map(([key,raw])=>({key,...JSON.parse(raw)}));
assert.ok(siblingDrafts.some(d=>d.note==="Original tab's unfinished paragraph"),"original tab's draft retained");
assert.ok(siblingDrafts.some(d=>d.note==="Duplicated tab's separate notes"),"duplicate tab did not overwrite original");
assert.ok(new Set(siblingDrafts.map(d=>d.key)).size>=2,"separate physical draft records");

// Switching the active learner while a lesson is open must not save the former
// learner's note or completion checkbox into the second student's records.
const staleTab=page({lesson:"u11-l02",learner:"student-switch-a"});
staleTab.setText("Private evidence belonging to student A");
staleTab.switchLearner("student-switch-b");
staleTab.clickSave();
assert.equal(staleTab.note.disabled,true,"stale note editor locked");
assert.equal(staleTab.save.disabled,true,"stale save control locked");
assert.equal(staleTab.complete.disabled,true,"stale completion control locked");
assert.equal(storage.getItem(staleTab.scope(lessonKey)),null,"no course record created for student B");
assert.ok(staleTab.card.children.find(n=>n.id==="algebra2NoteFeedback")?.textContent.includes("profile changed"));
assert.ok([...storage.data].some(([key,raw])=>key.includes("student-switch-a")&&key.includes("u11-l02")&&
 (()=>{try{return JSON.parse(raw).note==="Private evidence belonging to student A"}catch{return false}})()),
 "old learner's in-progress text retained only under original learner's draft prefix");

// If another tab saves while the overwrite confirmation is on screen, the
// overwrite must stop and require a new review instead of deleting that update.
const waitingTab=page({lesson:"u11-l01"});
const firstWriter=page({lesson:"u11-l01"});
firstWriter.setText("Initial newer saved note");firstWriter.clickSave();
waitingTab.setText("Waiting tab's revision");waitingTab.clickSave();
assert.equal(waitingTab.state().conflict,true);
waitingTab.window.confirm=()=>{
 const simultaneous=page({lesson:"u11-l01"});
 simultaneous.setText("Third tab saved while the dialog was open");
 simultaneous.clickSave();return true;
};
waitingTab.event(waitingTab.label("Review and overwrite newer saved note"),"click");
assert.equal(waitingTab.record().note,"Third tab saved while the dialog was open",
 "newest cross-tab note must not be overwritten during confirmation");
assert.equal(waitingTab.state().conflict,true);
assert.ok(waitingTab.card.children.find(n=>n.id==="algebra2NoteFeedback")?.textContent.includes("changed again"));

reports.push("unsaved draft recovery","cross-lesson merge","completion merge","two-tab conflict","confirmed overwrite backup","per-learner separation","storage failure","safe JSON export/import","duplicated tab isolation","learner-switch protection","overwrite confirmation race protection");
console.log("PASS: Algebra II local note protection: "+reports.join(", ")+".");
