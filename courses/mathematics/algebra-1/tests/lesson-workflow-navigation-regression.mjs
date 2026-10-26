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
// Isolated DOM-behavior check: a real destination becomes a keyboard anchor,
// while an unavailable video or mastery-locked Continue remains inert.
const navBegin=workflow.indexOf("  function syncStageNavigation(mastered){");
const navEnd=workflow.indexOf("  if(cfg.enableStageNavigation===true){",navBegin);
assert(navBegin>=0&&navEnd>navBegin,"Navigation implementation missing");
class Tile {
 constructor(tag,stage=null){
  this.tagName=tag;this.attrs={};this.dataset={};this.isConnected=true;
  this.children=[];this.hidden=false;this.id="";
  this.classList={add:()=>{}};
  if(stage)this.setAttribute("data-stage",stage);
  const textNode={textContent:stage||tag,_parent:this};this.children.push(textNode);
 }
 get attributes(){return Object.entries(this.attrs).map(([name,value])=>({name,value}))}
 get firstChild(){return this.children[0]}
 appendChild(node){
  if(node._parent){const siblings=node._parent.children,index=siblings.indexOf(node);if(index>=0)siblings.splice(index,1)}
  node._parent=this;this.children.push(node);
 }
 setAttribute(name,value){this.attrs[name]=String(value);if(name==="id")this.id=value;if(name.startsWith("data-"))this.dataset[name.slice(5)]=String(value)}
 getAttribute(name){return this.attrs[name]??null}
 removeAttribute(name){delete this.attrs[name]}
 hasAttribute(name){return name in this.attrs}
 querySelector(selector){return selector==="strong"?this.children[0]:null}
 replaceWith(next){if(this.parent){next.parent=this.parent;this.parent.nodes[this.parent.nodes.indexOf(this)]=next}this.isConnected=false}
 closest(){return null}
}
const holder={nodes:[],classList:{add:()=>{}},contains:()=>false,querySelectorAll:()=>holder.nodes};
holder.nodes=expected.map(stage=>{const el=new Tile("ARTICLE",stage);el.parent=holder;return el});
const make=tag=>new Tile(tag),objectives=make("SECTION"),worked=make("SECTION"),practice=make("SECTION"),game=make("SECTION");
const score=make("BUTTON"),status=make("SECTION"),review=make("TEXTAREA"),evidence=make("BUTTON"),continueButton=make("A");
continueButton.hidden=true;
objectives.querySelector=()=>({textContent:"Objectives"});
worked.querySelector=()=>({textContent:"Worked example"});
practice.querySelector=()=>({textContent:"Guided practice"});
const destinations={
 ".deep-worked,.worked-example,.worked,.example-card,[data-worked-example]":worked,
 ".card.lab,.practice-card":practice,
 ".math-shared-game-companion,[data-game-companion],[data-launch-title],[data-launch-url]":game
};
const fakeMain={querySelectorAll:()=>[objectives,worked,practice],querySelector:selector=>destinations[selector]||null};
const fakeDoc={getElementById:id=>id==="main"?fakeMain:null,createElement:tag=>new Tile(tag.toUpperCase())};
const get=id=>({"khaeWorkflowScore":status,"khaeWorkflowExport":evidence,"khaeWorkflowContinue":continueButton})[id];
const navigate=vm.runInNewContext(workflow.slice(navBegin,navEnd)+";syncStageNavigation",{
 cfg:{enableStageNavigation:true,getSubmitButton:()=>score},section:holder,document:fakeDoc,reflection:review,$:get
});
const snapshot=()=>Object.fromEntries(holder.nodes.map(el=>[el.dataset.stage,{tag:el.tagName,href:el.getAttribute("href")}]));
navigate(false);
const locked=snapshot();
assert.equal(locked.learn.tag,"A","Learn should be a clickable anchor");
assert.equal(locked.learn.href,"#khaeWorkflowTargetLearn");
assert.equal(locked.submit.tag,"A","Submit should jump to the real score button");
assert.equal(locked.video.tag,"ARTICLE","Unavailable video must not be linked");
assert.equal(locked.continue.tag,"ARTICLE","Continue must not bypass the 80% authority");
continueButton.hidden=false;
navigate(true);
assert.equal(snapshot().continue.tag,"A","Continue action may become navigable only after mastery");
assert.equal(snapshot().continue.href,"#khaeWorkflowTargetContinue");

console.log("PASS: ten conditional workflow destinations, anchors and keyboard focus guards");
console.log("PASS: locked Continue, optional support fallback, unchanged grading path");
console.log("PASS: parchment + charcoal scoped to Algebra I workflow");
console.log("PASS: lesson bridge inventory",JSON.stringify(countByUnit));
console.log("PENDING: live-browser keyboard/touch navigation and section positioning");
