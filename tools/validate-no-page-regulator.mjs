#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const forbidden=[
 "assets/high-school-global-chrome-v2.js",
 "tests/high-chrome-observer-recovery.test.mjs"
];
const loader="high-school-global-chrome-v2.js";
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
for(const file of walk(".").filter(p=>/\.html?$/i.test(p))){
 const src=fs.readFileSync(file,"utf8");
 if(src.includes(loader))problems.push(file+" still loads retired "+loader);
}
if(problems.length){console.error(JSON.stringify({status:"FAIL",problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"High School",policy:"retired page regulator absent from assets and HTML loaders"},null,2));
