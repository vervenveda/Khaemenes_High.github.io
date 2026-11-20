#!/usr/bin/env node
import fs from "node:fs";
const pages=["index.html","grades/grade-09/index.html","grades/grade-10/index.html","grades/grade-11/index.html","grades/grade-12/index.html"];
const fail=[];
const count=(s,re)=>(s.match(re)||[]).length;
for(const file of pages){
 const s=fs.readFileSync(file,"utf8");
 const exact=[
  ["universal shell marker",count(s,/data-high-universal-shell="true"/g),1],
  ["333 ticker",count(s,/vnv-333-ticker\.js/g),1],
  ["auto ticker",count(s,/vnv-ticker-autopopulate\.js/g),1],
  ["auto ticker invocation",count(s,/VNV_TICKER(?:\?*\.)?autoPopulate\s*\(/g),1],
  ["header loader",count(s,/vnv-header-autopopulate\.js/g),1],
  ["header mount",count(s,/VNV_HEADER(?:\?*\.)?mount\s*\(/g),1],
  ["hamburger-only actions",count(s,/"actions":\[\]/g),1],
  ["lower-left class tools",count(s,/vnv-class-tools-toolbar\.js/g),1],
  ["lower-right ecosystem toolbar",count(s,/vnv-ecosystem-toolbar\.js/g),1],
  ["language engine",count(s,/vnv-language\.js/g),1],
  ["translator loader",count(s,/khaemenes-translator-loader\.js/g),1],
  ["phrase bank",count(s,/khaemenes-campus-phrases\.js/g),1],
  ["interlingual core",count(s,/khaemenes-interlingual-core\.js/g),1],
  ["site footer",count(s,/<footer\b/gi),1]
 ];
 for(const [name,got,want] of exact)if(got!==want)fail.push(file+" · "+name+" expected "+want+" found "+got);
 if(/<header\b/i.test(s))fail.push(file+" · local header markup returned");
 if(/vnv-ecosystem-menu\.js/.test(s))fail.push(file+" · legacy ecosystem menu returned");
 if(/learning-tools-menu-v1\.js/.test(s))fail.push(file+" · legacy learning tools menu returned");
 if(/high-school-global-chrome-v2\.js/.test(s))fail.push(file+" · retired global chrome returned");
 if(/MutationObserver|ResizeObserver/.test(s))fail.push(file+" · observer-based shell repair returned");
 for(const label of ["Learner Profile","Parent Profile","Enrollment"])if(!s.includes(">"+label+"<"))fail.push(file+" · missing access button "+label);
}
const tools=fs.readFileSync("assets/high-school-main-landing-class-tools-v1.js","utf8");
for(const label of ["Student","Courses","Search","Translate","Parent","Enroll"])if(!tools.includes('label:"'+label+'"'))fail.push("main landing tools missing "+label);
if(!tools.includes("vnv-language-switch"))fail.push("translator is not docked inside lower-left tools");
const nav=fs.readFileSync("assets/high-navigation-v1.js","utf8");
if(!nav.includes('dataset.highUniversalShell==="true"'))fail.push("shared navigation does not honor universal-shell boundary");
if(fail.length){console.error(JSON.stringify({status:"FAIL",fail},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"High School main + Grades 9-12 landings",pages:pages.length,contract:"one universal VNV shell each; no legacy local header/menu; no observer shell repair"},null,2));
