import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const helper=fs.readFileSync("courses/shared/learner-scope-v1.js","utf8");
const ledgerSource=fs.readFileSync("courses/science/chemistry-11/inquiry-ledger.js","utf8");

function context(values=new Map(), learner="learner-a"){
  class MemoryStorage{
    constructor(){this.values=values}
    getItem(k){return this.values.get(String(k))??null}
    setItem(k,v){this.values.set(String(k),String(v))}
    removeItem(k){this.values.delete(String(k))}
    key(i){return [...this.values.keys()][i]??null}
    get length(){return this.values.size}
  }
  let profile=learner?{learnerId:learner,name:learner}:null;
  const storage=new MemoryStorage();
  const document={
    currentScript:{dataset:{learnerScope:"chemistry-11"}},
    readyState:"loading",
    addEventListener(){},
    getElementById(){return null},
    createElement(){return {style:{},append(){},appendChild(){},remove(){},setAttribute(){},addEventListener(){}}}
  };
  const c={
    Storage:MemoryStorage,
    localStorage:storage,
    window:{
      localStorage:storage,
      addEventListener(){},
      KhaemenesCourseEntryContract:{readAcademyProfile:()=>profile}
    },
    document,Date,JSON,console,setTimeout(){},requestAnimationFrame(){},
    MutationObserver:class{observe(){}},confirm(){return false},
    URL:{createObjectURL(){return "blob:test"},revokeObjectURL(){}},
    Blob:class{}
  };
  vm.createContext(c);
  vm.runInContext(helper,c,{filename:"learner-scope-v1.js",timeout:2000});
  return {c,storage,values,switchTo:id=>profile=id?{learnerId:id,name:id}:null};
}

let checks=0;
const inquiryKey="khaemenes-chemistry-11-v1:inquiry-ledger";
const weeklyKey="khae_high_science_evidence_v1:sci-chemistry-11-w23-thursday";

const values=new Map();
const a=context(values,"learner-a");
a.storage.setItem(inquiryKey,JSON.stringify([{week:23,day:"Thursday",minutes:50,inquiry:true,evidence:"calorimetry evidence"}]));
a.storage.setItem(weeklyKey,"A weekly evidence");
assert.ok(values.has(inquiryKey+":learner:learner-a"),"A inquiry ledger must be physically learner-scoped");checks++;
assert.ok(values.has(weeklyKey+":learner:learner-a"),"A weekly evidence must be physically learner-scoped");checks++;

const b=context(values,"learner-b");
assert.equal(b.storage.getItem(inquiryKey),null,"B must not see A inquiry ledger");checks++;
assert.equal(b.storage.getItem(weeklyKey),null,"B must not see A weekly evidence");checks++;
assert.equal(b.storage.getItem(inquiryKey+":learner:learner-a"),null,"B must not read A enumerated scoped ledger key");checks++;
assert.equal(b.storage.getItem(weeklyKey+":learner:learner-a"),null,"B must not read A enumerated weekly key");checks++;

b.storage.setItem(inquiryKey,JSON.stringify([{week:20,day:"Thursday",minutes:40,inquiry:true,evidence:"collision simulation"}]));
b.storage.setItem(weeklyKey,"B weekly evidence");
assert.match(values.get(inquiryKey+":learner:learner-a"),/calorimetry/,"B write must not mutate A ledger");checks++;
assert.equal(values.get(weeklyKey+":learner:learner-a"),"A weekly evidence","B write must not mutate A weekly evidence");checks++;
assert.match(values.get(inquiryKey+":learner:learner-b"),/collision simulation/,"B gets its own ledger");checks++;
assert.equal(values.get(weeklyKey+":learner:learner-b"),"B weekly evidence","B gets its own weekly evidence");checks++;

b.switchTo("learner-a");
assert.throws(()=>b.storage.setItem(inquiryKey,"stale overwrite"),"stale B tab must not write after active learner switch");checks++;
assert.throws(()=>b.storage.setItem(weeklyKey,"stale weekly overwrite"),"stale B tab must not write weekly evidence after active learner switch");checks++;

const freshA=context(values,"learner-a");
assert.match(freshA.storage.getItem(inquiryKey),/calorimetry/,"fresh A reload recovers A inquiry ledger");checks++;
assert.equal(freshA.storage.getItem(weeklyKey),"A weekly evidence","fresh A reload recovers A weekly evidence");checks++;

const legacyRaw='[{"week":1,"day":"Monday","minutes":90,"inquiry":true,"evidence":"legacy"}]';
const legacyMap=new Map([[inquiryKey,legacyRaw]]);
const legacyA=context(legacyMap,"learner-a");
assert.equal(legacyA.storage.getItem(inquiryKey),null,"unclaimed legacy ledger must not be auto-assigned");checks++;
assert.throws(()=>legacyA.storage.setItem(inquiryKey,"overwrite"),"unclaimed legacy ledger must block overwrite");checks++;
assert.equal(legacyMap.get(inquiryKey),legacyRaw,"legacy bytes must be preserved");checks++;
assert.equal(legacyA.c.window.KhaemenesLearnerScope.claimLegacy(inquiryKey),true,"explicit legacy claim should succeed");checks++;
assert.equal(legacyA.storage.getItem(inquiryKey),legacyRaw,"claimed learner recovers copied ledger");checks++;

const malformed='{"not":"an-array"}';
const malformedMap=new Map([[inquiryKey,malformed]]);
const malformedA=context(malformedMap,"learner-a");
assert.equal(malformedA.c.window.KhaemenesLearnerScope.claimLegacy(inquiryKey),true,"malformed preserved record may be explicitly assigned without changing bytes");checks++;
assert.equal(malformedA.storage.getItem(inquiryKey),malformed,"malformed preserved bytes remain intact for ledger validation to fail closed");checks++;

assert.ok(ledgerSource.includes("KhaemenesLearnerScope?.scopedKey?.(KEY)"),"ledger must explicitly resolve learner-scoped key");checks++;
assert.ok(ledgerSource.includes("if(!prior.ok)return false"),"ledger must lock saves after invalid preserved content");checks++;
assert.ok(ledgerSource.includes('reason:"invalid"'),"ledger must classify malformed content invalid");checks++;
assert.ok(ledgerSource.includes("initial&&learner()===initial"),"ledger must lock stale pages when active learner changes");checks++;

for(let week=1;week<=36;week++){
  const ws=String(week).padStart(2,"0");
  const html=fs.readFileSync(`courses/science/chemistry-11/weeks/week-${ws}/index.html`,"utf8");
  const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||"";
  assert.equal((head.match(/course-entry-contract\.js/g)||[]).length,1,`Week ${ws}: course-entry contract must load exactly once`);
  assert.equal((head.match(/learner-scope-v1\.js/g)||[]).length,1,`Week ${ws}: learner scope must load exactly once`);
  assert.ok(head.indexOf("course-entry-contract.js")<head.indexOf("learner-scope-v1.js"),`Week ${ws}: identity contract must load before learner scope`);
  assert.ok(html.includes(`data-evidence-key="sci-chemistry-11-w${ws}-`),`Week ${ws}: learner evidence keys must use Chemistry prefix`);
  checks+=4;
}

const ledgerHtml=fs.readFileSync("courses/science/chemistry-11/inquiry-ledger.html","utf8");
const ledgerHead=ledgerHtml.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]||"";
assert.ok(ledgerHead.indexOf("course-entry-contract.js")<ledgerHead.indexOf("learner-scope-v1.js"),"ledger identity contract must load before learner scope");checks++;
assert.ok(ledgerHtml.indexOf("inquiry-review-boundary.js")<ledgerHtml.indexOf("inquiry-ledger.js"),"review boundary must load before ledger app");checks++;

console.log(`PASS: Chemistry 11 fictional two-learner isolation regression (${checks} checks): inquiry ledger + weekly evidence separation, stale-tab denial, legacy preservation, malformed fail-closed evidence, and 36 weekly identity-load contracts.`);
