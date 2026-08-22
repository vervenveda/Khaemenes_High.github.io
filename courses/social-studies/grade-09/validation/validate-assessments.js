#!/usr/bin/env node
'use strict';

/* Grade 9 Global Studies Honors — Assessment Forensic Validator
   Run from grade-09/: node validation/validate-assessments.js
*/

const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const dataPath=path.join(ROOT,'data','course-data.json');
const data=JSON.parse(fs.readFileSync(dataPath,'utf8'));
const weeks=data.weeks||[];
const failures=[];
const warnings=[];
const prompts=new Map();
const ids=new Map();
const answerPositions=[0,0,0,0];
let objectiveCount=0, constructedCount=0;

function fail(msg){failures.push(msg)}
function warn(msg){warnings.push(msg)}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

if(weeks.length!==36) fail(`Expected 36 weeks; found ${weeks.length}.`);

for(const w of weeks){
  const q=w.quiz||{};
  const qs=Array.isArray(q.questions)?q.questions:[];
  if(qs.length!==10) fail(`Week ${w.week}: expected 10 objective questions; found ${qs.length}.`);
  if(!q.shortResponse?.prompt) fail(`Week ${w.week}: missing constructed-response prompt.`); else constructedCount++;
  if(Number(q.shortResponse?.points)!==5) warn(`Week ${w.week}: constructed response is not 5 points.`);
  if(Number(q.points)!==25) warn(`Week ${w.week}: quiz total is not declared as 25 points.`);

  qs.forEach((item,i)=>{
    objectiveCount++;
    if(!item.id) fail(`Week ${w.week} Q${i+1}: missing ID.`);
    else {
      if(ids.has(item.id)) fail(`Duplicate question ID ${item.id} in Weeks ${ids.get(item.id)} and ${w.week}.`);
      ids.set(item.id,w.week);
    }
    const p=norm(item.prompt);
    if(!p) fail(`Week ${w.week} Q${i+1}: empty prompt.`);
    else {
      if(prompts.has(p)) warn(`Duplicate objective prompt in Weeks ${prompts.get(p)} and ${w.week}: ${item.prompt}`);
      else prompts.set(p,w.week);
    }
    if(!Array.isArray(item.choices)||item.choices.length!==4) fail(`Week ${w.week} Q${i+1}: expected exactly 4 choices.`);
    if(!Number.isInteger(item.answer)||item.answer<0||item.answer>=item.choices?.length) fail(`Week ${w.week} Q${i+1}: invalid answer index ${item.answer}.`);
    else if(item.answer<4) answerPositions[item.answer]++;
    if(!String(item.explanation||'').trim()) fail(`Week ${w.week} Q${i+1}: missing explanation.`);

    const generic=/which statement best reflects the evidence and interpretation emphasized in week \d+/i.test(item.prompt||'');
    if(generic) warn(`Week ${w.week} Q${i+1}: generic generated stem detected.`);
  });

  const sr=norm(q.shortResponse?.prompt);
  if(sr && prompts.has('constructed:'+sr)) warn(`Week ${w.week}: duplicate constructed-response prompt.`);
  else if(sr) prompts.set('constructed:'+sr,w.week);
}

if(objectiveCount!==360) fail(`Expected 360 weekly objective questions; found ${objectiveCount}.`);
if(constructedCount!==36) fail(`Expected 36 constructed responses; found ${constructedCount}.`);

const totalAnswers=answerPositions.reduce((a,b)=>a+b,0);
if(totalAnswers){
  const expected=totalAnswers/4;
  answerPositions.forEach((count,i)=>{
    const deviation=Math.abs(count-expected)/expected;
    if(deviation>.30) warn(`Correct-answer position ${i} is imbalanced: ${count}/${totalAnswers} (${Math.round(count/totalAnswers*100)}%).`);
  });
}

const mastery=Number(data.metadata?.passingTarget);
if(mastery!==80) warn(`Canonical JSON passingTarget is ${mastery}; production mastery policy requires 80%. Regenerate canonical data when repair patches are consolidated.`);

const report={
  generated:new Date().toISOString(),
  weeks:weeks.length,
  objectiveQuestions:objectiveCount,
  constructedResponses:constructedCount,
  answerPositions,
  failures,
  warnings,
  result:failures.length?'FAIL':'PASS_WITH_WARNINGS'
};

const out=path.join(ROOT,'validation','assessment-validation-report.json');
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failures.length) process.exitCode=1;
