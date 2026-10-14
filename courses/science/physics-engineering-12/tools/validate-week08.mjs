import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),wk='weeks/week-08/',read=p=>fs.readFileSync(path.join(root,p),'utf8');
let checks=0;function test(c,m){assert.ok(c,m);checks++;console.log('PASS '+m)}
const hub=read(wk+'index.html'),lesson=read(wk+'assets/week08-lesson.js');
test(hub.includes('physics-week08-studio'),'Week 08 has new learning studio directory');
for(const day of ['monday','tuesday','wednesday','thursday','friday'])test(hub.includes('sci-physics-&-engineering-12-w08-'+day),'preserves original '+day+' daily evidence');
test(hub.includes('khae_high_science_evidence_v1:'),'preserves original storage namespace');
new vm.Script(lesson,{filename:'week08-lesson.js'});
const first=lesson.indexOf('const Q=')+8,last=lesson.indexOf(';let picked=',first);
test(first>=8&&last>first,'shared quiz bank format');
const qs=JSON.parse(lesson.slice(first,last));
test(qs.length===20,'20 formative questions');
test(new Set(qs.map(q=>q[1])).size===20,'unique questions');
for(const q of qs)test(q.length===5&&q[0]===8&&q[2].length===4&&new Set(q[2]).size===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4,'valid four-option question '+q[1].slice(0,28));
test(lesson.includes('day===5?10:4'),'Friday chooses ten questions from weekly bank');
test(lesson.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'daily practice is day scoped');
test(lesson.includes('if(locked)return'),'prevents duplicate scoring');
test(lesson.includes('khae:phys12:w08:motion:day:'),'lesson storage scoped to Week 08');
test(lesson.includes('khae-phys12-w08-lesson-v1'),'import identity checks');
for(let i=1;i<=5;i++){const day=read(wk+'lessons/day-0'+i+'.html');test(day.includes('data-week="8" data-day="'+i+'"'),'lesson metadata day '+i);test(day.includes('id="quiz"')&&day.includes('id="newQuiz"')&&day.includes('id="submitQuiz"'),'quiz functionality hooks day '+i);test(day.includes('id="mainNote"')&&day.includes('id="thoughtNote"')&&day.includes('id="exportNotes"'),'journal and export day '+i);test((day.match(/<h3>/g)||[]).length===4,'four distinct deep reading sections day '+i);test((day.match(/<dt>/g)||[]).length===5,'five definitions day '+i);test(hub.includes('lessons/day-0'+i+'.html'),'weekly entry link day '+i)}
for(const p of [wk+'labs/circular-motion-studio.html',wk+'labs/friction-contact-lab.html']){
const html=read(p);const s=html.match(/<script>([\s\S]*?)<\/script>/);
test(!!s,'inline offline JavaScript exists '+p);new vm.Script(s[1],{filename:p});
test(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(html),'no telemetry/network dependency '+p);
for(const id of ['record','reset','export','import','clear','newGame','nextGame','choices','trialRows'])test(html.includes('id="'+id+'"'),'interactive control '+id+' '+p);
test(html.includes('role="status"'),'announces feedback '+p);
const m=s[1].match(/cases=(\[[\s\S]*?\]);\s*const ids=/);test(!!m,'scenario bank parses '+p);
const cases=JSON.parse(m[1]);test(cases.length===11,'eleven challenge cases '+p);
}
const cv=read(wk+'resources/circle-data.csv').split(/\r?\n/).filter(x=>/^[A-Za-z0-9_]+,/.test(x)&&!x.startsWith('Case,'));
test(cv.length===8,'eight circular-motion theoretical data rows');
for(const row of cv){const cols=row.split(',');const [id,m,v,r,mu,a,f,cap,yes]=cols;const nums=[m,v,r,mu,a,f,cap].map(Number);test(cols.length===9&&nums.every(Number.isFinite),'circular dataset complete '+id);test(Math.abs(Number(a)-Number(v)**2/Number(r))<2e-5,'circular acceleration '+id);test(Math.abs(Number(f)-Number(m)*Number(v)**2/Number(r))<2e-5,'radial net force '+id);test(Math.abs(Number(cap)-Number(mu)*Number(m)*9.8)<2e-5,'capacity formula '+id);test(yes===(Number(f)<=Number(cap)+2e-5?'yes':'no'),'ideal boundary status '+id)}
const fv=read(wk+'resources/friction-data.csv').split(/\r?\n/).filter(x=>/^[A-Za-z0-9_]+,/.test(x)&&!x.startsWith('Case,'));
test(fv.length===8,'eight friction data rows');
for(const row of fv){const [id,m,push,muS,muK,N,max,fr,net,a,mode]=row.split(',');const p=[m,push,muS,muK,N,max,fr,net,a].map(Number);test(p.length===9&&p.every(Number.isFinite),'friction dataset numeric '+id);test(Math.abs(Number(N)-Number(m)*9.8)<2e-5,'normal force '+id);test(Math.abs(Number(max)-Number(muS)*Number(N))<2e-5,'static friction maximum '+id);const slip=Math.abs(Number(push))>Number(max)+1e-8,expected=slip?-Math.sign(Number(push))*Number(muK)*Number(N):-Number(push);test(mode===(slip?'kinetic':'static'),'correct static/kinetic regime '+id);test(Math.abs(expected-Number(fr))<2e-5&&Math.abs(Number(net)-(Number(push)+Number(fr)))<2e-5,'actual friction and net force '+id);test(Math.abs(Number(a)-Number(net)/Number(m))<2e-5,'initial horizontal acceleration '+id)}
const guide=read(wk+'teacher/guide.html');test(guide.includes('20-point')&&guide.includes('Friday')&&guide.includes('Friction'),'teacher guide, rubric and answer material present');
const pages=[wk+'index.html',wk+'teacher/guide.html',wk+'labs/circular-motion-studio.html',wk+'labs/friction-contact-lab.html',...Array.from({length:5},(_,i)=>wk+'lessons/day-0'+(i+1)+'.html')];
for(const p of pages){const s=read(p);for(const match of s.matchAll(/(?:href|src)="([^"]+)"/g)){const url=match[1];if(url.startsWith('#')||/^(https?:|mailto:|data:)/.test(url))continue;
const target=path.resolve(path.dirname(path.join(root,p)),url.split('?')[0].split('#')[0]);test(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),'valid local link '+p+' → '+url)}}
console.log('PHYSICS12_WEEK08_VALIDATION=PASS checks='+checks);