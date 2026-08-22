import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('courses/mathematics/geometry');
const unit=path.join(root,'units','unit-04');
let failures=0;
function check(ok,label){console.log(`${ok?'OK':'FAIL'} ${label}`);if(!ok)failures++;}
function exists(rel){return fs.existsSync(path.join(unit,rel));}
function read(rel){return fs.readFileSync(path.join(unit,rel),'utf8');}

check(exists('index.html'),'Unit 04 index exists');
check(exists('unit-map.json'),'Unit 04 unit map exists');
check(exists('standards-map.json'),'Unit 04 standards map exists');
check(exists('vocabulary.json'),'Unit 04 vocabulary exists');
check(exists('teacher-guide.html'),'Unit 04 teacher guide exists');
check(exists('family-guide.html'),'Unit 04 family guide exists');
check(exists('practice/foundation.html'),'Unit 04 foundation practice exists');
check(exists('practice/core.html'),'Unit 04 core practice exists');
check(exists('practice/extended.html'),'Unit 04 extended practice exists');
check(exists('projects/04-project.html'),'Unit 04 project exists');
check(exists('assessment/mastery-check.html'),'Unit 04 mastery check exists');

const map=JSON.parse(read('unit-map.json'));
check(map.unit===4,'unit map belongs to Unit 04');
check(map.masteryTarget===80,'Unit 04 mastery target is 80%');
check(Array.isArray(map.lessons)&&map.lessons.length===6,'unit map declares 6 lessons');
for(let i=1;i<=6;i++)check(exists(`lessons/u04-l${String(i).padStart(2,'0')}.html`),`Lesson ${String(i).padStart(2,'0')} exists`);

const index=read('index.html');
check(index.includes('class="skip')&&index.includes('Skip to unit content'),'unit index exposes skip navigation');
for(let i=1;i<=6;i++)check(index.includes(`u04-l${String(i).padStart(2,'0')}.html`),`unit index links Lesson ${String(i).padStart(2,'0')}`);

const standards=JSON.parse(read('standards-map.json'));
const standardsText=JSON.stringify(standards);
for(let i=1;i<=6;i++)check(standardsText.includes(`u04-l${String(i).padStart(2,'0')}`)||standardsText.includes(`Lesson ${String(i).padStart(2,'0')}`)||standardsText.includes(`lesson-${i}`),`standards map contains Lesson ${String(i).padStart(2,'0')} evidence reference`);

const vocab=JSON.parse(read('vocabulary.json'));
const vocabCount=Array.isArray(vocab)?vocab.length:Array.isArray(vocab.terms)?vocab.terms.length:Object.keys(vocab).length;
check(vocabCount>=20,'vocabulary contains at least 20 entries');

const upgradePath=path.join(root,'assets','unit-04-content-upgrade.js');
check(fs.existsSync(upgradePath),'Unit 04 hardened content bank exists');
const bankText=fs.readFileSync(upgradePath,'utf8');
const ids=[...bankText.matchAll(/id:"(geo-u04-\d{2}-\d{2})"/g)].map(m=>m[1]);
check(ids.length===30,'Unit 04 hardened bank contains 30 items');
check(new Set(ids).size===30,'Unit 04 hardened question IDs are unique');
for(let lesson=1;lesson<=6;lesson++){
 const prefix=`geo-u04-${String(lesson).padStart(2,'0')}-`;
 check(ids.filter(id=>id.startsWith(prefix)).length===5,`Lesson ${String(lesson).padStart(2,'0')} has 5 hardened assessment items`);
}
const answerIndexes=[...bankText.matchAll(/answer:(\d+)/g)].map(m=>Number(m[1]));
check(answerIndexes.length===30&&answerIndexes.every(n=>n>=0&&n<=3),'all hardened items declare valid answer indexes');
check((bankText.match(/explanation:"/g)||[]).length===30,'all hardened items contain explanations');

const mastery=read('assessment/mastery-check.html');
check(mastery.includes('unit-04-content-upgrade.js'),'mastery check loads Unit 04 hardened bank');
check(/count:12/.test(mastery),'mastery check declares 12 sampled questions');
check(/units:\[4\]/.test(mastery),'mastery check is scoped to Unit 04');
check(mastery.includes('80%'),'mastery check preserves 80% target');
check(mastery.includes('Human-reviewed evidence'),'mastery check separates human-reviewed evidence');
check(mastery.includes('Scores and attempt history remain in this browser'),'mastery check documents local attempt evidence');
check(mastery.includes('class="skip'),'mastery check exposes skip navigation');

const lesson5=read('lessons/u04-l05.html');
check(lesson5.includes('Use coordinates to calculate slope, midpoint, and distance'),'Lesson 05 learning intention matches coordinate proof');
check(!lesson5.includes('partition a segment and distinguish distance from directed change'),'Lesson 05 legacy objective leakage is absent');

for(const guide of ['teacher-guide.html','family-guide.html']){
 const text=read(guide);
 check(text.includes('../../../index.html')||text.includes('../../index.html'),`${guide} has course navigation`);
}

if(failures){console.error(`Unit 04 validation failed: ${failures} problem(s).`);process.exit(1);}else{console.log('Unit 04 validation passed.');}
