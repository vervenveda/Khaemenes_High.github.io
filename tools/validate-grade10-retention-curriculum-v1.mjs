#!/usr/bin/env node
import fs from "node:fs";

const fail=[];
const read=p=>fs.readFileSync(p,"utf8");
const need=(t,x,label)=>{if(!t.includes(x))fail.push(label+" missing: "+x)};

const geo=read("courses/mathematics/geometry/assessments/assets/weekly-mastery-engine-v2.js");
for(const token of [
 "function assessmentQuestions(w)",
 "8 current questions plus 2 delayed higher-order retrieval questions",
 'blueprint:current===1?"10-current":"8-current+2-delayed"',
 'retentionSource:"retrieval"',
 "delayed"
]) need(geo,token,"Geometry");
need(geo,"mastery_met:percent>=MASTERY","Geometry mastery authority");

const bio=read("courses/science/biology-10/biology10-dashboard-app-v1.js");
for(const token of [
 "function biologyRetentionPool(week)",
 "sourceQuotas:{current:4,retrieval:1}",
 'blueprint:"4-current+1-delayed"',
 "delayed retention",
 "retention={blueprint:"
]) need(bio,token,"Biology 10");
need(bio,"pct>=COURSE.passingTarget","Biology mastery authority");

const eng=read("courses/language-arts/english-10/assets/course.js");
for(const token of [
 '"current-anchor":1,"current":3,"retrieval":1',
 'blueprint:week===1?"5-current":"4-current+1-delayed"',
 "retrievalFromWeek",
 "delayed retention"
]) need(eng,token,"English 10");
need(eng,"attemptScore>=80","English mastery authority");

const peData=JSON.parse(read("courses/physical-education/grade-10-instruction.json"));
if(peData.weeks?.length!==36)fail.push("PE10 must contain 36 weeks");
if(peData.weeks.reduce((n,w)=>n+(w.days?.length||0),0)!==180)fail.push("PE10 must contain 180 daily lessons");
if(!peData.weeks.every(w=>w.checks?.length===25))fail.push("PE10 each week must contain 25 question candidates");
const pe=read("courses/physical-education/grade-10.html");
for(const token of [
 "15 current + 5 delayed-retrieval questions",
 "function retentionBank(n)",
 "take(current,15)",
 "take(prior,20)",
 'assessmentSchema="khae-pe-g10-w"+week+"-weekly20-retention-v1"',
 "teacher-review-required"
]) need(pe,token,"PE10");
const peEngine=read("courses/physical-education/assessment-engine.js");
for(const token of ["retentionSource","retrievalFromWeek","retention={current:scoreGroup(current),delayed:scoreGroup(delayed)","passed:correct/attempt.items.length>=0.8"])need(peEngine,token,"PE assessment engine");

const hist=read("courses/social-studies/grade-10/course-data.js");
for(const token of ['"weeks":36','"dailyLessons":180','"assignments":108','"weeklyQuizzes":36',"Retrieve six key terms and three major understandings without notes"])need(hist,token,"US History Honors");

if(fail.length){
 console.error(JSON.stringify({status:"FAIL",fail},null,2));
 process.exit(1);
}
console.log(JSON.stringify({
 status:"PASS",
 scope:"Grade 10 curriculum depth and retention architecture",
 protected:{
  geometry:"8 current + 2 delayed",
  biology:"4 current + 1 delayed",
  english:"4 current + 1 delayed with current passage anchor",
  pe:"36 weeks / 180 days / 25 candidates per week / 15 current + 5 delayed",
  usHistory:"existing retrieval-before-review reference model"
 }
},null,2));
