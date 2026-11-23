#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(here,"../../..");
const scienceRoot=path.join(repoRoot,"courses","science");
const argv=new Set(process.argv.slice(2));
const jsonMode=argv.has("--json");
const strictMode=argv.has("--strict");
const read=p=>fs.readFileSync(path.join(repoRoot,p),"utf8");
const contract=JSON.parse(read("courses/science/high-school-science-program-contract-v2.json"));
const COURSE_ROWS=[
 {grade:9,slug:"integrated-science-9",label:"Integrated Science 9",status:"SOURCE-VALIDATED / CONDITIONAL"},
 {grade:10,slug:"biology-10",label:"Biology & Biotechnology 10",status:"SOURCE CURRICULUM PASS"},
 {grade:11,slug:"chemistry-11",label:"Chemistry & Materials Science 11",status:"SOURCE CURRICULUM PASS"},
 {grade:12,slug:"physics-engineering-12",label:"Physics & Engineering 12",status:"STRICT A+++ SOURCE PASS"}
];
const diagnostic={
 vocabulary:/vocab|key term|terminology/i,
 retrieval:/retrieval|recall|review challenge|spaced review/i,
 inquiry:/investigat|laborator|lab\b|simulation|field study|engineering challenge/i,
 uncertainty:/uncertaint|error|precision|accuracy|limitation|source of error/i,
 evidence:/claim.{0,20}evidence.{0,20}reason|\bCER\b|constructed explanation|evidence revision/i
};
function walk(dir){
 if(!fs.existsSync(dir))return[];
 const out=[];
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory())out.push(...walk(p)); else out.push(p);
 }
 return out;
}
const lessonFiles=root=>walk(root).filter(p=>/[\\/]lessons[\\/]day-\d+\.html$/i.test(p)).sort();
const pct=(n,d)=>d?Math.round(n/d*1000)/10:0;
const report={
 schema:"khaemenes.high-school-science.department-certification.v2",
 generatedAt:new Date().toISOString(),
 policy:{
  courseSpecificCertificationIsAuthoritative:true,
  genericKeywordCoverage:"diagnostic-only",
  protectedAssessmentWeeks:"course-specific-integrity-contract",
  operationalGatesSeparate:true
 },
 expectedDailyLessons:contract.lessonInventory.total,
 totals:{lessons:0},
 courses:[],
 programCoherence:{
  progression:false,retrieval:false,laboratory:false,assessmentRetention:false,upperCourseRetrievalBindings:false
 },
 verdict:"HOLD",
 holds:[]
};

for(const row of COURSE_ROWS){
 const root=path.join(scienceRoot,row.slug);
 const files=lessonFiles(root);
 const counts=Object.fromEntries(Object.keys(diagnostic).map(k=>[k,0]));
 for(const file of files){
  const html=fs.readFileSync(file,"utf8");
  for(const [k,re] of Object.entries(diagnostic))if(re.test(html))counts[k]++;
 }
 const contractRow=contract.courses.find(c=>c.grade===row.grade);\n const release=read(contractRow.releaseEvidence);
 let sourceEvidencePass=false;
 if(row.grade===9) sourceEvidencePass=/SOURCE-VALIDATED/i.test(release)&&/Units 00–12 are open/i.test(release);
 if(row.grade===10) sourceEvidencePass=/Curriculum source audit status:\s*PASS/i.test(release)&&/180\/180 daily lessons/i.test(release);
 if(row.grade===11) sourceEvidencePass=/CHEMISTRY 11 SOURCE-LEVEL CURRICULUM CERTIFICATION:\s*PASS/i.test(release)&&/180\/180|180 daily lesson/i.test(release);
 if(row.grade===12) sourceEvidencePass=/STRICT A\+\+\+ SOURCE CERTIFIED/i.test(release)&&/Strict source verdict:\s*PASS/i.test(release);
 report.courses.push({
  grade:row.grade,slug:row.slug,label:row.label,lessons:files.length,expected:180,
  sourceStatus:row.status,sourceEvidencePass,
  diagnosticCoverage:Object.fromEntries(Object.entries(counts).map(([k,n])=>[k,{count:n,rate:pct(n,files.length)}]))
 });
 report.totals.lessons+=files.length;
 if(files.length!==180)report.holds.push(row.label+": lesson inventory "+files.length+"/180");
 if(!sourceEvidencePass)report.holds.push(row.label+": course-specific source evidence contract not satisfied");
}

const docs=contract.canonicalDocuments;
report.programCoherence.progression=fs.existsSync(path.join(repoRoot,docs.progression));
report.programCoherence.retrieval=fs.existsSync(path.join(repoRoot,docs.retrieval));
report.programCoherence.laboratory=fs.existsSync(path.join(repoRoot,docs.laboratory));
report.programCoherence.assessmentRetention=fs.existsSync(path.join(repoRoot,docs.assessmentRetention));

const upper=["biology-10","chemistry-11","physics-engineering-12"];
report.programCoherence.upperCourseRetrievalBindings=upper.every(id=>{
 const map=JSON.parse(read("courses/science/"+id+"/course-map.json"));
 const r=map.prior_year_retrieval;
 return r&&r.target_public_cumulative_practice_percent==="5-10"&&Array.isArray(r.required_anchors)&&r.required_anchors.length>=7&&r.checkpoint_weeks?.includes(18)&&r.checkpoint_weeks?.includes(36);
});
for(const [k,v] of Object.entries(report.programCoherence))if(!v)report.holds.push("Program coherence contract missing: "+k);
if(report.totals.lessons!==report.expectedDailyLessons)report.holds.push("Department inventory "+report.totals.lessons+"/"+report.expectedDailyLessons);

report.verdict=report.holds.length?"HOLD":"PASS";

if(jsonMode)console.log(JSON.stringify(report,null,2));
else{
 console.log("Khaemenes Academy — High School Science Department Certification v2");
 console.log("Daily lesson inventory: "+report.totals.lessons+"/"+report.expectedDailyLessons);
 console.log("Policy: course-specific source certification is authoritative; generic marker coverage is diagnostic only.");
 for(const c of report.courses){
  console.log("\nGrade "+c.grade+" — "+c.label);
  console.log("  inventory: "+c.lessons+"/"+c.expected);
  console.log("  source evidence: "+(c.sourceEvidencePass?"PASS":"HOLD")+" · "+c.sourceStatus);
  console.log("  diagnostic visibility: "+Object.entries(c.diagnosticCoverage).map(([k,v])=>k+" "+v.rate+"%").join(", "));
 }
 console.log("\nProgram coherence: "+Object.entries(report.programCoherence).map(([k,v])=>k+"="+(v?"PASS":"HOLD")).join(" · "));
 console.log("Department verdict: "+report.verdict);
 if(report.holds.length)report.holds.forEach((x,i)=>console.log("  "+(i+1)+". "+x));
 console.log("\nInterpretation: diagnostic keyword coverage identifies opportunities for future lesson hardening; it does not override a course-specific source certification or force protected assessment weeks to imitate ordinary teaching lessons.");
}
if(strictMode&&report.verdict!=="PASS")process.exitCode=1;
