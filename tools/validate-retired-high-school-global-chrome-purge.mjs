import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import assert from "node:assert/strict";
import vm from "node:vm";

const root=process.cwd();
const bannedAsset="high-school-"+"global-chrome-v2.js";
const bannedFlag="__KHAEMENES_HIGH_"+"GLOBAL_CHROME_V2__";
// Inspect only active runtime and deployment sources. Keep historical snapshots,
// blueprint evidence and negative regression assertions, which must never run
// as executable page dependencies, without falsely classifying them as runtime.
const listed=spawnSync("git",["ls-files","-z"],{encoding:"buffer",cwd:root,maxBuffer:32*1024*1024});
if(listed.error||listed.status!==0)throw listed.error||new Error("git ls-files failed");
const allFiles=listed.stdout.toString("utf8").split("\0").filter(Boolean);
const candidates=allFiles.filter(file=>{
  if(file==="index.html")return true;
  if(file.startsWith(".github/workflows/"))return /\.ya?ml$/.test(file);
  if(!/^(assets|courses|grades|electives|scripts)\//.test(file))return false;
  if(/(^|\/)(?:workflow|tests|tools)\//.test(file))return false;
  return /\.(?:html?|js|mjs|css|json|ya?ml|webmanifest|xml)$/.test(file);
});
const hits=[];
for(const file of candidates){
  const body=fs.readFileSync(file,"utf8");
  if(body.includes(bannedAsset)||body.includes(bannedFlag))hits.push(file);
}
assert.deepEqual(hits,[],"Retired global chrome must not be referenced by live HTML, JavaScript, service workers or CI workflows");
console.log("ACTIVE_SOURCE_CENSUS_PASS",candidates.length,"files checked");
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
const subjectPages=[
  "courses/science/integrated-science-9/index.html",
  "courses/science/biology-10/index.html",
  "courses/science/chemistry-11/index.html",
  "courses/science/physics-engineering-12/index.html",
  "courses/social-studies/grade-09/index.html",
  "courses/social-studies/grade-10/index.html",
  "courses/social-studies/grade-11/index.html",
  "courses/social-studies/grade-12/index.html"
];
for(const file of subjectPages){
 const html=fs.readFileSync(file,"utf8");
 assert.equal((html.match(/vnv-header-autopopulate\\.js\\?v=2\\.1\\.0/g)||[]).length,1,file+" must load exactly one official header");
 assert.ok(html.includes('data-khae-header hidden aria-hidden="true"'),file+" must mount top ticker first");
 assert.ok(html.includes('window.addEventListener("khaemenes-high-dual-ticker-ready",mount,{once:true});'),file+" must wait for canonical native tickers");
 assert.ok(html.includes("high-navigation-v1.js"),file+" must retain the existing navigation, ticker and ecosystem dock owner");
 assert.ok(html.includes("high-school-class-tools-universal-v1.js"),file+" must retain native left learning tools");
}
for(const file of [
 "courses/mathematics/pre-algebra/service-worker.js",
 "courses/mathematics/algebra-1/service-worker.js",
 "courses/mathematics/geometry/service-worker.js",
 "courses/mathematics/algebra-2/service-worker.js"
]){
 const worker=fs.readFileSync(file,"utf8");
 assert.ok(!worker.includes(bannedAsset),file+" must not precache a missing resource");
 new vm.Script(worker,{filename:file});
}
const electives=fs.readFileSync("electives/index.html","utf8");
assert.ok(!electives.includes(bannedAsset),"Electives must not request the retired asset");
assert.ok(electives.includes("khaemenes-global-header.js"),"Electives' existing Academy header retained");
console.log("CANONICAL_SUBJECT_CHROME_PASS",subjectPages.length,"subject pages; 4 math service workers; electives");
console.log("HIGH_SCHOOL_GLOBAL_CHROME_PURGE_PASS; no active source references remain");
