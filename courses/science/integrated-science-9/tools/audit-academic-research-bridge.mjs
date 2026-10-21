import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const page=fs.readFileSync(path.join(root,"academic-research-desk.html"),"utf8");
const bridge=fs.readFileSync(path.join(root,"academic-network-bridge.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
assert(bridge.includes('"academic-research-desk.html"'),"Academic navigation does not expose research desk");
assert(index.includes('src="academic-network-bridge.js"'),"Science 9 portal does not mount navigation");
assert(page.includes('name="viewport"'),"Missing responsive viewport");
assert(page.includes('aria-live="polite"'),"Missing assistive feedback");
assert(page.includes('navigator.clipboard?.writeText'),"Copy must be user initiated");
assert(!/localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest/.test(page),"Research desk must remain stateless and avoid automatic requests");
for(let n=1;n<=12;n++){const label=String(n).padStart(2,"0");assert(page.includes('"'+label+' · '),"Missing Science Unit "+label)}
for(const href of [
 "https://vervenveda.com/Khaemenes_Linguistics.github.io/apps/dictionarybox_index.html",
 "https://vervenveda.com/Khaemenes_Linguistics.github.io/apps/translator.html",
 "https://vervenveda.com/proresource_hub.github.io/categories/research/",
 "https://vervenveda.com/Arshif.github.io/",
 "../../language-arts/",
 "../../mathematics/"
])assert(page.includes('href="'+href+'"'),"Missing connected resource "+href);
console.log("PASS Science 9 cross-subject academic research desk: 12 topics, trusted routes, no storage/network requests");
