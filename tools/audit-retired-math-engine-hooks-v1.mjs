#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const math=path.join(root,"courses","mathematics");
const retired=["legacy-mastery-engine-v2.js","lesson-01-number-systems-engine-preview.html"];
const failures=[];
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory()){
   if(/(?:workflow[\\/]logs|docs[\\/]internal[\\/]legacy|legacy-video-manifest)/i.test(p))continue;
   walk(p);
  }else if(/\.(?:html|js|mjs|cjs|json|yml|yaml)$/i.test(e.name)){
   const s=fs.readFileSync(p,"utf8");
   for(const token of retired)if(s.includes(token))failures.push(path.relative(root,p).split(path.sep).join("/")+" references "+token);
  }
 }
}
walk(math);
for(const token of retired){
 const matches=[];
 function find(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())find(p);else if(e.name===token)matches.push(p)}}
 find(math);
 if(matches.length)failures.push("retired artifact still exists: "+matches.map(p=>path.relative(root,p).split(path.sep).join("/")).join(", "));
}
if(failures.length){console.error("Retired Mathematics engine audit: HOLD");failures.forEach(x=>console.error("- "+x));process.exit(1)}
console.log("Retired Mathematics engine audit: PASS");
console.log("Legacy Algebra I mastery v2 and the obsolete Pre-Algebra engine preview are absent and unreferenced.");
