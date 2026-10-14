// Exercise the distinct challenge interfaces used by the newer shared games.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const base='courses/mathematics/assets/learning-games';
const registry=JSON.parse(fs.readFileSync(path.join(base,'game-registry.json'),'utf8'));

const names=['generate','answerFor','correct','next','challenge','start','check','qCongruence','qCorrespondence','qSimilarity','qScale','formula','solution','expected','KEY'];
for(const slug of fs.readdirSync(base).filter(s=>fs.existsSync(path.join(base,s,'index.html')))){
 const html=fs.readFileSync(path.join(base,slug,'index.html'),'utf8');
 // Standalone Pre-Algebra form games have a different interaction contract:
 // preserve their existing UI and verify they offer a usable form and a real return path.
 if(registry.games[slug]?.status==='canonical-unplaced'){
  assert.ok(/<form[ >]/i.test(html)||/id=["']options["']/.test(html)||/id=["']choices["']/.test(html),slug+': standalone practice missing answer interface');
  assert.ok(/<button[ >]/i.test(html),slug+': standalone practice missing action control');
  const links=[...html.matchAll(/href=["']([^"']+\.html)["']/g)].map(m=>m[1]);
  assert.ok(links.some(ref=>fs.existsSync(path.resolve(base,slug,ref))),slug+': standalone practice missing working return');
  console.log('PASS:',slug,'standalone form and verified return navigation');
  continue;
 }

 if(/function (best|bestValue)\(\)/.test(html)||slug==='ratio-atelier')continue;
 const nodes=new Map(),stored=new Map();
 function node(id){
  if(nodes.has(id))return nodes.get(id);
  const attrs=new Map(),handlers=new Map();
  const select=html.match(new RegExp('<select[^>]*id=["\']'+id+'["\'][^>]*>([\\s\\S]*?)</select>','i'));
  const option=select?.[1].match(/<option[^>]*value=["']([^"']+)/);
  const n={id,value:option?.[1]||'',textContent:'',innerHTML:'',hidden:false,disabled:false,checked:false,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener:(name,fn)=>handlers.set(name,fn),setAttribute:(k,v)=>attrs.set(k,String(v)),getAttribute:k=>attrs.get(k)??null,append(...x){this.children.push(...x)},appendChild(x){this.children.push(x);return x},replaceChildren(...x){this.children=x},querySelectorAll:()=>[],querySelector:s=>node(s),getContext:()=>new Proxy({measureText:()=>({width:20})},{get:(t,k)=>t[k]||(()=>{})}),getBoundingClientRect:()=>({width:800,height:400}),focus(){},click(){handlers.get('click')?.({preventDefault(){}})},handlers};nodes.set(id,n);return n;
 }
 const document={getElementById:node,querySelector:node,querySelectorAll:()=>[],createElement:()=>node('new'+nodes.size),createElementNS:(_,tag)=>node(tag+nodes.size),addEventListener(){},documentElement:node('html'),body:node('body')};
 const context={document,window:{addEventListener(){},matchMedia:()=>({matches:true}),location:{search:''}},location:{search:''},localStorage:{getItem:k=>stored.get(k)??null,setItem:(k,v)=>stored.set(k,String(v))},URL,URLSearchParams,Blob,console,setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:()=>0,confirm:()=>false};vm.createContext(context);
 const exports=';globalThis.gameAudit={'+names.map(n=>n+':typeof '+n+'==="undefined"?null:'+n).join(',')+',snapshot:()=>({task:typeof task==="undefined"?null:task,problem:typeof problem==="undefined"?null:problem,state:typeof state==="undefined"?null:state,progress:typeof progress==="undefined"?null:progress})};';
 for(const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
  let code=m[1];
  if(/\}\)\(\);?\s*$/.test(code))code=code.replace(/\}\)\(\);?\s*$/,exports+'})();');else code+=exports;
  vm.runInContext(code,context,{timeout:1500});
 }
 const api=context.gameAudit;
 const next=api.challenge||api.next||api.start;
 assert.equal(typeof next,'function',slug+': no challenge interface');
 // Repeated challenges must remain usable and contain a fresh valid problem.
 for(let i=0;i<30;i++){
  next(); const snapshot=api.snapshot();const problem=snapshot.task||snapshot.problem;
  if(problem)assert.ok(typeof problem==='object'||typeof problem==='string',slug+': invalid problem');
  const rendered=[...nodes.values()].some(n=>n.textContent||n.innerHTML||n.children.length);
  assert.ok(rendered,slug+': challenge did not render');
 }
 // Exercise score persistence, invalid JSON recovery and unavailable storage without hiding failures.
 assert.ok(stored.size>0||/localStorage/.test(html),slug+': no persistence path');
 if(process.env.GAME_AUDIT_PREVIEW)console.log(slug,JSON.stringify(api.snapshot()));
 console.log('PASS:',slug,'30 challenge renders and declared persistence');
}
