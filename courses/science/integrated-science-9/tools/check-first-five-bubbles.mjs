// Grade 9 Science first-five-bubbles structural regression checks.
// Run: node courses/science/integrated-science-9/tools/check-first-five-bubbles.mjs
import fs from "node:fs";
import assert from "node:assert/strict";
const root=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),"utf8");
const portal=read("index.html"),day1=read("units/unit-01/lessons/day-01.html"),day5=read("units/unit-02/lessons/day-05.html"),vocab=read("science-vocabulary-integration.js"),studio=read("units/unit-01/question-evidence-studio.html"),controller=read("units/unit-01/unit01.js");
assert(!portal.includes("min-width:300px"),"Portal still forces 300px minimum width");
assert(portal.includes("@media(max-width:300px)"),"255px stress rules missing");
assert(!portal.includes('</script>\\n<script'),"Literal script boundary artifact remains");
assert(day1.includes('question-evidence-studio.html'),"Original inquiry studio not linked");
assert(day1.includes('science-vocabulary-integration.js') && day5.includes('science-vocabulary-integration.js'),"Vocabulary integration missing");
assert(vocab.includes("u01d01:") && vocab.includes("u02d05:"),"Lesson-specific vocabulary missing");
assert(studio.includes("formative only") || studio.includes("formative"),"Studio must not impersonate mastery");
assert(controller.includes("function unitComplete(){return REQUIREMENTS.every(requirementComplete)}"),"Unit 01 verified mastery requirements changed");
assert(controller.includes("scienceConflict"),"Unit 01 concurrent save guard missing");
for(let i=5;i<=12;i++){
 const n=String(i).padStart(2,"0");
 const source=read("units/unit-"+n+"/unit"+n+".js");
 assert(source.includes('sessionStorage.getItem("kh_sci9_u04_active_learner_v1")'),"Unit "+n+" must read common learner selection");
 assert(source.includes('sessionStorage.setItem("kh_sci9_u04_active_learner_v1",id)'),"Unit "+n+" must publish common learner selection");
 assert(source.includes('KhaemenesCourseEntryContract?.readAcademyProfile?.()'),"Unit "+n+" must reject Academy identity mismatch");
}
for(let i=5;i<=12;i++){
 const n=String(i).padStart(2,"0");
 const source=read("units/unit-"+n+"/unit"+n+".js");
 assert(source.includes("function verifiedScore(item)"),"Unit "+n+" must validate scored mastery");
 assert(source.includes("score/total>=0.8"),"Unit "+n+" must enforce 80%");
 assert(source.includes("return verifiedScore(state[id])"),"Unit "+n+" must not trust passed flags alone");
 assert(source.includes("if(!window.KhaemenesScienceU"+n+"Scope.active())"),"Unit "+n+" must require selected learner before saving/sync");
}

const printModule=read("science-print-evidence.js"), printStyle=read("course-ui.css");
assert(printModule.includes("science-evidence-heading") && printModule.includes("Student name:"), "Shared printable identification missing");
assert(printStyle.includes(".science-evidence-heading"),"Shared print CSS missing");
for(let i=1;i<=12;i++){
 const n=String(i).padStart(2,"0");
 const controller=read("units/unit-"+n+"/unit"+n+".js");
 assert(controller.includes('new URL("../../science-print-evidence.js"'),"Unit "+n+" lacks shared print module");
}
const explore=read("units/unit-02/exploration-studio.js");
for(const page of ["virtual-microscopy.html","cell-model-gallery.html","membrane-transport-lab.html"]){
 const src=read("units/unit-02/"+page);
 assert(src.includes('src="exploration-studio.js"'),"Unit 02 activity missing exploration script: "+page);
}
assert(explore.includes('id="magFactor"')&&explore.includes('id="outsideSolute"'),"Unit 02 interactive controls missing");
assert(explore.includes('host.insertBefore(printHeading'),"Printable student heading must lead evidence form");
assert(explore.includes("not a validated biological prediction"),"Model limitation notice missing");
assert(!explore.includes("localStorage.setItem"),"Exploration must not overwrite scored student records");
const formative=read("science-formative-evidence.js");
for(const token of ["kh_sci9_formative_v1:","r.learner!==id","r.activity!==activity","schema:\"khaemenes-science-formative-v1\"","Save notes locally","Export restorable JSON"]){assert(formative.includes(token),"Formative evidence contract missing "+token)}
assert(!formative.includes("completedUnits"),"Formative recovery must not touch course mastery");
const portfolioJs=read("science-evidence-portfolio.js");
const portfolioHtml=read("science-evidence-portfolio.html");
for(const guard of ['record.learner!==id','key!==prefix+record.activity','clearOnLearnerChange(id)','window.addEventListener("focus"','window.addEventListener("pageshow"'])assert(portfolioJs.includes(guard),"Portfolio learner isolation guard missing: "+guard);
for(const label of ["Parent / Teacher Review","Reviewer signature","Next learning goals"])assert(portfolioHtml.includes(label),"Portfolio review missing: "+label);
for(const guard of ["setupRestore(id)","data.learner!==id","seen.has(record.activity)","candidate.missing","localStorage.getItem(key)!==null","window.confirm("])assert(portfolioJs.includes(guard),"Portfolio safe restore guard missing: "+guard);
console.log("PASS: Science 9 learner bridge, scored mastery, and twelve-unit print evidence checks.");
