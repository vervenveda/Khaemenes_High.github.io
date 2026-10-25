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
try{
  ({chromium}=await import("playwright"));
}catch(error){
  console.error("REAL-BROWSER REGRESSION: BLOCKED");
  console.error("Playwright is required. Install it in the test environment and rerun this script.");
  console.error(String(error?.message||error));
  process.exit(2);
}

const mime=new Map([
 [".html","text/html; charset=utf-8"],[".js","text/javascript; charset=utf-8"],
 [".css","text/css; charset=utf-8"],[".json","application/json; charset=utf-8"],
 [".svg","image/svg+xml"],[".webmanifest","application/manifest+json; charset=utf-8"]
]);

function safePath(urlPath){
  const decoded=decodeURIComponent((urlPath||"/").split("?")[0]);
  const rel=decoded.replace(/^\/+/, "");
  const full=path.resolve(ROOT,rel||"index.html");
  if(!full.startsWith(ROOT+path.sep)&&full!==ROOT)throw new Error("path escape");
  return full;
}

const server=http.createServer((req,res)=>{
  try{
    let file=safePath(req.url);
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
    if(!fs.existsSync(file)){res.writeHead(404,{"content-type":"text/plain"});res.end("Not found");return}
    res.writeHead(200,{"content-type":mime.get(path.extname(file).toLowerCase())||"application/octet-stream","cache-control":"no-store"});
    fs.createReadStream(file).pipe(res);
  }catch(error){res.writeHead(500,{"content-type":"text/plain"});res.end(String(error?.message||error))}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const port=server.address().port;
const origin=`http://127.0.0.1:${port}`;

const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
await context.addInitScript(()=>{
  const learnerId="browser-regression-learner";
  const scoped=base=>`${base}:learner:${encodeURIComponent(learnerId)}`;
  localStorage.setItem("khaemenes_active_learner_v1",JSON.stringify(learnerId));
  localStorage.setItem("khaemenes_family_registry_v1",JSON.stringify({
    version:1,
    learners:{
      [learnerId]:{learnerId,nickname:"Browser Regression Learner"}
    }
  }));
  localStorage.setItem(scoped("khaemenes-algebra1-diagnostic-result-v1"),JSON.stringify({
    attempt_history:[{submitted_at:"2026-10-25T00:00:00.000Z",overall_percent:100}]
  }));
  const mastery=(unit)=>localStorage.setItem(
    scoped(`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-a3-v1`),
    JSON.stringify({attempts:[],best:{mastery:100}})
  );
  mastery(2);
  mastery(3);
  mastery(4);
  mastery(8);
  localStorage.setItem(scoped("khaemenes-algebra1-midterm-result-v1"),JSON.stringify({
    attempt_history:[{
      mastery:true,
      legacy_selected_only:false,
      overall_percent:100,
      constructed_response:{review_complete:true}
    }]
  }));
});

const cases=[
 {
   unit:"01",
   file:"lesson-01-algebraic-habits-notation-mathematical-argument.html",
   key:"khaemenes-algebra1-unit01-a3-v1",
   runtime:"abundant-v2",
   bankVersion:"unit01-abundant-v1",
   misconceptionPolicy:"reviewed"
 },
 {
   unit:"03",
   file:"lesson-01-equality-inverse-operations-solution-verification.html",
   key:"khaemenes-algebra1-unit03-a3-v1",
   runtime:"abundant-v2",
   bankVersion:"unit03-abundant-v1",
   misconceptionPolicy:"provisional"
 },
 {
   unit:"04",
   file:"lesson-01-inequality-meaning-number-lines-interval-notation.html",
   key:"khaemenes-algebra1-unit04-a3-v1",
   runtime:"abundant-v2",
   bankVersion:"unit04-abundant-v1",
   misconceptionPolicy:"provisional"
 },
 {
   unit:"05",
   file:"lesson-01-relations-inputs-outputs-function-tests.html",
   key:"khaemenes-algebra1-unit05-a3-v1",
   runtime:"dedicated-v2",
   misconceptionPolicy:"reviewed"
 },
 {
   unit:"09",
   file:"lesson-01-polynomial-vocabulary-standard-form.html",
   key:"khaemenes-algebra1-unit09-a3-v1",
   runtime:"dedicated-v2",
   misconceptionPolicy:"reviewed"
 }
];

const results=[];

async function questions(page){
  return await page.locator(".question > strong").allTextContents();
}
async function firstOptionTexts(page){
  return await page.locator(".question label.option:first-of-type").allTextContents();
}
async function answerAllFirst(page){
  const qs=page.locator(".question");
  const n=await qs.count();
  assert.equal(n,10,"representative lesson must render exactly 10 questions");
  for(let i=0;i<n;i++)await qs.nth(i).locator('input[type="radio"]').first().check();
}
async function readRecord(page,key){
  return await page.evaluate(k=>JSON.parse(localStorage.getItem(k)||"null"),key);
}
function distribution(values){
  const counts=[0,0,0,0];
  for(const v of values)if(Number.isInteger(v)&&v>=0&&v<4)counts[v]++;
  return counts;
}

for(const test of cases){
  console.log(`[browser] Unit ${test.unit} · opening representative lesson`);
  const page=await context.newPage();
  const url=`${origin}/courses/mathematics/algebra-1/units/unit-${test.unit}/lessons/${test.file}`;
  const consoleErrors=[];
  page.on("pageerror",err=>consoleErrors.push("pageerror: "+err.message));
  page.on("console",msg=>{if(msg.type()==="error")consoleErrors.push("console: "+msg.text())});
  await page.goto(url,{waitUntil:"load"});
  try{
    await page.locator("#score").waitFor({state:"visible",timeout:15000});
  }catch(error){
    const diagnostic=await page.evaluate(()=>({
      pathname:location.pathname,
      title:document.title,
      bodyDataset:{...document.body.dataset},
      mainText:(document.querySelector("#main")?.innerText||"").slice(0,1200),
      scorePresent:!!document.querySelector("#score")
    }));
    console.error(`[browser] Unit ${test.unit} did not expose #score`,JSON.stringify({diagnostic,consoleErrors},null,2));
    throw error;
  }
  await page.waitForFunction(()=>document.querySelectorAll(".question").length===10);

  const initialPrompts=await questions(page);
  const initialFirstOptions=await firstOptionTexts(page);
  assert.equal(new Set(initialPrompts).size,10,`Unit ${test.unit}: first form contains duplicate prompts`);

  await answerAllFirst(page);
  await page.locator("#score").click();
  await page.waitForFunction(()=>document.querySelector("#score")?.disabled===true);

  assert.equal(await page.locator('.question input[type="radio"]:not(:disabled)').count(),0,`Unit ${test.unit}: submitted answers were not locked`);
  const retry=page.locator("#practiceRetry");
  await retry.waitFor({state:"visible"});
  assert.equal(await retry.isEnabled(),true,`Unit ${test.unit}: retake is not enabled after grading`);

  const firstRecord=await readRecord(page,test.key);
  assert.ok(firstRecord&&Array.isArray(firstRecord.attempts),`Unit ${test.unit}: attempt evidence missing`);
  assert.equal(firstRecord.attempts.length,1,`Unit ${test.unit}: expected one saved attempt`);
  const a1=firstRecord.attempts[0];
  assert.equal(a1.total,10,`Unit ${test.unit}: first attempt did not grade 10 items`);
  assert.equal(a1.answerSnapshot?.length,10,`Unit ${test.unit}: answerSnapshot missing or incomplete`);

  if(test.runtime==="dedicated-v2"||test.runtime==="abundant-v2"){
    assert.equal(a1.formVersion,"algebra1-runtime-balanced-v2",`Unit ${test.unit}: runtime form version missing`);
    assert.ok(a1.answerSnapshot.every(x=>Number.isInteger(x.selectedDisplayIndex)&&Number.isInteger(x.selectedOriginalIndex)&&Number.isInteger(x.correctDisplayIndex)&&Number.isInteger(x.correctOriginalIndex)),`Unit ${test.unit}: delivered/original answer mapping incomplete`);
    const counts=distribution(a1.answerSnapshot.map(x=>x.correctDisplayIndex));
    assert.ok(Math.max(...counts)-Math.min(...counts)<=1,`Unit ${test.unit}: learner-visible correct positions are not balanced: ${counts.join("/")}`);
    assert.deepEqual(a1.formSources,["dedicated"],`Unit ${test.unit}: first form should use dedicated items only`);
    const wrong=a1.answerSnapshot.filter(x=>x.selectedDisplayIndex!==x.correctDisplayIndex);
    assert.ok(wrong.length>0,`Unit ${test.unit}: representative first form did not exercise wrong-answer feedback`);
    assert.ok(wrong.every(x=>x.misconceptionTag&&x.misconceptionMapVersion&&x.misconceptionMapSource==="dedicated"),`Unit ${test.unit}: wrong-answer misconception evidence is incomplete`);
    const misconceptionFeedback=await page.locator(".feedback.bad").allTextContents();
    assert.equal(misconceptionFeedback.length,wrong.length,`Unit ${test.unit}: wrong-answer feedback count does not match saved evidence`);
    if(test.misconceptionPolicy==="reviewed"){
      assert.ok(wrong.every(x=>x.misconceptionLearnerFeedback===true),`Unit ${test.unit}: reviewed mappings were not marked learner-feedback eligible`);
      assert.ok(misconceptionFeedback.every(text=>/Misconception check:/i.test(text)),`Unit ${test.unit}: reviewed misconception correction was not shown to the learner`);
    }else if(test.misconceptionPolicy==="provisional"){
      assert.ok(wrong.every(x=>x.misconceptionReviewStatus==="lesson-family-provisional-v1"&&x.misconceptionLearnerFeedback===false),`Unit ${test.unit}: provisional mappings crossed the learner-feedback boundary`);
      assert.ok(misconceptionFeedback.every(text=>!/Misconception check:/i.test(text)),`Unit ${test.unit}: provisional misconception diagnosis was exposed to the learner`);
    }
  }
  if(test.runtime==="abundant-v2"){
    assert.equal(a1.evidenceSchema,"algebra1-answer-evidence-v2",`Unit ${test.unit}: answer evidence schema missing`);
    assert.equal(a1.bankVersion,test.bankVersion,`Unit ${test.unit}: abundant bank version missing`);
    assert.equal(a1.selectionPolicy,"blueprint-low-overlap-v1",`Unit ${test.unit}: selection policy missing`);
    assert.equal(a1.eligiblePoolSize,30,`Unit ${test.unit}: expected 30 eligible questions for Lesson 01`);
  }

  await retry.click();
  await page.waitForFunction(()=>document.querySelector("#score")?.disabled===false&&document.querySelectorAll(".question").length===10);
  const retakePrompts=await questions(page);
  const retakeFirstOptions=await firstOptionTexts(page);

  if(test.runtime==="dedicated-v2"){
    const changed=retakePrompts.filter((p,i)=>p!==initialPrompts[i]).length;
    assert.ok(changed>0,`Unit ${test.unit}: retake did not change delivered question form`);
    assert.match(await page.locator("#result").innerText(),/aligned alternate items included/i,`Unit ${test.unit}: retake does not report aligned alternate items`);
  }else if(test.runtime==="abundant-v2"){
    const changed=retakePrompts.filter((p,i)=>p!==initialPrompts[i]).length;
    assert.ok(changed>0,`Unit ${test.unit}: abundant retake did not change delivered question form`);
    assert.match(await page.locator("#result").innerText(),/blueprint-balanced questions from 30 eligible items/i,`Unit ${test.unit}: retake does not report the 30-item abundant pool`);
  }else{
    const changed=retakePrompts.some((p,i)=>p!==initialPrompts[i])||retakeFirstOptions.some((p,i)=>p!==initialFirstOptions[i]);
    assert.ok(changed,`Unit ${test.unit}: retake did not randomize question/choice delivery`);
  }

  await answerAllFirst(page);
  await page.locator("#score").click();
  await page.waitForFunction(()=>document.querySelector("#score")?.disabled===true);
  const secondRecord=await readRecord(page,test.key);
  assert.equal(secondRecord.attempts.length,2,`Unit ${test.unit}: second attempt not appended`);
  assert.equal(secondRecord.attempts[1].answerSnapshot?.length,10,`Unit ${test.unit}: retake answerSnapshot incomplete`);
  if(test.runtime==="dedicated-v2"){
    assert.ok(secondRecord.attempts[1].formSources.includes("aligned-alternate"),`Unit ${test.unit}: retake evidence does not identify aligned alternates`);
    assert.ok(new Set(secondRecord.attempts[0].items).size===10&&new Set(secondRecord.attempts[1].items).size===10,`Unit ${test.unit}: form item IDs are not stable/unique`);
    assert.notDeepEqual(secondRecord.attempts[0].items,secondRecord.attempts[1].items,`Unit ${test.unit}: retake item set/order is identical to first attempt`);
  }
  if(test.runtime==="abundant-v2"){
    const firstIds=new Set(secondRecord.attempts[0].items);
    const overlap=secondRecord.attempts[1].items.filter(id=>firstIds.has(id)).length;
    assert.ok(overlap<=2,`Unit ${test.unit}: abundant retake repeated ${overlap}/10 items from the immediately prior form`);
    assert.equal(secondRecord.attempts[1].eligiblePoolSize,30,`Unit ${test.unit}: retake evidence lost eligible-pool size`);
    assert.equal(secondRecord.attempts[1].selectionPolicy,"blueprint-low-overlap-v1",`Unit ${test.unit}: retake evidence lost selection policy`);
    assert.ok(new Set(secondRecord.attempts[1].items).size===10,`Unit ${test.unit}: retake item IDs are not unique`);
  }

  const bestBeforeReload=secondRecord.best?.["lesson-1"];
  await page.reload({waitUntil:"load"});
  await page.locator("#score").waitFor({state:"visible"});
  const afterReload=await readRecord(page,test.key);
  assert.equal(afterReload.attempts.length,2,`Unit ${test.unit}: reload lost attempt history`);
  assert.equal(afterReload.best?.["lesson-1"],bestBeforeReload,`Unit ${test.unit}: reload lost best-score evidence`);
  assert.equal(consoleErrors.length,0,`Unit ${test.unit}: browser errors: ${consoleErrors.join(" | ")}`);

  results.push({
    unit:test.unit,
    firstAttemptItems:a1.total,
    firstAttemptLocked:true,
    retakeItems:secondRecord.attempts[1].total,
    retakeSources:secondRecord.attempts[1].formSources||["dedicated"],
    savedAttemptsAfterReload:afterReload.attempts.length,
    bestAfterReload:afterReload.best?.["lesson-1"]??null
  });
  await page.close();
}

await browser.close();
await new Promise(resolve=>server.close(resolve));

console.log("ALGEBRA I REAL-BROWSER REGRESSION: PASS");
console.log(JSON.stringify({
  browser:"Chromium via Playwright",
  journey:"Unit 01 → Unit 03 → Unit 04 → Unit 05 → Unit 09 representative Lesson 01",
  checks:[
    "10-question first form",
    "submit and immutable lock",
    "answerSnapshot persistence with delivered/original option identity",
    "reviewed misconception-aware learner feedback plus provisional-feedback suppression",
    "balanced learner-visible correct positions",
    "Units 01, 03 and 04 30-item abundant pools with low-overlap blueprint retakes",
    "fresh retake with aligned alternates for Units 05 and 09",
    "reload preserves attempt history and best score",
    "no browser/page console errors"
  ],
  results
},null,2));
