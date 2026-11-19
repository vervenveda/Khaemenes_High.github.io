#!/usr/bin/env node
"use strict";
/* Read-only audit: Grade 12 public formative transfer banks, no private assessment access or learner data. */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const base=path.join(root,"courses/social-studies/grade-12");
const landing=fs.readFileSync(path.join(base,"index.html"),"utf8");
const runtimeData=fs.readFileSync(path.join(base,"course-data.js"),"utf8");
const appJs=fs.readFileSync(path.join(base,"app.js"),"utf8");
const prefix="window.KHAEMENES_GRADE12_DATA = ";
assert(runtimeData.startsWith(prefix),"Runtime senior curriculum export missing");
assert(runtimeData.trimEnd().endsWith(";"),"Runtime senior curriculum export malformed");
const app=JSON.parse(runtimeData.slice(prefix.length).trim().replace(/;$/,""));

assert.equal(app.metadata.weeks,36);
assert.equal(app.weeks.length,36);
assert.equal(app.metadata.weeklyMastery,80);
assert.equal(app.metadata.passingOverall,80);
assert.equal(app.metadata.semesterMinimum,80);
assert.equal(app.metadata.finalMinimum,80);
assert.equal(app.metadata.thesisMinimum,80);
assert.equal(app.metadata.oralDefenseMinimum,80);
assert.equal(app.metadata.weeklyAssessmentBankVersion,"transfer-v3");

assert.match(appJs,/const COURSE=window\.KHAEMENES_GRADE12_DATA;/,"Active runtime does not consume canonical senior course export");
assert.doesNotMatch(landing,/const APP\s*=/,"Minimal senior landing re-embedded the retired curriculum payload");
assert.match(landing,/monte-carlo-assessment-v1\.js/,"Senior landing missing shared Monte Carlo engine");
assert.match(landing,/high-school-learning-context-v1\.js/,"Senior landing missing shared learning context");
assert.match(landing,/high-school-assessment-adapter-v1\.js/,"Senior landing missing shared assessment adapter");

let count=0;
for(let week=1;week<=36;week++){
  const w=app.weeks[week-1];
  assert.equal(w.week,week,"Week ordering mismatch "+week);
  const items=w.quiz?.questions;
  assert(Array.isArray(items),"Week "+week+" quiz bank missing");
  assert.equal(items.length,10,"Week "+week+" item count");
  assert.equal(w.quiz.bankVersion,"transfer-v3","Week "+week+" bank version");

  const keys=[0,0,0,0],skills=new Set(),questionTexts=new Set();
  for(const q of items){
    const idVersion=week>=17?3:2;
    assert.equal(q.id.startsWith("ss12-w"+String(week).padStart(2,"0")+"-transfer-v"+idVersion+"-"),true,"Unexpected item id "+q.id);
    assert.equal(q.version,week>=13?3:2,"Unexpected item version "+q.id);
    assert(["fictional-instructional-stimulus","primary-source-anchored"].includes(q.sourceType),"Unsupported source type "+q.id);

    if(week>=21&&week<=24){
      assert.equal(q.sourceRef,"docs/PRIMARY_SOURCE_DOSSIERS_21_24.md");
      assert(fs.existsSync(path.join(base,q.sourceRef)),"Missing dossier "+q.id);
    }
    if(week>=25&&week<=28){
      assert.equal(q.sourceRef,"docs/PRIMARY_SOURCE_DOSSIERS_25_28.md");
      assert(fs.existsSync(path.join(base,q.sourceRef)),"Missing dossier "+q.id);
    }
    if(week>=29&&week<=32){
      assert.equal(q.sourceRef,"docs/PRIMARY_SOURCE_DOSSIERS_29_32.md");
      assert(fs.existsSync(path.join(base,q.sourceRef)),"Missing dossier "+q.id);
    }
    if(week>=33){
      assert.equal(q.sourceRef,"docs/PRIMARY_SOURCE_DOSSIERS_33_36.md");
      assert(fs.existsSync(path.join(base,q.sourceRef)),"Missing dossier "+q.id);
    }

    assert.equal(q.options.length,4,"Option count "+q.id);
    assert.equal(new Set(q.options.map(x=>x.trim().toLowerCase())).size,4,"Duplicate choices "+q.id);
    if(week>=13&&week<=16){
      assert(q.options.every(x=>!/slogan without independent verification|number of institutions listed in a source|country's name rather than evidence/i.test(x)),
        "Generic distractor "+q.id);
    }
    assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,"Invalid answer index "+q.id);
    assert.equal(q.options[q.answer],q.explanation,"Answer/explanation mismatch "+q.id);
    assert(q.question.length>=80,"Insufficient stimulus "+q.id);
    assert(!questionTexts.has(q.question),"Duplicate question "+q.id);
    questionTexts.add(q.question);
    assert(typeof q.skill==="string"&&q.skill.trim(),"Missing skill "+q.id);
    skills.add(q.skill);
    keys[q.answer]++;
    count++;
  }
  assert(skills.size>=8,"Weak skill variety Week "+week);
  assert(keys.every(n=>n>=1),"Answer concentration Week "+week+" "+keys.join("/"));
  console.log("PASS Week "+week+": "+items.length+" items, "+skills.size+" skills, answer keys "+keys.join("/"));
}
assert.equal(count,360);
console.log("PASS SS12 "+count+" source-based items; external runtime curriculum; 80% mastery/graduation floors; shared assessment adapters present");
