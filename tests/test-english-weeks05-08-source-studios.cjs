#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");let checked=0;
const titles={9:["The Keeper of the East Gate","Two Stories of the Winter Fire","The Road Beyond the Orchard","The Letter the Reader Saw"],10:["The Last Rehearsal","The Same Crossing Twice","Three Harvests","A Statement Rewritten"],11:["An Order and a Question","A Bridge in Two Centuries","Across the Meeting Table","The Street Before Rain"],12:["The Choice at the Bell Tower","The Retold Departure","The Unfinished Stanza","Light Through the Archive"]};
for(const [grade,stories] of Object.entries(titles))for(let week=5;week<=8;week++){
 const html=fs.readFileSync(path.join(root,"courses/language-arts/english-"+grade+"/weeks/week-"+String(week).padStart(2,"0")+"/index.html"),"utf8");
 for(const marker of ['id="academy-original-source-studio"','data-academy-grade="'+grade+'"','data-academy-week="'+week+'"',stories[week-5],"Original fictional instructional text","Independent literary evidence","80% mastery gates"]){
 assert(html.includes(marker),"Missing "+marker+" in English "+grade+" Week "+week);
 }
 assert(html.indexOf('id="academy-original-source-studio"')<html.indexOf("</main>"),"Studio outside main");
 checked++;
}
assert.equal(checked,16);
console.log("PASS sixteen offline original English 9–12 Weeks 05–08 literary source studios; mastery contract preserved");
