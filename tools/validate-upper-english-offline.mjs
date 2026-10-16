import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
let total=0;
for(const grade of [10,11,12]){
 const root="courses/language-arts/english-"+grade;
 const filename=root+"/service-worker.js";
 const src=fs.readFileSync(filename,"utf8");
 new vm.Script(src);
 assert(src.includes("-read1"),"Reading resources cache not versioned: "+filename);
 const match=src.match(/const PRECACHE = (\[[\s\S]*?\]);/);
 assert(match,"Precache list missing");
 const cache=vm.runInNewContext(match[1]);
 assert.equal(new Set(cache).size,cache.length,"Duplicate cached asset");
 for(const file of cache){
  const normalized=path.resolve(root,file);
  assert(fs.existsSync(normalized),"Precache target missing: "+file);
 }
 for(const target of [
  "./offline-reading-pack-weeks-01-06.html",
  "./weeks/week-02/reading-dossier.html",
  "./weeks/week-03/reading-dossier.html",
  "./units/unit-05/reading-dossier.html",
  "./units/unit-06/reading-dossier.html",
  "./units/unit-07/reading-dossier.html"
 ]) assert(cache.includes(target),"Offline reading path missing "+grade+" "+target);
 assert.equal((src.match(/if\(response\.ok\)/g)||[]).length,2,"Network cache must reject failed responses");
 assert.equal((src.match(/\.catch\(\(\)=>\{\}\)/g)||[]).length,2,"Asynchronous cache failures should not hide lesson");
 total+=cache.length;
}
console.log("PASS: 3 upper-English offline caches, "+total+" verified precache routes, all reading packs and dossiers, failed-response cache protection.");
