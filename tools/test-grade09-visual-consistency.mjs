import fs from "node:fs";
import assert from "node:assert/strict";

const sharedCssPath="assets/grade09-subject-parchment.css";
const sharedHref="../../../assets/grade09-subject-parchment.css";
const css=fs.readFileSync(sharedCssPath,"utf8");
const subjects={
 english:{html:"courses/language-arts/english-9/index.html",body:"data-english9-require-entry",label:"English 9"},
 science:{html:"courses/science/integrated-science-9/index.html",body:"data-science9-require-entry",label:"Integrated Science 9"}
};

for(const token of [
 "--g9-bg: #f4f0e7","--g9-paper: #fffefa","--g9-text: #20241f","--g9-accent: #77551f",
 "border-radius: 7px","border-radius:7px","Cinzel","Brandon Grotesque","font-size:16px",
 ":focus-visible","@media (max-width: 960px)","@media (max-width: 560px)",
 "@media (prefers-reduced-motion: reduce)","@media print"
]) assert.ok(css.includes(token),"shared Grade 9 subject CSS missing "+token);

assert.ok(!/\b(localStorage|sessionStorage|fetch|XMLHttpRequest)\b/.test(css),"presentation CSS must not own learner records or network state");
let nesting=0;
for(const ch of css){if(ch==="{")nesting++;if(ch==="}")nesting--;assert.ok(nesting>=0,"shared CSS brace balance")}
assert.equal(nesting,0,"shared CSS braces balanced");

for(const [name,cfg] of Object.entries(subjects)){
 const html=fs.readFileSync(cfg.html,"utf8");
 assert.ok(html.includes("width=device-width"),name+" responsive viewport");
 if(name==="english"){
  assert.ok(html.includes("inline English 9 canonical stylesheet is the sole presentation owner."),name+" preserves its approved single presentation owner");
  assert.equal(html.split(sharedHref).length-1,0,name+" does not layer a competing subject CSS");
  assert.equal(html.split("../../../assets/vervenveda-parchment.css").length-1,0,name+" does not layer legacy parchment");
  assert.equal(html.split("../../../assets/high-navigation-v1.css").length-1,0,name+" does not layer legacy navigation CSS");
 }else{
  assert.equal(html.split(sharedHref).length-1,1,name+" loads the shared Grade 9 subject presentation owner once");
  assert.equal(html.split("../../../assets/vervenveda-parchment.css").length-1,1,name+" loads the base parchment once");
  assert.equal(html.split("../../../assets/high-navigation-v1.css").length-1,1,name+" loads the subject navigation stylesheet once");
 }
 assert.equal(html.split("../../../assets/high-navigation-v1.js").length-1,1,name+" loads the subject navigation runtime once");
 assert.ok(html.includes(cfg.body),name+" exposes the shared Grade 9 subject selector");
 assert.ok(html.includes(cfg.label),name+" preserves course identity");
 assert.ok(html.includes("vnv-language.js"),name+" language tools remain available");
 assert.ok(html.includes("vnv-ecosystem-toolbar.js"),name+" official ecosystem toolbar remains available");
 assert.ok(!html.includes("high-school-global-chrome-v2.js"),name+" retired global chrome remains absent");
 assert.ok(!html.includes("english-minimal-landing-v1.css")&&!html.includes("science-minimal-landing-v1.css"),name+" retired minimal landing owner remains absent");
}

console.log("PASS: Grade 9 English and Science share one parchment subject owner with 16px text floor, 7px geometry, keyboard focus, responsive/print contracts, and no retired global chrome.");
