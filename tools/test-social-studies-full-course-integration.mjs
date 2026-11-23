// Khaemenes Social Studies 9–12 full-course source integrity.
// 36 weeks × 4 grades; preserves the real Week 27 v2 source and redirects.
// Source checks only: browser, CI and learner activity need separate acceptance.
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const engine=read("courses/shared/social-studies-lesson-engine-v0.1.js");
const standardTag="social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5";
const week27Tag="social-studies-lesson-engine-v0.1.js?v=20261120-social-studies-week27-v6";
const weekdays=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const expectedRedirects=new Set(["09:01","09:06","09:07","09:09","09:10","09:27"]);
const failures=[],missing=[],redirects=[],covered=new Set(),examWeeks=[];
let integratedFiles=0,weekdayHeadings=0;
const checkPacket=(path,grade,week)=>{
 const html=read(path);
 integratedFiles++;
 if(!html.includes('data-social-studies-engine="'+grade+'"'))failures.push("Missing grade opt-in: "+path);
 if(!html.includes(week===27&&grade===9?week27Tag:standardTag))failures.push("Missing approved engine source URL: "+path);
 if(!html.includes("high-school-formative-evidence-v1.js")&&!(grade===9&&path.includes("/grade-09/week-")))failures.push("Original formative-evidence owner absent: "+path);
 if(grade===9&&week===1&&path.includes("/weeks/")){
  if(!html.includes("data-ss9-require-entry"))failures.push("Grade 09 Week 01 admission guard absent");
  for(let day=1;day<=5;day++)for(const phase of ["read","practice","write","check"]){
   if(!html.includes('data-day="'+day+'" data-phase="'+phase+'"'))failures.push("Grade 09 Week 01 native "+day+"/"+phase+" missing");
  }
 }else{
  const heads=[...html.matchAll(/<h3\b[^>]*>([^<]+)<\/h3>/gi)]
     .map(m=>m[1].trim()).filter(t=>weekdays.some(d=>t.startsWith(d+" · ")));
  if(heads.length!==5||heads.some((h,i)=>!h.startsWith(weekdays[i]+" · ")))
   failures.push("Five native weekdays not correctly ordered: "+path);
  weekdayHeadings+=heads.length;
 }
 if(week===18||week===36)examWeeks.push(path);
};
for(let grade=9;grade<=12;grade++)for(let week=1;week<=36;week++){
 const g=String(grade).padStart(2,"0"),w=String(week).padStart(2,"0");
 const base="courses/social-studies/grade-"+g+"/";
 const direct=base+"week-"+w+"/student-packet.html";
 const nested=base+"weeks/week-"+w+"/student-packet.html";
 const routes=grade===9?[nested,direct]:grade===10?[direct,nested]:[nested];
 let found=false;
 for(const path of routes){
  if(!fs.existsSync(path)){missing.push(path);failures.push("Missing standard doorway: "+path);continue}
  const html=read(path);
  const isGrade9Redirect=grade===9&&
   /<meta[^>]+http-equiv=["']refresh["']/i.test(html)&&
   (week===27?html.includes("student-packet-v2.html"):html.includes("../weeks/week-"+w+"/student-packet.html"));
  if(isGrade9Redirect){
   redirects.push(g+":"+w);
   if(!expectedRedirects.has(g+":"+w))failures.push("Unexpected redirected route: "+path);
   if(week===27){
     const destination=path===nested?"student-packet-v2.html":"../weeks/week-27/student-packet-v2.html";
     if(!html.includes(destination))failures.push("Incorrect Week 27 redirect: "+path);
   }
  }else{found=true;checkPacket(path,grade,week)}
 }
 if(grade===9&&week===27){
  const original=base+"weeks/week-27/student-packet-v2.html";
  if(!fs.existsSync(original)){missing.push(original);failures.push("Actual Week 27 original v2 missing")}
  else{
   const html=read(original);
   for(const text of ["Capitalism, Socialism, Labor, and Reform","Five-Day Investigation","Economic Lab Record","Assessment v2.0"]){
    if(!html.includes(text))failures.push("Authoritative Week 27 curriculum missing: "+text);
   }
   checkPacket(original,grade,week);
   found=true;
  }
  const app=read(base+"app.js"),data=read(base+"course-data.js");
  if(!app.includes("week===27?'weeks/week-27/student-packet-v2.html'"))
   failures.push("Original Grade 9 app must still point to v2");
  if(!data.includes('"week":27,"title":"Capitalism, Socialism, Labor, and Reform"'))
   failures.push("Original Grade 9 Week 27 curriculum record absent");
 }
 if(found)covered.add(g+":"+w);
}
for(const safeguard of [
 "const week02=weekNumber===2",
 "week03=weekNumber===3",
 "const laterWeek=weekNumber!==null&&weekNumber>=4&&weekNumber<=36",
 "student-packet(?:-v2)?",
 'if(targets&&(!targets.length||targets.some(x=>!x)||new Set(targets).size!==5))return false',
 'if(grade==="9"||laterWeek)return heading||null'
])if(!engine.includes(safeguard))failures.push("Engine safeguard absent: "+safeguard);
for(const forbidden of ["localStorage","sessionStorage","indexedDB","fetch(","XMLHttpRequest","document.cookie"])
 if(engine.includes(forbidden))failures.push("Engine persistence is forbidden: "+forbidden);
assert.equal(missing.length,0,"All standard links and original v2 packet must exist");
assert.equal(covered.size,144,"Expected full 144/144 grade-week coverage");
assert.equal(integratedFiles,210,"Expected 210 genuine instructional HTML packet files");
assert.equal(weekdayHeadings,1045,"Expected 209 genuine five-day packet headings, plus separate Grade 09 Week 01 phase player");
assert.equal(redirects.length,7,"Expected 7 redirect-only compatibility pages");
assert.deepEqual(new Set(redirects),expectedRedirects,"Unexpected redirect source");
assert.equal(examWeeks.length,12,"Exam and capstone packet paths must be preserved");
assert.deepEqual(failures,[],"Full-course source inspection found failures");
console.log("PASS SOURCE: 144/144 grade-weeks, 210 original packets, 1045 native weekday headings, 7 redirect pages.");
console.log("Grade 09 Week 27: AUTHENTIC student-packet-v2.html; both standard links redirect to v2.");
console.log("HOLD: deployed browser, learner session, print, tablet, and successful GitHub Actions job must still be independently verified.");
