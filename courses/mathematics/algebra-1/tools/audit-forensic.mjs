import { readFile, readdir, stat, access } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'..');
let failures=0,warnings=0;
const ok=(c,m)=>{if(c)console.log(`OK ${m}`);else{failures++;console.error(`FAIL ${m}`)}};
const warn=(c,m)=>{if(c)console.log(`OK ${m}`);else{warnings++;console.warn(`WARN ${m}`)}};
const text=async p=>readFile(resolve(root,p),'utf8');
const json=async p=>JSON.parse(await text(p));
const exists=async p=>{try{await access(resolve(root,p));return true}catch{return false}};

console.log('\n=== Algebra I Forensic Audit ===\n');

// 1) Curriculum structure and parity
const map=await json('course-map.json');
ok(map.calendar?.total_weeks===36,'course duration is 36 weeks');
ok(map.course?.mastery_target===80,'mastery threshold remains 80%');
ok(Array.isArray(map.units)&&map.units.length===13,'course has 13 units');
ok(map.units.reduce((n,u)=>n+Number(u.lesson_count||0),0)===87,'course map totals 87 lessons');

const requiredUnitFiles=['README.md','index.html','family-guide.html','teacher-guide.html','standards-map.json','unit-map.json','vocabulary.json','assessment/mastery-check.html','assessment/answer-key.json','practice/foundation.html','practice/core.html','practice/extended.html'];
for(const u of map.units){
 const n=Number(u.unit),pad=String(n).padStart(2,'0'),base=`units/unit-${pad}`;
 for(const f of requiredUnitFiles)ok(await exists(`${base}/${f}`),`Unit ${pad} contains ${f}`);
 const lessonsDir=resolve(root,base,'lessons');
 const lessonFiles=(await readdir(lessonsDir)).filter(f=>f.endsWith('.html'));
 ok(lessonFiles.length===Number(u.lesson_count),`Unit ${pad} lesson count matches course map (${lessonFiles.length})`);
 const projectsDir=resolve(root,base,'projects');
 const projectFiles=(await readdir(projectsDir)).filter(f=>f.endsWith('.html'));
 ok(projectFiles.length>=1,`Unit ${pad} contains at least one project`);
 const assetsDir=resolve(root,base,'assets');
 ok(await exists(`${base}/assets/unit${pad}-data.js`),`Unit ${pad} has interactive data asset`);
 ok(await exists(`${base}/assets/unit${pad}.js`),`Unit ${pad} has interactive runtime asset`);
}

// 2) Question-bank integrity after applying the certified content upgrades
const qbSource=await text('assets/question-bank.js');
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(qbSource,sandbox,{timeout:3000});
for(let n=1;n<=13;n++){
 const p=`assets/unit-${String(n).padStart(2,'0')}-content-upgrade.js`;
 if(await exists(p))vm.runInContext(await text(p),sandbox,{timeout:3000});
}
const bank=sandbox.window.ALGEBRA1_QUESTIONS||[];
ok(Array.isArray(bank)&&bank.length>0,'question bank executes and produces questions');
const ids=bank.map(q=>q.id),prompts=bank.map(q=>q.prompt);
ok(new Set(ids).size===ids.length,'all question IDs are unique');
ok(new Set(prompts).size===prompts.length,'all question prompts are unique');
ok(bank.every(q=>Array.isArray(q.options)&&q.options.length===4),'all scored items have exactly four choices');
ok(bank.every(q=>new Set(q.options||[]).size===(q.options||[]).length),'all scored items have unique choices within each question');
ok(bank.every(q=>Number.isInteger(q.answer)&&q.answer>=0&&q.answer<(q.options||[]).length),'all answer indexes are valid');
ok(bank.every(q=>String(q.explanation||'').trim().length>=8),'all scored items include an explanation');
ok(bank.every(q=>!q.answer_text||q.options?.[q.answer]===q.answer_text),'answer_text matches the keyed option where present');
ok(bank.every(q=>!/(?:TODO|TBD|undefined|NaN|\$\{)/i.test(`${q.prompt} ${(q.options||[]).join(' ')} ${q.explanation||''}`)),'no unresolved template/math placeholder flags in scored items');

for(const u of map.units){
 const n=Number(u.unit),pad=String(n).padStart(2,'0'),items=bank.filter(q=>Number(q.unit)===n);
 ok(items.length>0,`Unit ${pad} has scored question content`);
 const byLesson=new Map();for(const q of items)byLesson.set(Number(q.lesson),(byLesson.get(Number(q.lesson))||0)+1);
 for(let lesson=1;lesson<=Number(u.lesson_count);lesson++)warn((byLesson.get(lesson)||0)>=5,`Unit ${pad} Lesson ${String(lesson).padStart(2,'0')} has at least 5 explicit scored items`);
 const counts=[...byLesson.values()];
 warn(counts.length===Number(u.lesson_count),`Unit ${pad} question content reaches every lesson`);
 console.log(`INFO Unit ${pad}: ${items.length} scored items across ${byLesson.size}/${u.lesson_count} lessons`);
}

// 3) Duplicate top-level answer-key integrity and exact textual runtime references
const singular='assessments/answer-key.json',plural='assessments/answer-keys.json';
const hasSingular=await exists(singular),hasPlural=await exists(plural);
if(hasSingular&&hasPlural){
 const a=await text(singular),b=await text(plural);
 let semanticallyEqual=false;try{semanticallyEqual=JSON.stringify(JSON.parse(a))===JSON.stringify(JSON.parse(b))}catch{}
 ok(semanticallyEqual,'duplicate top-level answer-key files are semantically identical');
 warn(false,'duplicate top-level answer-key files still coexist and should be unified');
}
async function walk(dir){const out=[];for(const ent of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,ent.name);if(ent.isDirectory())out.push(...await walk(p));else out.push(p)}return out}
const all=await walk(root),refs={singular:[],plural:[]};
for(const abs of all){if(!['.html','.js','.mjs','.md','.json','.yml','.yaml','.txt'].includes(extname(abs)))continue;let s;try{s=await readFile(abs,'utf8')}catch{continue}const rel=abs.slice(root.length+1).replaceAll('\\','/');if(s.includes('assessments/answer-key.json'))refs.singular.push(rel);if(s.includes('assessments/answer-keys.json'))refs.plural.push(rel)}
console.log(`INFO singular answer-key references: ${refs.singular.join(', ')||'none'}`);
console.log(`INFO plural answer-key references: ${refs.plural.join(', ')||'none'}`);

// 4) Root source hygiene
const constructionLeftovers=['ALGEBRA1_FIRST_DRAFT_PROGRESS.md','GRADE10_ALGEBRA1_FILE_MANIFEST.md','HIGH_SCHOOL_PROFILE_SNIPPET.html','MATHEMATICS_PORTAL_GRADE10_INTEGRATION.md','UNIT_13_QA_REPORT.json','UPDATE_NOTES.md','UPLOAD_GRADE10_ALGEBRA1_FIRST.md','UPLOAD_MAP.md'];
for(const f of constructionLeftovers)warn(!(await exists(f)),`${f} is separated from learner-facing course root`);

// 5) Grade/record consistency — policy must remain 40/20/30/10
const record=await text('assets/record-engine.js');
ok(/vals\[0\]\*\.40\+vals\[1\]\*\.20\+vals\[2\]\*\.30\+vals\[3\]\*\.10/.test(record),'record engine preserves 40/20/30/10 grade calculation');
ok(record.includes('THRESHOLD=80'),'record engine preserves 80% completion threshold');
ok(record.includes('parent_or_program_validation_required:true'),'record engine identifies human validation boundary');
const certificate=await text('records/course-completion-certificate.html');
warn(/automatically graded|course engine|human review|capstone|portfolio/i.test(certificate),'record surface explains automatic versus human-reviewed evidence');

// 6) Navigation/resource existence audit for local href/src references
const htmlFiles=all.filter(p=>extname(p)==='.html');let broken=[];
for(const abs of htmlFiles){const s=await readFile(abs,'utf8'),rel=abs.slice(root.length+1).replaceAll('\\','/'),dir=dirname(abs);for(const m of s.matchAll(/(?:href|src)=["']([^"']+)["']/g)){let target=m[1];if(!target||/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(target))continue;target=target.split('#')[0].split('?')[0];if(!target)continue;let candidate=resolve(dir,target);try{const st=await stat(candidate);if(st.isDirectory())candidate=resolve(candidate,'index.html');await access(candidate)}catch{broken.push(`${rel} -> ${m[1]}`)}}}
ok(broken.length===0,`local navigation/resources resolve${broken.length?` (${broken.length} broken)`:''}`);if(broken.length)broken.slice(0,40).forEach(x=>console.error(`BROKEN ${x}`));

console.log(`\nForensic audit complete: ${failures} failure(s), ${warnings} warning(s).`);
if(warnings)console.log('Warnings identify parity/hygiene work without changing grading policy.');
if(failures)process.exit(1);
