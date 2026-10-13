import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const base='courses/mathematics/assets/learning-games/';
const policy=fs.readFileSync(base+'round-policy.js','utf8');
function storage() {
 const values=new Map();
 return {values,getItem:k=>values.has(k)?values.get(k):null,
  setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
}
function open(slug,store,query) {
 const html=fs.readFileSync(base+slug+'/index.html','utf8'),nodes=new Map();let created=0;
 function initial(id){
  const tag=html.match(new RegExp('<select[^>]*id=["\\x27]'+id+'["\\x27][^>]*>([\\s\\S]*?)<\\/select>','i'));
  if(!tag)return '';
  const options=[...tag[1].matchAll(/<option([^>]*)>([^<]*)<\/option>/gi)];
  const chosen=options.find(x=>/\bselected\b/.test(x[1]))||options[0];
  return chosen?.[1].match(/value=["']([^"']*)/)?.[1]||chosen?.[2].trim()||'';
 }
 function node(id){
  if(nodes.has(id))return nodes.get(id);
  let value=initial(id),htmlText='';
  const n={id,tagName:'DIV',textContent:'',hidden:false,disabled:false,checked:false,
   style:{width:'',left:'',top:'',transform:'',borderColor:''},className:'',children:[],
   dataset:{},onclick:null,onchange:null,events:new Map(),
   classList:{add(){},remove(){},toggle(){},contains(){return false}},
   get value(){return value},set value(v){value=String(v)},
   get innerHTML(){return htmlText},set innerHTML(v){htmlText=v;this.children=[]},
   setAttribute(name,v){this[name]=v},getAttribute(){return null},
   appendChild(c){this.children.push(c);return c},append(...cs){this.children.push(...cs)},
   addEventListener(name,fn){this.events.set(name,fn)},
   scrollIntoView(){},querySelectorAll(){return []},querySelector(){return null}};
  nodes.set(id,n);return n;
 }
 const document={getElementById:node,querySelector:node,querySelectorAll:()=>[],
  createElement:tag=>{const n=node('generated-'+(created++));n.tagName=tag.toUpperCase();return n},
  documentElement:node('html'),body:node('body'),activeElement:null,addEventListener(){}};
 const location={search:query,href:'https://academy.example/'+base+slug+'/index.html'+query};
 const ctx={document,location,localStorage:store,sessionStorage:storage(),Math,console,URL,URLSearchParams,
  window:{location,document,matchMedia:()=>({matches:true})},
  setTimeout:()=>0,clearTimeout(){},addEventListener(){},confirm:()=>true,print(){},
  history:{replaceState(){}}};
 vm.createContext(ctx);vm.runInContext(policy,ctx);
 const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
 for(let source of scripts){
  const hook=';globalThis.beta={'+
   'state:()=>({deck,index,selected,checked,score,correct,attempts,streak,missed}),'+
   'start,submit,next,finish,resumeRound,resumeKey,select:i=>el.grid.children[i].onclick(),'+
   'best:()=>best(),setting:()=>({course:el.course.value,pathway:el.pathway.value,size:el.size.value})'+
   '};})();';
  source=source.replace(/\}\)\(\);?\s*$/,hook);
  vm.runInContext(source,ctx,{timeout:3500});
 }
 assert.ok(ctx.beta,slug+' hook not installed');
 return {...ctx.beta,nodes,store};
}
const records={
 'khaemenes-algebra2-lesson-progress-v1':JSON.stringify({'u11-l08':{note:'Keep this student note',complete:false}}),
 'khaemenes-algebra2-assessment-records-v1':JSON.stringify({'u11-mastery':{bestScore:84}})
};
const modes=[
 ['coordinated-mission-control','?course=algebra2&unit=11&lesson=u11-l08&mode=advanced-vector-navigation'],
 ['integer-compass','?course=algebra2&unit=10&lesson=u10-l10&mode=vector-components']
];
for(const [slug,query] of modes){
 const store=storage();for(const [k,v] of Object.entries(records))store.setItem(k,v);
 let a=open(slug,store,query),s=a.state();
 assert.equal(a.setting().course,'algebra2');
 assert.ok(s.deck.length>2,'game has a full round');
 const first=JSON.stringify(s.deck[0]);
 a.select(0);
 assert.equal(a.state().selected,0);
 a=open(slug,store,query);s=a.state();
 assert.equal(JSON.stringify(s.deck[0]),first,'question restored after reopening');
 assert.equal(s.selected,0,'pre-submission choice restored');
 assert.equal(a.nodes.get('choiceGrid').children[0]['aria-pressed'],'true');
 a.select(s.deck[0].a);a.submit();s=a.state();
 assert.equal(s.attempts,1);assert.equal(s.correct,1);
 const points=s.score;
 a=open(slug,store,query);s=a.state();
 assert.equal(s.attempts,1,'checked mission counted once');
 assert.equal(s.score,points,'score preserved after reopening');
 assert.equal(s.checked,true,'submitted state preserved');
 assert.equal(a.nodes.get('checkBtn').hidden,true,'cannot submit twice');
 assert.equal(a.nodes.get('nextBtn').hidden,false,'next action available');
 assert.ok(a.nodes.get('choiceGrid').children.every(b=>b.disabled));
 a.next();s=a.state();assert.equal(s.index,1);assert.equal(s.checked,false);
 const second=JSON.stringify(s.deck[1]);
 a=open(slug,store,query);s=a.state();
 assert.equal(s.index,1);assert.equal(JSON.stringify(s.deck[1]),second);
 a.select((s.deck[1].a+1)%s.deck[1].o.length);a.submit();
 a=open(slug,store,query);s=a.state();
 assert.equal(s.missed.length,1,'missed question preserved');
 assert.equal(s.attempts,2,'no duplicate scoring for reviewed round');
 while(a.state().index<a.state().deck.length){
  s=a.state();if(!s.checked){a.select(s.deck[s.index].a);a.submit();}
  a.next();
 }
 assert.equal(store.getItem(a.resumeKey()),null,'finished round is cleared');
 assert.ok(a.best()!==null,'best score retained');
 a=open(slug,store,query);assert.equal(a.state().index,0,'fresh round after completion');
 assert.equal(a.state().attempts,0);
 const key=a.resumeKey(),attack=JSON.parse(store.getItem(key));
 attack.deck[0]='{"o":["<img src=x onerror=alert(1)>"]}';
 store.setItem(key,JSON.stringify(attack));
 a=open(slug,store,query);
 assert.ok(a.state().deck.every(item=>Array.isArray(item.o)&&item.o.length>=2),'untrusted snapshot rejected');
 for(const [k,v] of Object.entries(records))assert.equal(store.getItem(k),v,'official records untouched '+k);
}
const store=storage(),query=modes[0][1];
let a=open(modes[0][0],store,query);a.select(a.state().deck[0].a);a.submit();
const savedKey=a.resumeKey();
const other=open(modes[0][0],store,'?course=algebra2&unit=11&lesson=u11-l07');
assert.notEqual(other.resumeKey(),savedKey,'different lessons have independent snapshots');
assert.equal(other.state().attempts,0,'no inherited score');
a=open(modes[0][0],store,query);assert.equal(a.state().attempts,1,'original score preserved');
const triangleKey='KHAE_TRIANGLE_EXPEDITION_V1|algebra2|11|u11-l08|navigation';
const triangleSaved=JSON.stringify({solved:3,attempted:4,task:{mode:'navigation'}});
store.setItem(triangleKey,triangleSaved);
open(modes[0][0],store,query);
assert.equal(store.getItem(triangleKey),triangleSaved,'Triangle Expedition progress untouched');
console.log('PASS: Unit 10 and 11 beta resume: pending selections, submitted results, missed questions, completion reset, tampered storage rejection, independent lessons, Triangle Expedition isolation and untouched grade records');
