import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import assert from "node:assert/strict";
import vm from "node:vm";

const root=process.cwd();
const bannedAsset="high-school-"+"global-chrome-v2.js";
const bannedFlag="__KHAEMENES_HIGH_"+"GLOBAL_CHROME_V2__";
const sourceExtensions=["*.html","*.js","*.mjs","*.css","*.json","*.yaml","*.yml","*.webmanifest","*.xml"];
const grep=spawnSync("git",["grep","-nI","-e",bannedAsset,"-e",bannedFlag,"--",...sourceExtensions],{encoding:"utf8",cwd:root,maxBuffer:8*1024*1024});
if(grep.error)throw grep.error;
if(grep.status!==1){
  const details=(grep.stdout||grep.stderr||"").trim();
  throw new Error("Retired chrome reference still exists in active source:\n"+details);
}
const nav=fs.readFileSync("assets/high-navigation-v1.js","utf8");
assert.doesNotMatch(nav,/GLOBAL_CHROME_V2|global chrome is the primary toolbar owner/i);
assert.ok(nav.includes('const DUAL_TICKER_GUARD="vnv-dual-ticker-v1.js";'),"Native High School dual ticker must remain");
assert.ok(nav.includes('const OFFICIAL="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js";'),"Official right-hand dock must remain");
new vm.Script(nav,{filename:"assets/high-navigation-v1.js"});

for(const grade of [10,11,12]){
  const file=path.join("courses","language-arts","english-"+grade,"index.html");
  const html=fs.readFileSync(file,"utf8");
  assert.doesNotMatch(html,/data-high-school-global-chrome|high-school-global-chrome-v2/i,"Retired loader remains: "+file);
  assert.equal((html.match(/vnv-header-autopopulate\.js\?v=2\.1\.0/g)||[]).length,1,"Must load exactly one official VNV header: "+file);
  assert.equal((html.match(/data-khae-header hidden aria-hidden="true"/g)||[]).length,1,"Must have exactly one position anchor: "+file);
  const anchor=html.indexOf('data-khae-header hidden aria-hidden="true"');
  const oldHeader=html.indexOf('data-retired-course-header="true" hidden');
  assert.ok(anchor!==-1&&anchor<oldHeader,"Top-of-page mounting anchor must precede retired header: "+file);
  assert.ok(html.includes('window.addEventListener("khaemenes-high-dual-ticker-ready",mount,{once:true});'),"Official header must wait for existing ticker event: "+file);
  assert.ok(html.includes('window.VNV_HEADER?.mount?.({'),"Header must mount through official VNV API: "+file);
  assert.ok(html.includes('replaceLegacy:false'),"Never mutate old instructional header via generic replacement: "+file);
  assert.ok(html.includes('title:"English '+grade+' · Language Arts"'),"Header must retain correct grade identity");
  assert.ok(html.includes('high-school-class-tools-left-v1.js'),"Existing lower-left tools preserved");
  assert.ok(html.includes('high-navigation-v1.js'),"Existing routing/ticker/right-dock fallback preserved");
  for(const snippet of [...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean)){
    new vm.Script(snippet,{filename:file+" inline"});
  }
  console.log("RETIRED_CHROME_REMOVED English",grade,"official header and native ticker contract PASS");
}
console.log("HIGH_SCHOOL_GLOBAL_CHROME_PURGE_PASS; no active source references remain");
