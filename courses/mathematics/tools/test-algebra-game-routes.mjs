// Exercise shipped inline game scripts with a minimal DOM/storage stand-in.
// This checks game logic; it does not certify browser layout.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
const base=process.cwd()+'/courses/mathematics/assets/learning-games';const output=[];
const placements=[];
const units='courses/mathematics/algebra-1/units';
for(const unit of fs.readdirSync(units)){
 const dir=path.join(units,unit,'lessons');if(!fs.existsSync(dir))continue;
 for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.html'))){
  const lesson=path.join(dir,file),html=fs.readFileSync(lesson,'utf8');
  for(const tag of html.matchAll(/<script[^>]*shared-game-launcher[^>]*>/g)){
   const attrs=Object.fromEntries([...tag[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],x[2]]));
   assert.equal(attrs['data-course'],'algebra1');
   const launcher=path.resolve(path.dirname(lesson),attrs.src);assert.ok(fs.existsSync(launcher));
   const url=new URL(`learning-games/${attrs['data-game']}/index.html`,'https://audit.test/'+path.relative(process.cwd(),launcher));
   for(const k of ['course','unit','lesson','mode'])if(attrs['data-'+k])url.searchParams.set(k,attrs['data-'+k]);
   assert.ok(fs.existsSync(path.join(process.cwd(),url.pathname)),lesson+': missing game');
   placements.push({lesson,game:attrs['data-game'],unit:attrs['data-unit'],number:attrs['data-lesson'],mode:attrs['data-mode'],query:url.search});
  }
 }
}
assert.equal(placements.length,17,'Update the reviewed Algebra I coverage count when adding placements.');
const results=[];for(const placement of placements){
const slug=placement.game;
const html=fs.readFileSync(path.join(base,slug,'index.html'),'utf8');const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
const nodes=new Map();const node=id=>{if(nodes.has(id))return nodes.get(id);const n={id,value:(()=>{const m=html.match(new RegExp('<select[^>]*id=[\"\']'+id+'[\"\'][^>]*>([\\s\\S]*?)</select>','i'));if(!m)return '';const opts=[...m[1].matchAll(/<option([^>]*)>([^<]*)<\/option>/gi)];const o=opts.find(x=>/selected/.test(x[1]))||opts[0];return o?(o[1].match(/value=[\"\']([^\"\']*)/)?.[1]??o[2]):''})(),textContent:'',innerHTML:'',hidden:false,disabled:false,checked:false,dataset:{},style:{},children:[],options:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},setAttribute(){},getAttribute(){return null},appendChild(c){this.children.push(c);return c},append(...cs){this.children.push(...cs)},replaceChildren(...cs){this.children=cs},querySelectorAll(){return []},querySelector(s){return node(s)},before(){},focus(){},remove(){},getContext(){return {}},getBoundingClientRect(){return {width:500,height:400}},scrollIntoView(){}};nodes.set(id,n);return n};
const documentEvents=new Map();
const document={getElementById:node,querySelector:node,querySelectorAll:s=>s==='[data-return-lesson]'?[node('return-anchor-1'),node('return-anchor-2'),node('return-anchor-3')]:[],createElement:()=>node('new'+Math.random()),documentElement:node('html'),body:node('body'),addEventListener(name,fn){documentEvents.set(name,fn)}};
const store=new Map();const context={document,window:{location:{search:'',href:'https://example.test/'+slug+'/',pathname:'/'+slug+'/'},matchMedia:()=>({matches:true,addEventListener(){}}),addEventListener(){},innerWidth:1000},location:{search:placement.query,href:'https://example.test/'+slug+'/index.html'+placement.query},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},URLSearchParams,URL,console,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},performance:{now:()=>0},navigator:{},Blob,Math,confirm:()=>false};context.window.document=document;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(base,"round-policy.js"),"utf8"),context);
const extra=[...new Set([...scripts.join('\n').matchAll(/const\s+([A-Z_][A-Z_0-9]*)\s*=/g)].map(x=>x[1]))];const names=[...new Set([...extra,'BANK','COURSE_BANKS','BANKS','COURSE_CONFIG','SINGLE_LEVEL','BEST','best','bestValue','bestKey','makeDeck','buildDeck','levels','activeBank','isPrime','primeFactors','kind','gcd','lcm','factors','expected','buildRound','start','startRound','render','submit','next','finish','finishRound','intValue','el','hint','reveal','saveBest','stats','updateStats'])];
let error=null;try{for(let script of scripts){const exports='globalThis.auditExports={'+names.map(n=>n+':typeof '+n+'==="undefined"?null:'+n).join(',')+',state:()=>({deck:typeof deck==="undefined"?null:deck,index:typeof index==="undefined"?null:index,attempts:typeof attempts==="undefined"?null:attempts,correct:typeof correct==="undefined"?null:correct}),setProgress:()=>{if(typeof attempts!=="undefined")attempts=1;if(typeof attemptedExpr!=="undefined")attemptedExpr=1;index=1;if(typeof checked!=="undefined")checked=true},choose:i=>{selected=i}};';script=script.replace(/\}\)\(\);?\s*$/,exports+'})();');vm.runInContext(script,context,{timeout:500})}}catch(e){error=e.message}
assert.equal(error,null,slug);
const e=context.auditExports;
const target=path.resolve(placement.lesson);
const returns=[...nodes.values()].filter(n=>typeof n.href==='string'&&n.href.includes('/algebra-1/units/')).map(n=>({id:n.id,href:n.href,path:path.resolve(base,slug,n.href)}));
const wrong=returns.filter(n=>n.path!==target);
const requested=e.el.course?.value;
const item={...placement,course:requested,focus:e.el.focus?.value,returns:returns.map(n=>({id:n.id,href:n.href})),wrong:wrong.map(n=>n.href),status:returns.length&&!wrong.length&&requested==='algebra1'?'PASS':'CHECK'};
results.push(item);
assert.equal(item.status,'PASS',placement.lesson+': wrong return route or course');
if(slug==='prime-spy-composite')assert.equal(item.focus,placement.mode,'Incorrect mission focus');
console.log('PASS: Algebra I U'+placement.unit+' L'+placement.number+' '+slug+' launch, course and return routes');
}

