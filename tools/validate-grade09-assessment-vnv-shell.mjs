#!/usr/bin/env node
import fs from "node:fs";
const pages=[
"courses/language-arts/english-9/assessments/index.html",
"courses/language-arts/english-9/assessments/diagnostic/index.html",
"courses/language-arts/english-9/assessments/midterm/index.html",
"courses/language-arts/english-9/assessments/final/index.html",
"courses/mathematics/pre-algebra/assessments/index.html",
"courses/mathematics/pre-algebra/diagnostic/index.html",
"courses/mathematics/algebra-1/assessments/index.html",
"courses/mathematics/algebra-1/diagnostic/index.html",
"courses/mathematics/algebra-1/readiness/index.html",
"courses/science/integrated-science-9/assessments/index.html",
"courses/science/integrated-science-9/diagnostic/index.html",
"courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html",
"courses/social-studies/grade-09/assessments/readiness-v3.html",
"courses/social-studies/grade-09/assessments/midterm.html",
"courses/social-studies/grade-09/assessments/final.html"
];
const fail=[];
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
  ["translator loader",count(s,/khaemenes-translator-loader\.js/g),1],
  ["footer",count(s,/<footer\b/gi),1]
 ])if(got!==want)fail.push(file+" · "+name+" expected "+want+" found "+got);
 if(/assessment-landing-chrome\.js|high-school-global-chrome-v2\.js|vnv-beta-link\.js/.test(s))fail.push(file+" · legacy assessment shell authority returned");
 if(/MutationObserver|ResizeObserver/.test(s))fail.push(file+" · observer shell repair returned");
 if(/<header class="site-header"/i.test(s))fail.push(file+" · local site header returned");
}
for(const required of [
 ["courses/language-arts/english-9/assessments/diagnostic/index.html","course-entry-contract.js"],
 ["courses/language-arts/english-9/assessments/midterm/index.html","monte-carlo-assessment-v1.js"],
 ["courses/mathematics/pre-algebra/diagnostic/index.html","math-assessment-directive-v1.js"],
 ["courses/mathematics/algebra-1/diagnostic/index.html","math-assessment-directive-v1.js"],
 ["courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html","readiness-app.js"],
 ["courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html","readiness-routing.js"],
 ["courses/social-studies/grade-09/assessments/readiness-v3.html","grade09-records.js"]
]){
 const s=fs.readFileSync(required[0],"utf8");
 if(!s.includes(required[1]))fail.push(required[0]+" · protected engine missing "+required[1]);
}
if(fail.length){console.error(JSON.stringify({status:"FAIL",fail},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"Grade 9 major assessment surfaces",pages:pages.length,contract:"universal VNV shell only; protected assessment engines retained"},null,2));
