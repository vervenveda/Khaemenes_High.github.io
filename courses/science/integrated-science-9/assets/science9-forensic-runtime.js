(() => {
"use strict";
const originalMakeQuestion=makeQuestion;
const PASS=80;
function M(q,answer,wrong,explanation){return mc(q,answer,wrong,explanation)}
function originalDomainQuestion(w){try{return originalMakeQuestion(w.quizType)}catch{return M("Which response best demonstrates science mastery for this week?","Use evidence, correct scientific reasoning, units where needed, and stated limitations",["State a conclusion with no evidence","Use terminology without explaining it","Ignore uncertainty and conflicting evidence"],"Scientific mastery combines accurate content, evidence, reasoning, and transparent limits.")}}
function vocabularyQuestion(w){
  const v=Array.isArray(w.vocabulary)?w.vocabulary:[],a=v[0]||"evidence",b=v[1]||"model";
  return M(`For Week ${w.week} (${w.title}), what is the strongest way to demonstrate vocabulary mastery for “${a}” and “${b}”?`,`Use both terms accurately while explaining the week's phenomenon, data, or model`,["Copy dictionary definitions without applying them","Use the terms in unrelated sentences","Memorize spelling while ignoring scientific meaning"],"Scientific vocabulary is strongest when it is used accurately in disciplinary reasoning.");
}
function evidenceQuestion(w){return M(`Which evidence record would best support the Week ${w.week} essential question: “${w.essentialQuestion}”?`,`A labeled record with units, conditions, repeated observations or measurements, and a statement of what the evidence can and cannot show`,["Only the preferred conclusion","A single unlabeled number","A claim written before collecting evidence"],"Evidence quality depends on transparent measurements or observations, context, and limitations.")}
function investigationQuestion(w){return M(`The Week ${w.week} investigation is: “${w.investigation}” What is the strongest planning move before beginning?`,`Identify the variable or comparison, evidence to collect, safety/ethical controls, and stop conditions`,["Begin first and decide the method later","Change several variables without recording them","Skip safety because the activity is educational"],"A valid investigation is planned around evidence, controls, safety, and transparent procedures.")}
function cerQuestion(w){return M(`Which response best answers the Week ${w.week} question using Claim–Evidence–Reasoning?`,`A clear claim, relevant evidence from the week's work, and reasoning that explains the scientific connection while noting uncertainty`,["A claim with no evidence","A list of facts with no conclusion","A conclusion stated with more certainty than the data support"],"CER links a defensible claim to relevant evidence through scientific reasoning.")}
function sourceQuestion(w){return M(`For Week ${w.week}, which source-use practice is strongest?`,`Record author or organization, date, evidence or methods, attribution, and important limitations`,["Use the first result without checking it","Accept a source because its title matches the prediction","Remove uncertainty so the conclusion sounds stronger"],"Scientific source evaluation requires provenance, evidence or methods, attribution, and limitations.")}
function safetyLimitQuestion(w){return M(`Which statement best fits the Week ${w.week} mode “${w.mode}”?`,`Use only the approved/supervised method, document hazards or model limits, and stop if conditions leave the stated safe scope`,["Treat every activity as risk-free","Substitute stronger materials without review","Ignore model limitations if the answer seems reasonable"],"Safety and model limits are part of the scientific record, not optional extras.")}
getSet=function(w,n=6){
  if(!sets[w.week]){
    const pool=[originalDomainQuestion(w),vocabularyQuestion(w),evidenceQuestion(w),investigationQuestion(w),cerQuestion(w),sourceQuestion(w),safetyLimitQuestion(w)];
    sets[w.week]=pool.slice(0,Math.max(1,Math.min(n,pool.length)));
  }
  return sets[w.week];
};
function clearAssessmentNavLock(){document.querySelectorAll('a[href*="assessments"],button[data-view="assessments"],.navBtn[data-view="assessments"],.tab[data-view="assessments"]').forEach(el=>{el.removeAttribute("data-mastery-locked");el.removeAttribute("aria-disabled");el.removeAttribute("title");el.style.opacity=""})}
function masteryThrough(week){for(let i=1;i<=week;i++)if(Number(active().scores?.[i]||0)<PASS)return false;return true}
function gateAssessmentCards(){
  clearAssessmentNavLock();
  const cards=[...document.querySelectorAll("#content .card")];
  const rules=[
    ["Units 01–04",12,"This cumulative test opens after Weeks 1–12 each reach 80% mastery."],
    ["Midterm Practical",18,"The midterm checkpoint opens after Weeks 1–18 each reach 80% mastery."],
    ["Units 05–07",21,"This cumulative test opens after Weeks 1–21 each reach 80% mastery."],
    ["Units 08–09",27,"This cumulative test opens after Weeks 1–27 each reach 80% mastery."],
    ["Comprehensive Final",36,"The final opens after all 36 weekly mastery gates reach 80% or higher. The standalone midterm-score gap remains separately verified."]
  ];
  for(const [label,week,message] of rules){
    const card=cards.find(c=>c.querySelector("h3")?.textContent.includes(label)),link=card?.querySelector("a.button");
    if(link&&!masteryThrough(week)){link.dataset.forensicLocked="true";link.dataset.forensicMessage=message;link.setAttribute("aria-disabled","true");link.style.opacity=".58";link.title=message}
    else if(link){delete link.dataset.forensicLocked;delete link.dataset.forensicMessage;link.removeAttribute("aria-disabled");link.style.opacity="";link.removeAttribute("title")}
  }
}
const priorRenderAssessments=renderAssessments;
renderAssessments=function(){priorRenderAssessments();gateAssessmentCards()};
document.addEventListener("click",event=>{const lock=event.target.closest('[data-forensic-locked="true"]');if(!lock)return;event.preventDefault();event.stopImmediatePropagation();alert("You’re almost there. "+lock.dataset.forensicMessage+" Review the current learning and come back — your progress is saved.")},true);
clearAssessmentNavLock();
window.__KHAEMENES_SCIENCE9_FORENSIC__={version:"2026-08-16",masteryThrough,gateAssessmentCards};
})();