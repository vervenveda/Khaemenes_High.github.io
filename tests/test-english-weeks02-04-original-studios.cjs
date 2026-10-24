#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const names={
9:["The Unmarked Footpath","Two Accounts of the Market","The Story of the River Lantern"],
10:["The Quiet Seat","The Notice and the Summary","The Clockmaker's Promise"],
11:["A Scholar's Marginal Note","Revising the Public Statement","The Last Window"],
12:["The Archive and Its Silence","A Revision with an Algorithm","An Epic Without a Single Hero"]
};
let count=0;
for(const [grade,titles] of Object.entries(names)){
 for(let i=0;i<3;i++){
 const week=i+2,file=path.join(root,"courses/language-arts/english-"+grade+"/weeks/week-"+String(week).padStart(2,"0")+"/index.html");
 const html=fs.readFileSync(file,"utf8");
 assert.equal((html.match(/id="academy-original-source-studio"/g)||[]).length,1,"Missing unique studio Grade "+grade+" Week "+week);
 for(const item of [titles[i],`data-academy-grade="${grade}"`,`data-academy-week="${week}"`,"Original fictional classroom passage","Academic Evidence · Independent response","80% graded mastery assessment"]){
 assert(html.includes(item),"Missing required reading element Grade "+grade+" Week "+week+": "+item);
 }
 assert(html.indexOf('id="academy-original-source-studio"')<html.indexOf("</main>"),"Studio outside main");
 count++;
 }
}
assert.equal(count,12);
console.log("PASS English Grades 9–12 Weeks 02–04: twelve original offline readings, independent writing tasks, source provenance and mastery boundary");
