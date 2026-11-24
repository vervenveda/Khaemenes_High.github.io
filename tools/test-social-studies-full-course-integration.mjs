// Khaemenes Social Studies 9–12 full-course source integrity.
// Canonical curriculum lives only in weeks/week-XX. Grade 9–10 direct week-XX paths are compatibility redirects.
// Source checks only: browser, CI and learner activity need separate acceptance.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const read=p=>fs.readFileSync(p,"utf8");
const engine=read("courses/shared/social-studies-lesson-engine-v0.1.js");
const standardTag="social-studies-lesson-engine-v0.1.js?v=20261119-social-studies-complete-v5";
const week27Tag="social-studies-lesson-engine-v0.1.js?v=20261120-social-studies-week27-v6";
const weekdays=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const failures=[],missing=[],compatibilityRedirects=[],canonicalRedirects=[],covered=new Set(),examWeeks=[];
let integratedFiles=0,weekdayHeadings=0;

const checkPacket=(packetPath,grade,week)=>{
 const html=read(packetPath);
 integratedFiles++;
 if(!html.includes('data-social-studies-engine="'+grade+'"'))failures.push("Missing grade opt-in: "+packetPath);
 if(!html.includes(week===27&&grade===9?week27Tag:standardTag))failures.push("Missing approved engine source URL: "+packetPath);
 if(!html.includes("high-school-formative-evidence-v1.js"))failures.push("Original formative-evidence owner absent: "+packetPath);
 if(grade===9&&week===1){
  if(!html.includes("data-ss9-require-entry"))failures.push("Grade 09 Week 01 admission guard absent");
  for(let day=1;day<=5;day++)for(const phase of ["read","practice","write","check"]){
   if(!html.includes('data-day="'+day+'" data-phase="'+phase+'"'))failures.push("Grade 09 Week 01 native "+day+"/"+phase+" missing");
  }
 }else{
  const heads=[...html.matchAll(/<h3\b[^>]*>([^<]+)<\/h3>/gi)]
    .map(m=>m[1].trim()).filter(t=>weekdays.some(d=>t.startsWith(d+" · ")));
  if(heads.length!==5||heads.some((h,i)=>!h.startsWith(weekdays[i]+" · ")))
    failures.push("Five native weekdays not correctly ordered: "+packetPath);
  weekdayHeadings+=heads.length;
 }
 if(week===18||week===36)examWeeks.push(packetPath);
};

for(let grade=9;grade<=12;grade++)for(let week=1;week<=36;week++){
 const g=String(grade).padStart(2,"0"),w=String(week).padStart(2,"0");
 const base="courses/social-studies/grade-"+g+"/";
 const canonical=base+"weeks/week-"+w+"/student-packet.html";

 if(!fs.existsSync(canonical)){
  missing.push(canonical);failures.push("Missing canonical weekly packet: "+canonical);continue;
 }

 if(grade===9||grade===10){
  const legacy=base+"week-"+w+"/student-packet.html";
  if(!fs.existsSync(legacy)){
   missing.push(legacy);failures.push("Missing compatibility weekly doorway: "+legacy);
  }else{
   const legacyHtml=read(legacy),target="../weeks/week-"+w+"/student-packet.html";
   if(!legacyHtml.includes("KHAEMENES_WEEK_COMPAT_REDIRECT"))failures.push("Legacy weekly doorway is executable instead of compatibility-only: "+legacy);
   if(!legacyHtml.includes(target))failures.push("Legacy weekly redirect target drift: "+legacy);
   compatibilityRedirects.push(g+":"+w);
  }
 }

 let authoritative=canonical;
 const canonicalHtml=read(canonical);
 const refresh=canonicalHtml.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)["'][^>]*>/i);
 if(refresh){
  const destination=path.posix.normalize(path.posix.join(path.posix.dirname(canonical),refresh[1].trim()));
  if(!fs.existsSync(destination)){
   missing.push(destination);failures.push("Canonical redirect target missing: "+canonical+" -> "+destination);
  }else{
   canonicalRedirects.push(g+":"+w);
   authoritative=destination;
  }
 }

 if(fs.existsSync(authoritative)){
  checkPacket(authoritative,grade,week);
  covered.add(g+":"+w);
 }

 if(grade===9&&week===27){
  const original=base+"weeks/week-27/student-packet-v2.html";
  if(authoritative!==original)failures.push("Grade 09 Week 27 canonical redirect must resolve to student-packet-v2.html");
  const html=read(original);
  for(const text of ["Capitalism, Socialism, Labor, and Reform","Five-Day Investigation","Economic Lab Record","Assessment v2.0"]){
   if(!html.includes(text))failures.push("Authoritative Week 27 curriculum missing: "+text);
  }
  const app=read(base+"app.js"),data=read(base+"course-data.js");
  if(!app.includes("week===27?'weeks/week-27/student-packet-v2.html'"))
   failures.push("Original Grade 9 app must still point to v2");
  if(!data.includes('"week":27,"title":"Capitalism, Socialism, Labor, and Reform"'))
   failures.push("Original Grade 9 Week 27 curriculum record absent");
 }
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

assert.equal(missing.length,0,"All canonical packets, compatibility doorways and canonical redirect targets must exist");
assert.equal(covered.size,144,"Expected full 144/144 grade-week canonical coverage");
assert.equal(integratedFiles,144,"Expected exactly one authoritative instructional packet per grade-week");
assert.equal(weekdayHeadings,715,"Expected 143 five-day canonical packets plus the Grade 09 Week 01 phase player");
assert.equal(compatibilityRedirects.length,72,"Expected 72 Grade 9–10 historical compatibility doorways");
assert.deepEqual(new Set(canonicalRedirects),new Set(["09:27"]),"Only Grade 09 Week 27 may redirect inside the canonical weekly tree");
assert.equal(examWeeks.length,8,"Expected one Week 18 and Week 36 checkpoint per grade");
assert.deepEqual(failures,[],"Full-course source inspection found failures");
console.log("PASS SOURCE: 144/144 canonical grade-weeks, 72 historical compatibility redirects, 1 canonical v2 redirect.");
console.log("Grade 09 Week 27: canonical student-packet.html redirects to AUTHENTIC student-packet-v2.html.");
console.log("HOLD: deployed browser, learner session, print, tablet, and successful GitHub Actions job must still be independently verified.");
