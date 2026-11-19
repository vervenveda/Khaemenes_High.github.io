import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repo=process.cwd();
const base="courses/mathematics/algebra-2";
const adapter=path.join(repo,base,"assets/algebra2-math-lesson-v2-adapter.js");
const source=fs.readFileSync(adapter,"utf8");
const version=source.match(/const VERSION="([^"]+)"/)?.[1];
assert.equal(version,"2.3.0","Canary targets the existing approved adapter");
const canaries=["unit-01/lessons/u01-l01.html","unit-10/lessons/u10-l06.html"];
for(const name of canaries){
  const file=path.join(repo,base,"units",name);
  const page=fs.readFileSync(file,"utf8");
  const adapterTag=/<script\b[^>]*src=["'][^"']*algebra2-math-lesson-v2-adapter\.js\?v=2\.3\.0["'][^>]*><\/script>/g;
  assert.equal([...page.matchAll(adapterTag)].length,1,name+": adapter count/version");
  const native=page.indexOf('<script src="../../../assets/lesson-tools.js"></script>');
  const engine=page.indexOf('algebra2-math-lesson-v2-adapter.js?v=2.3.0');
  assert(native>=0&&engine>native,name+": native lesson tools must precede the presentation adapter");
  assert.match(page,/data-lesson-id|dataset\.lessonId/,name+": lesson identity");
  assert.match(page,/lessonComplete/,name+": lesson completion");
  assert.match(page,/lessonNote/,name+": reflection input");
  assert.match(page,/saveLessonMastery|lesson-tools\.js/,name+": mastery authority");
  assert.match(page,/<section[^>]+lesson-section/,name+": native instructional sections");
  assert.match(page,/href=["'][^"']*\.\.\/assessment\/mastery-check\.html/,name+": native mastery route remains");
  console.log("CANARY_SOURCE_PASS "+name);
}
const protectedExamples=[
 "units/unit-01/assessment/mastery-check.html",
 "assessments/midterm.html",
 "assessments/final.html"
];
for(const rel of protectedExamples){
  const file=path.join(repo,base,rel);
  if(!fs.existsSync(file))continue;
  const html=fs.readFileSync(file,"utf8");
  assert.doesNotMatch(html,/algebra2-math-lesson-v2-adapter\.js/,rel+": assessment firewall");
}
assert.match(source,/KhaemenesAlgebra2Progression/, "adapter must use native progression");
assert.match(source,/MASTERY=80/, "mastery threshold remains 80%");

// Confirm that the minimal landing shell has not replaced the real 92 lessons.
let routeTotal=0;
for(let unit=1;unit<=13;unit++){
  const n=String(unit).padStart(2,"0");
  const unitRoot=path.join(repo,base,"units","unit-"+n);
  const index=fs.readFileSync(path.join(unitRoot,"index.html"),"utf8");
  const lessonRoot=path.join(unitRoot,"lessons");
  const actual=fs.readdirSync(lessonRoot).filter(f=>new RegExp("^u"+n+"-l\\d{2}\\.html$").test(f)).sort();
  const hrefs=[...index.matchAll(/href=["']lessons\\/(u\\d{2}-l\\d{2}\\.html)/g)].map(x=>x[1]);
  const unique=[...new Set(hrefs)].sort();
  assert.deepEqual(unique,actual,"unit "+n+": exact native lesson links");
  assert.ok(hrefs.includes("u"+n+"-l01.html"),"unit "+n+": Begin Unit route");
  routeTotal+=actual.length;
}
assert.equal(routeTotal,92,"Algebra II must retain all 92 native instructional lessons");
console.log("ALGEBRA_II_92_LESSON_UNIT_ROUTE_PASS");

console.log("ALGEBRA_II_CANARY_SOURCE_PROOF_PASS");
