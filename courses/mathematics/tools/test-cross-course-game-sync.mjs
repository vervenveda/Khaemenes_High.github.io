/* Cross-course canonical game-to-lesson agreement.
 * Read-only. Supports both explicit per-lesson launchers and the canonical
 * registry-driven lesson bridge mounted by course-entry-contract.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const mathRoot='courses/mathematics';
const base=mathRoot+'/assets/learning-games';
const registry=JSON.parse(fs.readFileSync(path.join(base,'game-registry.json'),'utf8'));
const courses={'algebra-1':'algebra1','geometry':'geometry','algebra-2':'algebra2'};
const bridgePath=mathRoot+'/assets/math-shared-game-bridge-v1.js';
const entryPath='courses/shared/course-entry-contract.js';
const errors=[],seen=new Set(),actual=new Map(),expected=new Map();
const normalize=n=>String(Number(String(n).match(/(\d+)$/)?.[1]??n)).padStart(2,'0');
const key=(course,unit,lesson,slug)=>[course,normalize(unit),normalize(lesson),slug].join('|');
function scan(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?scan(path.join(dir,d.name)):[path.join(dir,d.name)])}
function parseAttrs(tag){return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)].map(x=>[x[1],x[2]]))}
function resolveLesson(course,unit,lesson){
  const u=normalize(unit),l=normalize(lesson),root=mathRoot+'/'+course+'/units/unit-'+u;
  if(course==='geometry'||course==='algebra-2')return root+'/lessons/u'+u+'-l'+l+'.html';
  const mapPath=root+'/unit-map.json';
  if(!fs.existsSync(mapPath))return null;
  const map=JSON.parse(fs.readFileSync(mapPath,'utf8'));
  const entries=Array.isArray(map.lessons)?map.lessons:[];
  const hit=entries.find((x,i)=>{
    const id=String(x.id||'').toLowerCase();
    const n=normalize(x.number??i+1);
    return id==='l'+l||id==='u'+u+'-l'+l||n===l;
  });
  const ref=hit?.file||hit?.path;
  return ref?path.posix.normalize(root+'/'+ref):null;
}

const bridgeInstalled=fs.existsSync(bridgePath)&&fs.existsSync(entryPath)&&fs.readFileSync(entryPath,'utf8').includes('math-shared-game-bridge-v1.js');
if(!bridgeInstalled)errors.push('canonical registry-driven shared-game bridge is not installed');
if(fs.existsSync(bridgePath)){try{new vm.Script(fs.readFileSync(bridgePath,'utf8'),{filename:bridgePath})}catch(e){errors.push('shared-game bridge syntax: '+e.message)}}

for(const [course,code] of Object.entries(courses)){
 const root=mathRoot+'/'+course+'/units';
 for(const file of scan(root).filter(x=>/\/units\/unit-[^/]+\/lessons\/[^/]+\.html$/.test(x))){
  const html=fs.readFileSync(file,'utf8'),u=normalize(file.match(/unit-(\d+)/)?.[1]),l=normalize(file.match(/(?:u\d+-l|lesson-)(\d+)/)?.[1]||0);
  for(const m of html.matchAll(/<script\b[^>]*shared-game-launcher\.js[^>]*>/gi)){
   const attrs=parseAttrs(m[0]),slug=attrs['data-game'];
   if(!slug){errors.push(file+': game launcher missing data-game');continue}
   if(attrs['data-course']!==code)errors.push(file+': expected data-course='+code+' for '+slug);
   if(normalize(attrs['data-unit'])!==u)errors.push(file+': incorrect data-unit '+attrs['data-unit']);
   if(normalize(attrs['data-lesson'])!==l)errors.push(file+': incorrect data-lesson '+attrs['data-lesson']);
   const dest=path.resolve(path.dirname(file),(attrs.src||'').split('?')[0]);
   if(!fs.existsSync(dest))errors.push(file+': launcher script missing '+attrs.src);
   const game=registry.games[slug];
   if(!game){errors.push(file+': unregistered game '+slug);continue}
   const k=key(course,u,l,slug);
   if(seen.has(k))errors.push(file+': duplicate canonical game '+slug);
   seen.add(k);actual.set(k,{file,mode:attrs['data-mode']||'',source:'explicit'});
   const placement=(game.placements||[]).find(p=>p.course===course&&key(course,p.unit,p.lesson,slug)===k&&p.mode===(attrs['data-mode']||''));
   if(!placement)errors.push(file+': '+slug+' launcher mode/lesson has no matching registry placement ('+(attrs['data-mode']||'none')+')');
  }
 }
}

for(const [slug,g] of Object.entries(registry.games)){
 assert.equal(g.canonical_path,base+'/'+slug+'/index.html',slug+': inconsistent canonical path');
 for(const p of g.placements||[]){
  if(!Object.hasOwn(courses,p.course))continue;
  const k=key(p.course,p.unit,p.lesson,slug);
  if(expected.has(k))errors.push(k+': duplicate registry placement');
  expected.set(k,p);
  const explicit=actual.get(k);
  if(explicit){
    if(explicit.mode!==p.mode)errors.push(k+': mode mismatch '+explicit.mode+' != '+p.mode);
    continue;
  }
  const lessonPath=resolveLesson(p.course,p.unit,p.lesson);
  if(!lessonPath||!fs.existsSync(lessonPath)){errors.push(k+': registered lesson route is missing');continue}
  const html=fs.readFileSync(lessonPath,'utf8');
  if(!bridgeInstalled||!html.includes('course-entry-contract.js')){
    errors.push(k+': placement has neither explicit launcher nor canonical registry bridge');
    continue;
  }
  actual.set(k,{file:lessonPath,mode:p.mode||'',source:'registry-bridge'});
 }
}

for(const [k,record] of actual)if(!expected.has(k))errors.push(record.file+': launcher has no registry entry '+k);
const byCourse={},bySource={};
for(const [k,v] of actual){const c=k.split('|')[0];byCourse[c]=(byCourse[c]||0)+1;bySource[v.source]=(bySource[v.source]||0)+1}
if(errors.length){console.error(errors.map(x=>'ERROR '+x).join('\n'));process.exit(1)}
console.log('PASS: '+actual.size+' exact registered game placements across Algebra I, Geometry, Algebra II; per course '+JSON.stringify(byCourse));
console.log('PASS: wiring sources '+JSON.stringify(bySource)+'; registry bridge preserves each registered mode without duplicating lesson markup.');
