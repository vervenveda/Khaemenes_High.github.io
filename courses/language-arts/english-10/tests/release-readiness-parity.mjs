import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const pad=n=>String(n).padStart(2,"0");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");

assert.ok(fs.existsSync(path.join(root,"index.html")),"course index missing");
assert.ok(fs.existsSync(path.join(root,"curriculum.json")),"curriculum missing");

const curriculum=JSON.parse(read("curriculum.json"));
const units=Array.isArray(curriculum.units)?curriculum.units:(curriculum.course?.units||[]);
assert.equal(units.length,12,"expected 12 units");

for(let u=1;u<=12;u++){
  assert.ok(fs.existsSync(path.join(root,"units","unit-"+pad(u),"index.html")),"missing unit "+u);
  assert.ok(fs.existsSync(path.join(root,"UNIT"+pad(u)+"_EVIDENCE_ALIGNMENT.md")),"missing evidence alignment "+u);
}
for(let w=1;w<=36;w++){
  const f=path.join(root,"weeks","week-"+pad(w),"index.html");
  assert.ok(fs.existsSync(f),"missing week "+w);
  const html=fs.readFileSync(f,"utf8");
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,"duplicate IDs in week "+w);
}
const css=read("assets/course.css");
assert.match(css,/KHAEMENES_ENGLISH_RELEASE_TYPOGRAPHY_V1/,"canonical typography override missing");
assert.match(css,/font-size:\s*16px\s*!important/,"16px release body rule missing");
assert.match(css,/\.eyebrow[\s\S]*?font-size:\s*14px\s*!important/,"14px eyebrow release rule missing");

const manifest=JSON.parse(read("02_course_mastery_manifest.json"));
assert.equal(manifest.mastery.threshold,0.8,"mastery threshold drift");
assert.equal(manifest.mastery.completionGrantsMastery,false,"completion must not grant mastery");
assert.equal(manifest.courseUnits,12);
assert.equal(manifest.weeks,36);
assert.equal(manifest.dailyBlocks,180);

console.log("PASS English 10 release readiness: 12 units, 36 weeks, evidence alignment, duplicate-ID scan, typography contract, and mastery governance.");
