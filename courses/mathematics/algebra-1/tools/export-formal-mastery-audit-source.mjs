import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=rel=>fs.readFileSync(path.join(ROOT,rel),'utf8');
const execute=(rel,ctx)=>{vm.createContext(ctx);vm.runInContext(read(rel),ctx,{filename:rel});return ctx};
const unitId=n=>String(n).padStart(2,'0');

function dedicatedData(unit){
  const id=unitId(unit),ctx={window:{}};
  execute(`units/unit-${id}/assets/unit${id}-data.js`,ctx);
  return Object.values(ctx.window).find(v=>v&&Number(v?.unit?.number)===unit&&Array.isArray(v.questions));
}

function dedicatedIds(unit){
  const id=unitId(unit),rel=unit===1?`units/unit-${id}/assets/unit${id}.js`:`units/unit-${id}/assets/unit${id}-core.js`,text=read(rel);
  const match=text.match(/const\s+[A-Z_]+\s*=\s*(\[(?:"u\d{2}-l\d{2}-q\d+"\s*,?\s*)+\]);?\s*function\s+mastery/);
  if(!match)throw new Error(`Could not find formal mastery id array for Unit ${id}`);
  return JSON.parse(match[1]);
}

function normalize(q,source){return {id:q.id,unit:Number(q.unit??source.unit),lesson:Number(q.lesson),prompt:q.prompt,options:q.options,answer:Number(q.answer),explanation:q.explanation,source};}

const units={};
for(let unit=1;unit<=9;unit++){
  const data=dedicatedData(unit),ids=dedicatedIds(unit),byId=new Map(data.questions.map(q=>[q.id,q]));
  const items=ids.map(id=>{const q=byId.get(id);if(!q)throw new Error(`Missing ${id} in Unit ${unitId(unit)} data`);return normalize(q,{architecture:'dedicated-fixed',unit});});
  units[String(unit)]={unit,count:items.length,architecture:'dedicated-fixed',items};
}

const shared={window:{}};
execute('course-data.js',shared);execute('assets/question-bank.js',shared);
const D=shared.window.ALGEBRA1_DATA,Q=shared.window.ALGEBRA1_QUESTIONS;
if(!D||!Array.isArray(Q))throw new Error('Shared late-unit Algebra I data did not load');
const ranked=items=>[...items].sort((a,b)=>((Number(b.difficulty)||0)-(Number(a.difficulty)||0))||String(a.id||'').localeCompare(String(b.id||'')));
for(let unit=10;unit<=13;unit++){
  const lessons=D.lessons.filter(l=>Number(l.unit)===unit),COUNT=20,base=Math.floor(COUNT/lessons.length),remainder=COUNT%lessons.length,out=[],used=new Set();
  lessons.forEach((lesson,i)=>{const need=base+(i<remainder?1:0),pool=ranked(Q.filter(q=>Number(q.unit)===unit&&Number(q.lesson)===Number(lesson.number)));pool.slice(0,need).forEach(q=>{out.push(q);used.add(q.id);});});
  if(out.length<COUNT)ranked(Q.filter(q=>Number(q.unit)===unit&&!used.has(q.id))).slice(0,COUNT-out.length).forEach(q=>out.push(q));
  const items=out.slice(0,COUNT).map(q=>normalize(q,{architecture:'shared-lesson-balanced-v2',unit}));
  if(items.length!==20||!lessons.every(l=>items.some(q=>q.lesson===Number(l.number))))throw new Error(`Unit ${unitId(unit)} formal blueprint is incomplete`);
  units[String(unit)]={unit,count:items.length,architecture:'shared-lesson-balanced-v2',items};
}

const total=Object.values(units).reduce((n,u)=>n+u.count,0);
const output={schema:'khaemenes-algebra1-formal-mastery-audit-source-v1',generated_at:new Date().toISOString(),course_id:'KH-MATH-A1',purpose:'Reconstruct the exact formal unit mastery item set for independent mathematical key audit. This file is generated evidence only and does not alter course scoring.',units,total_items:total};
console.log(JSON.stringify(output,null,2));
