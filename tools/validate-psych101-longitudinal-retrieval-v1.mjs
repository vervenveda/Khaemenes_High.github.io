#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";

const root="electives/grades/grade-09/psych-101";
const jsPath=path.join(root,"assets/psych101.js");
execFileSync(process.execPath,["--check",jsPath],{stdio:"pipe"});

const js=fs.readFileSync(jsPath,"utf8");
const m=/const LONGITUDINAL_RETRIEVAL=(\{.*?\});\n\n  function mountLongitudinalResearchRetrieval/s.exec(js);
assert.ok(m,"Longitudinal retrieval registry not found in psych101.js");
const spine=Function('"use strict";return ('+m[1]+');')();

const weeks=Object.keys(spine).map(Number).sort((a,b)=>a-b);
assert.deepEqual(weeks,Array.from({length:13},(_,i)=>i+1));
let cards=0;
const titles=new Set(),skills=new Set(),retrievals=new Set(),transfers=new Set();
for(const w of weeks){
  assert.equal(spine[w].length,5,"Week "+w+" must have five longitudinal retrieval cards");
  for(const [i,entry] of spine[w].entries()){
    assert.ok(Array.isArray(entry)&&entry.length===5,"Week "+w+" day "+(i+1)+" malformed");
    const [title,retrieve,skill,dataMove,transfer]=entry;
    assert.ok(title.length>=12,"Week "+w+" day "+(i+1)+" title too thin");
    assert.ok(retrieve.length>=70,"Week "+w+" day "+(i+1)+" retrieval prompt too thin");
    assert.ok(skill.length>=8,"Week "+w+" day "+(i+1)+" method skill missing");
    assert.ok(dataMove.length>=70,"Week "+w+" day "+(i+1)+" data/method move too thin");
    assert.ok(transfer.length>=45,"Week "+w+" day "+(i+1)+" transfer prompt too thin");
    titles.add(title.toLowerCase());skills.add(skill.toLowerCase());retrievals.add(retrieve.toLowerCase());transfers.add(transfer.toLowerCase());cards++;
  }
}
assert.equal(cards,65);
assert.equal(titles.size,65,"Retrieval card titles must be unique");
assert.equal(retrievals.size,65,"Retrieval prompts must be unique");
assert.equal(transfers.size,65,"Transfer prompts must be unique");
assert.ok(skills.size>=35,"Research-method vocabulary too narrow: "+skills.size);

for(const phrase of [
  "correlation","causation","reliability","validity","sampling","replication","ethics","privacy",
  "generalization","alternative","measurement","distribution","base-rate","confounding"
]){
  assert.ok(js.toLowerCase().includes(phrase),"Missing longitudinal concept: "+phrase);
}

assert.ok(js.includes("mountLongitudinalResearchRetrieval();bindDrafts();"),"Retrieval card must mount before draft binding");
assert.ok(js.includes("data-psych-draft=\"research-retrieval\""),"Retrieval response must use existing learner-scoped draft storage");
assert.ok(js.includes("12A · Research Retrieval Spine"),"Student-facing retrieval section marker missing");

const lessonFiles=[];
for(let w=1;w<=13;w++){
 const dir=path.join(root,"lessons","week-"+String(w).padStart(2,"0"));
 for(let d=1;d<=5;d++){
  const file=path.join(dir,"day-"+String(d).padStart(2,"0")+".html");
  assert.ok(fs.existsSync(file),"Missing lesson "+file);
  const html=fs.readFileSync(file,"utf8");
  assert.ok(html.includes('data-lesson-id="'+String(w).padStart(2,"0")+"-"+String(d).padStart(2,"0")+'"'),"Wrong lesson id "+file);
  assert.ok(/src=["']\.\.\/\.\.\/assets\/psych101\.js["']/.test(html),"Lesson does not load canonical psych101.js: "+file);
  assert.ok(html.includes("data-notebook="),"Lesson missing existing notebook checkpoint: "+file);
  assert.ok(html.includes("data-daily-review"),"Lesson missing existing daily review: "+file);
  lessonFiles.push(file);
 }
}
assert.equal(lessonFiles.length,65);

const map=JSON.parse(fs.readFileSync(path.join(root,"course-map.json"),"utf8"));
assert.equal(map.masteryThreshold,80);
assert.equal(map.lessons,65);
assert.equal(map.weeks,13);
assert.equal(map.longitudinalRetrieval?.version,"psych101-longitudinal-research-retrieval-v1");
assert.match(map.longitudinalRetrieval?.assessmentAuthority||"",/unchanged/i);
assert.match(map.longitudinalRetrieval?.recordsAuthority||"",/unchanged/i);

console.log("PASS: Psychology 101 longitudinal research retrieval");
console.log("13 weeks · 65 retrieval cards · "+skills.size+" distinct method lenses · existing 80% mastery and learner records preserved");
