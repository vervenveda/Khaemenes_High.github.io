import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const path='courses/mathematics/assets/learning-games/function-transformation-studio/index.html';
const html=fs.readFileSync(path,'utf8');
const script=html.split('<script>')[1]?.split('</script>')[0];
assert.ok(script,'game script');
new vm.Script(script,{filename:path});
const model=script.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(model,'pure math source');
const f=vm.runInNewContext(model+';({parentY,transformY,inverseY,isInverse,makeTask})');
const eq=(a,b)=>Math.abs(a-b)<1e-9;
assert.ok(eq(f.parentY('quadratic',-3),9));
assert.ok(eq(f.parentY('absolute',-3),3));
assert.ok(eq(f.parentY('cubic',-2),-8));
assert.ok(eq(f.parentY('sqrt',9),3));
assert.ok(Number.isNaN(f.parentY('sqrt',-2)),'sqrt domain');
for(const type of ['quadratic','absolute','cubic','sqrt'])for(const a of [-2,-1,.5,1,2])for(const h of [-3,0,2])for(const k of [-3,0,3])for(const x of [h,h+1,h+3])
 assert.ok(eq(f.transformY(type,a,h,k,x),a*f.parentY(type,x-h)+k),'valid transform');
for(const m of [-2,-1,1,2])for(const b of [-4,-2,0,2,4]){
 assert.ok(f.isInverse(m,b,1/m,-b/m));
 assert.ok(!f.isInverse(m,b,1/m+.5,-b/m));
 for(const x of [-5,-1,0,4])assert.ok(eq(m*f.inverseY(m,b,x)+b,x));
}
for(const mode of ['transforms-basic','transforms-advanced','inverse-linear']){
 const seen=new Set();for(let i=0;i<300;i++){const t=f.makeTask(mode);seen.add(t.id);if(mode==='inverse-linear')assert.notEqual(t.m,0);else{assert.notEqual(t.a,0);if(mode==='transforms-basic')assert.ok(['quadratic','absolute'].includes(t.kind));}}
 assert.ok(seen.size>=15,'question diversity '+mode);
}
for(const file of ['courses/mathematics/algebra-1/units/unit-05/lessons/lesson-05-transformations-of-parent-functions.html','courses/mathematics/algebra-2/units/unit-01/lessons/u01-l03.html','courses/mathematics/algebra-2/units/unit-01/lessons/u01-l05.html'])
 assert.ok(fs.readFileSync(file,'utf8').includes('data-game="function-transformation-studio"'),file+' linked');
console.log('PASS: Function Transformation Studio graph math, inverse composition, domain, diversity, 3 lesson routes, script syntax');
