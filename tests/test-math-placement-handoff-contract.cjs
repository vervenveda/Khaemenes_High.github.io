#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const matrix=JSON.parse(fs.readFileSync(path.join(root,"courses/shared/course-execution-matrix-v1.json"),"utf8"));
for(const id of ["precalculus-trigonometry","calculus-1"]){
 const row=matrix.courses.find(x=>x.id===id);
 assert(row,id+" missing registry entry");
 assert.equal(row.status,"placement-handoff",id+" incorrectly certified");
 assert.equal(row.assessment_authority,"not-complete",id+" incorrectly has grading authority");
 const html=fs.readFileSync(path.join(root,row.entry),"utf8");
 assert(/handoff/i.test(html),id+" must be visibly identified as a handoff");
 assert(fs.existsSync(path.join(root,row.source)),id+" missing video map");
}
for(const dir of ["pre-algebra","algebra-1","geometry","algebra-2"]){
 const file=path.join(root,"courses/mathematics",dir,"index.html");
 assert(fs.existsSync(file),"Missing foundational math entrance "+dir);
 assert(/<title\b/i.test(fs.readFileSync(file,"utf8")),"Missing course title "+dir);
}
console.log("PASS mathematics four foundational entrances + two transparent handoffs");
