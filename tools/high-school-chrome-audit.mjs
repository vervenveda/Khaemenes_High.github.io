#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const WRITE=process.argv.includes("--write");
const INVENTORY=process.argv.includes("--inventory");
const TAG='  <script src="/Khaemenes_High.github.io/assets/high-school-global-chrome-v2.js" defer data-high-school-global-chrome="v2"></script>\n';
const norm=p=>p.split(path.sep).join("/");
const skipDirs=new Set([".git","node_modules",".cache","dist"]);
function walk(dir){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(e.isDirectory()&&skipDirs.has(e.name))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())out.push(...walk(full));
    else out.push(norm(path.relative(ROOT,full)));
  }
  return out;
}
function htmlFile(f){return /\.html?$/i.test(f)}
function inject(s){
  if(/high-school-global-chrome-v2\.js/i.test(s))return s;
  if(/<\/head>/i.test(s))return s.replace(/<\/head>/i,TAG+"</head>");
  if(/<body\b/i.test(s))return s.replace(/<body\b/i,TAG+"<body");
  return TAG+s;
}
function lowerLeftHints(source){
  const hints=[];
  for(const raw of source.split("}")){
    const compact=raw.toLowerCase().replace(/\s+/g,"");
    if(!(compact.includes("position:fixed")||compact.includes("position:sticky")))continue;
    if(!compact.includes("left:"))continue;
    if(!compact.includes("bottom:"))continue;
    const snippet=raw.slice(Math.max(0,raw.length-900)).replace(/\s+/g," ").trim();
    if(snippet)hints.push(snippet);
    if(hints.length>=12)break;
  }
  for(const m of source.matchAll(/<(?:a|button|div|nav|aside)\b[^>]*style=["'][^"']*position\s*:\s*fixed[^"']*["'][^>]*>/gi)){
    const tag=m[0],compact=tag.toLowerCase().replace(/\s+/g,"");
    if(compact.includes("left:")&&compact.includes("bottom:"))hints.push(tag.replace(/\s+/g," ").slice(0,900));
    if(hints.length>=12)break;
  }
  return [...new Set(hints)].slice(0,12);
}
function exportHints(source){
  const low=source.toLowerCase(),hints=[];
  let at=0;
  while(hints.length<12){
    const i=low.indexOf("export",at);if(i<0)break;
    const start=Math.max(0,i-180),end=Math.min(source.length,i+280);
    const snippet=source.slice(start,end).replace(/\s+/g," ").trim();
    if(/student|learner|profile|progress|grade|record/i.test(snippet))hints.push(snippet);
    at=i+6;
  }
  return hints;
}

const files=walk(ROOT).filter(htmlFile).sort();
let changed=0,covered=0;
const lower=[],exports=[];
for(const file of files){
  const abs=path.join(ROOT,file);
  let source=fs.readFileSync(abs,"utf8");
  if(/high-school-global-chrome-v2\.js/i.test(source))covered++;
  else if(WRITE){
    source=inject(source);fs.writeFileSync(abs,source);changed++;covered++;
  }
  if(INVENTORY){
    const l=lowerLeftHints(source);if(l.length)lower.push({file,hints:l});
    const e=exportHints(source);if(e.length)exports.push({file,hints:e});
  }
}
console.log(JSON.stringify({
  mode:WRITE?"write":"check",
  htmlFiles:files.length,
  chromeCovered:covered,
  changed,
  missing:files.length-covered,
  lowerLeftSuspectPages:lower.length,
  studentExportCandidatePages:exports.length
},null,2));
console.log("\nLOWER-LEFT STATIC SUSPECTS");
for(const row of lower){console.log("\nFILE "+row.file);for(const h of row.hints)console.log("  "+h)}
console.log("\nSTUDENT EXPORT CANDIDATES");
for(const row of exports){console.log("\nFILE "+row.file);for(const h of row.hints)console.log("  "+h)}
if(files.length!==covered)process.exitCode=1;
