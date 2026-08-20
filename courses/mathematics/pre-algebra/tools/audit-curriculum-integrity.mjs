import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
let lessonCount=0,questionCount=0;
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
if(courseMap.units?.length!==14)fail(`Course map has ${courseMap.units?.length} entries, expected diagnostic plus 13 units`);
const mappedWeeks=(courseMap.units||[]).reduce((sum,unit)=>sum+Number(unit.weeks||0),0);
if(mappedWeeks!==36)fail(`Mapped duration totals ${mappedWeeks}, expected 36 weeks`);
if(courseMap.units?.[0]?.number!==0||courseMap.units?.[0]?.path!=="diagnostic/")fail("Unit 00 readiness diagnostic is not first in the course map");

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
    else data.questions.forEach((question,questionIndex)=>{questionCount++;inspectQuestion(label,question,questionIndex);});
  });
}

if(failures.length){
  console.error(`Curriculum integrity audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Curriculum integrity audit passed: 36 weeks, 13 instructional units, ${lessonCount} lessons, ${questionCount} lesson-bank questions.`);
