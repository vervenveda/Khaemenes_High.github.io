import fs from "node:fs";import vm from "node:vm";
const root=new URL("../units/",import.meta.url);let total=0;
for(let u=10;u<=12;u++)for(const file of ["quiz-app.js","assessment-app.js"]){
const name="unit-"+u+"/"+file,s=fs.readFileSync(new URL(name,root),"utf8");new vm.Script(s,{filename:name});
const match=/const\s+(QUIZ_QUESTIONS|ASSESSMENT_QUESTIONS)\s*=\s*\[/.exec(s);
if(!match)throw Error(name+" bank missing");const start=match.index+match[0].length-1,end=s.indexOf("];",start),rows=JSON.parse(s.slice(start,end+1));
const expected=file==="quiz-app.js"?20:30;if(rows.length!==expected)throw Error(name+" count mismatch");
const positions=[0,0,0,0],ids=new Set();
for(const q of rows){if(ids.has(q.id)||typeof q.prompt!=="string"||!q.prompt.trim()||!Array.isArray(q.options)||q.options.length!==4||q.options.some(o=>typeof o!=="string"||!o.trim())||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||typeof q.explanation!=="string"||!q.explanation.trim())throw Error(name+" invalid "+q.id);ids.add(q.id);positions[q.answer]++;}
if(Math.max(...positions)-Math.min(...positions)>1)throw Error(name+" biased answer placement");
total+=rows.length;console.log("PASS "+name+" "+rows.length+" questions; "+positions.join("/"));
}
if(total!==150)throw Error("Unexpected course question total "+total);
console.log("PASS Unit 10-12 answer-bank structural QA: "+total+" questions");
