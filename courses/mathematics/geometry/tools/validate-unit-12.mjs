import fs from 'node:fs';
import path from 'node:path';

const root='courses/mathematics/geometry';
const unit=path.join(root,'units/unit-12');
const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{if(!ok)errors.push(msg)};
const lessonIds=Array.from({length:7},(_,i)=>`u12-l0${i+1}`);
const identityTerms=[
  ['grid','snap','units'],
  ['tolerance','absolute error','relative error'],
  ['layer','group','lock'],
  ['scale','door','circulation'],
  ['material schedule','waste','quantity'],
  ['transformation','rotation','reflection','dilation'],
  ['PDF','SVG','DXF','design defense']
];
const mathWords=['snap','tolerance','layer','scale','quantity','transformation','vector'];
const staleMarkers=['Before drawing, which four settings should be verified in OHMIC CAD?','A 1:100 plan shows a 6.5 cm wall. Find the actual wall length.'];

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
    must(s.toLowerCase().includes(`math word of the day: ${mathWords[i]}`),`${id} missing Math Word of the Day: ${mathWords[i]}`);
    for(const term of identityTerms[i]) must(s.toLowerCase().includes(term.toLowerCase()),`${id} missing identity term: ${term}`);
    if(i>0) for(const marker of staleMarkers) must(!s.includes(marker),`${id} retains stale shared CAD-template marker`);
  }
  if(fs.existsSync(key)){
    const k=read(key);
    must(k.includes(`../units/unit-12/lessons/${id}.html`),`${id} key student-link mismatch`);
    must((k.match(/problem-number/g)||[]).length>=6,`${id} key has fewer than 6 synchronized answers`);
    must(k.toLowerCase().includes(`math word: ${mathWords[i]}`),`${id} key missing Math Word ${mathWords[i]}`);
  }
}

for(const f of ['foundation.html','core.html','extended.html']){
  const p=path.join(unit,'practice',f);
  must(fs.existsSync(p),`Missing practice/${f}`);
  if(fs.existsSync(p)){
    const s=read(p);
    must((s.match(/problem-number/g)||[]).length>=14,`${f} must contain at least 14 problems`);
    for(let i=1;i<=7;i++) must(s.includes(`L0${i}`),`${f} missing L0${i} coverage`);
    must(s.includes('80%'),`${f} missing 80% mastery language`);
  }
}
const foundation=read(path.join(unit,'practice/foundation.html'));
const core=read(path.join(unit,'practice/core.html'));
const extended=read(path.join(unit,'practice/extended.html'));
must(foundation!==core&&core!==extended&&foundation!==extended,'practice pathways must not be clones');
must(/derive|general|audit|prove|optimiz/i.test(extended),'extended practice should include derivation/generalization/audit/proof reasoning');

const map=JSON.parse(read(path.join(unit,'unit-map.json')));
must(map.lesson_count===7,'unit-map lesson_count must be 7');
must(map.mastery_target===80,'unit-map mastery_target must be 80');
must(Array.isArray(map.lesson_ids)&&lessonIds.every(id=>map.lesson_ids.includes(id)),'unit-map must list all 7 lesson ids');

const vocab=JSON.parse(read(path.join(unit,'vocabulary.json')));
const vocabText=JSON.stringify(vocab).toLowerCase();
for(const term of mathWords) must(vocabText.includes(term),`vocabulary missing Math Word ${term}`);
for(const term of ['absolute error','relative error','material schedule','waste factor','rotational symmetry','scale verification','design defense']) must(vocabText.includes(term),`vocabulary missing ${term}`);

const standards=JSON.parse(read(path.join(unit,'standards-map.json')));
const standardsText=JSON.stringify(standards);
must(standardsText.includes('80'),'standards-map must preserve 80% mastery evidence');
for(const id of lessonIds) must(standardsText.includes(id),`standards-map missing lesson evidence ${id}`);
for(const term of ['mastery','portfolio','corrections']) must(standardsText.toLowerCase().includes(term),`standards-map missing ${term} evidence`);

const bankPath=path.join(unit,'assessment','unit-12-question-bank.js');
const masteryPath=path.join(unit,'assessment','mastery-check.html');
must(fs.existsSync(bankPath),'Missing Unit 12 local question bank');
if(fs.existsSync(bankPath)){
  const bank=read(bankPath);
  const ids=[...bank.matchAll(/id:'(geo-u12-l\d\d-q\d+)'/g)].map(m=>m[1]);
  must(ids.length===14,`Unit 12 bank must contain 14 questions; found ${ids.length}`);
  must(new Set(ids).size===ids.length,'Unit 12 bank contains duplicate question ids');
  for(const id of lessonIds){
    const count=ids.filter(q=>q.startsWith(`geo-${id}-q`)).length;
    must(count===2,`${id} must contribute exactly 2 questions; found ${count}`);
  }
}
const mastery=read(masteryPath);
must(mastery.includes('unit-12-question-bank.js'),'mastery check must load Unit 12 local bank');
must(mastery.includes('14'),'mastery check must state 14-question coverage');
must(mastery.includes('80%'),'mastery check must state 80% target');
must(mastery.toLowerCase().includes('correction'),'mastery check must require corrections below mastery');

const project=read(path.join(unit,'projects/12-project.html'));
for(const required of ['OHMIC CAD Spatial Design Portfolio','tolerance','layer','scale','material schedule','transformation','source','design defense','20/24','80%']) must(project.toLowerCase().includes(required.toLowerCase()),`project missing ${required}`);

const teacher=read(path.join(unit,'teacher-guide.html'));
for(const required of ['14-question','80%','Math Word','Challenge Unlocked','OHMIC CAD','corrections']) must(teacher.includes(required),`teacher guide missing ${required}`);
const family=read(path.join(unit,'family-guide.html'));
for(const required of ['14-question','80%','Math Word','Challenge Unlocked','corrections']) must(family.includes(required),`family guide missing ${required}`);

const index=read(path.join(unit,'index.html'));
for(const required of ['practice/foundation.html','practice/core.html','practice/extended.html','assessment/mastery-check.html','projects/12-project.html','teacher-guide.html','family-guide.html','OHMIC CAD','Scientific Calculator','Geometry Arcade','14-question']) must(index.includes(required),`unit landing page missing ${required}`);

const l05=read(path.join(unit,'lessons/u12-l05.html'));
const l06=read(path.join(unit,'lessons/u12-l06.html'));
const l07=read(path.join(unit,'lessons/u12-l07.html'));
for(const [id,s] of [['u12-l05',l05],['u12-l06',l06],['u12-l07',l07]]){
  must(/Challenge Unlocked|Unit Complete Challenge/.test(s),`${id} missing earned arcade reinforcement`);
  must(/optional/i.test(s),`${id} arcade reinforcement must be optional`);
  must(/does not (alter|change) the course grade|ungraded/i.test(s),`${id} arcade reinforcement must not affect grade`);
}

if(errors.length){
  console.error(`Geometry Unit 12 validation failed: ${errors.length} problem(s).`);
  for(const e of errors)console.error(`- ${e}`);
  process.exit(1);
}
console.log('Geometry Unit 12 validation passed.');
