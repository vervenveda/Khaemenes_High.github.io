#!/usr/bin/env node
"use strict";

import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {fileURLToPath} from "node:url";

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,"../../../..");
let chromium;
try{({chromium}=await import("playwright"))}catch(error){
 console.error("LATE-UNIT REAL-BROWSER REGRESSION: BLOCKED");
 console.error(String(error?.message||error));process.exit(2);
}
const mime=new Map([[".html","text/html; charset=utf-8"],[".js","text/javascript; charset=utf-8"],[".css","text/css; charset=utf-8"],[".json","application/json; charset=utf-8"]]);
const server=http.createServer((req,res)=>{
 try{
  const decoded=decodeURIComponent((req.url||"/").split("?")[0]),rel=decoded.replace(/^\/+/, "");
  let file=path.resolve(ROOT,rel||"index.html");
  if(!file.startsWith(ROOT+path.sep)&&file!==ROOT)throw new Error("path escape");
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
  if(!fs.existsSync(file)){res.writeHead(404);res.end("Not found");return}
  res.writeHead(200,{"content-type":mime.get(path.extname(file))||"application/octet-stream","cache-control":"no-store"});
  fs.createReadStream(file).pipe(res);
 }catch(error){res.writeHead(500);res.end(String(error?.message||error))}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();

await context.addInitScript(()=>{
 const learnerId="late-unit-browser-learner",scoped=base=>`${base}:learner:${encodeURIComponent(learnerId)}`;
 localStorage.setItem("khaemenes_active_learner_v1",JSON.stringify(learnerId));
 localStorage.setItem("khaemenes_family_registry_v1",JSON.stringify({version:1,learners:{[learnerId]:{learnerId,nickname:"Late Unit Browser Learner"}}}));
 for(let unit=1;unit<=9;unit++)localStorage.setItem(scoped(`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-a3-v1`),JSON.stringify({best:{mastery:100},attempts:[]}));
 const counts={10:8,11:6,12:7,13:5};
 for(const [unitText,count] of Object.entries(counts)){
  const unit=Number(unitText),scores={mastery:100};
  for(let lesson=1;lesson<=count;lesson++)scores[`u${String(unit).padStart(2,"0")}-l${String(lesson).padStart(2,"0")}`]=100;
  localStorage.setItem(scoped(`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-progress-v1`),JSON.stringify({pathway:"Core",completed:[],scores,reflections:{},attempts:[]}));
 }
 const weeks={};for(let week=27;week<=36;week++)weeks[week]={best:100,attempts:[{mastery_met:true}]};
 localStorage.setItem(scoped("khaemenes-algebra1-weekly-mastery-v2"),JSON.stringify({weeks}));
 localStorage.setItem(scoped("khaemenes-algebra1-midterm-result-v1"),JSON.stringify({attempt_history:[{mastery:true,legacy_selected_only:false,overall_percent:100,constructed_response:{review_complete:true}}]}));
});

async function answerAllFirst(page){
 await page.waitForFunction(()=>document.querySelectorAll(".question").length===20);
 await page.evaluate(()=>{
  document.querySelectorAll(".question").forEach(q=>{
   const input=q.querySelector('input[type="radio"]');
   if(input){input.checked=true;input.dispatchEvent(new Event("change",{bubbles:true}))}
  });
 });
}
async function readRecord(page,key){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)||"null"),key)}
const results=[];
for(let unit=10;unit<=13;unit++){
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push("pageerror: "+e.message));
 page.on("console",m=>{if(m.type()==="error")errors.push("console: "+m.text())});
 const url=`${origin}/courses/mathematics/algebra-1/units/unit-${unit}/assessment/mastery-check.html`;
 await page.goto(url,{waitUntil:"load"});
 await page.locator("#score").waitFor({state:"visible",timeout:15000});
 await answerAllFirst(page);
 await page.locator("#score").click();
 await page.waitForFunction(()=>document.querySelector("#score")?.disabled===true);

 assert.equal(await page.locator('#questions input[type="radio"]:not(:disabled)').count(),0,`Unit ${unit}: graded radios remain editable`);
 assert.equal(await page.locator("#reset").innerText(),"Begin a new attempt",`Unit ${unit}: fresh-attempt control not exposed`);
 const key=`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-progress-v1`;
 const first=await readRecord(page,key);
 assert.ok(first&&Array.isArray(first.attempts)&&first.attempts.length===1,`Unit ${unit}: first attempt not persisted`);
 const a1=first.attempts[0];
 assert.equal(a1.result_schema,"khaemenes-algebra1-unit-mastery-v3",`Unit ${unit}: result schema drift`);
 assert.equal(a1.evidenceSchema,"algebra1-answer-evidence-v2",`Unit ${unit}: evidence schema missing`);
 assert.equal(a1.formVersion,"algebra1-late-unit-fixed-v3",`Unit ${unit}: form version missing`);
 assert.equal(a1.selectionPolicy,"fixed-lesson-balanced-high-reasoning-v1",`Unit ${unit}: selection policy missing`);
 assert.equal(a1.total,20,`Unit ${unit}: formal mastery must grade 20 items`);
 assert.equal(a1.answerSnapshot?.length,20,`Unit ${unit}: answer snapshot incomplete`);
 assert.ok(a1.answerSnapshot.every(x=>Number.isInteger(x.selectedDisplayIndex)&&Number.isInteger(x.selectedOriginalIndex)&&Number.isInteger(x.correctDisplayIndex)&&Number.isInteger(x.correctOriginalIndex)&&typeof x.selectedText==="string"&&typeof x.correctText==="string"),`Unit ${unit}: reconstructable answer identity incomplete`);

 await page.locator("#reset").click();
 await page.waitForFunction(()=>document.querySelector("#score")?.disabled===false);
 assert.equal(await page.locator('#questions input[type="radio"]:disabled').count(),0,`Unit ${unit}: new attempt did not unlock controls`);
 assert.equal(await page.locator("#reset").innerText(),"Clear current answers",`Unit ${unit}: reset control did not return to pre-grade state`);
 await answerAllFirst(page);
 await page.locator("#score").click();
 await page.waitForFunction(()=>document.querySelector("#score")?.disabled===true);
 const second=await readRecord(page,key);
 assert.equal(second.attempts.length,2,`Unit ${unit}: second immutable attempt not appended`);
 assert.equal(second.attempts[1].attemptNumber,2,`Unit ${unit}: attempt numbering drift`);
 assert.equal(second.attempts[1].answerSnapshot?.length,20,`Unit ${unit}: second answer snapshot incomplete`);

 await page.reload({waitUntil:"load"});
 await page.locator("#score").waitFor({state:"visible",timeout:15000});
 const after=await readRecord(page,key);
 assert.equal(after.attempts.length,2,`Unit ${unit}: reload lost attempt evidence`);
 assert.equal(errors.length,0,`Unit ${unit}: browser errors: ${errors.join(" | ")}`);
 results.push({unit,attemptsAfterReload:after.attempts.length,evidenceSchema:after.attempts[1].evidenceSchema,eligiblePoolSize:after.attempts[1].eligiblePoolSize});
 await page.close();
}
await browser.close();await new Promise(resolve=>server.close(resolve));
console.log("ALGEBRA I LATE-UNIT REAL-BROWSER REGRESSION: PASS");
console.log(JSON.stringify({journey:"Unit 10 → Unit 11 → Unit 12 → Unit 13 formal mastery",checks:["20-item formal form","immutable submitted controls","explicit fresh-attempt control","v2 reconstructable answer evidence","second attempt appended","reload persistence","no browser/page console errors"],results},null,2));
