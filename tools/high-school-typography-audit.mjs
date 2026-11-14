#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const CHROME="assets/high-school-global-chrome-v2.js";
const LOADER_RE=/high-school-global-chrome-v2\.js/i;

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

const chrome=fs.readFileSync(path.join(ROOT,CHROME),"utf8");
const assertions=[
  ["16px readable floor",/size<16[\s\S]{0,180}font-size","16px","important"/],
  ["33px heading rule",/font-size:33px!important/],
  ["66px primary-title rule",/font-size:66px!important/],
  ["primary-title marker",/data-khaemenes-primary-title/],
  ["typography dataset marker",/khaemenesHighTypography="16-33-66"/],
];
const failed=assertions.filter(([,re])=>!re.test(chrome));

const html=walk(ROOT).filter(f=>/\.html?$/i.test(f));
const uncovered=[];
for(const file of html){
  const s=fs.readFileSync(path.join(ROOT,file),"utf8");
  if(!LOADER_RE.test(s))uncovered.push(file);
}

console.log(JSON.stringify({
  htmlFiles:html.length,
  loaderCovered:html.length-uncovered.length,
  loaderMissing:uncovered.length,
  typographyAssertions:assertions.length,
  typographyAssertionFailures:failed.map(([name])=>name),
  standard:{minimumReadableTextPx:16,ordinaryTitlePx:33,primaryHeroTitlePx:66}
},null,2));

if(uncovered.length){
  console.error("\nPages missing global chrome loader:");
  uncovered.slice(0,50).forEach(f=>console.error(" - "+f));
}
if(failed.length||uncovered.length)process.exitCode=1;
