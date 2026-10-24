#!/usr/bin/env node
"use strict";
/* Read-only audit: Grade 12 public formative transfer banks, no private assessment access. */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"courses/social-studies/grade-12/index.html"),"utf8");
const start=html.indexOf("const APP = "),end=html.indexOf(";\n",start);
assert(start>=0&&end>start,"Embedded senior curriculum missing");
const app=JSON.parse(html.slice(start+"const APP = ".length,end));
assert.equal(app.weeks.length,36);
assert.equal(app.passingTarget,80);
assert.match(html,/questions:\[\],storageKey:null,unavailable:true/);
assert.match(html,/if\(draw\.unavailable\|\|!draw\.opened\|\|!qs\.length\)return alert/);
let count=0;
for(let week=1;week<=16;week++){
  const items=app.weeks[week-1].quiz;
  assert.equal(items.length,10,"Week "+week+" item count");
  const keys=[0,0,0,0],skills=new Set(),questionTexts=new Set();
  for(const q of items){
    assert.equal(q.id.startsWith("ss12-w"+String(week).padStart(2,"0")+"-transfer-v2-"),true);
    assert.equal(q.version,week>=13?3:2);
    assert.equal(q.sourceType,"fictional-instructional-stimulus");
    assert.equal(q.choices.length,4);
    assert.equal(new Set(q.choices.map(x=>x.trim().toLowerCase())).size,4,"Duplicate choices "+q.id);
    if(week>=13){
      assert.equal(q.distractorReview,"discipline-specific","Unreviewed alternatives "+q.id);
      assert(q.choices.every(x=>!/slogan without independent verification|number of institutions listed in a source|country's name rather than evidence/i.test(x)),"Generic distractor "+q.id);
    }
    assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
    assert.equal(q.choices[q.answer],q.explain,"Answer mismatch "+q.id);
    assert(q.q.length>=80,"Insufficient stimulus "+q.id);
    assert(!questionTexts.has(q.q),"Duplicate question "+q.id);
    questionTexts.add(q.q);skills.add(q.skill);keys[q.answer]++;count++;
  }
  assert(skills.size>=8,"Weak skill variety Week "+week);
  assert(keys.every(n=>n>=1),"Answer concentration Week "+week);
  console.log("PASS Week "+week+": "+items.length+" items, "+skills.size+" skills, answer keys "+keys.join("/"));
}
console.log("PASS SS12 "+count+" source-based items; 80% gate; randomized-engine fail-closed");
