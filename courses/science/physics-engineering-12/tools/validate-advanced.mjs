import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let checks=0;
function check(ok,msg){assert.ok(ok,msg);checks++;console.log('PASS '+msg)}
const qScript=read('shared-motion/advanced-lesson.js'),start=qScript.indexOf('const Q=')+8,end=qScript.indexOf(';let picked=',start);
check(start>8&&end>start,'public question bank found');
const questions=JSON.parse(qScript.slice(start,end));
check(questions.length===40,'40 educational questions across Weeks 04 and 05');
check(qScript.includes('if(locked)return'),'one score per quiz attempt');
check(qScript.includes('khae-phys12-advanced-lesson-v1'),'journal identity schema scoped to physics');
new vm.Script(qScript,{filename:'advanced-lesson.js'});
const files=['shared-motion/projectile-explorer.html','shared-motion/model-detective.html'];
for(const name of files){const html=read(name),script=html.match(/<script>([\s\S]*?)<\/script>/);
check(script,'standalone script found: '+name);new vm.Script(script[1],{filename:name});
check(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(html),'no network/telemetry: '+name);
check(html.includes('id="export"')&&html.includes('id="record"')&&html.includes('id="clear"'),'real export/record/reset controls: '+name);
check(html.includes('id="newGame"')||html.includes('id="challengeStart"'),'seven-round game starts: '+name);
}
for(const w of [4,5]){const dir='weeks/week-0'+w,hub=read(dir+'/index.html'),items=questions.filter(q=>q[0]===w);
check(items.length===20,'Week '+w+' 20 questions');check(new Set(items.map(q=>q[1])).size===20,'unique prompts Week '+w);
for(let d=1;d<=5;d++){const text=read(dir+'/lessons/day-0'+d+'.html');
check(text.includes('data-week="'+w+'" data-day="'+d+'"'),'identity Week '+w+' Day '+d);
check(text.includes('id="mainNote"')&&text.includes('id="thoughtNote"'),'evidence journal Week '+w+' Day '+d);
check(text.includes('id="quiz"')&&text.includes('id="newQuiz"')&&text.includes('id="submitQuiz"'),'working quiz hooks Week '+w+' Day '+d);
check((text.match(/<dt>/g)||[]).length===5,'five defined vocabulary terms Week '+w+' Day '+d);
check(hub.includes('lessons/day-0'+d+'.html'),'weekly hub links lesson Week '+w+' Day '+d);
check(!/https?:\/\//.test(text),'standalone offline lesson Week '+w+' Day '+d);
check(items.slice((d-1)*4,d*4).length===4,'daily bank allocation '+w+'/'+d)}
for(const item of items){check(item.length===5&&item[2].length===4&&new Set(item[2]).size===4&&Number.isInteger(item[3])&&item[3]>=0&&item[3]<4,'question correctness '+item[1].slice(0,30))}
check(hub.includes('sci-physics-&-engineering-12-w0'+w+'-monday')&&hub.includes('sci-physics-&-engineering-12-w0'+w+'-friday'),'preserves original weekly evidence keys Week '+w);
check(hub.includes('physics-advanced-week'+w),'new studio link section Week '+w);
check(hub.includes(w===4?'projectile-explorer.html':'model-detective.html'),'canonical tool link Week '+w);
const teach=read(dir+'/teacher/guide.html');check(teach.includes('20-point')&&teach.includes('Teacher / Parent Educator'),'teacher scoring guidance Week '+w);
const lines=read(dir+'/resources/model-data.csv').split(/\r?\n/).filter(x=>/^\d+,/.test(x));check(lines.length===5||lines.length===6,'synthetic dataset count Week '+w);
if(w===4){for(const row of lines){const [t,x,y,vx,vy]=row.split(',').map(Number);const tt=(5+Math.sqrt(25))/9.8;check(Math.abs(x-10*Math.cos(Math.PI/6)*t)<0.001&&Math.abs(y-Math.max(0,5*t-4.9*t*t))<0.0015&&Math.abs(vx-10*Math.cos(Math.PI/6))<0.001&&Math.abs(vy-(5-9.8*t))<0.0015&&t<=tt+0.001,'trajectory CSV math t='+t)}}
else{for(const row of lines){const [t,linear,curve,part]=row.split(',');check(Number.isFinite(Number(t))&&Number.isFinite(Number(linear))&&Number.isFinite(Number(curve))&&['training','holdout'].includes(part),'model data row at t='+t);check(Math.abs(Number(linear)-(1+2*Number(t)))<0.2&&Math.abs(Number(curve)-(1+2*Number(t)+0.5*Number(t)**2))<0.2,'models plausible near generating formula t='+t)}}
}
for(const name of ['shared-motion/projectile-explorer.html','shared-motion/model-detective.html',...([4,5].flatMap(w=>['weeks/week-0'+w+'/index.html','weeks/week-0'+w+'/teacher/guide.html',...Array.from({length:5},(_,i)=>'weeks/week-0'+w+'/lessons/day-0'+(i+1)+'.html')]))]){
const html=read(name);for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(!u||u.startsWith('#')||/^(https?:|mailto:|data:)/.test(u))continue;const target=path.resolve(path.dirname(path.join(root,name)),u.split('#')[0].split('?')[0]);check(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),'local link '+name+' → '+u)}}
console.log('PHYSICS12_ADVANCED_VALIDATION=PASS checks='+checks);