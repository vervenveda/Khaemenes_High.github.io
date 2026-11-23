#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const roots=["courses","grades","portfolio"];
const extensions=new Set([".html",".js",".mjs",".cjs",".json",".css"]);
const skipParts=new Set([".git","node_modules","archive","archives","backup","backups","vendor","private"]);
const exempt=new Set([
  "courses/shared/high-school-course-ownership-manifest-v1.json"
]);
const findings=[];
function walk(rel){
  const full=path.join(root,rel);
  if(!fs.existsSync(full))return;
  for(const entry of fs.readdirSync(full,{withFileTypes:true})){
    if(skipParts.has(entry.name.toLowerCase()))continue;
    const child=path.join(rel,entry.name).split(path.sep).join("/");
    if(child==="courses/shared/shared"||child.startsWith("courses/shared/shared/"))continue;
    if(entry.isDirectory())walk(child);
    else if(entry.isFile()&&extensions.has(path.extname(entry.name).toLowerCase())&&!exempt.has(child)){
      const text=fs.readFileSync(path.join(root,child),"utf8");
      const hit=/courses\/shared\/shared\//.test(text)||
        /(?:^|["'(/.])shared\/shared\//m.test(text)||
        /course-readiness-template\.json/.test(text)||
        /assessment-authority\//.test(text);
      if(hit)findings.push(child);
    }
  }
}
for(const rel of roots)walk(rel);
for(const rel of ["index.html","service-worker.js","manifest.webmanifest"]){
  const full=path.join(root,rel);
  if(!fs.existsSync(full))continue;
  const text=fs.readFileSync(full,"utf8");
  if(/courses\/shared\/shared\//.test(text)||/(?:^|["'(/.])shared\/shared\//m.test(text))findings.push(rel);
}
if(findings.length){
  console.error("FAIL active High School code still depends on courses/shared/shared/:\n"+findings.join("\n"));
  process.exit(1);
}
console.log("PASS nested legacy shared layer has zero active runtime dependencies.");
