import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const dir="courses/language-arts";
const text=p=>fs.readFileSync(p,"utf8");
const days=["monday","tuesday","wednesday","thursday","friday"];
const courses=[
 {slug:"english-10",global:"ELA10_COURSE",anchor:"A Route Drawn in Blue"},
 {slug:"english-11",global:"ENGLISH_11_CURRICULUM",anchor:"A Margin Full of Questions"},
 {slug:"english-12",global:"ENGLISH_12_CURRICULUM",anchor:"A Label Revised in Pencil"}
];
function checkReference(file,ref){
 const [relative,hash]=ref.split("#"),full=path.resolve(path.dirname(file),relative||path.basename(file));
 assert(fs.existsSync(full),"Broken local route "+ref+" in "+file);
 if(hash) assert(text(full).includes('id="'+hash+'"'),"Missing target #"+hash+" in "+full);
}
let pairedTexts=0,daysLinked=0,localLinks=0;
for(const course of courses){
 const root=dir+"/"+course.slug;
 const j=JSON.parse(text(root+"/curriculum.json"));
 const js=text(root+"/assets/curriculum-data.js");
 assert(js.startsWith("window."+course.global+" = "),course.slug+" unexpected course manifest variable");
 const runtime=JSON.parse(js.slice(js.indexOf("=")+1).trim().replace(/;\s*$/,""));
 assert.equal(j.weeksCount,36);assert.equal(j.unitsCount,12);
 assert.equal(j.weeks.length,36);assert.equal(runtime.weeks.length,36);
 assert.equal(j.units.length,12);
 assert.deepEqual(j.weeks[1],runtime.weeks[1],course.slug+" Week 02 manifest/runtime divergence");
 assert.equal(j.weeks[1].lessons.length,5);
 assert.equal(j.weeks[1].quiz.length,5,"Existing weekly assessment should remain present");
 assert(j.weeks[1].reading.includes(course.anchor),course.slug+" reading not declared in canonical curriculum");
 assert(j.weeks[1].reading.includes("fiction"),course.slug+" fictional texts require accurate source labeling");
 const dossier=root+"/weeks/week-02/reading-dossier.html";
 const weekly=root+"/weeks/week-02/index.html";
 const unit=root+"/units/unit-01/index.html";
 const dossierHtml=text(dossier),weeklyHtml=text(weekly),unitHtml=text(unit);
 assert(unitHtml.includes('id="assigned-reading"'),"Unit required-reading anchor missing");
 assert(unitHtml.includes('href="../../weeks/week-02/reading-dossier.html"'),"Unit reading assignment must open dossier");
 assert(weeklyHtml.includes('href="reading-dossier.html"'),"Weekly classroom must have global paired-reading link");
 for(const target of ["text-a","text-b","day-1","day-2","day-3","day-4","day-5"]){
  assert(dossierHtml.includes('id="'+target+'"'),course.slug+" dossier missing "+target);
 }
 const textA=dossierHtml.split('id="text-a"')[1]?.split('id="text-b"')[0]||"";
 const textB=dossierHtml.split('id="text-b"')[1]?.split("</section>")[0]||"";
 assert(/<h2>(?:Model:|Teacher-modeled|Worked)/i.test(dossierHtml),course.slug+" lacks an explicit worked model");
 const wordCount=s=>s.replace(/<[^>]+>/g," ").replace(/&[^;]+;/g," ").trim().split(/\s+/).length;
 assert(wordCount(textA)>300,course.slug+" sustained story too short");
 assert(wordCount(textB)>150,course.slug+" source packet too short");
 pairedTexts+=2;
 for(let i=0;i<5;i++){
  const day=days[i];
  assert(weeklyHtml.includes('id="'+day+'"'),course.slug+" day "+day+" replaced");
  assert(weeklyHtml.includes('href="reading-dossier.html#day-'+(i+1)+'"'),course.slug+" missing "+day+" reading pathway");
  assert(dossierHtml.includes('href="index.html#'+day+'"'),course.slug+" lost saved-work return");
  assert(weeklyHtml.includes('data-week-day="'+day[0].toUpperCase()+day.slice(1)+'"'),course.slug+" lesson checkbox removed");
  daysLinked++;
 }
 assert(weeklyHtml.includes('id="quiz"')&&weeklyHtml.includes('id="reflection"'),course.slug+" assessment/portfolio anchors removed");
 assert(!/<script\b/i.test(dossierHtml),"Read-only dossier must not run assessment or storage scripts");
 assert(!/localStorage|sessionStorage|setItem\s*\(/i.test(dossierHtml),"Read-only dossier must not write learner state");
 assert(/fictional|fiction/i.test(dossierHtml),"Practice material must clearly identify fictional status");
 assert(dossierHtml.includes("Jennifer Kay Pearl"));
 const routes=[...dossierHtml.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
 for(const href of routes){
  if(href.startsWith("#")||/^(https?:|mailto:|data:)/i.test(href))continue;
  checkReference(dossier,href);
  localLinks++;
 }
}
const grade9=dir+"/english-9";
const lower=JSON.parse(text(grade9+"/curriculum.json"));
assert.equal(lower.weeks,36);assert.equal(lower.weekPlans.length,36);
assert.equal(lower.units.length,12);
const week9=text(grade9+"/weeks/week-02/index.html");
assert(week9.includes('href="day-06/index.html"')&&week9.includes('href="day-10/index.html"'),
 "English 9's already isolated Week 02 daily lessons must be retained");
assert(text(grade9+"/units/unit-01/index.html").includes('id="assigned-reading"'),
 "English 9 unit reading preserved");
assert.equal(pairedTexts,6);assert.equal(daysLinked,15);
console.log("PASS: three grade-differentiated paired dossiers, "+pairedTexts+
 " substantive texts, "+daysLinked+" daily reading/workspace bridges, "+
 localLinks+" working local links, manifest/runtime parity, and original English 9 studios preserved.");
