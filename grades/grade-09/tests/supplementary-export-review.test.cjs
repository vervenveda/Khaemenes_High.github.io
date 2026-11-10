"use strict";
/* Source/UX contract checks. Does not access real students or browser localStorage.
 * Run: node --test grades/grade-09/tests/supplementary-export-review.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"../../..");
const html=fs.readFileSync(path.join(root,"grades/grade-09/migration/supplementary-export-review.html"),"utf8");
const moduleSource=fs.readFileSync(path.join(root,"grades/grade-09/migration/supplementary-course-export-v1.js"),"utf8");
test("manual export requires learner confirmation and is not auto-started",()=>{
 assert.ok(html.includes('id="consent" type="checkbox"'));
 assert.ok(html.includes('id="prepare" type="button" disabled'));
 assert.ok(html.includes('id="download" type="button" disabled'));
 assert.ok(html.includes('if(!$("consent").checked)'));
});
test("release preview makes plaintext risks and incomplete coverage unambiguous",()=>{
 assert.ok(html.includes("Review-branch tool — not yet production approved."));
 assert.ok(html.includes("unencrypted"));
 assert.ok(html.includes("does NOT cover all courses"));
 assert.ok(html.includes("do not upload it to a public repository"));
});
test("no network exports or localStorage mutations",()=>{
 assert.ok(html.includes("connect-src 'none'"));
 assert.ok(!/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket\b/.test(html));
 assert.ok(!/\.setItem\(|\.removeItem\(|\.clear\(/.test(html));
 assert.ok(!/\.setItem\(|\.removeItem\(|\.clear\(/.test(moduleSource));
});
test("active learner selection is revalidated before capture and download",()=>{
 assert.ok(html.includes('contract.identityRaw?.()!==JSON.stringify(owner.learnerId)'));
 assert.ok(html.includes('actual.learnerId!==owner.learnerId'));
 assert.ok(html.includes('window.addEventListener("storage"'));
});
test("records are exported as original key and string, not normalized grades",()=>{
 assert.ok(moduleSource.includes('source_key:key,record_type:kind,raw_value:value'));
 assert.ok(moduleSource.includes('official_academic_record:false'));
 assert.ok(moduleSource.includes('complete_grade09_backup:false'));
});

test("English shared-dashboard extraction and PE quarantine are explicit, never cloud imports",()=>{
 assert.ok(html.includes('legacy-shared-record-guard-v1.js'));
 assert.ok(html.includes('guard.extractEnglishDashboard(window.localStorage,owner.learnerId)'));
 assert.ok(html.includes('guard.quarantinePE(window.localStorage)'));
 assert.ok(html.includes('archive.records.push(...english.records)'));
 assert.ok(html.includes('PE records remain quarantined'));
 assert.ok(!/\.setItem\(|\.removeItem\(|\.clear\(/.test(html));
});
test("combined plain-text export fails closed on size and learner switch",()=>{
 assert.ok(html.includes('new TextEncoder().encode(JSON.stringify(archive)).byteLength>20*1024*1024'));
 assert.ok(html.includes('Learner selection changed during collection'));
 assert.ok(html.includes('archive.complete_grade09_backup=false'));
});
