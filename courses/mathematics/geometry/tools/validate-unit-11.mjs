import fs from 'node:fs';
import path from 'node:path';

const root='courses/mathematics/geometry';
const unit=path.join(root,'units/unit-11');
const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{if(!ok)errors.push(msg)};
const lessonIds=Array.from({length:7},(_,i)=>`u11-l0${i+1}`);
const identityTerms=[
 ['Cavalieri','prism','cylinder'],
 ['pyramid','cone','⅓'],
 ['sphere','4πr²','⁴⁄₃πr³'],
 ['net','lateral area','surface area'],
 ['2πrh','πrℓ','slant height'],
 ['cross-section','axis of rotation','solid of revolution'],
 ['k²','k³','similar']
];
const staleTemplateMarkers=['rectangular prism</text>','Find the volume of a rectangular prism 6×6×10'];

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
    if(i!==0) for(const marker of staleTemplateMarkers) must(!s.includes(marker),`${id} retains stale shared-solids template marker: ${marker}`);
  }
  if(fs.existsSync(key)){
    const k=read(key);
    must(k.includes(`../units/unit-11/lessons/${id}.html`),`${id} key student-link mismatch`);
    must((k.match(/problem-number/g)||[]).length>=6,`${id} key has fewer than 6 synchronized answers`);
  }
}

for(const f of ['foundation.html','core.html','extended.html']){
  const p=path.join(unit,'practice',f);
  must(fs.existsSync(p),`Missing practice/${f}`);
  if(fs.existsSync(p)){
    const s=read(p);
    must((s.match(/problem-number/g)||[]).length>=14,`${f} must contain at least 14 problems`);
    for(let i=1;i<=7;i++) must(s.includes(`L0${i} ·`),`${f} missing L0${i} coverage`);
  }
}
const foundation=read(path.join(unit,'practice/foundation.html'));
const core=read(path.join(unit,'practice/core.html'));
const extended=read(path.join(unit,'practice/extended.html'));
must(foundation!==core&&core!==extended&&foundation!==extended,'practice pathways must not be clones');
must(/general|audit|justify|derive/i.test(extended),'extended practice should include generalization/audit/proof reasoning');

const map=JSON.parse(read(path.join(unit,'unit-map.json')));
must(map.lesson_count===7,'unit-map lesson_count must be 7');
must(map.mastery_target===80,'unit-map mastery_target must be 80');
must(Array.isArray(map.lesson_ids)&&lessonIds.every(id=>map.lesson_ids.includes(id)),'unit-map must list all 7 lesson ids');

const vocab=JSON.parse(read(path.join(unit,'vocabulary.json')));
const vocabText=JSON.stringify(vocab).toLowerCase();
for(const term of ["cavalieri's principle",'perpendicular height','slant height','great circle','axis of rotation','solid of revolution','dimensional scaling']) must(vocabText.includes(term),`vocabulary missing ${term}`);

const standards=JSON.parse(read(path.join(unit,'standards-map.json')));
must(standards.masteryTarget===80,'standards-map masteryTarget must be 80');
for(const std of ['G-GMD.1','G-GMD.3','G-GMD.4','G-MG.1','G-MG.2','G-MG.3']) must(JSON.stringify(standards).includes(std),`standards-map missing ${std}`);

const bankPath=path.join(unit,'assessment','unit-11-question-bank.js');
const enginePath=path.join(unit,'assessment','unit-11-assessment-engine.js');
const masteryPath=path.join(unit,'assessment','mastery-check.html');
must(fs.existsSync(bankPath),'Missing Unit 11 local question bank');
must(fs.existsSync(enginePath),'Missing Unit 11 balanced mastery engine');
if(fs.existsSync(bankPath)){
  const bank=read(bankPath);
  const ids=[...bank.matchAll(/id:'(geo-u11-l\d\d-q\d+)'/g)].map(m=>m[1]);
  must(ids.length===28,`Unit 11 bank must contain 28 questions; found ${ids.length}`);
  must(new Set(ids).size===ids.length,'Unit 11 bank contains duplicate question ids');
  for(const id of lessonIds){const count=ids.filter(q=>q.startsWith(`geo-${id}-q`)).length;must(count===4,`${id} must contribute exactly 4 questions; found ${count}`)}
}
if(fs.existsSync(enginePath)){
  const e=read(enginePath);
  must(e.includes('seven Unit 11 lessons'),'balanced engine must guarantee seven-lesson coverage');
  must(e.includes('12'),'balanced engine should build a 12-question mastery set');
}
const mastery=read(masteryPath);
must(mastery.includes('unit-11-question-bank.js'),'mastery check must load Unit 11 local bank');
must(mastery.includes('unit-11-assessment-engine.js'),'mastery check must load Unit 11 balanced engine');
must(mastery.includes('80%'),'mastery check must state 80% target');

const project=read(path.join(unit,'projects/11-project.html'));
for(const required of ['Candidate A','Candidate B','Cross-section','Scale','16/20','80%']) must(project.includes(required),`project missing ${required}`);
const teacher=read(path.join(unit,'teacher-guide.html'));
for(const required of ['28-question','80%','Scientific Calculator','OHMIC CAD','Do not repeatedly regenerate tests']) must(teacher.includes(required),`teacher guide missing ${required}`);
const family=read(path.join(unit,'family-guide.html'));
for(const required of ['all seven lessons','80%','k → k² → k³','targeted review']) must(family.includes(required),`family guide missing ${required}`);
const index=read(path.join(unit,'index.html'));
for(const required of ['practice/foundation.html','practice/core.html','practice/extended.html','teacher-guide.html','family-guide.html','projects/11-project.html','OHMIC CAD','Scientific Calculator','28-question']) must(index.includes(required),`unit landing page missing ${required}`);

if(errors.length){console.error(`Geometry Unit 11 validation failed: ${errors.length} problem(s).`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('Geometry Unit 11 validation passed.');