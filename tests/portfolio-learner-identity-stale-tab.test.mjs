import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const page=read('portfolio/index.html');
const academic=read('portfolio/portfolio-academic-report.js');
const checker=read('portfolio/portfolio-student-record-connections.js');
test('portfolio inline scripts remain parseable after hardening',()=>{
 let n=0;
 for(const m of page.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g))
  if(m[1].trim()){new Script(m[1]);n++;}
 assert.ok(n>=2);
});
test('open Portfolio tab retains original selected learner ID and grade checks',()=>{
 assert.match(page,/,learner=profile\?\.learnerId\?String\(profile\.learnerId\):null/);
 assert.match(page,/selected===learner&&person\?\.learnerId===learner/);
 assert.match(page,/person\.stage==="high"&&grade===destinationGrade/);
 assert.match(page,/KhaemenesPortfolioIdentityLock=Object\.freeze/);
});
test('learner change hides previously rendered work and locks mutations',()=>{
 assert.match(page,/const recheckLearner=\(\)=>\{if\(active\(\)\)return;entries=\[\];/);
 assert.match(page,/document\.getElementById\("entries"\)\?\.replaceChildren\(\)/);
 for(const id of ['save','export','importButton','print'])assert.ok(page.includes('"'+id+'"'),id);
 for(const event of ['focus','pageshow','storage','khaemenes-student-profile-changed'])
  assert.ok(page.includes('window.addEventListener("'+event+'",recheckLearner)'),event);
 assert.match(page,/Portfolio locked to prevent displaying another learner/);
});
test('academic report refuses stale initial-learner lock and rechecks after storage events',()=>{
 assert.match(academic,/if\(window\.KhaemenesPortfolioIdentityLock\?\.isCurrent\?\.\(\)===false\)return null/);
 assert.match(academic,/"pageshow","focus","storage"/);
 assert.match(academic,/officialFinalGrade:null,creditAwarded:null/);
});
test('record check refuses stale learner lock and never uploads records',()=>{
 assert.match(checker,/if\(window\.KhaemenesPortfolioIdentityLock\?\.isCurrent\?\.\(\)===false\)/);
 assert.match(checker,/latest=null;output.replaceChildren\(\);exportButton.disabled=true/);
 assert.match(checker,/cloudSynced:false/);
 assert.match(checker,/syncsCloud:false/);
});
test('original backups and learner-confirmed diagnostic linkage are retained',()=>{
 assert.match(page,/schema:"khae-learning-portfolio-v1"/);
 assert.match(page,/key\+":previous"/);
 assert.match(page,/data\.entries\.every\(valid\)/);
 assert.match(academic,/Review & Link My Saved Algebra I Result/);
 assert.match(academic,/Learner selection changed\. No result was linked/);
});
