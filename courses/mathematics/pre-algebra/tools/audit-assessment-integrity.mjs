import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
const notes=[];
const fail=message=>failures.push(message);

function readJson(relative){
  return JSON.parse(fs.readFileSync(path.join(courseRoot,relative),"utf8"));
}

function embeddedConfig(relative,name){
  const source=fs.readFileSync(path.join(courseRoot,relative),"utf8");
  const marker=new RegExp(`window\\.${name}\\s*=`).exec(source);
  if(!marker)throw new Error(`${relative}: ${name} was not found`);
  const objectStart=source.indexOf("{",marker.index+marker[0].length);
  let depth=0,inString=false,escaped=false;
  for(let index=objectStart;index<source.length;index++){
    const character=source[index];
    if(inString){
      if(escaped)escaped=false;
      else if(character==="\\")escaped=true;
      else if(character==='"')inString=false;
      continue;
    }
    if(character==='"'){inString=true;continue;}
    if(character==="{")depth++;
    if(character==="}"&&--depth===0)return JSON.parse(source.slice(objectStart,index+1));
  }
  throw new Error(`${relative}: ${name} is not a complete object`);
}

function embeddedArray(relative,name){
  const source=fs.readFileSync(path.join(courseRoot,relative),"utf8");
  const marker=new RegExp(`const\\s+${name}\\s*=`).exec(source);
  if(!marker)throw new Error(`${relative}: ${name} was not found`);
  const arrayStart=source.indexOf("[",marker.index+marker[0].length);
  let depth=0,inString=false,escaped=false;
  for(let index=arrayStart;index<source.length;index++){
    const character=source[index];
    if(inString){
      if(escaped)escaped=false;
      else if(character==="\\")escaped=true;
      else if(character==='"')inString=false;
      continue;
    }
    if(character==='"'){inString=true;continue;}
    if(character==="[")depth++;
    if(character==="]"&&--depth===0)return JSON.parse(source.slice(arrayStart,index+1));
  }
  throw new Error(`${relative}: ${name} is not a complete array`);
}

function inspectQuestions(label,questions){
  if(!Array.isArray(questions)||questions.length===0){fail(`${label}: no questions`);return;}
  questions.forEach((question,index)=>{
    const item=`${label} question ${index+1}`;
    if(!String(question.prompt||"").trim())fail(`${item}: missing prompt`);
    if(!Array.isArray(question.options)||question.options.length!==4)fail(`${item}: expected four options`);
    else if(new Set(question.options.map(value=>String(value).trim().toLocaleLowerCase())).size!==question.options.length)fail(`${item}: duplicate answer choices`);
    if(!Number.isInteger(question.answer)||question.answer<0||question.answer>=(question.options?.length||0))fail(`${item}: invalid answer index`);
    if(!String(question.explanation||"").trim())fail(`${item}: missing explanation`);
    if(!String(question.domain||"").trim())fail(`${item}: missing domain`);
  });
}

for(let unit=1;unit<=13;unit++){
  const id=String(unit).padStart(2,"0");
  const relative=`units/unit-${id}/assessment/mastery-check.html`;
  const config=embeddedConfig(relative,"ASSESSMENT_CONFIG");
  const map=readJson(`units/unit-${id}/unit-map.json`);
  inspectQuestions(`Unit ${id} mastery check`,config.questions);
  if(config.threshold!==80)fail(`Unit ${id}: live threshold is ${config.threshold}, expected 80`);
  if(map.assessment?.threshold!==80)fail(`Unit ${id}: unit-map mastery threshold is ${map.assessment?.threshold}, expected 80`);
  const expectedCount=map.assessment?.questions??config.questions.length;
  if(config.questions.length!==expectedCount)fail(`Unit ${id}: ${config.questions.length} mastery questions, unit map declares ${expectedCount}`);
  if(!String(config.assessment_note||"").includes("80%"))fail(`Unit ${id}: assessment note does not state 80%`);
  notes.push(`Unit ${id}: ${config.questions.length} questions at ${config.threshold}%`);
}

const diagnosticQuestions=embeddedArray("diagnostic/index.html","QUESTIONS");
inspectQuestions("Readiness diagnostic",diagnosticQuestions);
if(diagnosticQuestions.length!==20)fail(`Readiness diagnostic: ${diagnosticQuestions.length} questions, expected 20`);
notes.push(`Readiness diagnostic: ${diagnosticQuestions.length} ungraded placement questions before Unit 01`);

const assessmentMap=readJson("assessments/assessment-map.json");
for(const record of assessmentMap.assessments){
  const config=embeddedConfig(`assessments/${record.path}`,"EXAM_CONFIG");
  inspectQuestions(record.id,config.questions);
  if(config.question_count!==config.questions.length)fail(`${record.id}: embedded count ${config.question_count} does not match ${config.questions.length} questions`);
  if(record.questions!==config.questions.length)fail(`${record.id}: assessment-map count ${record.questions} does not match ${config.questions.length} questions`);
  if(config.mastery_threshold!==80)fail(`${record.id}: mastery threshold is ${config.mastery_threshold}, expected 80`);
  if(config.result_key!==record.result_key)fail(`${record.id}: result key differs from assessment map`);
  const covered=[...new Set(config.questions.map(question=>question.unit))].sort((a,b)=>a-b);
  const expected=record.id.includes("MIDTERM")?Array.from({length:7},(_,index)=>index+1):Array.from({length:13},(_,index)=>index+1);
  if(JSON.stringify(covered)!==JSON.stringify(expected))fail(`${record.id}: unit coverage is ${covered.join(", ")}, expected ${expected.join(", ")}`);
  notes.push(`${record.id}: ${config.questions.length} questions covering units ${covered[0]}–${covered.at(-1)}`);
}

if(failures.length){
  console.error(`Assessment integrity audit failed (${failures.length}):`);
  failures.forEach(message=>console.error(`- ${message}`));
  process.exit(1);
}

console.log("Assessment integrity audit passed.");
notes.forEach(note=>console.log(`OK ${note}`));
