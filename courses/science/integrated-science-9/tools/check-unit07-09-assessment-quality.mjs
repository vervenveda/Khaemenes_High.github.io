import fs from "node:fs";import vm from "node:vm";
const root=new URL("../units/",import.meta.url);
let total=0;
for(let u=7;u<=9;u++)for(const file of ["quiz-app.js","assessment-app.js"]){
 const name="unit-"+String(u).padStart(2,"0")+"/"+file;
 const src=fs.readFileSync(new URL(name,root),"utf8");new vm.Script(src,{filename:name});
 const m=/const\s+(QUIZ_QUESTIONS|ASSESSMENT_QUESTIONS)\s*=\s*\[/.exec(src);
 if(!m)throw Error(name+" question bank missing");
 const start=m.index+m[0].length-1,end=src.indexOf("];",start);
 const items=JSON.parse(src.slice(start,end+1)),expected=file==="quiz-app.js"?20:30;
 if(items.length!==expected)throw Error(name+" expected "+expected+" found "+items.length);
 const counts=[0,0,0,0],ids=new Set();
 for(const q of items){
  if(ids.has(q.id)||typeof q.prompt!=="string"||!q.prompt.trim()||!Array.isArray(q.options)||q.options.length!==4||q.options.some(x=>typeof x!=="string"||!x.trim())||!Number.isInteger(q.answer)||q.answer<0||q.answer>=4||typeof q.explanation!=="string"||!q.explanation.trim())throw Error(name+" malformed question "+q.id);
  ids.add(q.id);counts[q.answer]++;
 }
 if(Math.max(...counts)-Math.min(...counts)>1)throw Error(name+" answer-position bias "+counts);
 total+=items.length;console.log("PASS "+name+" "+items.length+" questions "+counts.join("/"));
}
if(total!==150)throw Error("Expected 150 questions, found "+total);
console.log("PASS Units 07-09 assessment structures and answer distribution: "+total+" questions.");
