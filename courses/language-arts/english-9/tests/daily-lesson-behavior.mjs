
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const source=fs.readFileSync(path.join(root,"assets/daily-lesson.js"),"utf8");

function harness(day=1,values=new Map(),learner="learner-a"){
  const get=(key)=>values.has(key)?values.get(key):null;
  const put=(key,value)=>values.set(String(key),String(value));
  const fieldNames=day===1?
    ["week-01-day1-observations","week-01-day1-baseline","week-01-day1-reflection"]:
    ["week-01-day4-plan","week-01-day4-analysis","week-01-day4-revision","week-01-day4-reflection"];
  const bank=JSON.parse(fs.readFileSync(path.join(root,"weeks/week-01/day-"+String(day).padStart(2,"0")+"/index.html"),"utf8").match(/id="daily-exercise-data">([\s\S]*?)<\/script>/)[1]);
  const events=new Map(),feedback=[],responses=[];
  class Element{
    constructor(kind){this.kind=kind;this.dataset={};this.value="";this.checked=false;this.disabled=false;this.hidden=true;this.textContent="";this.children=[];this.handlers={};this.style={};this.className="";this.attributes={};this.classList={add(){},remove(){}};}
    append(...args){this.children.push(...args);}
    appendChild(x){this.children.push(x);return x;}
    addEventListener(type,fn){this.handlers[type]=fn;}
    trigger(type){if(this.handlers[type])this.handlers[type]({type});}
    dispatchEvent(event){this.trigger(event.type);return true;}
    setAttribute(k,v){this.attributes[k]=v;}
    getAttribute(k){return this.attributes[k]||null;}
    querySelectorAll(selector){return selector===".practice-feedback"?feedback:[];}
  }
  const ids=new Map(),node=(name)=>{if(!ids.has(name))ids.set(name,new Element("div"));return ids.get(name);};
  const names=["daily-status","daily-gate","daily-questions","daily-exercise-data","daily-practice-score","check-practice","daily-paper-evidence","daily-evidence-button","daily-evidence-hint","daily-export","preserve-baseline","baseline-copy","baseline-status","daily-claim-builder","composer-claim","composer-evidence","composer-reason","composer-output","composer-preview","composer-append"];
  names.forEach(node);
  node("daily-exercise-data").textContent=JSON.stringify(bank);
  const fields=fieldNames.map(name=>{const f=new Element("textarea");f.dataset.saveField=name;return f;});
  const fakeDocument={
    body:{getAttribute(k){return k==="data-english9-day"?String(day):null;}},
    querySelector(selector){
      const m=selector.match(/^input\[name="exercise-(\d+)"\]:checked$/);
      return m&&responses[Number(m[1])]!==undefined?{value:String(responses[Number(m[1])])}:null;
    },
    querySelectorAll(selector){return selector==="[data-save-field]"?fields:[];},
    getElementById:node,
    createElement(kind){
      const el=new Element(kind);
      if(kind==="p")feedback.push(el);
      return el;
    },
    createTextNode(text){return {textContent:text};}
  };
  const storage={
    getItem:get,
    setItem:put,
    key(i){return [...values.keys()][i]??null},
    get length(){return values.size;}
  };
  const initialIdentity=learner?JSON.stringify(learner):null;
  put("khaemenes_active_learner_v1",initialIdentity||"null");
  const profile=learner?{learnerId:learner,name:learner}:null;
  const contract={
    scopedKey(base,p){return p?base+":learner:"+encodeURIComponent(p.learnerId):base;},
    readAcademyProfile(){return profile;},
    readJSON(){return {route:"advance",overall_percent:100,strand_scores:{close_reading_evidence:100,language_conventions:100,source_argument:100}};},
    isReady(){return !!profile;}
  };
  const ctx={
    window:{KhaemenesCourseEntryContract:contract,addEventListener(type,fn){events.set(type,fn)}},
    document:fakeDocument,localStorage:storage,
    Event:class{constructor(type){this.type=type;}},
    Date,Math,JSON,String,Number,Array,Object,Map,URL,Blob,
    setTimeout(){},console
  };
  vm.createContext(ctx);vm.runInContext(source,ctx);
  return {fieldNames,fields,bank,node,values,get,put,feedback,responses,events};
}

// Learner A: each original field is saved to the exact learner-scoped key.
const values=new Map();
const a=harness(1,values,"learner-a");
for(let i=0;i<a.fields.length;i++){a.fields[i].value="My independent writing "+(i+1);a.fields[i].trigger("input");}
const baselineKey="khae-ela9-field:week-01-baseline-snapshot:learner:learner-a";
assert.equal(values.has(baselineKey),false,"Original snapshot is not silently created");
a.node("preserve-baseline").trigger("click");
assert.equal(a.get(baselineKey),"My independent writing 2");
a.fields[1].value="My revised argument";a.fields[1].trigger("input");
assert.equal(a.get(baselineKey),"My independent writing 2","Saved original is immutable");

// An 80% formative score (4 of 5) unlocks daily evidence preparation but not weekly mastery.
a.bank.items.forEach((q,i)=>a.responses[i]=i===0?(q.answer+1)%q.choices.length:q.answer);
a.node("check-practice").trigger("click");
const attemptKey="khae-ela9-field:week-01-day1-exercise-v1:learner:learner-a";
assert.equal(JSON.parse(a.get(attemptKey)).best,80);
assert.equal(a.node("daily-evidence-button").disabled,false);
a.node("daily-evidence-button").trigger("click");
const progress=JSON.parse(a.get("khae-ela9-progress-v1:learner:learner-a"));
assert.equal(progress["week-01-day-01"],true);
assert.equal(progress["week-01"],undefined,"Daily practice cannot award weekly course completion");

// Learner B never sees learner A's writing.
const b=harness(1,values,"learner-b");
assert.equal(b.fields[0].value,"");
assert.equal(b.get("khae-ela9-field:week-01-day1-observations:learner:learner-a"),"My independent writing 1");

// Unassigned records are never exposed on a page with no Academy profile.
const noProfile=new Map([["khae-ela9-field:week-01-day1-baseline","Legacy private draft"]]);
const c=harness(1,noProfile,null);
assert.equal(c.fields[1].value,"");
assert.equal(c.node("check-practice").disabled,true);

// A stale tab's attempted write cannot replace a newer same-key record.
const stale=new Map();
const d=harness(1,stale,"learner-a");
const fieldKey="khae-ela9-field:week-01-day1-observations:learner:learner-a";
d.put(fieldKey,"Fresh work from another tab");
d.fields[0].value="Stale copy";d.fields[0].trigger("input");
assert.equal(d.get(fieldKey),"Fresh work from another tab");
assert.match(d.node("daily-status").textContent,/Saving paused/);

// The Day 4 author-controlled CER composer appends (never replaces) canonical plan writing.
const four=harness(4,new Map(),"learner-c");
four.fields[0].value="Earlier plan";four.fields[0].trigger("input");
four.node("composer-claim").value="I argue that rereading changes interpretation.";
four.node("composer-evidence").value="Lena crosses out an earlier idea.";
four.node("composer-reason").value="Counterevidence makes the claim narrower.";
four.node("composer-append").trigger("click");
assert.match(four.fields[0].value,/Earlier plan/);
assert.match(four.fields[0].value,/Claim: I argue/);
assert.match(four.get("khae-ela9-field:week-01-day4-plan:learner:learner-c"),/Counterevidence/);
const once=four.fields[0].value;
four.node("composer-append").trigger("click");
assert.equal(four.fields[0].value,once,"Identical composer draft not appended twice");
console.log("PASS: English 9 daily runtime · learner scoped writes · original snapshots · 80% evidence · stale-tab protection · read-only unassigned · Day 4 CER authoring");
