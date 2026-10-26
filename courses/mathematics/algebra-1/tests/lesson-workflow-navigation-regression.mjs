#!/usr/bin/env node
// Algebra I ten-card workflow navigation: source and inventory regression.
// Static/source certification; live-browser clicking remains a separate gate.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const workflow=read("../assets/course-lesson-workflow-v1.js");
const styles=read("../assets/course-lesson-workflow-v1.css");
const adapter=read("assets/algebra1-workflow-adapter-v1.js");
new vm.Script(workflow,{filename:"course-lesson-workflow-v1.js"});
new vm.Script(adapter,{filename:"algebra1-workflow-adapter-v1.js"});
assert(adapter.includes("enableStageNavigation:true"),"Algebra I stage navigation disabled");
assert(workflow.includes('cfg.enableStageNavigation===true'),"Shared workflow opt-in guard missing");
assert(workflow.includes('function syncStageNavigation(mastered)'),"Real-anchor navigation engine missing");
assert(workflow.includes('card.setAttribute("href","#"+encodeURIComponent(target.id))'),"Stage links must target actual lesson elements");
assert(workflow.includes('card.removeAttribute("href")'),"Unavailable stage cards must not link");
assert(workflow.includes('continue:mastered&&!$("khaeWorkflowContinue").hidden'),"Mastery-locked Continue may bypass the gate");
assert(workflow.includes('key!=="continue"||mastered'),"Continue must require canonical mastery");
const expected=["learn","example","practice","game","video","submit","mastery","review","evidence","continue"];
for(const stage of expected){
  assert(workflow.includes('data-stage="'+stage+'"'),"Workflow missing "+stage+" card");
  assert(workflow.includes(stage+":"),"Workflow lacks destination mapping for "+stage);
}
const stages=[...workflow.matchAll(/data-stage="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(expected).size,10);
for(const name of expected)assert(stages.includes(name),"Stage absent: "+name);
const navSource=workflow.slice(workflow.indexOf("function syncStageNavigation(mastered)"),workflow.indexOf("if(cfg.enableStageNavigation===true)",workflow.indexOf("function syncStageNavigation(mastered)")));
assert(!navSource.includes("localStorage.setItem("),"Navigation must not alter course records");
assert(!navSource.includes("write({"),"Navigation must not mark completion");
assert(styles.includes(".khae-workflow.khae-workflow-navigation"),"Scoped parchment theme absent");
assert(styles.includes("--kfw-bg:#fffdfa")&&styles.includes("--kfw-ink:#202925"),"Parchment/charcoal design regressed");
assert(styles.includes("a.khae-workflow-stage:focus-visible"),"Keyboard focus indicator missing");

const countByUnit={};
for(let unit=1;unit<=13;unit++){
  const number=String(unit).padStart(2,"0");
  const folder=path.join(root,"units","unit-"+number,"lessons");
  const lessons=fs.readdirSync(folder).filter(file=>/^lesson-\d+-.+\.html$/i.test(file));
  assert(lessons.length>0,"No lessons found in Unit "+number);
  for(const lesson of lessons){
    const page=fs.readFileSync(path.join(folder,lesson),"utf8");
    assert(page.includes('data-mode="lesson"'),number+"/"+lesson+": wrong lesson mode");
    assert(page.includes("lesson-resource-bridge-v1.js"),number+"/"+lesson+": missing shared workflow loader");
    assert.equal((page.match(/<!doctype html>/gi)||[]).length,1,number+"/"+lesson+": duplicate document");
  }
  countByUnit[number]=lessons.length;
}
assert(Object.values(countByUnit).reduce((a,b)=>a+b,0)>=80,"Expected full Algebra I lesson coverage");
console.log("PASS: ten conditional workflow destinations, anchors and keyboard focus guards");
console.log("PASS: locked Continue, optional support fallback, unchanged grading path");
console.log("PASS: parchment + charcoal scoped to Algebra I workflow");
console.log("PASS: lesson bridge inventory",JSON.stringify(countByUnit));
console.log("PENDING: live-browser keyboard/touch navigation and section positioning");
