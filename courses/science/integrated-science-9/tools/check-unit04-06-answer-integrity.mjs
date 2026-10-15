import fs from "node:fs";import vm from "node:vm";
const base=new URL("../units/",import.meta.url);
for(let u=4;u<=6;u++)for(const file of ["quiz-app.js","assessment-app.js"]){
const n=String(u).padStart(2,"0"),p="unit-"+n+"/"+file,s=fs.readFileSync(new URL(p,base),"utf8");new vm.Script(s,{filename:p});
const match=/const\s+(?:QUIZ_QUESTIONS|ASSESSMENT_QUESTIONS)\s*=\s*\[/.exec(s);if(!match)throw Error(p+" bank missing");
const start=match.index+match[0].length-1,end=s.indexOf("];",start);if(end<0)throw Error(p+" array malformed");
const rows=JSON.parse(s.slice(start,end+1)),expected=file==="quiz-app.js"?20:30;
if(rows.length!==expected)throw Error(p+" count "+rows.length);
const counts=[0,0,0,0];for(const q of rows){if(!Array.isArray(q.options)||q.options.length!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||typeof q.explanation!=="string"||!q.explanation.trim())throw Error(p+" invalid item");counts[q.answer]++;}
if(Math.max(...counts)-Math.min(...counts)>1)throw Error(p+" position bias "+counts);
console.log("PASS "+p+" "+counts.join("/"));
}