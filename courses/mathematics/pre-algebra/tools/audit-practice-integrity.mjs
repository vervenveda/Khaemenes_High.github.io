import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[],storageKeys=new Set();
let pages=0,questions=0;
const fail=message=>failures.push(message);

function embeddedConfig(relative){
  const source=fs.readFileSync(path.join(courseRoot,relative),"utf8"),marker=/window\.ASSESSMENT_CONFIG\s*=/.exec(source);
  if(!marker)throw new Error(`${relative}: ASSESSMENT_CONFIG missing`);
  const start=source.indexOf("{",marker.index+marker[0].length);
  let depth=0,inString=false,escaped=false;
  for(let index=start;index<source.length;index++){
    const character=source[index];
    if(inString){if(escaped)escaped=false;else if(character==="\\")escaped=true;else if(character==='"')inString=false;continue;}
    if(character==='"'){inString=true;continue;}
    if(character==="{")depth++;
    if(character==="}"&&--depth===0)return JSON.parse(source.slice(start,index+1));
  }
  throw new Error(`${relative}: ASSESSMENT_CONFIG incomplete`);
}

for(let number=1;number<=13;number++){
  const id=String(number).padStart(2,"0"),base=`units/unit-${id}`,map=JSON.parse(fs.readFileSync(path.join(courseRoot,base,"unit-map.json"),"utf8"));
  if(!Array.isArray(map.practice)||map.practice.length!==3){fail(`Unit ${id}: practice map must contain three pathway records`);continue;}
  for(const pathway of ["foundation","core","extended"]){
    const record=map.practice.find(item=>item.id===pathway);
    if(!record){fail(`Unit ${id}: missing ${pathway} practice metadata`);continue;}
    const expectedFile=`practice/${pathway}.html`;
    if(record.file!==expectedFile)fail(`Unit ${id} ${pathway}: map file is ${record.file}, expected ${expectedFile}`);
    if(record.questions!==20)fail(`Unit ${id} ${pathway}: map declares ${record.questions} questions, expected 20`);
    if(record.threshold!==80)fail(`Unit ${id} ${pathway}: map threshold is ${record.threshold}, expected 80`);
    const config=embeddedConfig(`${base}/${expectedFile}`);pages++;
    if(config.questions?.length!==20)fail(`Unit ${id} ${pathway}: live page has ${config.questions?.length} questions`);
    if(config.threshold!==80)fail(`Unit ${id} ${pathway}: live threshold is ${config.threshold}`);
    if(Boolean(config.show_hints)!==(pathway==="foundation"))fail(`Unit ${id} ${pathway}: hint policy is inconsistent`);
    if(!config.storage_key)fail(`Unit ${id} ${pathway}: missing storage key`);
    else if(storageKeys.has(config.storage_key))fail(`Unit ${id} ${pathway}: duplicate storage key ${config.storage_key}`);
    else storageKeys.add(config.storage_key);
    for(const [index,question] of (config.questions||[]).entries()){
      questions++;
      if(!question.prompt||!question.explanation)fail(`Unit ${id} ${pathway} question ${index+1}: missing prompt or explanation`);
      if(!Array.isArray(question.options)||question.options.length!==4)fail(`Unit ${id} ${pathway} question ${index+1}: expected four choices`);
      else if(new Set(question.options.map(value=>String(value).trim().toLowerCase())).size!==4)fail(`Unit ${id} ${pathway} question ${index+1}: duplicate choices`);
      if(!Number.isInteger(question.answer)||question.answer<0||question.answer>3)fail(`Unit ${id} ${pathway} question ${index+1}: invalid answer index`);
    }
  }
}

if(failures.length){
  console.error(`Practice integrity audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Practice integrity audit passed: ${pages} pathway pages, ${questions} questions, ${storageKeys.size} unique storage keys, 80% mastery throughout.`);
