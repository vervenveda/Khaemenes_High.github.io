#!/usr/bin/env node
"use strict";
/* Fast repository release contract. Static/source validation only; not browser acceptance. */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const json=p=>JSON.parse(read(p));
const matrix=json("courses/shared/course-execution-matrix-v1.json");
const sweep=json("courses/shared/grade-09-12-execution-sweep-v1.json");
const profiles=json("grades/shared/high-school-profile-runtime-contract-v1.json");
const problems=[];
const check=(ok,msg)=>{if(!ok)problems.push(msg)};
check(matrix.policy?.mastery_floor_percent===80,"mastery floor is not 80%");
check(Array.isArray(matrix.courses)&&matrix.courses.length>=22,"course execution matrix unexpectedly shrank");
const ids=new Set();
const authorityKeys=["current_lesson_resolver","weekly_assessment_owner","midterm_owner","final_owner","mastery_owner","persistence","portfolio_publisher","completion_record"];
for(const c of matrix.courses||[]){
 check(!ids.has(c.id),"duplicate matrix id: "+c.id);ids.add(c.id);
 check(exists(c.entry),c.id+" entry missing: "+c.entry);
 check(exists(c.source),c.id+" source missing: "+c.source);
 try{json(c.source)}catch{check(false,c.id+" source JSON invalid: "+c.source)}
 check(c.authority_contract&&typeof c.authority_contract==="object",c.id+" authority contract missing");
 for(const key of authorityKeys){
  const row=c.authority_contract?.[key];
  check(row&&typeof row.owner==="string"&&row.owner.length>0,c.id+" missing authority owner: "+key);
  check(["declared","pending-verification","verified-outbound-only"].includes(row?.status),c.id+" invalid authority status: "+key);
  const owner=row?.owner||"";
  if(/^(courses|grades|portfolio)\//.test(owner)&&/\.(?:js|html|json)$/.test(owner))check(exists(owner),c.id+" authority owner path missing: "+owner);
 }
 check(typeof c.authority_contract?.persistence?.schema==="string",c.id+" persistence schema missing");
}
check(Array.isArray(sweep.entries)&&sweep.entries.length>=20,"execution sweep unexpectedly shrank");
for(const e of sweep.entries||[])check(exists(e.entry),"sweep route missing: "+e.id+" -> "+e.entry);
for(const grade of ["09","10","11","12"]){
 const cfg=profiles.grades?.[grade];
 check(cfg&&exists(cfg.entry),"profile contract entry missing for Grade "+grade);
}
const sw=read("service-worker.js");
check(sw.includes("khaemenes-high-v44-topology-hardening-20261123"),"service worker current runtime generation missing");
check(!sw.includes("seven-class-schedule.js"),"service worker still references seven-class schedule");
check(!sw.includes("upper-grade-seven-class.js"),"service worker still references upper-grade seven-class runtime");
for(const p of ["portfolio/portfolio-evidence-receipts.js","portfolio/portfolio-academic-report.js","portfolio/portfolio-student-record-connections.js"]){
 check(exists(p),"portfolio hardening file missing: "+p);
}
const portfolio=read("portfolio/index.html");
check(portfolio.includes("portfolio-evidence-receipts.js"),"Portfolio does not load evidence receipt bridge");
for(const p of [
 "grades/shared/high-school-profile-runtime-v2.json",
 "courses/shared/high-school-world-languages-federation-v1.json",
 "courses/shared/high-school-release-certification-v1.json",
 "tools/validate-high-school-legacy-dependencies-v1.cjs",
 "tools/validate-high-school-profile-runtime-v2.cjs",
 "tools/validate-high-school-offline-topology-v1.cjs",
 "tools/validate-high-school-world-languages-federation-v1.cjs",
 "tools/validate-high-school-release-certification-v1.cjs"
]) check(exists(p),"topology hardening contract missing: "+p);
const pending=matrix.courses.flatMap(c=>authorityKeys.filter(k=>c.authority_contract?.[k]?.status==="pending-verification").map(k=>c.id+":"+k));
if(problems.length){
 console.error("FAIL high-school release gate ("+problems.length+")\n"+problems.join("\n"));
 process.exitCode=1;
}else{
 console.log("PASS high-school release gate · "+matrix.courses.length+" matrix courses · "+sweep.entries.length+" route entries · four profile contracts");
 console.log("EXPLICIT HOLDS "+pending.length+(pending.length?" · "+pending.join(", "):""));
 console.log("NOTE source/static gate only; browser/device and hosted-status acceptance remain separate.");
}
