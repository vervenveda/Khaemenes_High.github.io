// Exercise shipped inline game scripts with a minimal DOM/storage stand-in.
// This checks game logic; it does not certify browser layout.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
const base=process.cwd()+'/courses/mathematics/assets/learning-games';const output=[];
for(const slug of fs.readdirSync(base).filter(x=>fs.existsSync(path.join(base,x,'index.html')))){
const html=fs.readFileSync(path.join(base,slug,'index.html'),'utf8');const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
const nodes=new Map();const node=id=>{if(nodes.has(id))return nodes.get(id);const n={id,value:(()=>{const m=html.match(new RegExp('<select[^>]*id=[\"\']'+id+'[\"\'][^>]*>([\\s\\S]*?)</select>','i'));if(!m)return '';const opts=[...m[1].matchAll(/<option([^>]*)>([^<]*)<\/option>/gi)];const o=opts.find(x=>/selected/.test(x[1]))||opts[0];return o?(o[1].match(/value=[\"\']([^\"\']*)/)?.[1]??o[2]):''})(),textContent:'',innerHTML:'',hidden:false,disabled:false,checked:false,dataset:{},style:{},children:[],options:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},setAttribute(){},getAttribute(){return null},appendChild(c){this.children.push(c);return c},append(...cs){this.children.push(...cs)},replaceChildren(...cs){this.children=cs},querySelectorAll(){return []},querySelector(s){return node(s)},before(){},focus(){},remove(){},getContext(){return {}},getBoundingClientRect(){return {width:500,height:400}},scrollIntoView(){}};nodes.set(id,n);return n};
const documentEvents=new Map();
const document={getElementById:node,querySelector:node,querySelectorAll:()=>[],createElement:()=>node('new'+Math.random()),documentElement:node('html'),body:node('body'),addEventListener(name,fn){documentEvents.set(name,fn)}};
const store=new Map();const context={document,window:{location:{search:'',href:'https://example.test/'+slug+'/',pathname:'/'+slug+'/'},matchMedia:()=>({matches:true,addEventListener(){}}),addEventListener(){},innerWidth:1000},location:{search:''},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},URLSearchParams,URL,console,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},performance:{now:()=>0},navigator:{},Blob,Math,confirm:()=>false};context.window.document=document;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(base,"round-policy.js"),"utf8"),context);
const extra=[...new Set([...scripts.join('\n').matchAll(/const\s+([A-Z_][A-Z_0-9]*)\s*=/g)].map(x=>x[1]))];const names=[...new Set([...extra,'BANK','COURSE_BANKS','BANKS','COURSE_CONFIG','SINGLE_LEVEL','BEST','best','bestValue','bestKey','makeDeck','buildDeck','levels','activeBank','isPrime','primeFactors','kind','gcd','lcm','factors','expected','buildRound','start','startRound','render','submit','next','finish','finishRound','intValue','el','hint','reveal','saveBest','stats','updateStats'])];
let error=null;try{for(let script of scripts){const exports='globalThis.auditExports={'+names.map(n=>n+':typeof '+n+'==="undefined"?null:'+n).join(',')+',state:()=>({deck:typeof deck==="undefined"?null:deck,index:typeof index==="undefined"?null:index,attempts:typeof attempts==="undefined"?null:attempts,correct:typeof correct==="undefined"?null:correct}),setProgress:()=>{if(typeof attempts!=="undefined")attempts=1;if(typeof attemptedExpr!=="undefined")attemptedExpr=1;index=1;if(typeof checked!=="undefined")checked=true},choose:i=>{selected=i}};';script=script.replace(/\}\)\(\);?\s*$/,exports+'})();');vm.runInContext(script,context,{timeout:500})}}catch(e){error=e.message}
assert.equal(error,null,slug);
const e=context.auditExports,start=e.start||e.startRound;
assert.ok(start,slug+': missing round start');
start();const first=e.state().deck;
assert.ok(first.length>0,slug+': empty deck');
assert.equal(new Set(first.map(JSON.stringify)).size,first.length,slug+': repeated question in round');
const source=[first[0],first[0],first[1]];
start(source);const review=e.state().deck;
assert.equal(review.length,new Set(source.map(JSON.stringify)).size,slug+': padded review');
assert.equal(new Set(review.map(JSON.stringify)).size,review.length,slug+': duplicate review');
start();e.setProgress();(e.stats||e.updateStats)();
for(const name of ['course','focus','pathway','size'])if(e.el[name])assert.equal(e.el[name].disabled,true,slug+': unlocked '+name);
start();for(const name of ['course','focus','pathway','size'])if(e.el[name])assert.equal(e.el[name].disabled,false,slug+': settings remain locked');
for(const course of Object.keys(e.COURSE_CONFIG||{})){
 if(!e.el.course)continue;e.el.course.value=course;start();assert.ok(e.state().deck.length,slug+': empty '+course);
 assert.equal(new Set(e.state().deck.map(JSON.stringify)).size,e.state().deck.length,slug+': repeated '+course);
}
if(e.el.pathway){
 const select=html.match(new RegExp('<select[^>]*id=["\']'+e.el.pathway.id+'["\'][^>]*>([\\s\\S]*?)</select>','i'));
 const values=select?[...select[1].matchAll(/<option[^>]*value=["']([^"']+)/g)].map(x=>x[1]):[];
 for(const course of Object.keys(e.COURSE_CONFIG||{default:null}))for(const value of values){
  if(e.el.course&&course!=='default')e.el.course.value=course;e.el.pathway.value=value;start();
  assert.ok(e.state().deck.length,slug+': empty '+course+' '+value);
  assert.equal(new Set(e.state().deck.map(JSON.stringify)).size,e.state().deck.length,slug+': repeats '+course+' '+value);
 }
}
console.log('PASS:',slug,'unique rounds, unpadded review, settings protection, courses and pathways');
}
