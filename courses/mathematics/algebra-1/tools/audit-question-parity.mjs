import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'..');
const text=async p=>readFile(resolve(root,p),'utf8');
const exists=async p=>{try{await access(resolve(root,p));return true}catch{return false}};
let failures=0,warnings=0;
const ok=(c,m)=>{if(c)console.log(`OK ${m}`);else{failures++;console.error(`FAIL ${m}`)}};
const warn=(c,m)=>{if(c)console.log(`OK ${m}`);else{warnings++;console.warn(`WARN ${m}`)}};

console.log('\n=== Algebra I Effective Question Parity Audit ===\n');

const sandbox={window:{}};
vm.createContext(sandbox);
vm.runInContext(await text('assets/question-bank.js'),sandbox,{timeout:3000});
for(let n=1;n<=13;n++){
  const p=`assets/unit-${String(n).padStart(2,'0')}-content-upgrade.js`;
  if(await exists(p)) vm.runInContext(await text(p),sandbox,{timeout:3000});
}
const bank=sandbox.window.ALGEBRA1_QUESTIONS||[];
ok(Array.isArray(bank)&&bank.length>0,'effective runtime question bank loads after all content upgrades');

const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[“”‘’]/g,"'").replace(/\s+/g,' ').replace(/\s*([,;:.?!])\s*/g,'$1').trim();
const template=s=>normalize(s).replace(/-?\d+(?:\.\d+)?/g,'#').replace(/\b(?:x|y|a|b|m|n|r|t)\b/g,'v');
const groups=(items,keyFn)=>{const m=new Map();for(const q of items){const k=keyFn(q);if(!m.has(k))m.set(k,[]);m.get(k).push(q)}return [...m.values()].filter(g=>g.length>1)};

const exactNormalized=groups(bank,q=>normalize(q.prompt));
ok(exactNormalized.length===0,'no duplicate prompts remain after whitespace/case/punctuation normalization');
if(exactNormalized.length){
  for(const g of exactNormalized.slice(0,20)) console.error(`DUP ${g.map(q=>q.id).join(', ')} :: ${g[0].prompt}`);
}

const templateGroups=groups(bank,q=>template(q.prompt)).filter(g=>g.length>=3);
warn(templateGroups.length===0,'no heavy numeric/template prompt families (3+ structurally identical prompts)');
if(templateGroups.length){
  for(const g of templateGroups.slice(0,25)) console.warn(`TEMPLATE ${g.length}x U${g[0].unit} :: ${g.map(q=>q.id).join(', ')} :: ${g[0].prompt}`);
}

for(let unit=1;unit<=13;unit++){
  const items=bank.filter(q=>Number(q.unit)===unit);
  const pad=String(unit).padStart(2,'0');
  ok(items.length>0,`Unit ${pad} has effective scored items`);
  const ids=new Set(items.map(q=>q.id));
  const prompts=new Set(items.map(q=>normalize(q.prompt)));
  const skills=new Set(items.map(q=>q.skill).filter(Boolean));
  const cats=new Set(items.map(q=>q.category).filter(Boolean));
  ok(ids.size===items.length,`Unit ${pad} IDs are unique`);
  ok(prompts.size===items.length,`Unit ${pad} normalized prompts are unique`);
  warn(skills.size>=Math.min(5,items.length),`Unit ${pad} exposes at least five explicit skill labels where depth permits`);
  warn(cats.size>=Math.min(3,items.length),`Unit ${pad} exposes at least three content categories where depth permits`);
  const lessonMap=new Map();
  for(const q of items){const l=Number(q.lesson);if(!lessonMap.has(l))lessonMap.set(l,[]);lessonMap.get(l).push(q)}
  for(const [lesson,qs] of [...lessonMap.entries()].sort((a,b)=>a[0]-b[0])){
    const lessonPromptCount=new Set(qs.map(q=>normalize(q.prompt))).size;
    ok(lessonPromptCount===qs.length,`Unit ${pad} Lesson ${String(lesson).padStart(2,'0')} has no normalized prompt duplicates`);
    warn(qs.length>=5,`Unit ${pad} Lesson ${String(lesson).padStart(2,'0')} has at least 5 scored items`);
  }
  const answerCounts=[0,0,0,0];for(const q of items)if(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4)answerCounts[q.answer]++;
  const used=answerCounts.filter(Boolean).length;
  warn(used>=3,`Unit ${pad} answer keys use at least three choice positions`);
  console.log(`INFO Unit ${pad}: ${items.length} items · ${skills.size} skills · ${cats.size} categories · answer positions ${answerCounts.join('/')}`);
}

console.log(`\nQuestion parity audit complete: ${failures} failure(s), ${warnings} warning(s).`);
if(failures) process.exit(1);
