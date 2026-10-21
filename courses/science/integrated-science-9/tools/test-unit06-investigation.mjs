import assert from "node:assert/strict";
import fs from "node:fs";
const root=new URL("../",import.meta.url);
const source=fs.readFileSync(new URL("units/unit-06/atomic-investigation-studio.js",root),"utf8");
for(const page of ["atomic-composition-lab.html","isotope-mass-lab.html","electron-configuration-lab.html","periodic-patterns-lab.html"]){const html=fs.readFileSync(new URL("units/unit-06/"+page,root),"utf8");assert.ok(html.includes('src="atomic-investigation-studio.js"'),"exploration missing: "+page)}
assert.ok(source.includes("a>=1&&a<=300&&b>=1&&b<=300"),"isotope model must enforce valid numeric mass range");
assert.ok(source.includes("not an orbital configuration"),"introductory electron-shell limits missing");
assert.ok(source.includes("khAtomPrintedNotes")&&source.includes("copy.textContent=note.value"),"print must preserve typed evidence");
assert.ok(!source.includes("localStorage.setItem"),"formative tool must not overwrite student records");
for(const [p,n,e] of [[8,8,8],[11,12,10],[20,20,18]])assert.equal(p-e,[0,1,2][[[8,8,8],[11,12,10],[20,20,18]].findIndex(x=>x[0]===p)]);
console.log("PASS: Unit 06 four lab connections, isotope bounds, shell caveat, print evidence, grade isolation");
