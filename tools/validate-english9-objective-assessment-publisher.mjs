import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const get=p=>fs.readFileSync(path.join(root,p),"utf8");
const script=get("courses/shared/english9-objective-assessment-publisher.js");
const page=get("portfolio/index.html"),report=get("portfolio/portfolio-academic-report.js");
assert.match(page,/english9-objective-assessment-publisher\.js\?v=20261120-v1/);
assert.match(report,/english9ObjectiveEvidence/);
assert.match(report,/english-9-objective-evidence/);
assert.match(report,/Teacher-reviewed writing/);
function exercise({wrong=false,bad=false,mid=true,fin=true,conflict=false,unscoped=false}={}){
 const published=new Map(),source={};
 for(const [kind,total,enabled] of [["midterm",30,mid],["final",50,fin]]){
  if(!enabled)continue;
  const correct=total===30?27:45;
  source[kind]={attempts:[{id:kind+"-session",kind,completedAt:"2026-11-18T12:00:00Z",
   summary:{sessionId:kind+"-session",correct,total,questionCount:total,score:bad?5:90,
    answerPayload:"PRIVATE_NEVER_PUBLISH"}}]};
 }
 let writes=0,storageWrites=0;
 const window={document:{readyState:"complete"},addEventListener(){},
  localStorage:{getItem:()=>{throw Error("raw local storage read forbidden")},setItem:()=>storageWrites++},
  KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:"learner-A"}),
   readJSON:key=>unscoped?null:source[key.replace("khae-ela9-assessment-v2:","")]||null},
  KhaemenesHighProfileGradeContext:{active:()=>({grade:"09",learnerId:wrong?"learner-B":"learner-A"})},
  KhaemenesLearningContinuation:{
   readCourse:(_,id)=>conflict?{source:"unrelated"}:published.get(id)||null,
   publish:item=>{writes++;published.set(item.courseId,JSON.parse(JSON.stringify(item)))}
  }
 };
 vm.runInNewContext(script,{window,document:window.document});
 const initial=writes,replay=window.KhaemenesEnglish9ObjectivePublisher.publish();
 return {initial,writes,replay,storageWrites,records:[...published.values()]};
}
const good=exercise();
const checks=[
 ["midterm and final indexed",()=>assert.equal(good.records[0].assessments.length,2)],
 ["objective-only category",()=>assert.equal(good.records[0].courseId,"english-9-objective-evidence")],
 ["earned score retained",()=>assert.equal(good.records[0].assessments[0].earned,45)],
 ["not an official grade",()=>assert.match(good.records[0].summary,/Not an official final grade/)],
 ["no answer payload copied",()=>assert(!JSON.stringify(good.records).includes("PRIVATE_NEVER_PUBLISH"))],
 ["same-record replay idempotent",()=>assert.equal(good.writes,1)],
 ["no writes to source storage",()=>assert.equal(good.storageWrites,0)],
 ["mismatched learner rejected",()=>assert.equal(exercise({wrong:true}).writes,0)],
 ["unscoped evidence not imported",()=>assert.equal(exercise({unscoped:true}).writes,0)],
 ["invalid score rejected",()=>assert.equal(exercise({bad:true}).writes,0)],
 ["foreign ledger owner retained",()=>assert.equal(exercise({conflict:true}).writes,0)],
 ["midterm-only history allowed",()=>assert.equal(exercise({fin:false}).records[0].assessments.length,1)],
 ["final-only history allowed",()=>assert.equal(exercise({mid:false}).records[0].assessments.length,1)]
];
for(const [name,fn] of checks){fn();console.log("PASS",name)}
console.log("ENGLISH9_OBJECTIVE_HISTORY_SYNTHETIC_PASS="+checks.length);
