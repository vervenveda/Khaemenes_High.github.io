// Exercise shipped inline game scripts with a minimal DOM/storage stand-in.
// This checks game logic; it does not certify browser layout.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
const base=process.cwd()+'/courses/mathematics/assets/learning-games';const output=[];
for(const slug of ['gcf-lcm-challenge','reciprocal-relay','scale-forge']){
const html=fs.readFileSync(path.join(base,slug,'index.html'),'utf8');const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
const nodes=new Map();const node=id=>{if(nodes.has(id))return nodes.get(id);const n={id,value:(()=>{const m=html.match(new RegExp('<select[^>]*id=[\"\']'+id+'[\"\'][^>]*>([\\s\\S]*?)</select>','i'));if(!m)return '';const opts=[...m[1].matchAll(/<option([^>]*)>([^<]*)<\/option>/gi)];const o=opts.find(x=>/selected/.test(x[1]))||opts[0];return o?(o[1].match(/value=[\"\']([^\"\']*)/)?.[1]??o[2]):''})(),textContent:'',innerHTML:'',hidden:false,disabled:false,checked:false,dataset:{},style:{},children:[],options:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},setAttribute(){},getAttribute(){return null},appendChild(c){this.children.push(c);return c},append(...cs){this.children.push(...cs)},replaceChildren(...cs){this.children=cs},querySelectorAll(){return []},querySelector(s){return node(s)},focus(){},remove(){},getContext(){return {}},getBoundingClientRect(){return {width:500,height:400}},scrollIntoView(){}};nodes.set(id,n);return n};
const document={getElementById:node,querySelector:node,querySelectorAll:()=>[],createElement:()=>node('new'+Math.random()),documentElement:node('html'),body:node('body'),addEventListener(){}};
const store=new Map();const context={document,window:{location:{search:'',href:'https://example.test/'+slug+'/',pathname:'/'+slug+'/'},matchMedia:()=>({matches:true,addEventListener(){}}),addEventListener(){},innerWidth:1000},location:{search:''},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},URLSearchParams,URL,console,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},performance:{now:()=>0},navigator:{},Blob,Math,confirm:()=>false};context.window.document=document;vm.createContext(context);
const extra=[...new Set([...scripts.join('\n').matchAll(/const\s+([A-Z_][A-Z_0-9]*)\s*=/g)].map(x=>x[1]))];const names=[...new Set([...extra,'BANK','COURSE_BANKS','BANKS','COURSE_CONFIG','SINGLE_LEVEL','BEST','best','bestValue','bestKey','makeDeck','buildDeck','levels','activeBank','isPrime','primeFactors','kind','gcd','lcm','factors','expected','buildRound','start','startRound','render','submit','next','finish','finishRound','intValue','el','hint','reveal','saveBest'])];
let error=null;try{for(let script of scripts){const exports='globalThis.auditExports={'+names.map(n=>n+':typeof '+n+'==="undefined"?null:'+n).join(',')+',state:()=>({deck:typeof deck==="undefined"?null:deck,index:typeof index==="undefined"?null:index,attempts:typeof attempts==="undefined"?null:attempts,correct:typeof correct==="undefined"?null:correct}),choose:i=>{selected=i}};';script=script.replace(/\}\)\(\);?\s*$/,exports+'})();');vm.runInContext(script,context,{timeout:500})}}catch(e){error=e.message}
assert.equal(error,null,slug);
const e=context.auditExports;
if(slug==='gcf-lcm-challenge'){
 assert.equal(e.best(),null);
 e.saveBest(0);assert.equal(e.best(),0);
 store.clear();
 for(const course of ['prealgebra','algebra1','geometry','algebra2']){
  e.el.course.value=course;e.start();
  assert.equal(e.best(),null);
  assert.ok(!e.el.feedback.innerHTML.includes('${'));
  e.hint();e.reveal();
  assert.ok(!e.el.feedback.innerHTML.includes('${'));
  if(course==='prealgebra'||course==='geometry'){
   const answer=Number(e.expected(e.state().deck[0]));
   for(const raw of ['',String(answer+0.4),'0','-1','Infinity','abc']){
    e.el.input.value=raw;e.submit();assert.equal(e.state().attempts,0,raw);
   }
  }
  const count=e.state().deck.length;
  for(let i=0;i<count;i++){
   const c=e.state().deck[i];e.el.input.value=e.expected(c)+(course==='geometry'?'°':'');
   e.submit();assert.equal(e.state().correct,i+1,course);
   e.submit();assert.equal(e.state().attempts,i+1);
   e.next();
  }
  assert.equal(e.el.mark.textContent,'100%');assert.equal(e.best(),100);
  assert.ok(!e.el.mText.textContent.includes('${'));
  assert.equal(e.el.fill.style.width,'100%');
  e.start();assert.equal(e.state().attempts,0);assert.equal(e.el.input.disabled,false);
  e.el.input.value='999999';e.submit();assert.equal(e.state().correct,0);
  const missed=e.state().deck[0];e.start([missed]);
  assert.equal(e.state().attempts,0);assert.equal(e.expected(e.state().deck[0]),e.expected(missed));
 }
}else{
 const expression=slug==='reciprocal-relay'?'2 1/4 ÷ 1 1/2':'2 3/5 × 1 1/4';
 const c=e.BANK.find(c=>c.v===expression);assert.ok(c);
 const value=s=>{const m=s.match(/^(?:(\d+) )?(\d+)\/(\d+)$/);return m?Number(m[1]||0)+Number(m[2])/Number(m[3]):Number(s)};
 const expected=slug==='reciprocal-relay'?1.5:3.25;
 assert.equal(value(c.o[c.a]),expected);
 assert.equal(c.o.filter(x=>value(x)===expected).length,1);
 for(let choice=0;choice<c.o.length;choice++){
  e.start([c]);e.choose(choice);e.submit();assert.equal(e.state().correct,choice===c.a?1:0);
  e.submit();assert.equal(e.state().attempts,1);
 }
}
console.log('PASS:',slug,'answer accuracy, feedback and scoring regression checks');
}
