#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const forbidden=[
 "assets/high-school-global-chrome-v2.js",
 "tests/high-chrome-observer-recovery.test.mjs"
];
const loader="high-school-global-chrome-v2.js";
const runtimeExtensions=/\.(?:html?|js|mjs|cjs)$/i;
const exempt=new Set([
 "tools/validate-no-page-regulator.mjs"
]);
const problems=[];
for(const p of forbidden) if(fs.existsSync(p)) problems.push("retired High School regulator artifact returned: "+p);
function walk(dir,out=[]){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if([".git","node_modules"].includes(e.name))continue;
  const p=path.join(dir,e.name);
  if(e.isDirectory())walk(p,out); else out.push(p);
 }
 return out;
}
for(const file of walk(".").filter(p=>runtimeExtensions.test(p)&&!exempt.has(p.replace(/^\.\//,"")))){
 const src=fs.readFileSync(file,"utf8");
 if(src.includes(loader))problems.push(file+" still references retired "+loader);
}
for(const engine of [
 "courses/shared/science-lesson-engine-v0.1.js"
]){
 if(!fs.existsSync(engine))continue;
 const src=fs.readFileSync(engine,"utf8");
 for(const token of [
  "vnv-333-ticker",
  "vnv-ticker-autopopulate",
  "vnv-header-autopopulate",
  "vnv-ecosystem-toolbar",
  "vnv-language",
  "high-school-global-chrome"
 ]){
  if(src.includes(token))problems.push(engine+" must remain instructional-only; found chrome token "+token);
 }
}
if(problems.length){console.error(JSON.stringify({status:"FAIL",problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"High School",policy:"retired page regulator absent from runtime source; Science lesson engine contains no chrome ownership"},null,2));
