import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT=path.resolve('courses/mathematics/geometry');
const DIMS=['procedural-fluency','multi-step-application','representation-interpretation','error-analysis','transfer-reasoning'];
const UNIT_WEEKS={1:[1,2],2:[3,4,5],3:[6,7,8],4:[9,10],5:[11,12,13],6:[14,15,16,17],7:[19,20,21],8:[22,23,24],9:[25,26,27],10:[28,29],11:[30,31],12:[32,33,34],13:[35,36]};
const errors=[],pass=[];
const fail=m=>errors.push(m),ok=m=>pass.push(m),assert=(c,m)=>c?undefined:fail(m);
const read=rel=>fs.readFileSync(path.join(ROOT,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(ROOT,rel));

function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
function rel(p){return path.relative(ROOT,p).split(path.sep).join('/')}
function evalWindow(relPath,seed={}){const context={window:seed,document:{getElementById:()=>null},console};vm.createContext(context);new vm.Script(read(relPath),{filename:relPath}).runInContext(context);return context.window}
function parseInlineConst(html,name='CONFIG'){
  const re=new RegExp('const\\s+'+name+'\\s*=\\s*(\\{[\\s\\S]*?\\});');
  const m=html.match(re); if(!m)return null;
  try{return JSON.parse(m[1])}catch{return null}
}
function parseWindowConfig(html){
  const m=html.match(/window\.GEO_ASSESSMENT_CONFIG\s*=\s*(\{[\s\S]*?\})\s*;/);
  if(!m)return null; try{return JSON.parse(m[1])}catch{return null}
}
function normalizeCfg(cfg){if(!cfg)return null;return{
  title:cfg.title||'', recordKey:cfg.recordKey||cfg.record_key||'', count:Number(cfg.count??cfg.question_count??0),
  units:Array.isArray(cfg.units)?cfg.units:[], masteryTarget:Number(cfg.masteryTarget??cfg.mastery_threshold??0),
  instructions:cfg.instructions||'', questions:Array.isArray(cfg.questions)?cfg.questions:[]
}}
function assertQuestion(q,label){assert(q&&typeof q.prompt==='string'&&q.prompt.trim(),label+': missing prompt');assert(Array.isArray(q?.options)&&q.options.length===4,label+': must have four options');if(Array.isArray(q?.options))assert(new Set(q.options.map(String)).size===4,label+': options must be distinct');assert(Number.isInteger(q?.answer)&&q.answer>=0&&q.answer<4,label+': invalid answer index')}

assert(fs.existsSync(ROOT),'Geometry root missing');
const files=walk(ROOT);
for(const file of files){const r=rel(file);if(r.endsWith('.json')){try{JSON.parse(fs.readFileSync(file,'utf8'))}catch(e){fail(r+': invalid JSON: '+e.message)}}if(r.endsWith('.js')){try{new vm.Script(fs.readFileSync(file,'utf8'),{filename:r})}catch(e){fail(r+': JavaScript syntax error: '+e.message)}}}
ok('All Geometry JSON parses and JavaScript compiles');

try{const d=evalWindow('course-data.js').GEOMETRY_DATA;assert(d?.weeks?.length===36,'course-data: expected 36 weeks');assert(d?.units?.length===13,'course-data: expected 13 units');assert(d?.units?.reduce((n,u)=>n+(u.lessons?.length||0),0)===90,'course-data: expected 90 lessons')}catch(e){fail('course-data evaluation failed: '+e.message)}
const lessonPages=files.filter(f=>/\/units\/unit-\d{2}\/lessons\/u\d{2}-l\d{2}\.html$/.test(f)).length;
const teacherKeys=files.filter(f=>/\/teacher-keys\/u\d{2}-l\d{2}-key\.html$/.test(f)).length;
const unitIndexes=files.filter(f=>/\/units\/unit-\d{2}\/index\.html$/.test(f)).length;
const unitMasteries=files.filter(f=>/\/units\/unit-\d{2}\/assessment\/mastery-check\.html$/.test(f)).length;
const projects=files.filter(f=>/\/units\/unit-\d{2}\/projects\/\d{2}-project\.html$/.test(f)).length;
assert(lessonPages===90,'expected 90 lesson pages, found '+lessonPages);assert(teacherKeys===90,'expected 90 teacher keys, found '+teacherKeys);assert(unitIndexes===13,'expected 13 unit indexes, found '+unitIndexes);assert(unitMasteries===13,'expected 13 unit mastery pages, found '+unitMasteries);assert(projects===13,'expected 13 applied investigation pages, found '+projects);ok('Course structural counts verified');

try{const q=evalWindow('assets/question-bank.js').GEOMETRY_QUESTIONS;assert(Array.isArray(q)&&q.length===156,'cumulative source bank: expected 156 items, found '+q?.length);const ids=new Set();(q||[]).forEach((item,i)=>{assertQuestion(item,'source bank item '+(i+1));assert(!ids.has(item.id),'source bank duplicate id '+item.id);ids.add(item.id)})}catch(e){fail('question-bank evaluation failed: '+e.message)}ok('156-item cumulative source bank verified');

const bankContext={window:{KhaemenesGeometryWeeklyMasteryV2:{}}};vm.createContext(bankContext);
const bankFiles=Array.from({length:12},(_,i)=>{const a=i*3+1,b=a+2;return 'assessments/assets/weekly-mastery-v2-'+String(a).padStart(2,'0')+'-'+String(b).padStart(2,'0')+'.js'});
for(const f of bankFiles){assert(exists(f),f+': missing');if(exists(f)){try{new vm.Script(read(f),{filename:f}).runInContext(bankContext)}catch(e){fail(f+': execution failed: '+e.message)}}}
const bank=bankContext.window.KhaemenesGeometryWeeklyMasteryV2||{},weeklyIds=new Set();
assert(Object.keys(bank).length===36,'weekly bank: expected 36 weeks');
for(let n=1;n<=36;n++){const w=bank[String(n)];assert(w?.questions?.length===10,'Week '+n+': expected 10 questions');const dims=Object.fromEntries(DIMS.map(d=>[d,0]));for(const [i,q] of (w?.questions||[]).entries()){assertQuestion(q,'Week '+n+' question '+(i+1));if(DIMS.includes(q.dimension))dims[q.dimension]++;assert(!weeklyIds.has(q.id),'weekly bank duplicate id '+q.id);weeklyIds.add(q.id)}for(const d of DIMS)assert(dims[d]===2,'Week '+n+': '+d+' expected 2 questions')}
assert(weeklyIds.size===360,'weekly bank: expected 360 unique ids');ok('36 weekly mastery gates / 360 unique depth prompts verified');

const diagnosticHtml=read('diagnostic/index.html'),diag=normalizeCfg(parseInlineConst(diagnosticHtml));
assert(diag?.count===40,'diagnostic: expected 40-question inline assessment');
assert(diag?.questions?.length===40,'diagnostic: expected 40 embedded questions');
const domains={ 'linear-equations':0,'proportion-scale':0,'coordinate-graphing':0,'radicals-exponents':0,'measurement-reasoning':0};
for(const [i,q] of (diag?.questions||[]).entries()){assertQuestion(q,'diagnostic item '+(i+1));if(Object.hasOwn(domains,q.readiness_domain))domains[q.readiness_domain]++;else fail('diagnostic item '+(i+1)+': invalid readiness domain '+q.readiness_domain)}
for(const [d,n] of Object.entries(domains))assert(n===8,'diagnostic: '+d+' expected 8 items, found '+n);ok('Current self-contained 40-question readiness diagnostic verified');

const v3Source=read('assets/unit-mastery-source-v3.js');
assert(/MASTERY=80,COUNT=25/.test(v3Source),'unit mastery v3: 80/25 contract missing');
assert(/dimensionCounts\[d\]===5/.test(v3Source),'unit mastery v3: five-per-dimension readiness check missing');
for(let u=1;u<=13;u++){
  const p=String(u).padStart(2,'0'),html=read('units/unit-'+p+'/assessment/mastery-check.html');
  const cfg=normalizeCfg(parseInlineConst(html)||parseWindowConfig(html));
  assert(cfg,'Unit '+u+': assessment config missing'); if(!cfg)continue;
  assert(cfg.count===25,'Unit '+u+': count must be 25');
  assert(cfg.masteryTarget===80,'Unit '+u+': mastery target must be 80');
  assert(cfg.recordKey==='unit-'+p,'Unit '+u+': record key mismatch');
  if(cfg.questions.length){
    assert(cfg.questions.length===25,'Unit '+u+': embedded question count must be 25');
    const dims=Object.fromEntries(DIMS.map(d=>[d,0]));cfg.questions.forEach((q,i)=>{assertQuestion(q,'Unit '+u+' item '+(i+1));if(DIMS.includes(q.dimension))dims[q.dimension]++});for(const d of DIMS)assert(dims[d]===5,'Unit '+u+': '+d+' expected 5 embedded questions');
  }else{
    assert(/below-mastery attempts require corrections and a retry/i.test(cfg.instructions),'Unit '+u+': strict retake wording missing');
    const needed=[...new Set(UNIT_WEEKS[u].map(w=>{const a=Math.floor((w-1)/3)*3+1,b=a+2;return 'weekly-mastery-v2-'+String(a).padStart(2,'0')+'-'+String(b).padStart(2,'0')+'.js'}))];
    for(const mod of needed)assert(html.includes(mod),'Unit '+u+': missing '+mod);
    const sourcePos=html.indexOf('unit-mastery-source-v3.js'),enginePos=html.indexOf('unit-assessment-engine-v3.js');
    assert(sourcePos>=0&&enginePos>sourcePos,'Unit '+u+': v3 source/engine load order invalid');
    for(const mod of needed)assert(html.indexOf(mod)>=0&&html.indexOf(mod)<sourcePos,'Unit '+u+': '+mod+' must load before v3 unit source');
  }
}
ok('13 current 25-question unit mastery surfaces verified without modifying assessment pages');

for(let u=1;u<=13;u++)assert(read('units/unit-'+String(u).padStart(2,'0')+'/index.html').includes('../../assets/unit-index-gates.js'),'Unit '+u+' index: strict gate loader missing');
const unitGates=read('assets/unit-index-gates.js'),lessonTools=read('assets/lesson-tools.js');
assert(/MASTERY=80/.test(unitGates),'unit-index-gates: mastery 80 missing');assert(/MASTERY=80/.test(lessonTools),'lesson-tools: mastery 80 missing');ok('Lesson and unit progression authority verified');

for(const [file,label,selected,written] of [['assessments/midterm.html','Midterm',60,6],['assessments/final.html','Final',100,10]]){
 const html=read(file),key=label.toLowerCase();
 assert(new RegExp('record_key\\s*:\\s*["\\\']'+key+'["\\\']').test(html),label+': current inline config missing');
 assert(/mastery_threshold\s*:\s*80/.test(html),label+': 80% mastery threshold missing');
 assert(html.includes(selected+' selected-response'),label+': selected-response count text mismatch');
 assert(html.includes(written+' required constructed-response')||html.includes(written+' written geometry tasks'),label+': constructed-response count text mismatch');
 assert(/selected[^\n]{0,160}>=?80|selected[^\n]{0,160}≥80/i.test(html),label+': selected-response 80% rule missing');
 assert(/constructed[^\n]{0,160}>=?80|constructed[^\n]{0,160}≥80/i.test(html),label+': constructed-response 80% rule missing');
 assert(/overall[^\n]{0,160}>=?80|overall[^\n]{0,160}≥80/i.test(html),label+': overall 80% rule missing');
 assert(/evaluator|reviewer/i.test(html),label+': human review evidence missing');
}
ok('Current mixed-evidence Midterm and Final surfaces verified');

const rec=read('records/record-engine-v2.js'),cert=read('records/course-completion-certificate.html');
for(const token of ['lessonCount===90','weekCount===36','unitCount===13','testMastered("midterm")','testMastered("final")','Number(rec.investigations)>=13'])assert(rec.includes(token),'completion engine: missing '+token);
assert(cert.includes('record-engine-v2.js'),'completion certificate: record-engine-v2 loader missing');ok('Evidence-gated completion record verified');

const sw=read('service-worker.js');assert(/const CACHE="khaemenes-geometry-v\d+/.test(sw),'service worker: Geometry release cache identity missing');assert(sw.includes('./assets/unit-mastery-source-v3.js')||sw.includes('./assets/unit-mastery-source-v2.js'),'service worker: unit mastery source missing');ok('Offline Geometry runtime assets present');

const center=read('assessments/index.html'),report=read('VALIDATION_REPORT.md');
assert(/mastery|assessment/i.test(center),'Assessment Center: mastery guidance missing');
assert(report.includes('PENDING — STRICT-80 RELEASE VALIDATION IN PROGRESS')||report.includes('PASS'),'Validation report status marker missing');
ok('Public release documentation remains classified');

if(errors.length){console.error('\nGeometry strict release validation FAILED ('+errors.length+' issue'+(errors.length===1?'':'s')+'):');errors.forEach((e,i)=>console.error((i+1)+'. '+e));process.exit(1)}
console.log('Geometry strict release validation PASS');for(const p of pass)console.log('OK  '+p);console.log('OK  '+files.length+' Geometry files scanned');
