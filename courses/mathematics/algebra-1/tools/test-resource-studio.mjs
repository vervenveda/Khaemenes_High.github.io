/* Read-only static QA for independently staged Algebra I resources.
 * Run: node courses/mathematics/algebra-1/tools/test-resource-studio.mjs
 * No grades, browsers, private STOS files or networking are accessed.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../instructional-repair-pack/resource-studio');
const pages=['index.html','units-02-04.html','units-02-04-challenge.html','units-05-07.html','units-05-07-challenge.html','units-08-11.html','units-08-11-challenge.html','units-12-13.html','units-12-13-challenge.html'];
let checks=0;
function ok(value,label){checks++;if(!value)throw new Error('FAIL '+label);}
for(const file of pages){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 ok(/<!doctype html>/i.test(html),file+' doctype');
 ok(/<html lang="en"/i.test(html),file+' language');
 ok(/<meta name="viewport"/i.test(html),file+' responsive viewport');
 ok(!/<script\b[^>]*\bsrc\s*=/.test(html),file+' no external scripts');
 ok(!/\b(?:localStorage|sessionStorage|indexedDB)\s*[.(]/.test(html),file+' no learner storage');
 ok(!/\b(?:fetch|XMLHttpRequest)\s*\(/.test(html),file+' no network calls');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
 ok(scripts.length===1,file+' one self-contained script');
 for(const m of scripts)new vm.Script(m[1],{filename:file});
 for(const match of html.matchAll(/\bhref\s*=\s*"([^"]+)"/g)){
  const href=match[1];
  if(!href||href.startsWith('#')||/^[a-z]+:/i.test(href))continue;
  const target=href.split(/[?#]/)[0];
  ok(fs.existsSync(path.resolve(root,target)),file+' link '+target);
 }
 const challenge=file.includes('challenge');
 if(challenge){
  ok(/id="restart"/.test(html),file+' reset button');
  ok(/id="(?:feedback|status)"[^>]*aria-live="polite"/.test(html),file+' announced feedback');
  ok(/disabled>Next|id="next" disabled/.test(html),file+' next starts disabled');
  ok(/practice|formative/i.test(html),file+' clearly ungraded');
 }else{
  ok(/@media print/.test(html),file+' printable worksheet');
  ok(/id="printedTopic"/.test(html),file+' printed topic heading');
  ok(/"printedTopic"\)\.textContent/.test(html),file+' selected topic displayed');
  ok(/id="questions"|id="sheetQuestions"/.test(html),file+' worksheet questions');
  ok(/#(?:answerKey|teachers|key|answers)[^\n]*display\s*:\s*none/i.test(html),file+' print key hidden');
 }
}
console.log('PASS Algebra I Resource Studio static QA: '+checks+' checks across '+pages.length+' pages. Browser and print-render testing still required.');
