#!/usr/bin/env node
import fs from "node:fs";

const pages=[
  "courses/mathematics/pre-algebra/assessments/administration-guide.html",
  "courses/mathematics/algebra-1/assessments/administration-guide.html",
  "courses/mathematics/pre-algebra/records/course-completion-certificate.html",
  "courses/mathematics/algebra-1/records/course-completion-certificate.html"
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
    ["translator loader",count(s,/khaemenes-translator-loader\.js/g),1]
  ]) if(got!==want) fail.push(file+" · "+name+" expected "+want+" found "+got);

  if(/<header class="site-header"/i.test(s)) fail.push(file+" · local site header returned");
  if(/high-school-global-chrome-v2\.js|records-landing-chrome\.js|assessment-landing-chrome\.js/.test(s)) fail.push(file+" · legacy shell authority returned");
  if(/khaemenes-typography-standard/.test(s)) fail.push(file+" · embedded typography authority returned");
}

const pre=fs.readFileSync("courses/mathematics/pre-algebra/records/course-completion-certificate.html","utf8");
for(const token of ["sha256Hex","verifyIntegrity","ackUnverified","80%"]){
  if(!pre.includes(token)) fail.push("Pre-Algebra completion record · protected record token missing "+token);
}

const alg=fs.readFileSync("courses/mathematics/algebra-1/records/course-completion-certificate.html","utf8");
for(const token of ["mastery-authority-v1.js","record-engine.js","80%"]){
  if(!alg.includes(token)) fail.push("Algebra I completion record · protected record token missing "+token);
}

if(fail.length){
  console.error(JSON.stringify({status:"FAIL",fail},null,2));
  process.exit(1);
}
console.log(JSON.stringify({
  status:"PASS",
  scope:"Grade 9 mathematics assessment support surfaces",
  pages:pages.length,
  contract:"canonical VNV shell; administration, record integrity and mastery authority retained"
},null,2));
