import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";
const source=p=>fs.readFileSync(p,"utf8");
const countsA=[16,20,19,19,14,17,18,17,16,26,21,20,15];
const countsG=[10,9,11,7,7,10,10,10,9,8,10,11,9];
let termsA=0,termsG=0;
for(let unit=1;unit<=13;unit++){
 const n=String(unit).padStart(2,"0");
 const alg=JSON.parse(source("courses/mathematics/algebra-2/units/unit-"+n+"/vocabulary.json"));
 const geo=JSON.parse(source("courses/mathematics/geometry/units/unit-"+n+"/vocabulary.json"));
 assert.equal(alg.terms.length,countsA[unit-1],"Algebra II Unit "+n+" count");
 assert.equal(geo.terms.length,countsG[unit-1],"Geometry Unit "+n+" count");
 for(const item of alg.terms){
  for(const key of ["en","es","fr","ar","pt","definition"]){
   assert.equal(typeof item[key],"string","Algebra II "+n+" "+key);
   assert(item[key].trim().length>=3,"empty "+key+" for "+item.en);
  }
  assert(!/core term used in|todo|placeholder/i.test(item.definition),"generic definition "+item.en);
  assert(item.definition.length>=28,"short definition "+item.en);
  assert(["es","fr","ar","pt"].some(key=>item[key]!==item.en),"untranslated "+item.en);
  assert(item.ar!==item.en,"Arabic placeholder "+item.en);
 }
 for(const term of geo.terms){
  assert.equal(typeof term,"string");
  assert(geo.definitions&&typeof geo.definitions[term]==="string","missing geometry definition "+term);
  assert(geo.definitions[term].length>=25,"short geometry definition "+term);
 }
 assert.equal(Object.keys(geo.definitions).length,geo.terms.length);
 termsA+=alg.terms.length;termsG+=geo.terms.length;
}
assert.equal(termsA,238);
assert.equal(termsG,121);
const studio=source("courses/mathematics/tools/vocabulary-studio.html");
const inline=[...studio.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(inline.length,1);
new vm.Script(inline[0][1]);
assert(studio.includes("credentials:\"same-origin\""));
assert(!/<script[^>]*src=/i.test(studio));
for(const course of ["algebra-2","geometry"]){
 const home=source("courses/mathematics/"+course+"/index.html");
 assert(home.includes("../tools/vocabulary-studio.html?course="+course),"course homepage must link study page");
}
const log=JSON.parse(source("courses/mathematics/algebra-2/units/unit-07/vocabulary.json"));
assert(log.terms.some(t=>t.en==="logarithmic domain"&&t.definition.includes("strictly positive")));
const prob=JSON.parse(source("courses/mathematics/algebra-2/units/unit-12/vocabulary.json"));
assert(prob.terms.some(t=>t.en==="independence"&&t.definition.includes("P(A and B)")));
console.log("PASS: "+termsA+" Algebra II translated definitions; "+termsG+" Geometry definitions; course links and studio runtime.");
