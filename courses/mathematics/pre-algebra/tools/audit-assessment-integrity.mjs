import fs from "node:fs";
import vm from "node:vm";
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

const readiness=readJson("diagnostic/readiness-assessment-v3.json");
const diagnosticQuestions=(readiness.questions||[]).map(q=>({prompt:q.prompt,options:q.options,answer:q.answer_index,explanation:q.explanation,domain:q.strand||q.domain}));
inspectQuestions("Readiness diagnostic",diagnosticQuestions);
if(readiness.question_count!==diagnosticQuestions.length)fail(`Readiness diagnostic: declared count ${readiness.question_count} differs from ${diagnosticQuestions.length} questions`);
if(diagnosticQuestions.length!==30)fail(`Readiness diagnostic: ${diagnosticQuestions.length} questions, expected 30 in v3`);
if(Number(readiness.mastery_threshold_percent||readiness.mastery_threshold)!==80)fail("Readiness diagnostic mastery threshold must be 80%");
notes.push(`Readiness diagnostic v3: ${diagnosticQuestions.length} stable-ID placement questions before Unit 01`);

// Cumulative exams use the current QUESTIONS + DEPTH + CONFIG layout, not
// the retired window.EXAM_CONFIG format used by unit assessment pages.
// Inspect the existing public banks without changing assessment execution.
const assessmentMap=readJson("assessments/assessment-map.json");
function cumulativeExam(relative){
  const source=fs.readFileSync(path.join(courseRoot,relative),"utf8");
  const questionsMatch=source.match(/const\s+QUESTIONS\s*=\s*(\[[^\n]*\]);/);
  const depthMatch=source.match(/const\s+DEPTH\s*=\s*(\{[^\n]*\});/);
  const configMatch=source.match(/const\s+CONFIG\s*=\s*(\{[\s\S]*?\});/);
  if(!questionsMatch||!depthMatch||!configMatch)throw new Error(relative+": missing current cumulative assessment declarations");
  const questions=JSON.parse(questionsMatch[1]);
  const depth=JSON.parse(depthMatch[1]);
  // CONFIG is a self-contained object literal, not a complete executable page.
  const config=vm.runInNewContext("("+configMatch[1]+")",Object.create(null),{timeout:300});
  return {questions,depth,config};
}
for(const record of assessmentMap.assessments){
  const {questions,depth,config}=cumulativeExam("assessments/"+record.path);
  inspectQuestions(record.id,questions);
  if(questions.length!==record.selected_response_questions)fail(record.id+": selected-response map count does not match live bank ("+questions.length+")");
  if(depth.constructed?.length!==record.constructed_responses)fail(record.id+": constructed-response map count differs from live exam");
  if(config.id!==record.canonical_assessment_id)fail(record.id+": canonical cumulative ID differs from live exam");
  if(config.mastery_threshold!==80)fail(record.id+": cumulative threshold must remain 80%");
  if(config.result_key!==record.result_key)fail(record.id+": current result key differs from live exam");
  if(config.legacy_result_key!==record.legacy_result_key)fail(record.id+": legacy result key must remain documented");
  if(config.selected_weight!==70||config.constructed_weight!==30||
      depth.selected_weight!==70||depth.constructed_weight!==30)fail(record.id+": cumulative 70/30 evidence weights changed");
  if(depth.rubric_max!==4||!Number.isInteger(depth.response_min_chars)||depth.response_min_chars<40)fail(record.id+": written-response rubric or minimum length invalid");
  const covered=[...new Set(questions.map(question=>question.unit))].sort((a,b)=>a-b);
  const expected=record.id.includes("MIDTERM")?Array.from({length:7},(_,index)=>index+1):Array.from({length:13},(_,index)=>index+1);
  if(JSON.stringify(covered)!==JSON.stringify(expected))fail(record.id+": unit coverage differs: "+covered.join(", "));
  notes.push(record.id+": "+questions.length+" selected items and "+depth.constructed.length+" written tasks over units "+covered[0]+"–"+covered.at(-1));
}

if(failures.length){
  console.error(`Assessment integrity audit failed (${failures.length}):`);
  failures.forEach(message=>console.error(`- ${message}`));
  process.exit(1);
}

console.log("Assessment integrity audit passed.");
notes.forEach(note=>console.log(`OK ${note}`));
