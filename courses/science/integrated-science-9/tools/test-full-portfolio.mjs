import assert from "node:assert/strict";
import fs from "node:fs";
const base=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,base),"utf8");
const portfolio=read("science-evidence-portfolio.js"),formative=read("science-formative-evidence.js"),bridge=read("science-upper-unit-evidence.js");
const activity=/^units\/unit-(?:0[2-9]|1[0-2])\/[^/]+\.html$/;
for(let n=2;n<=12;n++){const name="units/unit-"+String(n).padStart(2,"0")+"/example-lab.html";assert(activity.test(name),name)}
for(const bad of ["units/unit-01/example-lab.html","units/unit-13/example-lab.html","units/unit-07/../../index.html","units/unit-07/a.txt"])assert(!activity.test(bad),bad);
assert(portfolio.includes('heading.textContent="Unit "+String(unit).padStart(2,"0")'),"unit 10–12 heading formatting");
assert(portfolio.includes("records:fetchRecords(id)"),"export current records instead of stale snapshot");
for(const guard of ["data.learner!==id","seen.has(record.activity)","localStorage.getItem(key)!==null","window.confirm(","clearOnLearnerChange(id)"])assert(portfolio.includes(guard),guard);
assert(portfolio.includes("document.addEventListener(\"visibilitychange\""),"learner switch return check");
for(let n=7;n<=12;n++){const id=String(n).padStart(2,"0"),src=read("units/unit-"+id+"/unit"+id+".js");assert(src.includes("science-upper-unit-evidence.js"),"missing Unit "+id+" bridge");}
assert(bridge.includes("khUpperEvidence")&&formative.includes("#khUpperEvidence"),"upper unit evidence not connected");
for(const src of [portfolio,formative,bridge])assert(!src.includes("completedUnits=")&&!src.includes("verifiedScore="),"formative work must not set mastery");
const page=read("science-evidence-portfolio.html");
assert(page.includes("@media(max-width:280px)"),"255px compact presentation rules missing");
assert(page.includes("input[type=file]{max-width:100%"),"mobile backup file input overflow guard missing");
assert(portfolio.includes("Learner changed during file loading"),"async backup-read learner guard missing");
assert(portfolio.includes("Learner changed before restoration"),"post-confirm learner guard missing");
assert(portfolio.includes("Learner changed during restore"),"per-record learner guard missing");
assert(portfolio.includes('labLink.href=record.activity'),"portfolio missing return to original investigation");
assert(portfolio.includes('labLink.className="no-print"'),"printable record must hide navigation");
assert(formative.includes('portfolioLink.textContent="Open student evidence portfolio"'),"investigation missing portfolio path");
console.log("PASS narrow-width styles and asynchronous restore learner-isolation guards");
console.log("PASS Science 9 Units 02–12 portfolio coverage, headings, current export, learner guards and formative isolation");
