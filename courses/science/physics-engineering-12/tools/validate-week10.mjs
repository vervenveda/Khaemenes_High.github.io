import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),wk='weeks/week-10/',read=p=>fs.readFileSync(path.join(base,p),'utf8');let count=0;
function ok(yes,msg){assert.ok(yes,msg);count++;console.log('PASS '+msg)}
const index=read(wk+'index.html'),lesson=read(wk+'assets/week10-lesson.js'),engine=read(wk+'labs/energy-engine.js');
ok(index.includes('physics-week10-energy-studio'),'Week 10 interactive studio present');
for(const day of ['monday','tuesday','wednesday','thursday','friday'])ok(index.includes('sci-physics-&-engineering-12-w10-'+day),'original '+day+' learner journal preserved');
ok(index.includes('khae_high_science_evidence_v1:'),'legacy journal localStorage prefix preserved');
new vm.Script(lesson,{filename:'week10-lesson.js'});new vm.Script(engine,{filename:'energy-engine.js'});
ok(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(lesson+engine),'offline engine uses no network API');
const a=lesson.indexOf('const Q=')+8,b=lesson.indexOf(';let picked=',a);
ok(a>=8&&b>a,'format of assessment bank is recognized');const Q=JSON.parse(lesson.slice(a,b));
ok(Q.length===20,'20 week-specific assessment questions');
ok(new Set(Q.map(q=>q[1])).size===20,'no repeated question prompts');
Q.forEach(q=>ok(q.length===5&&q[0]===10&&q[2].length===4&&new Set(q[2]).size===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4,'quiz correct answer and options '+q[1].slice(0,35)));
ok(lesson.includes('day===5?10:4')&&lesson.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'Friday 10 and daily 4 question sampling');
ok(lesson.includes('if(locked)return'),'quiz double-score prevention');
ok(lesson.includes('khae:phys12:w10:energy:day:')&&lesson.includes('khae-phys12-w10-lesson-v1'),'scoped journal identity and import/export');
for(let d=1;d<=5;d++){const page=read(wk+'lessons/day-0'+d+'.html');
ok(page.includes('data-week="10" data-day="'+d+'"'),'day '+d+' has correct metadata');
ok((page.match(/<h3>/g)||[]).length===4,'day '+d+' has four substantial reading sections');
ok((page.match(/<dt>/g)||[]).length===5,'day '+d+' defines five vocabulary terms');
ok(page.includes('id="quiz"')&&page.includes('id="newQuiz"')&&page.includes('id="submitQuiz"'),'day '+d+' quiz controls exist');
ok(page.includes('id="mainNote"')&&page.includes('id="thoughtNote"')&&page.includes('id="exportNotes"'),'day '+d+' portfolio fields exist');
ok(index.includes('lessons/day-0'+d+'.html'),'weekly hub links day '+d)}
for(const [name,mode]of [['work-power-studio','work'],['work-energy-lab','energy']]){const page=read(wk+'labs/'+name+'.html');
ok(page.includes('data-lab="'+mode+'"'),'correct lab identity '+mode);ok(page.includes('src="energy-engine.js"'),'self-contained relative engine link '+mode);
ok(page.includes('id="diagram"')&&page.includes('id="plot"'),'two SVG visualizations '+mode);
ok(page.includes('id="history"')&&page.includes('id="tableRows"'),'accessible numeric tables '+mode);
for(const field of ['record','reset','export','import','clear','newGame','next','choices','prediction','analysis','print'])ok(page.includes('id="'+field+'"'),'lab control '+field+' '+mode)}
ok(engine.includes('slice(0,7)')&&engine.includes('if(locked)return'),'seven different randomized quiz rounds, score lock');
ok(engine.includes('feasible=final>=-1e-9')&&engine.includes('finalSpeed:feasible?'),'negative kinetic energy prevented in model');
const work=read(wk+'resources/work-data.csv').split(/\r?\n/).filter(s=>/^[a-z][a-z0-9_]*,/.test(s));
const energy=read(wk+'resources/energy-data.csv').split(/\r?\n/).filter(s=>/^[a-z][a-z0-9_]*,/.test(s));
ok(work.length===9,'nine calculated work/power examples');ok(energy.length===9,'nine calculated net-work energy examples');
for(const row of work){const [name,f,d,a,t,proj,w,p]=row.split(',').map((v,i)=>i===0?v:Number(v));const c=Math.cos(a*Math.PI/180),C=f*c,W=C*d,P=W/t;
ok([f,d,a,t,proj,w,p].every(Number.isFinite)&&t>0,'valid work row '+name);
ok(Math.abs(proj-C)<1e-5&&Math.abs(w-W)<1e-5,'work cosine and joules '+name);
ok(Math.abs(p-P)<1e-5,'average watts '+name)}
for(const row of energy){const [name,m,v,W,Ki,Kf,feasible,vf]=row.split(','),nums=[m,v,W,Ki,Kf].map(Number),[mass,speed,work,initial,final]=nums,good=initial+work>=-1e-9;
ok(nums.every(Number.isFinite)&&mass>0,'valid energy row '+name);
ok(Math.abs(initial-.5*mass*speed*speed)<1e-5&&Math.abs(final-(initial+work))<1e-5,'K initial/final and net work '+name);
ok(feasible===(good?'yes':'no'),'correct feasibility '+name);
ok(good?Math.abs(Number(vf)-Math.sqrt(2*final/mass))<1e-5:vf==='NA','final speed or incompatible marker '+name)}
const teacher=read(wk+'teacher/guide.html');ok(teacher.includes('20-point')&&teacher.includes('HS-PS3-1')&&teacher.includes('Wednesday'),'educator guidance complete');
for(const page of [wk+'index.html',wk+'teacher/guide.html',wk+'labs/work-power-studio.html',wk+'labs/work-energy-lab.html',...Array.from({length:5},(_,i)=>wk+'lessons/day-0'+(i+1)+'.html')]){const h=read(page);for(const match of h.matchAll(/(?:href|src)="([^"]+)"/g)){const url=match[1];if(!url||url.startsWith('#')||/^(https?:|mailto:|data:)/.test(url))continue;const target=path.resolve(path.dirname(path.join(base,page)),url.split('#')[0].split('?')[0]);ok(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),'local route '+page+' → '+url)}}
console.log('PHYSICS12_WEEK10_VALIDATION=PASS checks='+count);