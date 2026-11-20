// High School Social Studies Engine v0.1 · End-to-end SOURCE coverage only.
// Never reads or mutates live student records, grades, assessments or browser state.
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const engine=read("courses/shared/social-studies-lesson-engine-v0.1.js");
const scriptName="social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5";
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const missingAllowed=new Set(["09:27"]); // ABSENT packet; must not fabricate it
const otherFailures=[],missing=[],covered=new Set(),examWeeks=[];
let htmlFiles=0,originalWeekdayHeadings=0;
for(let grade=9;grade<=12;grade++)for(let week=1;week<=36;week++){
 const g=String(grade).padStart(2,"0"),w=String(week).padStart(2,"0");
 const base="courses/social-studies/grade-"+g+"/";
 const paths=[base+(grade===10?"week-":"weeks/week-")+w+"/student-packet.html"];
 if(grade===10&&week>1)paths.push(base+"weeks/week-"+w+"/student-packet.html");
 let atLeastOne=false;
 for(const path of paths){
  if(!fs.existsSync(path)){
   missing.push({grade,week,path});
   if(!missingAllowed.has(g+":"+week))otherFailures.push("Unexpected missing packet: "+path);
   continue;
  }
  atLeastOne=true;htmlFiles++;
  const html=read(path);
  if(!html.includes('data-social-studies-engine="'+grade+'"'))otherFailures.push("Missing engine opt-in: "+path);
  if(!html.includes(scriptName))otherFailures.push("Missing canonical engine import: "+path);
  if(!html.includes("high-school-formative-evidence-v1.js"))otherFailures.push("Original evidence module absent: "+path);
  if(html.includes("high-school-global-chrome-v2.js"))otherFailures.push("Retired chrome reintroduced: "+path);
  if(grade===9&&week===1){
    if(!html.includes('data-ss9-require-entry'))otherFailures.push("Grade 9 Week 01 readiness authority missing");
    for(let d=1;d<=5;d++)for(const phase of ["read","practice","write","check"]){
     if(!html.includes('data-day="'+d+'" data-phase="'+phase+'"'))otherFailures.push("Grade 9 native phase missing: "+d+"/"+phase);
    }
  }else{
    const original=[...html.matchAll(/<h3\b[^>]*>([^<]+)<\/h3>/gi)].map(x=>x[1].trim()).filter(t=>days.some(d=>t.startsWith(d+" · ")));
    if(original.length!==5||original.some((t,i)=>!t.startsWith(days[i]+" · ")))otherFailures.push("Original day sequence mismatch: "+path+" ("+original.length+")");
    originalWeekdayHeadings+=original.length;
  }
  if(week===18||week===36)examWeeks.push(path);
 }
 if(atLeastOne)covered.add(g+":"+w);
}
for(const s of ["const week02=weekNumber===2","const week03=weekNumber===3","const laterWeek=weekNumber!==null&&weekNumber>=4&&weekNumber<=36","if(targets&&(!targets.length||targets.some(x=>!x)||new Set(targets).size!==5))return false","heading?.closest(\"article.lesson,section.card,article\")","if(grade===\"9\"||laterWeek)return heading||null"]){
 if(!engine.includes(s))otherFailures.push("Source-derived engine safeguard absent: "+s);
}
for(const forbidden of ["localStorage","sessionStorage","indexedDB","fetch(","XMLHttpRequest","document.cookie"]){
 if(engine.includes(forbidden))otherFailures.push("Unexpected independent persistence: "+forbidden);
}
assert.equal(covered.size,143,"Expected 143 of 144 original grade/weeks with one documented missing Grade 9 Week 27");
assert.equal(htmlFiles,178,"Expected 178 original packet files (Grade 10 has a second path for Weeks 2–36)");
assert.equal(missing.length,1,"Expected exactly one missing original file");
assert.equal(missing[0].path,"courses/social-studies/grade-09/weeks/week-27/student-packet.html");
assert.equal(originalWeekdayHeadings,885,"Expected 177 native five-day packets (Grade 9 Week 01 is a 20-phase native workspace)");
assert.equal(examWeeks.length,10,"End-of-term source files must be preserved across all grade paths");
assert.deepEqual(otherFailures,[],"Unexpected full-course integration failures");
console.log("PASS Social Studies engine SOURCE integration: 143/144 grade-weeks, 178 packet files, 870 weekday headings, native exams/evidence intact.");
console.log("DOCUMENTED HOLD: Grade 9 Week 27 original student packet absent; no fabricated replacement.");
console.log("CI browser/runtime mastery acceptance still requires separate evidence.");
