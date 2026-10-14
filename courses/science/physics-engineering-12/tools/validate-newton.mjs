import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const prefix='weeks/week-07/';
let checks=0;function pass(ok,label){assert.ok(ok,label);checks++;console.log('PASS '+label)}
const hub=read(prefix+'index.html'),js=read(prefix+'assets/newton-lesson.js'),lab=read(prefix+'labs/newtons-laws-studio.html');
pass(hub.includes('physics-week07-newton-studio'),'student hub links new science studio');
for(const d of ['monday','tuesday','wednesday','thursday','friday'])pass(hub.includes('sci-physics-&-engineering-12-w07-'+d),'preserved original '+d+' daily student evidence');
pass(hub.includes('khae_high_science_evidence_v1:'),'legacy journal namespace preserved');
pass(hub.includes('labs/newtons-laws-studio.html'),'hub links canonical virtual lab');
pass(hub.includes('teacher/guide.html'),'hub links teacher guide');
pass(hub.includes('resources/newton-data.csv'),'hub links cart dataset');
pass(hub.includes('resources/interaction-pairs.csv'),'hub links interaction pairs dataset');
pass(!/\bfetch\(|WebSocket\(|XMLHttpRequest|sendBeacon\(/.test(lab+js),'no external network or telemetry');
new vm.Script(js,{filename:'newton-lesson.js'});
const start=js.indexOf('const Q=')+8,end=js.indexOf(';let picked=',start);
pass(start>8&&end>start,'newton question bank is parseable');
const questions=JSON.parse(js.slice(start,end));
pass(questions.length===20,'20 questions available for Week 07');
pass(questions.every(q=>q.length===5&&q[0]===7&&q[2].length===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4),'correct unique five-field answer schema');
pass(new Set(questions.map(q=>q[1])).size===20,'no duplicate question text');
pass(js.includes('day===5?10:4'),'Friday draws ten questions');
pass(js.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'daily questions aligned with content');
pass(js.includes('if(locked)return'),'quiz locks one submission');
pass(js.includes('khae:phys12:w07:newton:day:'),'new lesson notes independent from existing courses');
pass(js.includes('khae-phys12-newton-lesson-v1'),'JSON import/export scheme is scoped');
for(let i=1;i<=5;i++){const day=read(prefix+'lessons/day-0'+i+'.html');
pass(day.includes('data-week="7" data-day="'+i+'"'),'day '+i+' metadata');
pass(day.includes('id="quiz"')&&day.includes('id="newQuiz"')&&day.includes('id="submitQuiz"'),'day '+i+' quiz controls');
pass(day.includes('id="mainNote"')&&day.includes('id="thoughtNote"')&&day.includes('id="exportNotes"'),'day '+i+' student journal');
pass((day.match(/<h3>/g)||[]).length>=4,'day '+i+' has four reading sections');
pass((day.match(/<dt>/g)||[]).length===5,'day '+i+' has five vocabulary definitions');
pass(hub.includes('lessons/day-0'+i+'.html'),'day '+i+' appears in weekly hub')}
const htmlScript=lab.match(/<script>([\s\S]*?)<\/script>/);
pass(!!htmlScript,'native JavaScript instrument present');
new vm.Script(htmlScript[1],{filename:'newtons-laws-studio.js'});
pass(lab.includes('id="forceGraph"')&&lab.includes('id="massGraph"')&&lab.includes('id="pairGraph"'),'three SVG force and mass visualizations');
pass(lab.includes('id="comparisonRows"')&&lab.includes('id="trialRows"'),'accessible data tables included');
for(const id of ['recordCart','recordPair','presetBalance','presetMass','export','import','clear','newGame','nextGame','challengeChoices'])pass(lab.includes('id="'+id+'"'),'wired component '+id);
const game=htmlScript[1].match(/const CASES=(\[[\s\S]*?\]);\s*const ids=/);
pass(!!game,'math challenge data parsed');
const cases=JSON.parse(game[1]);pass(cases.length===11,'11 distinct learning challenges');
pass(cases.filter(x=>x.type==='accel').length>=6,'more than six acceleration cases');
pass(cases.filter(x=>x.type==='reaction').length>=3,'third-law questions included');
for(const c of cases){pass((c.type==='accel'&&Number.isFinite(c.m)&&c.m>0&&Number.isFinite(c.f)&&Number.isFinite(c.f/c.m))||(c.type==='reaction'&&Number.isFinite(c.f)),'numeric scenario is sound')}
const cartCSV=read(prefix+'resources/newton-data.csv').split(/\r?\n/).filter(x=>/^[A-Za-z0-9_]+,/.test(x)&&!x.startsWith('Case,'));
pass(cartCSV.length===8,'eight synthetic cart model examples');
for(const line of cartCSV){const [label,...cols]=line.split(','),[m,f,v,T,a,vf,dx]=cols.map(Number);
pass(cols.length===7,'cart CSV has complete columns for '+label);
pass(Math.abs(a-f/m)<1e-8,'cart acceleration valid for '+label);
pass(Math.abs(vf-(v+a*T))<1e-8,'cart final velocity valid for '+label);
pass(Math.abs(dx-(v*T+.5*a*T*T))<1e-8,'cart displacement valid for '+label)}
const pairCSV=read(prefix+'resources/interaction-pairs.csv').split(/\r?\n/).filter(x=>/^[A-Za-z0-9_]+,/.test(x)&&!x.startsWith('Case,'));
pass(pairCSV.length===5,'five third-law force pair examples');
for(const line of pairCSV){const [label,...cols]=line.split(','),[mA,mB,fAB,fBA,aA,aB]=cols.map(Number);
pass(cols.length===6,'pair CSV complete for '+label);
pass(Math.abs(fAB+fBA)<1e-8,'equal opposite forces '+label);
pass(Math.abs(aA-fBA/mA)<1e-8&&Math.abs(aB-fAB/mB)<1e-8,'isolated-net accelerations '+label)}
const teacher=read(prefix+'teacher/guide.html');
pass(teacher.includes('20-point')&&teacher.includes('third-law')&&teacher.includes('simulation'),'teacher rubric and misconception guidance available');
const pages=[prefix+'index.html',prefix+'teacher/guide.html',prefix+'labs/newtons-laws-studio.html',...Array.from({length:5},(_,i)=>prefix+'lessons/day-0'+(i+1)+'.html')];
for(const file of pages){const h=read(file);for(const m of h.matchAll(/(?:href|src)="([^"]+)"/g)){const url=m[1];if(!url||url.startsWith('#')||/^(https?:|mailto:|data:)/.test(url))continue;const target=path.resolve(path.dirname(path.join(base,file)),url.split('#')[0].split('?')[0]);pass(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),'relative link '+file+' -> '+url)}}
console.log('PHYSICS12_WEEK07_VALIDATION=PASS checks='+checks);