import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(base,'weeks/week-06/labs/force-builder.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'laboratory inline script is present');
new vm.Script(script);
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.style={};this.attrs={};this.value='';this.textContent='';this.disabled=false;this.parent=null}
 appendChild(e){e.parent=this;this.children.push(e);return e}
 replaceChildren(...items){this.children=[];items.forEach(x=>this.appendChild(x))}
 addEventListener(k,fn){this.events[k]=fn}
 setAttribute(k,v){this.attrs[k]=String(v)}
 click(){this.events.click?.({target:this})}
 change(k){this.events[k]?.({target:this})}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}
}
const elements=new Map(),memory=new Map();
const document={body:new Element('body'),createElement:t=>new Element(t),createElementNS:(_ns,t)=>new Element(t),getElementById(k){if(!elements.has(k))elements.set(k,new Element());return elements.get(k)}};
for(const [k,v] of Object.entries({mass:4,right:6,left:6,up:0,down:0,velocity:3}))document.getElementById(k).value=String(v);
document.getElementById('preset').value='custom';
const localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
const env={document,localStorage,Math,Number,String,Date,JSON,Blob,console,confirm:()=>true,setTimeout:f=>f(),URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}}};
vm.runInNewContext(script,env,{timeout:5000});
const $=id=>document.getElementById(id);
const nearly=(value,expected,label)=>assert.ok(Math.abs(value-expected)<1e-6,label+' got '+value+' expected '+expected);
assert.equal($('forceRows').children.length,7,'all external forces in numeric ledger');
assert.ok($('forceSvg').children.length>=6,'free-body SVG is drawn');
assert.match($('equations').textContent,/ax = ΣFx\/m = 0 m\/s²/,'balanced block has zero acceleration');
assert.match($('equations').textContent,/v after 2 s = 3 m\/s/,'moving block keeps constant velocity');
$('right').value='14';$('right').change('input');
assert.match($('equations').textContent,/ΣFx = \+14 − 6 = 8 N/,'opposing forces produce 8 N');
assert.match($('equations').textContent,/ax = ΣFx\/m = 2 m\/s²/,'4 kg under 8 N accelerates at 2');
$('record').click();assert.equal($('trialRows').children.length,1,'trial recorded');
$('mass').value='2';$('mass').change('input');
assert.match($('equations').textContent,/ax = ΣFx\/m = 4 m\/s²/,'halving mass doubles acceleration');
$('record').click();assert.equal($('trialRows').children.length,2,'second trial recorded');
assert.ok(localStorage.getItem('khae:phys12:week06:forces:v1'),'records persisted');
$('preset').value='up';$('loadPreset').click();
assert.equal($('up').value,'5','upward-force preset loads');
assert.match($('equations').textContent,/normal = 34.2 N up/,'extra upward force lowers normal force');
$('start').click();assert.equal($('challengeAnswers').children.length,4,'four selectable game answers');
$('challengeAnswers').children[0].click();
const score=$('gameScore').textContent;
$('challengeAnswers').children[0].click();
assert.equal($('gameScore').textContent,score,'double-click cannot score twice');
$('next').click();assert.equal($('challengeAnswers').children.length,4,'next game round works');
$('export').click();$('clear').click();
assert.equal($('trialRows').children.length,0,'saved trials can be cleared');
console.log('PHYSICS12_WEEK06_INTERACTION_SMOKE=PASS');
