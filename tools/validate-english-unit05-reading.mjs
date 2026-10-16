import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const source=p=>fs.readFileSync(p,"utf8");
const courses=["english-9","english-10","english-11","english-12"];
const weeks=[13,14,15];
let verifiedLinks=0,passages=0;
const css="courses/shared/daily-instruction.css";
assert(fs.existsSync(css),"Shared parchment CSS missing");
assert(source(css).includes("border-radius:7px"),"Expected seven-pixel Academy radius");
for(const course of courses){
 const root="courses/language-arts/"+course+"/";
 const dossier=root+"units/unit-05/reading-dossier.html";
 const unit=root+"units/unit-05/index.html";
 const html=source(dossier),unitHtml=source(unit);
 assert(unitHtml.includes('id="assigned-reading"'),course+" original assigned reading missing");
 assert(unitHtml.includes('href="reading-dossier.html#week-13"'),course+" unit entry missing");
 assert(!/<script\b/i.test(html),"Dossier must be read-only: "+dossier);
 assert(!/localStorage|sessionStorage|setItem\s*\(/.test(html),"Dossier must not change learner records");
 assert(html.includes("Jennifer Kay Pearl")&&html.includes("../../../../shared/daily-instruction.css"));
 const raw=JSON.parse(source(root+"curriculum.json"));
 const schedule=raw.weekPlans||raw.weeks;
 for(const week of weeks){
  const match=schedule.find(w=>(w.week||w.n)===week);
  assert.equal(match.unit,5,course+" week "+week+" not Unit 05 in canonical curriculum");
  const weekly=root+"weeks/week-"+String(week).padStart(2,"0")+"/index.html";
  const page=source(weekly);
  const linked="../../units/unit-05/reading-dossier.html#week-"+week;
  assert(page.includes('href="'+linked+'"'),course+" Week "+week+" missing reading link");
  assert(page.includes("Save")||page.includes("save")||page.includes("portfolio")||page.includes("Portfolio"),course+" weekly record bridge absent");
  assert(html.includes('id="week-'+week+'"'),course+" dossier anchor missing");
  const start=html.indexOf('id="week-'+week+'"');
  const end=week===15?html.indexOf("<section class=\"card\"><h2>Unit synthesis",start):
   html.indexOf('id="week-'+(week+1)+'"',start);
  const section=html.slice(start,end>start?end:undefined);
  const quoted=[...section.matchAll(/<p class="quote">([\s\S]*?)<\/p>/g)].map(m=>m[1]);
  assert(quoted.length>=3,course+" Week "+week+" needs substantial multi-paragraph text");
  const tokens=quoted.join(" ").replace(/<[^>]*>/g," ").split(/\s+/).filter(Boolean);
  assert(tokens.length>=190,course+" Week "+week+" too brief: "+tokens.length);
  assert(section.includes("Worked")||section.includes("worked"),course+" Week "+week+" needs model");
  assert(section.includes("<ol>")&&section.includes("Teacher"),course+" Week "+week+" practice and teacher notes");
  const wkReturn='../../weeks/week-'+week+'/index.html';
  assert(section.includes('href="'+wkReturn+'"'),course+" Week "+week+" learning record return missing");
  passages++;
 }
 for(const link of html.matchAll(/href="([^"]+)"/g)){
  const href=link[1];
  if(href.startsWith("#")||/^(?:https?:|mailto:)/.test(href))continue;
  const real=path.resolve(path.dirname(dossier),href.split("#")[0].split("?")[0]);
  assert(fs.existsSync(real),"Broken dossier link "+href+" on "+dossier);
  verifiedLinks++;
 }
}
assert.equal(passages,12);
assert(verifiedLinks>=20);
console.log("PASS: "+passages+" aligned reading passages across all four English grades; "+verifiedLinks+" dossier links; canonical Week 13–15 Unit 05 progression; existing student records preserved.");
