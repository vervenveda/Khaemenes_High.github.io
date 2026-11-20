import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const base=path.join(root,"courses/language-arts/english-11/assessments");
const banned=[
  /only page numbers/i,/only the title/i,/only one test/i,/only a cover page/i,
  /only attendance/i,/copied answer key/i,/the price of a book/i
];

function readAssessment(rel){
  const file=fs.readFileSync(path.join(base,rel),"utf8");
  const m=file.match(/<script type="application\/json" id="assessment-data">([\s\S]*?)<\/script>/i);
  if(!m) throw new Error(rel+" missing assessment-data");
  const data=JSON.parse(m[1]);
  return {file,data};
}
function assert(cond,msg){if(!cond)throw new Error(msg)}
function validate(rel,expected,{maxSpread=2,minSkills=6}={}){
  const {data}=readAssessment(rel);
  assert(data.length===expected,rel+" expected "+expected+" questions, got "+data.length);
  const seen=new Set();
  const counts=[0,0,0,0];
  const skills=new Set();
  for(const [i,q] of data.entries()){
    assert(typeof q.question==="string"&&q.question.trim(),rel+" q"+(i+1)+" missing question");
    assert(Array.isArray(q.choices)&&q.choices.length===4,rel+" q"+(i+1)+" must have four choices");
    assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,rel+" q"+(i+1)+" invalid answer");
    assert(!seen.has(q.question),rel+" duplicate question: "+q.question);
    seen.add(q.question); counts[q.answer]++;
    if(q.skill)skills.add(q.skill);
    const joined=q.choices.join(" | ");
    for(const rx of banned) assert(!rx.test(joined),rel+" q"+(i+1)+" contains retired shallow distractor pattern "+rx);
    assert(q.source,rel+" q"+(i+1)+" missing source metadata");
  }
  const spread=Math.max(...counts)-Math.min(...counts);
  assert(spread<=maxSpread,rel+" answer-position spread too large: "+counts.join("/"));
  assert(skills.size>=minSkills,rel+" only "+skills.size+" distinct skills");
  return {rel,count:data.length,counts,skills:skills.size};
}

const results=[];
results.push(validate("diagnostic/index.html",15,{maxSpread:1,minSkills:10}));
for(let u=1;u<=12;u++)results.push(validate("unit-"+String(u).padStart(2,"0")+"/index.html",10,{maxSpread:3,minSkills:6}));
results.push(validate("midterm/index.html",30,{maxSpread:1,minSkills:20}));
results.push(validate("final/index.html",40,{maxSpread:0,minSkills:30}));

console.log("English 11 assessment quality: PASS");
for(const r of results)console.log(r.rel+": "+r.count+" questions; answers "+r.counts.join("/")+"; skills "+r.skills);
