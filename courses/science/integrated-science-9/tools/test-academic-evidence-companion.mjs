import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const base=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,base),"utf8");
const html=read("academic-evidence-companion.html");
const desk=read("academic-research-desk.html"),portfolio=read("science-evidence-portfolio.html");
for(const field of ["student","date","grade","unit","lesson","subject","question","source1","source2","reliability","terms","connections","investigation","observations","reasoning","reflection","next"])assert(html.includes('name="'+field+'"'),"missing "+field);
for(const word of ["Khaemenes Academy","Parent / Teacher Review","printRecord","exportRecord","clearRecord","@media print","beforeprint","textContent=el.value","window.confirm("])assert(html.includes(word),"missing "+word);
assert(!/localStorage\.|sessionStorage\.|fetch\(/.test(html),"Companion must not persist student data, upload content, or create accounts");
assert(html.includes("academic-research-desk.html")&&html.includes("science-evidence-portfolio.html"));
assert(desk.includes('href="academic-evidence-companion.html"'),"research desk entry missing");
assert(portfolio.includes('href="academic-evidence-companion.html"'),"portfolio entry missing");
const blocks=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
assert.equal(blocks.length,1);
new vm.Script(blocks[0][1],{filename:"academic-evidence-companion.html inline"});
const standard=read("../../shared/ACADEMIC_EVIDENCE_CONVENTION_V1.md");
for(const heading of ["Required printable identity","Sources and citations","Vocabulary","Subject connections","Parent/teacher review","Safe reuse contract"])assert(standard.includes(heading),"missing shared evidence standard section "+heading);
assert(html.includes('href="../../shared/ACADEMIC_EVIDENCE_CONVENTION_V1.md"'),"worksheet missing shared standard link");
assert(desk.includes('href="../../shared/ACADEMIC_EVIDENCE_CONVENTION_V1.md"'),"research desk missing shared standard link");
for(const [course,path] of [
 ["geometry","../../mathematics/geometry/index.html"],
 ["algebra-2","../../mathematics/algebra-2/index.html"],
 ["english-10","../../language-arts/english-10/index.html"],
 ["english-11","../../language-arts/english-11/index.html"],
 ["english-12","../../language-arts/english-12/index.html"]
]){
 const page=read(path);
 assert(page.includes("academic-evidence-companion.html?course="+course),"Missing subject bridge: "+course);
 assert(html.includes('"'+course+'":{grade:'),"Missing course configuration: "+course);
}
assert(html.includes('new URLSearchParams(location.search).get("course")'),"Course context should come from opening link");
assert(html.includes('form.elements.grade.value=selected.grade'),"Grade should follow course context");
assert(html.includes('form.elements.subject.value=selected.subject'),"Subject should follow course context");
console.log("PASS academic evidence companion: standalone, printable, exportable, no storage or grades, connected to research desk and portfolio");
