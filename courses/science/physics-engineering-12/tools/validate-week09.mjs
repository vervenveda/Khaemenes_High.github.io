import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),week='weeks/week-09/';
const read=p=>fs.readFileSync(path.join(base,p),'utf8');let count=0;
const ok=(yes,title)=>{assert.ok(yes,title);count++;console.log('PASS '+title)};
const hub=read(week+'index.html'),j=read(week+'assets/week09-lesson.js'),engine=read(week+'labs/lab-engine.js');
ok(hub.includes('physics-week09-gravity-studio'),'new weekly section exists');
for(const d of ['monday','tuesday','wednesday','thursday','friday'])ok(hub.includes('sci-physics-&-engineering-12-w09-'+d),'original daily evidence '+d+' preserved');
ok(hub.includes('khae_high_science_evidence_v1:'),'legacy evidence namespace retained');
new vm.Script(j,{filename:'week09-lesson.js'});new vm.Script(engine,{filename:'lab-engine.js'});
ok(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(j+engine),'no network/telemetry dependencies');
const q0=j.indexOf('const Q=')+8,q1=j.indexOf(';let picked=',q0);
ok(q0>=8&&q1>q0,'quiz bank format found');
const qs=JSON.parse(j.slice(q0,q1));ok(qs.length===20,'twenty Week 09 questions');
ok(new Set(qs.map(x=>x[1])).size===20,'quiz questions unique');
qs.forEach(x=>ok(x.length===5&&x[0]===9&&x[2].length===4&&new Set(x[2]).size===4&&Number.isInteger(x[3])&&x[3]>=0&&x[3]<4,'well formed question '+x[1].slice(0,33)));
ok(j.includes('day===5?10:4')&&j.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'random Friday and day-specific question selection');
ok(j.includes('if(locked)return'),'answers locked after scoring');
ok(j.includes('khae:phys12:w09:orbit:day:')&&j.includes('khae-phys12-w09-lesson-v1'),'scoped evidence storage and import');
for(let n=1;n<=5;n++){const page=read(week+'lessons/day-0'+n+'.html');
ok(page.includes('data-week="9" data-day="'+n+'"'),'day '+n+' identity');
ok((page.match(/<h3>/g)||[]).length===4,'day '+n+' has four full reading sections');
ok((page.match(/<dt>/g)||[]).length===5,'day '+n+' has five vocabulary terms');
ok(page.includes('id="mainNote"')&&page.includes('id="thoughtNote"')&&page.includes('id="exportNotes"'),'day '+n+' notes/export');
ok(page.includes('id="quiz"')&&page.includes('id="submitQuiz"')&&page.includes('id="newQuiz"'),'day '+n+' practice quiz controls');
ok(hub.includes('lessons/day-0'+n+'.html'),'day '+n+' linked from hub')}
for(const name of ['gravity-field-explorer','orbital-motion-studio']){const page=read(week+'labs/'+name+'.html');
ok(page.includes('src="lab-engine.js"'),'local shared vanilla JS linked '+name);
ok(page.includes('id="diagram"')&&page.includes('id="plot"'),'SVG model and graph '+name);
ok(page.includes('id="tableRows"')&&page.includes('id="history"'),'accessible data/history '+name);
for(const c of ['body','alt','mass','phase','prediction','analysis','record','reset','clear','export','import','newGame','next','choices','print'])ok(page.includes('id="'+c+'"'),'wired control '+c+' in '+name)}
ok(engine.includes('CASES=orbit?')&&engine.includes("slice(0,7)")&&engine.includes('if(locked)return'),'distinct seven-round randomized challenge and score lock');
const values={earth:{R:6371,mu:3.986004418e14},moon:{R:1737.4,mu:4.9048695e12}};
const gravitational=read(week+'resources/gravity-data.csv').split(/\r?\n/).filter(x=>/^(earth|moon),/.test(x));
const orbital=read(week+'resources/orbital-data.csv').split(/\r?\n/).filter(x=>/^(earth|moon),/.test(x));
ok(gravitational.length===12,'twelve gravity CSV cases');ok(orbital.length===10,'ten orbit CSV cases');
for(const line of gravitational){const [body,alt,r,g,m,F,ratio]=line.split(',');const b=values[body],radius=(b.R+Number(alt))*1000,G=b.mu/radius**2,surface=b.mu/(b.R*1000)**2;
ok(Number(m)===10&&Math.abs(Number(r)-radius/1000)<1e-4,'gravity radius/mass '+body+alt);
ok(Math.abs(Number(g)-G)<1e-5&&Math.abs(Number(F)-10*G)<1e-5,'gravity field/force '+body+alt);
ok(Math.abs(Number(ratio)-G/surface)<1e-5,'inverse square field ratio '+body+alt)}
for(const line of orbital){const [body,alt,r,g,v,T]=line.split(',');const b=values[body],radius=(b.R+Number(alt))*1000,G=b.mu/radius**2,V=Math.sqrt(b.mu/radius)/1000,period=2*Math.PI*Math.sqrt(radius**3/b.mu)/60;
ok(Math.abs(Number(r)-radius/1000)<1e-4,'circular radius '+body+alt);
ok(Math.abs(Number(g)-G)<1e-5,'circular field '+body+alt);
ok(Math.abs(Number(v)-V)<1e-5&&Math.abs(Number(T)-period)<1e-5,'circular speed/period '+body+alt)}
const guide=read(week+'teacher/guide.html');ok(guide.includes('20-point')&&guide.includes('Friday')&&guide.includes('HS-PS2-4'),'teacher scoring and scientific alignment');
const pages=[week+'index.html',week+'teacher/guide.html',week+'labs/gravity-field-explorer.html',week+'labs/orbital-motion-studio.html',...Array.from({length:5},(_,i)=>week+'lessons/day-0'+(i+1)+'.html')];
for(const file of pages){const html=read(file);for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const href=m[1];if(!href||href.startsWith('#')||/^(https?:|mailto:|data:)/.test(href))continue;const target=path.resolve(path.dirname(path.join(base,file)),href.split('#')[0].split('?')[0]);ok(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),'local link '+file+' → '+href)}}
console.log('PHYSICS12_WEEK09_VALIDATION=PASS checks='+count);
