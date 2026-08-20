import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
let terms=0,references=0,frameworks=0;
const fail=message=>failures.push(message);
const readJson=relative=>JSON.parse(fs.readFileSync(path.join(courseRoot,relative),"utf8"));
const exists=relative=>fs.existsSync(path.join(courseRoot,relative));

function lessonData(relative){
  const source=fs.readFileSync(path.join(courseRoot,relative),"utf8"),marker=/window\.LESSON_DATA\s*=/.exec(source);
  if(!marker)throw new Error(`${relative}: LESSON_DATA missing`);
  const start=source.indexOf("{",marker.index+marker[0].length);
  let depth=0,inString=false,escaped=false;
  for(let index=start;index<source.length;index++){
    const character=source[index];
    if(inString){if(escaped)escaped=false;else if(character==="\\")escaped=true;else if(character==='"')inString=false;continue;}
    if(character==='"'){inString=true;continue;}
    if(character==="{")depth++;
    if(character==="}"&&--depth===0)return JSON.parse(source.slice(start,index+1));
  }
  throw new Error(`${relative}: LESSON_DATA incomplete`);
}

for(let number=1;number<=13;number++){
  const id=String(number).padStart(2,"0"),base=`units/unit-${id}`,map=readJson(`${base}/unit-map.json`),vocabulary=readJson(`${base}/vocabulary.json`),standards=readJson(`${base}/standards-map.json`);
  for(const required of ["teacher-guide.html","family-guide.html","standards-map.json","vocabulary.json","worksheets/index.html"])if(!exists(`${base}/${required}`))fail(`Unit ${id}: missing ${required}`);
  const projectFiles=fs.readdirSync(path.join(courseRoot,base,"projects")).filter(file=>file.endsWith(".html"));
  if(projectFiles.length!==1)fail(`Unit ${id}: expected one project, found ${projectFiles.length}`);
  if(!vocabulary||!vocabulary.languages||!Array.isArray(vocabulary.terms))fail(`Unit ${id}: vocabulary schema is not {languages, terms}`);
  else{
    const languageIds=Object.keys(vocabulary.languages),ids=new Set();
    for(const term of vocabulary.terms){
      terms++;
      if(!term.id||ids.has(term.id))fail(`Unit ${id}: missing or duplicate vocabulary id ${term.id||"(blank)"}`);
      ids.add(term.id);
      for(const field of ["en","definition",...languageIds.filter(language=>language!=="en")])if(!String(term[field]??"").trim())fail(`Unit ${id}: ${term.id} missing ${field}`);
    }
    for(const lesson of map.lessons||[]){
      const data=lessonData(`${base}/${lesson.file}`);
      for(const vocabId of data.vocab_ids||[]){references++;if(!ids.has(vocabId))fail(`Unit ${id} lesson ${lesson.number}: unknown vocabulary id ${vocabId}`);}
    }
  }
  const standardBody=standards.frameworks||standards.standards||standards.universal_competencies||standards.universal;
  if(!standardBody||(Array.isArray(standardBody)&&standardBody.length===0)||(typeof standardBody==="object"&&!Array.isArray(standardBody)&&Object.keys(standardBody).length===0))fail(`Unit ${id}: standards framework is empty`);
  else frameworks+=Array.isArray(standardBody)?standardBody.length:Object.keys(standardBody).length;
  const support=map.support_resources;
  if(!support)fail(`Unit ${id}: unit map lacks normalized support_resources metadata`);
  else for(const [key,file] of Object.entries(support))if(!exists(`${base}/${file}`))fail(`Unit ${id}: support_resources.${key} points to missing ${file}`);
}

if(failures.length){
  console.error(`Academic support audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Academic support audit passed: ${terms} multilingual terms, ${references} lesson vocabulary references, ${frameworks} standards frameworks, 13 projects, 26 teacher/family guides.`);
