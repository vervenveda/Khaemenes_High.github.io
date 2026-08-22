import fs from 'node:fs';
import path from 'node:path';

const root='courses/mathematics/geometry';
const unit=path.join(root,'units/unit-08');
const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{if(!ok)errors.push(msg)};
const lessonIds=Array.from({length:8},(_,i)=>`u08-l0${i+1}`);
const lessonTerms=[
 ['radius','diameter','chord'],
 ['central angle','arc length'],
 ['inscribed angle','intercepted arc'],
 ['perpendicular','chord'],
 ['tangent','point of tangency'],
 ['secant','power'],
 ['sector','annulus'],
 ['standard form','center']
];
const clonePhrase='Connect radii, chords, arcs, angles, tangents, secants, sectors, and coordinate equations in a unified circle model.';

for(let i=0;i<8;i++){
 const id=lessonIds[i];
 const student=path.join(unit,'lessons',`${id}.html`);
 const key=path.join(root,'teacher-keys',`${id}-key.html`);
 must(fs.existsSync(student),`Missing student lesson ${id}`);
 must(fs.existsSync(key),`Missing teacher key ${id}`);
 if(fs.existsSync(student)){
   const s=read(student);
   must(s.includes('Mastery target 80%'),`${id} missing 80% mastery language`);
   must(!s.includes(clonePhrase),`${id} still contains clone-template phrase`);
   for(const term of lessonTerms[i]) must(s.toLowerCase().includes(term.toLowerCase()),`${id} missing identity term: ${term}`);
   const problems=(s.match(/problem-number/g)||[]).length;
   must(problems>=6,`${id} has fewer than 6 worksheet problems`);
   must(s.includes(`../../../teacher-keys/${id}-key.html`),`${id} teacher-key link mismatch`);
 }
 if(fs.existsSync(key)){
   const k=read(key);
   must(k.includes(`../units/unit-08/lessons/${id}.html`),`${id} key student-link mismatch`);
   must(!k.includes(clonePhrase),`${id} teacher key still contains clone-template phrase`);
 }
}

for(const f of ['foundation.html','core.html','extended.html']){
 const p=path.join(unit,'practice',f); must(fs.existsSync(p),`Missing practice/${f}`);
 if(fs.existsSync(p)){
   const s=read(p);
   must(!s.includes(clonePhrase),`${f} still contains clone-template phrase`);
   must((s.match(/problem-number/g)||[]).length>=8,`${f} should contain at least 8 balanced problems`);
 }
}

const map=JSON.parse(read(path.join(unit,'unit-map.json')));
must(map.lesson_count===8,'unit-map lesson_count must be 8');
must(map.mastery_target===80,'unit-map mastery_target must be 80');
must(Array.isArray(map.lesson_ids)&&lessonIds.every(id=>map.lesson_ids.includes(id)),'unit-map must list all 8 lesson ids');

const vocab=JSON.parse(read(path.join(unit,'vocabulary.json')));
for(const term of ['radius','diameter','chord','central angle','inscribed angle','tangent','secant','sector','annulus','point of tangency','power of a point','standard form','locus']) must(vocab.terms?.includes(term),`vocabulary missing ${term}`);

const standards=JSON.parse(read(path.join(unit,'standards-map.json')));
must(Array.isArray(standards.lesson_evidence)&&standards.lesson_evidence.length===8,'standards-map must contain 8 lesson_evidence entries');
must(Boolean(standards.human_review_boundary),'standards-map missing human_review_boundary');

const bankPath=path.join(unit,'assessment','question-bank.js');
const enginePath=path.join(unit,'assessment','balanced-engine.js');
const masteryPath=path.join(unit,'assessment','mastery-check.html');
must(fs.existsSync(bankPath),'Missing Unit 08 local assessment question bank');
must(fs.existsSync(enginePath),'Missing Unit 08 balanced mastery engine');
if(fs.existsSync(bankPath)){
 const bank=read(bankPath);
 const ids=[...bank.matchAll(/"id"\s*:\s*"(u08-l\d\d-q\d\d)"/g)].map(m=>m[1]);
 must(ids.length===32,`Unit 08 bank must contain 32 questions; found ${ids.length}`);
 must(new Set(ids).size===ids.length,'Unit 08 bank contains duplicate question ids');
 for(const id of lessonIds){
   const count=ids.filter(q=>q.startsWith(id+'-q')).length;
   must(count===4,`${id} must contribute exactly 4 assessment questions; found ${count}`);
 }
 must(!bank.includes('1.33π')&&!bank.includes('2.67π'),'Unit 08 bank contains decimal-π approximations');
}
if(fs.existsSync(enginePath)){
 const e=read(enginePath);
 must(e.includes('one from each')||e.includes('lesson'), 'balanced engine should document lesson balancing');
 must(e.includes('12'),'balanced engine should build a 12-question mastery set');
}
const mastery=read(masteryPath);
must(mastery.includes('question-bank.js'),'mastery check must load Unit 08 local question bank');
must(mastery.includes('balanced-engine.js'),'mastery check must load Unit 08 balanced engine');
must(mastery.includes('80%'),'mastery check must state 80% target');

const index=read(path.join(unit,'index.html'));
for(const id of lessonIds) must(index.includes(`lessons/${id}.html`),`Unit landing missing ${id}`);
must(index.includes('Khaemenes_Scientific_Calculator'),'Unit landing missing scientific calculator integration');
must(index.includes('Evidence_Citation_Studio'),'Unit landing missing Evidence & Citation Studio integration');

const project=read(path.join(unit,'projects/08-project.html'));
must(project.includes('three different Unit 08 relationships'),'Project must require cross-lesson evidence');
must(project.includes('Khaemenes_Scientific_Calculator'),'Project missing calculator verification option');
must(project.includes('Evidence_Citation_Studio'),'Project missing evidence studio option');

if(errors.length){
 console.error(`Geometry Unit 08 validation failed: ${errors.length} problem(s).`);
 for(const e of errors) console.error(`- ${e}`);
 process.exit(1);
}
console.log('Geometry Unit 08 validation passed.');
