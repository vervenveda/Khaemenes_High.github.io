#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const matrix=JSON.parse(fs.readFileSync(path.join(root,"courses/shared/course-execution-matrix-v1.json"),"utf8"));
const profiles=JSON.parse(fs.readFileSync(path.join(root,"grades/shared/high-school-profile-runtime-v2.json"),"utf8"));
const skipParts=new Set([".git","node_modules","archive","archives","backup","backups","vendor","private"]);
const forbidden=[
  /courses\/shared\/shared\//,
  /(?:^|["'(/.])shared\/shared\//m,
  /course-readiness-template\.json/
];
const findings=[],reachableScripts=new Set(),htmlFiles=new Set();
const rel=p=>path.relative(root,p).split(path.sep).join("/");
function skipped(p){return rel(p).split("/").some(part=>skipParts.has(part.toLowerCase()))}
function walk(dir){
  if(!fs.existsSync(dir)||skipped(dir))return;
  const r=rel(dir);
  if(r==="courses/shared/shared"||r.startsWith("courses/shared/shared/"))return;
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,e.name);
    if(e.isDirectory())walk(full);
    else if(e.isFile()&&/\.html$/i.test(e.name))htmlFiles.add(full);
  }
}
function addHtml(relative){
  const full=path.join(root,relative);
  if(fs.existsSync(full)&&fs.statSync(full).isFile())htmlFiles.add(full);
}
function forbiddenHit(text){return forbidden.some(rx=>rx.test(text))}
function record(source){findings.push(source)}
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
// Active academic topology: walk only execution-matrix course roots. Compatibility,
// preview and unrelated historical HTML outside those roots are intentionally excluded.
for(const course of matrix.courses){
  const courseRoot=course.root||path.posix.dirname(course.entry)+"/";
  const full=path.join(root,courseRoot);
  if(fs.existsSync(full)&&fs.statSync(full).isDirectory())walk(full);
  else addHtml(course.entry);
}
// Active High School learner shells and primary campus/portfolio entrances.
for(const row of Object.values(profiles.grades||{}))addHtml(row.entry);
for(const extra of ["index.html","portfolio/index.html"])addHtml(extra);

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
const unique=[...new Set(findings)];
if(unique.length){
  console.error("FAIL active High School topology still reaches courses/shared/shared/:\n"+unique.join("\n"));
  process.exit(1);
}
console.log("PASS legacy reachability census: "+htmlFiles.size+" active-course/profile HTML surfaces and "+reachableScripts.size+" locally loaded scripts have zero runtime paths into courses/shared/shared/.");
