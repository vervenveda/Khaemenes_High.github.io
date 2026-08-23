import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT=path.resolve('courses/mathematics/geometry');
const DIMS=['procedural-fluency','multi-step-application','representation-interpretation','error-analysis','transfer-reasoning'];
const UNIT_WEEKS={1:[1,2],2:[3,4,5],3:[6,7,8],4:[9,10],5:[11,12,13],6:[14,15,16,17],7:[19,20,21],8:[22,23,24],9:[25,26,27],10:[28,29],11:[30,31],12:[32,33,34],13:[35,36]};
const errors=[];
const pass=[];
const fail=(msg)=>errors.push(msg);
const ok=(msg)=>pass.push(msg);
const read=(rel)=>fs.readFileSync(path.join(ROOT,rel),'utf8');
const exists=(rel)=>fs.existsSync(path.join(ROOT,rel));
const assert=(cond,msg)=>cond?undefined:fail(msg);

function walk(dir){
 const out=[];
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,ent.name);
  if(ent.isDirectory())out.push(...walk(p));else out.push(p);
 }
 return out;
}
function rel(p){return path.relative(ROOT,p).split(path.sep).join('/');}
function evalWindow(relPath,windowSeed={}){
 const code=read(relPath),context={window:windowSeed,console};
 vm.createContext(context);new vm.Script(code,{filename:relPath}).runInContext(context);return context.window;
}
function parseConfig(html,label){
 const m=html.match(/window\.GEO_ASSESSMENT_CONFIG\s*=\s*(\{[\s\S]*?\})\s*;<\/script>/);
 if(!m){fail(`${label}: GEO_ASSESSMENT_CONFIG not found`);return null}
 try{return JSON.parse(m[1])}catch(e){fail(`${label}: config JSON parse failed: ${e.message}`);return null}
}
function assertQuestion(q,label){
 assert(q&&typeof q.prompt==='string'&&q.prompt.trim(),`${label}: missing prompt`);
 assert(Array.isArray(q?.options)&&q.options.length===4,`${label}: must have four options`);
 if(Array.isArray(q?.options))assert(new Set(q.options.map(String)).size===4,`${label}: options must be distinct`);
 assert(Number.isInteger(q?.answer)&&q.answer>=0&&q.answer<4,`${label}: invalid answer index`);
 if(q?.answer_text!=null&&Array.isArray(q?.options)&&Number.isInteger(q?.answer))assert(String(q.options[q.answer])===String(q.answer_text),`${label}: answer_text mismatch`);
}

assert(fs.existsSync(ROOT),'Geometry root missing');
const files=walk(ROOT);
for(const file of files){
 const r=rel(file);
 if(r.endsWith('.json')){try{JSON.parse(fs.readFileSync(file,'utf8'))}catch(e){fail(`${r}: invalid JSON: ${e.message}`)}}
 if(r.endsWith('.js')){try{new vm.Script(fs.readFileSync(file,'utf8'),{filename:r})}catch(e){fail(`${r}: JavaScript syntax error: ${e.message}`)}}
}
ok('All Geometry JSON parses and JavaScript compiles');

try{
 const w=evalWindow('course-data.js');const d=w.GEOMETRY_DATA;
 assert(d&&Array.isArray(d.weeks)&&d.weeks.length===36,'course-data: expected 36 weeks');
 assert(d&&Array.isArray(d.units)&&d.units.length===13,'course-data: expected 13 units');
 const lessonTotal=d?.units?.reduce((n,u)=>n+(Array.isArray(u.lessons)?u.lessons.length:0),0);
 assert(lessonTotal===90,`course-data: expected 90 lessons, found ${lessonTotal}`);
}catch(e){fail(`course-data evaluation failed: ${e.message}`)}
const lessonPages=files.filter(f=>/\/units\/unit-\d{2}\/lessons\/u\d{2}-l\d{2}\.html$/.test(f)).length;
const teacherKeys=files.filter(f=>/\/teacher-keys\/u\d{2}-l\d{2}-key\.html$/.test(f)).length;
const unitIndexes=files.filter(f=>/\/units\/unit-\d{2}\/index\.html$/.test(f)).length;
const unitMasteries=files.filter(f=>/\/units\/unit-\d{2}\/assessment\/mastery-check\.html$/.test(f)).length;
const projects=files.filter(f=>/\/units\/unit-\d{2}\/projects\/\d{2}-project\.html$/.test(f)).length;
assert(lessonPages===90,`expected 90 lesson pages, found ${lessonPages}`);
assert(teacherKeys===90,`expected 90 teacher keys, found ${teacherKeys}`);
assert(unitIndexes===13,`expected 13 unit indexes, found ${unitIndexes}`);
assert(unitMasteries===13,`expected 13 unit mastery pages, found ${unitMasteries}`);
assert(projects===13,`expected 13 applied investigation pages, found ${projects}`);
ok('Course structural counts verified');

try{
 const w=evalWindow('assets/question-bank.js');const q=w.GEOMETRY_QUESTIONS;
 assert(Array.isArray(q)&&q.length===156,`cumulative source bank: expected 156 items, found ${q?.length}`);
 const ids=new Set();
 (q||[]).forEach((item,i)=>{assertQuestion(item,`source bank item ${i+1}`);assert(!ids.has(item.id),`source bank duplicate id ${item.id}`);ids.add(item.id)});
}catch(e){fail(`question-bank evaluation failed: ${e.message}`)}
ok('156-item cumulative source bank verified');

const bankContext={window:{KhaemenesGeometryWeeklyMasteryV2:{}}};vm.createContext(bankContext);
const bankFiles=Array.from({length:12},(_,i)=>{const a=i*3+1,b=a+2;return `assessments/assets/weekly-mastery-v2-${String(a).padStart(2,'0')}-${String(b).padStart(2,'0')}.js`});
for(const f of bankFiles){assert(exists(f),`${f}: missing`);if(exists(f)){try{new vm.Script(read(f),{filename:f}).runInContext(bankContext)}catch(e){fail(`${f}: execution failed: ${e.message}`)}}}
const bank=bankContext.window.KhaemenesGeometryWeeklyMasteryV2||{};
assert(Object.keys(bank).length===36,`weekly bank: expected 36 weeks, found ${Object.keys(bank).length}`);
const weeklyIds=new Set(),weeklyPrompts=new Set();
for(let n=1;n<=36;n++){
 const w=bank[String(n)];assert(w,`weekly bank: Week ${n} missing`);if(!w)continue;
 assert(Number(w.week)===n,`Week ${n}: week number mismatch`);
 assert(Array.isArray(w.questions)&&w.questions.length===10,`Week ${n}: expected 10 questions`);
 const dims=Object.fromEntries(DIMS.map(d=>[d,0]));
 for(const [i,q] of (w.questions||[]).entries()){
  assertQuestion(q,`Week ${n} question ${i+1}`);
  assert(DIMS.includes(q.dimension),`Week ${n} question ${i+1}: invalid dimension ${q.dimension}`);
  if(DIMS.includes(q.dimension))dims[q.dimension]++;
  const p=String(q.prompt||'').trim().toLowerCase();
  assert(!weeklyIds.has(q.id),`weekly bank duplicate id ${q.id}`);weeklyIds.add(q.id);
  assert(!weeklyPrompts.has(p),`weekly bank duplicate prompt at ${q.id}`);weeklyPrompts.add(p);
 }
 for(const d of DIMS)assert(dims[d]===2,`Week ${n}: ${d} expected 2 questions, found ${dims[d]}`);
}
assert(weeklyIds.size===360,`weekly bank: expected 360 unique ids, found ${weeklyIds.size}`);
assert(weeklyPrompts.size===360,`weekly bank: expected 360 unique prompts, found ${weeklyPrompts.size}`);
ok('36 weekly mastery gates / 360 unique depth prompts verified');

const weeklyEngine=read('assessments/assets/weekly-mastery-engine-v2.js');
assert(/MASTERY=80/.test(weeklyEngine),'weekly engine: MASTERY must be 80');
assert(/REQUIRED=8/.test(weeklyEngine),'weekly engine: REQUIRED must be 8');
assert(/optionOrder\(/.test(weeklyEngine)&&/hashSeed/.test(weeklyEngine),'weekly engine: deterministic option ordering missing');
assert(/Object\.keys\(BANK\)\.length!==36/.test(weeklyEngine),'weekly engine: incomplete-bank fail-closed check missing');

const sourceCode=read('assets/unit-mastery-source-v2.js');
assert(/const MASTERY=80,COUNT=20/.test(sourceCode),'unit mastery source: 80/20 contract missing');
for(let u=1;u<=13;u++){
 const cfg={title:`Unit ${u}`,recordKey:`unit-${String(u).padStart(2,'0')}`,count:20,units:[u],masteryTarget:80};
 const context={window:{GEO_ASSESSMENT_CONFIG:cfg,KhaemenesGeometryWeeklyMasteryV2:JSON.parse(JSON.stringify(bank))},document:{getElementById:()=>null},console};
 vm.createContext(context);
 try{new vm.Script(sourceCode,{filename:'unit-mastery-source-v2.js'}).runInContext(context)}catch(e){fail(`Unit ${u}: unit depth source execution failed: ${e.message}`);continue}
 const set=context.window.GEOMETRY_QUESTIONS||[],outCfg=context.window.GEO_ASSESSMENT_CONFIG;
 assert(outCfg.depthSourceReady===true,`Unit ${u}: depth source not ready`);
 assert(set.length===20,`Unit ${u}: expected 20 depth questions, found ${set.length}`);
 const seenWeeks=new Set(set.map(q=>Number(q.week))),dims=Object.fromEntries(DIMS.map(d=>[d,0])),ids=new Set();
 for(const w of UNIT_WEEKS[u])assert(seenWeeks.has(w),`Unit ${u}: instructional Week ${w} not represented`);
 for(const [i,q] of set.entries()){
  assertQuestion(q,`Unit ${u} depth item ${i+1}`);if(DIMS.includes(q.dimension))dims[q.dimension]++;
  assert(!ids.has(q.id),`Unit ${u}: duplicate depth item ${q.id}`);ids.add(q.id);
 }
 for(const d of DIMS)assert(dims[d]===4,`Unit ${u}: ${d} expected 4 questions, found ${dims[d]}`);
 const html=read(`units/unit-${String(u).padStart(2,'0')}/assessment/mastery-check.html`),c=parseConfig(html,`Unit ${u} mastery page`);
 assert(c?.count===20,`Unit ${u} page: count must be 20`);assert(c?.masteryTarget===80,`Unit ${u} page: masteryTarget must be 80`);
 assert(Array.isArray(c?.units)&&c.units.length===1&&Number(c.units[0])===u,`Unit ${u} page: units config mismatch`);
 assert(/below-mastery attempts require corrections and a retake/i.test(c?.instructions||''),`Unit ${u} page: strict retake wording missing`);
 const needed=[...new Set(UNIT_WEEKS[u].map(w=>{const a=Math.floor((w-1)/3)*3+1,b=a+2;return `weekly-mastery-v2-${String(a).padStart(2,'0')}-${String(b).padStart(2,'0')}.js`}))];
 for(const mod of needed)assert(html.includes(mod),`Unit ${u} page: missing ${mod}`);
 const cfgPos=html.indexOf('window.GEO_ASSESSMENT_CONFIG'),sourcePos=html.indexOf('unit-mastery-source-v2.js'),enginePos=html.indexOf('assessment-engine.js');
 assert(cfgPos>=0&&sourcePos>cfgPos&&enginePos>sourcePos,`Unit ${u} page: config/source/engine load order invalid`);
 for(const mod of needed)assert(html.indexOf(mod)>cfgPos&&html.indexOf(mod)<sourcePos,`Unit ${u} page: ${mod} must load after config and before unit source`);
}
ok('13 formal 20-question unit depth blueprints verified');

for(let u=1;u<=13;u++){
 const html=read(`units/unit-${String(u).padStart(2,'0')}/index.html`);
 assert(html.includes('../../assets/unit-index-gates.js'),`Unit ${u} index: strict gate loader missing`);
}
const unitGates=read('assets/unit-index-gates.js'),lessonTools=read('assets/lesson-tools.js');
assert(/MASTERY=80/.test(unitGates),'unit-index-gates: mastery 80 missing');
assert(/allLessons/.test(unitGates)&&/allWeeks/.test(unitGates),'unit-index-gates: lesson/week prerequisite checks missing');
assert(/unitNo===7/.test(unitGates)&&/midtermMastered/.test(unitGates),'unit-index-gates: Unit 07 Midterm gate missing');
assert(/MASTERY=80/.test(lessonTools),'lesson-tools: mastery 80 missing');
assert(/Evaluator lesson score/.test(lessonTools)&&/Record Mastery Attempt/.test(lessonTools),'lesson-tools: evaluator evidence gate missing');
ok('Lesson, week-boundary, unit-entry, and formal-unit progression gates verified');

const index=read('index.html'),upgrade=read('assets/geometry-archaemenes-upgrade.js'),strict=read('assets/strict-course-progression.js');
assert(index.includes('assets/geometry-archaemenes-upgrade.js'),'course root: Geometry upgrade loader missing');
assert(upgrade.includes('strict-course-progression.js')&&upgrade.includes('loadStrictProgression'),'course root: strict progression dynamic load missing');
assert(strict.includes('Manual Midterm and Final score entry has been retired'),'strict layer: manual formal score retirement missing');
assert(strict.includes('patchGradebook')&&strict.includes('Legacy planning average'),'strict layer: legacy gradebook distinction missing');
assert(strict.includes('Week ${n} is locked until Week ${n-1} mastery reaches 80%.'),'strict layer: root weekly progression lock missing');
ok('Root course shell strict progression verified');

let depth;
try{depth=evalWindow('assessments/assets/exam-depth-v2.js').KhaemenesGeometryExamDepth}catch(e){fail(`exam-depth-v2 evaluation failed: ${e.message}`)}
assert(depth?.midterm?.constructed?.length===6,'Midterm: expected 6 constructed responses');
assert(depth?.final?.constructed?.length===10,'Final: expected 10 constructed responses');
for(const key of ['midterm','final']){
 const d=depth?.[key];assert(d?.selected_weight===70&&d?.constructed_weight===30,`${key}: expected 70/30 weights`);
 assert(d?.rubric_max===4&&Array.isArray(d?.rubric)&&d.rubric.length===5,`${key}: 0-4 five-level rubric missing`);
 (d?.constructed||[]).forEach((t,i)=>assert(String(t.prompt||'').length>=120,`${key} constructed response ${i+1}: prompt too shallow/short`));
}
const midHtml=read('assessments/midterm.html'),finHtml=read('assessments/final.html'),midCfg=parseConfig(midHtml,'Midterm'),finCfg=parseConfig(finHtml,'Final');
assert(midCfg?.count===60&&JSON.stringify(midCfg?.units)===JSON.stringify([1,2,3,4,5,6]),'Midterm: 60-question Units 1-6 config mismatch');
assert(finCfg?.count===100&&JSON.stringify(finCfg?.units)===JSON.stringify([1,2,3,4,5,6,7,8,9,10,11,12,13]),'Final: 100-question Units 1-13 config mismatch');
const assessEngine=read('assets/assessment-engine.js');
assert(assessEngine.includes('selected>=MASTERY&&constructed>=MASTERY&&overall>=MASTERY'),'assessment engine: three-part cumulative 80% condition missing');
assert(assessEngine.includes('pending-evaluator-review'),'assessment engine: evaluator-review state missing');
assert(assessEngine.includes('cfg.recordKey==="midterm"')&&assessEngine.includes('cfg.recordKey==="final"'),'assessment engine: cumulative prerequisite branches missing');
assert(assessEngine.includes('exam-depth-v2.js'),'assessment engine: depth module load missing');
ok('Midterm and Final mixed-evidence architecture verified');

let map;try{map=JSON.parse(read('assessments/assessment-map.json'))}catch(e){fail(`assessment-map parse failed: ${e.message}`)}
assert(map?.schema==='3.0','assessment map: schema 3.0 required');
assert(map?.mastery_target===80,'assessment map: mastery target 80 required');
assert(map?.lesson_mastery?.count===90&&map?.lesson_mastery?.threshold_percent===80,'assessment map: lesson mastery mismatch');
assert(map?.weekly_mastery?.weeks===36&&map?.weekly_mastery?.questions_each===10&&map?.weekly_mastery?.total_unique_prompts===360&&map?.weekly_mastery?.required_correct_each===8,'assessment map: weekly contract mismatch');
assert(map?.unit_mastery?.units===13&&map?.unit_mastery?.questions_each===20&&map?.unit_mastery?.threshold_percent===80,'assessment map: unit contract mismatch');
assert(map?.midterm?.selected_response_count===60&&map?.midterm?.constructed_response_count===6&&map?.midterm?.mastery_requires_all_three_thresholds===true,'assessment map: Midterm mismatch');
assert(map?.final?.selected_response_count===100&&map?.final?.constructed_response_count===10&&map?.final?.mastery_requires_all_three_thresholds===true,'assessment map: Final mismatch');
assert(map?.completion?.completion_date_required===true,'assessment map: completion date requirement missing');
assert(map?.trust?.authoritative===false&&map?.trust?.digitally_signed===false&&map?.trust?.editable_storage===true,'assessment map: local trust classification mismatch');
const admin=read('assessments/administration-guide.html');
for(const phrase of ['corrections alone do not unlock','360 unique prompts','20-question cumulative blueprint','selected-response score ≥80%','completion date','browser-local evidence'])assert(admin.toLowerCase().includes(phrase.toLowerCase()),`administration guide: missing contract phrase "${phrase}"`);
ok('Assessment map and evaluator administration contract verified');

const rec=read('records/record-engine-v2.js'),cert=read('records/course-completion-certificate.html');
for(const token of ['lessonCount===90','weekCount===36','unitCount===13','testMastered("midterm")','testMastered("final")','Number(rec.capstone)>=M','Number(rec.investigations)>=13','rec.learner.trim()','String(rec.date||"").trim()','rec.evaluator.trim()','rec.attested===true'])assert(rec.includes(token),`completion engine: missing ${token}`);
assert(cert.includes('record-engine-v2.js'),'completion certificate: record-engine-v2 loader missing');
assert(rec.includes('Browser-local evidence is editable and not digitally signed'),'completion engine: trust warning missing');
ok('Evidence-gated completion record verified');

const sw=read('service-worker.js');
assert(sw.includes('khaemenes-geometry-v4-final-strict-release'),'service worker: final v4 cache identity missing');
const coreMatch=sw.match(/const CORE=\[([\s\S]*?)\];/);
if(!coreMatch)fail('service worker: CORE precache list missing');else{
 const urls=[...coreMatch[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
 for(const url of urls){if(!url.startsWith('./'))continue;const target=url.slice(2);if(!target)continue;assert(fs.existsSync(path.join(ROOT,target)),`service worker: precache target missing ${url}`)}
 const critical=['./assets/strict-course-progression.js','./assets/unit-index-gates.js','./assets/unit-mastery-source-v2.js','./assessments/assets/exam-depth-v2.js','./assessments/assets/weekly-mastery-engine-v2.js','./records/record-engine-v2.js','./records/course-completion-certificate.html'];
 for(const f of [...critical,...bankFiles.map(x=>`./${x}`)])assert(urls.includes(f),`service worker: critical offline asset missing ${f}`);
 for(let u=1;u<=13;u++){const p=String(u).padStart(2,'0');assert(urls.includes(`./units/unit-${p}/index.html`),`service worker: Unit ${p} index missing`);assert(urls.includes(`./units/unit-${p}/assessment/mastery-check.html`),`service worker: Unit ${p} mastery missing`)}
}
ok('Offline strict runtime parity verified');

const center=read('assessments/index.html'),readme=read('README.md'),report=read('VALIDATION_REPORT.md');
assert(center.includes('360 unique prompts')&&center.includes('20-question mastery checks'),'Assessment Center: strict depth summary missing');
assert(readme.includes('360 unique weekly mastery prompts')&&readme.includes('156-item cumulative selected-response source bank'),'README: bank distinction missing');
assert(report.includes('PENDING — STRICT-80 RELEASE VALIDATION IN PROGRESS'),'Validation report must remain PENDING until CI release gate is green');
ok('Public release documentation is internally consistent');

if(errors.length){
 console.error(`\nGeometry strict release validation FAILED (${errors.length} issue${errors.length===1?'':'s'}):`);
 errors.forEach((e,i)=>console.error(`${i+1}. ${e}`));
 process.exit(1);
}
console.log('Geometry strict release validation PASS');
for(const p of pass)console.log(`OK  ${p}`);
console.log(`OK  ${files.length} Geometry files scanned`);
