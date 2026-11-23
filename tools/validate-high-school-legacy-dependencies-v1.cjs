#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const roots=["courses","grades","portfolio"];
const skipParts=new Set([".git","node_modules","archive","archives","backup","backups","vendor","private"]);
const forbidden=[
  /courses\/shared\/shared\//,
  /(?:^|["'(/.])shared\/shared\//m,
  /course-readiness-template\.json/
];
const findings=[],reachableScripts=new Set(),htmlFiles=[];
const rel=p=>path.relative(root,p).split(path.sep).join("/");
function skipped(p){return rel(p).split("/").some(part=>skipParts.has(part.toLowerCase()))}
function walk(dir){
  if(!fs.existsSync(dir)||skipped(dir))return;
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,e.name),r=rel(full);
    if(r==="courses/shared/shared"||r.startsWith("courses/shared/shared/"))continue;
    if(e.isDirectory())walk(full);
    else if(e.isFile()&&/\.html$/i.test(e.name))htmlFiles.push(full);
  }
}
function forbiddenHit(text){return forbidden.some(rx=>rx.test(text))}
function record(source,target){findings.push(source+(target?" -> "+target:""))}
function resolveScript(htmlFile,src){
  const raw=String(src||"").trim().replace(/[?#].*$/,"");
  if(!raw||/^(?:https?:)?\/\//i.test(raw)||/^(?:data|blob|javascript):/i.test(raw))return null;
  let full;
  if(raw.startsWith("/Khaemenes_High.github.io/"))full=path.join(root,raw.slice("/Khaemenes_High.github.io/".length));
  else if(raw.startsWith("/"))full=path.join(root,raw.replace(/^\/+/,""));
  else full=path.resolve(path.dirname(htmlFile),raw);
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile())return null;
  return full;
}
for(const r of roots)walk(path.join(root,r));
for(const extra of ["index.html"]){
  const full=path.join(root,extra);if(fs.existsSync(full))htmlFiles.push(full);
}
for(const file of htmlFiles){
  const text=fs.readFileSync(file,"utf8"),source=rel(file);
  if(forbiddenHit(text))record(source);
  for(const m of text.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)){
    const full=resolveScript(file,m[1]);
    if(full&&/\.(?:js|mjs|cjs)$/i.test(full))reachableScripts.add(full);
  }
}
const sw=path.join(root,"service-worker.js");
if(fs.existsSync(sw)){
  const text=fs.readFileSync(sw,"utf8");
  if(forbiddenHit(text))record("service-worker.js");
}
for(const file of reachableScripts){
  const text=fs.readFileSync(file,"utf8");
  if(forbiddenHit(text))record(rel(file));
}
if(findings.length){
  console.error("FAIL reachable High School learner runtime still depends on courses/shared/shared/:\n"+[...new Set(findings)].join("\n"));
  process.exit(1);
}
console.log("PASS legacy reachability census: "+htmlFiles.length+" HTML learner surfaces and "+reachableScripts.size+" locally loaded scripts have zero runtime paths into courses/shared/shared/.");
