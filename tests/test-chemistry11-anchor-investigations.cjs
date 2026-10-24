#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const specs=[
 {week:1,marker:"Measurement reliability",data:"24.8, 25.1, 24.9",method:"Method B"},
 {week:3,marker:"Isotope mass-spectrum inference",data:"23.985 u",method:"24.310 u"},
 {week:5,marker:"Testing periodic patterns",data:"Mg→Al",method:"P→S"},
 {week:10,marker:"Intermolecular forces and evaporation",data:"9.2, 8.4",method:"0.40 g/min"},
 {week:15,marker:"The mole and stoichiometry",data:"10.0, 10.2",method:"90%"},
 {week:20,marker:"Collision theory and reaction rate",data:"40, 42, 38",method:"63.3%"},
 {week:25,marker:"Energy, entropy and particle distributions",data:"1, 4, 6, 4, 1",method:"37.5%"},
 {week:32,marker:"Free-energy conditions and chemical driving forces",data:"250 K, 300 K",method:"−10 kJ/mol"}
];
for(const x of specs){
 const file=path.join(root,"courses/science/chemistry-11/weeks/week-"+String(x.week).padStart(2,"0")+"/index.html");
 const html=fs.readFileSync(file,"utf8");
 assert(html.includes('id="anchor-investigation"'),"Missing investigation Week "+x.week);
 for(const term of [x.marker,x.data,x.method,"Thursday","data-evidence-key","<ol>"]){
  assert(html.includes(term),"Week "+x.week+" investigation missing "+term);
 }
 assert(/safe|no chemical mixing|no reagents|no radioactive/i.test(html),"Missing safety/alternative Week "+x.week);
 assert(html.includes('id="e-thursday"'),"Preserve actual Thursday saved evidence Week "+x.week);
 assert(html.includes("localStorage.setItem(k,el.value)"),"Preserve original evidence persistence Week "+x.week);
}
const isotope=23.985*.787+24.986*.101+25.983*.112;
assert(Math.abs(isotope-24.310)<.001,"Synthetic isotope answer key drift");
assert(Math.abs((25.983-23.985)*.01-.01998)<1e-8);
assert(Math.abs((65+68+63)/3/40*100-100-63.3333333)<.001);
assert.equal(30-400*.1,-10);
console.log("PASS chemistry-11 all eight safe anchor investigations and original evidence persistence");
