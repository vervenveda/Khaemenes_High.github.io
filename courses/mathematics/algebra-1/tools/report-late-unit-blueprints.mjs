import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");
const context={window:{}};
vm.createContext(context);
vm.runInContext(read("course-data.js"),context,{filename:"course-data.js"});
vm.runInContext(read("assets/question-bank.js"),context,{filename:"assets/question-bank.js"});

const data=context.window.ALGEBRA1_DATA;
const questions=context.window.ALGEBRA1_QUESTIONS;
if(!data||!Array.isArray(data.lessons)||!Array.isArray(questions))throw new Error("Late-unit curriculum/question bank could not be loaded.");

function ranked(items){
 return [...items].sort((a,b)=>((Number(b.difficulty)||0)-(Number(a.difficulty)||0))||String(a.id||"").localeCompare(String(b.id||"")));
}
function blueprint(unit){
 const lessons=data.lessons.filter(l=>Number(l.unit)===unit);
 const count=20,base=Math.floor(count/lessons.length),remainder=count%lessons.length,out=[],used=new Set();
 lessons.forEach((lesson,index)=>{
  const need=base+(index<remainder?1:0);
  const pool=ranked(questions.filter(q=>Number(q.unit)===unit&&Number(q.lesson)===Number(lesson.number)));
  pool.slice(0,need).forEach(q=>{out.push(q);used.add(q.id)});
 });
 if(out.length<count){
  ranked(questions.filter(q=>Number(q.unit)===unit&&!used.has(q.id))).slice(0,count-out.length).forEach(q=>out.push(q));
 }
 return {lessons,items:out.slice(0,count)};
}

for(let unit=10;unit<=13;unit++){
 const {lessons,items}=blueprint(unit);
 if(items.length!==20||!lessons.every(l=>items.some(q=>Number(q.lesson)===Number(l.number))))throw new Error(`Unit ${unit} blueprint incomplete.`);
 console.log(`=== ALGEBRA I UNIT ${unit} FORMAL BLUEPRINT ===`);
 for(const [index,q] of items.entries()){
  console.log(JSON.stringify({
   position:index+1,
   id:q.id,
   lesson:q.lesson,
   difficulty:q.difficulty,
   prompt:q.prompt,
   options:q.options,
   answer:q.answer,
   answer_text:q.answer_text,
   explanation:q.explanation
  }));
 }
}
