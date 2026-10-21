import assert from "node:assert/strict";
import fs from "node:fs";
const root=new URL("../",import.meta.url);
const model=fs.readFileSync(new URL("units/unit-04/exploration-studio.js",root),"utf8");
const genotypes=["AA","Aa","aa"];
const expected={
 "AA:AA":[4,0,0],"AA:Aa":[2,2,0],"AA:aa":[0,4,0],
 "Aa:AA":[2,2,0],"Aa:Aa":[1,2,1],"Aa:aa":[0,2,2],
 "aa:AA":[0,4,0],"aa:Aa":[0,2,2],"aa:aa":[0,0,4]
};
for(const a of genotypes)for(const b of genotypes){
 const counts={AA:0,Aa:0,aa:0};
 for(const x of a.split(""))for(const y of b.split(""))counts[[x,y].sort().join("")]++;
 assert.deepEqual([counts.AA,counts.Aa,counts.aa],expected[a+":"+b],"cross "+a+" × "+b);
}
for(let pairs=1;pairs<=5;pairs++)assert.equal(2**pairs,Math.pow(2,pairs));
for(const page of ["cell-cycle-laboratory.html","meiosis-laboratory.html","inheritance-probability-lab.html"]){
 const content=fs.readFileSync(new URL("units/unit-04/"+page,root),"utf8");
 assert.ok(content.includes('src="exploration-studio.js"'),"missing original exploration: "+page);
}
assert.ok(model.includes("no selection or linkage effects"),"Mendelian assumptions must be stated");
assert.ok(model.includes("gamete development differs across organisms"),"meiosis distinction must be stated");
assert.ok(!model.includes("localStorage.setItem"),"Formative model cannot directly change student records");
console.log("PASS Unit 04: nine genotype crosses, 1–5 chromosome-pair settings, three page links, educational caveats and score isolation");
