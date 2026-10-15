import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..","units","unit-04");
let failures=0;
for(const [filename,bank,total,passMark,record] of [
  ["quiz-app.js","QUIZ_QUESTIONS",20,16,"quiz"],
  ["assessment-app.js","ASSESSMENT_QUESTIONS",30,24,"assessment"]
]){
  const source=fs.readFileSync(path.join(root,filename),"utf8");
  const ctx=vm.createContext({document:{addEventListener(){}}});
  let questions;
  try { questions=vm.runInContext(source+";"+bank,ctx,{timeout:1500}); }
  catch(e){console.error(filename+": cannot load question bank: "+e.message);failures++;continue;}
  if(!Array.isArray(questions)||questions.length!==total){console.error(filename+": expected "+total+" questions");failures++;continue;}
  const seen=new Set();
  questions.forEach((q,i)=>{
    if(!q.id||seen.has(q.id)||!q.prompt||!Array.isArray(q.options)||q.options.length!==4||
       !Number.isInteger(q.answer)||q.answer<0||q.answer>=4||!q.options[q.answer]||!q.explanation){
      console.error(filename+": invalid question at index "+i);failures++;
    }
    seen.add(q.id);
  });
  if(!source.includes("bestScore:bestScore")||!source.includes("lastScore:score")||
     !source.includes("passed:bestScore>="+passMark)||
     !source.includes('S["'+record+'"]')){
      console.error(filename+": mastery-retake persistence contract missing");failures++;
  }
  if(!source.includes("attempts:(Number(p.attempts)||0)+1")){
    console.error(filename+": attempt tracking not retained");failures++;
  }
  console.log(filename+": "+questions.length+" items checked, "+passMark+"/"+total+" passing threshold, best-score contract checked.");
}
if(failures){console.error("Unit 04 mastery validation failed: "+failures);process.exit(1);}
console.log("Unit 04 mastery validation PASS (structural checks; does not replace browser testing).");
