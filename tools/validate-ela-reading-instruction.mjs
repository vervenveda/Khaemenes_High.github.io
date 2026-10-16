import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root="courses/language-arts";
const map=JSON.parse(fs.readFileSync(root+"/reading-depth-map.json","utf8"));
const days=["monday","tuesday","wednesday","thursday","friday"];
assert.equal(map.week_03_companions.length,3);
assert.equal(map.week_02_companions.length,3);
let checked=0,routeCount=0,wordsTotal=0;
for(const info of map.week_03_companions){
 const course=info.course;
 const base=path.join(root,course,"weeks/week-03");
 const doc=fs.readFileSync(path.join(base,info.reading),"utf8");
 const week=fs.readFileSync(path.join(base,"index.html"),"utf8");
 const data=JSON.parse(fs.readFileSync(path.join(root,course,"curriculum.json"),"utf8"));
 const plan=data.weeks.find(w=>w.week===3);
 assert(plan,"Missing course week 03 curriculum "+course);
 assert.equal(plan.unit,info.unit);
 assert.equal(plan.lessons?.length,5);
 assert.equal(plan.title,info.title);
 assert(!doc.includes("<script"),"Companion must not insert grade or learner scripts");
 assert(!doc.includes("localStorage")&&!doc.includes("sessionStorage"),"No parallel storage authority");
 assert(doc.includes("fictional")||doc.includes("Fictional"),"Source nature declaration missing");
 assert(doc.includes("worked")||doc.includes("Worked")||doc.includes("modeled"),"Worked model missing");
 assert(doc.includes("Teacher")||doc.includes("teacher"),"Teacher guidance missing");
 assert(doc.includes("source")||doc.includes("Source"),"Source reasoning missing");
 assert(doc.includes("index.html"),"Classroom return missing");
 const clean=doc.replace(/<[^>]+>/g," ").replace(/&(?:#\d+|amp|lt|gt|quot|#39);/g," ");
 const words=clean.split(/\s+/).filter(Boolean).length;
 assert(words>=950,"Deep dossier lacks sustained instructional text: "+course+" words="+words);
 wordsTotal+=words;
 assert(week.includes('href="reading-dossier.html"'),"Week hero route missing "+course);
 const titleMatches=[...week.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
 assert(titleMatches.length>=1,"Course heading absent");
 for(let i=0;i<5;i++){
  const n=String(i+1);
  assert(doc.includes('id="day-'+n+'"'),"Dossier day anchor missing "+course+" "+n);
  assert(week.includes('href="reading-dossier.html#day-'+n+'"'),"Weekly daily resource link missing "+course+" "+n);
  assert(doc.includes('href="index.html#'+days[i]+'"'),"Original student-work return missing "+course+" "+days[i]);
  assert(week.includes('id="'+days[i]+'"'),"Existing day section missing "+course+" "+days[i]);
  const task=doc.match(new RegExp('<section[^>]*id="day-'+n+'"[\\s\\S]*?<\\/section>'))?.[0]||"";
  assert(task.length>=480,"Daily source task too thin: "+course+" day "+n);
  assert(task.includes("<details>"),"Self-check disclosure missing");
  routeCount++;
 }
 for(const found of doc.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=found[1];if(/^(#|https?:|mailto:)/i.test(href))continue;
  const filepath=path.resolve(base,href.split("#")[0].split("?")[0]);
  assert(fs.existsSync(filepath),"Broken local route "+course+": "+href);
  routeCount++;
 }
 assert(week.includes('data-scope="week:3"')||week.includes('data-save-field='),"Existing weekly save fields must survive "+course);
 checked++;
}
for(const item of map.week_02_companions){
 const base=path.join(root,item.course,"weeks/week-02");
 assert(fs.existsSync(path.join(base,item.reading)),"Earlier upgraded reading must remain "+item.course);
 const week=fs.readFileSync(path.join(base,"index.html"),"utf8");
 assert(week.includes("reading-dossier.html"),"Week 02 dossier classroom link missing "+item.course);
}
const e9=map.week_03_grade_09;
for(const p of e9.day_paths)assert(fs.existsSync(path.join(root,e9.course,"weeks/week-03",p)),"Existing English 9 daily study missing "+p);
const stylesheet="courses/shared/daily-instruction.css";
assert(fs.existsSync(stylesheet));
assert(fs.readFileSync(stylesheet,"utf8").includes("border-radius:7px"));
console.log("PASS: "+checked+" Grade 10–12 deep Week 03 dossiers, "+wordsTotal+" words, "+routeCount+" verified resource/return links, earlier Week 02 & Grade 9 isolated lessons preserved.");
