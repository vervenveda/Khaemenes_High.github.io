// Read-only mathematics presentation contract. No student storage or grading changes.
import fs from "node:fs";
import assert from "node:assert/strict";
const shared=fs.readFileSync("assets/math-course-visual-unifier.css","utf8");
const required=["Brandon Grotesque","Cinzel","border-radius:7px",":focus-visible","prefers-reduced-motion","@media print","aria-disabled","min-height:44px"];
for(const item of required)assert.ok(shared.includes(item),"Shared math visual standard missing "+item);
for(const course of ["algebra-1","geometry","algebra-2"]){
 const path="courses/mathematics/"+course+"/assets/styles.css";
 const css=fs.readFileSync(path,"utf8");
 if(course==="algebra-1")
  assert.match(css,/@import\s+url\(["']\.\.\/\.\.\/\.\.\/\.\.\/assets\/math-course-visual-unifier\.css(?:\?[^"']*)?["']\)/,"Algebra I missing shared design import");
 else {
  for(const token of ['html[data-theme="light"]',":focus-visible"])
   assert.ok(css.includes(token),course+" must retain its own theme-aware responsive presentation: "+token);
  assert.match(css,/@media[^{}]*\(\s*max-width\s*:\s*320px\s*\)/,course+" must retain narrow-screen layout");
 }
 assert.match(css,/@media\s+print/,course+" missing print contract");
}
const doc=fs.readFileSync("assets/MATHEMATICS-DESIGN-STANDARD.md","utf8");
assert.ok(doc.includes("Pre-Algebra")&&doc.includes("Geometry")&&doc.includes("Algebra II"),"Design standard must describe the cross-course intent");
console.log("PASS shared mathematics design: typography, print, focus, motion, 44px controls and three course visual contracts.");