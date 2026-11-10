"use strict";
/* English 9 evaluator submission/completion partial-save contract.
 * Run: node --test courses/tests/english9-evaluator-partial-retention.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
for(const [week,kind,marker] of [
 ["03","week03-daily","existingSubmission"],
 ["04","week04-assessment","consistent()"],
 ["12","week12-assessment","matches()"],
 ["13","week13-assessment","match()"]
]){
 const s=read("language-arts/english-9/assets/"+kind+".js");
 test("English 9 Week "+week+" retains unchanged submission during progress-marker retry",()=>{
  assert.ok(s.includes(marker),"submit identity/version check");
  assert.ok(s.includes("Retry this same submission")||s.includes("retry when storage is available"));
  assert.ok(s.includes("progressKey"));
  assert.ok(s.includes("submittedAt:new Date().toISOString()"));
  const retry=s.indexOf("const previouslySaved=")>=0?s.indexOf("const previouslySaved="):s.indexOf("const existingSubmission=");
  const newSubmission=s.indexOf("submittedAt:new Date().toISOString()",retry);
  assert.ok(retry>=0&&newSubmission>retry,"retry happens before minting new submittedAt");
 });
}
test("Week 03 recovery checks retained original Draft 1 and independently written response",()=>{
 const s=read("language-arts/english-9/assets/week03-daily.js");
 assert.ok(s.includes("receipt.independentDraftWordCount===locked.wordCount"));
 assert.ok(s.includes("receipt.finalWordCount===countWords(final.value)"));
 assert.ok(s.includes("receipt.conventionsEntered===conventionsCount()"));
});
test("Week 04 independent rubric review remains separate from student submission",()=>{
 const s=read("language-arts/english-9/assets/week04-assessment.js");
 assert.ok(s.includes("validReview(next,submission)"));
 assert.ok(s.includes("write(reviewKey,JSON.stringify(next))"));
 assert.ok(s.includes("W.progress[W.flag(20)]=true"));
});
test("Week 12 and 13 learner-specific review remains tied to original fingerprints",()=>{
 for(const week of ["12","13"]){
  const s=read("language-arts/english-9/assets/week"+week+"-assessment.js");
  assert.ok(s.includes("fingerprint:"));
  assert.ok(s.includes("validReview(next,submission)"));
  assert.ok(s.includes("W.progress[W.flag("+ (week==="12"?"60":"65") +")]=true"));
 }
});
test("synthetic recovery does not overwrite an existing submission",()=>{
 const snapshot={schema:"english9-week12-day60-submission-v1",learnerId:"synthetic-a",submittedAt:"2026-11-10T09:00:00Z",fingerprint:"evidence-hash"};
 const data=new Map([["submission",JSON.stringify(snapshot)]]);
 let attempts=0;
 function retry(existingMatches,allowProgress){if(!existingMatches)return false;attempts++;if(!allowProgress)return false;data.set("progress",JSON.stringify({day60:true}));return true}
 assert.equal(retry(true,false),false);
 assert.equal(data.get("submission"),JSON.stringify(snapshot));
 assert.equal(retry(true,true),true);
 assert.equal(data.get("submission"),JSON.stringify(snapshot));
 assert.equal(JSON.parse(data.get("progress")).day60,true);
});
