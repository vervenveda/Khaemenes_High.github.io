// Check every shared game, including games outside the launcher registry.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const base=path.resolve('courses/mathematics/assets/learning-games');
let games=0,links=0,readers=0;
for(const slug of fs.readdirSync(base)){
 const file=path.join(base,slug,'index.html');if(!fs.existsSync(file))continue;
 games++;
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/href=["']([^"']+)["']/g)){
  const href=match[1];if(!href.includes('/units/'))continue;
  const target=path.resolve(path.dirname(file),href.split(/[?#]/)[0]);
  assert.ok(fs.existsSync(target),`${slug}: missing lesson ${href}`);links++;
 }
 // Execute the shipped storage reader with the game's existing key interface.
 const match=html.match(/function (best|bestValue)\(\)\{\s*try\{([\s\S]*?)\}\s*catch\([^)]*\)\{return null\}\s*\}/);
 if(!match){assert.equal(slug,'ratio-atelier',`${slug}: missing score reader`);continue}
 readers++;
 let stored=null,unavailable=false;
 const context=vm.createContext({BEST:'test-key',bestKey:()=> 'test-key',localStorage:{getItem:()=>{if(unavailable)throw Error('storage unavailable');return stored}}});
 vm.runInContext(match[0],context);
 const read=()=>vm.runInContext(`${match[1]}()`,context);
 assert.equal(read(),null,`${slug}: missing score`);
 for(const value of ['0','72','100']){stored=value;assert.equal(read(),Number(value),`${slug}: saved ${value}`)}
 stored='invalid';assert.equal(read(),null,`${slug}: invalid score`);
 unavailable=true;assert.equal(read(),null,`${slug}: blocked storage`);
}
assert.equal(games,24);assert.equal(readers,23);
console.log(`PASS: ${games} shared games, ${links} lesson links, ${readers} storage readers (missing, zero, saved, invalid, unavailable)`);
