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

if(failures){
  console.error(`Pre-Algebra assessment-depth validation failed: ${failures} problem(s).`);
  process.exit(1);
}
console.log("Pre-Algebra assessment-depth validation passed: 36 weeks, 360 unique aligned questions, 8-of-10 mastery contract.");
