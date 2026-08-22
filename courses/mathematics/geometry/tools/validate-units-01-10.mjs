import {spawnSync} from 'node:child_process';
const suites=['courses/mathematics/geometry/tools/validate-units-01-09.mjs','courses/mathematics/geometry/tools/validate-unit-10.mjs'];
let failed=0;
for(const suite of suites){
 console.log(`\n=== RUN ${suite} ===`);
 const r=spawnSync(process.execPath,[suite],{encoding:'utf8'});
 if(r.stdout)process.stdout.write(r.stdout);
 if(r.stderr)process.stderr.write(r.stderr);
 if(r.status!==0)failed++;
}
if(failed){console.error(`\nGeometry Units 01-10 audit failed: ${failed} validator suite(s) reported problems.`);process.exit(1)}
console.log('\nGeometry Units 01-10 audit passed.');