#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const base=path.join(root,"courses/social-studies/grade-12");
const raw=fs.readFileSync(path.join(base,"course-data.js"),"utf8");
const prefix="window.KHAEMENES_GRADE12_DATA = ";
assert(raw.startsWith(prefix),"Runtime senior course export missing");
const COURSE=JSON.parse(raw.slice(prefix.length).trim().replace(/;$/,""));
const app=fs.readFileSync(path.join(base,"app.js"),"utf8");

assert.equal(COURSE.weeks.length,36);
assert.equal(COURSE.metadata.weeklyMastery,80);
assert.equal(COURSE.metadata.passingOverall,80);
assert.equal(COURSE.metadata.semesterMinimum,80);
assert.equal(COURSE.majorAssessments.length,13);
assert.equal(COURSE.capstoneCheckpoints.length,10);
assert.match(app,/Students cannot self-issue credit/,"Evaluator-only issuance language missing");
assert.match(app,/Final transcript credit issued by evaluator/,"Final issuance gate missing");

// Evaluate only the pure record/stat/gate functions from the live runtime.
const start=app.indexOf("const pct=");
const end=app.indexOf("function setView",start);
assert(start>=0&&end>start,"Current Grade 12 gate helpers missing");
const source=app.slice(start,end);
const sandbox={COURSE,META:COURSE.metadata,console,Math,Date,Number,Object,Array,Map,Set};
vm.createContext(sandbox);
vm.runInContext(source,sandbox);
assert.equal(typeof sandbox.gateAudit,"function");
assert.equal(typeof sandbox.weekMastered,"function");
assert.equal(typeof sandbox.currentWeek,"function");

function passingStudent(){
 const s={
  id:"fictional-senior",
  completedLessons:{},assignments:{},quizzes:{},major:{},capstone:{},weekApprovals:{},journal:{},
  teacher:{hours:COURSE.metadata.minimumHours,integrity:true,evaluator:true,issued:false,issuedDate:"",notes:""}
 };
 for(const w of COURSE.weeks){
  s.completedLessons[w.week]=[true,true,true,true,true];
  for(const a of w.assignments)s.assignments[`${w.week}-${a.number}`]={submitted:true,text:"Verified fictional evidence"};
  s.quizzes[w.week]={completed:true,bestPercent:90,percent:90,shortResponse:"Evidence-based constructed response.",attempts:1};
 }
 for(const m of COURSE.majorAssessments)s.major[m.id]={submitted:true,score:90};
 for(const c of COURSE.capstoneCheckpoints)s.capstone[c.id]={approved:true};
 return s;
}

const s=passingStudent();
let audit=sandbox.gateAudit(s);
assert.equal(audit.ready,true,"Complete pre-issuance record should be evaluator-ready");
assert.equal(audit.complete,false,"Student must not self-issue transcript credit");
assert.equal(audit.gates.find(g=>g.id==="issued").pass,false);

s.teacher.issued=true;s.teacher.issuedDate="2026-11-19";
audit=sandbox.gateAudit(s);
assert.equal(audit.complete,true,"Evaluator-issued complete record should pass all gates");

s.teacher.issued=false;
s.teacher.evaluator=false;
audit=sandbox.gateAudit(s);
assert.equal(audit.gates.find(g=>g.id==="evaluator").pass,false);
assert.equal(audit.ready,false,"Missing evaluator verification must fail closed");
s.teacher.evaluator=true;

const final=COURSE.majorAssessments.find(m=>/final/i.test(m.id)||/final/i.test(m.title));
assert(final,"Cumulative final assessment missing");
s.major[final.id].score=79;
audit=sandbox.gateAudit(s);
assert.equal(audit.gates.find(g=>g.id==="majors").pass,false,"Sub-80 major/final must fail");
s.major[final.id].score=90;

s.quizzes[17].bestPercent=79;
audit=sandbox.gateAudit(s);
assert.equal(audit.gates.find(g=>g.id==="quizzes").pass,false,"Sub-80 weekly mastery must fail");
s.quizzes[17].bestPercent=90;

s.completedLessons[1]=[true,true,true,true];
audit=sandbox.gateAudit(s);
assert.equal(audit.gates.find(g=>g.id==="lessons").pass,false,"Missing required lesson evidence must fail");
s.completedLessons[1]=[true,true,true,true,true];

delete s.assignments["1-1"];
audit=sandbox.gateAudit(s);
assert.equal(audit.gates.find(g=>g.id==="assignments").pass,false,"Missing assignment evidence must fail");

console.log("PASS SS12 current graduation gates: weekly mastery, majors/final, lessons, assignments, evaluator verification and evaluator-only credit issuance");
