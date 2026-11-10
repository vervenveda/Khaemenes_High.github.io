"use strict";
/* Synthetic-only English 9 and Algebra I lesson persistence tests.
 * Run: node --test courses/tests/algebra-english-retention.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const english=fs.readFileSync(path.join(root,"language-arts/english-9/assets/course.js"),"utf8");
const portal=fs.readFileSync(path.join(root,"language-arts/english-9/index.html"),"utf8");
const algebra=fs.readFileSync(path.join(root,"mathematics/algebra-1/units/unit-01/assets/unit01.js"),"utf8");
const scoped=fs.readFileSync(path.join(root,"shared/learner-scope-v1.js"),"utf8");
test("English 9 course lesson state has confirmed write and concurrent-tab protection",()=>{
 assert.ok(english.includes('if(localStorage.getItem(courseKey)!==lastStoredProgress)'));
 assert.ok(english.includes('if(localStorage.getItem(courseKey)!==encoded)throw Error'));
 assert.ok(english.includes('if(!save(progress)){progress[key]=previous;return}'));
 assert.ok(english.includes('retentionNotice.textContent="Unable to confirm this lesson save.'));
});
test("English 9 written work does not claim retention on rejected draft write",()=>{
 assert.ok(english.includes('if(!selectionMatches()){retentionNotice.textContent="No verified Academy learner or the learner changed. This draft was not saved."'));
 assert.ok(english.includes('if(localStorage.getItem(key)!==value)throw Error'));
});
test("English 9 main quiz and exam record writer checks readback and selected learner",()=>{
 assert.ok(portal.includes('if(localStorage.getItem(STORAGE_KEY)!==serialized)'));
 assert.ok(portal.includes('if(selected!==profile.learnerId||active?.academyLearnerId!==profile.learnerId)'));
 assert.ok(portal.includes('recordError("English 9 could not save this change.'));
});
test("Algebra I Unit 01 graded attempts and drafts verify persisted bytes",()=>{
 assert.ok(algebra.includes('localStorage.getItem(KEY)===encoded'));
 assert.ok(algebra.includes('if(localStorage.getItem(draftKey)!==encoded)throw Error'));
 assert.ok(algebra.includes('if(!save(record))'));
});
test("Algebra I learner scope quarantines unowned legacy records, preserving gates",()=>{
 assert.ok(scoped.includes('const learnerKey = (base, id) =>'));
 assert.ok(scoped.includes('pending.add(base); scheduleNotice(); return null;'));
 assert.ok(algebra.includes('MASTERY=80'));
 assert.ok(algebra.includes('function lessonMastered(n)'));
});
test("Algebra I graded attempt save fails closed on storage quota or readback mismatch",()=>{
 const found=algebra.match(/function save\(r\)\{try\{const encoded=JSON\.stringify\(r\);localStorage\.setItem\(KEY,encoded\);return localStorage\.getItem\(KEY\)===encoded\}catch\{return false\}\}/);
 assert.ok(found,"unit01 save helper remains explicit and standalone");
 const evaluate=store=>vm.runInNewContext('const KEY="test-grade";'+found[0]+';save({attempts:[{id:"a"}]})',{localStorage:store,JSON});
 const values=new Map(),ok={setItem:(k,v)=>values.set(k,v),getItem:k=>values.get(k)||null};
 assert.equal(evaluate(ok),true);
 assert.equal(evaluate({setItem(){throw Error("quota")},getItem(){return null}}),false);
 assert.equal(evaluate({setItem(){},getItem(){return "old"}}),false);
});
