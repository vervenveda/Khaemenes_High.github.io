import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),wk='weeks/week-14/',read=p=>fs.readFileSync(path.join(root,p),'utf8');
let count=0;function check(ok,why){assert.ok(ok,why);count++;console.log('PASS '+why)}
const hub=read(wk+'index.html'),quiz=read(wk+'assets/week14-lesson.js'),engine=read(wk+'labs/impulse-engine.js');
check(hub.includes('physics-week14-impulse-studio'),'Week 14 curriculum hub linked');
for(const day of ['monday','tuesday','wednesday','thursday','friday'])check(hub.includes('sci-physics-&-engineering-12-w14-'+day),'retained original learner evidence '+day);
check(hub.includes('khae_high_science_evidence_v1:'),'student progress namespace preserved');
new vm.Script(quiz,{filename:'week14-lesson.js'});new vm.Script(engine,{filename:'impulse-engine.js'});
check(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(quiz+engine),'offline no telemetry dependencies');
const a=quiz.indexOf('const Q=')+8,b=quiz.indexOf(';let picked=',a);check(a>=8&&b>a,'quiz bank found');
const Q=JSON.parse(quiz.slice(a,b));check(Q.length===20,'20 daily and weekly assessment questions');check(new Set(Q.map(x=>x[1])).size===20,'questions not repeated');
for(const q of Q)check(q.length===5&&q[0]===14&&q[2].length===4&&new Set(q[2]).size===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4,'four-choice question '+q[1].slice(0,25));
check(quiz.includes('day===5?10:4'),'Friday quiz samples ten');
check(quiz.includes('if(locked)return'),'quiz rejects repeated scoring');
check(quiz.includes('khae:phys12:w14:impulse:day:')&&quiz.includes('khae-phys12-w14-lesson-v1'),'Week 14 independent journal identity');
for(let d=1;d<=5;d++){const day=read(wk+'lessons/day-0'+d+'.html');check(day.includes('data-week="14" data-day="'+d+'"'),'day identity '+d);check((day.match(/<h3>/g)||[]).length===4,'four learning sections day '+d);check((day.match(/<dt>/g)||[]).length===5,'five vocabulary definitions day '+d);check(day.includes('id="quiz"')&&day.includes('id="submitQuiz"')&&day.includes('id="newQuiz"'),'quiz controls day '+d);check(day.includes('id="mainNote"')&&day.includes('id="thoughtNote"')&&day.includes('id="exportNotes"'),'evidence controls day '+d);check(hub.includes('lessons/day-0'+d+'.html'),'hub links day '+d)}
for(const [filename,kind] of [['momentum-change-lab.html','momentum'],['force-time-pulse-studio.html','pulse']]){const page=read(wk+'labs/'+filename);check(page.includes('data-lab="'+kind+'"'),'lab identity '+kind);check(page.includes('src="impulse-engine.js"'),'lab engine linked '+kind);for(const id of ['forceGraph','comparisonRows','historyRows','readout','prediction','analysis','record','reset','clear','export','import','print','newGame','next','choices'])check(page.includes('id="'+id+'"'),'wired lab control '+kind+':'+id)}
check(engine.includes('slice(0,7)')&&engine.includes('if(locked)return'),'seven-game randomized sampling and scoring lock');
const momentumCSV=read(wk+'resources/momentum-data.csv').split(/\r?\n/).filter(x=>/^[a-z][a-z0-9_]*,/.test(x));
const pulseCSV=read(wk+'resources/pulse-data.csv').split(/\r?\n/).filter(x=>/^[a-z][a-z0-9_]*,/.test(x));
check(momentumCSV.length===10,'ten mathematical momentum trials');check(pulseCSV.length===10,'ten ideal pulse trials');
const near=(a,b)=>Math.abs(a-b)<2e-5;
for(const row of momentumCSV){const [caseName,...nums]=row.split(','),[m,vi,vf,t,pi,pf,J,F]=nums.map(Number);check(nums.length===8&&nums.every(x=>Number.isFinite(Number(x)))&&t>0,'momentum row schema '+caseName);check(near(pi,m*vi)&&near(pf,m*vf),'momentum signed values '+caseName);check(near(J,m*(vf-vi)),'impulse change '+caseName);check(near(F,J/t),'mean force '+caseName)}
for(const row of pulseCSV){const [caseName,Ji,ti,shape,avg,peak,mag,area]=row.split(','),J=Number(Ji),t=Number(ti);check(['rectangle','triangle'].includes(shape)&&t>0,'pulse profile schema '+caseName);check(near(Number(avg),J/t),'pulse mean force '+caseName);check(near(Number(peak),(shape==='triangle'?2:1)*J/t),'pulse peak force '+caseName);check(near(Number(mag),Math.abs(Number(peak)))&&near(Number(area),J),'pulse magnitude and signed area '+caseName)}
const teacher=read(wk+'teacher/guide.html');check(teacher.includes('20-point')&&teacher.includes('HS-PS2-2')&&teacher.includes('Friday'),'teacher guide with rubric and standards');
const pages=[wk+'index.html',wk+'teacher/guide.html',wk+'labs/momentum-change-lab.html',wk+'labs/force-time-pulse-studio.html',...Array.from({length:5},(_,i)=>wk+'lessons/day-0'+(i+1)+'.html')];
for(const p of pages){const h=read(p);for(const m of h.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(!u||u.startsWith('#')||/^(https?:|mailto:|data:)/.test(u))continue;const dest=path.resolve(path.dirname(path.join(root,p)),u.split('#')[0].split('?')[0]);check(fs.existsSync(dest)||fs.existsSync(path.join(dest,'index.html')),'relative link '+p+' -> '+u)}}
console.log('PHYSICS12_WEEK14_VALIDATION=PASS checks='+count);
