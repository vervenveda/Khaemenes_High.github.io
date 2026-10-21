import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const registry=JSON.parse(read("data/lesson-tool-registry.json"));
const problems=[],report={lessons:registry.lessons.length,links:0,laboratories:0,questionChecks:0,unitAssessmentRoutes:0};
for(const lesson of registry.lessons){
 const lessonPath=path.join(root,lesson.lesson_path);
 if(!fs.existsSync(lessonPath)){problems.push("Missing lesson "+lesson.lesson_id);continue}
 const html=fs.readFileSync(lessonPath,"utf8");
 for(const tool of lesson.tools){
  report.links++;
  const target=path.join(root,tool.target);
  if(!fs.existsSync(target)){problems.push("Missing tool "+lesson.lesson_id+" -> "+tool.target);continue}
  if(path.resolve(path.dirname(lessonPath),tool.href)!==target||!(html.includes('href="'+tool.href+'"')||html.includes("href='"+tool.href+"'")))problems.push("Broken lesson link "+lesson.lesson_id+" -> "+tool.href);
  if(!/\/units\/unit-\d{2}\/[^/]+-lab\.html$/.test("/"+tool.target))continue;
  report.laboratories++;
  const lab=fs.readFileSync(target,"utf8");
  const checks=[...lab.matchAll(/href="([^"]*question-check\.html)"/g)].map(m=>m[1]);
  if(checks.length===0){
    // Earlier investigations may use in-page assessment or the unit assessment.
    const assessment=path.join(path.dirname(target),"unit-assessment.html");
    if(fs.existsSync(assessment))report.unitAssessmentRoutes++;
    else problems.push("Lab has no question check or unit assessment "+tool.target);
  }
  for(const check of checks){
   const destination=path.resolve(path.dirname(target),check);
   if(!fs.existsSync(destination))problems.push("Broken question check "+tool.target+" -> "+check);
   else report.questionChecks++;
  }
  if(!/href="\.\/"/.test(lab)&&!/href="index\.html"/.test(lab))problems.push("Lab lacks unit home link "+tool.target);
 }
}
const verifiedResultRoutes=[
 ["07","bonding-question-check.html","bonding-formula-lab.html"],
 ["08","motion-question-check.html","motion-graph-lab.html"],
 ["09","circuit-question-check.html","circuit-data-lab.html"],
 ["10","watershed-question-check.html","watershed-surface-lab.html"],
 ["11","orbit-question-check.html","solar-system-orbit-lab.html"],
 ["11","spectra-question-check.html","stellar-spectra-lab.html"],
 ["11","exoplanet-question-check.html","exoplanet-transit-lab.html"],
 ["11","cosmology-question-check.html","galaxy-expansion-lab.html"],
 ["12","risk-question-check.html","risk-reliability-lab.html"]
];
for(const [unit,check,lab] of verifiedResultRoutes){
 const html=read("units/unit-"+unit+"/"+check);
 if(!html.includes('href="'+lab+'"'))problems.push("Assessment result cannot return to investigation: "+unit+"/"+check);
 if(!html.includes('href="./">Return to unit lessons'))problems.push("Assessment result cannot return to unit: "+unit+"/"+check);
 if(!fs.existsSync(path.join(root,"units/unit-"+unit,lab)))problems.push("Assessment return target missing: "+unit+"/"+lab);
}
for(const name of ["orbit","spectra","exoplanet","cosmology"]){
 const app=read("units/unit-11/"+name+"-question-app.js");
 if(!app.includes("const focus=Object.entries(domains).filter"))problems.push("Missing targeted misconception feedback in Unit 11 "+name);
 if(!app.includes("Read the explanations below, revisit the investigation"))problems.push("Missing review guidance in Unit 11 "+name);
 if((app.match(/"explanation":/g)||[]).length!==8)problems.push("Expected eight answer explanations in Unit 11 "+name);
}
for(const [unit,name] of [["07","bonding"],["08","motion"],["09","circuit"],["10","watershed"],["12","risk"]]) {
 const src=read("units/unit-"+unit+"/"+name+"-question-app.js");
 if(!src.includes("Review these concepts: "))problems.push("Missing concept feedback "+unit+"/"+name);
}
const formative=read("science-formative-evidence.js");
const portfolio=read("science-evidence-portfolio.js");
for(const check of ['portfolioLink.textContent="Open student evidence portfolio"','unitLink.textContent="Return to unit lessons"']){
 if(!formative.includes(check))problems.push("Missing formative route "+check)
}
if(!portfolio.includes('labLink.href=record.activity'))problems.push("Missing portfolio return-to-investigation link");
for(let n=7;n<=12;n++){
 const id=String(n).padStart(2,"0"),controller=read("units/unit-"+id+"/unit"+id+".js");
 if(!controller.includes("science-upper-unit-evidence.js"))problems.push("Upper unit evidence controller missing "+id);
}
console.log("Science 9 progression audit",JSON.stringify(report));
if(problems.length){for(const issue of problems)console.error("FAIL",issue);process.exit(1)}
assert.equal(report.lessons,180);
console.log("PASS registered lesson links, available assessment routes, unit returns, formative portfolio routes");
