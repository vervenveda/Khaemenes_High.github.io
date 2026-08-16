(() => {
"use strict";
APP.passingTarget=80;
const RESOURCE={
  arshif:["ARSHIF","https://vervenveda.github.io/Arshif.github.io/","Use archival and cultural material to deepen historical context."],
  verifier:["The Verifier","https://vervenveda.github.io/theverifier.github.io/","Compare claims, sources, framing, and corroboration."],
  evidence:["Evidence & Citation Studio","https://vervenveda.github.io/proresource_hub.github.io/Protools/Evidence_Citation_Studio/","Track provenance, quotations, paraphrases, and citations."],
  plera:["PLERA Search Gate","https://vervenveda.github.io/proresource_hub.github.io/Protools/PLERA%E2%84%A2%20Search%20Gate_index.html","Locate research and primary-source destinations."],
  finance:["Finance Hall","https://vervenveda.github.io/finance.github.io/","Extend economic, trade, labor, and development analysis."]
};
function selectResources(w){
  const text=(w.title+" "+(w.unit||"")+" "+(w.domain||"")).toLowerCase(),keys=["arshif","evidence"];
  if(/econom|trade|market|industry|labor|finance/.test(text))keys.push("finance");
  else if(/modern|media|civic|government|cold war|global|current/.test(text))keys.push("verifier");
  else keys.push("plera");
  return keys;
}
const ROLES=[
  ["Inquiry Launch","Frame the week's historical problem, establish chronology/geography, and identify what evidence would be needed for a defensible answer.","Create a prior-knowledge ledger separating known fact, inference, question, and uncertainty."],
  ["Source & Corroboration Lab","Interrogate primary/secondary evidence through authorship, context, audience, purpose, proximity, corroboration, and limitation.","Analyze at least two evidence pieces and record one agreement, one tension, and one missing perspective."],
  ["Map, Data & Comparison Studio","Use spatial, quantitative, chronological, institutional, or comparative evidence appropriate to the week's topic.","Produce a labeled map/table/timeline/data product and state one inference plus one limitation."],
  ["Argument, Counterclaim & Seminar","Construct an interpretation, test it against competing evidence or perspectives, and revise reasoning after challenge.","Write a claim with evidence, reasoning, qualification/counterclaim, and one revision note."],
  ["Synthesis & Portfolio","Transfer the week's historical reasoning into a distinct synthesis product and prepare for mastery assessment.","Create a concise evidence-backed synthesis, correct misconceptions, and preserve a portfolio artifact."]
];
for(const w of APP.weeks){
  if(!Array.isArray(w.lessons))continue;
  w.lessons=w.lessons.map((l,i)=>{
    const role=ROLES[i]||ROLES[4],topic=w.title||("Week "+w.week);
    return {...l,title:role[0]+" · "+topic,objective:i===0?"Frame a defensible inquiry about "+topic+" using chronology, geography, and evidence needs.":i===1?"Evaluate evidence about "+topic+" through sourcing and corroboration.":i===2?"Interpret spatial, quantitative, chronological, or comparative evidence about "+topic+".":i===3?"Construct and revise an evidence-based interpretation of "+topic+".":"Synthesize the week's evidence into a transferable historical argument.",warmup:i===0?"Without notes, record what you think you know about "+topic+" and mark each entry fact, inference, or question.":"Retrieve one evidence point from the prior lesson and explain why it matters to "+topic+".",lesson:role[1],assignment:role[2],evidence:i===0?"Inquiry ledger, chronology/geography frame, questions":i===1?"Source analysis, provenance, corroboration, missing perspective":i===2?"Map/data/comparison artifact with inference and limitation":i===3?"Claim, evidence, reasoning, counterclaim, revision":"Topic-specific synthesis product, reflection, portfolio evidence"};
  });
  w.forensicResources=selectResources(w);
}
function toolsFor(w){
  const keys=w.forensicResources||[];
  if(!keys.length)return "";
  const links=keys.map(k=>{const x=RESOURCE[k];return '<a class="button secondary" href="'+x[1]+'" target="_blank" rel="noopener noreferrer" title="'+x[2]+'">'+x[0]+'</a>'}).join("");
  const notes=keys.map(k=>{const x=RESOURCE[k];return '<li><b>'+x[0]+':</b> '+x[2]+'</li>'}).join("");
  return '<div class="card" data-forensic-tools><h3>Purposeful Tools · Week '+w.week+'</h3><p class="small">Use these only for the stated learning purpose. They do not replace lesson evidence or the formal mastery check.</p><div class="actions">'+links+'</div><ul>'+notes+'</ul></div>';
}
const priorWeek=week;
week=function(){priorWeek();const w=APP.weeks.find(x=>x.week===wk),host=document.getElementById("content");if(w&&host&&!host.querySelector("[data-forensic-tools]"))host.insertAdjacentHTML("beforeend",toolsFor(w))};
window.__KHAEMENES_GLOBAL9_FORENSIC__={version:"2026-08-16",weeks:APP.weeks.length};
render();
})();