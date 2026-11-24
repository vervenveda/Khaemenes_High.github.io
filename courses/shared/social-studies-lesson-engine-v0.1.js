/* Khaemenes Social Studies Engine v0.1. Instructional scaffolding only.
 * Existing course controls own persistence, evidence, grading, assessment and mastery. */
(function(){
"use strict";
if(window.KhaemenesSocialStudiesLessonEngineV01)return;
const PACKET_TYPOGRAPHY_CSS=`
html:root:root body[data-social-studies-engine]{
 font-family:"Brandon Grotesque",Nunito,"Avenir Next","Segoe UI",Arial,sans-serif!important;
 font-size:16px!important;font-weight:400!important;line-height:1.65!important;
}
html:root:root body[data-social-studies-engine] :is(button,input,select,textarea,summary,label,p,li,td,th){
 font-size:max(16px,1em)!important;
}
html:root:root body[data-social-studies-engine] :is(h1,h2,h3,h4,h5,h6,.page-title,.hero-title,.brand-title,.display-title,.site-title){
 font-family:Cinzel,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif!important;
 font-weight:400!important;
}
html:root:root body[data-social-studies-engine] :is(strong,b,th,label,summary,button,.button){
 font-weight:400!important;
}
`;
function normalizePacketTypography(){
 const legacy=document.getElementById("khaemenes-typography-standard");
 if(legacy)legacy.remove();
 if(document.getElementById("khaeSocialStudiesPacketTypographyV1"))return;
 const style=document.createElement("style");
 style.id="khaeSocialStudiesPacketTypographyV1";
 style.textContent=PACKET_TYPOGRAPHY_CSS;
 document.head.append(style);
}
const CURRICULUM=Object.freeze({
"9":{course:"Global Studies Honors",focus:"Historical Inquiry & Source Laboratory",mission:"How We Know the Past",question:"How can we build a trustworthy account when evidence is incomplete or disputed?",steps:[["Frame the inquiry","Separate recorded observation, reported information, inference and historical claim.",1,"read"],["Source and contextualize","Who created each record, when, why and for whom?",2,"read"],["Corroborate and map","Compare independent sources and locate geographic limitations.",3,"practice"],["Argue from evidence","Support a claim, answer a counterclaim, and acknowledge uncertainty.",4,"write"],["Revise and retrieve","Revisit your initial evidence ledger and complete the original weekly check.",5,"check"]]},
"10":{course:"United States History Honors",focus:"Historical Evidence, Timeline & Geography Studio",mission:"History, Memory, and the American Story",question:"How should historians construct a national history when evidence, memory, and identity do not always agree?",steps:[["Frame historical inquiry","Place the case in chronological and geographic context."],["Source and corroborate","Compare Indigenous oral tradition, archaeological evidence and a sixteenth-century European map."],["Map and measure","Interpret spatial evidence and the uncertainty of population estimates."],["Deliberate and argue","Compare interpretations, defend a claim and address counterevidence."],["Synthesize and correct","Use the original weekly quiz and correction tasks."]]},
"11":{course:"Government, Law & Economics Honors",focus:"Constitutional Case & Public Policy Studio",mission:"Civic Inquiry and Constitutional Citizenship",question:"What habits allow citizens to investigate public questions without surrendering accuracy, independence, or respect?",steps:[["Frame civic inquiry","Separate public claims from evidence and normative judgments."],["Audit source authority","Examine public records and constitutional claims without partisan shortcuts."],["Model and measure","Build a claim, source, evidence, limitation and corroboration table."],["Deliberate and reason","Offer a fair counterclaim and defensible position."],["Assess and transfer","Return to original assignments, seminar and course mastery."]]},
"12":{course:"Global Politics, International Relations & Senior Research Honors",focus:"Comparative Research & Diplomatic Analysis Studio",mission:"Senior Inquiry and the Social Sciences",question:"How can a senior distinguish a defensible social-science conclusion from an opinion, slogan, or unsupported prediction?",steps:[["Frame comparative inquiry","Distinguish factual, causal, legal and normative questions."],["Evaluate authority","Compare constitutions, UN development data, election records and public-opinion evidence."],["Compare cases and data","Identify methods, limits, context and alternative interpretations."],["Develop and defend","Construct an appropriately qualified senior argument."],["Correct and prepare capstone","Use original senior mastery, corrections and research-integrity requirements."]]}
});
const WEEK02=Object.freeze({
"9":{mission:"Geography and Human Systems",focus:"Geographic Inquiry, Maps & Human Systems",question:"How do location, scale, projection, migration, and human decisions shape our understanding of places?",headings:["Monday · Location, Scale, and the Geographic Question","Tuesday · Map Projections Are Purposeful Tradeoffs","Wednesday · Settlement, Migration, and Pattern Evidence","Thursday · Environment, Choice, and Geographic Determinism","Friday · Mastery Lab — Read the World Critically"],steps:[["Frame the geographic question","Distinguish location, spatial scale and the question a map can answer."],["Critique map projections","Explain what a projection preserves, distorts, or hides."],["Analyze migration patterns","Use settlement and migration evidence without treating correlation as proof."],["Evaluate human–environment explanations","Challenge geographic determinism with human choices and constraints."],["Synthesize and correct","Return to the original Week 2 mastery quiz, written argument and corrections."]]},
"10":{mission:"Indigenous Nations, Atlantic Encounters, and Colonization",focus:"Historical Encounters & Native Diplomacy Studio",question:"How can historians interpret colonization while accounting for Indigenous sovereignty, competing records, and Atlantic encounters?",steps:[["Frame the historical encounter","Set the regional and chronological context without making colonization inevitable."],["Evaluate diplomatic sources","Compare charters, covenants and Native diplomacy; identify author, audience, and purpose."],["Map encounters and power","Use geographic and demographic evidence with explicit limitations."],["Deliberate over interpretations","Defend a claim, represent Indigenous agency, and evaluate counterevidence."],["Synthesize and correct","Complete the original packet's assignments, weekly quiz and corrections."]]},
"11":{mission:"Philosophical Foundations of Government",focus:"Political Philosophy & Constitutional Ideas Studio",question:"How did different intellectual traditions shape contested ideas of law, liberty, government and public authority?",steps:[["Frame the philosophical inquiry","Differentiate the question of political legitimacy from modern partisan preferences."],["Compare intellectual sources","Analyze ancient traditions, common law, natural rights and Enlightenment texts in context."],["Trace influence carefully","Separate documented influence from superficial resemblance between ideas."],["Deliberate and justify","Develop a defensible interpretation of governmental power and rights."],["Assess and transfer","Use the original civic assignments, seminar and correction work."]]},
"12":{mission:"Evidence, Methodology, and Academic Integrity",focus:"Research Integrity & Verified Evidence Studio",question:"What procedures make research credible, ethical, reproducible, and honest?",steps:[["Frame a researchable question","State methods, scope, evidence criteria and competing explanations."],["Verify source authority","Audit original records, proper attribution and the provenance of research materials."],["Compare methods and cases","Identify measurement limits, reproducibility, bias and research ethics."],["Develop an ethical argument","Distinguish credible synthesis from fabricated or unsupported claims."],["Document integrity and correct","Return to the required source dossier, integrity agreement, mastery quiz and capstone checkpoint."]]}
});
const WEEK03=Object.freeze({
"9":{mission:"Early Humanity and the Agricultural Revolution",focus:"Archaeological Evidence & Early Human Systems Studio",question:"Did agriculture improve human life, or did it exchange some freedoms for new forms of security and inequality?",headings:["Monday · Mobility, Adaptation, and Deep Human Time","Tuesday · Reading an Early Village Through Material Evidence","Wednesday · Independent Domestication and Agricultural Transition","Thursday · Surplus, Specialization, and Unequal Access","Friday · Agricultural Revolution Mastery Audit"],steps:[["Frame the prehistoric inquiry","Distinguish claims about mobile populations from limited archaeological evidence."],["Interpret material traces","Use village remains, provenance and chronology without assuming missing records prove absence."],["Compare agricultural transitions","Examine independent domestication and multiple paths toward farming."],["Evaluate tradeoffs and inequality","Compare security, specialization, health, mobility, status and evidence limitations."],["Reassess and correct","Return to the original archaeological assignment, mastery quiz and constructed response."]]},
"10":{mission:"Revolution, Independence, and Competing Liberties",focus:"Revolutionary Claims & Excluded Voices Studio",question:"When colonists claimed natural rights, who was included, who was excluded, and why?",steps:[["Frame revolutionary claims","Contextualize colonial resistance and the range of loyalties and political interests."],["Compare four independence sources","Examine the Declaration, Loyalist response, enslaved petition and Haudenosaunee diplomatic position."],["Map power and participation","Use geography and historical context to assess who could claim or exercise liberty."],["Deliberate and qualify","Distinguish universal language from unequal rights and evaluate competing accounts."],["Synthesize and correct","Return to the original source lab, weekly quiz, evidence argument and corrections."]]},
"11":{mission:"Declaration, Revolution, and the Articles",focus:"Revolutionary Principles & Confederation Studio",question:"How did the principles used to justify independence create both a standard for government and a problem for the new nation?",steps:[["Frame revolutionary constitutional inquiry","Separate principles of legitimate government from the specific grievances used to justify independence."],["Audit grievances and principles","Classify Declaration grievances and corroborate their context and legal claims."],["Model confederation limits","Compare state autonomy, central capacity, liberty and institutional tradeoffs under the Articles."],["Deliberate over unfinished equality","Examine tensions between stated principles and the experiences of excluded groups."],["Assess and revise","Use the original source comparison, seminar, weekly check and corrections."]]},
"12":{mission:"Power, Authority, Legitimacy, and Sovereignty",focus:"Comparative Political Authority Studio",question:"Why do people obey political institutions, and when does power become legitimate authority?",steps:[["Distinguish the concepts","Define power, authority, legitimacy and sovereignty with careful boundaries."],["Evaluate intellectual and legal sources","Compare Weber's authority types, constitutional preambles and recognition of states."],["Compare political claims and evidence","Separate institutional power from accepted or disputed legitimacy in different cases."],["Argue and qualify","Develop an evidence-based analysis of when authority is legitimate; consider serious counterarguments."],["Complete senior corrections","Use the original concept application essay, mastery check, source citations and revision record."]]}
});
const CSS=".khae-ss-engine{width:min(100%,980px);margin:20px auto;padding:20px;border:1px solid #b3a080;border-radius:7px;background:#fffcf5;color:#26332d;box-sizing:border-box;font:400 16px/1.65 Nunito,Arial,sans-serif}\n.khae-ss-engine *{box-sizing:border-box}.khae-ss-engine h2{font:400 clamp(24px,3vw,33px)/1.3 Cinzel,Georgia,serif;text-align:center;color:#26332d;margin:8px auto 12px}.khae-ss-engine p,.khae-ss-engine label{font:400 16px/1.65 Nunito,Arial,sans-serif;color:#34443b}.khae-ss-engine .ss-kicker{font-size:14px;color:#67471c;text-align:center;letter-spacing:.05em}.khae-ss-engine .ss-inquiry-question{text-align:center;max-width:760px;margin:0 auto 14px}.khae-ss-engine .ss-step-list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin:16px 0}.khae-ss-engine button{min-height:46px;padding:9px 12px;background:#293c33;color:#fff8e9;border:1px solid #576e5b;border-radius:7px;cursor:pointer;font:400 16px/1.4 Nunito,Arial,sans-serif}.khae-ss-engine .ss-step-list button{min-width:0}.khae-ss-engine button[aria-current=\"step\"]{background:#b68a46;border-color:#8b692e;color:#202724}.khae-ss-engine button:focus-visible,.khae-ss-engine textarea:focus-visible{outline:3px solid #ad8341;outline-offset:3px}.khae-ss-engine .ss-guide{padding:15px;border:1px solid #c7bba4;border-radius:7px;background:#f6f1e6}.khae-ss-engine .ss-guide strong{display:block;font:400 20px/1.4 Cinzel,Georgia,serif;color:#26332d}.khae-ss-engine .ss-tool{margin:14px 0;border:1px solid #c7bba4;border-radius:7px;background:#fffdf9}.khae-ss-engine .ss-tool>summary{padding:13px 16px;cursor:pointer;font:400 16px/1.5 Nunito,Arial,sans-serif;color:#26332d;min-height:48px}.khae-ss-engine .ss-tool>div{padding:12px 16px 18px}.khae-ss-engine .ss-tool label{display:block;margin:12px 0}.khae-ss-engine .ss-tool textarea{display:block;width:100%;min-height:75px;padding:11px;margin:6px 0;border:1px solid #a49b85;border-radius:7px;background:#fff;color:#26332d;font:400 16px/1.5 Nunito,Arial,sans-serif;resize:vertical}.khae-ss-engine .ss-controls{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:15px}.khae-ss-engine .ss-note{font-size:16px;color:#3c493e;border-left:4px solid #a17b44;padding:10px 14px;background:#f5ebd7;margin:15px 0}@media(max-width:780px){.khae-ss-engine .ss-step-list{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:450px){.khae-ss-engine .ss-step-list{grid-template-columns:1fr}}@media print{.khae-ss-engine .ss-step-list,.khae-ss-engine .ss-controls,.khae-ss-engine .ss-tool{display:none!important}}";
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function mount(){
const grade=document.body?.dataset.socialStudiesEngine;
if(grade)normalizePacketTypography();
const demo=document.body.hasAttribute("data-social-studies-demo");
const path=location.pathname;
const route=!demo&&path.match(/\/social-studies\/grade-(09|10|11|12)\/(?:weeks\/)?week-(\d{2})\/student-packet(?:-v2)?\.html$/);
const weekNumber=route?Number(route[2]):null;
const week02=weekNumber===2,week03=weekNumber===3;
const laterWeek=weekNumber!==null&&weekNumber>=4&&weekNumber<=36;
const isGrade9Workspace=grade==="9"&&!demo&&!week02&&!week03&&!laterWeek;
const base=CURRICULUM[grade];
const specific=week03?WEEK03[grade]:week02?WEEK02[grade]:null;
if(!base||(!demo&&route&&route[1]!==String(grade).padStart(2,"0"))||document.getElementById("khaeSocialStudiesEngineV01"))return false;
const root=document.querySelector(demo?"main[data-social-studies-prototype]":isGrade9Workspace?"main.workspace":"main.main");
if(!root)return false;
if(isGrade9Workspace&&(!root.querySelector('[data-day-select="1"]')||!root.querySelector('[data-phase-select="read"]')||!root.querySelector("#source-pack")))return false;
// The first-week upper-grade packets have their own day structures. Match
// their original headings; do not inject parallel lesson pages or stages.
const headings={
 "9":week03?WEEK03["9"].headings:week02?WEEK02["9"].headings:[],
 "10":["Monday · Frame the Inquiry","Tuesday · Source, Contextualize, and Corroborate","Wednesday · Map, Measure, and Model","Thursday · Deliberate and Write","Friday · Synthesize, Assess, and Correct"],
 "11":["Monday · Frame the Inquiry","Tuesday · Source, Case, or Contract Laboratory","Wednesday · Model, Measure, and Test","Thursday · Argument, Deliberation, and Policy","Friday · Assess, Correct, and Transfer"],
 "12":["Monday · Concept and Inquiry Laboratory","Tuesday · Primary and Authoritative Source Laboratory","Wednesday · Comparative Data and Case Laboratory","Thursday · Argument, Seminar, and Performance Studio","Friday · Mastery, Correction, and Capstone Checkpoint"]
};
const weekdayNames=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const weekdayHeadings=laterWeek?[...root.querySelectorAll("h3")].filter(h=>weekdayNames.some(day=>h.textContent.trim().startsWith(day+" · "))):null;
const chosenHeadings=laterWeek?weekdayHeadings:(specific?.headings||headings[grade])?.map(name=>[...root.querySelectorAll("h3")].find(h=>h.textContent.trim()===name));
if(laterWeek&&(!weekdayHeadings||weekdayHeadings.length!==5||weekdayHeadings.some((h,i)=>!h.textContent.trim().startsWith(weekdayNames[i]+" · "))))return false;
const targets=!demo&&!isGrade9Workspace?chosenHeadings?.map(heading=>{
 // Some Grade 09 packets put five H3 lessons inside one original card.
 // Navigating the precise existing heading works in both packet schemas.
 if(grade==="9"||laterWeek)return heading||null;
 return heading?.closest("article.lesson,section.card,article")||heading||null;
}):null;
if(targets&&(!targets.length||targets.some(x=>!x)||new Set(targets).size!==5))return false;
let spec=base&&(specific?Object.assign({},base,specific):base);
if(laterWeek){
 // The original packet supplies the subject, essential question, exact daily
 // lesson headings, and objectives: no invented week-specific source material.
 const strong=[...root.querySelectorAll("strong")].find(n=>/^Essential question\s*:/i.test(n.textContent.trim()));
 const questionHeading=[...root.querySelectorAll("h2,h3")].find(n=>/^Essential question\s*$/i.test(n.textContent.trim()));
 const question=(strong?.parentElement?.textContent||questionHeading?.nextElementSibling?.textContent||"").replace(/\s+/g," ").trim();
 const gradeFocus={"9":"Historical & Geographic Inquiry Studio","10":"United States Historical Evidence Studio","11":"Government, Law & Economics Inquiry Studio","12":"Comparative Politics & Senior Research Studio"};
 const mission=root.querySelector("h1")?.textContent?.replace(/\s+/g," ").trim()||"Social Studies";
 const steps=weekdayHeadings.map((heading,i)=>{
   const day=weekdayNames[i],label=heading.textContent.trim();
   const paragraph=heading.nextElementSibling;
   const block=targets[i],body=((paragraph?.matches?.("p,div,article")?paragraph.textContent:"")||block?.textContent||"").replace(/\s+/g," ");
   const objective=body.match(/\bObjective:\s*(.{1,240}?)(?=\b(?:Warm-up|Lesson|Instruction|Guided practice|Independent practice|Completion|Deliverable|Materials|Check):|$)/i);
   const excerpt=objective?.[1]?.trim()||"Use this day's original reading, sources, tasks and evidence requirements.";
   return [day+" · "+label.split(" · ").slice(1).join(" · "),excerpt];
 });
 spec=Object.assign({},base,{focus:gradeFocus[grade],mission,question:question||"Follow this week's original essential question and source evidence.",steps});
}
const header=root.querySelector("h1"),host=demo?root.querySelector('[data-ss-stage="1"]'):isGrade9Workspace?root.querySelector('[aria-label="Choose day"]'):targets?.[0];
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
if(isGrade9Workspace){
const day=root.querySelector('[data-day-select="'+step[2]+'"]'),phase=root.querySelector('[data-phase-select="'+step[3]+'"]');
day?.click();phase?.click(); // Existing day/phase code alone owns its course state.
root.querySelector("#step-caption")?.scrollIntoView({block:"start"});
}else if(demo)root.querySelector('[data-ss-stage="'+(current+1)+'"]')?.scrollIntoView({block:"start"});
else targets[current]?.scrollIntoView({block:"start"});
}
prev.addEventListener("click",()=>show(current-1,true));next.addEventListener("click",()=>show(current+1,true));show(0,false);return true;
}
window.KhaemenesSocialStudiesLessonEngineV01=Object.freeze({version:"0.1.0",curriculum:CURRICULUM,mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();