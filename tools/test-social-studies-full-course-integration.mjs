// Social Studies 9–12: all 36 weeks, BOTH original route families.
// This is a SOURCE test. It does not verify authenticated browser behavior.
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const engine=read("courses/shared/social-studies-lesson-engine-v0.1.js");
const tag="social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5";
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const expectedRedirects=new Set(["09:01","09:06","09:07","09:09","09:10"]);
const allowedMissing=new Set(["09:27"]);
const failures=[],missing=[],redirects=[],covered=new Set(),examWeeks=[];
let integratedFiles=0,weekdayHeadings=0;
for(let grade=9;grade<=12;grade++)for(let week=1;week<=36;week++){
 const g=String(grade).padStart(2,"0"),w=String(week).padStart(2,"0");
 const base="courses/social-studies/grade-"+g+"/";
 const direct=base+"week-"+w+"/student-packet.html";
 const nested=base+"weeks/week-"+w+"/student-packet.html";
 const paths=grade===9?[nested,direct]:grade===10?[direct,nested]:[nested];
 let atLeastOne=false;
 for(const path of paths){
  if(!fs.existsSync(path)){
   missing.push({grade,week,path});
   if(!allowedMissing.has(g+":"+week))failures.push("Unexpected missing packet: "+path);
   continue;
  }
  const html=read(path);
  const isRedirect=grade===9&&path===direct&&
    /<meta[^>]+http-equiv=["']refresh["']/i.test(html)&&
    html.includes("../weeks/week-"+w+"/student-packet.html");
  if(isRedirect){
   redirects.push(g+":"+w);
   if(!expectedRedirects.has(g+":"+week))failures.push("Unexpected direct-route redirect: "+path);
   continue;
  }
  atLeastOne=true;integratedFiles++;
  if(!html.includes('data-social-studies-engine="'+grade+'"'))failures.push("Missing grade opt-in: "+path);
  if(!html.includes(tag))failures.push("Missing versioned engine: "+path);
  if(!html.includes("high-school-formative-evidence-v1.js")&&!(grade===9&&path===direct))
    failures.push("Existing formative-evidence owner removed: "+path);
  if(html.includes("high-school-global-chrome-v2.js"))failures.push("Retired chrome reintroduced: "+path);
  if(grade===9&&week===1&&path===nested){
   if(!html.includes('data-ss9-require-entry'))failures.push("Grade 09 Week 01 entry gate missing");
   for(let day=1;day<=5;day++)for(const phase of ["read","practice","write","check"]){
    if(!html.includes('data-day="'+day+'" data-phase="'+phase+'"'))
      failures.push("Grade 09 Week 01 native phase missing: "+day+"/"+phase);
   }
  }else{
   const native=[...html.matchAll(/<h3\b[^>]*>([^<]+)<\/h3>/gi)]
     .map(m=>m[1].trim()).filter(t=>days.some(d=>t.startsWith(d+" · ")));
   if(native.length!==5||native.some((t,i)=>!t.startsWith(days[i]+" · ")))
     failures.push("Original Monday–Friday lesson mismatch: "+path+" ("+native.length+")");
   weekdayHeadings+=native.length;
  }
  if(week===18||week===36)examWeeks.push(path);
 }
 if(atLeastOne)covered.add(g+":"+w);
}
for(const flag of [
 "const week02=weekNumber===2",
 "const week03=weekNumber===3",
 "const laterWeek=weekNumber!==null&&weekNumber>=4&&weekNumber<=36",
 'if(targets&&(!targets.length||targets.some(x=>!x)||new Set(targets).size!==5))return false',
 'if(grade==="9"||laterWeek)return heading||null'
]){
 if(!engine.includes(flag))failures.push("Missing engine safeguard: "+flag);
}
for(const forbidden of ["localStorage","sessionStorage","indexedDB","fetch(","XMLHttpRequest","document.cookie"])
 if(engine.includes(forbidden))failures.push("New engine should not own persistence: "+forbidden);
assert.equal(covered.size,143,"143/144 unique grade-weeks expected, one Grade 9 Week 27 missing");
assert.equal(integratedFiles,209,"209 genuine original student-packet files should be integrated");
assert.equal(weekdayHeadings,1040,"208 ordinary five-day packets; separate Grade 09 Week 01 phase player");
assert.equal(redirects.length,5,"Five original Grade 09 legacy redirect addresses preserved");
assert.deepEqual(new Set(redirects),expectedRedirects,"Redirect pathways should not be overwritten");
assert.equal(missing.length,2,"Grade 09 Week 27 has no canonical or direct student packet");
assert.ok(missing.every(m=>m.grade===9&&m.week===27),"Unexpected missing original source");
assert.equal(examWeeks.length,12,"End-of-term Week 18/36 native packet sources preserved");
assert.deepEqual(failures,[],"Source integration failures");
console.log("PASS SOURCE: 143/144 grade-weeks, 209 genuine packet HTML files, 1040 original weekday headings, 5 redirects left intact.");
console.log("HOLD: Grade 09 Week 27 missing at canonical and direct routes; no invented lesson.");
console.log("CI, rendered browser and learner-record acceptance require independent verification.");
