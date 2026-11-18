#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const ROOT=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const must=(ok,msg)=>{if(!ok){console.error("FAIL · "+msg);process.exitCode=1}else console.log("PASS · "+msg)};
const sandbox={window:{}};vm.createContext(sandbox);
vm.runInContext(read("assets/algebra2-depth-bank-units02-03-v1.js"),sandbox);
const q=sandbox.window.ALGEBRA2_DEPTH_QUESTIONS||[];
for(const unit of [2,3]){
 const items=q.filter(x=>x.unit===unit);
 must(items.length>=(unit===2?48:42),`Unit ${unit} depth bank size`);
 const lessonCount=unit===2?8:7;
 for(let lesson=1;lesson<=lessonCount;lesson++)must(items.filter(x=>x.lesson===lesson).length>=6,`Unit ${unit} Lesson ${lesson} has 6+ depth items`);
 for(const d of [1,2,3])must(items.filter(x=>x.difficulty===d).length>=14,`Unit ${unit} difficulty ${d} has enough pathway evidence`);
 for(const dim of ["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"])must(items.filter(x=>x.dimension===dim).length>=4,`Unit ${unit} supports ${dim}`);
 must(new Set(items.map(x=>x.id)).size===items.length,`Unit ${unit} question IDs are unique`);
 must(items.every(x=>Number.isInteger(x.answer)&&x.answer>=0&&x.answer<x.options.length&&x.answer_text===x.options[x.answer]),`Unit ${unit} answer indices and answer text agree`);
}
const engine=read("assets/assessment-engine.js");
must(engine.includes("withDepthBanks")&&engine.includes("algebra2-depth-bank-units02-03-v1.js"),"Assessment engine auto-loads Units 02–03 depth bank");
must(engine.includes("preferNovel")&&engine.includes("depthBlueprint"),"Retake novelty and balanced mastery remain active");
const tools=read("assets/lesson-tools.js");
must(tools.includes("algebra2-units02-03-depth-companion-v1.js"),"Lesson tools auto-load representation companion");
must(tools.includes("algebra2MinScreenTypeV1"),"Lessons enforce 16px screen readability floor");
for(const unit of [2,3]){
 const uu=String(unit).padStart(2,"0");
 for(const [name,count,pathway] of [["foundation",12,"Foundation"],["core",16,"Core"],["extended",20,"Extended"]]){
  const html=read(`units/unit-${uu}/practice/${name}.html`);
  must(html.includes(`"count":${count}`)&&html.includes(`"pathway":"${pathway}"`),`Unit ${uu} ${pathway} practice is differentiated`);
 }
 const mastery=read(`units/unit-${uu}/assessment/mastery-check.html`);
 must(mastery.includes('"count":20')&&mastery.includes('"depthBlueprint":true'),`Unit ${uu} mastery uses 20-question depth blueprint`);
}
for(const week of ["03","04","05","06","07","08"]){
 const unit=Number(week)<=5?"02":"03";
 const html=read(`units/unit-${unit}/retrieval/week-${week}.html`);
 must(html.includes('"purpose":"retrieval"')&&html.includes('"weekMix"'),`Week ${week} is non-gating spaced retrieval`);
}
if(!process.exitCode)console.log("ALGEBRA2_UNITS02_03_EXCEPTIONAL_DEPTH=PASS");
