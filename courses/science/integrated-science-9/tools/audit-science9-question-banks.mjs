import fs from "node:fs";import vm from "node:vm";
const base=new URL("../units/",import.meta.url);
let banks=0,questions=0;const findings=[];
function extract(source,file){
 const m=/\bconst\s+(?:QUIZ_QUESTIONS|ASSESSMENT_QUESTIONS|QUIZ|ASSESS)\s*=\s*\[/.exec(source);
 if(!m){findings.push(file+": named question array not found");return null;}
 const begin=m.index+m[0].length-1;let depth=0,quote=null,escaped=false;
 for(let i=begin;i<source.length;i++){
  const ch=source[i];
  if(quote){if(escaped)escaped=false;else if(ch==="\\")escaped=true;else if(ch===quote)quote=null;continue;}
  if(ch==='"'||ch==="'"){quote=ch;continue;}
  if(ch==="[")depth++;else if(ch==="]"){depth--;if(depth===0)return vm.runInNewContext(source.slice(begin,i+1),Object.create(null),{timeout:1000});}
 }
 findings.push(file+": unmatched array");return null;
}
for(let u=1;u<=12;u++){
 const n=String(u).padStart(2,"0");
 for(const file of ["quiz-app.js","assessment-app.js"]){
  const relative="unit-"+n+"/"+file;
  const source=fs.readFileSync(new URL(relative,base),"utf8");
  new vm.Script(source,{filename:relative});
  const rows=extract(source,relative);if(!rows)continue;
  banks++;questions+=rows.length;
  const expected=u===1?(file==="quiz-app.js"?15:24):(file==="quiz-app.js"?20:30);
  if(rows.length!==expected)findings.push(relative+": expected "+expected+" questions, found "+rows.length);
  const seen=new Set();
  rows.forEach((q,i)=>{if(typeof q.id!=="string"||seen.has(q.id))findings.push(relative+" question "+i+": duplicate/missing id");seen.add(q.id);if(typeof q.prompt!=="string"||!q.prompt.trim()||!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length||typeof q.explanation!=="string"||!q.explanation.trim())findings.push(relative+" question "+i+": malformed answer or explanation");});
 }
}
console.log(JSON.stringify({banks,questions,structuralFindings:findings.slice(0,40),findingCount:findings.length},null,2));
if(findings.length)process.exitCode=1;
