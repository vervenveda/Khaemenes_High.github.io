#!/usr/bin/env node
import fs from "node:fs";
const pages=[
"courses/language-arts/english-10/assessments/index.html","courses/language-arts/english-10/assessments/diagnostic/index.html","courses/language-arts/english-10/assessments/midterm/index.html","courses/language-arts/english-10/assessments/final/index.html",
"courses/mathematics/geometry/assessments/index.html","courses/mathematics/geometry/diagnostic/index.html","courses/mathematics/geometry/assessments/midterm.html","courses/mathematics/geometry/assessments/final.html",
"courses/science/biology-10/assessments/index.html","courses/social-studies/grade-10/assessments/midterm.html","courses/social-studies/grade-10/assessments/final.html",
"courses/language-arts/english-11/assessments/index.html","courses/language-arts/english-11/assessments/diagnostic/index.html","courses/language-arts/english-11/assessments/midterm/index.html","courses/language-arts/english-11/assessments/final/index.html",
"courses/mathematics/algebra-2/assessments/index.html","courses/mathematics/algebra-2/diagnostic/index.html","courses/mathematics/algebra-2/assessments/midterm.html","courses/mathematics/algebra-2/assessments/final.html",
"courses/science/chemistry-11/assessments/index.html","courses/social-studies/grade-11/assessments/government-final.html","courses/social-studies/grade-11/assessments/economics-final.html",
"courses/language-arts/english-12/assessments/index.html","courses/language-arts/english-12/assessments/diagnostic/index.html","courses/language-arts/english-12/assessments/midterm/index.html","courses/language-arts/english-12/assessments/final/index.html",
"courses/science/physics-engineering-12/assessments/index.html","courses/social-studies/grade-12/assessments/semester_exam.html","courses/social-studies/grade-12/assessments/cumulative_final.html"
];
const redirects=["courses/social-studies/grade-11/assessments/midterm.html","courses/social-studies/grade-11/assessments/final.html"];
const fail=[],count=(s,re)=>(s.match(re)||[]).length;
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
  ["footer",count(s,/<footer\b/gi),1]
 ])if(got!==want)fail.push(file+" · "+name+" expected "+want+" found "+got);
 if(/assessment-landing-chrome\.js|vnv-beta-link\.js|high-school-global-chrome-v2\.js/.test(s))fail.push(file+" · legacy assessment shell authority returned");
 if(/<header class="site-header"/i.test(s))fail.push(file+" · local site header returned");
 if(/MutationObserver|ResizeObserver/.test(s))fail.push(file+" · observer shell repair returned");
}
for(const file of redirects){
 const s=fs.readFileSync(file,"utf8");
 if(!/http-equiv=["']refresh["']/i.test(s))fail.push(file+" · redirect contract missing");
 if(/vnv-beta-link\.js/.test(s))fail.push(file+" · legacy Beta launcher returned on redirect");
}
for(const [file,token] of [
 ["courses/mathematics/geometry/assessments/index.html",'data-assessment-runtime="gateway-single-owner"'],
 ["courses/mathematics/geometry/diagnostic/index.html",'data-assessment-runtime="single-owner"'],
 ["courses/mathematics/algebra-2/assessments/index.html",'data-assessment-runtime="gateway-single-owner"'],
 ["courses/mathematics/algebra-2/diagnostic/index.html",'data-assessment-runtime="single-owner"']
]){
 if(!fs.readFileSync(file,"utf8").includes(token))fail.push(file+" · protected math runtime marker missing");
}
const tools=fs.readFileSync("assets/high-school-assessment-class-tools-v1.js","utf8");
if(!tools.includes("gradeFromPath"))fail.push("assessment toolbar is not grade-aware");
if(!tools.includes("vnv-language-switch"))fail.push("assessment translator is not docked inside lower-left tools");
if(fail.length){console.error(JSON.stringify({status:"FAIL",fail},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"Grades 10-12 major assessment surfaces",pages:pages.length,redirects:redirects.length,contract:"universal VNV shell only; protected assessment runtimes retained"},null,2));
