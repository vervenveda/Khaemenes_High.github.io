#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../../..");
const science=path.join(root,"courses","science");
const failures=[];
const retired=/upper-science-instruction-engine-v1\.js|science-lesson-engine-v0\.1\.js|data-science-engine=["'](?:upper-science-v1|science9-u01-d01)["']/i;

function walkLessons(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory())walkLessons(p);
  else if(/lessons[\\/]day-\d+\.html$/i.test(p)){
   const s=fs.readFileSync(p,"utf8");
   if(retired.test(s))failures.push(path.relative(root,p).split(path.sep).join("/"));
  }
 }
}
walkLessons(science);

let g9Lessons=0,g9Current=0;
function scanG9(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory())scanG9(p);
  else if(/lessons[\\/]day-\d+\.html$/i.test(p)){
   g9Lessons++;
   const s=fs.readFileSync(p,"utf8");
   if(/science9-instruction-engine-v1\.js|data-science-engine=["']science9-v1["']/i.test(s))g9Current++;
  }
 }
}
scanG9(path.join(science,"integrated-science-9"));
if(g9Lessons!==180)failures.push("Science 9 inventory "+g9Lessons+"/180");
if(g9Current!==180)failures.push("Science 9 current-engine coverage "+g9Current+"/"+g9Lessons);

if(failures.length){
 console.error("Retired science engine hook audit: HOLD");
 failures.slice(0,80).forEach(x=>console.error("- "+x));
 process.exit(1);
}
console.log("Retired science engine hook audit: PASS");
console.log("Science 9 current engine: 180/180; retired Upper Science and Science 9 prototype hooks: 0 active lesson references.");
