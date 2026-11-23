#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(here,"../../..");
const root=path.join(repoRoot,"courses","science","physics-engineering-12");
const jsonMode=process.argv.includes("--json");

const CORE=[
 ["phenomenon",/phenomen|hook|notice|observe|prediction/i],
 ["explicitTeaching",/explicit[- ]teaching|deep lesson|concept|reading|instruction/i],
 ["vocabulary",/vocab|key term|terminology/i],
 ["workedExample",/worked.{0,40}example|example\s*\d|model solution/i],
 ["dataOrModel",/data|graph|table|model|diagram/i],
 ["investigation",/investigat|laborator|lab\b|simulation|field study|engineering challenge/i],
 ["practice",/guided[- ]practice|independent[- ]practice|practice check|formative/i],
 ["misconception",/misconception|common error|why this is wrong/i],
 ["retrieval",/retrieval|recall|review challenge|spaced review/i],
 ["evidence",/claim.{0,20}evidence.{0,20}reason|\bCER\b|constructed explanation|evidence revision/i],
 ["differentiation",/foundation|core pathway|extended|scaffold|differentiation/i],
 ["teacherGuidance",/teacher guidance|teacher note|parent note|expected response|rubric/i],
 ["standards",/NGSS|standard|HS-[A-Z]{2,4}\d/i]
];
const MATHEMATICAL_MODEL=/equation|calculate|vector|graph|slope|model|quantitative/i;
const ENGINEERING_DECISION=/constraint|criterion|prototype|design|trade[- ]?off|optimi[sz]|engineering/i;
const ENGINEERING_WEEKS=new Set([13,33,34,35]);
const RETIRED_ENGINE=/data-science-engine=["']upper-science-v1["']|upper-science-instruction-engine-v1\.js/i;
const PROTECTED_WEEKS=new Set([18,36]);
const ASSESSMENT_BOUNDARY=/assessment boundary|protected final|protected midterm|supervised final|closed-book|protected content/i;
const AUTHORITY_BOUNDARY=/official|authoritative|authenticated|supervised|protected/i;
const FORMATIVE_BOUNDARY=/formative|correction|portfolio|readiness|practice/i;

const strip=s=>s.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<!--([\s\S]*?)-->/g," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ").replace(/\s+/g," ").trim();
const words=s=>strip(s).split(/\s+/).filter(Boolean).length;

const files=[];
for(let w=1;w<=36;w++){
 const dir=path.join(root,"weeks",`week-${String(w).padStart(2,"0")}`,"lessons");
 for(let d=1;d<=5;d++) files.push({week:w,day:d,file:path.join(dir,`day-${String(d).padStart(2,"0")}.html`)});
}
const report={schema:"khaemenes.physics12.strict-certification.v1",generatedAt:new Date().toISOString(),expected:180,found:0,ordinary:{expected:170,passed:0},protected:{expected:10,passed:0},engineMounted:0,failures:[]};

for(const item of files){
 if(!fs.existsSync(item.file)){report.failures.push({week:item.week,day:item.day,reason:["missingFile"]});continue;}
 report.found++;
 const html=fs.readFileSync(item.file,"utf8");
 const reasons=[];
 if(RETIRED_ENGINE.test(html)) reasons.push("retiredEngine");
 else report.engineMounted++;
 if(PROTECTED_WEEKS.has(item.week)){
   if(!ASSESSMENT_BOUNDARY.test(html)) reasons.push("assessmentBoundary");
   if(!AUTHORITY_BOUNDARY.test(html)) reasons.push("authorityBoundary");
   if(!FORMATIVE_BOUNDARY.test(html)) reasons.push("formativeBoundary");
   if(!reasons.length) report.protected.passed++;
 }else{
   for(const [k,re] of CORE) if(!re.test(html)) reasons.push(k);
   if(!MATHEMATICAL_MODEL.test(html)) reasons.push("mathematicalModel");
   if(ENGINEERING_WEEKS.has(item.week)&&!ENGINEERING_DECISION.test(html)) reasons.push("engineeringDecision");
   if(words(html)<500) reasons.push(`depth:${words(html)}`);
   if(!reasons.length) report.ordinary.passed++;
 }
 if(reasons.length) report.failures.push({week:item.week,day:item.day,path:path.relative(repoRoot,item.file).split(path.sep).join("/"),reason:reasons});
}
report.pass=report.found===report.expected&&report.engineMounted===report.expected&&report.ordinary.passed===report.ordinary.expected&&report.protected.passed===report.protected.expected;

if(jsonMode) console.log(JSON.stringify(report,null,2));
else{
 console.log("Khaemenes Academy — Physics & Engineering 12 Strict Certification");
 console.log(`Inventory: ${report.found}/${report.expected}`);
 console.log(`Engine ownership clean: ${report.engineMounted}/${report.expected}`);
 console.log(`Ordinary lessons: ${report.ordinary.passed}/${report.ordinary.expected}`);
 console.log(`Protected assessment pages: ${report.protected.passed}/${report.protected.expected}`);
 console.log(`Verdict: ${report.pass?"PASS":"HOLD"}`);
 if(report.failures.length){
   console.log("Failures:");
   for(const x of report.failures.slice(0,60)) console.log(`  W${String(x.week).padStart(2,"0")}D${String(x.day).padStart(2,"0")}: ${x.reason.join(", ")}`);
 }
}
if(!report.pass) process.exitCode=1;
