import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd();
const failures=[];
const ok=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

for(let unit=1;unit<=9;unit++){
  const id=String(unit).padStart(2,"0");
  const base=`courses/mathematics/algebra-1/units/unit-${id}`;
  const page=read(`${base}/boss-battle.html`);
  const corePath=unit===1?`${base}/assets/unit${id}.js`:`${base}/assets/unit${id}-core.js`;
  const core=read(corePath);
  const map=JSON.parse(read(`${base}/unit-map.json`));

  try{new vm.Script(core,{filename:corePath})}catch(error){failures.push(`Unit ${id} core JavaScript syntax: ${error.message}`)}

  ok(page.includes(`Unit ${id} Synthesis Challenge`),`Unit ${id} legacy challenge route has the synthesis title`);
  ok(!page.includes(">Boss Battle<"),`Unit ${id} page has no visible Boss Battle label`);
  ok(core.includes(">Synthesis Challenge<"),`Unit ${id} navigation names the Synthesis Challenge`);
  ok(core.includes("Part B · Error Analysis"),`Unit ${id} includes error analysis`);
  ok(core.includes("Part C · Transfer &amp; Modelling"),`Unit ${id} includes transfer and modelling`);
  ok(core.includes("Part D · Mathematical Defense"),`Unit ${id} includes mathematical defense`);
  ok(core.includes(`khaemenes-algebra1-unit${id}-synthesis-v1`),`Unit ${id} uses learner-scoped local synthesis evidence`);
  ok(core.includes('bind(items,"synthesis-challenge")'),`Unit ${id} selected-response evidence uses the synthesis record key`);
  ok(core.includes("Recommended synthesis benchmark")&&core.includes("16/20"),`Unit ${id} exposes the 80% synthesis benchmark`);
  ok(core.includes("browser-local-unverified-synthesis-evidence"),`Unit ${id} marks public written review as unverified evidence`);
  ok(map.synthesis_challenge==="boss-battle.html",`Unit ${id} canonical map exposes the synthesis route`);
}

if(failures.length){
  console.error("\nAlgebra I synthesis challenge validation failed:");
  failures.forEach(item=>console.error(" - "+item));
  process.exit(1);
}
console.log("Algebra I synthesis challenge validation passed: Units 01-09 preserve the legacy route while requiring selected-response reasoning, error analysis, transfer/modelling, mathematical defense, a 20-point rubric, and learner-scoped written evidence.");
