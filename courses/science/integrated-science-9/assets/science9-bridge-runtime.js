(() => {
"use strict";
const cfg=window.__KHAEMENES_SCIENCE9_BRIDGE__||{mode:"preview",nickname:"Preview Scholar",record:null};
const RECORDS_KEY="khaemenes_science9_records_by_learner_v1";
const MIDTERM_STORE="khaemenes_science9_midterm_by_learner_v1";
const PASS=80;
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const FRIENDLY="You’re almost there. This activity opens when the earlier learning step is complete. Finish the current lesson or reach 80% mastery on the required check, then come back — your progress is saved.";
const r=cfg.record||{};
const student={id:cfg.mode==="formal"?cfg.learnerId:"preview",name:cfg.nickname||"Scholar",pathway:["Foundation","Core","Extended"].includes(r.pathway)?r.pathway:"Core",days:r.days||{},scores:r.scores||{},attempts:r.attempts||{},notes:r.notes||{},exit:r.exit||{},data:r.data||{},safety:r.safety||{},cumulative:r.cumulative||{},created:r.created||new Date().toISOString()};
state={students:[student],activeId:student.id,theme:state?.theme||"dark"};
function readJSON(key,fallback={}){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
save=function(){if(cfg.mode!=="formal")return;try{const raw=localStorage.getItem(RECORDS_KEY),records=raw?JSON.parse(raw):{};records[cfg.learnerId]={name:cfg.nickname,pathway:student.pathway,days:student.days,scores:student.scores,attempts:student.attempts,notes:student.notes,exit:student.exit,data:student.data,safety:student.safety,cumulative:student.cumulative||{},created:student.created,updatedAt:new Date().toISOString()};localStorage.setItem(RECORDS_KEY,JSON.stringify(records))}catch{}};
const boxes=document.querySelectorAll(".sideBox");if(boxes[0]){const n=document.createElement("div");n.className="notice";n.textContent=cfg.mode==="formal"?"Academy Family Profile active · formal Grade 09 learner-scoped science record · 80% mastery progression":"Preview mode · practice is temporary and does not alter formal Grade 09 science records";boxes[0].replaceChildren(n)}
function currentWeek(){try{return Number(selectedWeek||1)}catch{return 1}}
function scoreFor(week){return Number(student.scores?.[week]||0)}
function lessonsDone(week){const d=student.days?.[week]||{};return DAYS.every(day=>Boolean(d[day]))}
function midtermBest(){if(cfg.mode!=="formal"||!cfg.learnerId)return 0;const all=readJSON(MIDTERM_STORE,{}),rec=all[cfg.learnerId];return Number(rec?.objective?.percent||0)}
function cumulativePassed(id){return Boolean(student.cumulative?.[id]?.passed&&Number(student.cumulative?.[id]?.percent||0)>=PASS)}
function weekUnlocked(week){
  if(cfg.mode!=="formal")return true;
  if(week<=1)return true;
  if(scoreFor(week-1)<PASS)return false;
  if(week>=13&&!cumulativePassed("units01_04"))return false;
  if(week>=19&&midtermBest()<PASS)return false;
  if(week>=22&&!cumulativePassed("units05_07"))return false;
  if(week>=28&&!cumulativePassed("units08_09"))return false;
  return true;
}
function dayUnlocked(week,day){if(cfg.mode!=="formal")return true;if(!weekUnlocked(week))return false;const idx=DAYS.indexOf(day);if(idx<=0)return true;return DAYS.slice(0,idx).every(d=>Boolean(student.days?.[week]?.[d]))}
function quizUnlocked(week){return cfg.mode!=="formal"||(weekUnlocked(week)&&lessonsDone(week))}
function remind(detail){alert(detail?FRIENDLY+"\n\n"+detail:FRIENDLY)}
function reasonForWeek(week){
  if(week>=28&&!cumulativePassed("units08_09"))return "Week 28 and later open after the Units 08–09 cumulative assessment reaches 80% mastery and is attributed to this learner.";
  if(week>=22&&!cumulativePassed("units05_07"))return "Week 22 and later open after the Units 05–07 cumulative assessment reaches 80% mastery and is attributed to this learner.";
  if(week>=19&&midtermBest()<PASS)return "Semester II opens after Weeks 1–18 are mastered and the Science midterm objective score reaches 80% or higher.";
  if(week>=13&&!cumulativePassed("units01_04"))return "Week 13 and later open after the Units 01–04 cumulative assessment reaches 80% mastery and is attributed to this learner.";
  return "Week "+week+" opens after Week "+(week-1)+" reaches 80% mastery.";
}
function labelLocked(el,detail){if(!el)return;el.setAttribute("aria-disabled","true");el.dataset.masteryLocked="true";el.title=detail||FRIENDLY;el.style.opacity=".58"}
function applyGates(){if(cfg.mode!=="formal")return;document.querySelectorAll(".weekButton").forEach(btn=>{const week=Number(btn.dataset.week||btn.getAttribute("data-week")||0);if(week>1&&!weekUnlocked(week))labelLocked(btn,reasonForWeek(week));else{btn.removeAttribute("aria-disabled");delete btn.dataset.masteryLocked;btn.removeAttribute("title");btn.style.opacity=""}});const week=currentWeek();document.querySelectorAll("[data-day]").forEach(input=>{const day=input.dataset.day;if(!dayUnlocked(week,day)){input.disabled=true;input.closest(".lesson")?.setAttribute("data-locked","true");input.closest(".lesson")?.setAttribute("title",day+" opens after the earlier lesson is complete.")}});const submit=document.querySelector("#submitPractice");if(submit&&!quizUnlocked(week))labelLocked(submit,"The mastery check opens after all five lessons for this week are complete.");document.querySelectorAll("[data-open]").forEach(next=>{const w=Number(next.dataset.open||0);if(w>1&&!weekUnlocked(w))labelLocked(next,reasonForWeek(w))})}
const priorRenderAll=renderAll;renderAll=function(){priorRenderAll();setTimeout(applyGates,0)};
const priorRenderWeek=renderWeek;renderWeek=function(){const week=currentWeek();if(cfg.mode==="formal"&&!weekUnlocked(week)){remind(reasonForWeek(week));try{selectedWeek=Math.max(1,week-1)}catch{}}priorRenderWeek();setTimeout(applyGates,0)};
const priorRenderWeeks=renderWeeks;renderWeeks=function(){priorRenderWeeks();setTimeout(applyGates,0)};
document.addEventListener("click",event=>{const target=event.target.closest('[data-mastery-locked="true"]');if(!target)return;event.preventDefault();event.stopImmediatePropagation();remind(target.title||"")},true);
document.addEventListener("click",event=>{const b=event.target.closest(".weekButton");if(!b||cfg.mode!=="formal")return;const week=Number(b.dataset.week||0);if(week&&!weekUnlocked(week)){event.preventDefault();event.stopImmediatePropagation();remind(reasonForWeek(week))}},true);
const priorSubmitSet=submitSet;submitSet=function(week){if(cfg.mode==="formal"&&!quizUnlocked(Number(week))){remind("Complete all five lessons before opening this week’s mastery check.");return}const before=scoreFor(Number(week));priorSubmitSet(week);const after=scoreFor(Number(week));if(after>0&&after<PASS){setTimeout(()=>remind("Your best mastery score for Week "+week+" is "+after+"%. Review the lesson evidence and reassess when ready. Week "+(Number(week)+1)+" remains locked until you reach 80%."),20)}else if(after>=PASS&&after>before){setTimeout(()=>alert("Mastery reached: "+after+"%. "+reasonForWeek(Number(week)+1)),20)}};
window.__KHAEMENES_SCIENCE9_GATE__={midtermBest,cumulativePassed,weekUnlocked,reasonForWeek};
renderAll();setTimeout(applyGates,0);
})();