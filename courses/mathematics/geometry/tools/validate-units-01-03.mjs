import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve('courses/mathematics/geometry');
let problems=0;
function ok(label,cond){console.log(`${cond?'OK':'FAIL'} ${label}`);if(!cond)problems++;}
function exists(p){return fs.existsSync(path.join(root,p));}
function read(p){return fs.readFileSync(path.join(root,p),'utf8');}
function json(p){return JSON.parse(read(p));}

for(const u of [1,2,3]){
 const id=String(u).padStart(2,'0');
 const base=`units/unit-${id}`;
 const map=json(`${base}/unit-map.json`);
 ok(`Unit ${id} mastery target is 80%`,map.mastery_target===80);
 ok(`Unit ${id} lesson count is declared`,Number.isInteger(map.lesson_count)&&map.lesson_count>0);
 ok(`Unit ${id} lesson_ids count matches lesson_count`,Array.isArray(map.lesson_ids)&&map.lesson_ids.length===map.lesson_count);
 for(const rel of ['index.html','teacher-guide.html','family-guide.html','standards-map.json','vocabulary.json','practice/foundation.html','practice/core.html','practice/extended.html','assessment/mastery-check.html']) ok(`Unit ${id} ${rel} exists`,exists(`${base}/${rel}`));
 for(const lessonId of map.lesson_ids||[]) ok(`${lessonId} lesson exists`,exists(`${base}/lessons/${lessonId}.html`));
 const standards=json(`${base}/standards-map.json`);
 ok(`Unit ${id} standards map preserves mastery target`,standards.mastery_target===80);
 ok(`Unit ${id} standards map has lesson evidence`,standards.lesson_evidence&&Object.keys(standards.lesson_evidence).length===map.lesson_count);
 ok(`Unit ${id} standards lesson evidence matches declared lessons`,(map.lesson_ids||[]).every(x=>Object.prototype.hasOwnProperty.call(standards.lesson_evidence||{},x)));
 const vocab=json(`${base}/vocabulary.json`);
 ok(`Unit ${id} vocabulary is substantive`,Array.isArray(vocab.terms)&&vocab.terms.length>=map.lesson_count*2);
 ok(`Unit ${id} vocabulary terms are unique`,Array.isArray(vocab.terms)&&new Set(vocab.terms.map(x=>String(x.term||'').trim().toLowerCase())).size===vocab.terms.length);
}

function runScripts(files){
 const sandbox={window:{GEOMETRY_QUESTIONS:[]}};
 vm.createContext(sandbox);
 for(const file of files){
  if(exists(file))vm.runInContext(read(file),sandbox,{filename:file});
 }
 return sandbox.window.GEOMETRY_QUESTIONS;
}

for(const u of [1,2,3]){
 const id=String(u).padStart(2,'0');
 const upgrade=`assets/unit-${id}-content-upgrade.js`;
 const balance=`assets/unit-${id}-answer-balance.js`;
 ok(`Unit ${id} canonical content upgrade exists`,exists(upgrade));
 if(!exists(upgrade))continue;
 const pipeline=[upgrade];
 if(exists(balance))pipeline.push(balance);
 const rows=runScripts(pipeline).filter(q=>Number(q.unit)===u);
 const expected=u===1?30:35;
 ok(`Unit ${id} canonical runtime bank has ${expected} items`,rows.length===expected);
 ok(`Unit ${id} question IDs unique`,new Set(rows.map(q=>q.id)).size===rows.length);
 ok(`Unit ${id} prompts unique`,new Set(rows.map(q=>q.prompt)).size===rows.length);
 ok(`Unit ${id} all items have four unique options`,rows.every(q=>Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4));
 ok(`Unit ${id} answer indexes valid`,rows.every(q=>Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length));
 ok(`Unit ${id} answer text matches indexed option`,rows.every(q=>q.options[q.answer]===q.answer_text));
 ok(`Unit ${id} explanations present`,rows.every(q=>typeof q.explanation==='string'&&q.explanation.trim().length>10));
 const perLesson=new Map();for(const q of rows)perLesson.set(q.lesson,(perLesson.get(q.lesson)||0)+1);
 ok(`Unit ${id} has five questions per lesson`,[...perLesson.values()].every(n=>n===5)&&perLesson.size===(u===1?6:7));
 const answerPositions=[0,1,2,3].map(i=>rows.filter(q=>q.answer===i).length);
 ok(`Unit ${id} answer positions are not single-index patterned`,answerPositions.filter(n=>n>0).length>=3);
 const keyPath=`units/unit-${id}/assessment/answer-key.json`;
 ok(`Unit ${id} canonical answer key exists`,exists(keyPath));
 if(exists(keyPath)){
  const key=json(keyPath);
  const answers=key.items||key.answers||[];
  ok(`Unit ${id} answer key declared count matches runtime`,key.declared_question_count===rows.length||key.question_count===rows.length);
  ok(`Unit ${id} answer key count matches bank`,answers.length===rows.length);
  ok(`Unit ${id} answer key IDs unique`,new Set(answers.map(a=>a.id)).size===answers.length);
  const byId=new Map(rows.map(q=>[q.id,q.answer]));
  ok(`Unit ${id} answer key IDs and indexes match runtime`,answers.every(a=>byId.has(a.id)&&byId.get(a.id)===a.answer));
 }
 const mastery=read(`units/unit-${id}/assessment/mastery-check.html`);
 ok(`Unit ${id} mastery check loads canonical upgrade`,mastery.includes(`unit-${id}-content-upgrade.js`));
 if(exists(balance)) ok(`Unit ${id} mastery check loads answer balancer after upgrade`,mastery.indexOf(`unit-${id}-answer-balance.js`)>mastery.indexOf(`unit-${id}-content-upgrade.js`));
 ok(`Unit ${id} mastery check remains 12 questions`,/count\s*:\s*12|"count"\s*:\s*12/.test(mastery));
 ok(`Unit ${id} mastery check preserves 80% language`,mastery.includes('80%'));
 ok(`Unit ${id} mastery check loads assessment engine last`,mastery.lastIndexOf('assessment-engine.js')>mastery.lastIndexOf(`unit-${id}-content-upgrade.js`));
}

if(problems){console.error(`Geometry Units 01-03 validation failed: ${problems} problem(s).`);process.exit(1);}else console.log('Geometry Units 01-03 validation passed.');
