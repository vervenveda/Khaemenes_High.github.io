import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),week='weeks/week-13/';
const read=p=>fs.readFileSync(path.join(base,p),'utf8');let checked=0;
function test(condition,label){assert.ok(condition,label);checked++;console.log('PASS '+label)}
const index=read(week+'index.html'),lesson=read(week+'assets/week13-lesson.js'),engine=read(week+'labs/systems-engine.js');
test(index.includes('physics-week13-studio'),'Week 13 studio linked from original landing page');
for(const day of ['monday','tuesday','wednesday','thursday','friday'])test(index.includes('sci-physics-&-engineering-12-w13-'+day),'original '+day+' journal key preserved');
test(index.includes('khae_high_science_evidence_v1:'),'original local progress prefix remains');
new vm.Script(lesson,{filename:'week13-lesson.js'});new vm.Script(engine,{filename:'systems-engine.js'});
test(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\(/.test(engine+lesson),'no network calls or telemetry');
const a=lesson.indexOf('const Q=')+8,b=lesson.indexOf(';let picked=',a);test(a>=8&&b>a,'quiz bank parses');
const questions=JSON.parse(lesson.slice(a,b));test(questions.length===20,'20 practice questions');test(new Set(questions.map(q=>q[1])).size===20,'no duplicate prompts');
for(const q of questions)test(q.length===5&&q[0]===13&&q[2].length===4&&new Set(q[2]).size===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4,'valid answer choices '+q[1].slice(0,25));
test(lesson.includes('day===5?10:4')&&lesson.includes('day===5?pool:pool.slice((day-1)*4,day*4)'),'random ten-question Friday and day-aligned practice');
test(lesson.includes('if(locked)return'),'practice score guarded');
test(lesson.includes('khae:phys12:w13:systems:day:')&&lesson.includes('khae-phys12-w13-lesson-v1'),'week-scoped student journal and import');
for(let i=1;i<=5;i++){const h=read(week+'lessons/day-0'+i+'.html');test(h.includes('data-week="13" data-day="'+i+'"'),'day '+i+' metadata');test((h.match(/<h3>/g)||[]).length===4,'day '+i+' has 4 deep reading sections');test((h.match(/<dt>/g)||[]).length===5,'day '+i+' has 5 vocabulary definitions');test(h.includes('id="quiz"')&&h.includes('id="submitQuiz"')&&h.includes('id="newQuiz"'),'day '+i+' practice controls');test(h.includes('id="mainNote"')&&h.includes('id="thoughtNote"')&&h.includes('id="exportNotes"'),'day '+i+' notes and export');test(index.includes('lessons/day-0'+i+'.html'),'hub links day '+i)}
for(const [file,mode]of [['energy-flow-mapper.html','flow'],['design-tradeoff-studio.html','design']]){const h=read(week+'labs/'+file);test(h.includes('data-lab="'+mode+'"'),'proper lab identity '+mode);test(h.includes('src="systems-engine.js"'),'shared offline JS linked '+mode);for(const id of ['inputEnergy','useful','thermal','duration','sankey','graph','comparisonRows','trialRows','readout','record','reset','export','import','clear','print','newGame','next','choices'])test(h.includes('id="'+id+'"'),'lab control '+mode+':'+id)}
test(engine.includes('slice(0,7)')&&engine.includes('if(answered)return'),'seven nonrepeating game cases and score lock');
test(engine.includes('u+p.h<=100+1e-8')||engine.includes('p.u+p.h<=100+1e-8'),'percentage bound maintained');
const near=(a,b)=>Math.abs(a-b)<2e-5;
for(const [filename,n]of [['flows.csv',10],['designs.csv',11]]){const data=read(week+'resources/'+filename).split(/\r?\n/).filter(x=>/^[a-z][a-z0-9_]*,/.test(x));test(data.length===n,filename+' has '+n+' cases');
for(const line of data){const [name,En,Un,Hn,tn,U,H,O,total,P,Pu,flag]=line.split(',');const nums=[En,Un,Hn,tn,U,H,O,total,P,Pu].map(Number);test(nums.every(Number.isFinite),'all numeric fields in '+name);const [E,u,h,t,useful,heat,other,all,inputPower,outputPower]=nums;
test(u+h<=100&&u>=0&&h>=0&&E>=100&&t>=1,'valid fractions and input '+name);
test(near(useful,E*u/100)&&near(heat,E*h/100)&&near(other,E-useful-heat),'correct output ledger '+name);
test(near(all,E)&&near(all,useful+heat+other),'conservation '+name);
test(near(inputPower,E/t)&&near(outputPower,useful/t),'watt calculations '+name);
test(flag===(E<=600&&useful>=300-1e-8&&heat<=140&&t<=8?'yes':'no'),'four constraint result '+name)}}
const guide=read(week+'teacher/guide.html');test(guide.includes('20-point')&&guide.includes('HS-PS3-3')&&guide.includes('HS-ETS1-2'),'teacher guide and rubric');
const pages=[week+'index.html',week+'teacher/guide.html',week+'labs/energy-flow-mapper.html',week+'labs/design-tradeoff-studio.html',...Array.from({length:5},(_,i)=>week+'lessons/day-0'+(i+1)+'.html')];
for(const file of pages){const h=read(file);for(const match of h.matchAll(/(?:href|src)="([^"]+)"/g)){const href=match[1];if(!href||href.startsWith('#')||/^(https?:|mailto:|data:)/.test(href))continue;const target=path.resolve(path.dirname(path.join(base,file)),href.split('?')[0].split('#')[0]);test(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),'local route '+file+' → '+href)}}
console.log('PHYSICS12_WEEK13_VALIDATION=PASS checks='+checked);
