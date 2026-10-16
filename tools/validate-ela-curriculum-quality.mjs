import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";

const courses=[
 {slug:"english-10",global:"ELA10_COURSE",grade:10},
 {slug:"english-11",global:"ENGLISH_11_CURRICULUM",grade:11},
 {slug:"english-12",global:"ENGLISH_12_CURRICULUM",grade:12}
];
let checkedWeeks=0,checkedQuizItems=0,rotations={};
for(const course of courses){
 const base="courses/language-arts/"+course.slug;
 const curriculum=JSON.parse(fs.readFileSync(base+"/curriculum.json","utf8"));
 const js=fs.readFileSync(base+"/assets/curriculum-data.js","utf8");
 const ctx={window:{}};
 new vm.Script(js,{filename:base+"/assets/curriculum-data.js"}).runInNewContext(ctx,{timeout:2000});
 assert.deepEqual(JSON.parse(JSON.stringify(ctx.window[course.global])),curriculum,course.slug+" browser data diverges from curriculum.json");
 assert.equal(curriculum.quizBankVersion,"2026-10-16-v2-contextual");
 assert.equal(curriculum.weeksCount,36);
 assert.equal(curriculum.unitsCount,12);
 assert.equal(curriculum.weeks.length,36);
 assert.equal(curriculum.units.length,12);
 const courseJs=fs.readFileSync(base+"/assets/course.js","utf8");
 new vm.Script(courseJs,{filename:base+"/assets/course.js"});
 assert(courseJs.includes("window."+course.global+"?.weeks?.find(item=>item.week===week)?.quiz"),
  course.slug+" is not using authoritative curriculum quiz data");
 assert(courseJs.includes('if(scriptId==="quiz-data")'),"Quiz override missing");
 assert(courseJs.includes('const saved=save();syncBest();updateProgress();'),"Existing learner score-saving path changed");
 assert(courseJs.includes('record.best=Math.max(record.best||0,score)'),"Best-score preservation changed");
 const seen=new Set(),counts=[0,0,0,0],themes=new Set();
 for(let number=1;number<=36;number++){
  const item=curriculum.weeks[number-1];
  assert.equal(item.week,number);
  assert(Number.isInteger(item.unit)&&item.unit>=1&&item.unit<=12);
  assert.equal(item.lessons?.length,5,"Five daily instructional sections required");
  assert(item.reading?.trim().length>10,"Reading assignment absent");
  assert(item.writingTask?.trim().length>10,"Writing evidence absent");
  assert(item.vocabulary?.length>=3,"Vocabulary thin");
  assert.equal(item.quiz.length,5,"Five mastery quiz items required");
  const index=base+"/weeks/week-"+String(number).padStart(2,"0")+"/index.html";
  const html=fs.readFileSync(index,"utf8");
  assert(/data-quiz-form/.test(html),"Weekly quiz form missing: "+index);
  assert(/id="quiz-data"/.test(html),"Legacy offline-fallback quiz missing: "+index);
  assert(/assets\/curriculum-data\.js/.test(html),"Canonical curriculum not loaded: "+index);
  assert(html.indexOf("assets/curriculum-data.js")<html.indexOf("assets/course.js"),"Canonical data must load before quiz runtime: "+index);
  for(const day of ["monday","tuesday","wednesday","thursday","friday"]){
   assert(html.includes('id="'+day+'"'),"Missing weekly teaching day: "+index+" "+day);
  }
  for(let qn=0;qn<5;qn++){
   const q=item.quiz[qn];
   assert.equal(typeof q.question,"string");
   assert(q.question.length>=(qn>=3?18:8),"Question too short in "+course.slug+" week "+number+" Q"+(qn+1));
   assert.equal(q.choices.length,4,"Each question has four choices");
   assert.equal(new Set(q.choices.map(x=>x.trim().toLowerCase())).size,4,"Duplicate choices");
   assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,"Invalid answer");
   assert(q.explanation?.length>=12,"Insufficient answer explanation");
   if(qn>=3){
    assert(q.question.includes(item.title),"Revised quiz missing week-specific context "+index);
    assert(!/Which product provides the strongest evidence|Which product would provide the strongest evidence|Which revision priority most directly matches/i.test(q.question),"Recurring generic question survived");
    assert(!seen.has(q.question),"Repeated revised question "+index);
    seen.add(q.question);
    themes.add(q.skill);
   }
   counts[q.answer]++;checkedQuizItems++;
  }
  checkedWeeks++;
 }
 for(const [i,n] of counts.entries())assert(n>=26,course.slug+" answer position "+i+" scarcely used ("+n+")");
 assert.equal(seen.size,72,course.slug+" needs 72 distinct applied reasoning and revision prompts");
 rotations[course.slug]=counts;
}
const english9=JSON.parse(fs.readFileSync("courses/language-arts/english-9/curriculum.json","utf8"));
assert.equal(english9.weeks,36,"English 9 trajectory lost");
assert.equal(english9.units.length,12,"English 9 unit map lost");
assert.equal(english9.weekPlans.length,36,"English 9 weekly plans lost");
let isolated=0;
for(let n=1;n<=36;n++){
 const dir="courses/language-arts/english-9/weeks/week-"+String(n).padStart(2,"0");
 const listing=fs.readdirSync(dir);
 assert(listing.includes("index.html"),"English 9 week page missing: "+dir);
 if(n<=13){
  const daily=listing.filter(file=>file.endsWith(".html")&&file!=="index.html");
  assert(daily.length>=5,"Previously isolated English 9 week was reduced: "+dir);
  isolated+=daily.length;
 }
}
assert(isolated>=65,"Previously upgraded English 9 daily lessons not preserved");
assert.equal(checkedWeeks,108);
assert.equal(checkedQuizItems,540);
console.log("PASS: "+checkedWeeks+" English 10–12 weeks, "+checkedQuizItems+" checked quiz items, 216 distinct applied prompts, canonical/browser parity, balanced answer locations and preserved English 9 daily studios.");
console.log("Answer positions: "+JSON.stringify(rotations));
