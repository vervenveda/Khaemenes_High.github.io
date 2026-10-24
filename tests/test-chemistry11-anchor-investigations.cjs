#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const specs=[
 {week:1,marker:"Measurement reliability",data:"24.8, 25.1, 24.9",method:"Method B"},
 {week:3,marker:"Isotope mass-spectrum inference",data:"23.985 u",method:"24.310 u"},
 {week:5,marker:"Testing periodic patterns",data:"Mg→Al",method:"P→S"}
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
console.log("PASS chemistry-11 Weeks 01,03,05 anchored safe investigations and original evidence persistence");
