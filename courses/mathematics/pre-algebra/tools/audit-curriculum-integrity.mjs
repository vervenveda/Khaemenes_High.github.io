import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
let lessonCount=0,questionCount=0;const promptOwners=new Map();
const fail=message=>failures.push(message);
const readJson=relative=>JSON.parse(fs.readFileSync(path.join(courseRoot,relative),"utf8"));

function lessonData(relative){
  const source=fs.readFileSync(path.join(courseRoot,relative),"utf8"),marker=/window\.LESSON_DATA\s*=/.exec(source);
  if(!marker)throw new Error(`${relative}: LESSON_DATA was not found`);
  const start=source.indexOf("{",marker.index+marker[0].length);
  let depth=0,inString=false,escaped=false;
  for(let index=start;index<source.length;index++){
    const character=source[index];
    if(inString){
      if(escaped)escaped=false;
      else if(character==="\\")escaped=true;
      else if(character==='"')inString=false;
      continue;
    }
    if(character==='"'){inString=true;continue;}
    if(character==="{")depth++;
    if(character==="}"&&--depth===0)return JSON.parse(source.slice(start,index+1));
  }
  throw new Error(`${relative}: LESSON_DATA is incomplete`);
}

function inspectQuestion(label,question,index){
  const item=`${label} question ${index+1}`;
  if(!String(question.prompt||"").trim())fail(`${item}: missing prompt`);
  if(!Array.isArray(question.options)||question.options.length!==4)fail(`${item}: expected four options`);
  else if(new Set(question.options.map(value=>String(value).trim().toLocaleLowerCase())).size!==4)fail(`${item}: duplicate choices`);
  if(!Number.isInteger(question.answer)||question.answer<0||question.answer>3)fail(`${item}: invalid answer index`);
  if(!String(question.explanation||"").trim())fail(`${item}: missing explanation`);
}

const courseMap=readJson("course-map.json");
if(courseMap.course?.duration_weeks!==36)fail(`Course duration is ${courseMap.course?.duration_weeks}, expected 36 weeks`);
if(courseMap.units?.length!==13)fail(`Course map has ${courseMap.units?.length} official instructional units, expected 13`);
const mappedWeeks=(courseMap.units||[]).reduce((sum,unit)=>sum+Number(unit.weeks||0),0);
if(mappedWeeks!==36)fail(`Official instructional duration totals ${mappedWeeks}, expected 36 weeks`);
if(courseMap.readiness_gateway?.path!=="diagnostic/")fail("Readiness gateway path is not diagnostic/");
if(courseMap.readiness_gateway?.counts_toward_official_duration!==false)fail("Readiness gateway must not count toward the official 36-week duration");
if(courseMap.conditional_unit_0?.number!==0||courseMap.conditional_unit_0?.path!=="units/unit-00/")fail("Conditional Unit 0 is not declared separately from official Units 1–13");
if(courseMap.conditional_unit_0?.counts_toward_official_duration!==false)fail("Conditional Unit 0 must not count toward the official 36-week duration");

for(let number=1;number<=13;number++){
  const id=String(number).padStart(2,"0"),courseUnit=courseMap.units.find(unit=>unit.number===number),unitMap=readJson(`units/unit-${id}/unit-map.json`);
  if(!courseUnit){fail(`Unit ${id}: missing from course map`);continue;}
  if(unitMap.unit?.number!==number)fail(`Unit ${id}: unit-map number is ${unitMap.unit?.number}`);
  if(unitMap.unit?.title!==courseUnit.title)fail(`Unit ${id}: title differs between course map and unit map`);
  if(unitMap.unit?.duration_weeks!==courseUnit.weeks)fail(`Unit ${id}: duration ${unitMap.unit?.duration_weeks} differs from course-map ${courseUnit.weeks}`);
  const mappedLessons=unitMap.lessons||[],lessonDirectory=path.join(courseRoot,`units/unit-${id}/lessons`);
  const actualFiles=fs.readdirSync(lessonDirectory).filter(file=>file.endsWith(".html")).sort();
  const declaredFiles=mappedLessons.map(lesson=>lesson.file?.replace(/^lessons\//,"")).sort();
  if(JSON.stringify(actualFiles)!==JSON.stringify(declaredFiles))fail(`Unit ${id}: lesson files differ from unit-map inventory`);
  mappedLessons.forEach((lesson,index)=>{
    const relative=`units/unit-${id}/${lesson.file}`,data=lessonData(relative),label=`Unit ${id} lesson ${index+1}`;
    lessonCount++;
    if(data.number!==lesson.number)fail(`${label}: embedded number ${data.number} differs from map ${lesson.number}`);
    if(data.title!==lesson.title)fail(`${label}: embedded title differs from unit map`);
    if(lesson.number!==index+1)fail(`${label}: lesson numbering is not consecutive`);
    if(!Array.isArray(data.objectives)||data.objectives.length<3)fail(`${label}: fewer than three objectives`);
    if(!Array.isArray(data.questions)||data.questions.length!==20)fail(`${label}: ${data.questions?.length} questions, expected 20`);
    else data.questions.forEach((question,questionIndex)=>{questionCount++;inspectQuestion(label,question,questionIndex);const normalizedPrompt=String(question.prompt||"").trim().toLocaleLowerCase().replace(/\s+/g," ");if(promptOwners.has(normalizedPrompt))fail(`${label}: duplicate prompt also used by ${promptOwners.get(normalizedPrompt)}`);else promptOwners.set(normalizedPrompt,label);});
  });
}

const refresherMap=readJson("units/unit-00/unit-map.json");
if(refresherMap.unit?.number!==0||refresherMap.unit?.conditional!==true)fail("Unit 0 bridge map must declare a conditional Unit 0");
if(refresherMap.unit?.duration_weeks!==6)fail(`Unit 0 duration is ${refresherMap.unit?.duration_weeks}, expected 6 weeks`);
if(refresherMap.unit?.lesson_mastery_threshold_percent!==80||refresherMap.unit?.weekly_quiz_threshold_percent!==80)fail("Unit 0 lesson and weekly quiz thresholds must both be 80%");
const refresherLessons=refresherMap.lessons||[],refresherDirectory=path.join(courseRoot,"units/unit-00/lessons");
const refresherFiles=fs.readdirSync(refresherDirectory).filter(file=>file.endsWith(".html")).sort();
const declaredRefresherFiles=refresherLessons.map(lesson=>lesson.file?.replace(/^lessons\//,"")).sort();
if(JSON.stringify(refresherFiles)!==JSON.stringify(declaredRefresherFiles))fail("Unit 0 lesson files differ from unit-map inventory");
refresherLessons.forEach((lesson,index)=>{
  const relative=`units/unit-00/${lesson.file}`,source=fs.readFileSync(path.join(courseRoot,relative),"utf8"),match=/window\.REFRESHER_WEEK\s*=\s*\{([\s\S]*?)\}/.exec(source),label=`Unit 00 lesson ${index+1}`;
  if(!match){fail(`${label}: REFRESHER_WEEK contract was not found`);return;}
  const block=match[1],value=(key)=>new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`).exec(block)?.[1]||"";
  if(Number(value("week"))!==lesson.week)fail(`${label}: embedded week differs from unit map`);
  if(value("title")!==lesson.title)fail(`${label}: embedded title differs from unit map`);
  if(!source.includes('src="../assets/refresher-engine.js"'))fail(`${label}: refresher engine is not loaded`);
  if(!fs.existsSync(path.join(courseRoot,relative.replace(/\.html$/,".md"))))fail(`${label}: paired Markdown lesson is missing`);
  if(lesson.lesson_questions!==20||lesson.weekly_quiz_questions!==10)fail(`${label}: Unit 0 question contract is not 20 lesson / 10 weekly`);
});
if(failures.length){
  console.error(`Curriculum integrity audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Curriculum integrity audit passed: 36 weeks, 13 instructional units, ${lessonCount} lessons, ${questionCount} lesson-bank questions.`);
