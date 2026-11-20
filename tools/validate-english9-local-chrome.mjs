import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const html=fs.readFileSync(path.join(root,"courses/language-arts/english-9/index.html"),"utf8");
for(const file of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-class-tools-toolbar.js","vnv-ecosystem-toolbar.js"]){
 assert.equal(html.split(file).length-1,1,"canonical VNV loader is singular: "+file);
}
assert.ok(!html.includes('data-vervenveda-parchment'),"global parchment style no longer overrides the English 9 button labels");
assert.ok(!html.includes('data-grade09-consistency'),"redundant grade-nine subject style absent from English 9 landing");
assert.ok(!html.includes('data-high-navigation-css'),"legacy local navigation CSS no longer competes with canonical header");
assert.ok(html.includes('id="khaemenes-english9-canonical-css-v2"'),"canonical English 9 CSS owner retained");
assert.ok(html.includes('data-grade09-canonical-chrome="true"'),"local fallback menu will not create a competing hamburger");
assert.match(html,/body\[data-english9-require-entry\][\s\S]{0,260}display:block!important/, "document cannot be vertically centered or shrunk");
assert.match(html,/html body\[data-english9-require-entry\] > \.app[\s\S]{0,130}margin-top:0!important/, "course shell starts at top, after official tickers");
assert.match(html,/\.english9-primary-navigation>\.navBtn\s*\{[\s\S]{0,200}color:#fffdf5!important/, "primary action labels are ivory on charcoal");
assert.match(html,/color:#fffdf5!important;[\s\S]{0,100}border-radius:7px!important/, "dark buttons have contrasting cream labels and 7px radius");
assert.match(html,/text-align:center!important;[\s\S]{0,100}justify-content:center!important/, "button labels remain centered");
for(const required of ["English 9 · Language Arts","APP.weeks","high-school-english-continuation.js","assessments/diagnostic/"]){
 assert.ok(html.includes(required),"preserve curriculum and navigation authority "+required);
}
console.log("ENGLISH 9 LOCAL CHROME: PASS (single VNV owners, top-level placement, centered contrast controls, untouched curriculum).");
