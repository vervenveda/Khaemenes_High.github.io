/* Science 9 Unit 00 learner identity adapter · Academy-first, legacy-preserving. */
(function(){
"use strict";
const LEGACY_ACTIVE="kh_sci9_u04_active_learner_v1",PREFIX="kh_sci9_u00_learner_v1:",ORIGINAL="khaemenes_science_u00_v1";
const safeLegacyId=v=>typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null;
const academyProfile=()=>{try{return window.KhaemenesCourseEntryContract?.readAcademyProfile?.()||null}catch{return null}};
const legacyActive=()=>{try{return safeLegacyId(sessionStorage.getItem(LEGACY_ACTIVE))}catch{return null}};
function active(){const academy=academyProfile();if(academy?.learnerId)return String(academy.learnerId);return legacyActive()}
function authority(){return academyProfile()?.learnerId?"academy":legacyActive()?"legacy":"none"}
function key(){const id=active();return id?PREFIX+encodeURIComponent(id)+":"+ORIGINAL:null}
function choose(){
 const academy=academyProfile();
 if(academy){window.alert("Science 9 follows the active Academy Student Profile. Change learners from Student Profile, then reload. No Unit 00 record was changed.");return false}
 const raw=window.prompt("Legacy Science 9 recovery: enter the earlier learner ID (3–32 letters, numbers, - or _). Existing records stay preserved separately.","");
 if(raw===null)return false;
 const id=safeLegacyId(raw.trim());if(!id){window.alert("Invalid legacy learner ID; no record was changed.");return false}
 try{sessionStorage.setItem(LEGACY_ACTIVE,id);window.location.reload();return true}catch{window.alert("Browser session storage is unavailable; no record was changed.");return false}
}
function recoverLegacy(){
 const target=key();if(!target){window.alert("Select an Academy learner first, or use legacy recovery if no Academy profile is available.");return false}
 try{
  const raw=localStorage.getItem(ORIGINAL);
  if(!raw){window.alert("No earlier shared Unit 00 record was found on this browser.");return false}
  if(localStorage.getItem(target)!==null){window.alert("This learner already has a Unit 00 record. No data was changed.");return false}
  const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)){window.alert("Legacy record format is invalid; nothing was changed.");return false}
  const blob=new Blob([raw],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="KH-SCI9-U00-legacy-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  const label=academyProfile()?.name||active();
  if(!window.confirm("A backup download was requested. Continue only if the preserved shared-browser Unit 00 record belongs to '"+label+"'. The original will remain untouched."))return false;
  localStorage.setItem(target,raw);window.location.reload();return true;
 }catch{window.alert("Recovery was not completed. Original records remain unchanged.");return false}
}
function guard(){
 const academy=academyProfile(),id=active();
 if(id){
  if(!document.getElementById("scienceLearnerSwitch")){
   const bar=document.createElement("div");bar.id="scienceLearnerSwitch";bar.style.cssText="position:fixed;z-index:9998;right:8px;bottom:8px;padding:8px 12px;border:1px solid #8c826b;border-radius:7px;background:#fff;color:#181818;font:14px Arial,sans-serif";
   const name=document.createElement("span");name.textContent=academy?"Science 9 · Academy learner: "+(academy.name||"Learner")+" ":"Science 9 · legacy learner: "+id+" ";
   const switchButton=document.createElement("button");switchButton.type="button";switchButton.textContent=academy?"Student Profile":"Switch legacy learner";switchButton.style.cssText="margin-left:8px;border-radius:7px;padding:6px 10px";
   if(academy)switchButton.onclick=()=>{location.href="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-09/student-profile/"};else switchButton.onclick=choose;
   const restoreButton=document.createElement("button");restoreButton.type="button";restoreButton.textContent="Recover legacy";restoreButton.style.cssText="margin-left:8px;border-radius:7px;padding:6px 10px";restoreButton.onclick=recoverLegacy;
   bar.append(name,switchButton,restoreButton);document.body.append(bar);
  }
  return true;
 }
 if(document.getElementById("scienceLearnerGuard"))return false;
 const panel=document.createElement("aside");panel.id="scienceLearnerGuard";panel.setAttribute("role","alert");panel.style.cssText="position:fixed;z-index:2147483647;inset:0;background:#f7f3e9;color:#181818;display:grid;place-items:center;padding:24px";
 const inner=document.createElement("div");inner.style.cssText="max-width:580px;background:white;border:1px solid #aaa;border-radius:7px;padding:24px;text-align:center";
 const title=document.createElement("h2");title.textContent="Select an Academy learner";
 const msg=document.createElement("p");msg.textContent="Science 9 readiness and safety evidence follows the Academy Student Profile. Earlier shared-browser Unit 00 records remain preserved for explicit recovery.";
 const academyButton=document.createElement("button");academyButton.type="button";academyButton.textContent="Open Student Profile";academyButton.style.cssText="border-radius:7px;padding:12px 20px;cursor:pointer";academyButton.onclick=()=>{location.href="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-09/student-profile/"};
 const legacyButton=document.createElement("button");legacyButton.type="button";legacyButton.textContent="Legacy recovery only";legacyButton.style.cssText="margin-left:8px;border-radius:7px;padding:12px 20px;cursor:pointer";legacyButton.onclick=choose;
 inner.append(title,msg,academyButton,legacyButton);panel.append(inner);document.body.append(panel);return false;
}
window.KhaemenesScienceU00Scope={active,key,choose,guard,recoverLegacy,legacyKey:ORIGINAL,academyProfile,authority,legacyActive};
document.addEventListener("DOMContentLoaded",guard);
})();

"use strict";
(() => {
  const KEY = window.KhaemenesScienceU00Scope.key() || "kh_sci9_u00_unselected_v1";
  const ROOT_KEY = window.KhaemenesScienceU00Scope.active() ? "kh_sci9_learner_v1:"+window.KhaemenesScienceU00Scope.active()+":khaemenes_science_integrated9_v1" : "kh_sci9_u00_root_unselected_v1";
  const THEME_KEY = "khaemenes_theme";
  const REQUIREMENTS = ["day01","day02","day03","day04","day05","readiness","safety","agreement","portfolio"];
  const DEFAULT = {
    completedPages: [],
    diagnostic: null,
    safety: { passed:false, score:0, total:15, attempts:0, completedAt:null },
    agreement: { accepted:false, studentName:"", date:"" },
    portfolio: { ready:false, format:"", goal:"", date:"" },
    updatedAt:null
  };

  const $ = (s,p=document) => p.querySelector(s);
  const $$ = (s,p=document) => [...p.querySelectorAll(s)];

  function parse(raw,fallback){ try{return JSON.parse(raw) ?? fallback}catch{return fallback} }
  function load(){
    const saved=parse(localStorage.getItem(KEY),{});
    return {
      ...DEFAULT,...saved,
      completedPages:Array.isArray(saved.completedPages)?saved.completedPages:[],
      safety:{...DEFAULT.safety,...(saved.safety||{})},
      agreement:{...DEFAULT.agreement,...(saved.agreement||{})},
      portfolio:{...DEFAULT.portfolio,...(saved.portfolio||{})}
    };
  }
  let state=load();

  function save(){
    state.updatedAt=new Date().toISOString();
    localStorage.setItem(KEY,JSON.stringify(state));
    syncRoot();
    updatePage();
  }

  function requirementComplete(id){
    if(id.startsWith("day")) return state.completedPages.includes(id);
    if(id==="readiness") return Boolean(state.diagnostic?.completed);
    if(id==="safety") return Boolean(state.safety?.passed);
    if(id==="agreement") return Boolean(state.agreement?.accepted);
    if(id==="portfolio") return Boolean(state.portfolio?.ready);
    return false;
  }

  function unitComplete(){return REQUIREMENTS.every(requirementComplete)}

  function syncRoot(){
    const isComplete=unitComplete();
    const root=parse(localStorage.getItem(ROOT_KEY),{});
    const completed=new Set(Array.isArray(root.completedUnits)?root.completedUnits:[]);
    if(isComplete) completed.add("u00");
    else completed.delete("u00");
    const courseSequenceComplete=["u00","u01","u02","u03","u04","u05","u06","u07","u08","u09","u10","u11","u12"].every(id=>completed.has(id));
    localStorage.setItem(ROOT_KEY,JSON.stringify({
      ...root,
      pathway:root.pathway||"Core",
      completedUnits:[...completed],
      notes:root.notes&&typeof root.notes==="object"?root.notes:{},
      lastVisitedUnit:"u00",
      courseSequenceComplete,
      updatedAt:new Date().toISOString()
    }));
  }

  function applyTheme(theme){
    const resolved=["dark","light"].includes(theme)?theme:"dark";
    document.documentElement.dataset.theme=resolved;
    localStorage.setItem(THEME_KEY,resolved);
    const button=$("#themeToggle");
    if(button){
      button.textContent=resolved==="dark"?"☼":"◐";
      button.setAttribute("aria-label",`Switch to ${resolved==="dark"?"light":"dark"} theme`);
    }
  }

  function initializeTheme(){
    const saved=localStorage.getItem(THEME_KEY);
    const preferred=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
    applyTheme(saved||preferred);
    $("#themeToggle")?.addEventListener("click",()=>applyTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
  }

  function toast(message){
    const box=$("#toast");
    if(!box)return;
    box.textContent=message;
    box.hidden=false;
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>box.hidden=true,3200);
  }

  function markPage(id){
    if(!id)return;
    const set=new Set(state.completedPages);
    if(set.has(id))set.delete(id);else set.add(id);
    state.completedPages=[...set];
    save();
    toast(set.has(id)?"Lesson marked complete.":"Lesson completion removed.");
  }

  function updatePage(){
    $$("[data-requirement]").forEach(card=>{
      const done=requirementComplete(card.dataset.requirement);
      card.dataset.complete=String(done);
      const value=$("[data-requirement-status]",card);
      if(value)value.textContent=done?"Complete":"Not complete";
    });

    const count=REQUIREMENTS.filter(requirementComplete).length;
    const percent=Math.round(count/REQUIREMENTS.length*100);
    $("#unitProgressFill") && ($("#unitProgressFill").style.width=`${percent}%`);
    $("#unitProgressCount") && ($("#unitProgressCount").textContent=`${count} of ${REQUIREMENTS.length} requirements`);
    $("#unitProgressPercent") && ($("#unitProgressPercent").textContent=`${percent}%`);
    $("#unitCompletionStatus") && ($("#unitCompletionStatus").textContent=unitComplete()?"Unit 00 complete":"Unit 00 in progress");

    $$("[data-page-complete]").forEach(button=>{
      const id=button.dataset.pageComplete;
      const done=state.completedPages.includes(id);
      button.setAttribute("aria-pressed",String(done));
      button.textContent=done?"Lesson Complete ✓":"Mark Lesson Complete";
    });

    if($("#agreementName")) $("#agreementName").value=state.agreement.studentName||"";
    if($("#agreementDate")) $("#agreementDate").value=state.agreement.date||new Date().toISOString().slice(0,10);
    if($("#portfolioFormat")) $("#portfolioFormat").value=state.portfolio.format||"";
    if($("#scienceGoal")) $("#scienceGoal").value=state.portfolio.goal||"";

    updateRecord();
  }

  function saveAgreement(event){
    event.preventDefault();
    const required=$$(".agreement-check");
    if(!required.every(box=>box.checked)){
      toast("All safety commitments must be checked before the agreement is recorded.");
      return;
    }
    state.agreement={
      accepted:true,
      studentName:$("#agreementName")?.value.trim()||"",
      date:$("#agreementDate")?.value||new Date().toISOString().slice(0,10)
    };
    save();
    toast("Safety agreement recorded locally.");
  }

  function savePortfolio(event){
    event.preventDefault();
    const checks=$$(".portfolio-check");
    if(!checks.every(box=>box.checked)){
      toast("Complete every portfolio setup item before recording readiness.");
      return;
    }
    state.portfolio={
      ready:true,
      format:$("#portfolioFormat")?.value||"",
      goal:$("#scienceGoal")?.value.trim()||"",
      date:new Date().toISOString().slice(0,10)
    };
    save();
    toast("Science portfolio setup recorded.");
  }

  function exportRecord(){
    const payload={schema:"khaemenes-science-u00-v1",course:"KH-SCI-IIS9",unit:"u00",exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`KH-SCI-IIS9-unit00-record-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
    toast("Unit 00 record exported.");
  }

  function updateRecord(){
    if(!$("#recordStatus"))return;
    $("#recordStatus").textContent=unitComplete()?"Complete":"In progress";
    $("#recordLessons").textContent=`${state.completedPages.filter(id=>/^day0[1-5]$/.test(id)).length} of 5`;
    $("#recordReadiness").textContent=state.diagnostic?.completed?`${state.diagnostic.score} of ${state.diagnostic.total}`:"Not completed";
    $("#recordSafety").textContent=state.safety?.passed?`${state.safety.score} of ${state.safety.total} · Passed`:"Not passed";
    $("#recordAgreement").textContent=state.agreement?.accepted?`Recorded ${state.agreement.date||""}`:"Not recorded";
    $("#recordPortfolio").textContent=state.portfolio?.ready?`Ready · ${state.portfolio.format||"format selected"}`:"Not ready";
    $("#recordGoal").textContent=state.portfolio?.goal||"No goal recorded";
    $("#recordStudent").textContent=state.agreement?.studentName||"Student name";
    $("#recordDate").textContent=new Date().toLocaleDateString();
  }

  function initialize(){
    initializeTheme();
    $$("[data-page-complete]").forEach(button=>button.addEventListener("click",()=>markPage(button.dataset.pageComplete)));
    $("#agreementForm")?.addEventListener("submit",saveAgreement);
    $("#portfolioForm")?.addEventListener("submit",savePortfolio);
    $("#printPage")?.addEventListener("click",()=>window.print());
    $("#exportUnitRecord")?.addEventListener("click",exportRecord);
    syncRoot();
    updatePage();
  }
  window.KhaemenesUnit00={loadState:()=>state,saveState(next){state={...state,...next};save();},toast};
  document.addEventListener("DOMContentLoaded",initialize);
})();
/* Shared redesigned-gateway theme layer. */
(() => {
  const marker="/courses/science/integrated-science-9/";
  const path=window.location.pathname;
  const at=path.indexOf(marker);
  const base=at>=0 ? path.slice(0,at+marker.length) : new URL("./",window.location.href).pathname;
  if(document.querySelector('script[data-science-theme-loader]')) return;
  const script=document.createElement("script");
  script.src=`${base}science-theme-loader.js`;
  script.defer=true;
  script.dataset.scienceThemeLoader="true";
  document.head.append(script);
})();
