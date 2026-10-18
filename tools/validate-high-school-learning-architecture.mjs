import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=p=>fs.existsSync(path.join(ROOT,p));
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const MARKER="<!-- KHAEMENES_HIGH_ASSESSMENT_ADAPTER_V1 -->";

const shared=[
  "courses/shared/monte-carlo-assessment-v1.js",
  "courses/shared/high-school-assessment-adapter-v1.js",
  "courses/shared/high-school-learning-context-v1.js",
  "courses/shared/high-school-formative-evidence-v1.js",
  "courses/shared/high-school-learning-registry.json",
  "courses/shared/learner-scope-v1.js"
];
for(const p of shared)assert(exists(p),"Missing shared High School asset: "+p);
for(const p of shared.filter(x=>x.endsWith(".js"))){
  try{new Function(read(p))}catch(e){throw new Error(p+" syntax: "+e.message)}
}

// Registry and global policy.
const registry=JSON.parse(read("courses/shared/high-school-learning-registry.json"));
assert(registry.schema==="khaemenes-high-learning-registry-v1","Wrong High School learning registry schema.");
assert(registry.masteryThreshold===80,"High School registry mastery threshold must remain 80%.");
assert(Array.isArray(registry.courses)&&registry.courses.length===16,"Expected 16 registered local High School core authorities.");
for(const id of ["english-9","english-10","english-11","english-12","pre-algebra","algebra-1","geometry","algebra-2","integrated-science-9","biology-10","chemistry-11","physics-engineering-12","global-studies-9","us-history-10","government-economics-11","global-politics-12"]){
  assert(registry.courses.some(c=>c.id===id),"Registry missing "+id);
}

// Monte Carlo engine + adapter behavior in a sandbox.
const sandbox={window:null,globalThis:null,localStorage:{_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)}},crypto:globalThis.crypto,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},dispatchEvent(){},addEventListener(){},setTimeout,clearTimeout,document:{readyState:"complete",addEventListener(){},querySelector(){return null}}};
sandbox.window=sandbox;sandbox.globalThis=sandbox;vm.createContext(sandbox);
vm.runInContext(read("courses/shared/monte-carlo-assessment-v1.js"),sandbox);
vm.runInContext(read("courses/shared/high-school-learning-context-v1.js"),sandbox);
vm.runInContext(read("courses/shared/high-school-assessment-adapter-v1.js"),sandbox);
const adapter=sandbox.KhaemenesHighAssessmentAdapter;
assert(adapter?.masteryThreshold===80,"High School adapter mastery threshold changed.");
const sample=Array.from({length:40},(_,i)=>({id:"q"+i,question:"Question "+i,choices:["A"+i,"B"+i,"C"+i,"D"+i],answer:i%4,skill:"skill-"+(i%6)}));
const opened=adapter.open({courseId:"qa-course",storageKey:"qa:mc",bank:sample,kind:"final",count:30});
assert(opened.questions.length===30,"Adapter did not draw requested final size.");
assert(new Set(opened.questionIds).size===30,"Adapter produced duplicate question IDs in one form.");
assert(opened.questions.every(q=>q.choices.length===4&&q.answer>=0&&q.answer<4),"Adapter materialization malformed.");
const same=adapter.open({courseId:"qa-course",storageKey:"qa:mc",bank:sample,kind:"final",count:30});
assert(JSON.stringify(same.questionIds)===JSON.stringify(opened.questionIds),"Active Monte Carlo form did not persist across resume.");
adapter.complete(opened,{score:80,correct:24,total:30,mastered:true,reviewSkills:["skill-1"]});
const next=adapter.open({courseId:"qa-course",storageKey:"qa:mc",bank:sample,kind:"final",count:30});
assert(next.sessionId!==opened.sessionId,"Retake did not create a fresh session.");
assert(adapter.policy("final").bookMode==="closed-book","Final policy must remain closed-book.");
assert(adapter.policy("weekly").bookMode==="open-book","Weekly policy must remain open-book.");

// Sanitized context may carry only summary evidence.
const contextSource=read("courses/shared/high-school-learning-context-v1.js");
const recordBlock=contextSource.match(/function recordEvent[\s\S]*?function recordAssessment/);
assert(recordBlock,"Could not isolate High School context record function.");
for(const forbidden of [/\bprompt\s*:/,/\boptions\s*:/,/\bselected\s*:/,/\banswer\s*:/]){
  assert(!forbidden.test(recordBlock[0]),"High School shared context leaks answer-level assessment content.");
}
for(const token of ["assessmentQuestionTextPublished:false","assessmentOptionsPublished:false","learnerSelectionsPublished:false","answerKeysPublished:false"]){
  assert(contextSource.includes(token),"Missing High School evidence privacy contract: "+token);
}

// Rollout coverage: only assessment-bearing upper English + three Social Studies portals.
function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules","archive","archives","backup","backups","vendor","private"].includes(e.name.toLowerCase()))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())walk(full,out);
    else if(e.isFile()&&/\.html$/i.test(e.name))out.push(full);
  }
  return out;
}
const coverage={english:0,social:0,englishQuizBanks:0,missing:[],duplicates:[]};
for(const file of walk(ROOT)){
  const rel=path.relative(ROOT,file).split(path.sep).join("/"),html=fs.readFileSync(file,"utf8");
  const targetEnglish=/^courses\/language-arts\/english-(10|11|12)\//.test(rel)&&(/data-quiz-form/.test(html)||/data-assessment-form/.test(html));
  const targetSocial=/^courses\/social-studies\/grade-(10|11|12)\/index\.html$/.test(rel);
  if(!targetEnglish&&!targetSocial)continue;
  targetEnglish?coverage.english++:coverage.social++;
  const count=html.split(MARKER).length-1;
  if(count===0)coverage.missing.push(rel);
  if(count>1)coverage.duplicates.push(rel);
  for(const asset of ["monte-carlo-assessment-v1.js","high-school-learning-context-v1.js","high-school-assessment-adapter-v1.js"]){
    if(!html.includes(asset))coverage.missing.push(rel+" missing "+asset);
  }
  if(targetEnglish&&/data-quiz-form/.test(html)){
    if(!html.includes("quiz-specific-bank.js"))coverage.missing.push(rel+" missing quiz-specific-bank.js");
    if(/^courses\/language-arts\/english-(10|11|12)\/weeks\/week-\d{2}\/index\.html$/.test(rel))coverage.englishQuizBanks++;
  }
}
assert(coverage.english===154,"Expected 154 upper-English assessment surfaces; found "+coverage.english);
assert(coverage.social===3,"Expected 3 Social Studies adapter portals; found "+coverage.social);
assert(coverage.englishQuizBanks===108,"Expected 108 canonical upper-English weekly quiz bank surfaces; found "+coverage.englishQuizBanks);
assert(!coverage.missing.length,"High School adapter coverage gaps:\n"+coverage.missing.slice(0,30).join("\n"));
assert(!coverage.duplicates.length,"Duplicate High School adapter markers:\n"+coverage.duplicates.slice(0,30).join("\n"));

// Course-wide formative lesson evidence coverage.
const FORMATIVE_MARKER="<!-- KHAEMENES_HIGH_FORMATIVE_EVIDENCE_V1 -->";
function formativeTarget(rel){
  const p=rel.split(path.sep).join("/");
  if(/\/(?:assessments?|records?|teacher|teachers|resources?|tools?|games?|assets?|tests?|evidence|portfolio|certificates?)\//i.test(p))return false;
  if(/(?:^|\/)(?:404|offline|gradebook|certificate|answer-key|answer_key)[^/]*\.html$/i.test(p))return false;
  if(/^courses\/language-arts\/english-(9|10|11|12)\/weeks\/week-\d{2}\/index\.html$/i.test(p))return true;
  if(/^courses\/language-arts\/english-(9|10|11|12)\/weeks\/week-\d{2}\/(?:lessons\/)?day-\d{2}\.html$/i.test(p))return true;
  if(/^courses\/language-arts\/english-9\/weeks\/week-\d{2}\/day-\d{2}\/index\.html$/i.test(p))return true;
  if(/^courses\/language-arts\/english-10\/weeks\/week-\d{2}\/(?:monday|tuesday|wednesday|thursday|friday)\/index\.html$/i.test(p))return true;
  if(/^courses\/mathematics\/(?:pre-algebra|algebra-1|geometry|algebra-2)\/units\/unit-\d{2}\/lessons\/.+\.html$/i.test(p))return true;
  if(/^courses\/science\/integrated-science-9\/(?:diagnostic|units\/unit-\d{2})\/lessons\/day-\d{2}\.html$/i.test(p))return true;
  if(/^courses\/science\/(?:biology-10|chemistry-11|physics-engineering-12)\/weeks\/week-\d{2}\/lessons\/day-\d{2}\.html$/i.test(p))return true;
  if(/^courses\/social-studies\/grade-(?:09|10|11|12)\/weeks\/week-\d{2}\/student-packet(?:-v2)?\.html$/i.test(p))return true;
  if(/^courses\/social-studies\/grade-11\/personal-finance\/weeks\/week-\d{2}\/student-packet(?:-v2)?\.html$/i.test(p))return true;
  return false;
}
const formativeCoverage={targets:0,missing:[],duplicates:[],byFamily:{english:0,mathematics:0,science:0,socialStudies:0}};
for(const file of walk(ROOT)){
  const rel=path.relative(ROOT,file).split(path.sep).join("/");
  if(!formativeTarget(rel))continue;
  formativeCoverage.targets++;
  if(rel.includes("/language-arts/"))formativeCoverage.byFamily.english++;
  else if(rel.includes("/mathematics/"))formativeCoverage.byFamily.mathematics++;
  else if(rel.includes("/science/"))formativeCoverage.byFamily.science++;
  else if(rel.includes("/social-studies/"))formativeCoverage.byFamily.socialStudies++;
  const html=fs.readFileSync(file,"utf8"),markers=html.split(FORMATIVE_MARKER).length-1;
  if(markers===0)formativeCoverage.missing.push(rel);
  if(markers>1)formativeCoverage.duplicates.push(rel);
  if(!html.includes("high-school-learning-context-v1.js"))formativeCoverage.missing.push(rel+" missing high-school-learning-context-v1.js");
  if(!html.includes("high-school-formative-evidence-v1.js"))formativeCoverage.missing.push(rel+" missing high-school-formative-evidence-v1.js");
}
assert(formativeCoverage.targets===1482,"Expected 1482 High School formative lesson surfaces; found "+formativeCoverage.targets);
assert(formativeCoverage.byFamily.english===224,"Expected 224 English formative surfaces; found "+formativeCoverage.byFamily.english);
assert(formativeCoverage.byFamily.mathematics===372,"Expected 372 Mathematics formative surfaces; found "+formativeCoverage.byFamily.mathematics);
assert(formativeCoverage.byFamily.science===720,"Expected 720 Science formative surfaces; found "+formativeCoverage.byFamily.science);
assert(formativeCoverage.byFamily.socialStudies===166,"Expected 166 Social Studies formative surfaces; found "+formativeCoverage.byFamily.socialStudies);
assert(!formativeCoverage.missing.length,"High School formative coverage gaps:\n"+formativeCoverage.missing.slice(0,40).join("\n"));
assert(!formativeCoverage.duplicates.length,"Duplicate High School formative markers:\n"+formativeCoverage.duplicates.slice(0,40).join("\n"));
const formativeSource=read("courses/shared/high-school-formative-evidence-v1.js");
for(const token of ["awardsMastery:false","changesScore:false","unlocksCurriculum:false","changesPlacement:false","replacesPerformanceEvidence:false"]){
  assert(formativeSource.includes(token),"High School formative authority boundary missing "+token);
}
assert(formativeSource.includes("recordFormative"),"High School lesson bridge no longer records through the sanitized shared context.");
assert(formativeSource.includes('kind:"lesson-reflection"'),"High School lesson evidence kind changed unexpectedly.");

// Upper-English supplemental week-specific banks.
let supplementalQuestions=0;
for(const grade of [10,11,12]){
  const bankPath="courses/language-arts/english-"+grade+"/assets/quiz-specific-bank.json";
  const jsBankPath="courses/language-arts/english-"+grade+"/assets/quiz-specific-bank.js";
  assert(exists(bankPath),"Missing English "+grade+" supplemental JSON bank.");
  assert(exists(jsBankPath),"Missing English "+grade+" executable supplemental bank.");
  const bank=JSON.parse(read(bankPath));
  assert(Array.isArray(bank.rows)&&bank.rows.length===36,"English "+grade+" supplemental bank must contain 36 week rows.");
  for(let week=0;week<bank.rows.length;week++){
    const rows=bank.rows[week];
    assert(Array.isArray(rows)&&rows.length===2,"English "+grade+" Week "+String(week+1).padStart(2,"0")+" must have exactly two supplemental questions.");
    for(const row of rows){
      assert(Array.isArray(row)&&typeof row[0]==="string"&&Array.isArray(row[1])&&row[1].length===4&&typeof row[2]==="string"&&typeof row[3]==="string","Malformed English "+grade+" supplemental question.");
      assert(new Set(row[1]).size===4,"English "+grade+" supplemental question has duplicate choices.");
      supplementalQuestions++;
    }
  }
  try{new Function(read(jsBankPath))}catch(e){throw new Error(jsBankPath+" syntax: "+e.message)}
}
assert(supplementalQuestions===216,"Expected 216 upper-English supplemental questions; found "+supplementalQuestions);

// English 10–12 retain original gradebooks while using randomized sessions.
for(const grade of [10,11,12]){
  const js=read("courses/language-arts/english-"+grade+"/assets/course.js");
  try{new Function(js)}catch(e){throw new Error("English "+grade+" course.js syntax: "+e.message)}
  for(const token of ["KhaemenesHighAssessmentAdapter","KhaeMonteCarloAssessment","KHAE_ENGLISH_SPECIFIC_QUIZ_BANK","candidateQuestions","supplementalRows","attemptId","questionIds","reviewSkills","record.best=Math.max"]){
    assert(js.includes(token),"English "+grade+" lost adapter/record contract token: "+token);
  }
  assert(/mastered:attemptScore>=80/.test(js),"English "+grade+" lost the 80% attempt mastery expression.");
  assert(js.includes("projectScore"),"English "+grade+" lost separate project/performance evidence.");
}

// English 9 remains its specialized randomized + human-reviewed authority.
const e9test=read("courses/language-arts/english-9/tests/record-assessment-regression.mjs");
assert(e9test.includes("balancedChoiceOrders"),"English 9 lost balanced answer-order regression.");
assert(e9test.includes("for(let run=0;run<40;run++)"),"English 9 no longer stress-tests randomized exams.");
assert(e9test.includes("standaloneEvidence"),"English 9 lost standalone evidence export regression.");
for(const p of ["courses/language-arts/english-9/assets/week04-assessment.js","courses/language-arts/english-9/assets/week10-assessment.js"]){
  const js=read(p);assert(js.includes("Mastery threshold met"),p+" lost 80%-equivalent rubric mastery boundary.");
  assert(/Human review|educator|review/i.test(js),p+" lost human-review boundary.");
}

// Social Studies 10–12 retain authentic course evidence while randomizing selected response.
for(const grade of [10,11,12]){
  const html=read("courses/social-studies/grade-"+grade+"/index.html");
  for(const token of ["highAssessmentDraw","KhaemenesHighAssessmentAdapter","attemptId","questionIds","reviewSkills","score>=80","highAssessmentComplete"]){
    assert(html.includes(token),"Social Studies "+grade+" missing "+token);
  }
  assert(/capstone/i.test(html),"Social Studies "+grade+" lost capstone/performance evidence.");
}
assert(/thesis/i.test(read("courses/social-studies/grade-12/index.html")),"Grade 12 Social Studies lost thesis evidence.");

// Mathematics course-specific authorities.
const mathEngines=[
  "courses/mathematics/pre-algebra/assessments/assets/exam-engine.js",
  "courses/mathematics/algebra-1/assets/exam-engine.js",
  "courses/mathematics/geometry/assets/assessment-engine.js",
  "courses/mathematics/algebra-2/assets/assessment-engine.js"
];
for(const p of mathEngines){
  const js=read(p);try{new Function(js)}catch(e){throw new Error(p+" syntax: "+e.message)}
  assert(/80/.test(js),p+" lost 80% mastery boundary.");
  assert(/shuffle|shuffled|random|balanced/i.test(js),p+" lost randomized/balanced assessment behavior.");
  assert(/review|human|evaluator/i.test(js),p+" lost human/performance review boundary.");
}
assert(read(mathEngines[0]).includes("balancedTargets"),"Pre-Algebra lost balanced correct-position engine.");

// Science course-specific authorities.
const science9Final=read("courses/science/integrated-science-9/assessments/final-exam/index.html");
assert(/shuffle|random/i.test(science9Final),"Science 9 final lost randomized assessment behavior.");
assert(/80/.test(science9Final),"Science 9 final lost 80% mastery boundary.");
for(let unit=1;unit<=12;unit++){
  const n=String(unit).padStart(2,"0");
  assert(exists("courses/science/integrated-science-9/units/unit-"+n+"/question-bank.js"),"Science 9 missing Unit "+n+" question bank.");
}
for(const course of ["biology-10","chemistry-11","physics-engineering-12"]){
  assert(exists("courses/science/"+course+"/question-bank.js"),course+" question bank missing.");
  const policy=read("courses/science/"+course+"/assessments/index.html");
  assert(/80% mastery floor/.test(policy),course+" lost 80% mastery policy.");
  assert(/Supervised secure evidence/.test(policy),course+" lost supervised secure-evidence boundary.");
  assert(/Questions\/keys remain behind/.test(policy),course+" lost locked-question authority boundary.");
}

// Learner scope must cover the major adapted/high-value course families.
const scope=read("courses/shared/learner-scope-v1.js");
for(const token of ["english-10","english-11","english-12","social-studies-10","social-studies-11","social-studies-12","pre-algebra","algebra-1","geometry","algebra-2","integrated-science-9","biology-10","chemistry-11","physics-engineering-12"]){
  assert(scope.includes(token),"Learner scope missing "+token);
}

// Mentor authority stays separate from grades and locked assessment content.
const contract=JSON.parse(read("mentor-contract.json"));
assert(contract.version===3,"High School mentor contract must remain schema v3.");
assert(contract.masteryThresholdMinimum===80,"High School mentor contract mastery floor changed.");
assert(contract.progressionAuthority==="course-engine","Mentor became progression authority.");
for(const key of ["awardsMastery","changesGrades","changesPlacement","bypassesPrerequisites","revealsLockedAssessments"]){
  assert(contract.authority?.[key]===false,"High School mentor authority violation: "+key);
}

console.log("High School learning architecture regression: PASS");
console.log("  formative lesson evidence surfaces: "+formativeCoverage.targets);
console.log("    English: "+formativeCoverage.byFamily.english);
console.log("    Mathematics: "+formativeCoverage.byFamily.mathematics);
console.log("    Science: "+formativeCoverage.byFamily.science);
console.log("    Social Studies: "+formativeCoverage.byFamily.socialStudies);
console.log("  upper-English adapter surfaces: "+coverage.english);
console.log("  upper-English weekly Monte Carlo bank surfaces: "+coverage.englishQuizBanks);
console.log("  supplemental week-specific questions validated: "+supplementalQuestions);
console.log("  Social Studies adapter portals: "+coverage.social);
console.log("  shared mastery threshold: 80%");
console.log("  English 9: specialized randomized authority preserved");
console.log("  Mathematics: 4 course-specific randomized engines preserved");
console.log("  Science 9: 12 unit banks + randomized final preserved");
console.log("  Science 10–12: supervised secure-evidence boundary preserved");
console.log("  Mentor context: summary-only, no locked assessment content");
