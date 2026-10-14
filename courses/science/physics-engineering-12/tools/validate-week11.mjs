import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),wk='weeks/week-11/',read=p=>fs.readFileSync(path.join(root,p),'utf8');
let count=0;function check(truth,reason){assert.ok(truth,reason);count++;console.log('PASS '+reason)}
const hub=read(wk+'index.html'),lesson=read(wk+'assets/week11-lesson.js'),engine=read(wk+'labs/conservation-engine.js');
check(hub.includes('physics-week11-conservation-studio'),'Week 11 enhanced course entry');
for(const d of ['monday','tuesday','wednesday','thursday','friday'])check(hub.includes('sci-physics-&-engineering-12-w11-'+d),'original '+d+' student note preserved');
check(hub.includes('khae_high_science_evidence_v1:'),'legacy student evidence localStorage prefix retained');
new vm.Script(lesson,{filename:'week11-lesson.js'});new vm.Script(engine,{filename:'conservation-engine.js'});
check(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(engine+lesson),'no third-party/remote runtime calls');
const i=lesson.indexOf('const Q=')+8,j=lesson.indexOf(';let picked=',i);check(i>=8&&j>i,'quiz bank recognized');
const bank=JSON.parse(lesson.slice(i,j));check(bank.length===20,'20 public formative questions');check(new Set(bank.map(x=>x[1])).size===20,'no duplicate prompts');
bank.forEach(x=>check(x.length===5&&x[0]===11&&x[2].length===4&&new Set(x[2]).size===4&&Number.isInteger(x[3])&&x[3]>=0&&x[3]<4,'valid science answer '+x[1].slice(0,30)));
check(lesson.includes('day===5?10:4')&&lesson.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'Friday picks 10, daily lesson picks 4');
check(lesson.includes('if(locked)return'),'quiz scoring is single-submission');
check(lesson.includes('khae:phys12:w11:potential:day:')&&lesson.includes('khae-phys12-w11-lesson-v1'),'student note identity separate from older weeks');
for(let d=1;d<=5;d++){const h=read(wk+'lessons/day-0'+d+'.html');check(h.includes('data-week="11" data-day="'+d+'"'),'day '+d+' metadata');check((h.match(/<h3>/g)||[]).length===4,'day '+d+' has four reading sections');check((h.match(/<dt>/g)||[]).length===5,'day '+d+' has five vocabulary definitions');check(h.includes('id="quiz"')&&h.includes('id="submitQuiz"')&&h.includes('id="newQuiz"'),'day '+d+' practice controls');check(h.includes('id="mainNote"')&&h.includes('id="thoughtNote"')&&h.includes('id="exportNotes"'),'day '+d+' journal and export');check(hub.includes('lessons/day-0'+d+'.html'),'hub links lesson '+d)}
for(const [page,kind]of [['gravity-energy-studio.html','gravity'],['spring-energy-studio.html','spring']]){const h=read(wk+'labs/'+page);check(h.includes('data-lab="'+kind+'"'),'distinct '+kind+' lab identity');check(h.includes('src="conservation-engine.js"'),'local shared engine linked to '+kind);for(const id of ['diagram','plot','comparisonRows','trialRows','readout','prediction','analysis','record','reset','export','import','clear','print','newGame','next','choices'])check(h.includes('id="'+id+'"'),'working control '+kind+':'+id)}
check(engine.includes('slice(0,7)')&&engine.includes('if(locked)return'),'seven unique game cases per run, no repeated scoring');
check(engine.includes('released-other')&&engine.includes('total:U+K+other'),'complete potential, kinetic and other energy ledger');
const gravity=read(wk+'resources/gravity-energy.csv').split(/\r?\n/).filter(s=>/^[a-z][a-z0-9_]*,/.test(s));
const springs=read(wk+'resources/spring-energy.csv').split(/\r?\n/).filter(s=>/^[a-z][a-z0-9_]*,/.test(s));
check(gravity.length===10,'ten gravitational model data rows');check(springs.length===10,'ten elastic model data rows');
const near=(a,b)=>Math.abs(a-b)<2e-5;
for(const row of gravity){const [name,m,H,x,loss,total,U,K,other,end,speed]=row.split(','),p=[m,H,x,loss,total,U,K,other,end,speed].map(Number),[mass,start,at,f,initial,potential,kinetic,transferred,final,v]=p;
check(p.every(Number.isFinite)&&mass>0&&at<=start,'gravity data complete '+name);
check(near(initial,mass*9.8*start)&&near(potential,mass*9.8*at),'gravity potential '+name);
check(near(kinetic,(initial-potential)*(1-f/100))&&near(transferred,(initial-potential)*f/100),'gravity transformation '+name);
check(near(final,potential+kinetic+transferred)&&near(final,initial),'gravity conservation '+name);
check(near(v,Math.sqrt(2*kinetic/mass)),'gravity speed '+name)}
for(const row of springs){const [name,m,k,H,x,loss,total,U,K,other,end,speed]=row.split(','),p=[m,k,H,x,loss,total,U,K,other,end,speed].map(Number),[mass,stiff,start,at,f,initial,potential,kinetic,transferred,final,v]=p;
check(p.every(Number.isFinite)&&mass>0&&at<=start,'spring data complete '+name);
check(near(initial,.5*stiff*(start/100)**2)&&near(potential,.5*stiff*(at/100)**2),'spring energy cm-to-m conversion '+name);
check(near(kinetic,(initial-potential)*(1-f/100))&&near(transferred,(initial-potential)*f/100),'spring transformation '+name);
check(near(final,potential+kinetic+transferred)&&near(final,initial),'spring conservation '+name);
check(near(v,Math.sqrt(2*kinetic/mass)),'spring speed '+name)}
const guide=read(wk+'teacher/guide.html');check(guide.includes('20-point')&&guide.includes('HS-PS3-2')&&guide.includes('Friday'),'teacher worked answers and rubric');
const pages=[wk+'index.html',wk+'teacher/guide.html',wk+'labs/gravity-energy-studio.html',wk+'labs/spring-energy-studio.html',...Array.from({length:5},(_,i)=>wk+'lessons/day-0'+(i+1)+'.html')];
for(const f of pages){const h=read(f);for(const x of h.matchAll(/(?:href|src)="([^"]+)"/g)){const url=x[1];if(!url||url.startsWith('#')||/^(https?:|mailto:|data:)/.test(url))continue;const dest=path.resolve(path.dirname(path.join(root,f)),url.split('?')[0].split('#')[0]);check(fs.existsSync(dest)||fs.existsSync(path.join(dest,'index.html')),'local route '+f+' → '+url)}}
console.log('PHYSICS12_WEEK11_VALIDATION=PASS checks='+count);
