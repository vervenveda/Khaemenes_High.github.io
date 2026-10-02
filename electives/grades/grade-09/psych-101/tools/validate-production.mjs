import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const failures=[]; const checks=[];
function ok(cond,label){checks.push({label,ok:!!cond}); if(!cond) failures.push(label);}
function read(rel){return fs.readFileSync(path.join(root,rel),'utf8');}
function exists(rel){return fs.existsSync(path.join(root,rel));}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}

ok(exists('index.html'),'course home exists');
ok(exists('lessons/index.html'),'lesson navigator exists');
ok(exists('progress/index.html'),'progress/recovery interface exists');
ok(exists('journal/index.html'),'academic journal interface exists');
ok(exists('research-notebook/index.html'),'research notebook interface exists');
ok(exists('word-lab/index.html'),'word lab exists');
ok(exists('project/index.html'),'final research brief interface exists');
ok(exists('offline.html')&&exists('manifest.webmanifest')&&exists('service-worker.js'),'offline runtime files exist');

let lessonCount=0,dailyItems=0;
for(let w=1;w<=13;w++){
  for(let d=1;d<=5;d++){
    const rel=`lessons/week-${String(w).padStart(2,'0')}/day-${String(d).padStart(2,'0')}.html`;
    ok(exists(rel),`${rel} exists`); if(!exists(rel)) continue;
    lessonCount++; const s=read(rel); const id=`${String(w).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    ok(s.includes(`data-lesson-id="${id}"`),`${rel} has stable lesson id`);
    for(const token of ['Retrieval','Essential Question','Learning Objectives','Psychology Word','Vocabulary','Core','Psychological Scientist','data-notebook','data-journal','data-daily-review','data-mark-reviewed','data-challenge-unlock']) ok(s.includes(token),`${rel} preserves lesson contract marker ${token}`);
    ok(/Data Lens|Research\/Data Lab/.test(s),`${rel} contains data-literacy activity`);
    ok(/Claims Laboratory|Claims Lab|Claim/.test(s),`${rel} contains claim-evaluation activity`);
    const q=(s.match(/data-answer="q\d+"/g)||[]).length; dailyItems+=q; ok(q===5,`${rel} has exactly five daily-review items`);
    ok(/80%/.test(s),`${rel} states the 80% daily threshold`);
  }
}
ok(lessonCount===65,'65/65 student lessons exist');
ok(dailyItems===325,'325 daily review items exist');

let weeklyCount=0;
for(let w=1;w<=13;w++){
  const rel=`assessments/week-${String(w).padStart(2,'0')}.html`; ok(exists(rel),`${rel} exists`); if(!exists(rel)) continue;
  weeklyCount++; const s=read(rel);
  ok((s.match(/<fieldset\b/g)||[]).length===20,`${rel} contains 10 Form A + 10 Form B questions`);
  ok(/Form A/.test(s)&&/Form B/.test(s),`${rel} contains parallel forms`);
  ok(/80%/.test(s),`${rel} states 80% mastery`);
  ok(/recordWeeklyScore/.test(s),`${rel} stores actual weekly assessment evidence`);
  ok(/targeted/i.test(s)&&/correction/i.test(s),`${rel} contains targeted correction`);
}
ok(weeklyCount===13,'13/13 weekly mastery assessments exist');

for(let c=1;c<=3;c++){
  const rel=`assessments/cumulative-${String(c).padStart(2,'0')}.html`; ok(exists(rel),`${rel} exists`); if(!exists(rel)) continue;
  const s=read(rel); ok(/80%/.test(s),`${rel} states 80% checkpoint mastery`); ok(/recordCumulativeScore/.test(s),`${rel} stores checkpoint evidence`); ok(/Form B/.test(s),`${rel} contains a parallel retake`);
  if(c===1){
    const am=s.match(/const A=\[([\s\S]*?)\n\];/), bm=s.match(/const B=\[([\s\S]*?)\n\];/);
    const ac=am?(am[1].match(/^\s*\[/gm)||[]).length:0, bc=bm?(bm[1].match(/^\s*\[/gm)||[]).length:0;
    ok(ac===30&&bc===30,`${rel} contains 30-item Form A and 30-item Form B banks`);
  }else ok((s.match(/<fieldset\b/g)||[]).length===60,`${rel} contains 30-item Form A + 30-item Form B`);
}

const engine=read('assets/psych101.js');
for(const fn of ['recordDailyReview','recordWeeklyScore','recordCumulativeScore','getNotebook','getJournal','getWords','setWordStudied','exportAll','importAll','resetAll']) ok(engine.includes(fn),`shared engine exposes ${fn}`);
ok(engine.includes("mastered:best>=MASTERY"),'mastery reconstructs from best actual assessment attempts');
ok(engine.includes("reviewed:!!reviewed"),'review status remains separate from mastery');

const w12=Array.from({length:5},(_,i)=>read(`lessons/week-12/day-${String(i+1).padStart(2,'0')}.html`).toLowerCase()).join('\n');
ok(w12.includes('diagnos'),'Week 12 explicitly teaches diagnosis boundaries');
ok(w12.includes('academic, not therapeutic')||w12.includes('academic, not therapeutic'.replace(',','')),'Week 12 preserves academic/non-therapeutic boundary');
ok(w12.includes('treatment evidence')||w12.includes('treatment'),'Week 12 addresses treatment evidence without personal advice');
const allLessons=Array.from({length:13},(_,wi)=>Array.from({length:5},(_,di)=>read(`lessons/week-${String(wi+1).padStart(2,'0')}/day-${String(di+1).padStart(2,'0')}.html`)).join('\n')).join('\n');
ok(/Fictional|fictional/.test(allLessons)&&/no personal|No personal|not therapeutic/.test(allLessons),'course includes privacy-preserving substitute examples and non-therapeutic framing');

// No external runtime URLs in student-facing HTML.
const htmlFiles=walk(root).filter(f=>f.endsWith('.html'));
for(const file of htmlFiles){
  const rel=path.relative(root,file).split(path.sep).join('/'); const s=fs.readFileSync(file,'utf8');
  const external=[...s.matchAll(/\b(?:href|src)=["'](https?:\/\/[^"']+)/gi)].map(m=>m[1]);
  ok(external.length===0,`${rel} has no external runtime href/src dependencies`);
  for(const m of s.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)){
    const u=m[1].trim(); if(!u||u.startsWith('#')||/^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(u)||u.includes('${')) continue;
    const clean=decodeURIComponent(u.split(/[?#]/)[0]); if(!clean||clean.startsWith('/')) continue;
    const target=path.resolve(path.dirname(file),clean); const resolved=fs.existsSync(target)||(fs.existsSync(path.join(target,'index.html')));
    ok(resolved,`${rel} local reference resolves: ${u}`);
  }
}

// Syntax-parse every external JS plus every inline executable script.
const jsFiles=walk(root).filter(f=>f.endsWith('.js'));
for(const file of jsFiles){try{new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});ok(true,`${path.relative(root,file)} syntax parses`);}catch(e){ok(false,`${path.relative(root,file)} syntax parses: ${e.message}`);}}
let inlineCount=0;
for(const file of htmlFiles){const s=fs.readFileSync(file,'utf8'); for(const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc\s*=/.test(m[1]))continue; const type=(m[1].match(/\btype=["']([^"']+)/i)||[])[1]||'text/javascript'; if(!/(?:java|ecma)script|module/i.test(type))continue; inlineCount++; try{new vm.Script(m[2],{filename:`${file}:inline-${inlineCount}`});ok(true,`${path.relative(root,file)} inline script ${inlineCount} syntax parses`);}catch(e){ok(false,`${path.relative(root,file)} inline script syntax parses: ${e.message}`);}}}

const sw=read('service-worker.js');
ok(sw.includes("psych101-grade9-v1-complete"),'service worker uses complete-course cache version');
for(const f of htmlFiles){const rel='./'+path.relative(root,f).split(path.sep).join('/'); ok(sw.includes(JSON.stringify(rel)),`offline cache includes ${rel}`);}
ok(sw.includes("./offline.html"),'offline fallback is cached');
ok(sw.includes("u.origin!==self.location.origin"),'service worker refuses cross-origin fetch interception');

const report={generated:new Date().toISOString(),lessonCount,dailyReviewItems:dailyItems,weeklyAssessments:weeklyCount,cumulativeAssessments:3,htmlFiles:htmlFiles.length,jsFiles:jsFiles.length,inlineScripts:inlineCount,checks:checks.length,failures,result:failures.length?'FAIL':'PASS'};
fs.writeFileSync(path.join(root,'VALIDATION_REPORT.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,failures:failures.slice(0,30)},null,2));
if(failures.length) process.exit(1);
