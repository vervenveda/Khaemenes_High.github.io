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
