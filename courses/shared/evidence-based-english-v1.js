/* Khaemenes Academy English 9–12 · Evidence-Based Learning Architecture v1
   Progressive enhancement only. Existing curriculum, assessment, storage and mastery
   authority remain untouched. */
(()=>{"use strict";
if(window.__KHAE_ENGLISH_EVIDENCE_V1__)return;
window.__KHAE_ENGLISH_EVIDENCE_V1__=true;
const path=String(location.pathname||"");
const cm=path.match(/\/courses\/language-arts\/english-(9|10|11|12)\//i);
const wm=path.match(/\/weeks\/week-(\d+)\//i);
const um=path.match(/\/units\/unit-(\d+)\//i);
if(!cm||(!wm&&!um))return;
const grade=Number(cm[1]),week=wm?Number(wm[1]):null,unit=um?Number(um[1]):null;
document.documentElement.dataset.khaeEnglishEvidence="v1";
document.documentElement.dataset.khaeEnglishEvidenceGrade=String(grade);

const scaffold={
9:{
 intro:"A stable five-step rhythm keeps attention on the learning rather than the page. Grade 9 uses explicit prompts while you build independent scholarly habits.",
 recall:"Before opening notes, write two ideas you remember, one connection to earlier learning, and one question or uncertainty.",
 monday:"Before instruction, answer the week's essential question from what you already know. A partial or uncertain answer is useful—it creates a target for learning.",
 exit:"Close your notes. In 2–4 sentences, explain today's central idea and one piece of evidence or reasoning that supports it. Reopen your notes, check yourself, and correct one point if needed."
},
10:{
 intro:"The same learning rhythm remains stable while guidance begins to fade. You will retrieve, study a model, practice, transfer, and reflect.",
 recall:"Without notes, retrieve three relevant ideas from earlier learning. Then identify which one is most useful for today's task and why.",
 monday:"Before instruction, attempt the essential question and identify one feature, term, or idea you expect will matter. Check that prediction after the lesson.",
 exit:"Close your notes. State the strongest idea you learned, explain how you applied it, and name one correction or next question. Then verify against your work."
},
11:{
 intro:"Grade 11 keeps the evidence-based cycle but expects more strategic choice: select evidence, compare interpretations, explain decisions, and evaluate your method.",
 recall:"Without notes, reconstruct one prior claim, one supporting piece of evidence, and one unresolved question. Connect at least one to today's objective.",
 monday:"Before instruction, make a provisional response to the essential question and identify the assumption or knowledge gap most likely to affect your interpretation.",
 exit:"Without notes, reconstruct today's line of reasoning. Name the evidence that mattered most, one plausible counterreading or limitation, and the next strategic move."
},
12:{
 intro:"The cycle stays stable while the learner assumes senior-level control. Scaffolds are optional; independent goal-setting, evidence choice, uncertainty, and revision are expected.",
 recall:"Before opening notes, reconstruct the most relevant prior line of reasoning. Identify what you can defend, what remains uncertain, and what today's work should test.",
 monday:"Set a provisional position or research expectation before instruction. State what evidence could confirm, complicate, or overturn it.",
 exit:"Close all sources. Reconstruct the argument or method you can now defend, identify its strongest evidence and most important limitation, then set the next independent target."
}
}[grade];

function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function cycle(){
 if(week===null||document.querySelector(".khae-learning-cycle"))return;
 const host=document.querySelector("main");
 if(!host)return;
 const sec=el("section","khae-learning-cycle");
 sec.setAttribute("aria-label","Evidence-based learning cycle");
 sec.append(el("p","khae-cycle-kicker","Khaemenes Academy · Evidence-Based Learning Cycle"));
 sec.append(el("h2","", "Recall → Model → Practice → Apply → Reflect"));
 sec.append(el("p","",scaffold.intro));
 const grid=el("div","khae-cycle-grid");
 [
  ["Recall","retrieve before looking"],
  ["Model","study expert reasoning"],
  ["Practice","try it with support"],
  ["Apply","transfer independently"],
  ["Reflect","correct and plan"]
 ].forEach(([a,b])=>{const c=el("div","khae-cycle-step");c.append(el("strong","",a),el("small","",b));grid.append(c)});
 sec.append(grid);
 const quick=document.querySelector("main .quick-nav,.quick-nav");
 if(quick?.parentNode===host)quick.insertAdjacentElement("afterend",sec);
 else host.prepend(sec);
}
function stageLabel(root){
 root.querySelectorAll("h3").forEach(h=>{
  const t=(h.textContent||"").trim().toLowerCase();
  let s="";
  if(/mini-lesson|direct instruction|model|mentor/.test(t))s="model";
  else if(/guided practice|guided/.test(t))s="practice";
  else if(/independent work|independent practice|application|transfer/.test(t))s="apply";
  else if(/evidence to preserve|evidence|artifact/.test(t))s="evidence";
  if(s)h.dataset.khaeStage=s;
 });
 root.querySelectorAll(".step").forEach(box=>{
  const t=(box.querySelector("strong")?.textContent||"").trim().toLowerCase();
  if(/direct instruction|model/.test(t))box.dataset.khaeStage="model";
  else if(/guided/.test(t))box.dataset.khaeStage="practice";
  else if(/independent/.test(t))box.dataset.khaeStage="apply";
 });
}
function dayNumber(article,index){
 const id=String(article.id||"").toLowerCase();
 if(id==="monday"||/day-(?:0?1|\d*1\b)/.test(id)||index===0)return "monday";
 return "other";
}
function hasSpecializedUnitLayer(){
 const p=String(location.pathname||"").toLowerCase();
 return /\/english-9\/weeks\/week-0[123]\//.test(p) || /\/english-10\/weeks\/week-0[123]\//.test(p) || /\/english-11\/weeks\/week-0[123]\//.test(p) || /\/english-12\/weeks\/week-0[123]\//.test(p);
}
function addPrompts(article,index){
 if(hasSpecializedUnitLayer())return;
 if(article.querySelector(".khae-retrieval-card"))return;
 const retrieval=el("aside","khae-retrieval-card");
 retrieval.setAttribute("aria-label","Retrieval before lesson");
 retrieval.append(el("strong","",index===0?"RETRIEVE · Start before looking":"RETRIEVE · Recall before looking"));
 retrieval.append(el("p","",dayNumber(article,index)==="monday"?scaffold.monday:scaffold.recall));
 const firstHeading=article.querySelector("h2");
 const objective=[...article.children].find(n=>n.tagName==="P"&&/objective:/i.test(n.textContent||""));
 (objective||firstHeading)?.insertAdjacentElement("afterend",retrieval);

 const exit=el("aside","khae-exit-card");
 exit.setAttribute("aria-label","Exit retrieval");
 exit.append(el("strong","", "EXIT · Retrieve, check, correct"));
 exit.append(el("p","",scaffold.exit));
 const toolbar=article.querySelector(":scope > .lesson-toolbar,:scope > .actions,:scope > .workspace:last-child");
 if(toolbar)toolbar.insertAdjacentElement("beforebegin",exit);else article.append(exit);
}
function unitArchitecture(){
 if(!unit||week!==null||document.querySelector(".khae-unit-architecture"))return;
 const main=document.querySelector("main");if(!main)return;
 const section=el("section","khae-learning-cycle khae-unit-architecture");
 section.setAttribute("aria-label","Unit learning architecture");
 section.append(el("p","khae-cycle-kicker","Khaemenes Academy · Unit Learning Architecture"));
 section.append(el("h2","", "Build → Retrieve → Transfer → Demonstrate"));
 const copy={
  9:"Build the skill with explicit models, retrieve it after delays, transfer it to unfamiliar texts, and preserve evidence for evaluator review.",
  10:"Develop analysis through modeled strategy, cumulative retrieval, comparison and increasingly independent transfer.",
  11:"Use retrieval and deliberate practice to connect interpretation, rhetoric, synthesis, discussion and research across the unit.",
  12:"Use cumulative retrieval, independent strategy choice, critical evaluation and transfer to produce senior-level evidence."
 }[grade];
 section.append(el("p","",copy));
 const grid=el("div","khae-cycle-grid");
 [["Build","model + guided practice"],["Retrieve","bring prior learning forward"],["Transfer","apply to unfamiliar material"],["Demonstrate","produce evidence of mastery"]].forEach(([a,b])=>{const n=el("div","khae-cycle-step");n.append(el("strong","",a),el("small","",b));grid.append(n)});
 section.append(grid);
 const quick=main.querySelector(".quick-nav");
 if(quick)quick.insertAdjacentElement("afterend",section);else main.prepend(section);
}
function enhance(){
 unitArchitecture();
 cycle();
 let lessons=[...document.querySelectorAll("article.lesson-day")];
 if(!lessons.length)lessons=[...document.querySelectorAll("article.lesson")].filter(a=>/day|lesson|required/i.test((a.id||"")+" "+(a.querySelector(".eyebrow")?.textContent||"")));
 lessons.forEach((a,i)=>{a.dataset.khaeEvidenceDay=String(i+1);stageLabel(a);addPrompts(a,i)});
 const main=document.querySelector("main");if(main&&week!==null)main.dataset.khaeEvidenceWeek=String(week);if(main&&unit!==null)main.dataset.khaeEvidenceUnit=String(unit);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance,{once:true});else enhance();
})();
