import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve('courses/mathematics/geometry');
const unit=path.join(root,'units','unit-04');
let failures=0;
function check(cond,label){console.log(`${cond?'OK':'FAIL'} ${label}`);if(!cond)failures++;}
function exists(rel){return fs.existsSync(path.join(unit,rel));}
function read(rel){return fs.readFileSync(path.join(unit,rel),'utf8');}

for(const rel of ['index.html','unit-map.json','standards-map.json','vocabulary.json','teacher-guide.html','family-guide.html','practice/foundation.html','practice/core.html','practice/extended.html','projects/04-project.html','assessment/mastery-check.html','assessment/answer-key.json']) check(exists(rel),`Unit 04 ${rel} exists`);

const map=JSON.parse(read('unit-map.json'));
check(map.unit===4,'unit map belongs to Unit 04');
check(map.mastery_target===80,'Unit 04 mastery target is 80%');
check(map.lesson_count===6,'unit map declares 6 lessons');
check(Array.isArray(map.lesson_ids)&&map.lesson_ids.length===map.lesson_count,'lesson_ids count matches lesson_count');
for(const lessonId of map.lesson_ids||[])check(exists(`lessons/${lessonId}.html`),`${lessonId} lesson exists`);

const index=read('index.html');
check(index.includes('class="skip')&&index.includes('Skip to unit content'),'unit index exposes skip navigation');
for(const lessonId of map.lesson_ids||[])check(index.includes(`${lessonId}.html`),`unit index links ${lessonId}`);

const standards=JSON.parse(read('standards-map.json'));
check(standards.mastery_target===80,'standards map preserves 80% target');
check(standards.lesson_evidence&&Object.keys(standards.lesson_evidence).length===map.lesson_count,'standards map has six lesson-evidence records');
check((map.lesson_ids||[]).every(id=>Object.prototype.hasOwnProperty.call(standards.lesson_evidence||{},id)),'standards lesson evidence matches declared lessons');

const vocab=JSON.parse(read('vocabulary.json'));
check(Array.isArray(vocab.terms)&&vocab.terms.length>=20,'vocabulary contains at least 20 entries');
check(new Set((vocab.terms||[]).map(x=>String(x.term||'').trim().toLowerCase())).size===(vocab.terms||[]).length,'vocabulary terms are unique');

const upgradePath=path.join(root,'assets','unit-04-content-upgrade.js');
check(fs.existsSync(upgradePath),'Unit 04 hardened content bank exists');
const sandbox={window:{GEOMETRY_QUESTIONS:[]}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(upgradePath,'utf8'),sandbox,{filename:upgradePath});
const rows=sandbox.window.GEOMETRY_QUESTIONS.filter(q=>Number(q.unit)===4);
check(rows.length===30,'Unit 04 hardened runtime bank contains 30 items');
check(new Set(rows.map(q=>q.id)).size===30,'question IDs are unique');
check(new Set(rows.map(q=>q.prompt)).size===30,'question prompts are unique');
check(rows.every(q=>Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4),'all questions have four unique choices');
check(rows.every(q=>Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4),'all answer indexes are valid');
check(rows.every(q=>q.options[q.answer]===q.answer_text),'answer text matches indexed option');
check(rows.every(q=>typeof q.explanation==='string'&&q.explanation.trim().length>10),'all questions have explanations');
for(let lesson=1;lesson<=6;lesson++)check(rows.filter(q=>q.lesson===lesson).length===5,`Lesson ${String(lesson).padStart(2,'0')} has 5 assessment items`);
check([0,1,2,3].filter(i=>rows.some(q=>q.answer===i)).length>=3,'answer positions are distributed across at least three indexes');

const key=JSON.parse(read('assessment/answer-key.json'));
const answers=key.items||key.answers||[];
check(key.declared_question_count===30,'answer key declares 30 questions');
check(answers.length===30,'answer key contains 30 answers');
check(new Set(answers.map(a=>a.id)).size===30,'answer key IDs are unique');
const byId=new Map(rows.map(q=>[q.id,q.answer]));
check(answers.every(a=>byId.has(a.id)&&byId.get(a.id)===a.answer),'answer key IDs and indexes match runtime bank');

const mastery=read('assessment/mastery-check.html');
check(mastery.includes('unit-04-content-upgrade.js'),'mastery check loads Unit 04 hardened bank');
check(/count\s*:\s*12/.test(mastery),'mastery check declares 12 sampled questions');
check(/units\s*:\s*\[4\]/.test(mastery),'mastery check is scoped to Unit 04');
check(mastery.includes('80%'),'mastery check preserves 80% target');
check(mastery.includes('Human-reviewed evidence'),'mastery check separates human-reviewed evidence');
check(mastery.includes('Scores and attempt history remain in this browser'),'mastery check documents local attempt evidence');
check(mastery.includes('class="skip'),'mastery check exposes skip navigation');
check(mastery.lastIndexOf('assessment-engine.js')>mastery.lastIndexOf('unit-04-content-upgrade.js'),'assessment engine loads after hardened bank');

const lesson5=read('lessons/u04-l05.html');
check(lesson5.includes('Use coordinates to calculate slope, midpoint, and distance'),'Lesson 05 learning intention matches coordinate proof');
check(!lesson5.includes('partition a segment and distinguish distance from directed change'),'Lesson 05 legacy objective leakage is absent');

if(failures){console.error(`Unit 04 validation failed: ${failures} problem(s).`);process.exit(1);}else console.log('Unit 04 validation passed.');
