import fs from "node:fs";
import assert from "node:assert/strict";

const subjects={
 english:{
  html:"courses/language-arts/english-9/index.html",
  css:"courses/language-arts/assets/english-minimal-landing-v1.css",
  cssHref:"../assets/english-minimal-landing-v1.css",
  header:"../assets/english-minimal-header-mount-v1.js",
  tools:"../assets/english-landing-class-tools-v1.js",
  hero:"english-hero",feature:"english-feature",label:"English 9"
 },
 science:{
  html:"courses/science/integrated-science-9/index.html",
  css:"courses/science/assets/science-minimal-landing-v1.css",
  cssHref:"../assets/science-minimal-landing-v1.css",
  header:"../assets/science-minimal-header-mount-v1.js",
  tools:"../assets/science-landing-class-tools-v1.js",
  hero:"science-hero",feature:"science-feature",label:"International Integrated Science 9"
 }
};
const requiredCss=[
 "--paper:#f4f0e7","--charcoal:#252b2b","--cream:#fff8e9","--gold:#b48b45",
 "--radius:7px","Cinzel","Brandon Grotesque",":focus-visible",
 "font-size:16px","@media(max-width:760px)","@media(max-width:380px)","@media print"
];
const palettes={};

for(const [name,c] of Object.entries(subjects)){
 const html=fs.readFileSync(c.html,"utf8"),css=fs.readFileSync(c.css,"utf8");
 assert.ok(html.includes('width=device-width'),name+" responsive viewport");
 assert.equal(html.split(c.cssHref).length-1,1,name+" minimal stylesheet loaded once");
 assert.ok(html.includes(c.header),name+" minimal header owner");
 assert.ok(html.includes(c.tools),name+" landing class-tools config");
 assert.ok(html.includes("vnv-dual-ticker-v1.js"),name+" dual ticker");
 assert.ok(html.includes("vnv-header-autopopulate.js"),name+" official header");
 assert.ok(html.includes("vnv-language.js"),name+" language tools");
 assert.ok(html.includes("vnv-class-tools-toolbar.js"),name+" class tools toolbar");
 assert.ok(html.includes("vnv-descriptive-card-dialog-v1.js"),name+" descriptive card dialog");
 assert.ok(html.includes("vnv-ecosystem-toolbar.js"),name+" ecosystem toolbar");
 assert.ok(html.includes('class="skip-link" href="#main"'),name+" skip navigation");
 assert.ok(html.includes('id="main"'),name+" main landmark");
 assert.ok(html.includes('class="'+c.hero+'"'),name+" course hero");
 assert.equal(html.split('class="'+c.feature+'"').length-1,4,name+" four descriptive feature cards");
 assert.ok(html.includes(c.label),name+" course identity");
 assert.ok(html.includes("/grades/grade-09/student-profile/"),name+" Grade 9 learner profile route");
 assert.ok(html.includes("/Khaemenes_Academy.github.io/family/"),name+" family route");
 assert.ok(html.includes("/Khaemenes_Academy.github.io/family/enroll/"),name+" enrollment route");
 assert.ok(!html.includes("high-school-global-chrome-v2.js"),name+" retired chrome remains absent");
 assert.ok(!html.includes("data-grade09-consistency"),name+" retired dashboard parchment injection remains absent");
 for(const token of requiredCss)assert.ok(css.includes(token),name+" visual CSS missing "+token);
 assert.ok(!/\b(localStorage|sessionStorage|fetch|XMLHttpRequest)\b/.test(css),name+" presentation CSS must not handle learner records");
 let nesting=0;
 for(const ch of css){if(ch==="{")nesting++;if(ch==="}")nesting--;assert.ok(nesting>=0,name+" CSS brace balance");}
 assert.equal(nesting,0,name+" CSS braces balanced");
 palettes[name]=Object.fromEntries(["paper","charcoal","cream","ink","muted","gold","line","radius"].map(k=>{
   const m=css.match(new RegExp("--"+k+":([^;]+)"));return[k,m?.[1]?.trim()];
 }));
}
assert.deepEqual(palettes.english,palettes.science,"English 9 and Science 9 minimal landings must share the same parchment/charcoal design tokens");
console.log("PASS: Grade 9 English and Science minimal landing consistency: shared parchment palette, Cinzel/Brandon hierarchy, 7px cards, accessible focus, responsive/print rules, official VNV chrome and grade-local learner routes. No learner record schemas changed.");
