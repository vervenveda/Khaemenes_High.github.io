#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ids=["career-professional-studies","computing-digital-technology","fine-arts-visual-studio","health-wellness-human-development","music-music-theory"];
const standard="courses/electives/ELECTIVE_QUALITY_STANDARD_V1.md";
assert(fs.existsSync(path.join(root,standard)),"Missing elective quality standard");
let totalWeeks=0,totalDays=0;
for(const id of ids){
 const p=`courses/electives/${id}/course-map.json`;
 const c=JSON.parse(read(p));
 assert.equal(c.schema,"khaemenes-high-school-elective-course-map-v1",id+" schema");
 assert.equal(c.id,id,id+" id drift");
 assert.equal(c.durationWeeks,13,id+" must be 13 weeks");
 assert.equal(c.plannedLessons,65,id+" must declare 65 planned lessons");
 assert.equal(c.masteryThreshold,80,id+" mastery floor");
 assert.equal(c.qualityStandard,standard,id+" standard link");
 assert.equal(c.status,"curriculum-architecture-complete-student-production-pending",id+" status must remain honest before production");
 assert.equal(c.authority,"catalog-plan-until-promotion-gate-passes",id+" must not claim active authority early");
 assert(Array.isArray(c.weeks)&&c.weeks.length===13,id+" needs 13 weekly arcs");
 assert.deepEqual(c.assessmentModel.cumulative,[4,8,12],id+" cumulative checkpoints");
 assert.equal(c.assessmentModel.culminatingWeek,13,id+" culminating week");
 assert.equal(c.privacySafety.forcedSensitiveDisclosure,false,id+" privacy boundary");
 assert.equal(c.privacySafety.accessibleAlternativeRequired,true,id+" accessibility boundary");
 const titles=new Set(),questions=new Set();
 for(let i=0;i<c.weeks.length;i++){
   const w=c.weeks[i];
   assert.equal(w.week,i+1,id+" sequential week numbering");
   assert(typeof w.title==="string"&&w.title.length>6,id+" weak week title "+w.week);
   assert(typeof w.essentialQuestion==="string"&&w.essentialQuestion.endsWith("?"),id+" essential question "+w.week);
   assert(!titles.has(w.title),id+" duplicate week title"); titles.add(w.title);
   assert(!questions.has(w.essentialQuestion),id+" duplicate essential question"); questions.add(w.essentialQuestion);
   assert(Array.isArray(w.days)&&w.days.length===5,id+" Week "+w.week+" needs five days");
   assert.equal(w.masteryCheck.threshold,80,id+" Week "+w.week+" mastery");
   assert.equal(w.cumulativeCheckpoint,[4,8,12].includes(w.week),id+" cumulative checkpoint drift Week "+w.week);
   assert.equal(w.culminating,w.week===13,id+" culminating flag drift Week "+w.week);
   for(let d=0;d<5;d++){
     const day=w.days[d];
     assert.equal(day.day,d+1,id+" Week "+w.week+" day sequence");
     assert(typeof day.phase==="string"&&day.phase.length>3,id+" phase");
     assert(typeof day.task==="string"&&day.task.length>80,id+" Week "+w.week+" Day "+day.day+" task too thin");
     assert(typeof day.evidence==="string"&&day.evidence.length>20,id+" Week "+w.week+" Day "+day.day+" evidence too thin");
     totalDays++;
   }
   totalWeeks++;
 }
}
assert.equal(totalWeeks,65,"Expected 65 weekly arcs across five electives");
assert.equal(totalDays,325,"Expected 325 planned daily learning experiences across five electives");
console.log("PASS elective curriculum architecture: 5 courses · 65 weeks · 325 planned daily learning experiences · Psychology-parity promotion boundary preserved.");
