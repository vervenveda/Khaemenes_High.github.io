/* Science 9 Unit 11 learner isolation pilot. No legacy records are moved or deleted. */
(function(){
  "use strict";
  const ACTIVE="kh_sci9_u11_active_learner_v1",PREFIX="kh_sci9_u11_learner_v1:";
  const ORIGINAL="khaemenes_science_u11_v1";
  const safeId=v=>typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null;
  function active(){try{const academy=window.KhaemenesCourseEntryContract?.readAcademyProfile?.();const common=safeId(sessionStorage.getItem("kh_sci9_u04_active_learner_v1"));const previous=safeId(sessionStorage.getItem(ACTIVE));const selected=common||previous;if(academy&&selected&&safeId(String(academy.learnerId||""))!==selected)return null;if(common)return common;if(previous){sessionStorage.setItem("kh_sci9_u04_active_learner_v1",previous);return previous}return null}catch{return null}}
  function key(){const id=active();return id?PREFIX+id+":"+ORIGINAL:null}
  function choose(){
    const raw=window.prompt("Science 9 Unit 11: enter a learner ID (3–32 letters, numbers, - or _). Use the same ID on this device to resume. Existing shared-browser records stay preserved separately.","");
    if(raw===null)return false;
    const id=safeId(raw.trim());if(!id){window.alert("Invalid learner ID; no record was changed.");return false}
    try{sessionStorage.setItem(ACTIVE,id);sessionStorage.setItem("kh_sci9_u04_active_learner_v1",id);window.location.reload();return true}catch{window.alert("Browser session storage is unavailable; no record was changed.");return false}
  }
  function recoverLegacy(){
    const target=key();if(!target){window.alert("Select a learner first.");return false}
    try{
      const raw=localStorage.getItem(ORIGINAL);
      if(!raw){window.alert("No earlier shared Unit 11 record was found on this browser.");return false}
      if(localStorage.getItem(target)!==null){window.alert("This learner already has a record. Export that record before requesting any merge. No data was changed.");return false}
      const parsed=JSON.parse(raw);
      if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)){window.alert("Legacy record format is invalid; nothing was changed.");return false}
      const snapshot=new Blob([raw],{type:"application/json"});
      const url=URL.createObjectURL(snapshot),a=document.createElement("a");
      a.href=url;a.download="KH-SCI9-U11-legacy-backup.json";a.click();
      setTimeout(()=>URL.revokeObjectURL(url),30000);
      if(!window.confirm("A backup download was requested. Only continue if you have verified that the shared-browser record belongs to learner '"+active()+"'. Copy it to this learner? The original will remain untouched."))return false;
      localStorage.setItem(target,raw);window.location.reload();return true;
    }catch(e){window.alert("Recovery was not completed. Original records remain unchanged.");return false}
  }
  function guard(){
    if(active()){
      if(!document.getElementById("scienceLearnerSwitch")){
        const bar=document.createElement("div");bar.id="scienceLearnerSwitch";
        bar.style.cssText="position:fixed;z-index:9998;right:8px;bottom:8px;padding:8px 12px;border:1px solid #8c826b;border-radius:7px;background:#fff;color:#181818;font:14px Arial,sans-serif";
        const name=document.createElement("span");name.textContent="Science 9 learner: "+active()+" ";
        const switchButton=document.createElement("button");switchButton.type="button";switchButton.textContent="Switch learner";switchButton.style.cssText="margin-left:8px;border-radius:7px;padding:6px 10px";
        switchButton.addEventListener("click",choose);const restoreButton=document.createElement("button");restoreButton.type="button";restoreButton.textContent="Recover legacy";restoreButton.style.cssText="margin-left:8px;border-radius:7px;padding:6px 10px";restoreButton.addEventListener("click",recoverLegacy);bar.append(name,switchButton,restoreButton);document.body.append(bar);
      }
      return true;
    }
    if(document.getElementById("scienceLearnerGuard"))return false;
    const panel=document.createElement("aside");
    panel.id="scienceLearnerGuard";panel.setAttribute("role","alert");
    panel.style.cssText="position:fixed;z-index:2147483647;inset:0;background:#f7f3e9;color:#181818;display:grid;place-items:center;padding:24px";
    const inner=document.createElement("div");inner.style.cssText="max-width:580px;background:white;border:1px solid #aaa;border-radius:7px;padding:24px;text-align:center";
    const title=document.createElement("h2");title.textContent="Choose a Science 9 learner record";
    const msg=document.createElement("p");msg.textContent="This Unit 11 pilot keeps selected learners in separate local browser records. Earlier shared records are preserved, not assigned automatically. This is not password-protected authentication, and other units and labs are not yet isolated.";
    const button=document.createElement("button");button.type="button";button.textContent="Select learner";button.style.cssText="border-radius:7px;padding:12px 20px;cursor:pointer";button.onclick=choose;
    inner.append(title,msg,button);panel.append(inner);document.body.append(panel);return false;
  }
  window.KhaemenesScienceU11Scope={active,key,choose,guard,recoverLegacy,legacyKey:ORIGINAL};
  document.addEventListener("DOMContentLoaded",guard);
})();

"use strict";(()=>{const KEY=window.KhaemenesScienceU11Scope.key()||"kh_sci9_u11_unselected_v1",ROOT_KEY=window.KhaemenesScienceU11Scope.active()?"kh_sci9_learner_v1:"+window.KhaemenesScienceU11Scope.active()+":khaemenes_science_integrated9_v1":"kh_sci9_u11_root_unselected_v1",THEME_KEY="khaemenes_theme";const REQ=["day01","day02","day03","day04","day05","day06","day07","day08","day09","day10","day11","day12","day13","day14","day15","orbit","spectra","exoplanet","cosmology","case","quiz","assessment","reflection"];const DEF={completedPages:[],orbit:{passed:false,score:0,total:8,attempts:0},spectra:{passed:false,score:0,total:8,attempts:0},exoplanet:{passed:false,score:0,total:8,attempts:0},cosmology:{passed:false,score:0,total:8,attempts:0},case:{submitted:false,title:""},quiz:{passed:false,score:0,total:20,attempts:0},assessment:{passed:false,score:0,total:30,attempts:0},reflection:{complete:false,text:""}};const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)],parse=(r,f)=>{try{return JSON.parse(r)||f}catch{return f}};const saved=parse(localStorage.getItem(KEY),{});let state={...DEF,...saved};for(const k of ["orbit","spectra","exoplanet","cosmology","case","quiz","assessment","reflection"])state[k]={...DEF[k],...(saved[k]||{})};state.completedPages=Array.isArray(saved.completedPages)?saved.completedPages:[];function done(id){if(/^day/.test(id))return state.completedPages.includes(id);if(["orbit","spectra","exoplanet","cosmology","quiz","assessment"].includes(id))return!!state[id].passed;if(id==="case")return!!state.case.submitted;if(id==="reflection")return!!state.reflection.complete;return false}function complete(){return REQ.every(done)}function sync(){const isComplete=complete(),root=parse(localStorage.getItem(ROOT_KEY),{}),set=new Set(Array.isArray(root.completedUnits)?root.completedUnits:[]);if(isComplete)set.add("u11");else set.delete("u11");const courseSequenceComplete=["u00","u01","u02","u03","u04","u05","u06","u07","u08","u09","u10","u11","u12"].every(id=>set.has(id));localStorage.setItem(ROOT_KEY,JSON.stringify({...root,completedUnits:[...set],lastVisitedUnit:"u11",courseSequenceComplete,updatedAt:new Date().toISOString()}))}let scienceLastSeen=localStorage.getItem(KEY),scienceConflict=false;window.addEventListener("storage",e=>{if(e.key===KEY&&e.newValue!==scienceLastSeen)scienceConflict=true;});function save(){if(scienceConflict||localStorage.getItem(KEY)!==scienceLastSeen){scienceConflict=true;window.alert("Unit 11 progress changed in another tab. Reload before saving.");return;}state.updatedAt=new Date().toISOString();const value=JSON.stringify(state);localStorage.setItem(KEY,value);scienceLastSeen=value;sync();update()}function toast(m){const b=$("#toast");if(!b)return;b.textContent=m;b.hidden=false;setTimeout(()=>b.hidden=true,2800)}function theme(t){document.documentElement.dataset.theme=t;localStorage.setItem(THEME_KEY,t);if($("#themeToggle"))$("#themeToggle").textContent=t==="dark"?"☼":"◐"}function record(){if(!$("#recordStatus"))return;$("#recordDate").textContent=new Date().toLocaleDateString();$("#recordStatus").textContent=complete()?"Complete":"In progress";$("#recordLessons").textContent=`${state.completedPages.filter(x=>/^day/.test(x)).length} of 15`;$("#recordLabs").textContent=`${[state.orbit.passed,state.spectra.passed,state.exoplanet.passed,state.cosmology.passed].filter(Boolean).length} of 4`;$("#recordCase").textContent=state.case.submitted?"Submitted":"Not submitted";$("#recordQuiz").textContent=`${state.quiz.score||0} of 20${state.quiz.passed?" · Passed":""}`;$("#recordAssessment").textContent=`${state.assessment.score||0} of 30${state.assessment.passed?" · Passed":""}`;$("#recordReflection").textContent=state.reflection.complete?"Recorded":"Not recorded";$("#recordReflectionText").textContent=state.reflection.text||"No reflection recorded."}function update(){$$("[data-requirement]").forEach(c=>{const d=done(c.dataset.requirement);c.dataset.complete=String(d);const s=$("[data-requirement-status]",c);if(s)s.textContent=d?"Complete":"Not complete"});const n=REQ.filter(done).length,p=Math.round(n/REQ.length*100);if($("#unitProgressFill"))$("#unitProgressFill").style.width=`${p}%`;if($("#unitProgressCount"))$("#unitProgressCount").textContent=`${n} of ${REQ.length} requirements`;if($("#unitProgressPercent"))$("#unitProgressPercent").textContent=`${p}%`;if($("#unitCompletionStatus"))$("#unitCompletionStatus").textContent=complete()?"Unit 11 complete":"Unit 11 in progress";$$("[data-page-complete]").forEach(b=>{const d=state.completedPages.includes(b.dataset.pageComplete);b.setAttribute("aria-pressed",String(d));b.textContent=d?"Lesson Complete ✓":"Mark Lesson Complete"});if($("#caseTitle"))$("#caseTitle").value=state.case.title||"";if($("#reflectionText"))$("#reflectionText").value=state.reflection.text||"";record()}function exportRecord(){const blob=new Blob([JSON.stringify({schema:"khaemenes-science-u11-v1",state},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="KH-SCI-IIS9-unit11-record.json";a.click();URL.revokeObjectURL(url)}document.addEventListener("DOMContentLoaded",()=>{theme(localStorage.getItem(THEME_KEY)||"dark");$("#themeToggle")?.addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark"));$$("[data-page-complete]").forEach(b=>b.addEventListener("click",()=>{const s=new Set(state.completedPages),id=b.dataset.pageComplete;s.has(id)?s.delete(id):s.add(id);state.completedPages=[...s];save()}));$("#caseForm")?.addEventListener("submit",e=>{e.preventDefault();if(!$$(".case-check").every(x=>x.checked)){toast("Complete every space-systems criterion.");return}state.case={submitted:true,title:$("#caseTitle").value.trim()||"Space mission evidence case",completedAt:new Date().toISOString()};save();toast("Mission case recorded.")});$("#reflectionForm")?.addEventListener("submit",e=>{e.preventDefault();const text=$("#reflectionText").value.trim();if(text.split(/\s+/).filter(Boolean).length<100){toast("Add at least 100 words.");return}state.reflection={complete:true,text,completedAt:new Date().toISOString()};save();toast("Reflection recorded.")});$("#printPage")?.addEventListener("click",()=>print());$("#exportUnitRecord")?.addEventListener("click",exportRecord);sync();update()});window.KhaemenesUnit11={loadState:()=>state,saveState:n=>{state={...state,...n};save()}}})();
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
