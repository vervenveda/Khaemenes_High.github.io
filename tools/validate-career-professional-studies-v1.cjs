#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),exists=p=>fs.existsSync(path.join(root,p)),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const base="courses/electives/career-professional-studies";
const map=JSON.parse(read(base+"/course-map.json"));
assert.equal(map.status,"student-production-complete-runtime-certification-pending");
assert.equal(map.productionEvidence.lessonSurfaces,65);
let lessons=0;
for(let w=1;w<=13;w++)for(let d=1;d<=5;d++){const p=base+`/lessons/week-${String(w).padStart(2,"0")}/day-${String(d).padStart(2,"0")}.html`;assert(exists(p),"Missing "+p);const html=read(p);for(const token of ["Core Lesson","Vocabulary","Worked Model","Guided Practice","Independent Application","Test & Revise","Reflection & Transfer"])assert(html.includes(token),p+" missing "+token);lessons++}
assert.equal(lessons,65);
for(let w=1;w<=13;w++)assert(exists(base+`/assessments/week-${String(w).padStart(2,"0")}.html`),"Missing weekly assessment "+w);
for(let i=1;i<=3;i++)assert(exists(base+`/assessments/cumulative-0${i}.html`),"Missing cumulative "+i);
for(const p of ["index.html","lessons/index.html","portfolio/index.html","assets/career.css","assets/career.js","assets/assessment.js","manifest.webmanifest","offline.html","service-worker.js","register-sw.js"])assert(exists(base+"/"+p),"Missing "+p);
const runtime=read(base+"/assets/career.js");for(const t of ["khaemenes_active_learner_v1","verified:false","data-career-draft"])assert(runtime.includes(t),"Career runtime missing "+t);
const assess=read(base+"/assets/assessment.js");for(const t of ["pct>=80","verified:false","parallel-form retake"])assert(assess.includes(t),"Assessment runtime missing "+t);
const sw=read(base+"/service-worker.js");assert(sw.includes("offline.html")&&sw.includes("caches.open"),"Offline package incomplete");
console.log("PASS Career & Professional Studies source production: 65 lessons · 13 weekly checks · 3 cumulative checkpoints · portfolio defense · learner-safe local drafts · offline package. Runtime/device certification remains pending.");
