import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const exists=p=>fs.existsSync(path.join(ROOT,p));
let failed=false;
const ok=(cond,msg)=>{if(cond)console.log(`OK ${msg}`);else{failed=true;console.error(`FAIL ${msg}`)}};

const LABS=[
 ['linear-model-lab.html','linear-model'],
 ['systems-constraints-lab.html','systems-constraints'],
 ['exponential-change-lab.html','exponential-change'],
 ['quadratic-design-lab.html','quadratic-design'],
 ['financial-evidence-lab.html','financial-evidence'],
 ['integrated-modelling-lab.html','integrated-modelling']
];

const index=read('labs/index.html');
const engine=read('labs/assets/lab-engine-v1.js');
const sw=read('service-worker.js');
const cacheName=sw.match(/const\s+CACHE_VERSION\s*=\s*["']([^"']+)["']/)?.[1]||'';
const releaseMatch=sw.match(/const\s+RELEASE_FILES\s*=\s*\[([\s\S]*?)\];/);
const releaseFiles=releaseMatch
 ? [...releaseMatch[1].matchAll(/["'](\.\/[^"']+)["']/g)].map(match=>match[1])
 : [];
const releaseSet=new Set(releaseFiles);

ok(/const C=window\.KHAE_ALGEBRA1_LAB/.test(engine),'shared lab engine consumes per-lab configuration');
ok(/MASTERY=80/.test(engine),'shared lab mastery threshold is 80%');
ok(engine.includes('khaemenes-algebra1-labs-v1'),'lab evidence uses dedicated localStorage namespace');
ok(engine.includes('data-field="evaluator"')&&engine.includes('data-field="review_date"')&&engine.includes('data-field="attestation"'),'lab review requires evaluator identity, review date, and attestation controls');
ok(engine.includes('if(!String(f.evaluator||"").trim()||!f.review_date||!f.attestation)'),'lab engine refuses to record review without issuer/date/attestation');
ok(engine.includes('authoritative:false')&&engine.includes('digitally_signed:false')&&engine.includes('identity_authenticated:false'),'lab evidence trust boundary remains non-authoritative, unsigned, and unauthenticated');
ok(engine.includes('does not by itself unlock course progression'),'lab engine explicitly separates supplemental lab mastery from course progression');
ok(engine.includes('pct>=MASTERY')&&engine.includes('mastery_met:pct>=MASTERY'),'lab mastery state is derived from the 80% evaluator score');

for(const [file,id] of LABS){
 const rel=`labs/${file}`;
 ok(exists(rel),`${file} exists`);
 if(!exists(rel))continue;
 const html=read(rel);
 ok(index.includes(`href="${file}"`),`lab catalog links ${file}`);
 ok(html.includes(`id:"${id}"`),`${file} has stable lab id ${id}`);
 ok(html.includes('window.KHAE_ALGEBRA1_LAB={'),`${file} defines lab configuration`);
 ok(html.includes('<script src="assets/lab-engine-v1.js"></script>'),`${file} loads shared lab engine`);
 ok(html.includes('objectives:[')&&html.includes('procedure:[')&&html.includes('sections:[')&&html.includes('checklist:['),`${file} includes objectives, procedure, evidence sections, and QA checklist`);
 const rubric=html.match(/rubric:\[(.*?)\]\};<\/script>/s)?.[1]||'';
 const criteria=rubric.match(/"(?:\\.|[^"\\])*"/g)||[];
 ok(criteria.length===5,`${file} provides exactly five evaluator rubric criteria`);
 ok(html.includes('80% lab mastery'),`${file} visibly states the 80% lab standard`);
 ok(releaseSet.has(`./labs/${file}`),`offline release set includes ${file}`);
}

ok(index.includes('A complete review of at least 80% records lab mastery'),'lab catalog states evaluator-reviewed 80% standard');
ok(index.includes('does not silently bypass or replace lesson, weekly, unit, Midterm, Final, or capstone gates'),'lab catalog preserves the canonical course-gate boundary');
ok(/^khaemenes-algebra1-v\d+-/.test(cacheName),'service worker uses a versioned Algebra I release cache');
ok(releaseSet.has('./labs/index.html')&&releaseSet.has('./labs/assets/lab-engine-v1.js'),'offline release set includes lab catalog and engine');
ok(LABS.every(([file])=>releaseSet.has(`./labs/${file}`)),'service worker release set includes the complete six-lab offline suite');
ok(/caches\.open\(CACHE_VERSION\)/.test(sw),'service worker installs release files into the active Algebra I cache');
ok(/key\.startsWith\("khaemenes-algebra1-"\).*key!==CACHE_VERSION/.test(sw),'service worker removes prior Algebra I cache versions without pinning validation to one release name');

const integrated=read('labs/integrated-modelling-lab.html');
ok(integrated.includes('does not award early Unit 13, weekly, capstone, or Final mastery'),'integrated modelling lab grants no early summative mastery');

if(failed){console.error('\nAlgebra I applied-lab validation FAILED.');process.exit(1)}
console.log(`\nPASS Algebra I six-lab applied evidence suite and offline contract (${cacheName}).`);
