'use strict';
// Source-level regression suite. Does not access learner data.
// Run from repository root: node --test tests/high-school-study-notes-contract.test.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const [name,p,key] of [
 ['Grade 09','grades/grade-09/student-profile/study-studio.js','g09-study-studio-notes-v1:'],
 ['Grades 10-12','grades/shared/upper-grade-klasaipeer-studio.js','khae-grade']
]){
 test(name+': valid syntax and preserved canonical key',()=>{
  const s=read(p);
  assert.doesNotThrow(()=>new vm.Script(s,{filename:p}));
  assert.ok(s.includes(key));
  assert.match(s,/function key\(\)/);
 });
 test(name+': verified learner and class required for save',()=>{
  const s=read(p);
  assert.ok(s.includes('verifiedLearner()!==learner'));
  assert.ok(s.includes('reg?.getCourse?.(sel.value)'));
 });
 test(name+': save readback occurs before successful baseline update',()=>{
  const s=read(p);
  assert.ok(s.includes('localStorage.setItem(noteKey,value)'));
  assert.ok(s.includes('localStorage.getItem(noteKey)!==value'));
  assert.ok(s.indexOf('localStorage.getItem(noteKey)!==value') < s.indexOf('savedNotes=value;discardDraft()'));
 });
 test(name+': scoped and opt-in draft recovery remains present',()=>{
  const s=read(p);
  assert.ok(s.includes('recovery-draft-v1'));
  assert.ok(s.includes('JSON.stringify({version:1,text:notes.value'));
  assert.ok(s.includes('window.confirm("A study-note draft was found'));
  assert.ok(s.includes('notes.value=draft.text'));
  assert.ok(s.includes('discardDraft(loadedCourse)'));
 });
 test(name+': flashcard decks are learner and course scoped and opt-in',()=>{
  const s=read(p);
  for(const fragment of [
   'function cardKey(){return key()+":flashcard-deck-v1"}',
   'function canUseCards()',
   'verifiedLearner()===learner',
   'function validCards(value)',
   'function loadDeck()',
   'savedNotes=notes.value;loadDeck();return recoverDraft()',
   'g09sSaveDeck',
   'localStorage.setItem(storageKey,value)',
   'localStorage.getItem(storageKey)!==value',
   'version:1,cards:cards.map(pair=>pair.slice())'
  ])assert.ok(s.includes(fragment),fragment);
  assert.ok(s.indexOf('localStorage.getItem(storageKey)!==value') < s.indexOf('Flashcard deck saved and checked'));
 });
 test(name+': leave warnings and studio features remain present',()=>{
  const s=read(p);
  for(const fragment of ['sel.value=loadedCourse;return','if(confirmDiscard())d.close()','addEventListener("cancel"','addEventListener("beforeunload"','g09sBuild','g09sCanvas','g09sClear'])
   assert.ok(s.includes(fragment),fragment);
 });
}
for(const [grade,script] of [
 ['09','study-studio.js?v='],
 ['10','upper-grade-klasaipeer-studio.js?v='],
 ['11','upper-grade-klasaipeer-studio.js?v='],
 ['12','upper-grade-klasaipeer-studio.js?v=']
]){
 test('Grade '+grade+': entrypoint references studio',()=>{
  assert.ok(read('grades/grade-'+grade+'/student-profile/index.html').includes(script));
 });
}
// This suite verifies checked-in contracts only; manual browser interaction is still required.
