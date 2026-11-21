import fs from "node:fs"; import assert from "node:assert/strict";
const checks=[["pre-algebra",97],["algebra-1",87]];
for(const [course,count] of checks){
 const map=JSON.parse(fs.readFileSync("courses/mathematics/"+course+"/course-map-v2.json","utf8"));
 assert.equal(map.course.lesson_count,count,course+" declared lesson count");
 const lessons=(map.units||[]).flatMap(u=>u.lessons||[]);
 assert.equal(lessons.length,count,course+" mapped lesson count");
 const ids=new Set();
 for(const l of lessons){
   assert(/^u\d{2}-l\d{2}$/.test(l.id),course+" malformed lesson id "+l.id);
   assert(!ids.has(l.id),course+" duplicate lesson id "+l.id); ids.add(l.id);
   assert(l.title_authority==="source-file-h1",course+" title authority drift");
   assert(fs.existsSync("courses/mathematics/"+course+"/"+l.source_path),course+" missing source "+l.source_path);
 }
}
console.log("PASS early mathematics map normalization: Pre-Algebra 97 and Algebra I 87 canonical lesson IDs/source paths.");
