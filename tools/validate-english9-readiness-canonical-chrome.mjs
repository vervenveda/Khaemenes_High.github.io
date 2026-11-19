import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

const html=fs.readFileSync("courses/language-arts/english-9/index.html","utf8");
const course=fs.readFileSync("courses/language-arts/english-9/assets/course.js","utf8");
const marker='<div id="english9ChromeAnchor" data-khae-header hidden aria-hidden="true"></div>';
assert.equal(html.split(marker).length-1,1,"Single canonical chrome anchor required");
assert.ok(html.indexOf(marker)<html.indexOf('<div class="app">'),"Mount the official tickers/header before dashboard");
assert.ok(html.includes('id="khaemenes-english9-canonical-css-v2"'),"Existing single page CSS owner must remain");
assert.ok(html.includes("body>.english9-entry-gate .english9-entry-card"),"Readiness card must be styled by existing owner");
for(const fragment of [
 "z-index:2147479000!important",
 "max-width:620px!important",
 "text-align:center!important",
 "color:#fff8e9!important",
 "font:400 16px/1.4",
 "english9-entry-back",
 "aria-labelledby",
 "english9-entry-actions"
])assert.ok(html.includes(fragment)||course.includes(fragment),"Missing accessible readiness UI contract: "+fragment);

assert.equal((html.match(/vnv-333-ticker\.js\?v=/g)||[]).length,1,"Exactly one official 333 loader");
assert.equal((html.match(/vnv-ticker-autopopulate\.js\?v=/g)||[]).length,1,"Exactly one official auto ticker loader");
assert.equal((html.match(/vnv-header-autopopulate\.js\?v=/g)||[]).length,1,"Exactly one official header loader");
assert.equal((html.match(/vnv-class-tools-toolbar\.js\?v=/g)||[]).length,1,"Exactly one class tools loader");
assert.equal((html.match(/vnv-ecosystem-toolbar\.js\?v=/g)||[]).length,1,"Exactly one official ecosystem toolbar loader");

assert.ok(course.includes('if(ready)return {allow:true,profile:academyProfile}'),"Existing 80% readiness decision preserved");
assert.ok(course.includes('readiness.overall_percent>=80'),"Readiness 80% threshold preserved");
assert.ok(course.includes('new URL("assessments/diagnostic/index.html"'),"Diagnostic route preserved");
assert.ok(course.includes('new URL("foundations/index.html"'),"Foundations bridge route preserved");
assert.ok(course.includes('dashboard.inert=true'),"Block student course UI until readiness");
assert.ok(!course.includes('document.querySelectorAll("body > :not(script)")'),"Never inert the global canonical chrome");
assert.ok(!course.includes('gate.style.cssText'),"Do not reintroduce inline readiness layout overrides");
assert.ok(!course.includes('English 9 home";home.style.cssText'),"Do not return a blocked student to same home");
assert.ok(course.includes('home.textContent="Student Profile"'),"Provide explicit Student Profile exit");

const scripts=[...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(x=>x.trim());
for(const [i,source] of scripts.entries())new vm.Script(source,{filename:"english9-index-inline-"+i+".js"});
new vm.Script(course,{filename:"english9-course.js"});
console.log("ENGLISH9_READINESS_CHROME_CENTERED_SOURCE_PASS");
