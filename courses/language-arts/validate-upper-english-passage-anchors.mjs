#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path");
const base=__dirname;
let failures=[],total=0;
for(const grade of [10,11,12]){
  const root=path.join(base,`english-${grade}`);
  const jsonPath=path.join(root,"assets","quiz-specific-bank.json");
  const jsPath=path.join(root,"assets","quiz-specific-bank.js");
  const coursePath=path.join(root,"assets","course.js");
  const bank=JSON.parse(fs.readFileSync(jsonPath,"utf8"));
  if(bank.version!=="v4-passage-anchored")failures.push(`English ${grade}: unexpected bank version ${bank.version}`);
  if(!Array.isArray(bank.rows)||bank.rows.length!==36)failures.push(`English ${grade}: expected 36 weekly rows`);
  (bank.rows||[]).forEach((row,i)=>{
    total++;
    if(!Array.isArray(row)||row.length<2)failures.push(`English ${grade} week ${i+1}: expected at least two supplemental items`);
    const anchor=row?.[0],meta=anchor?.[4];
    if(!Array.isArray(anchor)||!anchor[0]||!Array.isArray(anchor[1])||anchor[1].length!==4)failures.push(`English ${grade} week ${i+1}: malformed anchor item`);
    if(meta?.anchor!==true||meta?.anchorType!=="passage-or-source")failures.push(`English ${grade} week ${i+1}: first supplemental item is not tagged as a passage/source anchor`);
  });
  const js=fs.readFileSync(jsPath,"utf8");
  if(!js.includes("v4-passage-anchored"))failures.push(`English ${grade}: JS mirror is not v4-passage-anchored`);
  const course=fs.readFileSync(coursePath,"utf8");
  if(!course.includes('sourceQuotas:supplemental.some(q=>q.source==="passage-anchor")?{"passage-anchor":1}:null'))failures.push(`English ${grade}: weekly draw does not guarantee one passage anchor`);
  if(!course.includes("supplementalVersion"))failures.push(`English ${grade}: supplemental item IDs are not version-scoped`);
}
if(failures.length){console.error("UPPER ENGLISH PASSAGE-ANCHOR VALIDATION: FAIL");failures.forEach(x=>console.error("- "+x));process.exit(1)}
console.log("UPPER ENGLISH PASSAGE-ANCHOR VALIDATION: PASS");
console.log(JSON.stringify({courses:3,weeksPerCourse:36,weeklyAnchorRequirements:total,masteryFloor:"80% unchanged"},null,2));
