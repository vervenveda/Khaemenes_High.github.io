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
for(const course of ["pre-algebra","algebra-1","geometry","algebra-2"]){
 const home=source("courses/mathematics/"+course+"/index.html");
 assert(home.includes("../tools/vocabulary-studio.html?course="+course),"course homepage must link study page");
}

// Pre-Algebra and Algebra I retain their canonical unit vocabulary shapes.
let preTotal=0,algOneTotal=0,withTranslation=0;
for(let u=1;u<=13;u++){
 const n=String(u).padStart(2,"0");
 const pre=JSON.parse(source("courses/mathematics/pre-algebra/units/unit-"+n+"/vocabulary.json"));
 const alg=JSON.parse(source("courses/mathematics/algebra-1/units/unit-"+n+"/vocabulary.json"));
 assert(Array.isArray(pre.terms)&&pre.terms.length>0,"Pre-Algebra Unit "+n);
 assert(Array.isArray(alg.terms)&&alg.terms.length>0,"Algebra I Unit "+n);
 for(const item of pre.terms){
  assert(typeof item.en==="string"&&item.en.trim(),"Pre-Algebra term in "+n);
  assert(typeof item.definition==="string"&&item.definition.trim().length>=7,"Pre-Algebra definition in "+n);
  for(const lang of ["es","fr","ar","pt"]){
   assert(typeof item[lang]==="string"&&item[lang].trim(),"Pre-Algebra missing "+lang+" in "+n);
  }
 }
 for(const item of alg.terms){
  const term=typeof item==="string"?item:item.en||item.term;
  const definition=typeof item==="string"?alg.definitions?.[item]:item.definition||alg.definitions?.[term];
  assert(typeof term==="string"&&term.trim(),"Algebra I term in "+n);
  assert(typeof definition==="string"&&definition.trim().length>=20,"Algebra I definition for "+term);
  const translated=typeof item==="string"?alg.translations?.[term]:alg.translations?.[term]||item;
  if(["es","fr","ar","pt"].every(l=>typeof translated?.[l]==="string"&&translated[l].trim()))withTranslation++;
 }
 preTotal+=pre.terms.length;algOneTotal+=alg.terms.length;
}
assert.equal(preTotal,771,"Pre-Algebra term inventory");
assert.equal(algOneTotal,138,"Algebra I term inventory");
assert(withTranslation>=80,"Algebra I inherited and original multilingual entries");
assert(studio.includes('value="pre-algebra"')&&studio.includes('value="algebra-1"'),"Both courses in selector");
assert(studio.includes('item.en||item.term'),"Studio accepts Algebra I term objects");
assert(studio.includes('current.translations?.[item]'),"Studio accepts inherited translations");
assert(studio.includes('current.definitions?.[item]'),"Studio accepts string-term definitions");

const log=JSON.parse(source("courses/mathematics/algebra-2/units/unit-07/vocabulary.json"));
assert(log.terms.some(t=>t.en==="logarithmic domain"&&t.definition.includes("strictly positive")));
const prob=JSON.parse(source("courses/mathematics/algebra-2/units/unit-12/vocabulary.json"));
assert(prob.terms.some(t=>t.en==="independence"&&t.definition.includes("P(A and B)")));
console.log("PASS: "+preTotal+" Pre-Algebra, "+algOneTotal+" Algebra I ("+withTranslation+" translated), "+termsG+" Geometry and "+termsA+" Algebra II glossary entries; course links and Studio runtime.");
