import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const math=path.resolve(root,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const bridge=read("assets/lesson-resource-bridge-v1.js");
const companion=read("assets/algebra1-lesson-companions-v1.js");
const unit01=read("units/unit-01/assets/unit01.js");
assert.ok(bridge.includes("algebra1-lesson-companions-v1.js"));
assert.ok(companion.includes('evidence.searchParams.set("unit",unit)')&&companion.includes('evidence.searchParams.set("lesson",lesson)'),"printable must carry exact lesson context");
assert.ok(companion.includes('script[data-game'),"explicit games must not appear twice");
for(const feature of ["game-registry.json","vocabulary.json","academic-evidence-companion.html","Print lesson","masteryLocked"]){
 assert.ok(companion.includes(feature),"missing companion feature "+feature);
}
assert.ok(!unit01.includes("youtube-nocookie.com/embed/"),"no unapproved embedded video bypass");
const registry=JSON.parse(fs.readFileSync(path.join(math,"assets/learning-games/game-registry.json"),"utf8"));
let gameCount=0;const lessonKeys=new Set();
for(const [slug,g] of Object.entries(registry.games||{})){
 for(const p of g.placements||[]){
  if(p.course!=="algebra-1"||p.wired!==true)continue;
  assert.ok(fs.existsSync(path.join(math,"assets/learning-games",slug,"index.html")),"missing game "+slug);
  gameCount++;lessonKeys.add(Number(p.unit)+":"+Number(String(p.lesson).match(/\d+$/)?.[0]));
 }
}
assert.ok(gameCount>=80&&lessonKeys.size>=75,"Algebra I registry game coverage");
const map=JSON.parse(read("video-map.json"));
assert.ok(map.placements.length>=23,"candidate map coverage");
for(const p of map.placements){
 assert.ok(fs.existsSync(path.join(root,p.lesson_file)),"missing lesson "+p.lesson_file);
 const assetFile=path.resolve(root,p.shared_file);
 assert.ok(fs.existsSync(assetFile),"missing video metadata "+p.shared_file);
 const asset=JSON.parse(fs.readFileSync(assetFile,"utf8"));
 assert.equal(asset.asset_id,p.asset_id,"video asset ID mismatch");
 assert.ok(!/khan academy/i.test(asset.instructor||""),"no Khan placement");
 if(p.enabled===true){
  assert.equal(p.release_approved,true,"placement must pass review");
  assert.equal(asset.enabled,true,"asset must be enabled");
  assert.equal(asset.certification?.student_release_approved,true,"asset must pass student-release certification");
 }
}
console.log("PASS canonical Algebra I lesson tools, "+gameCount+" game links and "+map.placements.length+" safely staged videos");
