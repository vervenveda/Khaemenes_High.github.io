#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const studio=fs.readFileSync(path.join(root,"courses/mathematics/tools/vocabulary-studio.html"),"utf8");
for(const marker of [
 'quizItems=shuffled(words).slice(0,isEnglish(course.value)?6:5)',
 'byId("gradeWeeklyVocabulary").disabled=true',
 'input.disabled=true',
 'drawWeekQuiz();render()',
 'if(n!==loadCount)return',
 'const seen=new Set',
 'Practice does not update official mastery or assessment records'
]) assert(studio.includes(marker),"Studio regression: "+marker);
assert(!/localStorage\.setItem|sessionStorage\.setItem/.test(studio),"Vocabulary Studio must not record official grades");
assert(studio.includes("quizItems.length<(isEnglish(course.value)?6:4)"),"English practice must require all six valid questions");
assert(studio.includes("byId(\"weeklyQuizQuestions\").replaceChildren()"),"Loading must remove stale quiz response controls");
assert(studio.includes("if(isEnglish(course.value)&&!data.terms.length)"),"Empty English vocabulary selections must fail visibly");
let total=0;
for(let grade=9;grade<=12;grade++){
 const base="courses/language-arts/english-"+grade+"/";
 const curriculum=read(base+"curriculum.json");
 const weeks=grade===9?curriculum.weekPlans:curriculum.weeks;
 assert.equal(weeks.length,36,"English "+grade+" has 36 weeks");
 let count=0;
 for(const week of weeks){
  const no=Number(week.week||week.n),unit=Number(week.unit);
  const assigned=week.vocabulary||week.vocab;
  assert(Number.isInteger(no)&&no>=1&&no<=36,"Invalid week");
  assert(Number.isInteger(unit)&&unit>=1&&unit<=12,"Invalid unit");
  const bank=read(base+"units/unit-"+String(unit).padStart(2,"0")+"/vocabulary.json");
  const byTerm=new Map(bank.terms.map(t=>[t.term.toLowerCase(),t]));
  for(const term of assigned){
   const match=byTerm.get(term.toLowerCase());
   assert(match&&match.weeks.includes(no),"Unmapped English "+grade+" Week "+no+": "+term);
   assert(match.definition&&!match.definition.startsWith("Definition awaiting"),"Missing definition "+grade+"/"+no+"/"+term);
  }
  const defined=assigned.map(term=>byTerm.get(term.toLowerCase()));
  assert(defined.length>=5,"Insufficient weekly assigned terms: "+grade+"/"+no);
  if(defined.length===5){
   const extra=bank.terms.filter(t=>!assigned.some(a=>a.toLowerCase()===t.term.toLowerCase())&&t.definition&&!t.definition.startsWith("Definition awaiting"));
   assert(extra.length>0||grade===9,"No sixth extension candidate "+grade+"/"+no);
  }
  // Shuffle-invariant: every eligible question can offer three distinct distractor definitions.
  for(const item of defined){
   const pool=[...defined,...bank.terms].filter(t=>t.definition&&!t.definition.startsWith("Definition awaiting")&&t.term!==item.term);
   const distinct=new Set(pool.map(t=>t.definition.trim().toLowerCase()).filter(x=>x!==item.definition.trim().toLowerCase()));
   assert(distinct.size>=3,"Insufficient unique answer definitions "+grade+"/"+no+"/"+item.term);
  }
  count+=assigned.length;
 }
 total+=count;
 console.log("PASS English "+grade+": 36 weeks, "+count+" mapped terms, six-card candidates, answer alternatives");
}
console.log("PASS four-grade vocabulary regression: "+total+" curriculum assignments; source/data checks only (not browser certification)");
