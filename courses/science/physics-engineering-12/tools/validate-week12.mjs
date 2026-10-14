import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),wk='weeks/week-12/',read=p=>fs.readFileSync(path.join(base,p),'utf8');let checks=0;
const yes=(ok,label)=>{assert.ok(ok,label);checks++;console.log('PASS '+label)};
const hub=read(wk+'index.html'),shared=read(wk+'assets/week12-lesson.js'),engine=read(wk+'labs/power-engine.js');
yes(hub.includes('physics-week12-power-studio'),'Week 12 new directory visible');
for(const day of ['monday','tuesday','wednesday','thursday','friday'])yes(hub.includes('sci-physics-&-engineering-12-w12-'+day),'original '+day+' journal retained');
yes(hub.includes('khae_high_science_evidence_v1:'),'original evidence namespace retained');
new vm.Script(shared,{filename:'week12-lesson.js'});new vm.Script(engine,{filename:'power-engine.js'});
yes(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(shared+engine),'third-party network and telemetry absent');
const a=shared.indexOf('const Q=')+8,z=shared.indexOf(';let picked=',a);yes(a>=8&&z>a,'readable assessment bank');
const questions=JSON.parse(shared.slice(a,z));yes(questions.length===20,'twenty published formative practice questions');
yes(new Set(questions.map(q=>q[1])).size===20,'no duplicate question wording');
for(const q of questions)yes(q.length===5&&q[0]===12&&q[2].length===4&&new Set(q[2]).size===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4,'question answer metadata '+q[1].slice(0,32));
yes(shared.includes('day===5?10:4')&&shared.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'four daily and ten Friday questions');
yes(shared.includes('if(locked)return'),'score protected from repeated submission');
yes(shared.includes('khae:phys12:w12:efficiency:day:')&&shared.includes('khae-phys12-w12-lesson-v1'),'scoped learner work identity');
for(let day=1;day<=5;day++){const h=read(wk+'lessons/day-0'+day+'.html');yes(h.includes('data-week="12" data-day="'+day+'"'),'lesson identity day '+day);
yes((h.match(/<h3>/g)||[]).length===4,'substantial 4-part reading day '+day);
yes((h.match(/<dt>/g)||[]).length===5,'five terms with definitions day '+day);
for(const id of ['quiz','submitQuiz','newQuiz','mainNote','thoughtNote','exportNotes','importNotes'])yes(h.includes('id="'+id+'"'),'lesson '+day+' accessible element '+id);
yes(hub.includes('lessons/day-0'+day+'.html'),'weekly hub links day '+day)}
for(const [name,kind]of [['power-rate-studio','rate'],['efficiency-design-lab','efficiency']]){const h=read(wk+'labs/'+name+'.html');yes(h.includes('data-lab="'+kind+'"'),'lab identity '+kind);
yes(h.includes('src="power-engine.js"'),'shared offline simulator linked '+kind);
for(const id of ['energy','time','diagram','graph','comparisonRows','historyRows','result','prediction','analysis','record','reset','export','import','clear','print','newGame','next','choices'])yes(h.includes('id="'+id+'"'),'lab '+kind+' element '+id);
yes(h.includes('aria-label=')&&h.includes('role="status"'),'nonvisual alternatives and live feedback '+kind)}
yes(engine.includes('slice(0,7)')&&engine.includes('if(answered)return'),'seven distinct game cases and scoring guard');
yes(engine.includes('energyBalanced:')&&engine.includes('p.E<=500')&&engine.includes('useful>=300')&&engine.includes('p.t<=6'),'complete conservation and three design constraints');
const rateCsv=read(wk+'resources/power-data.csv').split(/\r?\n/).filter(x=>/^[a-z][a-z0-9_]*,/.test(x));
const effCsv=read(wk+'resources/efficiency-data.csv').split(/\r?\n/).filter(x=>/^[a-z][a-z0-9_]*,/.test(x));
yes(rateCsv.length===10,'ten power-rate examples');yes(effCsv.length===10,'ten efficiency-design examples');
const near=(a,b)=>Math.abs(a-b)<1e-5;
for(const row of rateCsv){const [name,E,t,P]=row.split(',');const numbers=[E,t,P].map(Number);yes(numbers.every(Number.isFinite)&&numbers[0]>0&&numbers[1]>0,'power row numeric '+name);yes(near(numbers[0]/numbers[1],numbers[2]),'power J/s correct '+name)}
for(const row of effCsv){const [name,E,eta,t,U,O,Pi,Pu,Po,feasible]=row.split(',');const ns=[E,eta,t,U,O,Pi,Pu,Po].map(Number),[ein,percent,time,useful,other,pin,puseful,pother]=ns;
yes(ns.every(Number.isFinite)&&ein>0&&percent>=0&&percent<=100&&time>0,'efficiency row valid '+name);
yes(near(ein,other+useful)&&near(useful,ein*percent/100),'energy ledger + ratio '+name);
yes(near(pin,ein/time)&&near(puseful,useful/time)&&near(pother,other/time),'input, useful and other watts '+name);
yes(feasible===(ein<=500&&useful>=300&&time<=6?'yes':'no'),'meets all three constraints '+name)}
const guide=read(wk+'teacher/guide.html');yes(guide.includes('20-point')&&guide.includes('HS-PS3-3')&&guide.includes('Friday'),'teacher guide and rubric');
const pages=[wk+'index.html',wk+'teacher/guide.html',wk+'labs/power-rate-studio.html',wk+'labs/efficiency-design-lab.html',...Array.from({length:5},(_,i)=>wk+'lessons/day-0'+(i+1)+'.html')];
for(const file of pages){const h=read(file);for(const hit of h.matchAll(/(?:href|src)="([^"]+)"/g)){const href=hit[1];if(!href||href.startsWith('#')||/^(https?:|mailto:|data:)/.test(href))continue;const full=path.resolve(path.dirname(path.join(base,file)),href.split('?')[0].split('#')[0]);yes(fs.existsSync(full)||fs.existsSync(path.join(full,'index.html')),'resolved local link '+file+' -> '+href)}}
console.log('PHYSICS12_WEEK12_VALIDATION=PASS checks='+checks);
