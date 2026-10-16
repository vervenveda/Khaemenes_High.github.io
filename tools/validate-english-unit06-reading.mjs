import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const courses=["english-9","english-10","english-11","english-12"];
const weeks=[16,17,18];
const css="courses/shared/daily-instruction.css";
assert(fs.existsSync(css),"Shared parchment CSS missing");
assert(read(css).includes("border-radius:7px"),"Academy radius missing");
let words=0,checked=0,links=0;
for(const course of courses){
 const root="courses/language-arts/"+course+"/";
 const unit=root+"units/unit-06/";
 const doc=unit+"reading-dossier.html";
 const html=read(doc);
 const home=read(unit+"index.html");
 assert(home.includes('id="assigned-reading"'),"Original unit reading removed "+course);
 assert(home.includes('href="reading-dossier.html#week-16"'),"New source entry missing "+course);
 assert(!/<script\b/i.test(html),"Read-only dossier cannot run JS "+course);
 assert(!/localStorage|sessionStorage|setItem\s*\(/.test(html),"Dossier cannot write student records");
 assert(html.includes("fictional"),"Fictional source declaration absent "+course);
 assert(html.includes("Jennifer Kay Pearl")&&html.includes("../../../../shared/daily-instruction.css"));
 assert(/existing|original|official|midterm|portfolio/i.test(html),"Course continuity warning absent");
 const curriculum=JSON.parse(read(root+"curriculum.json"));
 const schedule=curriculum.weekPlans||curriculum.weeks;
 assert(Array.isArray(schedule)&&schedule.length===36,"36-week curriculum unavailable");
 if(course!=="english-9"){
  const sw=read(root+"service-worker.js");
  assert(sw.includes('"./units/unit-06/reading-dossier.html"'),"New dossier not precached "+course);
  assert(sw.includes('"../../shared/daily-instruction.css"'),"Missing offline stylesheet "+course);
 }
 for(const week of weeks){
  const plan=schedule.find(w=>(w.week||w.n)===week);
  assert(plan&&plan.unit===6,"Week "+week+" curricular unit mismatch "+course);
  const weekly=read(root+"weeks/week-"+week+"/index.html");
  const address="../../units/unit-06/reading-dossier.html#week-"+week;
  assert(weekly.includes('href="'+address+'"'),"Weekly deep reading link absent "+course+" "+week);
  const sectionHeader='id="week-'+week+'"';
  const begin=html.indexOf(sectionHeader);
  assert(begin>=0,"Week anchor missing "+course+" "+week);
  const finish=week===18?html.indexOf('<section class="card highlight">',begin):html.indexOf('id="week-'+(week+1)+'"',begin);
  const snippet=html.slice(begin,finish>begin?finish:undefined);
  const passages=[...snippet.matchAll(/<p class="quote">([\s\S]*?)<\/p>/g)].map(m=>m[1]);
  assert(passages.length>=3,"Need at least three reading paragraphs "+course+" "+week);
  const count=passages.join(" ").replace(/<[^>]*>/g," ").split(/\s+/).filter(Boolean).length;
  assert(count>=190,"Original source lacks sufficient reading depth "+course+" "+week+" "+count);
  assert(/Worked/i.test(snippet),"Worked example absent "+course+" "+week);
  assert(/Explicit instruction/.test(snippet),"Teaching absent "+course+" "+week);
  assert(/Misconception check/.test(snippet),"Misconception check missing "+course+" "+week);
  assert(/Reading self-check/.test(snippet)&&/Reveal the model response/.test(snippet),"Unscored feedback missing "+course+" "+week);
  assert(/Teacher guidance/.test(snippet)&&snippet.includes("<ol>"),"Teacher or independent practice missing "+course+" "+week);
  assert(snippet.includes('href="../../weeks/week-'+week+'/index.html"'),"No student record return "+course+" "+week);
  assert(/portfol|evidence|student work|saved work|assess/i.test(weekly),"Weekly record or evidence reference missing");
  count>0&&(words+=count);
  checked++;
 }
 for(const match of html.matchAll(/href="([^"]+)"/g)){
  const href=match[1];if(href.startsWith("#")||/^(?:https?:|mailto:)/i.test(href))continue;
  const resolved=path.resolve(path.dirname(doc),href.split(/[?#]/)[0]);
  assert(fs.existsSync(resolved),"Broken dossier link "+href+" "+course);
  links++;
 }
}
assert.equal(checked,12);
assert(links>=24);
for(const course of courses){
 const home=read("courses/language-arts/"+course+"/units/unit-05/index.html");
 assert(home.includes("reading-dossier.html"),"Preserve upgraded Unit 05 "+course);
}
console.log("PASS: 12 Unit 06 source sets, "+words+" reading words, "+links+" dossier links; 36-week curricular alignment, midterm boundary, offline upper-grade caches, Unit 05 preservation.");
