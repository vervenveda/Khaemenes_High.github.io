#!/usr/bin/env node
import fs from "node:fs";
const fail=[];
const read=p=>fs.readFileSync(p,"utf8");
const need=(t,x,label)=>{if(!t.includes(x))fail.push(label+" missing: "+x)};

const a2=read("courses/mathematics/algebra-2/assets/algebra2-weekly-mastery-v1.js");
for(const token of [
 "function selectCurrent(w)",
 'retentionSource:"retrieval"',
 "retrievalFromWeek",
 "return kept.concat(delayed).slice(0,10)"
]) need(a2,token,"Algebra II");
const math=read("courses/mathematics/assets/math-weekly-mastery-engine-v1.js");
for(const token of [
 "delayedCorrect",
 'blueprint:delayedTotal?"8-current+2-delayed":"10-current"',
 "retrieval_from_weeks"
]) need(math,token,"Math weekly engine");
need(math,"mastery_met:percent>=M","Math mastery authority");

const eng=read("courses/language-arts/english-11/assets/course.js");
for(const token of [
 "window.ENGLISH_11_CURRICULUM",
 '"current-anchor":1,"current":3,"retrieval":1',
 'blueprint:week===1?"5-current":"4-current+1-delayed"',
 "retrievalFromWeek"
]) need(eng,token,"English 11");
need(eng,"attemptScore>=80","English mastery authority");

const chem=read("courses/science/chemistry-11/index.html");
for(const token of [
 "Delayed retrieval · non-grading",
 "Retrieve before review",
 'id="retentionNote"',
 "state.retention[state.week]"
]) need(chem,token,"Chemistry 11");
need(chem,"pct>=80","Chemistry practice authority");

const peData=JSON.parse(read("courses/physical-education/grade-11-instruction.json"));
if(peData.weeks?.length!==36)fail.push("PE11 must contain 36 weeks");
if(peData.weeks.reduce((n,w)=>n+(w.days?.length||0),0)!==180)fail.push("PE11 must contain 180 days");
if(!peData.weeks.every(w=>w.checks?.length===25))fail.push("PE11 each week must contain 25 candidates");
const pe=read("courses/physical-education/grade-11.html");
for(const token of [
 "15 current + 5 delayed-retrieval questions",
 "function retentionBank(n)",
 "take(current,15)",
 "teacher-review-required"
]) need(pe,token,"PE11");

const gov=read("courses/social-studies/grade-11/course-data.js");
for(const token of [
 '"weeks":36',
 '"dailyLessons":180',
 '"assignments":108',
 '"weeklyQuizzes":36',
 "Complete a collaborative retrieval review using new examples"
]) need(gov,token,"Government/Law/Economics");

const fin=read("courses/social-studies/grade-11/personal-finance/course-data.js");
for(const token of [
 '"weeks":18',
 '"dailyLessons":90',
 '"assignments":54',
 '"weeklyQuizzes":18',
 "Complete a collaborative retrieval review using new examples"
]) need(fin,token,"Personal Finance");

if(fail.length){console.error(JSON.stringify({status:"FAIL",fail},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"Grade 11 curriculum depth and retention architecture"},null,2));
