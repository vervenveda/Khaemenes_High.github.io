#!/usr/bin/env node
// Curriculum-only audit. No learner data, persistence, scoring, or source mutations.
// This is a diagnostic baseline, NOT a quality certification.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const args=new Set(process.argv.slice(2));
const subjects=['english-10','english-11','english-12'];
const reports=[];
const asWords=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
for(const subject of subjects){
 const p='courses/language-arts/'+subject+'/curriculum.json';
 const data=JSON.parse(fs.readFileSync(p,'utf8'));
 assert.equal(data.weeks.length,36,subject+' must retain 36 weeks');
 const diagnostics=[],seen=new Map();
 for(const w of data.weeks){
  assert.equal(w.lessons.length,5,subject+' week '+w.week+' lost a day');
  assert.equal(w.quiz.length,5,subject+' week '+w.week+' lost a quiz');
  for(let i=0;i<w.quiz.length;i++){
   const q=w.quiz[i];
   if(!String(q.skill||'').trim())diagnostics.push({week:w.week,question:i+1,code:'MISSING_SKILL_TAG'});
   if(/Which action best demonstrates mastery of Week/i.test(q.question))
    diagnostics.push({week:w.week,question:i+1,code:'GENERIC_WEEKLY_TRANSFER_PROMPT'});
   const key=String(q.question||'').toLowerCase().replace(/week\s*\d+/g,'week').replace(/\([^)]*\)/g,'').replace(/\s+/g,' ').trim();
   if(seen.has(key)&&!key.includes(w.title.toLowerCase()))
    diagnostics.push({week:w.week,question:i+1,code:'POTENTIAL_REUSED_STEM',earlierWeek:seen.get(key)});
   else seen.set(key,w.week);
  }
  for(let i=0;i<w.lessons.length;i++){
   const day=w.lessons[i];
   if(asWords(day.miniLesson)<30)diagnostics.push({week:w.week,day:i+1,code:'SHORT_MODELING_DESCRIPTION'});
   if(asWords(day.guidedPractice)<17)diagnostics.push({week:w.week,day:i+1,code:'SHORT_GUIDED_PRACTICE_DESCRIPTION'});
   if(!String(day.evidence||'').trim())diagnostics.push({week:w.week,day:i+1,code:'MISSING_EVIDENCE_DESCRIPTION'});
  }
 }
 const tally={};for(const d of diagnostics)tally[d.code]=(tally[d.code]||0)+1;
 reports.push({course:subject,weeks:data.weeks.length,dailyLessonPlans:data.weeks.length*5,weeklyQuizItems:data.weeks.length*5,findings:tally,
  examples:diagnostics.slice(0,15),diagnosticCount:diagnostics.length});
}
const total={weeks:reports.reduce((n,r)=>n+r.weeks,0),dailyLessonPlans:reports.reduce((n,r)=>n+r.dailyLessonPlans,0),
 quizItems:reports.reduce((n,r)=>n+r.weeklyQuizItems,0),genericPrompts:reports.reduce((n,r)=>n+(r.findings.GENERIC_WEEKLY_TRANSFER_PROMPT||0),0),
 missingSkillTags:reports.reduce((n,r)=>n+(r.findings.MISSING_SKILL_TAG||0),0)};
const report={schema:'khaemenes.ela-instructional-rigor-audit.v1',status:'DIAGNOSTIC_ONLY',note:'Pattern and length checks flag review candidates; human expert review must determine adequacy, standards validity, and cognitive demand.',total,courses:reports};
console.log(JSON.stringify(report,null,2));
if(args.has('--gate')&&(total.genericPrompts>0||total.missingSkillTags>0))process.exitCode=1;
