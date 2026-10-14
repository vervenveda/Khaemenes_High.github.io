import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const course=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(course,p),'utf8');let total=0;
function check(expr,message){assert.ok(expr,message);console.log('PASS',message);total++}
const css=read('shared-motion/lesson.css'),js=read('shared-motion/lesson.js'),studio=read('shared-motion/motion-graph-studio.html');
check(!/@import|https?:\/\/|url\(/i.test(css),'Shared style uses no external imports/assets');
check(!/\bfetch\(|XMLHttpRequest|WebSocket|sendBeacon\(/.test(js+studio),'No external runtime or telemetry calls');
check(css.includes('border-radius:7px'),'Seven-pixel lesson controls');
new vm.Script(js,{filename:'lesson.js'});
const marker='const Q=',start=js.indexOf(marker)+marker.length,end=js.indexOf(';let current=',start);
check(start>marker.length&&end>start,'Formative bank parsed');
const questions=JSON.parse(js.slice(start,end));
check(questions.length===40,'Forty practice questions');
for(const w of [2,3]){const list=questions.filter(q=>q[0]===w);
check(list.length===20,'Week '+w+' has 20 questions');check(new Set(list.map(q=>q[1])).size===20,'Week '+w+' has no repeated question text');
for(const q of list)check(q.length===5&&q[2].length===4&&new Set(q[2]).size===4&&Number.isInteger(q[3])&&q[3]>=0&&q[3]<4,'Well-formed question: '+q[1].slice(0,28));
const weekDir='weeks/week-0'+w,hub=read(weekDir+'/index.html');
check(hub.includes('sci-physics-&-engineering-12-w0'+w+'-monday'),'Week '+w+' original student evidence key intact');
check(hub.includes('physics-motion-studio-week'+w),'Week '+w+' hub has new studio section');
check(hub.includes('shared-motion/motion-graph-studio.html'),'Week '+w+' links one canonical shared studio');
check(read(weekDir+'/teacher/guide.html').includes('20-point'),'Week '+w+' includes teacher rubric');
const csv=read(weekDir+'/resources/motion-data.csv').split(/\r?\n/).filter(s=>/^\d+,/.test(s));
check(csv.length===5,'Week '+w+' has five time data rows');
for(const row of csv){const [t,x,frameX,v,frameV]=row.split(',').map(Number);if(w===2){check(Math.abs(x-(2+3*t))<1e-9&&Math.abs(frameX-(2+2*t))<1e-9&&v===3&&frameV===2,'Week 02 dataset t='+t)}else{check(Math.abs(x-(4*t-t*t))<1e-9&&x===frameX&&v===4-2*t&&frameV===v,'Week 03 dataset t='+t)}}
for(let d=1;d<=5;d++){const file=weekDir+'/lessons/day-0'+d+'.html',html=read(file);
check(html.includes('data-week="'+w+'" data-day="'+d+'"'),'Lesson identity '+w+'/'+d);
check(html.includes('id="quiz"')&&html.includes('id="mainNote"')&&html.includes('id="thoughtNote"'),'Lesson checks and journal '+w+'/'+d);
check((html.match(/<dt>/g)||[]).length===5&&!(html.includes('Define in your own words, give the correct SI units')),'Explained vocabulary '+w+'/'+d);
check(!/https?:\/\//.test(html),'Lesson contains no offsite dependency '+w+'/'+d);
check(hub.includes('lessons/day-0'+d+'.html'),'Week '+w+' hub links Day '+d);}
}
const script=studio.match(/<script>([\s\S]*?)<\/script>/);
check(!!script,'Standalone studio has a single embedded engine');new vm.Script(script[1],{filename:'motion-graph-studio.js'});
check(studio.includes('id="positionGraph"')&&studio.includes('id="velocityGraph"'),'Position and velocity charts exist');
check(studio.includes('createElementNS')&&studio.includes('id="samples"'),'Native SVG and data-table alternatives');
check(studio.includes('id="import"')&&studio.includes('id="export"')&&studio.includes('id="record"'),'Local studio record/export/import controls');
const pages=['shared-motion/motion-graph-studio.html'];
for(const w of [2,3])pages.push('weeks/week-0'+w+'/index.html','weeks/week-0'+w+'/teacher/guide.html',...Array.from({length:5},(_,i)=>'weeks/week-0'+w+'/lessons/day-0'+(i+1)+'.html'));
for(const p of pages){const html=read(p);for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const href=m[1];if(href.startsWith('#')||/^(https?:|mailto:|data:)/.test(href))continue;const resolved=path.resolve(path.dirname(path.join(course,p)),href.split('#')[0].split('?')[0]);check(fs.existsSync(resolved)||fs.existsSync(path.join(resolved,'index.html')),'Relative link '+p+' → '+href)}}
console.log('PHYSICS12_MOTION_VALIDATION=PASS checks='+total);
