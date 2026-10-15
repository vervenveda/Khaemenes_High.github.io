/* Science 9 Unit 04 learner isolation pilot. No legacy records are moved or deleted. */
(function(){
  "use strict";
  const ACTIVE="kh_sci9_u04_active_learner_v1",PREFIX="kh_sci9_u04_learner_v1:";
  const ORIGINAL="khaemenes_science_u04_v1";
  const safeId=v=>typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null;
  function active(){try{return safeId(sessionStorage.getItem(ACTIVE))}catch{return null}}
  function key(){const id=active();return id?PREFIX+id+":"+ORIGINAL:null}
  function choose(){
    const raw=window.prompt("Science 9 Unit 04: enter a learner ID (3–32 letters, numbers, - or _). Use the same ID on this device to resume. Existing shared-browser records stay preserved separately.","");
    if(raw===null)return false;
    const id=safeId(raw.trim());if(!id){window.alert("Invalid learner ID; no record was changed.");return false}
    try{sessionStorage.setItem(ACTIVE,id);window.location.reload();return true}catch{window.alert("Browser session storage is unavailable; no record was changed.");return false}
  }
  function guard(){
    if(active())return true;
    if(document.getElementById("scienceLearnerGuard"))return false;
    const panel=document.createElement("aside");
    panel.id="scienceLearnerGuard";panel.setAttribute("role","alert");
    panel.style.cssText="position:fixed;z-index:2147483647;inset:0;background:#f7f3e9;color:#181818;display:grid;place-items:center;padding:24px";
    const inner=document.createElement("div");inner.style.cssText="max-width:580px;background:white;border:1px solid #aaa;border-radius:7px;padding:24px;text-align:center";
    const title=document.createElement("h2");title.textContent="Choose a Science 9 learner record";
    const msg=document.createElement("p");msg.textContent="This Unit 04 pilot keeps selected learners in separate local browser records. Earlier shared records are preserved, not assigned automatically. This is not password-protected authentication, and other units and labs are not yet isolated.";
    const button=document.createElement("button");button.type="button";button.textContent="Select learner";button.style.cssText="border-radius:7px;padding:12px 20px;cursor:pointer";button.onclick=choose;
    inner.append(title,msg,button);panel.append(inner);document.body.append(panel);return false;
  }
  window.KhaemenesScienceU04Scope={active,key,choose,guard,legacyKey:ORIGINAL};
  document.addEventListener("DOMContentLoaded",guard);
})();

"use strict";
(() => {
  const KEY = window.KhaemenesScienceU04Scope.key() || "kh_sci9_u04_unselected_v1";
  const ROOT_KEY = window.KhaemenesScienceU04Scope.active() ? "kh_sci9_learner_v1:"+window.KhaemenesScienceU04Scope.active()+":khaemenes_science_integrated9_v1" : "kh_sci9_u04_root_unselected_v1";
  const THEME_KEY = "khaemenes_theme";
  const REQUIREMENTS = ["day01", "day02", "day03", "day04", "day05", "day06", "day07", "day08", "day09", "day10", "day11", "day12", "day13", "day14", "day15", "cycle", "meiosis", "probability", "variation", "case", "quiz", "assessment", "reflection"];
  const DEFAULT = {
    completedPages: [],
    cycle: {passed:false,score:0,total:8,attempts:0},
    meiosis: {passed:false,score:0,total:8,attempts:0},
    probability: {complete:false},
    variation: {complete:false},
    case: {submitted:false,title:""},
    quiz: {passed:false,score:0,total:20,attempts:0},
    assessment: {passed:false,score:0,total:30,attempts:0},
    reflection: {complete:false,text:""}
  };
  const $ = (s,p=document) => p.querySelector(s);
  const $$ = (s,p=document) => [...p.querySelectorAll(s)];
  const parse = (raw,fallback) => {
    try { return JSON.parse(raw) || fallback; } catch { return fallback; }
  };
  const saved = parse(localStorage.getItem(KEY), {});
  let state = {...DEFAULT, ...saved};
  for (const key of ["cycle","meiosis","probability","variation","case","quiz","assessment","reflection"]) {
    state[key] = {...DEFAULT[key], ...(saved[key] || {})};
  }
  state.completedPages = Array.isArray(saved.completedPages) ? saved.completedPages : [];

  function isComplete(id) {
    if (/^day/.test(id)) return state.completedPages.includes(id);
    if (["cycle","meiosis","quiz","assessment"].includes(id)) return Boolean(state[id].passed);
    if (["probability","variation"].includes(id)) return Boolean(state[id].complete);
    if (id === "case") return Boolean(state.case.submitted);
    if (id === "reflection") return Boolean(state.reflection.complete);
    return false;
  }
  function unitComplete() { return REQUIREMENTS.every(isComplete); }
  function syncRoot(){
    const isComplete=unitComplete();
    const root=parse(localStorage.getItem(ROOT_KEY),{});
    const completed=new Set(Array.isArray(root.completedUnits)?root.completedUnits:[]);
    if(isComplete) completed.add("u04");
    else completed.delete("u04");
    const courseSequenceComplete=["u00","u01","u02","u03","u04","u05","u06","u07","u08","u09","u10","u11","u12"].every(id=>completed.has(id));
    localStorage.setItem(ROOT_KEY,JSON.stringify({
      ...root,
      pathway:root.pathway||"Core",
      completedUnits:[...completed],
      notes:root.notes&&typeof root.notes==="object"?root.notes:{},
      lastVisitedUnit:"u04",
      courseSequenceComplete,
      updatedAt:new Date().toISOString()
    }));
  }
  function save() {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(state));
    syncRoot();
    updatePage();
  }
  function toast(message) {
    const box = $("#toast");
    if (!box) return;
    box.textContent = message;
    box.hidden = false;
    setTimeout(() => { box.hidden = true; }, 2800);
  }
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    const button = $("#themeToggle");
    if (button) button.textContent = theme === "dark" ? "☼" : "◐";
  }
  function updateRecord() {
    if (!$("#recordStatus")) return;
    $("#recordDate").textContent = new Date().toLocaleDateString();
    $("#recordStatus").textContent = unitComplete() ? "Complete" : "In progress";
    $("#recordLessons").textContent = `${state.completedPages.filter(x => /^day/.test(x)).length} of 15`;
    $("#recordLabs").textContent = `${[
      state.cycle.passed,
      state.meiosis.passed,
      state.probability.complete,
      state.variation.complete
    ].filter(Boolean).length} of 4`;
    $("#recordCase").textContent = state.case.submitted ? "Submitted" : "Not submitted";
    $("#recordQuiz").textContent = `${state.quiz.score || 0} of 20${state.quiz.passed ? " · Passed" : ""}`;
    $("#recordAssessment").textContent = `${state.assessment.score || 0} of 30${state.assessment.passed ? " · Passed" : ""}`;
    $("#recordReflection").textContent = state.reflection.complete ? "Recorded" : "Not recorded";
    $("#recordReflectionText").textContent = state.reflection.text || "No reflection recorded.";
  }
  function updatePage() {
    $$("[data-requirement]").forEach(card => {
      const done = isComplete(card.dataset.requirement);
      card.dataset.complete = String(done);
      const status = $("[data-requirement-status]", card);
      if (status) status.textContent = done ? "Complete" : "Not complete";
    });
    const count = REQUIREMENTS.filter(isComplete).length;
    const percent = Math.round(count / REQUIREMENTS.length * 100);
    if ($("#unitProgressFill")) $("#unitProgressFill").style.width = `${percent}%`;
    if ($("#unitProgressCount")) $("#unitProgressCount").textContent = `${count} of ${REQUIREMENTS.length} requirements`;
    if ($("#unitProgressPercent")) $("#unitProgressPercent").textContent = `${percent}%`;
    if ($("#unitCompletionStatus")) $("#unitCompletionStatus").textContent = unitComplete() ? "Unit 04 complete" : "Unit 04 in progress";
    $$("[data-page-complete]").forEach(button => {
      const done = state.completedPages.includes(button.dataset.pageComplete);
      button.setAttribute("aria-pressed", String(done));
      button.textContent = done ? "Lesson Complete ✓" : "Mark Lesson Complete";
    });
    $$("[data-evidence]").forEach(button => {
      const done = Boolean(state[button.dataset.evidence]?.complete);
      button.disabled = done;
      button.textContent = done ? "Evidence Recorded ✓" : "Record Evidence Complete";
    });
    if ($("#caseTitle")) $("#caseTitle").value = state.case.title || "";
    if ($("#reflectionText")) $("#reflectionText").value = state.reflection.text || "";
    updateRecord();
  }
  function exportRecord() {
    const blob = new Blob(
      [JSON.stringify({schema:"khaemenes-science-u04-v1",state}, null, 2)],
      {type:"application/json"}
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "KH-SCI-IIS9-unit04-record.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(localStorage.getItem(THEME_KEY) || "dark");
    $("#themeToggle")?.addEventListener("click", () => {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
    $$("[data-page-complete]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.pageComplete;
        const completed = new Set(state.completedPages);
        completed.has(id) ? completed.delete(id) : completed.add(id);
        state.completedPages = [...completed];
        save();
      });
    });
    $$("[data-evidence]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.evidence;
        state[id].complete = true;
        state[id].completedAt = new Date().toISOString();
        save();
      });
    });
    $("#caseForm")?.addEventListener("submit", event => {
      event.preventDefault();
      if (!$$(".case-check").every(box => box.checked)) {
        toast("Complete every case criterion.");
        return;
      }
      state.case = {
        submitted: true,
        title: $("#caseTitle")?.value.trim() || "Moonflower case",
        completedAt: new Date().toISOString()
      };
      save();
    });
    $("#reflectionForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const text = $("#reflectionText")?.value.trim() || "";
      if (text.length < 50) {
        toast("Add at least 50 characters.");
        return;
      }
      state.reflection = {complete:true,text,completedAt:new Date().toISOString()};
      save();
    });
    $("#printPage")?.addEventListener("click", () => window.print());
    $("#exportUnitRecord")?.addEventListener("click", exportRecord);
    if(window.KhaemenesScienceU04Scope.active()){syncRoot();updatePage();}
  });

  window.KhaemenesUnit04 = {
    loadState: () => state,
    saveState: next => {
      state = {...state, ...next};
      save();
    }
  };
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
