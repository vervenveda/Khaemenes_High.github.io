import fs from 'node:fs';
import path from 'node:path';

const root='courses/mathematics/geometry';
const unit=path.join(root,'units/unit-10');
const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{if(!ok)errors.push(msg)};
const lessonIds=Array.from({length:7},(_,i)=>`u10-l0${i+1}`);
const identityTerms=[
 ['triangle','trapezoid','height'],
 ['apothem','composite','A=½aP'],
 ["Heron's formula",'coordinate area','semiperimeter'],
 ['scale factor','k²','perimeter'],
 ['absolute error','significant figures','precision'],
 ['geometric probability','uniform','favorable'],
 ['optimization','constraint','feasible']
];
const staleWorksheetTerms=['A triangle has base 14 cm and height 9 cm. Find its area.','A regular hexagon has side length 8 cm and apothem'];

for(let i=0;i<lessonIds.length;i++){
 const id=lessonIds[i];
 const student=path.join(unit,'lessons',`${id}.html`);
 const key=path.join(root,'teacher-keys',`${id}-key.html`);
 must(fs.existsSync(student),`Missing student lesson ${id}`);
 must(fs.existsSync(key),`Missing teacher key ${id}`);
 if(fs.existsSync(student)){
   const s=read(student);
   must(s.includes('Mastery target 80%'),`${id} missing 80% mastery language`);
   must((s.match(/problem-number/g)||[]).length>=6,`${id} has fewer than 6 worksheet problems`);
   must(s.includes(`../../../teacher-keys/${id}-key.html`),`${id} teacher-key link mismatch`);
   for(const term of identityTerms[i]) must(s.toLowerCase().includes(term.toLowerCase()),`${id} missing identity term: ${term}`);
   if(i>0) for(const phrase of staleWorksheetTerms) must(!s.includes(phrase),`${id} retains stale shared-template prompt: ${phrase}`);
 }
 if(fs.existsSync(key)){
   const k=read(key);
   must(k.includes(`../units/unit-10/lessons/${id}.html`),`${id} key student-link mismatch`);
   must((k.match(/problem-number/g)||[]).length>=6,`${id} key has fewer than 6 synchronized answers`);
 }
}

for(const f of ['foundation.html','core.html','extended.html']){
 const p=path.join(unit,'practice',f); must(fs.existsSync(p),`Missing practice/${f}`);
 if(fs.existsSync(p)){
   const s=read(p);
   must((s.match(/problem-number/g)||[]).length>=14,`${f} must contain at least 14 differentiated problems`);
   for(let i=1;i<=7;i++) must(s.includes(`L0${i} ·`),`${f} missing L0${i} practice coverage`);
 }
}
const foundation=read(path.join(unit,'practice/foundation.html'));
const core=read(path.join(unit,'practice/core.html'));
const extended=read(path.join(unit,'practice/extended.html'));
must(foundation!==core&&core!==extended&&foundation!==extended,'practice pathways must not be clones');
must(extended.toLowerCase().includes('general')||extended.toLowerCase().includes('audit'),'extended practice should include generalization/audit reasoning');

const map=JSON.parse(read(path.join(unit,'unit-map.json')));
must(map.lesson_count===7,'unit-map lesson_count must be 7');
must(map.mastery_target===80,'unit-map mastery_target must be 80');
must(Array.isArray(map.lesson_ids)&&lessonIds.every(id=>map.lesson_ids.includes(id)),'unit-map must list all 7 lesson ids');

const vocab=JSON.parse(read(path.join(unit,'vocabulary.json')));
const vocabText=JSON.stringify(vocab).toLowerCase();
for(const term of ['apothem','semiperimeter','scale factor','absolute error','significant figures','uniform selection','sample region','constraint','objective','feasible','optimum']) must(vocabText.includes(term.toLowerCase()),`vocabulary missing ${term}`);

const standards=JSON.parse(read(path.join(unit,'standards-map.json')));
must(standards.masteryTarget===80,'standards-map masteryTarget must be 80');
must(standards.lessonEvidence&&lessonIds.every(id=>Boolean(standards.lessonEvidence[id])),'standards-map must contain evidence for all seven lessons');

const bankPath=path.join(unit,'assessment','unit-10-question-bank.js');
const enginePath=path.join(unit,'assessment','unit-10-assessment-engine.js');
const masteryPath=path.join(unit,'assessment','mastery-check.html');
must(fs.existsSync(bankPath),'Missing Unit 10 local question bank');
must(fs.existsSync(enginePath),'Missing Unit 10 balanced mastery engine');
if(fs.existsSync(bankPath)){
 const bank=read(bankPath);
 const ids=[...bank.matchAll(/"id"\s*:\s*"(geo-u10-l\d\d-q\d\d)"/g)].map(m=>m[1]);
 must(ids.length===28,`Unit 10 bank must contain 28 questions; found ${ids.length}`);
 must(new Set(ids).size===ids.length,'Unit 10 bank contains duplicate question ids');
 for(const id of lessonIds){const count=ids.filter(q=>q.startsWith(`geo-${id}-q`)).length;must(count===4,`${id} must contribute exactly 4 questions; found ${count}`)}
}
if(fs.existsSync(enginePath)){
 const e=read(enginePath);
 must(e.includes('seven Unit 10 lessons'), 'balanced engine must guarantee seven-lesson coverage');
 must(e.includes('12'), 'balanced engine should build a 12-question mastery set');
}
const mastery=read(masteryPath);
must(mastery.includes('unit-10-question-bank.js'),'mastery check must load Unit 10 local bank');
must(mastery.includes('unit-10-assessment-engine.js'),'mastery check must load Unit 10 balanced engine');
must(mastery.includes('80%'),'mastery check must state 80% target');

const project=read(path.join(unit,'projects/10-project.html'));
for(const required of ['two feasible candidates','Scale test','Measurement audit','Probability zone','Optimize','OHMIC CAD','Khaemenes_Scientific_Calculator']) must(project.includes(required),`project missing requirement/integration: ${required}`);
const teacher=read(path.join(unit,'teacher-guide.html'));
for(const required of ['28 questions','80%','uniform-selection','OHMIC CAD','Scientific Calculator']) must(teacher.includes(required),`teacher guide missing ${required}`);
const family=read(path.join(unit,'family-guide.html'));
for(const required of ['80%','all seven lesson','uniform-selection','constraint']) must(family.toLowerCase().includes(required.toLowerCase()),`family guide missing ${required}`);
const index=read(path.join(unit,'index.html'));
for(const required of ['practice/foundation.html','practice/core.html','practice/extended.html','teacher-guide.html','family-guide.html','projects/10-project.html','OHMIC CAD','Scientific Calculator']) must(index.includes(required),`unit landing page missing ${required}`);

if(errors.length){console.error(`Geometry Unit 10 validation failed: ${errors.length} problem(s).`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('Geometry Unit 10 validation passed.');