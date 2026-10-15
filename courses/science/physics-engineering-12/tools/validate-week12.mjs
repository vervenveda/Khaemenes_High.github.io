import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),wk='weeks/week-12/';
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
let checks=0;function ok(value,reason){assert.ok(value,reason);checks++;console.log('PASS '+reason)}
const hub=read(wk+'index.html'),lesson=read(wk+'assets/week12-lesson.js'),engine=read(wk+'labs/power-engine.js');
ok(hub.includes('physics-week12-power-studio'),'Week 12 course directory present');
for(const d of ['monday','tuesday','wednesday','thursday','friday'])ok(hub.includes('sci-physics-&-engineering-12-w12-'+d),'original '+d+' evidence field preserved');
ok(hub.includes('khae_high_science_evidence_v1:'),'original progress localStorage key retained');
new vm.Script(lesson,{filename:'week12-lesson.js'});
new vm.Script(engine,{filename:'power-engine.js'});
ok(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(lesson+engine),'no third-party network APIs in new scripts');
const first=lesson.indexOf('const Q=')+8,last=lesson.indexOf(';let picked=',first);
ok(first>=8&&last>first,'lesson quiz payload is valid JSON');
const bank=JSON.parse(lesson.slice(first,last));
ok(bank.length===20,'twenty Week 12 practice questions');
ok(new Set(bank.map(x=>x[1])).size===20,'all prompts unique');
bank.forEach((q,i)=>ok(q.length===5&&q[0]===12&&q[2].length===4&&new Set(q[2]).size===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4,'well-formed question '+(i+1)));
ok(lesson.includes('day===5?10:4')&&lesson.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'Friday ten-question sampling and topic-focused daily banks');
ok(lesson.includes('if(locked)return'),'scores protected against repeat submission');
ok(lesson.includes('khae:phys12:w12:efficiency:day:')&&lesson.includes('khae-phys12-w12-lesson-v1'),'lesson local storage uses new schema and namespace');
for(let d=1;d<=5;d++){const h=read(wk+'lessons/day-0'+d+'.html');
ok(h.includes('data-week="12" data-day="'+d+'"'),'day '+d+' body metadata');
ok((h.match(/<h3>/g)||[]).length===4,'day '+d+' includes four complete reading sections');
ok((h.match(/<dt>/g)||[]).length===5,'day '+d+' includes five vocabulary definitions');
ok(h.includes('id="quiz"')&&h.includes('id="submitQuiz"')&&h.includes('id="newQuiz"'),'day '+d+' quiz is wired');
ok(h.includes('id="mainNote"')&&h.includes('id="thoughtNote"')&&h.includes('id="exportNotes"'),'day '+d+' journal controls wired');
ok(hub.includes('lessons/day-0'+d+'.html'),'week links to day '+d)}
for(const [file,kind] of [['power-rate-studio.html','rate'],['efficiency-design-lab.html','efficiency']]){
const h=read(wk+'labs/'+file);ok(h.includes('data-lab="'+kind+'"'),'lab kind '+kind);
ok(h.includes('src="power-engine.js"'),'offline shared vanilla lab engine '+kind);
for(const id of ['diagram','graph','comparisonRows','historyRows','result','energy','time','prediction','analysis','record','reset','export','import','clear','print','newGame','next','choices'])
ok(h.includes('id="'+id+'"'),'lab '+kind+' control '+id);
if(kind==='efficiency')ok(h.includes('id="efficiency"'),'efficiency percentage control included');
}
ok(engine.includes('slice(0,7)')&&engine.includes('if(answered)return'),'randomized seven cases with double-scoring guard');
ok(engine.includes('E<=500')||engine.includes('p.E<=500'),'engineering constraint implemented');
ok(engine.includes('energyBalanced')&&engine.includes('p.E-useful-other'),'energy balance explicitly modeled');
const rate=read(wk+'resources/power-data.csv').split(/\r?\n/).filter(x=>/^[a-z][a-z0-9_]*,/.test(x));
const eff=read(wk+'resources/efficiency-data.csv').split(/\r?\n/).filter(x=>/^[a-z][a-z0-9_]*,/.test(x));
ok(rate.length===10,'ten power-rate synthetic cases');ok(eff.length===10,'ten efficiency synthetic cases');
const near=(a,b)=>Math.abs(a-b)<1e-5;
for(const line of rate){const [name,E,t,P]=line.split(',');const v=[E,t,P].map(Number);
ok(v.every(Number.isFinite)&&Number(E)>=20&&Number(t)>0,'valid power CSV numbers '+name);
ok(near(Number(P),Number(E)/Number(t)),'power E/t formula '+name)}
for(const line of eff){const [name,E,eta,t,useful,other,inputP,usefulP,otherP,meets]=line.split(',');
const nums=[E,eta,t,useful,other,inputP,usefulP,otherP].map(Number),[e,a,time,u,o,pin,pout,pother]=nums,passes=e<=500&&u>=300-1e-5&&time<=6;
ok(nums.every(Number.isFinite)&&e>0&&a>=0&&a<=100&&time>0,'valid efficiency CSV numbers '+name);
ok(near(u,e*a/100)&&near(o,e-u)&&near(u+o,e),'complete useful/other energy budget '+name);
ok(near(pin,e/time)&&near(pout,u/time)&&near(pother,o/time),'all three average powers in shared window '+name);
ok(meets===(passes?'yes':'no'),'design constraints correctly evaluated '+name)}
const guide=read(wk+'teacher/guide.html');
ok(guide.includes('20-point')&&guide.includes('HS-PS3-3')&&guide.includes('Friday'),'teacher guide has standards and human-reviewed rubric');
const pages=[wk+'index.html',wk+'teacher/guide.html',wk+'labs/power-rate-studio.html',wk+'labs/efficiency-design-lab.html',...Array.from({length:5},(_,i)=>wk+'lessons/day-0'+(i+1)+'.html')];
for(const page of pages){const h=read(page);for(const found of h.matchAll(/(?:href|src)="([^"]+)"/g)){
const u=found[1];if(!u||u.startsWith('#')||/^(https?:|mailto:|data:)/.test(u))continue;
const target=path.resolve(path.dirname(path.join(base,page)),u.split('#')[0].split('?')[0]);
ok(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),'local relative route '+page+' → '+u)}}
console.log('PHYSICS12_WEEK12_VALIDATION=PASS checks='+checks);
