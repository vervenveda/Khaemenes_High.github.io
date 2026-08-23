import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
let failures=0;
const ok=(condition,label)=>{if(condition)console.log(`OK ${label}`);else{failures+=1;console.error(`FAIL ${label}`)}};
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");
const exists=rel=>fs.existsSync(path.join(root,rel));
const loadScript=(rel,context)=>{vm.createContext(context);vm.runInContext(read(rel),context,{filename:rel});return context};

const dimensions=["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"];
const weeklyParts=["assessments/assets/weekly-mastery-v2-a.js","assessments/assets/weekly-mastery-v2-b.js","assessments/assets/weekly-mastery-v2-c.js","assessments/assets/weekly-mastery-v2-d.js"];
const weeklyPatch="assessments/assets/weekly-mastery-quality-patch-v2.js";
const weeklyContext={window:{KhaemenesAlgebra1WeeklyMasteryV2:{}}};
vm.createContext(weeklyContext);
for(const rel of weeklyParts){ok(exists(rel),`${rel} exists`);if(exists(rel))vm.runInContext(read(rel),weeklyContext,{filename:rel})}
ok(exists(weeklyPatch),`${weeklyPatch} exists`);if(exists(weeklyPatch))vm.runInContext(read(weeklyPatch),weeklyContext,{filename:weeklyPatch});
const bank=weeklyContext.window.KhaemenesAlgebra1WeeklyMasteryV2||{},weekNumbers=Object.keys(bank).map(Number).sort((a,b)=>a-b);
ok(weekNumbers.length===36,"weekly mastery bank contains 36 weeks");
ok(weekNumbers.every((w,i)=>w===i+1),"weekly mastery weeks are contiguous 1-36");

const courseMap=JSON.parse(read("course-map.json")),expectedUnit={1:0};
let cursor=2;
for(const unit of courseMap.units||[]){for(let i=0;i<Number(unit.weeks||0);i++)expectedUnit[cursor+i]=Number(unit.number);cursor+=Number(unit.weeks||0)}
ok(cursor===37,"course-map instructional weeks resolve through Week 36");
const promptSet=new Set(),idSet=new Set();
for(let week=1;week<=36;week++){
 const w=bank[String(week)];ok(Boolean(w),`Week ${week} mastery definition exists`);if(!w)continue;
 ok(w.week===week,`Week ${week} stores the correct week number`);ok(w.unit===expectedUnit[week],`Week ${week} maps to Unit ${expectedUnit[week]}`);ok(w.graded===(week!==1),`Week ${week} grading classification is correct`);ok(Array.isArray(w.questions)&&w.questions.length===10,`Week ${week} has exactly 10 mastery questions`);
 const seenDims=new Set();
 for(const [index,q] of (w.questions||[]).entries()){
  const valid=q&&typeof q.id==="string"&&q.id&&typeof q.prompt==="string"&&q.prompt.trim().length>=8&&Array.isArray(q.options)&&q.options.length===4&&q.options.every(x=>typeof x==="string"&&x.trim())&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4&&typeof q.explanation==="string"&&q.explanation.trim()&&dimensions.includes(q.dimension);
  ok(valid,`Week ${week} question ${index+1} has a valid definitive-answer record`);if(!valid)continue;
  ok(new Set(q.options).size===4,`Week ${week} question ${index+1} has four distinct option strings`);ok(!idSet.has(q.id),`Question id ${q.id} is globally unique`);idSet.add(q.id);const p=q.prompt.trim().toLowerCase();ok(!promptSet.has(p),`Week ${week} question ${index+1} prompt is globally unique`);promptSet.add(p);seenDims.add(q.dimension);
 }
 ok(dimensions.every(d=>seenDims.has(d)),`Week ${week} covers all five assessment dimensions`);
}
ok(idSet.size===360,"weekly mastery contains 360 unique question ids");ok(promptSet.size===360,"weekly mastery contains 360 unique prompts");
const patchedW8=bank["8"]?.questions?.find(q=>q.id==="a1-w08-q07"),patchedW9=bank["9"]?.questions?.find(q=>q.id==="a1-w09-q07"),patchedW18=bank["18"]?.questions?.find(q=>q.id==="a1-w18-q07");
ok(patchedW8?.answer===0,"Week 8 perimeter answer key correction is applied");ok(patchedW9?.answer===1&&new Set(patchedW9.options||[]).size===4,"Week 9 rate question has one definitive option set");ok(patchedW18?.answer===2&&patchedW18?.options?.[2]==="$141","Week 18 model question has one definitive $141 answer");

const authorityRel="assets/mastery-authority-v1.js",authorityStore={};
ok(exists(authorityRel),"canonical mastery authority exists");
const authorityContext={window:{},localStorage:{getItem:key=>authorityStore[key]??null}};
if(exists(authorityRel))loadScript(authorityRel,authorityContext);
const authority=authorityContext.window.KhaemenesAlgebra1MasteryAuthority;
ok(authority?.version==="1.1"&&authority?.threshold===80,"canonical mastery authority exposes v1.1 / 80% contract");
const mappedWeeks=authority?Object.keys(authority.weekLessonMap||{}).map(Number).sort((a,b)=>a-b):[];
ok(mappedWeeks.length===35&&mappedWeeks.every((w,i)=>w===i+2),"canonical authority maps every graded week 2-36");
let mappedLessonCount=0;
for(let week=2;week<=36;week++){
 const refs=authority?.weekLessonRefs?.(week)||[];mappedLessonCount+=refs.length;
 ok(refs.length>0,`Week ${week} has canonical lesson prerequisites`);
 ok(refs.every(r=>Number(r.unit)===Number(expectedUnit[week])),`Week ${week} canonical lesson prerequisites stay inside Unit ${expectedUnit[week]}`);
}
ok(mappedLessonCount===87,"canonical week map covers all 87 Algebra I lessons exactly once");
authorityStore["khaemenes-algebra1-unit02-a3-v1"]=JSON.stringify({best:{"lesson-1":80,"lesson-2":90,mastery:84}});
ok(authority?.unitMastered?.(2)===true,"canonical authority recognizes dedicated-unit mastery evidence");ok(authority?.weekLessonsMastered?.(4)===true,"canonical authority recognizes dedicated Week 4 lesson mastery");
authorityStore["khaemenes-algebra1-unit10-progress-v1"]=JSON.stringify({scores:{"u10-l01":85,"u10-l02":82},completed:["u10-l01","u10-l02"]});
ok(authority?.weekLessonsMastered?.(27)===true,"canonical authority recognizes shared Week 27 lesson mastery");
ok(authority?.unitEvidence?.(1)?.best===null,"canonical authority does not coerce absent scores to zero");

const weeklyPage=read("assessments/weekly-mastery.html");
for(const rel of [...weeklyParts.map(p=>path.basename(p)),path.basename(weeklyPatch),"mastery-authority-v1.js","weekly-mastery-engine-v2.js"])ok(weeklyPage.includes(rel),`weekly mastery page loads ${rel}`);
const weeklyEngine=read("assessments/assets/weekly-mastery-engine-v2.js");ok(weeklyEngine.includes("MASTERY=80")&&weeklyEngine.includes("REQUIRED=8"),"weekly engine declares the 80% / 8-of-10 contract");ok(weeklyEngine.includes("course_grade_eligible:w.graded===true"),"weekly engine preserves readiness versus graded evidence");ok(weeklyEngine.includes("dimension_scores"),"weekly engine records assessment-dimension evidence");ok(weeklyEngine.includes("A.weekLessonEvidence(week)")&&weeklyEngine.includes('reason:"current-lessons"'),"weekly engine requires current-week lesson mastery before graded weekly evidence");ok(weeklyEngine.includes("A.unitMastered(unit-1)")&&weeklyEngine.includes("A.midtermMastered()"),"weekly engine independently enforces prior-unit and second-half Midterm prerequisites");ok(weeklyEngine.includes("lesson_prerequisite_verified"),"weekly attempts record lesson-prerequisite verification state");ok(weeklyEngine.includes("KhaemenesAlgebra1WeeklyGateV2"),"weekly gate exposes a regression-testable gate surface");ok(read("index.html").includes("assessments/weekly-mastery.html"),"course home exposes Weekly Mastery Center");

const dedicatedGate=read("assets/dedicated-unit-gates-v1.js");ok(dedicatedGate.includes("A.unitMastered")&&dedicatedGate.includes("A.lessonMastered")&&dedicatedGate.includes("A.weekMastered")&&dedicatedGate.includes("A.midtermMastered"),"dedicated-unit gate delegates all mastery evidence to canonical authority");ok(dedicatedGate.includes("c.unit>=7&&!A.midtermMastered()"),"dedicated Units 07-09 preserve reviewed Midterm prerequisite");
const expectedDedicatedWeeks={2:[4,4,5,5,5,6,6],3:[7,7,8,8,8,9,9],4:[10,10,10,11,11,11],5:[12,12,13,13,13,14,14],6:[15,15,16,16,17,17,18,18],7:[19,19,19,20,20,21,21],8:[22,22,22,23,23,23],9:[24,24,24,25,25,26,26]};
for(let unit=1;unit<=9;unit++){
 const id=String(unit).padStart(2,"0"),base=`units/unit-${id}`,dataRel=`${base}/assets/unit${id}-data.js`,masteryRel=`${base}/assessment/mastery-check.html`;
 ok(exists(dataRel),`Unit ${id} modern data bank exists`);ok(exists(masteryRel),`Unit ${id} mastery page exists`);if(!exists(dataRel))continue;
 const ctx={window:{}};loadScript(dataRel,ctx);const data=Object.values(ctx.window).find(v=>v&&typeof v==="object"&&v.unit&&Array.isArray(v.lessons)&&Array.isArray(v.questions));ok(Boolean(data),`Unit ${id} data bank is executable`);if(!data)continue;
 ok(Number(data.unit.number)===unit,`Unit ${id} identifies its unit correctly`);ok(Number(data.unit.mastery_target)===80,`Unit ${id} retains an 80% mastery target`);const mapUnit=(courseMap.units||[]).find(u=>Number(u.number)===unit);ok(data.lessons.length===Number(mapUnit?.lesson_count),`Unit ${id} lesson count matches course map`);const qids=new Set(data.questions.map(q=>q.id));ok(qids.size===data.questions.length,`Unit ${id} bank question ids are unique`);ok(data.lessons.every(l=>data.questions.filter(q=>Number(q.lesson)===Number(l.number)).length>=8),`Unit ${id} gives every lesson at least eight bank questions`);
 const assetDir=path.join(root,base,"assets"),impl=fs.readdirSync(assetDir).filter(f=>f.endsWith(".js")&&!f.includes("-data")).map(f=>fs.readFileSync(path.join(assetDir,f),"utf8")).join("\n"),blueprintIds=new Set(impl.match(new RegExp(`u${id}-l\\d+-q\\d+`,"g"))||[]);ok(blueprintIds.size>=20,`Unit ${id} implementation references at least 20 fixed mastery-bank items`);ok(/mastery/i.test(impl)&&/80/.test(impl),`Unit ${id} implementation exposes mastery behavior and 80% target`);
 if(unit>=2){const wrapperRel=`${base}/assets/unit${id}.js`,coreRel=`${base}/assets/unit${id}-core.js`,wrapper=read(wrapperRel);ok(exists(coreRel),`Unit ${id} preserved core runtime exists`);ok(wrapper.includes("mastery-authority-v1.js")&&wrapper.includes("dedicated-unit-gates-v1.js")&&wrapper.includes(`unit${id}-core.js`),`Unit ${id} entry point gates before loading preserved core runtime`);const match=wrapper.match(/DedicatedGateConfig=\{unit:(\d+),lesson_weeks:\[([^\]]+)\]\}/),weeks=match?match[2].split(",").map(Number):[];ok(Number(match?.[1])===unit&&JSON.stringify(weeks)===JSON.stringify(expectedDedicatedWeeks[unit]),`Unit ${id} gate uses the verified lesson-to-week map`)}
}

const unitPage=read("assets/unit-page.js"),strictGate=read("assets/strict-mastery-gates.js");ok(unitPage.indexOf("mastery-authority-v1.js")<unitPage.indexOf("unit-page-core.js")&&unitPage.indexOf("unit-page-core.js")<unitPage.indexOf("strict-mastery-gates.js"),"shared Units 10-13 load canonical authority before renderer and strict gate");ok(strictGate.includes("KhaemenesAlgebra1MasteryAuthority")&&!strictGate.includes("progressKey=")&&!strictGate.includes("WEEK_STORE="),"shared Units 10-13 strict gate no longer duplicates mastery storage parsing");ok(strictGate.includes("unitNo>=7&&!midtermMastered()"),"shared Units 10-13 retain reviewed Midterm prerequisite");
const legacyContext={window:{}};vm.createContext(legacyContext);vm.runInContext(read("course-data.js"),legacyContext,{filename:"course-data.js"});vm.runInContext(read("assets/question-bank.js"),legacyContext,{filename:"assets/question-bank.js"});
const legacyData=legacyContext.window.ALGEBRA1_DATA,legacyQuestions=legacyContext.window.ALGEBRA1_QUESTIONS;
ok(Boolean(legacyData)&&Array.isArray(legacyQuestions),"shared late-unit curriculum and question bank are executable");
const legacyMasteryRel="assets/legacy-mastery-engine-v2.js",legacyMastery=read(legacyMasteryRel);ok(exists(legacyMasteryRel),"dedicated late-unit mastery engine exists");ok(legacyMastery.includes("MASTERY=80")&&legacyMastery.includes("COUNT=20"),"late-unit engine fixes formal mastery at 20 questions / 80%");ok(legacyMastery.includes("lessons.forEach")&&legacyMastery.includes("difficulty")&&legacyMastery.includes("localeCompare"),"late-unit engine uses stable lesson-balanced blueprint selection");ok(/\.scores\.mastery/.test(legacyMastery)&&/\.attempts\.push/.test(legacyMastery),"late-unit engine preserves best score and attempt history");ok(legacyMastery.includes("KhaemenesAlgebra1MasteryAuthority")&&legacyMastery.includes("A.unitMastered(R.unit-1)")&&legacyMastery.includes("A.midtermMastered()")&&legacyMastery.includes("A.lessonMastered")&&legacyMastery.includes("A.weekMastered"),"late-unit formal mastery requires canonical prior-unit, Midterm, lesson, and weekly evidence");
for(let unit=10;unit<=13;unit++){
 const id=String(unit).padStart(2,"0"),base=`units/unit-${id}`,page=read(`${base}/assessment/mastery-check.html`),mapUnit=(courseMap.units||[]).find(u=>Number(u.number)===unit),unitLessons=(legacyData?.lessons||[]).filter(l=>Number(l.unit)===unit);
 ok(page.includes("legacy-mastery-engine-v2.js")&&!page.includes("assets/unit-page.js"),`Unit ${id} formal page uses only the dedicated fixed mastery engine`);ok(unitLessons.length===Number(mapUnit?.lesson_count),`Unit ${id} shared lesson count matches course map`);
 const baseQuota=Math.floor(20/unitLessons.length),remainder=20%unitLessons.length;unitLessons.forEach((l,i)=>{const need=baseQuota+(i<remainder?1:0),count=(legacyQuestions||[]).filter(q=>Number(q.unit)===unit&&Number(q.lesson)===Number(l.number)).length;ok(count>=need,`Unit ${id} Lesson ${l.number} supplies at least ${need} formal-blueprint items`)});
}
ok(!exists("units/unit-12/unit-12"),"orphan nested Unit 12 subtree is removed");ok(!exists("assessments/unit-13-mastery-blueprint.js"),"unused Unit 13 mastery override is removed");

const courseGate=read("assets/course-progression-gates.js");ok(courseGate.includes("KhaemenesAlgebra1MasteryAuthority")&&courseGate.includes("unit>=7&&previousOk&&!midtermOk"),"course-home progression uses canonical evidence and preserves second-half Midterm gate");
function examConfig(rel){const html=read(rel),m=html.match(/window\.EXAM_CONFIG\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);if(!m)return null;try{return JSON.parse(m[1])}catch{return null}}
const mid=examConfig("assessments/midterm-units-01-06.html"),fin=examConfig("assessments/final-exam-36-weeks.html");ok(mid?.id==="KH-MATH-A1-MIDTERM-U01-U06"&&mid?.questions?.length===60,"midterm retains 60 selected-response questions");ok(fin?.id==="KH-MATH-A1-FINAL-36W"&&fin?.questions?.length===100,"final retains 100 selected-response questions");for(const [label,cfg] of [["midterm",mid],["final",fin]])if(cfg)ok(cfg.questions.every(q=>Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4),`${label} selected-response records have four distinct strings and valid answer indexes`);
const depthContext={window:{}};vm.createContext(depthContext);const depthRel="assessments/assets/exam-depth-v2.js";ok(exists(depthRel),"cumulative exam depth configuration exists");if(exists(depthRel))vm.runInContext(read(depthRel),depthContext,{filename:depthRel});const depth=depthContext.window.KhaemenesAlgebra1ExamDepth||{},midDepth=depth["KH-MATH-A1-MIDTERM-U01-U06"],finDepth=depth["KH-MATH-A1-FINAL-36W"];
ok(midDepth?.constructed?.length===6,"midterm requires six constructed responses across Units 01-06");ok(finDepth?.constructed?.length===10,"final requires ten cross-domain constructed responses");for(const [label,cfg] of [["midterm",midDepth],["final",finDepth]])if(cfg){ok(cfg.selected_weight===70&&cfg.constructed_weight===30,`${label} uses 70/30 selected/constructed weighting`);ok(cfg.rubric_max===4&&Array.isArray(cfg.rubric)&&cfg.rubric.length===5,`${label} exposes a five-level 0-4 rubric`);ok(Number(cfg.response_min_chars)>=50,`${label} requires substantive written responses`);const ps=cfg.constructed.map(x=>String(x.prompt||"").trim().toLowerCase());ok(new Set(ps).size===ps.length,`${label} constructed prompts are unique`);ok(cfg.constructed.every(x=>typeof x.domain==="string"&&x.domain.trim()&&typeof x.prompt==="string"&&x.prompt.length>120),`${label} constructed tasks are substantive and domain-labelled`)}
const examEngine=read("assets/exam-engine.js");ok(examEngine.includes("exam-depth-v2.js"),"cumulative engine loads exam-depth v2");ok(examEngine.includes("selected>=MASTERY&&constructedPercent>=MASTERY&&overall>=MASTERY"),"full cumulative mastery requires 80% selected, 80% constructed, and 80% overall");ok(examEngine.includes("pending-evaluator-review")&&examEngine.includes("review_complete:true"),"cumulative result distinguishes auto-score from evaluator-complete evidence");ok(examEngine.includes("legacy_selected_only"),"legacy selected-only results cannot silently become mixed-evidence mastery");ok(read(depthRel).includes("mastery-authority-v1.js")&&read(depthRel).includes("A.unitMastered")&&read(depthRel).includes("A.weekMastered"),"cumulative prerequisite gate consumes canonical unit and weekly evidence");

const assessmentMap=JSON.parse(read("assessments/assessment-map.json"));ok(assessmentMap.schema_version==="3.0"&&assessmentMap.mastery_threshold===80,"assessment map declares v3 / 80% mastery");ok(assessmentMap.weekly_mastery?.weeks===36&&assessmentMap.weekly_mastery?.questions_per_week===10&&assessmentMap.weekly_mastery?.total_unique_prompts===360,"assessment map records 36 × 10 weekly depth");ok(assessmentMap.weekly_mastery?.week_1?.course_grade_eligible===false&&assessmentMap.weekly_mastery?.graded_instructional_weeks===35,"assessment map keeps readiness evidence separate from 35 graded weeks");ok(assessmentMap.cumulative_scoring?.selected_response_weight===70&&assessmentMap.cumulative_scoring?.constructed_response_weight===30,"assessment map matches cumulative 70/30 weighting");ok(assessmentMap.cumulative_scoring?.mastery_requires?.selected_response_percent===80&&assessmentMap.cumulative_scoring?.mastery_requires?.constructed_response_percent===80&&assessmentMap.cumulative_scoring?.mastery_requires?.overall_percent===80,"assessment map matches the three-part 80% rule");ok(assessmentMap.midterm?.constructed_responses===6&&assessmentMap.final?.constructed_responses===10,"assessment map matches midterm/final constructed-response counts");

const recordHtml=read("records/course-completion-certificate.html"),recordEngine=read("assets/record-engine.js");ok(recordHtml.includes("weeklyGate")&&recordHtml.includes("unitGate")&&recordHtml.includes("attestation"),"completion page exposes weekly, unit, and evaluator evidence gates");ok(recordEngine.includes("weekly_required:35")&&recordEngine.includes("units_required:13"),"completion engine requires all 35 graded weeks and all 13 units");ok(recordEngine.includes("khaemenes-algebra1-midterm-result-v1")&&recordEngine.includes("khaemenes-algebra1-final-result-v1")&&recordEngine.includes("review_complete===true"),"completion engine requires reviewed cumulative evidence");ok(recordEngine.includes("coursework>=MASTER")&&recordEngine.includes("capstone>=MASTER")&&recordEngine.includes("fields.attestation===true"),"completion engine requires 80% coursework/capstone and evaluator attestation");ok(recordEngine.includes("if(!r.ready)")&&recordEngine.includes("Printing a completion record is blocked"),"completion printing is blocked until all gates are satisfied");ok(recordEngine.includes("khaemenes-algebra1-completion-record-v2")&&recordEngine.includes("authoritative:false")&&recordEngine.includes("digitally_signed:false"),"completion export uses v2 trust-aware local record schema");

const sw=read("service-worker.js"),legacySw="service-worker-precache-v1.js";ok(exists(legacySw),"legacy full-course precache source is preserved");ok(sw.includes("khaemenes-algebra1-v5-canonical-mastery-convergence"),"service worker cache advances to canonical-convergence v5");ok(sw.includes("service-worker-precache-v1.js")&&sw.includes("legacyFiles"),"service worker rebuilds the preserved broad precache list");for(const name of ["weekly-mastery.html","weekly-mastery-engine-v2.js","exam-depth-v2.js","exam-engine.js","legacy-mastery-engine-v2.js","record-engine.js","records/course-completion-certificate.html","strict-mastery-gates.js","course-progression-gates.js","mastery-authority-v1.js","dedicated-unit-gates-v1.js"])ok(sw.includes(name),`release cache explicitly includes ${name}`);for(let unit=2;unit<=9;unit++){const id=String(unit).padStart(2,"0");ok(sw.includes(`unit${id}.js`)&&sw.includes(`unit${id}-core.js`),`release cache explicitly includes Unit ${id} bootstrap and preserved core`)}

if(failures){console.error(`\nAlgebra I assessment-depth validation failed: ${failures} problem(s).`);process.exit(1)}
console.log("\nAlgebra I assessment-depth validation passed: 36 weekly checks / 360 unique prompts, canonical Week 2-36 lesson gating, Units 01-09 fixed mastery with direct-route protection, Units 10-13 lesson-balanced formal mastery with canonical prerequisites, mixed-evidence cumulative mastery, evidence-gated completion, and v5 offline convergence coverage.");
