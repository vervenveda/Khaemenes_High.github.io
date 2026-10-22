// High School student-facing learner toolbar coverage audit (read-only).
import fs from "node:fs";
import path from "node:path";
import {isStudentFacing,toolbarStatus} from "./student-toolbar-policy.mjs";

const root=process.cwd(),records=[];
function walk(dir){
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    if(item.name===".git"||item.name==="node_modules")continue;
    const p=path.join(dir,item.name);
    if(item.isDirectory()){walk(p);continue}
    if(!item.name.endsWith(".html"))continue;
    const rel=path.relative(root,p).replaceAll(path.sep,"/");
    const html=fs.readFileSync(p,"utf8");
    const studentFacing=isStudentFacing(rel,html);
    records.push({page:rel,course:rel.split("/").slice(0,3).join("/"),studentFacing,status:studentFacing?toolbarStatus(html):"excluded"});
  }
}
walk(root);

const totals={direct:0,shared:0,uncovered:0,excluded:0};
for(const item of records)totals[item.status]=(totals[item.status]||0)+1;
const student=records.filter(x=>x.studentFacing);
const gaps=student.filter(x=>x.status==="uncovered");
const byCourse={};
for(const p of gaps)(byCourse[p.course]??=[]).push(p.page);

const report={
  totalHtml:records.length,
  studentFacingTotal:student.length,
  excludedNonStudent:totals.excluded,
  totals:{direct:totals.direct,shared:totals.shared,uncovered:totals.uncovered},
  uncoveredByCourse:Object.fromEntries(Object.entries(byCourse).sort((a,b)=>b[1].length-a[1].length).map(([key,paths])=>[key,{count:paths.length,samples:paths.slice(0,12)}])),
  uncoveredStudentFacingPages:gaps.map(x=>x.page)
};
fs.mkdirSync("reports",{recursive:true});
fs.writeFileSync("reports/student-toolbar-coverage.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({
  totalHtml:report.totalHtml,
  studentFacingTotal:report.studentFacingTotal,
  excludedNonStudent:report.excludedNonStudent,
  totals:report.totals,
  uncoveredCourses:Object.keys(byCourse).length,
  largestGaps:Object.entries(report.uncoveredByCourse).slice(0,16).map(([course,v])=>({course,count:v.count}))
},null,2));
if(process.env.REQUIRE_FULL_TOOLBAR_COVERAGE==="1"&&gaps.length){
  console.error("FAIL: "+gaps.length+" student-facing High School page(s) lack the canonical learner rail.");
  process.exitCode=1;
}else if(!gaps.length){
  console.log("PASS: every classified student-facing High School HTML page has a direct or shared learner rail path.");
}
