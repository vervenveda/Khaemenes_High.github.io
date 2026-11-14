#!/usr/bin/env node
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const nav=fs.readFileSync("assets/high-navigation-v1.js","utf8");
const guard=fs.readFileSync("assets/vnv-dual-ticker-v1.js","utf8");
new vm.Script(nav,{filename:"high-navigation-v1.js"});
new vm.Script(guard,{filename:"vnv-dual-ticker-v1.js"});

for(const token of [
  "vnv-333-ticker.js",
  "vnv-ticker-autopopulate.js",
  "VNV333Ticker?.mount",
  "VNV_TICKER?.autoPopulate",
  "vnv333NetworkTicker",
  "vnvTickerAutoPopulate"
]) assert.ok(guard.includes(token),"dual ticker guard missing "+token);
assert.ok(nav.includes("vnv-dual-ticker-v1.js"),"shared navigation must load the dual ticker guard");

const pages=[
"index.html","courses/index.html",
...["09","10","11","12"].flatMap(x=>["grades/grade-"+x+"/index.html","grades/grade-"+x+"/student-profile/index.html"]),
...["mathematics","language-arts","science","social-studies","physical-education","electives"].map(x=>"courses/"+x+"/index.html"),
...["pre-algebra","algebra-1","geometry","algebra-2"].map(x=>"courses/mathematics/"+x+"/index.html"),
...["integrated-science-9","biology-10","chemistry-11","physics-engineering-12"].map(x=>"courses/science/"+x+"/index.html"),
...["09","10","11","12"].map(x=>"courses/social-studies/grade-"+x+"/index.html"),
...["9","10","11","12"].map(x=>"courses/language-arts/english-"+x+"/index.html"),
...["u11-l08","u11-l06","u11-l07"].map(x=>"courses/mathematics/algebra-2/units/unit-11/lessons/"+x+".html"),
"courses/mathematics/algebra-2/units/unit-10/lessons/u10-l05.html"
];

const failures=[];
for(const file of pages){
  const source=fs.readFileSync(file,"utf8");
  const direct333=/vnv-333-ticker\.js|vnv333NetworkTicker/i.test(source);
  const directAuto=/vnv-ticker-autopopulate\.js|vnvTickerAutoPopulate/i.test(source);
  const directGuard=/vnv-dual-ticker-v1\.js/i.test(source);
  const sharedGuard=/high-navigation-v1\.js/i.test(source)&&nav.includes("vnv-dual-ticker-v1.js");
  if(!((direct333&&directAuto)||directGuard||sharedGuard))failures.push(file);
}
assert.deepEqual(failures,[],"canonical landing surfaces without effective dual ticker coverage: "+failures.join(", "));
console.log("HIGH SCHOOL DUAL TICKER COVERAGE: PASS · "+pages.length+" canonical landing/navigation surfaces · 333 + AutoPopulate");
