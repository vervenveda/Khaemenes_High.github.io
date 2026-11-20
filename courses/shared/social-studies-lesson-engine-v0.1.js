/* Khaemenes Social Studies Engine v0.1. Instructional scaffolding only.
 * Existing course controls own persistence, evidence, grading, assessment and mastery. */
(function(){
"use strict";
if(window.KhaemenesSocialStudiesLessonEngineV01)return;
const CURRICULUM=Object.freeze({
"9":{course:"Global Studies Honors",focus:"Historical Inquiry & Source Laboratory",mission:"How We Know the Past",question:"How can we build a trustworthy account when evidence is incomplete or disputed?",steps:[["Frame the inquiry","Separate recorded observation, reported information, inference and historical claim.",1,"read"],["Source and contextualize","Who created each record, when, why and for whom?",2,"read"],["Corroborate and map","Compare independent sources and locate geographic limitations.",3,"practice"],["Argue from evidence","Support a claim, answer a counterclaim, and acknowledge uncertainty.",4,"write"],["Revise and retrieve","Revisit your initial evidence ledger and complete the original weekly check.",5,"check"]]},
"10":{course:"United States History Honors",focus:"Historical Evidence, Timeline & Geography Studio",mission:"History, Memory, and the American Story",question:"How should historians construct a national history when evidence, memory, and identity do not always agree?",steps:[["Frame historical inquiry","Place the case in chronological and geographic context."],["Source and corroborate","Compare Indigenous oral tradition, archaeological evidence and a sixteenth-century European map."],["Map and measure","Interpret spatial evidence and the uncertainty of population estimates."],["Deliberate and argue","Compare interpretations, defend a claim and address counterevidence."],["Synthesize and correct","Use the original weekly quiz and correction tasks."]]},
"11":{course:"Government, Law & Economics Honors",focus:"Constitutional Case & Public Policy Studio",mission:"Civic Inquiry and Constitutional Citizenship",question:"What habits allow citizens to investigate public questions without surrendering accuracy, independence, or respect?",steps:[["Frame civic inquiry","Separate public claims from evidence and normative judgments."],["Audit source authority","Examine public records and constitutional claims without partisan shortcuts."],["Model and measure","Build a claim, source, evidence, limitation and corroboration table."],["Deliberate and reason","Offer a fair counterclaim and defensible position."],["Assess and transfer","Return to original assignments, seminar and course mastery."]]},
"12":{course:"Global Politics, International Relations & Senior Research Honors",focus:"Comparative Research & Diplomatic Analysis Studio",mission:"Senior Inquiry and the Social Sciences",question:"How can a senior distinguish a defensible social-science conclusion from an opinion, slogan, or unsupported prediction?",steps:[["Frame comparative inquiry","Distinguish factual, causal, legal and normative questions."],["Evaluate authority","Compare constitutions, UN development data, election records and public-opinion evidence."],["Compare cases and data","Identify methods, limits, context and alternative interpretations."],["Develop and defend","Construct an appropriately qualified senior argument."],["Correct and prepare capstone","Use original senior mastery, corrections and research-integrity requirements."]]}
});
const CSS=".khae-ss-engine{width:min(100%,980px);margin:20px auto;padding:20px;border:1px solid #b3a080;border-radius:7px;background:#fffcf5;color:#26332d;box-sizing:border-box;font:400 16px/1.65 Nunito,Arial,sans-serif}\n.khae-ss-engine *{box-sizing:border-box}.khae-ss-engine h2{font:400 clamp(24px,3vw,33px)/1.3 Cinzel,Georgia,serif;text-align:center;color:#26332d;margin:8px auto 12px}.khae-ss-engine p,.khae-ss-engine label{font:400 16px/1.65 Nunito,Arial,sans-serif;color:#34443b}.khae-ss-engine .ss-kicker{font-size:14px;color:#67471c;text-align:center;letter-spacing:.05em}.khae-ss-engine .ss-inquiry-question{text-align:center;max-width:760px;margin:0 auto 14px}.khae-ss-engine .ss-step-list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin:16px 0}.khae-ss-engine button{min-height:46px;padding:9px 12px;background:#293c33;color:#fff8e9;border:1px solid #576e5b;border-radius:7px;cursor:pointer;font:400 16px/1.4 Nunito,Arial,sans-serif}.khae-ss-engine .ss-step-list button{min-width:0}.khae-ss-engine button[aria-current=\"step\"]{background:#b68a46;border-color:#8b692e;color:#202724}.khae-ss-engine button:focus-visible,.khae-ss-engine textarea:focus-visible{outline:3px solid #ad8341;outline-offset:3px}.khae-ss-engine .ss-guide{padding:15px;border:1px solid #c7bba4;border-radius:7px;background:#f6f1e6}.khae-ss-engine .ss-guide strong{display:block;font:400 20px/1.4 Cinzel,Georgia,serif;color:#26332d}.khae-ss-engine .ss-tool{margin:14px 0;border:1px solid #c7bba4;border-radius:7px;background:#fffdf9}.khae-ss-engine .ss-tool>summary{padding:13px 16px;cursor:pointer;font:400 16px/1.5 Nunito,Arial,sans-serif;color:#26332d;min-height:48px}.khae-ss-engine .ss-tool>div{padding:12px 16px 18px}.khae-ss-engine .ss-tool label{display:block;margin:12px 0}.khae-ss-engine .ss-tool textarea{display:block;width:100%;min-height:75px;padding:11px;margin:6px 0;border:1px solid #a49b85;border-radius:7px;background:#fff;color:#26332d;font:400 16px/1.5 Nunito,Arial,sans-serif;resize:vertical}.khae-ss-engine .ss-controls{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:15px}.khae-ss-engine .ss-note{font-size:16px;color:#3c493e;border-left:4px solid #a17b44;padding:10px 14px;background:#f5ebd7;margin:15px 0}@media(max-width:780px){.khae-ss-engine .ss-step-list{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:450px){.khae-ss-engine .ss-step-list{grid-template-columns:1fr}}@media print{.khae-ss-engine .ss-step-list,.khae-ss-engine .ss-controls,.khae-ss-engine .ss-tool{display:none!important}}";
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function mount(){
const grade=document.body?.dataset.socialStudiesEngine,spec=CURRICULUM[grade];
if(!spec||document.getElementById("khaeSocialStudiesEngineV01"))return false;
const root=document.querySelector(grade==="9"?"main.workspace":"main[data-social-studies-prototype]");
if(!root)return false;
if(grade==="9"&&(!root.querySelector('[data-day-select="1"]')||!root.querySelector('[data-phase-select="read"]')||!root.querySelector("#source-pack")))return false;
const header=root.querySelector("h1"),host=grade==="9"?root.querySelector('[aria-label="Choose day"]'):root.querySelector('[data-ss-stage="1"]');
if(!header||!host)return false;
const style=el("style");style.id="khaeSocialStudiesEngineV01Style";style.textContent=CSS;
const panel=el("section","khae-ss-engine");panel.id="khaeSocialStudiesEngineV01";panel.setAttribute("aria-label","Social Studies inquiry guide");
panel.append(el("p","ss-kicker","KHAEMENES ACADEMY · SOCIAL STUDIES ENGINE v0.1"),el("h2",null,spec.focus),el("p","ss-inquiry-question",spec.question));
const tabs=el("nav","ss-step-list");tabs.setAttribute("aria-label","Choose inquiry stage");
const guide=el("div","ss-guide"),title=el("strong"),description=el("p"),status=el("p");status.setAttribute("role","status");guide.append(title,description,status);
const controls=el("div","ss-controls"),prev=el("button",null,"Previous stage"),next=el("button",null,"Next stage");prev.type=next.type="button";controls.append(prev,next);
const buttons=spec.steps.map((step,i)=>{const b=el("button",null,String(i+1).padStart(2,"0")+" · "+step[0]);b.type="button";b.addEventListener("click",()=>show(i,true));tabs.append(b);return b});
panel.append(tabs,guide);
const dossier=el("details","ss-tool");dossier.append(el("summary",null,"Source Analysis & Corroboration Studio · Optional practice"));
const body=el("div");body.append(el("p",null,"Use the actual sources in this week's packet. Identify origin, context, claim, limitation and corroboration. This temporary scratchpad is not submitted, scored or saved."));
[["Source & Context","Who created this document, map, dataset or account? When, why and for whom?"],["Evidence & Corroboration","What does it directly support? Which independent source agrees or disagrees?"],["Counterclaim & Limitations","What alternative explanation is plausible? What further evidence would change the claim?"]].forEach(([label,placeholder])=>{const lab=el("label",null,label),area=el("textarea");area.placeholder=placeholder;lab.append(area);body.append(lab)});
body.append(el("p","ss-note","Practice only: no autosave, grade, mastery credit, lesson unlock or new account record. Transfer any work you want to retain into your course's original evidence workspace."));dossier.append(body);
panel.append(dossier,controls);
host.before(panel);document.head.append(style);
let current=0;
function show(i,openNative){
current=Math.max(0,Math.min(spec.steps.length-1,i));const step=spec.steps[current];
title.textContent="Stage "+(current+1)+" · "+step[0];description.textContent=step[1];
status.textContent="Inquiry stage "+(current+1)+" of "+spec.steps.length+" · No mastery credit";
buttons.forEach((b,j)=>b.setAttribute("aria-current",j===current?"step":"false"));prev.disabled=current===0;next.disabled=current===spec.steps.length-1;
if(!openNative)return;
if(grade==="9"){
const day=root.querySelector('[data-day-select="'+step[2]+'"]'),phase=root.querySelector('[data-phase-select="'+step[3]+'"]');
day?.click();phase?.click(); // Existing day/phase code alone owns its course state.
root.querySelector("#step-caption")?.scrollIntoView({block:"start"});
}else root.querySelector('[data-ss-stage="'+(current+1)+'"]')?.scrollIntoView({block:"start"});
}
prev.addEventListener("click",()=>show(current-1,true));next.addEventListener("click",()=>show(current+1,true));show(0,false);return true;
}
window.KhaemenesSocialStudiesLessonEngineV01=Object.freeze({version:"0.1.0",curriculum:CURRICULUM,mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();