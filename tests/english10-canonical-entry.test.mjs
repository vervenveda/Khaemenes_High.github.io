import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";

const base=new URL("../courses/language-arts/english-10/grades/grade-10/index.html",import.meta.url);
const html=await readFile(base,"utf8");
const scripts=Array.from(html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),m=>m[1]);
const resolve=url=>new URL(url,"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-10/grades/grade-10/index.html").pathname;
test("uses exactly one canonical VNV dual ticker guard",()=>{
 assert.equal(scripts.filter(s=>s.includes("vnv-dual-ticker-v1.js")).length,1);
 assert.equal(resolve("../../../../../assets/vnv-dual-ticker-v1.js"),"/Khaemenes_High.github.io/assets/vnv-dual-ticker-v1.js");
 assert.doesNotMatch(html,/id="networkTicker"|id="vnvTickerAutoPopulate"/);
});
test("uses exactly one shared ecosystem hamburger and right toolbar",()=>{
 assert.equal(scripts.filter(s=>s.includes("vnv-ecosystem-menu.js")).length,1);
 assert.equal(scripts.filter(s=>s.includes("vnv-ecosystem-toolbar.js")).length,1);
 assert.match(html,/data-vnv-ecosystem-slot/);
 assert.doesNotMatch(html,/id="menuButton"|id="menuOverlay"/);
});
test("left tools include translator without a duplicate language rail",()=>{
 assert.equal(scripts.filter(s=>s.includes("vnv-class-tools-toolbar.js")).length,1);
 assert.equal(scripts.filter(s=>s.includes("english-landing-class-tools-v1.js")).length,1);
 assert.equal(scripts.filter(s=>s.includes("vnv-language.js")).length,1);
 assert.equal(scripts.filter(s=>s.includes("khaemenes-translator-loader.js")).length,1);
 assert.match(html,/id="khaeEnglishTranslatorMount" hidden data-vnv-language-mount/);
 assert.equal(resolve("../../../assets/english-landing-class-tools-v1.js"),"/Khaemenes_High.github.io/courses/language-arts/assets/english-landing-class-tools-v1.js");
});
test("page has required 33/66/24 hierarchy and symmetric feature grid",()=>{
 assert.match(html,/<h1 id="english10-title">English 10<\/h1>/);
 assert.match(html, /\.english-hero \.eyebrow\{font-size:33px/);
 assert.match(html, /\.english-hero h1\{font-size:66px/);
 assert.match(html, /\.english-hero \.descriptor\{font-size:24px/);
 assert.match(html,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.equal((html.match(/class="english-feature"/g)||[]).length,4);
 assert.match(html,/border-radius:7px/);
});
test("learner, parent and enrollment are only three central access doors",()=>{
 const section=html.match(/<section class="english-actions shell"[\s\S]*?<\/section>/)?.[0];
 assert.ok(section);
 assert.equal((section.match(/<a /g)||[]).length,3);
 for(const label of ["Learner Profile","Parent Profile","Enrollment"])assert.ok(section.includes(">"+label+"</a>"));
 assert.match(section,/grades\/grade-10\/student-profile/);
 assert.match(section,/Khaemenes_Academy\.github\.io\/family\/enroll/);
});
test("clean entry retains canonical course scope and avoids legacy course portal UI",()=>{
 assert.match(html,/learner-scope-v1.js/);
 assert.match(html,/course-entry-contract.js/);
 assert.doesNotMatch(html,/data-theme-toggle|id="studentName"|id="themeToggle"|data-open-view/);
 assert.match(html,/class="english-footer"/);
});
