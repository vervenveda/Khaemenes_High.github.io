#!/usr/bin/env node
import fs from "node:fs";
const pages=["courses/index.html","courses/mathematics/index.html","courses/language-arts/index.html","courses/science/index.html","courses/social-studies/index.html","courses/physical-education/index.html","courses/electives/index.html"];
const fail=[];
const count=(s,re)=>(s.match(re)||[]).length;
for(const file of pages){
 const s=fs.readFileSync(file,"utf8");
 for(const [name,got,want] of [
  ["subject shell marker",count(s,/data-high-subject-shell="true"/g),1],
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
  ["footer",count(s,/<footer\b/gi),1]
 ]) if(got!==want) fail.push(file+" · "+name+" expected "+want+" found "+got);
 if(/vnv-ecosystem-menu\.js/.test(s))fail.push(file+" · legacy ecosystem menu returned");
 if(/khaemenes-landing-toolbar\.js/.test(s))fail.push(file+" · legacy landing toolbar returned");
 if(/high-school-class-tools-universal-v1\.js/.test(s))fail.push(file+" · older shared class tools returned");
 if(/high-school-global-chrome-v2\.js/.test(s))fail.push(file+" · retired global chrome returned");
 if(/MutationObserver|ResizeObserver/.test(s))fail.push(file+" · observer shell repair returned");
 if(s.includes("label:undefined"))fail.push(file+" · AutoPopulate label is undefined");
 for(const label of ["Learner Profile","Parent Profile","Enrollment"])if(!s.includes(">"+label+"<"))fail.push(file+" · missing "+label);
 if(file!=="courses/mathematics/index.html"&&/<header\b/i.test(s))fail.push(file+" · local page-shell header returned");
 if(file==="courses/mathematics/index.html"){
   const headers=count(s,/<header\b/gi);
   if(headers!==1||!/<header class="dialog-head">/.test(s))fail.push(file+" · only the activity-dialog header may remain");
 }
}
const tools=fs.readFileSync("assets/high-school-subject-landing-class-tools-v1.js","utf8");
for(const label of ["Student","Courses","Search","Translate","Parent","Enroll"])if(!tools.includes('label:"'+label+'"'))fail.push("subject tools missing "+label);
if(!tools.includes("vnv-language-switch"))fail.push("translator not docked in subject lower-left tools");
if(fail.length){console.error(JSON.stringify({status:"FAIL",fail},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"High School subject/front-door landings",pages:pages.length,contract:"one universal VNV shell per subject landing; no legacy shell authorities"},null,2));
