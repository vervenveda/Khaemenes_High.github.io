import fs from "node:fs";import vm from "node:vm";
const base=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,base),"utf8");
const readiness=read("diagnostic/readiness-app.js");
const routing=read("diagnostic/readiness-routing.js");
new vm.Script(readiness);new vm.Script(routing);
if(!readiness.includes("Select an Academy learner before saving"))throw Error("Readiness learner gate missing");
const capstone=read("units/unit-12/unit12.js");
const page=read("units/unit-12/sustainable-engineering-capstone.html");
new vm.Script(capstone);
if(!page.includes('id="capstoneRevisionHistory"')||!capstone.includes("renderCapstoneRevisions()")||!capstone.includes("Load into editor"))throw Error("Capstone revision restore controls missing");
if(!page.includes('id="capstoneEvidence"')||!capstone.includes('$("#capstoneEvidence")')||!capstone.includes("revisions:[...history"))throw Error("Capstone evidence/revision persistence missing");
for(let i=1;i<=12;i++){
 const n=String(i).padStart(2,"0");const src=read("units/unit-"+n+"/unit"+n+".js");new vm.Script(src);
 if(!src.includes("kh_sci9_learner_v1:")||!src.includes("recoverLegacy"))throw Error("Learner scope/recovery missing Unit "+n);
}
for(const id of ["saveCapstoneDraft","exportCapstoneRecord","capstoneRevisionList","capstoneSaveStatus"]){if(!page.includes(`id="${id}"`))throw Error("Missing student portfolio control "+id);if(id!=="capstoneSaveStatus"&&!capstone.includes(id))throw Error("Control not wired "+id);}
console.log("PASS Science 9 readiness script syntax, twelve learner controllers and capstone evidence contract.");
