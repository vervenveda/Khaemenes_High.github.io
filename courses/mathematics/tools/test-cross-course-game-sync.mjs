/* Cross-course canonical game-to-lesson agreement.
 * Deliberately read-only; never writes lesson pages, grade evidence, STOS, or registry.
 * Complements validate-shared-games.mjs (which covers Pre-Algebra's dynamic lesson engine).
 * Run: node courses/mathematics/tools/test-cross-course-game-sync.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const base='courses/mathematics/assets/learning-games';
const registry=JSON.parse(fs.readFileSync(path.join(base,'game-registry.json'),'utf8'));
const canonicalRoot=path.resolve(base);
const courses={'algebra-1':'algebra1','geometry':'geometry','algebra-2':'algebra2'};
const errors=[],seen=new Set(),actual=new Map(),expected=new Map();
const normalize=n=>String(Number(String(n).match(/(\d+)$/)?.[1]??n)).padStart(2,'0');
const key=(course,unit,lesson,slug)=>[course,normalize(unit),normalize(lesson),slug].join('|');
function scan(dir){
 return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>
  d.isDirectory()?scan(path.join(dir,d.name)):[path.join(dir,d.name)]);
}
function parseAttrs(tag){return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)].map(x=>[x[1],x[2]]));}
for(const [course,code] of Object.entries(courses)){
 const root='courses/mathematics/'+course+'/units';
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
   if(!fs.existsSync(game.canonical_path))errors.push(file+': game entry missing '+game.canonical_path);
   const k=key(course,u,l,slug);
   if(seen.has(k))errors.push(file+': duplicate canonical game '+slug);
   seen.add(k);actual.set(k,{file,mode:attrs['data-mode']||''});
   const placement=(game.placements||[]).find(p=>p.course===course&&key(course,p.unit,p.lesson,slug)===k&&p.mode===(attrs['data-mode']||''));
   if(!placement)errors.push(file+': '+slug+' launcher mode/lesson has no matching registry placement ('+(attrs['data-mode']||'none')+')');
  }
 }
}
for(const [slug,g] of Object.entries(registry.games)){
 assert.ok(g.canonical_path===base+'/'+slug+'/index.html',slug+': inconsistent canonical path');
 if(!(g.placements||[]).length)continue;
 for(const p of g.placements){
  if(!Object.hasOwn(courses,p.course))continue;
  const k=key(p.course,p.unit,p.lesson,slug);
  if(expected.has(k))errors.push(k+': duplicate registry placement');
  expected.set(k,p);
  const a=actual.get(k);
  if(!a)errors.push(k+': registered lesson game missing from lesson HTML');
  else if(a.mode!==p.mode)errors.push(k+': mode mismatch '+a.mode+' != '+p.mode);
 }
}
for(const [k,record] of actual)if(!expected.has(k))errors.push(record.file+': launcher has no registry entry '+k);
const byCourse={};
for(const k of actual.keys()){const c=k.split('|')[0];byCourse[c]=(byCourse[c]||0)+1}
if(errors.length){console.error(errors.map(x=>'ERROR '+x).join('\n'));process.exit(1)}
console.log('PASS: '+actual.size+' exact game launchers across Algebra I, Geometry, Algebra II; per course '+JSON.stringify(byCourse));
console.log('PASS: '+Object.keys(registry.games).length+' canonical games, '+Object.values(registry.games).filter(g=>!g.placements?.length).length+' unplaced, no duplicate or mismatched lesson/game/mode launchers.');
