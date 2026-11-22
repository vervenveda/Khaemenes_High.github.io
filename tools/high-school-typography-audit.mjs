#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
function walk(dir){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules"].includes(e.name))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())out.push(...walk(full));
    else out.push(path.relative(ROOT,full).split(path.sep).join("/"));
  }
  return out;
}

const html=walk(ROOT).filter(f=>/\.html?$/i.test(f));
const presentationSources=[
 "assets/vervenveda-parchment.css",
 "assets/grade09-subject-parchment.css",
 "courses/science/assets/science-minimal-landing-v1.css",
 "courses/shared/daily-instruction.css"
].filter(f=>fs.existsSync(path.join(ROOT,f)));
const source=presentationSources.map(f=>fs.readFileSync(path.join(ROOT,f),"utf8")).join("\n");
const checks=[
 ["16px readable control/text floor",/font[^\n;{}]*16px|font-size\s*:\s*16px/i],
 ["33px section/title scale",/33px/],
 ["66px primary-title scale",/66px/],
 ["7px radius",/border-radius\s*:\s*7px/i]
];
const failures=checks.filter(([,re])=>!re.test(source)).map(([name])=>name);
const retiredRuntimeRefs=[];
for(const file of html){
 const s=fs.readFileSync(path.join(ROOT,file),"utf8");
 if(/global-chrome/i.test(s))retiredRuntimeRefs.push(file);
}
console.log(JSON.stringify({
 htmlFiles:html.length,
 presentationSources,
 typographyAssertions:checks.length,
 typographyAssertionFailures:failures,
 retiredRuntimeReferences:retiredRuntimeRefs.length,
 standard:{minimumReadableTextPx:16,ordinaryTitlePx:33,primaryHeroTitlePx:66,radiusPx:7}
},null,2));
if(failures.length||retiredRuntimeRefs.length)process.exitCode=1;
