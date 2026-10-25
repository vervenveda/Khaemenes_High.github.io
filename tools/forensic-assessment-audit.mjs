#!/usr/bin/env node
"use strict";

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const args=new Set(process.argv.slice(2));
const jsonOnly=args.has("--json");
const strictWarnings=args.has("--strict-warnings");

const report={
  schema:"khaemenes.forensic-assessment.v1",
  generatedAt:new Date().toISOString(),
  scope:[
    "Grade 12 Social Studies weekly transfer assessments",
    "English 10–12 weekly passage/source anchors",
    "Algebra I dedicated/runtime banks, shared late-unit bank, option balance, fresh retakes and selected-answer evidence",
    "Biology 10 / Chemistry 11 / Physics & Engineering 12 public banks and secure assessment blueprints"
  ],
  areas:[],
  findings:[],
  totals:{auditedObjectiveItems:0,exactDuplicateItems:0,itemsWithExplanations:0,fourOptionItems:0,validAnswerItems:0,itemsWithPerDistractorRationales:0,itemsWithReviewedMisconceptionMap:0,structuredDistractorRationales:0}
};

function read(rel){return fs.readFileSync(path.join(ROOT,rel),"utf8")}
function readJSON(rel){return JSON.parse(read(rel))}
function loadWindowBank(rel){
  const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read(rel),ctx,{filename:rel});
  const keys=Object.keys(ctx.window);
  if(keys.length!==1)throw new Error(`${rel}: expected exactly one exported window bank; found ${keys.length}`);
  const bank=ctx.window[keys[0]];
  if(!Array.isArray(bank))throw new Error(`${rel}: exported value is not an array`);
  return bank;
}
function norm(v){return String(v??"").normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim()}
function templateKey(v){
  return norm(v)
    .replace(/[“"][^”"]+[”"]/g,"<quote>")
    .replace(/\bweek\s*\d+\b/g,"week <n>")
    .replace(/\bunit\s*\d+\b/g,"unit <n>")
    .replace(/\b\d+(?:\.\d+)?%?\b/g,"<n>")
    .replace(/[^\p{L}\p{N}<>]+/gu," ")
    .replace(/\s+/g," ")
    .trim();
}
function pct(n,d){return d?Number((100*n/d).toFixed(1)):0}
function itemMetrics(items,accumulate=true){
  const exact=new Map(),templates=new Map();
  let explanations=0,four=0,uniqueOptions=0,validAnswers=0,perDistractor=0;
  const positions=[0,0,0,0];
  for(const q of items){
    const prompt=q.prompt??q.question??q.q??"";
    const options=q.options??q.choices??[];
    const answer=Number(q.answer);
    const explanation=q.explanation??q.explain??"";
    exact.set(norm(prompt),(exact.get(norm(prompt))||0)+1);
    templates.set(templateKey(prompt),(templates.get(templateKey(prompt))||0)+1);
    if(String(explanation).trim())explanations++;
    if(Array.isArray(options)&&options.length===4)four++;
    if(Array.isArray(options)&&new Set(options.map(norm)).size===options.length)uniqueOptions++;
    if(Number.isInteger(answer)&&Array.isArray(options)&&answer>=0&&answer<options.length){
      validAnswers++;if(answer<4)positions[answer]++;
    }
    const rationales=q.distractorRationales??q.distractor_rationales??q.optionRationales??q.option_rationales;
    if(Array.isArray(rationales)&&rationales.length>=3)perDistractor++;
  }
  const exactDuplicateItems=[...exact.values()].reduce((n,c)=>n+(c>1?c:0),0);
  const templateClusterItems=[...templates.values()].reduce((n,c)=>n+(c>1?c:0),0);
  const out={
    items:items.length,
    exactDuplicateItems,
    exactDuplicatePct:pct(exactDuplicateItems,items.length),
    templateClusterItems,
    templateClusterPct:pct(templateClusterItems,items.length),
    explanationCoveragePct:pct(explanations,items.length),
    fourOptionCoveragePct:pct(four,items.length),
    uniqueOptionCoveragePct:pct(uniqueOptions,items.length),
    validAnswerCoveragePct:pct(validAnswers,items.length),
    perDistractorRationaleCoveragePct:pct(perDistractor,items.length),
    authoredAnswerPositions:positions
  };
  if(accumulate){
    report.totals.auditedObjectiveItems+=items.length;
    report.totals.exactDuplicateItems+=exactDuplicateItems;
    report.totals.itemsWithExplanations+=explanations;
    report.totals.fourOptionItems+=four;
    report.totals.validAnswerItems+=validAnswers;
    report.totals.itemsWithPerDistractorRationales+=perDistractor;
  }
  return out;
}
function misconceptionMapMetrics(mapRel,bank,accumulate=true){
  const map=readJSON(mapRel),byId=new Map(bank.map(q=>[String(q.id),q])),issues=[];
  const entries=Object.values(map.items||{});let distractorRationales=0;
  for(const rec of entries){
    const q=byId.get(String(rec.itemId));
    if(!q){issues.push(`${rec.itemId}: mapped item missing from bank`);continue}
    if(rec.reviewStatus!=="reviewed-v1")issues.push(`${rec.itemId}: reviewStatus is not reviewed-v1`);
    if(rec.prompt!==q.prompt)issues.push(`${rec.itemId}: prompt drift`);
    if(Number(rec.answerIndex)!==Number(q.answer))issues.push(`${rec.itemId}: answer-key drift`);
    if(rec.correctRationale!==q.explanation)issues.push(`${rec.itemId}: correct-rationale drift`);
    const ds=Array.isArray(rec.distractors)?rec.distractors:[];
    distractorRationales+=ds.length;
    const expected=q.options.map((_,i)=>i).filter(i=>i!==q.answer).sort((a,b)=>a-b);
    const actual=ds.map(d=>Number(d.optionIndex)).sort((a,b)=>a-b);
    if(JSON.stringify(expected)!==JSON.stringify(actual))issues.push(`${rec.itemId}: incomplete distractor-index coverage`);
    for(const d of ds){
      const i=Number(d.optionIndex);
      if(q.options[i]!==d.optionText)issues.push(`${rec.itemId} option ${i}: option-text drift`);
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(d.misconceptionTag||"")))issues.push(`${rec.itemId} option ${i}: invalid misconception tag`);
      if(String(d.rationale||"").trim().length<24)issues.push(`${rec.itemId} option ${i}: rationale too thin`);
    }
  }
  if(accumulate){
    report.totals.itemsWithReviewedMisconceptionMap+=entries.length;
    report.totals.structuredDistractorRationales+=distractorRationales;
  }
  return {
    schema:map.schema,
    reviewedItems:entries.length,
    distractorRationales,
    bankItems:bank.length,
    reviewedItemPct:pct(entries.length,bank.length),
    issues
  };
}
function addFinding(area,id,status,detail,metrics={}){
  const finding={area,id,status,detail,metrics};
  report.findings.push(finding);
  return finding;
}
function area(name,summary,metrics,checks){
  const statuses=checks.map(x=>x.status);
  const status=statuses.includes("FAIL")?"FAIL":statuses.includes("WARN")?"WARN":"PASS";
  const row={name,status,summary,metrics,checks};
  report.areas.push(row);return row;
}
function statusCounts(){return report.findings.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{})}

/* Shared Monte Carlo authority: first-party public/formative engine. */
const mc=read("courses/shared/monte-carlo-assessment-v1.js");
const mcBalanced=mc.includes("function balancedOptionOrders")&&mc.includes("optionOrders=balancedOptionOrders(chosen)")&&mc.includes("answer=order.indexOf(q.answer)");

/* 1. Grade 12 Social Studies */
{
  const data=readJSON("courses/social-studies/grade-12/data/course-data.json");
  const items=[],weeks=[];
  const transferSkill=/source|data|map|case|legal|quant|corrobor|causal|method|compar|provenance|revision|evidence|measurement|institution|implementation|rights|policy|research|synthesis|defense|ethical|historical/i;
  for(const w of data.weeks||[]){
    const quiz=w.quiz||{},qs=Array.isArray(quiz)?quiz:(quiz.questions||[]);
    items.push(...qs);
    const vocabulary=qs.filter(q=>/^Which definition/i.test(q.question||"")||/vocab|definition/i.test(q.skill||"")).length;
    const transfer=qs.filter(q=>Boolean(q.sourceType)||transferSkill.test(q.skill||"")).length;
    weeks.push({week:Number(w.week),count:qs.length,vocabulary,transfer,bankVersion:quiz.bankVersion||null});
  }
  const m=itemMetrics(items),checks=[];
  checks.push(addFinding("Social Studies 12","ss12-week-bank-contract",
    weeks.length===36&&weeks.every(w=>w.count===10&&w.bankVersion==="transfer-v3")?"PASS":"FAIL",
    `${weeks.filter(w=>w.count===10&&w.bankVersion==="transfer-v3").length}/36 weekly banks contain 10 items and transfer-v3 metadata.`));
  checks.push(addFinding("Social Studies 12","ss12-cognitive-transfer",
    weeks.every(w=>w.vocabulary<=2&&w.transfer>=5)?"PASS":"FAIL",
    `Worst weekly bank: max stand-alone vocabulary ${Math.max(...weeks.map(w=>w.vocabulary))}/10; minimum transfer/source/data/case items ${Math.min(...weeks.map(w=>w.transfer))}/10.`,
    {maxVocabularyPerWeek:Math.max(...weeks.map(w=>w.vocabulary)),minTransferPerWeek:Math.min(...weeks.map(w=>w.transfer))}));
  checks.push(addFinding("Social Studies 12","ss12-item-integrity",
    m.exactDuplicateItems===0&&m.explanationCoveragePct===100&&m.fourOptionCoveragePct===100&&m.validAnswerCoveragePct===100?"PASS":"FAIL",
    `Exact duplicate prompts ${m.exactDuplicateItems}; explanations ${m.explanationCoveragePct}%; four-option contract ${m.fourOptionCoveragePct}%; valid answers ${m.validAnswerCoveragePct}%.`,m));
  area("Social Studies 12","Senior weekly assessment transfer and source/data reasoning.",m,checks);
}

/* 2. English 10–12 */
{
  const all=[],gradeMetrics={},checks=[];
  let anchors=0,weeks=0,runtimeGuarantees=0,versionedIdCourses=0;
  for(const grade of [10,11,12]){
    const bank=readJSON(`courses/language-arts/english-${grade}/assets/quiz-specific-bank.json`);
    const course=read(`courses/language-arts/english-${grade}/assets/course.js`);
    const rows=bank.rows||[];weeks+=rows.length;
    anchors+=rows.filter(r=>r?.[0]?.[4]?.anchor===true&&r?.[0]?.[4]?.anchorType==="passage-or-source").length;
    if(course.includes('sourceQuotas:supplemental.some(q=>q.source==="passage-anchor")?{"passage-anchor":1}:null'))runtimeGuarantees++;
    if(course.includes("supplementalVersion"))versionedIdCourses++;
    const items=rows.flat().map(r=>({question:r?.[0],options:r?.[1],answer:0,explanation:r?.[2],skill:r?.[3],meta:r?.[4]}));
    all.push(...items);gradeMetrics[grade]={version:bank.version,weeks:rows.length,anchors:rows.filter(r=>r?.[0]?.[4]?.anchor===true).length,items:items.length};
    checks.push(addFinding(`English ${grade}`,`english-${grade}-anchor-bank`,
      bank.version==="v4-passage-anchored"&&rows.length===36&&rows.every(r=>r?.[0]?.[4]?.anchor===true&&r?.[0]?.[4]?.anchorType==="passage-or-source")?"PASS":"FAIL",
      `English ${grade}: ${rows.filter(r=>r?.[0]?.[4]?.anchor===true).length}/36 weekly passage/source anchors; bank ${bank.version}.`));
  }
  const m=itemMetrics(all);
  checks.push(addFinding("English 10–12","english-runtime-anchor-quota",
    runtimeGuarantees===3?"PASS":"FAIL",
    `${runtimeGuarantees}/3 course runtimes require at least one passage-anchor item in the randomized weekly form.`));
  checks.push(addFinding("English 10–12","english-versioned-active-form-protection",
    versionedIdCourses===3?"PASS":"FAIL",
    `${versionedIdCourses}/3 runtimes scope supplemental item IDs to the bank version.`));
  checks.push(addFinding("English 10–12","english-option-remap-authority",
    mcBalanced?"PASS":"FAIL",
    "Raw supplemental rows encode the keyed response first, but the shared Monte Carlo authority constructs balanced option orders and remaps the keyed answer before display."));
  checks.push(addFinding("English 10–12","english-item-integrity",
    m.exactDuplicateItems===0&&m.explanationCoveragePct===100&&m.fourOptionCoveragePct===100&&m.validAnswerCoveragePct===100?"PASS":"FAIL",
    `Across ${m.items} supplemental items: exact duplicate prompts ${m.exactDuplicateItems}; explanations ${m.explanationCoveragePct}%; four-option contract ${m.fourOptionCoveragePct}%.`,m));
  area("English 10–12",`${anchors}/${weeks} weeks carry a designated passage/source anchor, with one guaranteed in each randomized weekly form.`,{...m,gradeMetrics,weeklyAnchors:anchors,weeklyRows:weeks},checks);
}

/* 3. Algebra I */
{
  const bank=loadWindowBank("courses/mathematics/algebra-1/assets/question-bank.js");
  const core=read("courses/mathematics/algebra-1/assets/unit-page-core.js");
  const loader=read("courses/mathematics/algebra-1/assets/unit-page.js");
  const by=new Map();
  for(const q of bank){const k=`${q.unit}:${q.lesson}`;if(!by.has(k))by.set(k,[]);by.get(k).push(q)}
  const m=itemMetrics(bank),dq=misconceptionMapMetrics("courses/mathematics/algebra-1/assets/assessment-misconceptions-v1.json",bank),contractFailures=[];
  for(const [lesson,items] of by){
    if(items.length!==5)contractFailures.push(`${lesson}: ${items.length} items`);
    for(const q of items)if(!Array.isArray(q.options)||q.options.length!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||q.options[q.answer]!==q.answer_text)contractFailures.push(`${q.id}: answer contract`);
  }
  const balanced=core.includes("const correctPositions=shuffle(selection.map((_,i)=>i%4));");
  const marked=core.includes('group.dataset.balancedOptionOrder="true"');
  const protectedDom=loader.includes('if(group.dataset.balancedOptionOrder==="true")return;');

  const dedicated=[],runtimeIssues=[],dedicatedIds=new Set(),authoredDedicatedPositions=[0,0,0,0];
  let dedicatedLessons=0,alignedLessons=0,alignedAlternates=0,runtimeProtectedUnits=0,snapshotUnits=0;
  for(let unit=1;unit<=9;unit++){
    const u=String(unit).padStart(2,"0");
    const rel=`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-data.js`;
    const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read(rel),ctx,{filename:rel});
    const keys=Object.keys(ctx.window),data=ctx.window[keys[0]]||{},questions=Array.isArray(data.questions)?data.questions:[],lessons=Array.isArray(data.lessons)?data.lessons:[];
    dedicated.push(...questions);dedicatedLessons+=lessons.length;
    for(const q of questions){
      if(q.id)dedicatedIds.add(q.id);
      if(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4)authoredDedicatedPositions[q.answer]++;
    }
    for(const lesson of lessons){
      const rows=questions.filter(q=>Number(q.lesson)===Number(lesson.number));
      if(rows.length!==10)runtimeIssues.push(`Unit ${u} lesson ${lesson.number}: ${rows.length} dedicated questions`);
      if(unit>=2){
        const alt=bank.filter(q=>Number(q.unit)===unit&&Number(q.lesson)===Number(lesson.number));
        if(alt.length===5){alignedLessons++;alignedAlternates+=alt.length}else runtimeIssues.push(`Unit ${u} lesson ${lesson.number}: ${alt.length} aligned alternate items`);
        if(rows.length+alt.length!==15)runtimeIssues.push(`Unit ${u} lesson ${lesson.number}: runtime pool ${rows.length+alt.length}, expected 15`);
      }
    }
    if(unit===1){
      const u1=read("courses/mathematics/algebra-1/units/unit-01/assets/unit01.js");
      if(!u1.includes('chosen.length>10')||!u1.includes('chosen.slice(0,10)')||u1.includes('chosen.slice(0,8)'))runtimeIssues.push("Unit 01 lesson runtime is not on the 10-question contract");
    }else{
      const unitCore=read(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-core.js`);
      const unitLoader=read(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}.js`);
      const protectedForm=["function balanceOptions","supplementalCount",'_formSource:"aligned-alternate"',"fresh();"].every(x=>unitCore.includes(x))
        &&unitLoader.includes("../../../assets/question-bank.js")
        &&unitLoader.includes("Array.isArray(window.ALGEBRA1_QUESTIONS)");
      if(protectedForm)runtimeProtectedUnits++;else runtimeIssues.push(`Unit ${u}: balanced/fresh-form runtime contract incomplete`);
      const snapshot=["answerSnapshot:snapshots","selectedOriginalIndex","correctOriginalIndex",'formVersion:"algebra1-runtime-balanced-v2"'].every(x=>unitCore.includes(x));
      if(snapshot)snapshotUnits++;else runtimeIssues.push(`Unit ${u}: selected-answer snapshot contract incomplete`);
    }
  }
  const dm=itemMetrics(dedicated,false);
  const dedicatedMapped=[...dedicatedIds].filter(id=>Object.prototype.hasOwnProperty.call(readJSON("courses/mathematics/algebra-1/assets/assessment-misconceptions-v1.json").items||{},id)).length;
  const checks=[];
  checks.push(addFinding("Algebra I","algebra1-shared-bank-contract",
    by.size===87&&bank.length===435&&contractFailures.length===0?"PASS":"FAIL",
    `Shared bank: ${by.size} lessons / ${bank.length} items; answer-contract failures ${contractFailures.length}.`));
  checks.push(addFinding("Algebra I","algebra1-shared-late-unit-first-form-balance",
    balanced&&marked&&protectedDom?"PASS":"FAIL",
    "The shared late-unit renderer balances learner-visible answer positions and preserves mapped correctness."));
  checks.push(addFinding("Algebra I","algebra1-runtime-dedicated-bank-contract",
    dedicated.length===610&&dedicatedLessons===61&&runtimeIssues.filter(x=>/dedicated questions/.test(x)).length===0?"PASS":"FAIL",
    `Runtime-authoritative Units 01–09: ${dedicated.length} dedicated items across ${dedicatedLessons} lessons; every lesson is required to expose 10 authored questions. Authored answer positions remain diagnostic only: ${authoredDedicatedPositions.join("/")}.`,
    {items:dedicated.length,lessons:dedicatedLessons,authoredAnswerPositions:authoredDedicatedPositions,metrics:dm}));
  checks.push(addFinding("Algebra I","algebra1-runtime-first-form-balance",
    runtimeProtectedUnits===8?"PASS":"FAIL",
    `${runtimeProtectedUnits}/8 dedicated Unit 02–09 cores now construct balanced learner-visible option positions on first render and retakes; stored authored bank order is unchanged.`));
  checks.push(addFinding("Algebra I","algebra1-runtime-fresh-retake-pools",
    alignedLessons===55&&alignedAlternates===275&&runtimeIssues.filter(x=>/aligned alternate|runtime pool/.test(x)).length===0?"PASS":"FAIL",
    `${alignedLessons}/55 Unit 02–09 lessons have a 15-item aligned runtime pool: 10 dedicated questions plus 5 shared alternate questions. Retakes draw 5 aligned alternates plus 5 dedicated items rather than merely moving the same option labels.`,
    {alignedLessons,alignedAlternates,poolPerLesson:15}));
  checks.push(addFinding("Algebra I","algebra1-runtime-answer-snapshots",
    snapshotUnits===8?"PASS":"FAIL",
    `${snapshotUnits}/8 Unit 02–09 cores save versioned immutable answer snapshots containing selected/correct delivered indexes and original-option indexes for future misconception analysis.`));
  checks.push(addFinding("Algebra I","algebra1-runtime-offline-alternate-bank",
    read("courses/mathematics/algebra-1/service-worker.js").includes("assets/question-bank.js")&&read("courses/mathematics/algebra-1/service-worker-precache-v1.js").includes("assets/question-bank.js")?"PASS":"FAIL",
    "The aligned alternate bank is included in both Algebra I offline cache manifests."));
  checks.push(addFinding("Algebra I","algebra1-misconception-map-v1-shared-bank",
    dq.issues.length===0&&dq.reviewedItems===271&&dq.distractorRationales===813?"PASS":"FAIL",
    `${dq.reviewedItems}/${dq.bankItems} shared-bank items are reviewed in the v1 companion map with ${dq.distractorRationales} explicit distractor rationales. Drift issues: ${dq.issues.length}.`,dq));
  checks.push(addFinding("Algebra I","algebra1-dedicated-misconception-coverage",
    dedicatedMapped===dedicated.length?"PASS":"WARN",
    `${dedicatedMapped}/${dedicated.length} runtime-authoritative dedicated Unit 01–09 item IDs currently have direct misconception-map entries. The forensic blind spot is repaired because this coverage is now reported explicitly rather than being inferred from the shared bank.`,
    {mapped:dedicatedMapped,total:dedicated.length,coveragePct:pct(dedicatedMapped,dedicated.length)}));
  checks.push(addFinding("Algebra I","algebra1-prompt-diversity",
    m.exactDuplicateItems===0?"PASS":"FAIL",
    `Shared-bank exact duplicate prompts: ${m.exactDuplicateItems}. Template-similarity signal: ${m.templateClusterPct}% (diagnostic only; repeated mathematical structures are not automatically defects).`,m));
  if(runtimeIssues.length)checks.push(addFinding("Algebra I","algebra1-runtime-contract-regressions","FAIL",runtimeIssues.join("; "),{issues:runtimeIssues}));
  area("Algebra I",
    `Runtime-aware certification now distinguishes 610 dedicated Units 01–09 items from the 435-item shared bank; Unit 02–09 retakes use 55 aligned 15-item lesson pools and preserve selected-answer evidence.`,
    {...m,misconceptionMap:dq,sharedBankItems:bank.length,dedicatedRuntimeItems:dedicated.length,dedicatedLessons,alignedAlternateItems:alignedAlternates,dedicatedAuthoredAnswerPositions:authoredDedicatedPositions,dedicatedMisconceptionCoveragePct:pct(dedicatedMapped,dedicated.length)},
    checks);
}

/* 4. Upper science */
{
  const courses=[
    ["Biology 10","biology-10","courses/science/biology-10/question-bank.js"],
    ["Chemistry 11","chemistry-11","courses/science/chemistry-11/question-bank.js"],
    ["Physics & Engineering 12","physics-engineering-12","courses/science/physics-engineering-12/question-bank.js"]
  ];
  const transferTypes=new Set(["evidence","quantitative","model","application","method","design"]);
  const combined=[],courseMetrics={},checks=[];
  let ordinaryPassing=0,ordinaryTotal=0,blueprints=0,publicMonteCarlo=0;
  for(const [label,slug,bankPath] of courses){
    const bank=loadWindowBank(bankPath);combined.push(...bank);
    const map=readJSON(`courses/science/${slug}/course-map.json`);
    const blueprint=read(`courses/science/${slug}/assessments/SECURE_ASSESSMENT_BLUEPRINT.md`);
    const index=read(`courses/science/${slug}/index.html`);
    const missing=[];
    for(let week=1;week<=36;week++){
      if(week===18||week===36)continue;ordinaryTotal++;
      const qs=bank.filter(q=>Number(q.week)===week);
      if(qs.length&&qs.some(q=>transferTypes.has(String(q.type||"").toLowerCase())))ordinaryPassing++;else missing.push(week);
    }
    const m=itemMetrics(bank);
    const dq=slug==="chemistry-11"?misconceptionMapMetrics("courses/science/chemistry-11/assessment-misconceptions-v1.json",bank):null;
    courseMetrics[slug]={items:bank.length,missingTransferWeeks:missing,metrics:m,...(dq?{misconceptionMap:dq}:{})};
    const blueprintOkay=["80% mastery floor","Midterm · Week 18","Final · Week 36","Must remain protected","novel phenomenon"].every(x=>blueprint.includes(x))
      &&index.includes("SECURE_ASSESSMENT_BLUEPRINT.md")
      &&Number(map.assessment?.mastery_target)===80
      &&/15-item/i.test(map.assessment?.midterm||"")
      &&/30-item/i.test(map.assessment?.final||"");
    if(blueprintOkay)blueprints++;
    const usesMC=index.includes("KhaeMonteCarloAssessment")&&index.includes(".openSession(")&&index.includes(".materialize(");
    if(usesMC)publicMonteCarlo++;
    checks.push(addFinding(label,`${slug}-ordinary-week-transfer`,
      missing.length===0?"PASS":"FAIL",
      `${34-missing.length}/34 ordinary instructional weeks contain at least one evidence/quantitative/model/application/method/design item.`,{missingWeeks:missing}));
    checks.push(addFinding(label,`${slug}-secure-blueprint`,
      blueprintOkay?"PASS":"FAIL",
      "Public cognitive blueprint documents the 80% mastery boundary, Week 18/36 cumulative checkpoints, and protected-item boundary without publishing confidential items."));
    checks.push(addFinding(label,`${slug}-public-practice-option-remap`,
      usesMC&&mcBalanced?"PASS":"FAIL",
      `Authored answer positions are diagnostic only for public Monte Carlo practice: ${m.authoredAnswerPositions.join("/")}. The shared engine materializes a balanced option order and remaps the answer before display.`));
    if(dq)checks.push(addFinding(label,"chemistry-11-misconception-map-v1",
      dq.issues.length===0&&dq.reviewedItems===339&&dq.distractorRationales===1017?"PASS":"FAIL",
      `${dq.reviewedItems}/${dq.bankItems} Chemistry items are reviewed in the v1 companion map with ${dq.distractorRationales} explicit distractor rationales spanning the the complete 339-item public Chemistry bank. Drift issues: ${dq.issues.length}.`,dq));
  }
  const m=itemMetrics(combined,false);
  area("Upper Science",`${ordinaryPassing}/${ordinaryTotal} ordinary instructional weeks satisfy the transfer-item requirement; ${blueprints}/3 secure blueprints are linked and bounded.`,{...m,courseMetrics,ordinaryWeeksPassing:ordinaryPassing,ordinaryWeeksTotal:ordinaryTotal,blueprintsPassing:blueprints,publicMonteCarloCourses:publicMonteCarlo},checks);
}

/* Cross-system forensic checks */
{
  const checks=[];
  const t=report.totals;
  checks.push(addFinding("Academy-wide","cross-exact-duplicate-bank-prompts",
    t.exactDuplicateItems===0?"PASS":"WARN",
    `Within each audited bank, exact duplicate prompt instances total ${t.exactDuplicateItems}.`));
  checks.push(addFinding("Academy-wide","cross-explanation-coverage",
    t.itemsWithExplanations===t.auditedObjectiveItems?"PASS":"WARN",
    `${t.itemsWithExplanations}/${t.auditedObjectiveItems} audited objective items include an item-level explanation.`));
  checks.push(addFinding("Academy-wide","cross-four-option-valid-answer-contract",
    t.fourOptionItems===t.auditedObjectiveItems&&t.validAnswerItems===t.auditedObjectiveItems?"PASS":"FAIL",
    `${t.fourOptionItems}/${t.auditedObjectiveItems} items have four options; ${t.validAnswerItems}/${t.auditedObjectiveItems} have a valid keyed answer.`));
  checks.push(addFinding("Academy-wide","cross-distractor-rationale-metadata",
    t.itemsWithReviewedMisconceptionMap===t.auditedObjectiveItems?"PASS":"WARN",
    `${t.itemsWithReviewedMisconceptionMap}/${t.auditedObjectiveItems} audited items now have reviewed misconception maps containing ${t.structuredDistractorRationales} explicit distractor rationales. Coverage is intentionally staged under Distractor Quality & Misconception Mapping v1.`,
    {reviewedItems:t.itemsWithReviewedMisconceptionMap,auditedItems:t.auditedObjectiveItems,structuredDistractorRationales:t.structuredDistractorRationales,coveragePct:pct(t.itemsWithReviewedMisconceptionMap,t.auditedObjectiveItems)}));
  checks.push(addFinding("Academy-wide","cross-security-boundary",
    report.findings.filter(x=>x.id.endsWith("-secure-blueprint")).every(x=>x.status==="PASS")?"PASS":"FAIL",
    "Public science certification describes cognitive design without requiring protected prompts, keys, form seeds, authentication material, reviewer notes, or private learner records."));
  area("Academy-wide contract","Shared item integrity, rationale metadata and public/private assessment boundaries.",{
    auditedObjectiveItems:t.auditedObjectiveItems,
    explanationCoveragePct:pct(t.itemsWithExplanations,t.auditedObjectiveItems),
    fourOptionCoveragePct:pct(t.fourOptionItems,t.auditedObjectiveItems),
    validAnswerCoveragePct:pct(t.validAnswerItems,t.auditedObjectiveItems),
    perDistractorRationaleCoveragePct:pct(t.itemsWithReviewedMisconceptionMap,t.auditedObjectiveItems),
    reviewedMisconceptionItems:t.itemsWithReviewedMisconceptionMap,
    structuredDistractorRationales:t.structuredDistractorRationales
  },checks);
}

report.statusCounts=statusCounts();
report.overallStatus=(report.statusCounts.FAIL||0)>0?"FAIL":(report.statusCounts.WARN||0)>0?"PASS_WITH_WARNINGS":"PASS";
report.certificationBoundary="This public-repository forensic assessment certifies public banks, runtime contracts, mappings, metadata, and published secure-assessment blueprints. It does not inspect confidential supervised midterm/final items that are intentionally outside the public repository.";

function markdown(){
  const lines=[
    "# Khaemenes High · Consolidated Forensic Assessment",
    "",
    `**Overall:** ${report.overallStatus}`,
    `**Audited objective items:** ${report.totals.auditedObjectiveItems}`,
    `**Findings:** PASS ${report.statusCounts.PASS||0} · WARN ${report.statusCounts.WARN||0} · FAIL ${report.statusCounts.FAIL||0}`,
    "",
    "| Area | Status | Summary |",
    "| --- | --- | --- |",
    ...report.areas.map(a=>`| ${a.name} | ${a.status} | ${a.summary.replace(/\|/g,"/")} |`),
    "",
    "## Forensic findings"
  ];
  for(const a of report.areas){
    lines.push("",`### ${a.name}`);
    for(const c of a.checks)lines.push(`- **${c.status} · ${c.id}:** ${c.detail}`);
  }
  lines.push("","## Certification boundary","",report.certificationBoundary,"",
    "A warning is not silently converted into a pass. Distractor Quality & Misconception Mapping v1 is now implemented, but legacy-bank coverage remains intentionally staged and is reported as a warning until reviewed mapping is complete or a course-specific required threshold is declared.");
  return lines.join("\n");
}

if(jsonOnly)console.log(JSON.stringify(report,null,2));
else console.log(markdown());

const fail=(report.statusCounts.FAIL||0)>0||(strictWarnings&&(report.statusCounts.WARN||0)>0);
process.exit(fail?1:0);
