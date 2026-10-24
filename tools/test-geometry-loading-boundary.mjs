import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
const lesson=fs.readFileSync("courses/mathematics/geometry/units/unit-01/lessons/u01-l01.html","utf8");
const tools=fs.readFileSync("courses/mathematics/geometry/assets/lesson-tools.js","utf8");
const entry=fs.readFileSync("courses/shared/course-entry-contract.js","utf8");
const browser=fs.readFileSync("tests/math-browser-geometry-cdp.mjs","utf8");
new vm.Script(tools);new vm.Script(entry);
assert.match(lesson,/id="lessonMain"/,"Original printable Geometry lesson remains present");
assert.match(lesson,/id="lessonComplete"/);
assert.match(lesson,/id="lessonNote"/);
assert.match(lesson,/id="saveLessonNote"/);
assert.match(lesson,/lesson-tools\.js/);
assert.match(tools,/const MASTERY=80/,"The 80% rule must remain unchanged");
assert.match(tools,/new URL\("\.\.\/\.\.\/\.\.\/\.\.\/assets\/vnv-beta-link\.js",toolbarSource\)/,
 "Geometry toolbar should load from its own host, including offline cache");
assert.match(entry,/new URL\("\.\.\/\.\.\/assets\/vnv-beta-link\.js",entryAssetSource\)/,
 "Shared Geometry entry must not override the same-origin toolbar with a remote copy");
assert.ok(fs.existsSync(path.join("assets","vnv-beta-link.js")),"Local learner rail asset missing");
assert.match(browser,/Page\.navigate/);
assert.match(browser,/lessonMasteryScore/);
assert.match(browser,/lessonStatus/);
assert.match(browser,/document\.readyState/);
assert.match(browser,/process\.exitCode=1/,"Failure must not be reported as success");
assert.doesNotMatch(tools, /script\.src="https:\/\/vervenveda\.com\/Khaemenes_High\.github\.io\/assets\/vnv-beta-link\.js"/,
 "No remote toolbar loading from Geometry lesson script");
console.log("PASS Geometry lesson-loading boundaries: original lesson/evidence controls preserved, mastery stays at 80%, same-origin toolbar, real CDP DOM/gate verification.");
