#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const ROOT=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const must=(ok,msg)=>{if(!ok){console.error("FAIL · "+msg);process.exitCode=1}else console.log("PASS · "+msg)};
const sandbox={window:{}};vm.createContext(sandbox);
vm.runInContext(read("assets/algebra2-depth-bank-v1.js"),sandbox);
const q=sandbox.window.ALGEBRA2_DEPTH_QUESTIONS||[];
must(q.length>=36,"Unit 01 depth bank has at least 36 questions");
for(const lesson of [1,2,3,4,5,6])must(q.filter(x=>x.lesson===lesson).length>=6,`Lesson ${lesson} has at least 6 depth questions`);
for(const difficulty of [1,2,3])must(q.filter(x=>x.difficulty===difficulty).length>=12,`Difficulty ${difficulty} has at least 12 questions`);
for(const dim of ["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"])must(q.filter(x=>x.dimension===dim).length>=4,`Dimension ${dim} can supply a balanced mastery form`);
const engine=read("assets/assessment-engine.js");
must(engine.includes("cfg.pathway")&&engine.includes("pathway_min"),"Assessment engine uses pathway-aware selection");
must(engine.includes("priorQuestionIds")&&engine.includes("preferNovel"),"Assessment engine prioritizes retake novelty");
must(engine.includes("balancedByUnit"),"Cumulative assessments balance coverage by unit");
must(engine.includes("depthBlueprint")&&engine.includes("transfer-reasoning"),"Formal depth blueprint spans five reasoning dimensions");
must(engine.includes("weekMix"),"Weekly spaced-retrieval mix is supported");
const lessonTools=read("assets/lesson-tools.js");
for(const id of ["lessonRubricConcept","lessonRubricProcedure","lessonRubricReasoning","lessonRubricVerification","lessonRubricTransfer"])must(lessonTools.includes(id),`Lesson rubric includes ${id}`);
must(lessonTools.includes("local-evaluator-rubric"),"Lesson mastery stores rubric provenance");
for(let lesson=1;lesson<=6;lesson++){
 const html=read(`units/unit-01/lessons/u01-l0${lesson}.html`);
 must(html.includes("algebra2-unit01-depth-companion-v1.js"),`Unit 01 Lesson 0${lesson} loads representation-depth companion`);
}
for(const [name,count] of [["foundation",12],["core",16],["extended",20]]){
 const html=read(`units/unit-01/practice/${name}.html`);
 must(html.includes("algebra2-depth-bank-v1.js"),`${name} practice loads depth bank`);
 must(html.includes(`"count":${count}`),`${name} practice uses ${count} items`);
 must(html.toLowerCase().includes(`"pathway":"${name}`` .slice(0,-1).toLowerCase()),`${name} practice declares fixed pathway`);
}
const mastery=read("units/unit-01/assessment/mastery-check.html");
must(mastery.includes('"count":20')&&mastery.includes('"depthBlueprint":true'),"Unit 01 mastery uses 20-question depth blueprint");
for(const week of ["01","02"]){
 const html=read(`units/unit-01/retrieval/week-${week}.html`);
 must(html.includes('"purpose":"retrieval"'),`Week ${week} retention is explicitly non-gating retrieval evidence`);
}
const index=read("units/unit-01/index.html");
must(index.includes("retrieval/week-01.html")&&index.includes("retrieval/week-02.html"),"Unit 01 surfaces both retention routes");
if(!process.exitCode)console.log("ALGEBRA2_UNIT01_EXCEPTIONAL_DEPTH=PASS");
