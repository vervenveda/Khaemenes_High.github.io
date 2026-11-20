#!/usr/bin/env node
import fs from "node:fs";

const cumulative=[
  "courses/science/integrated-science-9/assessments/index.html",
  "courses/science/integrated-science-9/diagnostic/index.html",
  "courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html",
  "courses/science/integrated-science-9/assessments/units-01-04/index.html",
  "courses/science/integrated-science-9/assessments/midterm-practice/index.html",
  "courses/science/integrated-science-9/assessments/units-05-07/index.html",
  "courses/science/integrated-science-9/assessments/units-08-09/index.html",
  "courses/science/integrated-science-9/assessments/units-10-12/index.html",
  "courses/science/integrated-science-9/assessments/final-exam/index.html"
];
const unitPages=[];
for(let n=1;n<=12;n++){
  const u=String(n).padStart(2,"0");
  unitPages.push(
    `courses/science/integrated-science-9/units/unit-${u}/mastery-quiz.html`,
    `courses/science/integrated-science-9/units/unit-${u}/unit-assessment.html`
  );
}
const support=[
  "courses/science/integrated-science-9/assessments/units-01-04/printable-test.html",
  "courses/science/integrated-science-9/assessments/units-01-04/student-record.html",
  "courses/science/integrated-science-9/assessments/midterm-practice/printable-test.html",
  "courses/science/integrated-science-9/assessments/midterm-practice/student-record.html",
  "courses/science/integrated-science-9/assessments/units-05-07/printable-test.html",
  "courses/science/integrated-science-9/assessments/units-05-07/student-record.html",
  "courses/science/integrated-science-9/assessments/units-08-09/printable-test.html",
  "courses/science/integrated-science-9/assessments/units-08-09/student-record.html",
  "courses/science/integrated-science-9/assessments/units-10-12/printable-test.html",
  "courses/science/integrated-science-9/assessments/units-10-12/student-record.html",
  "courses/science/integrated-science-9/assessments/final-exam/printable-exam.html",
  "courses/science/integrated-science-9/assessments/final-exam/student-record.html"
];
const focusedPractice=[
  "courses/science/integrated-science-9/units/unit-05/energy-food-web-check.html",
  "courses/science/integrated-science-9/units/unit-05/population-sampling-check.html",
  "courses/science/integrated-science-9/units/unit-05/biodiversity-conservation-check.html",
  "courses/science/integrated-science-9/units/unit-05/evolution-evidence-check.html"
];
const laboratories=[
  "courses/science/integrated-science-9/units/unit-10/earth-interior-plate-lab.html",
  "courses/science/integrated-science-9/units/unit-10/watershed-surface-lab.html",
  "courses/science/integrated-science-9/units/unit-10/biogeochemical-cycle-lab.html",
  "courses/science/integrated-science-9/units/unit-10/climate-energy-balance-lab.html",
  "courses/science/integrated-science-9/units/unit-11/solar-system-orbit-lab.html",
  "courses/science/integrated-science-9/units/unit-11/stellar-spectra-lab.html",
  "courses/science/integrated-science-9/units/unit-11/exoplanet-transit-lab.html",
  "courses/science/integrated-science-9/units/unit-11/galaxy-expansion-lab.html",
  "courses/science/integrated-science-9/units/unit-12/decision-matrix-lab.html",
  "courses/science/integrated-science-9/units/unit-12/prototype-testing-lab.html",
  "courses/science/integrated-science-9/units/unit-12/life-cycle-lab.html",
  "courses/science/integrated-science-9/units/unit-12/risk-reliability-lab.html"
];
const laboratoryChecks=[
  ["courses/science/integrated-science-9/units/unit-10/interior-question-check.html","interior-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-10/watershed-question-check.html","watershed-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-10/cycles-question-check.html","cycles-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-10/climate-question-check.html","climate-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-11/orbit-question-check.html","orbit-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-11/spectra-question-check.html","spectra-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-11/exoplanet-question-check.html","exoplanet-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-11/cosmology-question-check.html","cosmology-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-12/decision-question-check.html","decision-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-12/testing-question-check.html","testing-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-12/lifecycle-question-check.html","lifecycle-question-app.js"],
  ["courses/science/integrated-science-9/units/unit-12/risk-question-check.html","risk-question-app.js"]
];
const pages=[...cumulative,...unitPages,...support,...focusedPractice,...laboratories,...laboratoryChecks.map(x=>x[0])],fail=[];
const count=(s,re)=>(s.match(re)||[]).length;

for(const file of pages){
  const s=fs.readFileSync(file,"utf8");
  for(const [name,got,want] of [
    ["assessment shell marker",count(s,/data-high-assessment-shell="true"/g),1],
    ["333 ticker",count(s,/vnv-333-ticker\.js/g),1],
    ["auto ticker",count(s,/vnv-ticker-autopopulate\.js/g),1],
    ["auto invocation",count(s,/VNV_TICKER\.autoPopulate\s*\(/g),1],
    ["header loader",count(s,/vnv-header-autopopulate\.js/g),1],
    ["header mount",count(s,/VNV_HEADER\.mount\s*\(/g),1],
    ["hamburger-only header",count(s,/"actions":\[\]/g),1],
    ["lower-left tools",count(s,/vnv-class-tools-toolbar\.js/g),1],
    ["lower-right ecosystem",count(s,/vnv-ecosystem-toolbar\.js/g),1],
    ["language engine",count(s,/vnv-language\.js/g),1],
    ["translator loader",count(s,/khaemenes-translator-loader\.js/g),1]
  ]) if(got!==want) fail.push(file+" · "+name+" expected "+want+" found "+got);

  if(/<header class="site-header"/i.test(s)) fail.push(file+" · local site header returned");
  if(/high-school-global-chrome-v2\.js|assessment-landing-chrome\.js|khaemenes-typography-standard|vnv-beta-link\.js/.test(s)) fail.push(file+" · legacy presentation authority returned");
}

for(const file of cumulative.filter(f=>f.includes("/assessments/")&&!f.endsWith("/assessments/index.html"))){
  const s=fs.readFileSync(file,"utf8");
  if(!s.includes("monte-carlo-assessment-v1.js")) fail.push(file+" · Monte Carlo assessment runtime missing");
}
{
  const s=fs.readFileSync("courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html","utf8");
  for(const token of ["readiness-app.js","readiness-routing.js"]) if(!s.includes(token)) fail.push("Science 9 readiness · protected runtime missing "+token);
}
for(const file of laboratories){
  const s=fs.readFileSync(file,"utf8");
  const labOwners=[...s.matchAll(/src=["']([^"']+-lab\.js)["']/g)].map(m=>m[1]);
  if(!labOwners.length) fail.push(file+" · protected laboratory runtime missing");
}
for(const [file,app] of laboratoryChecks){
  const s=fs.readFileSync(file,"utf8");
  if(!s.includes(app)) fail.push(file+" · protected question-check runtime missing "+app);
  if(!/7\/8/.test(s)) fail.push(file+" · 7/8 mastery threshold missing");
}
for(const file of focusedPractice){
  const s=fs.readFileSync(file,"utf8");
  for(const token of ["focused-practice-bank.js","focused-practice-app.js"]){
    if(!s.includes(token)) fail.push(file+" · protected focused-practice runtime missing "+token);
  }
}
for(const file of unitPages){
  const s=fs.readFileSync(file,"utf8");
  if(!s.includes("monte-carlo-assessment-v1.js")) fail.push(file+" · Monte Carlo runtime missing");
  if(!s.includes("question-bank.js")) fail.push(file+" · question bank missing");
  const expected=file.endsWith("mastery-quiz.html")?"quiz-app.js":"assessment-app.js";
  if(!s.includes(expected)) fail.push(file+" · protected app runtime missing "+expected);
}
{
  const s=fs.readFileSync("courses/science/integrated-science-9/units/unit-12/testing-lab.js","utf8");
  for(const token of ["Math.abs(bm)>1e-12","improvement=hasBaseline","Not defined (zero baseline)"]){
    if(!s.includes(token)) fail.push("Unit 12 prototype testing lab · zero-baseline guard missing "+token);
  }
}
if(fail.length){
  console.error(JSON.stringify({status:"FAIL",fail},null,2));
  process.exit(1);
}
console.log(JSON.stringify({
  status:"PASS",
  scope:"Integrated Science 9 assessment surfaces",
  pages:pages.length,
  support_pages:support.length,
  focused_practice_pages:focusedPractice.length,
  laboratory_pages:laboratories.length,
  laboratory_check_pages:laboratoryChecks.length,
  contract:"canonical VNV shell; readiness, Monte Carlo, question banks, unit app runtimes, print/record support and Unit 12 zero-baseline guard retained"
},null,2));
