import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const courses=["english-9","english-10","english-11","english-12"],weeks=[19,20,21];
const map=JSON.parse(fs.readFileSync("courses/language-arts/reading-depth-map.json","utf8"));
assert.equal(map.unit_07_companions.length,4);
assert.equal(map.week_02_companions.length,3,"Earlier upgraded companions remain mapped");
assert.equal(map.week_03_companions.length,3,"Earlier upgraded companions remain mapped");
assert(fs.existsSync("courses/shared/daily-instruction.css"));
let destinations=0,readingSections=0;
for(const course of courses){
 const root="courses/language-arts/"+course;
 const unit=root+"/units/unit-07/index.html";
 const dossier=root+"/units/unit-07/reading-dossier.html";
 const html=fs.readFileSync(dossier,"utf8"),unitHTML=fs.readFileSync(unit,"utf8");
 assert(html.length>10000,"Substantive reading required: "+dossier);
 assert(html.includes('href="../../../../shared/daily-instruction.css"'),"Shared Academy styling missing");
 assert(html.includes('href="index.html#assigned-reading"'),"Required unit reading return route missing");
 assert(html.includes("Jennifer Kay Pearl"),"Canonical footer missing");
 assert(unitHTML.includes('id="assigned-reading"'),"Original assigned-reading section absent: "+unit);
 assert(unitHTML.includes('href="reading-dossier.html#week-19"'),"Unit entry not linked: "+unit);
 assert(!/<script\b|localStorage|sessionStorage|data-score=|data-project-score=/.test(html),"Companion must be read-only");
 const record=map.unit_07_companions.find(x=>x.course===course);
 assert(record&&record.preserve_unit_original===true&&record.weeks.join(",")==="19,20,21");
 for(const week of weeks){
  const w=root+"/weeks/week-"+String(week).padStart(2,"0")+"/index.html",weekly=fs.readFileSync(w,"utf8");
  const target="../../units/unit-07/reading-dossier.html#week-"+week;
  assert(weekly.includes('href="'+target+'"'),"Missing weekly route "+w);
  assert(html.includes('id="week-'+week+'"'),"Dossier anchor missing "+course+" "+week);
  assert(html.includes('href="../../weeks/week-'+week+'/index.html"'),"Workspace return missing "+dossier);
  const section=html.split('id="week-'+week+'"')[1]?.split(/id="week-(?:19|20|21)"/)[0];
  assert(section&&section.length>2500,"Weak weekly reading and instruction "+course+" "+week);
  for(const phrase of ["Explicit","Worked","Guided","independent","Misconception","Teacher","<details><summary>"]){
   assert(section.toLowerCase().includes(phrase.toLowerCase()),"Missing "+phrase+" in "+course+" week "+week);
  }
  assert((section.match(/class="quote"/g)||[]).length>=2||(section.match(/class="quote" style=/g)||[]).length>=2,"Two original source passages expected "+course+" "+week);
  assert(weekly.includes('id="main"'),"Original weekly content removed "+w);
  assert(weekly.includes("assets/course.js")||weekly.includes("../../assets/course.js")||course==="english-9","Existing ELA lesson runtime missing "+w);
  destinations++;
 }
 for(const [,href] of html.matchAll(/href="([^"]+)"/g)){
  if(href[0]==="#"||/^https?:|^mailto:/.test(href))continue;
  const dest=path.resolve(path.dirname(dossier),href.split("#")[0].split("?")[0]);
  assert(fs.existsSync(dest),"Broken local link "+href+" in "+dossier);
 }
 readingSections++;
}
assert.equal(destinations,12);
assert.equal(readingSections,4);
for(const course of courses){
 const root="courses/language-arts/"+course+"/units/";
 for(const u of ["unit-05","unit-06"])
  assert(fs.existsSync(root+u+"/reading-dossier.html"),"Preserve prior "+course+" "+u+" reading");
}
console.log("PASS: four Grade 9–12 Unit 07 dossiers; 12 linked weekly reading anchors; original assignments, older units, navigation and ungraded boundaries preserved.");
