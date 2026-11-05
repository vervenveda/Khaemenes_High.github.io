#!/usr/bin/env node
/* Grade 10 profile migration/parity gate.
 * Repository-local, read-only. Does not touch grades, course data, STOS, or learner storage.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=rel=>fs.readFileSync(path.join(ROOT,rel),"utf8");
const exists=rel=>fs.existsSync(path.join(ROOT,rel));
const failures=[];
const ensure=(truth,msg)=>{if(!truth)failures.push(msg)};
const root="grades/grade-10/student-profile/";
const rooms=["index.html","profile/index.html","daily-lessons/index.html","grades/index.html","games/index.html","settings/index.html"];
const scripts=["grade10-look-chooser.js","grade10-profile-classes.js"];
const shared="grades/shared/grade09-blueprint-upper-grade.js";
const dashboard=read(root+"index.html");
const blueprint=read(shared);
const look=read(root+scripts[0]);
const classes=read(root+scripts[1]);
const profile=read(root+"profile/index.html");

for(const file of [...rooms,...scripts]){
 ensure(exists(root+file),"Missing Grade 10 file: "+file);
}
for(const [i,file] of rooms.entries()){
 const doc=read(root+file);
 ensure((doc.match(/<h1\b/gi)||[]).length===1,"Expected exactly one H1: "+file);
 ensure(/<main\b/i.test(doc)&&/<footer\b/i.test(doc),"Missing semantic main/footer: "+file);
 ensure(doc.includes("vnv-header-autopopulate.js")&&doc.includes("vnv-333-ticker.js")&&doc.includes("vnv-ticker-autopopulate.js")&&doc.includes("vnv-ecosystem-toolbar.js"),"Missing canonical chrome: "+file);
 if(file!=="index.html")ensure(/data-grade="10"/.test(doc),"Missing grade 10 owner attribute: "+file);
 if(file!=="index.html")ensure(/font-size:16px|font:400 16px/.test(doc),"Readable typography contract missing: "+file);
 // All locally required imports and literal links must resolve within the repo.
 for(const match of doc.matchAll(/<(script|link|a)\b[^>]*\b(?:src|href)=["']([^"']+)["'][^>]*>/gi)){
  const href=match[2];
  if(!href||href.startsWith("#")||href.startsWith("?")||/^(https?:|mailto:|tel:|javascript:|\/\/)/i.test(href)||href.includes("\${"))continue;
  const clean=href.split(/[?#]/)[0];
  if(!clean)continue;
  const resolved=path.resolve(ROOT,path.dirname(root+file),clean);
  if(!resolved.startsWith(ROOT+path.sep))continue;
  const dest=clean.endsWith("/")?path.join(resolved,"index.html"):resolved;
  ensure(fs.existsSync(dest),"Missing local destination "+file+" -> "+href);
 }
 // Parse every inline JavaScript block without running it or accessing student data.
 const inline=[...doc.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(([,attr,body])=>!/src\s*=/.test(attr)&&body.trim());
 for(const [j,match] of inline.entries()){
  try{new vm.Script(match[2],{filename:file+"#inline-"+j})}catch(err){failures.push("Invalid inline JS "+file+" script "+j+": "+err.message)}
 }
}
for(const file of scripts){
 try{new vm.Script(read(root+file),{filename:file})}catch(err){failures.push("Invalid Grade 10 JS "+file+": "+err.message)}
}
ensure(dashboard.includes('data-grade="10"'),"Grade 10 dashboard has no grade marker");
ensure(dashboard.includes('grade10-grade09-visual-parity-20261105'),"Grade 09 visual parity styles missing");
ensure(!dashboard.includes("Khaemenes_High.github.io/grades/grade-09/student-profile/profile/"),"Grade 10 dashboard still routes to Grade 09 profile editor");
ensure(blueprint.includes('const builder=grade==="10"?highRoot+"grades/grade-10/student-profile/profile/"'),"Shared Grade 10 profile tools still route to Grade 09");
for(const page of ["profile","daily-lessons","grades","games","settings"])ensure(dashboard.includes('href="'+page+'/')||dashboard.includes('href="'+page+'/'),"Dashboard missing local "+page+" doorway");
ensure(look.includes('String(Number(record.grade))!=="10"'),"Grade 10 photo editor is not registration-gated");
ensure(profile.includes("String(Number(learner.grade))!=='10'"),"Grade 10 profile saver is not grade-gated");
ensure(classes.includes('grade.grade!=="10"'),"Grade 10 class cards lack registration gate");
ensure(!classes.includes("localStorage.setItem"),"Grade 10 class rendering must remain read-only");
ensure(profile.includes("grade10-profile-classes.js")&&profile.includes("grade10-look-chooser.js"),"Grade 10 profile editor lacks its owned modules");
const daily=read(root+"daily-lessons/index.html"),report=read(root+"grades/index.html"),settings=read(root+"settings/index.html");
ensure(daily.includes("khaemenes.grade10.daily.v1:")&&daily.includes("These are not academic credits or assessments"),"Grade 10 daily report isolation/academic guard missing");
ensure(report.includes("Not an official transcript")&&report.includes("KhaemenesLearningContinuation"),"Grade 10 Grades source authority or disclaimer missing");
ensure(settings.includes("khaemenes-grade10-parent-alerts-v1:learner:")&&settings.includes("It was not delivered to a parent or server"),"Grade 10 settings authority boundary missing");
const g09=read("grades/grade-09/student-profile/index.html");
ensure(g09.includes("My Student Profile")&&g09.includes("student-course-registry.js"),"Reference Grade 09 dashboard missing");
const summary={schema:"grade10-profile-parity-gate-v1",checkedAt:new Date().toISOString(),referenceGrade:9,targetGrade:10,files:rooms.length+scripts.length+1,failures,sourceOnly:true};
fs.mkdirSync(path.join(ROOT,"reports"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"reports/grade10-profile-parity.json"),JSON.stringify(summary,null,2)+"\n");
console.log("GRADE10_PROFILE_PARITY="+(failures.length?"FAIL":"PASS")+" · "+failures.length+" issue(s)");
for(const message of failures)console.error("FAIL: "+message);
if(failures.length)process.exitCode=1;
