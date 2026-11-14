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
  const blocks=[...source.matchAll(/([^{}]{0,160})\{([^{}]*(?:position\s*:\s*fixed|position\s*:\s*sticky)[^{}]*)\}/gi)];
  for(const m of blocks){
    const css=m[2];
    if(!/(?:left\s*:\s*(?:0|[0-9]{1,3}px)|inset[^;]*auto[^;]*auto)/i.test(css))continue;
    if(!/(?:bottom\s*:\s*(?:0|[0-9]{1,3}px)|inset[^;]*auto)/i.test(css))continue;
    hints.push((m[1].trim()+" { "+css.trim().slice(0,500)+" }").replace(/\s+/g," "));
  }
  return hints.slice(0,12);
}
function exportHints(source){
  return [...source.matchAll(/.{0,100}(?:student|learner|profile|progress|grade|record).{0,80}export.{0,120}|.{0,100}export.{0,80}(?:student|learner|profile|progress|grade|record).{0,120}/gi)]
    .slice(0,12).map(m=>m[0].replace(/\s+/g," ").trim());
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
