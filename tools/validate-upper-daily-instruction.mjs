import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const days=["monday","tuesday","wednesday","thursday","friday"];
const courses=[
 {dir:"courses/language-arts/english-11",name:"English 11",science:false},
 {dir:"courses/language-arts/english-12",name:"English 12",science:false},
 {dir:"courses/science/biology-10",name:"Biology 10",science:true},
 {dir:"courses/science/chemistry-11",name:"Chemistry 11",science:true}
];
const css="courses/shared/daily-instruction.css";
assert(fs.existsSync(css),"Missing shared daily instruction CSS");
const styles=fs.readFileSync(css,"utf8");
assert(styles.includes("border-radius:7px"),"Academy 7px radius missing");
assert(styles.includes("@media print"),"Printable lesson style missing");
let pages=0,links=0;
for(const course of courses){
 const root=course.dir+"/weeks/week-01/";
 const weekly=fs.readFileSync(root+"index.html","utf8");
 for(let i=0;i<5;i++){
  const n=String(i+1).padStart(2,"0");
  const target="lessons/day-"+n+".html";
  const lesson=root+target;
  assert(fs.existsSync(lesson),course.name+" missing "+target);
  const html=fs.readFileSync(lesson,"utf8");
  assert(weekly.includes('id="'+days[i]+'"'),"Original day section removed");
  assert(weekly.includes('href="'+target+'"'),"Weekly link missing for "+lesson);
  assert(html.includes('href="../index.html#'+days[i]+'"'),"Return to original workspace absent");
  assert(html.includes("../../../index.html"),"Course home return missing");
  assert(html.includes("shared/daily-instruction.css"),"Shared stylesheet missing");
  for(const label of ["Explicit instruction","Worked","Guided","Independent","Misconception","Teacher","check"]){
   assert(html.toLowerCase().includes(label.toLowerCase()),course.name+" lesson lacks "+label);
  }
  assert(html.length>2800,course.name+" daily lesson unexpectedly skeletal");
  assert(!/<script\b/i.test(html),"Companion should not execute assessment or record scripts");
  assert(!/localStorage|sessionStorage|setItem\s*\(/.test(html),"Companion must not modify learner records");
  assert(!/<form\b|type="submit"/.test(html),"Companion should not add independent grade submission");
  assert(/<details><summary>/.test(html),"Model response disclosure missing");
  assert(html.includes("Jennifer Kay Pearl"),"Canonical footer missing");
  if(course.science){
   assert(/safety|Safety/.test(html)&&/simulat|fictional|synthetic|invented/i.test(html),"Safety or example boundary missing");
   assert(weekly.includes('data-evidence-key='),"Original saved evidence fields missing");
  }else{
   assert(weekly.includes('data-scope="week:1"')||weekly.includes('data-save-field='),"Existing ELA record bindings missing");
   assert(html.includes("Read the original passage"),"Original reading absent");
  }
  for(const found of html.matchAll(/href="([^"]+)"/g)){
   const href=found[1];
   if(href.startsWith("#")||/^(?:https?:|mailto:)/i.test(href))continue;
   const filepath=path.resolve(path.dirname(lesson),href.split("#")[0].split("?")[0]);
   assert(fs.existsSync(filepath),"Broken local href "+href+" inside "+lesson);
   links++;
  }
  pages++;
 }
 if(course.science)for(const day of days)assert(weekly.includes('id="e-'+day+'"'),course.name+" "+day+" saved evidence id missing");
}
assert.equal(pages,20);
assert(links>=70,"Expected previous/next, course, and portfolio routes");
const original=fs.readFileSync("courses/science/biology-10/weeks/week-04/index.html","utf8");
assert(original.includes("enzyme-rate-studio.html"),"Later science studios must be preserved");
console.log("PASS: "+pages+" self-contained deep lessons; "+links+" local links; original course workspaces, STEM safety, formative/official-grade separation.");
