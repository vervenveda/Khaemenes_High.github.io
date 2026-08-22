import fs from 'node:fs';
import path from 'node:path';

const root='courses/mathematics/geometry';
const unit=path.join(root,'units/unit-09');
const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{if(!ok)errors.push(msg)};
const lessonIds=Array.from({length:7},(_,i)=>`u09-l0${i+1}`);
const identityTerms=[['locus','condition'],['perpendicular bisector','angle bisector'],['perpendicular distance','Ax'],['intersection','system'],['secant','tangent'],['focus','directrix'],['Voronoi','site']];
const clonePhrase='Describe loci and intersections as solution sets defined by distance, coordinate, and boundary conditions.';

for(let i=0;i<lessonIds.length;i++){
 const id=lessonIds[i];
 const student=path.join(unit,'lessons',`${id}.html`);
 const key=path.join(root,'teacher-keys',`${id}-key.html`);
 must(fs.existsSync(student),`Missing student lesson ${id}`);
 must(fs.existsSync(key),`Missing teacher key ${id}`);
 if(fs.existsSync(student)){
   const s=read(student);
   must(s.includes('Mastery target 80%'),`${id} missing 80% mastery language`);
   must(!s.includes(clonePhrase),`${id} still contains clone-template language`);
   for(const term of identityTerms[i]) must(s.toLowerCase().includes(term.toLowerCase()),`${id} missing identity term: ${term}`);
   must((s.match(/problem-number/g)||[]).length>=6,`${id} has fewer than 6 worksheet problems`);
   must(s.includes(`../../../teacher-keys/${id}-key.html`),`${id} teacher-key link mismatch`);
 }
 if(fs.existsSync(key)){
   const k=read(key);
   must(k.includes(`../units/unit-09/lessons/${id}.html`),`${id} key student-link mismatch`);
   must(!k.includes(clonePhrase),`${id} key still contains clone-template language`);
 }
}

for(const f of ['foundation.html','core.html','extended.html']){
 const p=path.join(unit,'practice',f); must(fs.existsSync(p),`Missing practice/${f}`);
 if(fs.existsSync(p)){
   const s=read(p);
   must((s.match(/problem-number/g)||[]).length>=14,`${f} must contain at least 14 differentiated problems`);
   for(let i=1;i<=7;i++) must(s.includes(`L0${i} ·`),`${f} missing L0${i} practice coverage`);
   must(!s.includes('svg-title-analytic-90001'),`${f} still contains clone-era repeated analytic SVG chassis`);
 }
}

const map=JSON.parse(read(path.join(unit,'unit-map.json')));
must(map.lesson_count===7,'unit-map lesson_count must be 7');
must(map.mastery_target===80,'unit-map mastery_target must be 80');
must(Array.isArray(map.lesson_ids)&&lessonIds.every(id=>map.lesson_ids.includes(id)),'unit-map must list all 7 lesson ids');

const vocab=JSON.parse(read(path.join(unit,'vocabulary.json')));
for(const term of ['locus','perpendicular bisector','angle bisector','perpendicular distance','system','secant line','tangent line','focus','directrix','Voronoi region','Voronoi edge','Voronoi vertex']) must(vocab.terms?.includes(term),`vocabulary missing ${term}`);

const standards=JSON.parse(read(path.join(unit,'standards-map.json')));
must(standards.masteryTarget===80,'standards-map masteryTarget must be 80');
must(standards.lessonEvidence&&lessonIds.every(id=>Boolean(standards.lessonEvidence[id])),'standards-map must contain evidence for all seven lessons');
must(Boolean(standards.humanReviewBoundary),'standards-map missing humanReviewBoundary');

const bankPath=path.join(unit,'assessment','unit-09-question-bank.js');
const enginePath=path.join(unit,'assessment','unit-09-assessment-engine.js');
const masteryPath=path.join(unit,'assessment','mastery-check.html');
must(fs.existsSync(bankPath),'Missing Unit 09 local question bank');
must(fs.existsSync(enginePath),'Missing Unit 09 balanced mastery engine');
if(fs.existsSync(bankPath)){
 const bank=read(bankPath);
 const ids=[...bank.matchAll(/"id"\s*:\s*"(geo-u09-l\d\d-q\d\d)"/g)].map(m=>m[1]);
 must(ids.length===28,`Unit 09 bank must contain 28 questions; found ${ids.length}`);
 must(new Set(ids).size===ids.length,'Unit 09 bank contains duplicate question ids');
 for(const id of lessonIds){const count=ids.filter(q=>q.startsWith(`geo-${id}-q`)).length;must(count===4,`${id} must contribute exactly 4 questions; found ${count}`)}
}
if(fs.existsSync(enginePath)){
 const e=read(enginePath);
 must(e.includes('each of the seven Unit 09 lessons'),'balanced engine must guarantee seven-lesson coverage');
 must(e.includes('const target=Math.min(Number(cfg.count)||12'),'balanced engine should build a 12-question set');
}
const mastery=read(masteryPath);
must(mastery.includes('unit-09-question-bank.js'),'mastery check must load Unit 09 local bank');
must(mastery.includes('unit-09-assessment-engine.js'),'mastery check must load Unit 09 balanced engine');
must(mastery.includes('80%'),'mastery check must state 80% target');

const project=read(path.join(unit,'projects/09-project.html'));
for(const required of ['at least three fixed sites','at least four mathematical relationships','Khaemenes_Scientific_Calculator','Evidence_Citation_Studio','limitation']) must(project.includes(required),`project missing requirement/integration: ${required}`);

const l03key=read(path.join(root,'teacher-keys/u09-l03-key.html'));
must(!l03key.includes('Yes, tangent'),'L03 key retains contradictory tangent wording');
const l05key=read(path.join(root,'teacher-keys/u09-l05-key.html'));
must(!l05key.includes('Answer:</strong> External'),'L05 key retains contradictory external wording');
const l06=read(path.join(unit,'lessons/u09-l06.html'));
must(l06.includes('Determine whether P(4,4)'),'L06 verification prompt should be neutral');

if(errors.length){console.error(`Geometry Unit 09 validation failed: ${errors.length} problem(s).`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('Geometry Unit 09 validation passed.');