import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const parts=[
  "assets/assessment-depth/prealgebra-weekly-quizzes-v2-a.js",
  "assets/assessment-depth/prealgebra-weekly-quizzes-v2-b.js",
  "assets/assessment-depth/prealgebra-weekly-quizzes-v2-c.js",
  "assets/assessment-depth/prealgebra-weekly-quizzes-v2-d.js"
];
let failures=0;
const ok=(condition,label)=>{if(condition)console.log(`OK ${label}`);else{failures+=1;console.error(`FAIL ${label}`)}};

const context={window:{KhaemenesPreAlgebraWeeklyQuizV2:{}}};
vm.createContext(context);
for(const rel of parts){
  const file=path.join(root,rel);
  ok(fs.existsSync(file),`${rel} exists`);
  if(fs.existsSync(file)) vm.runInContext(fs.readFileSync(file,"utf8"),context,{filename:rel});
}
const bank=context.window.KhaemenesPreAlgebraWeeklyQuizV2;
const weeks=Object.keys(bank).map(Number).sort((a,b)=>a-b);
ok(weeks.length===36,"assessment-depth bank contains 36 instructional weeks");
ok(weeks.every((w,i)=>w===i+1),"assessment-depth weeks are contiguous 1-36");

const prompts=[];
const depthPattern=/(student|error|why|best|interpret|conclusion|concern|correction|explain|justify|model|reasonable|what does|what should|limitation|assumption|verify|evidence|constraint|scale|context)/i;
for(let week=1;week<=36;week+=1){
  const quiz=bank[String(week)];
  ok(Array.isArray(quiz)&&quiz.length===10,`Week ${week} has exactly 10 mastery questions`);
  if(!Array.isArray(quiz))continue;
  let depthItems=0;
  quiz.forEach((q,index)=>{
    const valid=Array.isArray(q)&&q.length===3&&typeof q[0]==="string"&&q[0].trim().length>=8&&Array.isArray(q[1])&&q[1].length===4&&q[1].every(x=>typeof x==="string"&&x.trim())&&Number.isInteger(q[2])&&q[2]>=0&&q[2]<4;
    ok(valid,`Week ${week} question ${index+1} has valid prompt/choices/answer`);
    if(valid){
      ok(new Set(q[1]).size===4,`Week ${week} question ${index+1} has four distinct choices`);
      prompts.push(q[0].trim().toLowerCase());
      if(depthPattern.test(q[0]))depthItems+=1;
    }
  });
  ok(depthItems>=1,`Week ${week} includes explicit reasoning, interpretation, context, or error-analysis evidence`);
}
ok(new Set(prompts).size===prompts.length,"all 360 weekly prompts are unique");

const loader=fs.readFileSync(path.join(root,"assets/prealgebra-assessment-depth-v2.js"),"utf8");
ok(parts.every(rel=>loader.includes(path.basename(rel))),"assessment-depth loader references all four quiz-bank parts");
ok(loader.includes('questionCount:10')&&loader.includes('masteryThreshold:80')&&loader.includes('masteryRequired:8'),"loader declares 10-question / 80% / 8-of-10 mastery contract");
ok(loader.includes('week-specific')&&loader.includes('error-analysis')&&loader.includes('transfer-reasoning'),"loader declares week-specific depth blueprint");

const upgrade=fs.readFileSync(path.join(root,"assets/prealgebra-archaemenes-upgrade.js"),"utf8");
ok(upgrade.includes('prealgebra-assessment-depth-v2.js')&&upgrade.includes('loadAssessmentDepth()'),"course upgrade loads assessment-depth v2");

function extractAssessmentConfig(html,unit){
  const match=html.match(/window\.ASSESSMENT_CONFIG\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if(!match){ok(false,`Unit ${unit} mastery config is parseable`);return null}
  try{return JSON.parse(match[1])}catch(error){ok(false,`Unit ${unit} mastery config is valid JSON (${error.message})`);return null}
}
for(let unit=1;unit<=13;unit+=1){
  const id=String(unit).padStart(2,"0");
  const rel=`units/unit-${id}/assessment/mastery-check.html`;
  ok(fs.existsSync(path.join(root,rel)),`Unit ${id} mastery check exists`);
  if(!fs.existsSync(path.join(root,rel)))continue;
  const config=extractAssessmentConfig(fs.readFileSync(path.join(root,rel),"utf8"),id);
  if(!config)continue;
  ok(config.threshold===80,`Unit ${id} mastery threshold remains 80%`);
  ok(Array.isArray(config.questions)&&config.questions.length>=20,`Unit ${id} mastery check has at least 20 scored items`);
  ok(Array.isArray(config.reasoning_prompts)&&config.reasoning_prompts.length>=2,`Unit ${id} includes at least two written reasoning prompts`);
  const unitPrompts=(config.questions||[]).map(q=>String(q.prompt||"").trim().toLowerCase());
  ok(new Set(unitPrompts).size===unitPrompts.length,`Unit ${id} mastery prompts are unique within the unit`);
}

const depthContext={window:{}};
vm.createContext(depthContext);
const examDepthPath=path.join(root,"assessments/assets/exam-depth-v2.js");
ok(fs.existsSync(examDepthPath),"cumulative exam depth configuration exists");
if(fs.existsSync(examDepthPath))vm.runInContext(fs.readFileSync(examDepthPath,"utf8"),depthContext,{filename:"exam-depth-v2.js"});
const examDepth=depthContext.window.KhaemenesPreAlgebraExamDepth||{};
const mid=examDepth["KH-MATH-PA-MIDTERM-U01-U07"];
const fin=examDepth["KH-MATH-PA-FINAL-36W"];
ok(mid?.constructed?.length===7,"midterm requires seven constructed responses across Units 01-07");
ok(fin?.constructed?.length===10,"final requires ten cross-domain constructed responses");
for(const [label,config] of [["midterm",mid],["final",fin]]){
  if(!config)continue;
  ok(config.selected_weight===70&&config.constructed_weight===30,`${label} uses 70/30 selected-response / constructed-response weighting`);
  ok(config.rubric_max===4&&Array.isArray(config.rubric)&&config.rubric.length===5,`${label} exposes a five-level 0-4 reasoning rubric`);
  ok(Number(config.response_min_chars)>=40,`${label} requires substantive constructed-response text before submission`);
  const crPrompts=(config.constructed||[]).map(x=>String(x.prompt||"").trim().toLowerCase());
  ok(new Set(crPrompts).size===crPrompts.length,`${label} constructed-response prompts are unique`);
  ok((config.constructed||[]).every(x=>typeof x.domain==="string"&&x.domain.trim()&&typeof x.prompt==="string"&&x.prompt.trim().length>80),`${label} constructed-response tasks contain domain labels and substantive prompts`);
}

const examEngine=fs.readFileSync(path.join(root,"assessments/assets/exam-engine.js"),"utf8");
ok(examEngine.includes('exam-depth-v2.js'),"cumulative exam engine loads the depth configuration");
ok(examEngine.includes('Constructed-Response Depth Evidence')&&examEngine.includes('Evaluator Review'),"cumulative exam engine renders reasoning evidence and evaluator review");
ok(examEngine.includes('selected>=threshold&&constructedPercent>=threshold&&overall>=threshold'),"full cumulative mastery requires 80% selected-response, 80% constructed-response, and 80% overall");
ok(examEngine.includes('pending-evaluator-review')&&examEngine.includes('review_complete'),"cumulative result distinguishes auto-score from completed evaluator review");

const map=JSON.parse(fs.readFileSync(path.join(root,"assessments/assessment-map.json"),"utf8"));
ok(map.schema_version==="3.0"&&map.mastery_threshold===80,"assessment map declares v3 depth alignment and 80% mastery");
ok(map.weekly_mastery?.weeks===36&&map.weekly_mastery?.questions_per_week===10&&map.weekly_mastery?.total_unique_prompts===360,"assessment map records 36 × 10 weekly alignment");
ok(map.cumulative_scoring?.selected_response_weight===70&&map.cumulative_scoring?.constructed_response_weight===30,"assessment map matches cumulative 70/30 weighting");
ok(map.cumulative_scoring?.mastery_requires?.selected_response_percent===80&&map.cumulative_scoring?.mastery_requires?.constructed_response_percent===80&&map.cumulative_scoring?.mastery_requires?.overall_percent===80,"assessment map matches the three-part 80% cumulative rule");
ok(map.assessments?.[0]?.constructed_responses===7&&map.assessments?.[1]?.constructed_responses===10,"assessment map matches midterm/final constructed-response counts");

const sw=fs.readFileSync(path.join(root,"service-worker.js"),"utf8");
ok(sw.includes('v3-assessment-depth'),"service worker cache version advances for assessment depth");
for(const rel of ["prealgebra-assessment-depth-v2.js",...parts.map(path.basename),"exam-engine.js","exam-depth-v2.js"]){
  ok(sw.includes(rel),`offline cache includes ${rel}`);
}

if(failures){
  console.error(`Pre-Algebra assessment-depth validation failed: ${failures} problem(s).`);
  process.exit(1);
}
console.log("Pre-Algebra assessment-depth validation passed: 36 weekly checks / 360 unique prompts, unit reasoning coverage, mixed-evidence cumulative mastery, and offline assessment assets.");
