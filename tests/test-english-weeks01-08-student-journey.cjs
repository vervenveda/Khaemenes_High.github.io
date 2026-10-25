#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
let count=0;
for(const grade of [9,10,11,12])for(let week=1;week<=8;week++){
 const html=fs.readFileSync(path.join(root,"courses/language-arts/english-"+grade+"/weeks/week-"+String(week).padStart(2,"0")+"/index.html"),"utf8");
 const id=grade===9&&week===1?"academy-week01-source-studio":week===1?"academy-week01-source-studio":"academy-original-source-studio";
 assert(html.includes('id="'+id+'"'),"Missing offline reading grade "+grade+" week "+week);
 assert(/<main\b/i.test(html),"Missing main grade "+grade+" week "+week);
 assert(/print/i.test(html),"Missing printing support grade "+grade+" week "+week);
 if(grade>=10){
  assert(html.includes("upper-english-records.js"),"Missing scoped records adapter grade "+grade+" week "+week);
  assert(html.includes("learner-scope-v1.js"),"Missing learner scope grade "+grade+" week "+week);
  assert(/data-save-field/.test(html),"Missing saved evidence control grade "+grade+" week "+week);
 }else {
  assert(/data-(?:managed-save|save-field)/.test(html),"Missing Grade 9 writing control week "+week);
 }
 if(week===8)assert(html.includes('href="#academy-original-source-studio"'),"Missing top-of-page source access grade "+grade);
 count++;
}
assert.equal(count,32);
const scoped=fs.readFileSync(path.join(root,"courses/shared/upper-english-records.js"),"utf8");
assert(scoped.includes("The Academy learner changed."),"Learner-switch blocking guard missing");
assert(scoped.includes("Another tab changed this record."),"Stale-tab saving guard missing");
console.log("PASS 32 English 9–12 week 01–08 source and save-control structures, source access Week 08, existing learner switch/stale-tab guards");
console.log("NOT CERTIFIED: browser save/reload/print and cross-learner access must be executed separately.");
