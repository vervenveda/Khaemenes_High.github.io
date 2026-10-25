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
 console.error("CUMULATIVE REVIEW AUTHORITY BROWSER REGRESSION: BLOCKED");
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
const learnerId="cumulative-review-browser-learner";
const scoped=base=>`${base}:learner:${encodeURIComponent(learnerId)}`;

await context.addInitScript(({learnerId})=>{
 const scoped=base=>`${base}:learner:${encodeURIComponent(learnerId)}`;
 localStorage.setItem("khaemenes_active_learner_v1",JSON.stringify(learnerId));
 localStorage.setItem("khaemenes_family_registry_v1",JSON.stringify({version:1,learners:{[learnerId]:{learnerId,nickname:"Cumulative Review Learner"}}}));
 for(let unit=1;unit<=13;unit++){
  localStorage.setItem(scoped(`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-a3-v1`),JSON.stringify({best:{mastery:100}}));
  localStorage.setItem(scoped(`khaemenes-algebra1-unit${String(unit).padStart(2,"0")}-progress-v1`),JSON.stringify({scores:{mastery:100},completed:["mastery"],attempts:[]}));
 }
 const weeks={};for(let week=2;week<=36;week++)weeks[week]={best:100,attempts:[{mastery_met:true}]};
 localStorage.setItem(scoped("khaemenes-algebra1-weekly-mastery-v2"),JSON.stringify({weeks}));
}, {learnerId});

function bareAttempt(id,constructedCount){
 const responses={};for(let i=0;i<constructedCount;i++)responses[i]="A sufficiently long constructed response placeholder used only for the fictional browser regression harness.";
 return {
  id,assessment_id:id,title:id,
  score:id.includes("FINAL")?100:60,total:id.includes("FINAL")?100:60,percent:100,selected_response_percent:100,
  breakdown:{},mastery_threshold:80,selected_response_mastery_met:true,
  constructed_response:{version:"2.0",count:constructedCount,responses,response_min_chars:50,rubric_max:4,selected_weight:70,constructed_weight:30,evaluator_scores:Object.fromEntries(Array.from({length:constructedCount},(_,i)=>[i,4])),percent:100,review_complete:true,reviewed_at:"2026-10-25T16:00:00.000Z"},
  overall_percent:100,mastery:true,mastery_met:true,mastery_status:"mastery-met",
  submitted:"2026-10-25T16:00:00.000Z",
  trust:{classification:"browser-local-self-scored-plus-local-evaluator-review",authoritative:false}
 };
}
async function seedResult(page,key,attempt){
 await page.evaluate(({key,attempt})=>{
  localStorage.setItem(key,JSON.stringify({
   result_schema:"khaemenes-algebra1-cumulative-evidence-v2",
   assessment_id:attempt.id,attempt_history:[attempt],bestScore:100,bestSelectedScore:100,bestOverallScore:100,mastery:true,lastResult:attempt
  }));
 },{key,attempt});
}
async function completeReview(page,count,kind){
 await page.locator("#evaluatorReview").waitFor({state:"visible",timeout:15000});
 const scores=page.locator("[data-score]");
 assert.equal(await scores.count(),count,`${kind}: evaluator rubric input count drift`);
 for(let i=0;i<count;i++)await scores.nth(i).fill("4");

 await page.locator("#saveEvaluator").click();
 await page.waitForFunction(()=>document.querySelector("#evaluatorStatus")?.textContent?.includes("reviewer"),null,{timeout:5000});
 const invalidStatus=await page.locator("#evaluatorStatus").innerText();
 assert.match(invalidStatus,/reviewer/i,`${kind}: missing identity did not fail closed`);

 await page.locator("#reviewerName").fill("Jordan Reviewer");
 await page.locator("#reviewerRole").selectOption("parent-guardian");
 await page.locator("#reviewerNote").fill("Reviewed every written response, rubric score, and correction with the learner.");
 await page.locator("#reviewerAttestation").check();
 await page.locator("#saveEvaluator").click();
 await page.waitForFunction(()=>document.querySelector("#evaluatorStatus")?.textContent?.includes("structured evaluator review"),null,{timeout:5000});
}
async function inspectStored(page,key,kind){
 return await page.evaluate(({key,kind})=>{
  const ev=JSON.parse(localStorage.getItem(key)||"null"),a=ev?.lastResult,r=a?.evaluator_review||{};
  const A=window.KhaemenesAlgebra1MasteryAuthority;
  return {
   review:r,
   constructedReviewId:a?.constructed_response?.review_id||null,
   authorityMastered:kind==="midterm"?A?.midtermMastered?.():A?.finalMastered?.(),
   evidence:kind==="midterm"?A?.midtermEvidence?.():A?.finalEvidence?.()
  };
 },{key,kind});
}

const results=[];
const specs=[
 {kind:"midterm",path:"midterm-units-01-06.html",id:"KH-MATH-A1-MIDTERM-U01-U06",key:"khaemenes-algebra1-midterm-result-v1",count:6},
 {kind:"final",path:"final-exam-36-weeks.html",id:"KH-MATH-A1-FINAL-36W",key:"khaemenes-algebra1-final-result-v1",count:10}
];

for(const spec of specs){
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push("pageerror: "+e.message));
 page.on("console",m=>{if(m.type()!=="error")return;const msg=m.text();if(/Content Security Policy directive 'frame-ancestors' is ignored/i.test(msg))return;if(/vervenveda-parchment\.css.*Content Security Policy/i.test(msg))return;errors.push("console: "+msg)});

 if(spec.kind==="final"){
  const validMid=bareAttempt("KH-MATH-A1-MIDTERM-U01-U06",6);
  validMid.evaluator_review={schema:"khaemenes-algebra1-evaluator-review-v1",review_id:"a1-review-seeded-midterm",reviewer_name:"Seeded Reviewer",reviewer_role:"teacher",reviewer_note:"Seeded valid Midterm review for the Final prerequisite regression.",attestation:true,review_complete:true,reviewed_at:"2026-10-25T16:10:00.000Z",authoritative:false,identity_authenticated:false,digitally_signed:false};
  await page.goto(`${origin}/courses/mathematics/algebra-1/index.html`,{waitUntil:"load"});
  await seedResult(page,scoped("khaemenes-algebra1-midterm-result-v1"),validMid);
 }

 await page.goto(`${origin}/courses/mathematics/algebra-1/assessments/${spec.path}`,{waitUntil:"load"});
 await page.waitForFunction(()=>window.KhaemenesAlgebra1MasteryAuthority?.version==="1.4",{timeout:15000});
 const resultKey=scoped(spec.key);
 const bare=bareAttempt(spec.id,spec.count);
 await seedResult(page,resultKey,bare);
 await page.reload({waitUntil:"load"});
 await page.waitForFunction(()=>window.KhaemenesAlgebra1MasteryAuthority?.version==="1.4",{timeout:15000});

 const rejected=await page.evaluate(kind=>kind==="midterm"?window.KhaemenesAlgebra1MasteryAuthority.midtermEvidence():window.KhaemenesAlgebra1MasteryAuthority.finalEvidence(),spec.kind);
 assert.equal(rejected.mastery,false,`${spec.kind}: boolean-only review unexpectedly counted as mastery`);
 assert.equal(rejected.rejected_unstructured_review_attempts,1,`${spec.kind}: unstructured review rejection count drift`);

 await completeReview(page,spec.count,spec.kind);
 const stored=await inspectStored(page,resultKey,spec.kind);
 assert.equal(stored.review.schema,"khaemenes-algebra1-evaluator-review-v1",`${spec.kind}: structured review schema missing`);
 assert.ok(String(stored.review.review_id||"").length>=8,`${spec.kind}: review ID missing`);
 assert.equal(stored.review.reviewer_name,"Jordan Reviewer",`${spec.kind}: reviewer name drift`);
 assert.equal(stored.review.reviewer_role,"parent-guardian",`${spec.kind}: reviewer role drift`);
 assert.ok(String(stored.review.reviewer_note||"").length>=12,`${spec.kind}: review note missing`);
 assert.equal(stored.review.attestation,true,`${spec.kind}: reviewer attestation missing`);
 assert.equal(stored.review.identity_authenticated,false,`${spec.kind}: local typed identity must not be represented as authenticated`);
 assert.equal(stored.constructedReviewId,stored.review.review_id,`${spec.kind}: constructed response and evaluator review IDs differ`);
 assert.equal(stored.authorityMastered,true,`${spec.kind}: valid structured review did not satisfy authority`);
 assert.equal(stored.evidence.reviewed_mastery_attempts,1,`${spec.kind}: structured reviewed mastery count drift`);
 assert.equal(stored.evidence.rejected_unstructured_review_attempts,0,`${spec.kind}: updated structured attempt still rejected`);
 assert.equal(errors.length,0,`${spec.kind}: browser errors: ${errors.join(" | ")}`);

 results.push({kind:spec.kind,authorityMastered:stored.authorityMastered,reviewSchema:stored.review.schema,reviewRole:stored.review.reviewer_role,identityAuthenticated:stored.review.identity_authenticated});
 await page.close();
}

await browser.close();
await new Promise(resolve=>server.close(resolve));
console.log("CUMULATIVE REVIEW AUTHORITY BROWSER REGRESSION: PASS");
console.log(JSON.stringify({checks:["boolean-only reviewed mastery rejected","reviewer name required","reviewer role required","review note required","reviewer attestation required","review ID persisted","typed identity explicitly unauthenticated","structured Midterm mastery accepted","structured Final mastery accepted"],results},null,2));
