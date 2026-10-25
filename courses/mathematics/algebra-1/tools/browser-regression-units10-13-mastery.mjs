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
  const unit=Number(unitText),baseKey=`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-progress-v1`,key=scoped(baseKey);
  let record={pathway:"Core",completed:[],scores:{},reflections:{},attempts:[]};
  try{record=JSON.parse(localStorage.getItem(key)||"{}")||record}catch{}
  record.pathway=record.pathway||"Core";
  record.completed=Array.isArray(record.completed)?record.completed:[];
  record.scores=record.scores&&typeof record.scores==="object"?record.scores:{};
  record.reflections=record.reflections&&typeof record.reflections==="object"?record.reflections:{};
  record.attempts=Array.isArray(record.attempts)?record.attempts:[];
  record.scores.mastery=100;
  for(let lesson=1;lesson<=count;lesson++)record.scores[`u${String(unit).padStart(2,"0")}-l${String(lesson).padStart(2,"0")}`]=100;
  localStorage.setItem(key,JSON.stringify(record));
 }
 const weeks={};for(let week=27;week<=36;week++)weeks[week]={best:100,attempts:[{mastery_met:true}]};
 localStorage.setItem(scoped("khaemenes-algebra1-weekly-mastery-v2"),JSON.stringify({weeks}));
 localStorage.setItem(scoped("khaemenes-algebra1-midterm-result-v1"),JSON.stringify({attempt_history:[{mastery:true,
      legacy_selected_only:false,
      overall_percent:100,
      constructed_response:{review_complete:true,review_id:"a1-review-browser-seed-midterm"},
      evaluator_review:{
        schema:"khaemenes-algebra1-evaluator-review-v1",
        review_id:"a1-review-browser-seed-midterm",
        reviewer_name:"Browser Regression Reviewer",
        reviewer_role:"teacher",
        reviewer_note:"Seeded structured Midterm review for browser progression regression.",
        attestation:true,
        review_complete:true,
        reviewed_at:"2026-10-25T16:00:00.000Z",
        authoritative:false,
        identity_authenticated:false,
        digitally_signed:false
      }}]}));
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
const expectedPools={10:60,11:120,12:60,13:80};
const expectedBanks={10:"unit10-late-abundant-v1",11:"unit11-content-rebuild-v2",12:"unit12-late-abundant-v1",13:"unit13-capstone-depth-v1"};
const results=[];
for(let unit=10;unit<=13;unit++){
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push("pageerror: "+e.message));
 page.on("console",m=>{if(m.type()==="error")errors.push("console: "+m.text())});
 const url=`${origin}/courses/mathematics/algebra-1/units/unit-${unit}/assessment/mastery-check.html`;
 await page.goto(url,{waitUntil:"load"});
 await page.locator("#score").waitFor({state:"visible",timeout:15000});
 await page.waitForFunction(()=>window.KhaemenesAlgebra1Misconceptions?.status?.()==="ready",{timeout:15000});
 const resolverProbe=await page.evaluate(async unit=>{
  const r=window.KhaemenesAlgebra1Misconceptions;await r.ready;
  const cases={
   10:{reviewed:["q0306",0],provisional:["u10-ab-l01-01",1]},
   11:{provisional:["q0346",0]},
   12:{reviewed:["q0376",0],provisional:["u12-ab-l01-01",1]},
   13:{reviewed:["q0411",0],provisional:["u13-ab-l01-01",1]}
  }[unit],out={};
  for(const [kind,[id,index]] of Object.entries(cases))out[kind]=r.lookup(id,index);
  return out;
 },unit);
 if(unit!==11){
  assert.equal(resolverProbe.reviewed?.learnerFeedbackEligible,true,`Unit ${unit}: reviewed misconception should be learner-facing`);
  assert.equal(resolverProbe.reviewed?.mapSource,"shared",`Unit ${unit}: reviewed misconception should come from the reviewed shared map`);
 }
 assert.equal(resolverProbe.provisional?.learnerFeedbackEligible,false,`Unit ${unit}: provisional misconception leaked learner-facing feedback`);
 assert.equal(resolverProbe.provisional?.mapSource,"late",`Unit ${unit}: provisional misconception should resolve from the late-unit map`);
 if(unit===11)assert.equal(resolverProbe.provisional?.reviewStatus,"family-provisional-v1","Unit 11 rebuilt ID q0346 must override the stale reviewed shared record");

 await answerAllFirst(page);
 await page.locator("#score").click();
 await page.waitForFunction(()=>document.querySelector("#score")?.disabled===true);

 assert.equal(await page.locator('#questions input[type="radio"]:not(:disabled)').count(),0,`Unit ${unit}: graded radios remain editable`);
 assert.equal(await page.locator("#reset").innerText(),"Begin a new attempt",`Unit ${unit}: fresh-attempt control not exposed`);
 const key=`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-progress-v1`;
 const first=await readRecord(page,key);
 assert.ok(first&&Array.isArray(first.attempts)&&first.attempts.length===1,`Unit ${unit}: first attempt not persisted`);
 const a1=first.attempts[0];
 assert.equal(a1.result_schema,"khaemenes-algebra1-unit-mastery-v4",`Unit ${unit}: result schema drift`);
 assert.equal(a1.evidenceSchema,"algebra1-answer-evidence-v2",`Unit ${unit}: evidence schema missing`);
 assert.equal(a1.formVersion,unit===13?"algebra1-unit13-capstone-depth-v1":"algebra1-late-unit-monte-carlo-v1",`Unit ${unit}: form version missing`);
 assert.equal(a1.selectionPolicy,unit===13?"lesson-balanced-capstone-depth-low-overlap-v1":"lesson-balanced-low-overlap-v1",`Unit ${unit}: selection policy missing`);
 assert.equal(a1.bankVersion,expectedBanks[unit],`Unit ${unit}: bank version drift`);
 assert.equal(a1.eligiblePoolSize,expectedPools[unit],`Unit ${unit}: eligible pool size drift`);
 assert.ok(Number.isInteger(a1.formSeed)&&a1.formSeed>0,`Unit ${unit}: form seed missing`);
 assert.equal(a1.immediatePriorOverlap,0,`Unit ${unit}: first form should have no prior overlap`);
 assert.equal(a1.total,20,`Unit ${unit}: formal mastery must grade 20 items`);
 assert.equal(a1.answerSnapshot?.length,20,`Unit ${unit}: answer snapshot incomplete`);
 assert.ok(a1.answerSnapshot.every(x=>Number.isInteger(x.selectedDisplayIndex)&&Number.isInteger(x.selectedOriginalIndex)&&Number.isInteger(x.correctDisplayIndex)&&Number.isInteger(x.correctOriginalIndex)&&Array.isArray(x.optionOrder)&&x.optionOrder.length===4&&typeof x.selectedText==="string"&&typeof x.correctText==="string"),`Unit ${unit}: reconstructable answer identity incomplete`);
 assert.ok(a1.answerSnapshot.filter(x=>x.selectedOriginalIndex!==x.correctOriginalIndex).every(x=>["shared","late"].includes(x.misconceptionMapSource)&&["reviewed-v1","family-provisional-v1"].includes(x.misconceptionReviewStatus)),`Unit ${unit}: incorrect responses are missing active misconception-map evidence`);
 assert.ok(a1.answerSnapshot.filter(x=>x.selectedOriginalIndex!==x.correctOriginalIndex).every(x=>x.misconceptionLearnerFeedback===(x.misconceptionReviewStatus==="reviewed-v1")),`Unit ${unit}: reviewed-only learner feedback guard drift`);
 if(unit===11){
  assert.ok(a1.answerSnapshot.filter(x=>x.selectedOriginalIndex!==x.correctOriginalIndex).every(x=>x.misconceptionMapSource==="late"&&x.misconceptionReviewStatus==="family-provisional-v1"&&!x.misconceptionLearnerFeedback),"Unit 11 rebuilt items must remain provisional after stale-ID override");
  const feedbackText=(await page.locator(".feedback:not([hidden])").allTextContents()).join(" ");
  assert.ok(!feedbackText.includes("Misconception check:"),"Unit 11 provisional diagnoses must not appear in learner feedback");
 }
 const firstPositions=[0,0,0,0];for(const x of a1.answerSnapshot)firstPositions[x.correctDisplayIndex]++;
 assert.deepEqual(firstPositions,[5,5,5,5],`Unit ${unit}: visible correct-answer positions are not balanced`);
 if(unit===13){
  assert.ok(a1.capstoneQuantitativeCount>=10,"Unit 13: first form has fewer than 10 quantitative capstone items");
  assert.equal(a1.capstoneQuantitativeMinimum,10,"Unit 13: quantitative minimum evidence drift");
  assert.deepEqual(a1.capstoneLessonQuantitativeCounts?.map(x=>x.count),[2,2,2,2,2],"Unit 13: first form must contain two quantitative capstone items per lesson");
  assert.equal(a1.answerSnapshot.filter(x=>x.capstoneDepth==="quantitative").length,a1.capstoneQuantitativeCount,"Unit 13: snapshot quantitative count drift");
 }
 const firstIds=[...a1.items];

 await page.locator("#reset").click();
 await page.waitForFunction(()=>document.querySelector("#score")?.disabled===false);
 assert.equal(await page.locator('#questions input[type="radio"]:disabled').count(),0,`Unit ${unit}: new attempt did not unlock controls`);
 assert.equal(await page.locator("#reset").innerText(),"Clear current answers",`Unit ${unit}: reset control did not return to pre-grade state`);
 const freshMeta=await page.locator("#formMeta").innerText();
 assert.match(freshMeta,/immediate prior-form overlap: 0\/20/i,`Unit ${unit}: fresh form does not report zero overlap`);
 const freshPrompts=await page.locator(".question legend").allTextContents();
 assert.equal(freshPrompts.length,20,`Unit ${unit}: fresh form did not render 20 questions`);
 await answerAllFirst(page);
 await page.locator("#score").click();
 await page.waitForFunction(()=>document.querySelector("#score")?.disabled===true);
 const second=await readRecord(page,key);
 assert.equal(second.attempts.length,2,`Unit ${unit}: second immutable attempt not appended`);
 assert.equal(second.attempts[1].attemptNumber,2,`Unit ${unit}: attempt numbering drift`);
 assert.equal(second.attempts[1].answerSnapshot?.length,20,`Unit ${unit}: second answer snapshot incomplete`);
 const a2=second.attempts[1];
 assert.equal(a2.immediatePriorOverlap,0,`Unit ${unit}: immediate retake overlap is not zero`);
 assert.equal(a2.eligiblePoolSize,expectedPools[unit],`Unit ${unit}: retake lost eligible pool size`);
 assert.equal(a2.selectionPolicy,unit===13?"lesson-balanced-capstone-depth-low-overlap-v1":"lesson-balanced-low-overlap-v1",`Unit ${unit}: retake selection policy drift`);
 assert.equal(a2.bankVersion,expectedBanks[unit],`Unit ${unit}: retake bank version drift`);
 assert.equal(a2.items.filter(id=>new Set(firstIds).has(id)).length,0,`Unit ${unit}: retake repeated a prior-form item`);
 const secondPositions=[0,0,0,0];for(const x of a2.answerSnapshot)secondPositions[x.correctDisplayIndex]++;
 assert.deepEqual(secondPositions,[5,5,5,5],`Unit ${unit}: retake answer positions are not balanced`);
 if(unit===13){
  assert.ok(a2.capstoneQuantitativeCount>=10,"Unit 13: retake has fewer than 10 quantitative capstone items");
  assert.deepEqual(a2.capstoneLessonQuantitativeCounts?.map(x=>x.count),[2,2,2,2,2],"Unit 13: retake must contain two quantitative capstone items per lesson");
  assert.equal(a2.items.filter(id=>id.startsWith("u13-depth-")).length,10,"Unit 13: retake should draw exactly ten tagged depth-bank items");
 }

 await page.reload({waitUntil:"load"});
 await page.locator("#score").waitFor({state:"visible",timeout:15000});
 const after=await readRecord(page,key);
 assert.equal(after.attempts.length,2,`Unit ${unit}: reload lost attempt evidence`);
 assert.equal(errors.length,0,`Unit ${unit}: browser errors: ${errors.join(" | ")}`);
 results.push({unit,attemptsAfterReload:after.attempts.length,evidenceSchema:after.attempts[1].evidenceSchema,eligiblePoolSize:after.attempts[1].eligiblePoolSize,immediatePriorOverlap:after.attempts[1].immediatePriorOverlap,bankVersion:after.attempts[1].bankVersion,capstoneQuantitativeCount:unit===13?after.attempts[1].capstoneQuantitativeCount:null});
 await page.close();
}
await browser.close();await new Promise(resolve=>server.close(resolve));
console.log("ALGEBRA I LATE-UNIT REAL-BROWSER REGRESSION: PASS");
console.log(JSON.stringify({journey:"Unit 10 → Unit 11 → Unit 12 → Unit 13 formal mastery",checks:["20-item formal form from 60/120/60/80 eligible pools","immutable submitted controls","balanced visible answer positions","Unit 13 guarantees 10 quantitative capstone items, two per lesson","reviewed resolver feedback eligible","provisional resolver feedback suppressed","Unit 11 stale reviewed IDs overridden by provisional active mappings","explicit fresh-attempt control","0/20 immediate retake overlap","saved form seed and v2 reconstructable answer evidence","second attempt appended","reload persistence","no browser/page console errors"],results},null,2));
