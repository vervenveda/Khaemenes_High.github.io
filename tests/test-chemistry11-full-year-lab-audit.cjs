#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),science="courses/science/chemistry-11";
const map=JSON.parse(fs.readFileSync(path.join(root,science,"course-map.json"),"utf8"));
assert.equal(map.course.duration_weeks,36);
assert.equal(map.course.passing_target,80);
assert.equal(map.weeks.length,36);
const anchors=new Set([1,3,5,10,15,20,25,32]),stats={weeks:0,daily:0,evidence:0,anchors:0};
for(let i=1;i<=36;i++){
 const row=map.weeks[i-1],n=String(i).padStart(2,"0");
 assert.equal(row.week,i,"Misordered week "+i);
 assert(row.lab&&row.lab.length>=15,"Missing investigation or exam alternative Week "+i);
 const folder=path.join(root,science,"weeks","week-"+n),html=fs.readFileSync(path.join(folder,"index.html"),"utf8");
 assert(/<title\b/i.test(html),"Missing title Week "+i);
 assert(/Safety boundary/i.test(html),"Missing safety boundary Week "+i);
 assert(/data-evidence-key=/i.test(html),"Missing evidence Week "+i);
 for(const day of ["monday","tuesday","wednesday","thursday","friday"]){
   assert(html.includes('id="e-'+day+'"'),"Missing preserved "+day+" journal Week "+i);
   stats.evidence++;
 }
 assert(html.includes("localStorage.setItem(k,el.value)"),"Missing existing local persistence Week "+i);
 for(let d=1;d<=5;d++){
   const name="day-"+String(d).padStart(2,"0")+".html";
   assert(fs.existsSync(path.join(folder,"lessons",name)),"Missing deep daily lesson "+i+"/"+d);
   stats.daily++;
 }
 if(anchors.has(i)){
   assert(html.includes('id="anchor-investigation"'),"Missing rich investigation Week "+i);
   assert(/<ol>[\s\S]*?<li>/i.test(html),"Missing investigation sequence Week "+i);
   stats.anchors++;
 }
 stats.weeks++;
}
assert.deepEqual(stats,{weeks:36,daily:180,evidence:180,anchors:8});
console.log("PASS Chemistry 11 route/source audit: 36 weeks, 180 daily lesson files, 180 journals, 8 anchor investigations, preserved 80% gate");
console.log("NOT CERTIFIED: 25% instructional inquiry time, authenticated evaluator review, local-storage learner isolation and browser execution require independent evidence.");
