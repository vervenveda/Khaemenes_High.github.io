#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=__dirname;
const courses=["biology-10","chemistry-11","physics-engineering-12"];
const transferTypes=new Set(["evidence","quantitative","model","application","method","design"]);
const failures=[],summary=[];
for(const course of courses){
  const dir=path.join(root,course);
  const blueprint=path.join(dir,"assessments","SECURE_ASSESSMENT_BLUEPRINT.md");
  if(!fs.existsSync(blueprint)){failures.push(`${course}: missing secure assessment blueprint`);continue}
  const blue=fs.readFileSync(blueprint,"utf8");
  for(const phrase of ["80% mastery floor","Midterm · Week 18","Final · Week 36","Must remain protected","novel phenomenon"]){
    if(!blue.includes(phrase))failures.push(`${course}: blueprint missing required policy phrase: ${phrase}`);
  }
  const map=JSON.parse(fs.readFileSync(path.join(dir,"course-map.json"),"utf8"));
  if(Number(map.assessment?.mastery_target)!==80)failures.push(`${course}: mastery target is not 80`);
  if(!/15-item/i.test(map.assessment?.midterm||""))failures.push(`${course}: course map midterm is not the documented 15-item checkpoint`);
  if(!/30-item/i.test(map.assessment?.final||""))failures.push(`${course}: course map final is not the documented 30-item checkpoint`);
  if(!/midterm/i.test((map.weeks||[]).find(w=>w.week===18)?.title||""))failures.push(`${course}: Week 18 is not identified as midterm`);
  if(!/final/i.test((map.weeks||[]).find(w=>w.week===36)?.title||""))failures.push(`${course}: Week 36 is not identified as final`);
  const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(dir,"question-bank.js"),"utf8"),ctx);
  const key=Object.keys(ctx.window)[0],bank=ctx.window[key]||[];
  const missing=[];
  for(let week=1;week<=36;week++){
    if(week===18||week===36)continue;
    const qs=bank.filter(q=>Number(q.week)===week);
    if(!qs.length){missing.push(`W${week}: no public weekly bank items`);continue}
    if(!qs.some(q=>transferTypes.has(String(q.type||"").toLowerCase())))missing.push(`W${week}: no data/evidence/model/application item`);
  }
  if(missing.length)failures.push(`${course}: ${missing.join("; ")}`);
  const index=fs.readFileSync(path.join(dir,"assessments","index.html"),"utf8");
  if(!index.includes("SECURE_ASSESSMENT_BLUEPRINT.md"))failures.push(`${course}: assessment page does not link the public blueprint`);
  summary.push({course,publicBankItems:bank.length,ordinaryWeeksChecked:34});
}
if(failures.length){console.error("UPPER SCIENCE ASSESSMENT BLUEPRINT VALIDATION: FAIL");failures.forEach(x=>console.error("- "+x));process.exit(1)}
console.log("UPPER SCIENCE ASSESSMENT BLUEPRINT VALIDATION: PASS");
console.log(JSON.stringify({courses:summary,protectedItemExposure:"not required by validator; blueprint forbids publication"},null,2));
