import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";
const root=path.resolve(import.meta.dirname,"..");
const repo=path.resolve(root,"../../..");
const sw=fs.readFileSync(path.join(root,"service-worker.js"),"utf8");
const earlyMatch=sw.match(/const EARLY_LESSON_OFFLINE_FILES=(\[[^\n]+\]);/);
assert.ok(earlyMatch,"explicit offline essentials list");
const essential=JSON.parse(earlyMatch[1]);
const legacySrc=fs.readFileSync(path.join(root,"service-worker-precache-v1.js"),"utf8");
const legacyMatch=legacySrc.match(/const PRECACHE=(\[[\s\S]*?\]);/);
assert.ok(legacyMatch,"legacy fallback list");
const legacy=JSON.parse(legacyMatch[1]);
const cached=new Set([...essential,...legacy]);
const normalize=(base,relative)=>path.posix.normalize(path.posix.join(base,relative.split("?")[0].split("#")[0]));
const siteBase="courses/mathematics/algebra-1";
let pages=0,assets=0;
for(let n=1;n<=3;n++){
 const u=String(n).padStart(2,"0");
 const map=JSON.parse(fs.readFileSync(path.join(root,"units","unit-"+u,"unit-map.json"),"utf8"));
 assert.ok(map.lessons?.length>=6,"Unit "+u+" lesson map intact");
 for(const required of [
  "./units/unit-"+u+"/assets/unit"+u+"-data.js",
  "./units/unit-"+u+"/assets/unit"+u+".css",
  "./units/unit-"+u+"/vocabulary.json"
 ]){
  assert.ok(essential.includes(required),"not explicitly cached "+required);
 }
 for(const lesson of map.lessons){
  const url="./units/unit-"+u+"/"+lesson.file;
  assert.ok(essential.includes(url),"missing offline lesson "+url);
  const file=path.join(root,"units","unit-"+u,lesson.file);
  assert.ok(fs.existsSync(file),"missing lesson HTML "+url);
  const html=fs.readFileSync(file,"utf8");
  assert.ok(/data-mode="lesson"/.test(html)&&/<main id="main"/.test(html),"lesson DOM contract "+url);
  const assetsFound=[...html.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)="([^"]+)"/gi)]
    .map(x=>x[1]).filter(x=>!/^https?:|^#|^data:/i.test(x));
  for(const rel of assetsFound){
   const abs=normalize(path.posix.dirname(siteBase+"/units/unit-"+u+"/"+lesson.file),rel);
   assert.ok(fs.existsSync(path.join(repo,abs)),"broken lesson dependency "+abs);
   if(/\.js(?:\?|$)|\.css(?:\?|$)/.test(rel)){
    // This file must be among new/legacy offline assets or the shared service assets.
    const inCourse=path.posix.relative(siteBase,abs);
    const cacheKey="./"+inCourse;
    if(!inCourse.startsWith("..")){
     assert.ok(cached.has(cacheKey)||sw.includes('"'+cacheKey+'"'),
       "not offline-ready "+cacheKey);
    } else {
     assert.ok(sw.includes('"'+inCourse+'"')||cached.has(inCourse),
       "shared lesson dependency omitted "+inCourse);
    }
    assets++;
   }
  }
  assert.ok(html.includes("lesson-resource-bridge-v1.js"),"missing lesson tools bridge "+url);
  pages++;
 }
}
assert.equal(pages,20);
assert.ok(sw.includes("...EARLY_LESSON_OFFLINE_FILES"),"new cache list wired to worker");
console.log("PASS Units 01–03: "+pages+" lesson routes and "+assets+" local JavaScript/CSS dependencies, with explicit offline data and vocabulary");
