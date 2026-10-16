(() => {
  "use strict";

  const ACTIVE_KEY = "khaemenes_active_learner_v1";
  const REGISTRY_KEY = "khaemenes_family_registry_v1";
  const CONTRACT = Object.freeze({
    schema: "khaemenes-course-readiness-v1",
    version: 1,
    overallReadyPercent: 80,
    essentialStrandFloorPercent: 80,
    unit0ExitPercent: 80,
    unit0RequiresCorrections: true
  });

  const storage = () => window.localStorage;
  const object = value => value !== null && typeof value === "object" && !Array.isArray(value);

  function identityRaw() {
    try { return storage().getItem(ACTIVE_KEY); } catch { return null; }
  }

  function readAcademyProfile() {
    try {
      const raw = storage().getItem(ACTIVE_KEY);
      const id = JSON.parse(raw || "null");
      const registry = JSON.parse(storage().getItem(REGISTRY_KEY) || "null");
      const learner = typeof id === "string" ? registry?.learners?.[id] : null;
      return learner && learner.learnerId === id
        ? Object.freeze({ learnerId: id, name: String(learner.nickname || "Learner") })
        : null;
    } catch { return null; }
  }

  function scopedKey(base, profile = readAcademyProfile()) {
    return profile ? `${base}:learner:${encodeURIComponent(profile.learnerId)}` : base;
  }

  function readJSON(base, fallback = null, profile = readAcademyProfile()) {
    try {
      const raw = storage().getItem(scopedKey(base, profile));
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  }

  function writeJSON(base, value, profile = readAcademyProfile()) {
    if (!profile) throw new Error("Select an Academy learner before saving placement evidence.");
    if (identityRaw() !== JSON.stringify(profile.learnerId)) throw new Error("The Academy learner changed.");
    storage().setItem(scopedKey(base, profile), JSON.stringify(value));
  }

  function latest(value) {
    if (Array.isArray(value)) return value[value.length - 1] || null;
    return value && typeof value === "object" ? value : null;
  }

  function readinessIsValid(value, courseId = null) {
    const record = latest(value);
    if (!object(record)) return false;
    if (courseId && record.course_id !== courseId) return false;
    if (!Number.isFinite(record.overall_percent) || record.overall_percent < 0 || record.overall_percent > 100) return false;
    if (!object(record.strand_scores)) return false;
    return Object.values(record.strand_scores).every(score => {
      const percent = typeof score === "number" ? score : score?.percent;
      return Number.isFinite(percent) && percent >= 0 && percent <= 100;
    });
  }

  function isReady(value, essentialStrands = [], courseId = null) {
    const record = latest(value);
    if (!readinessIsValid(record, courseId)) return false;
    if (record.route !== "advance" && record.route !== "advance_with_targeted_refresh") return false;
    if (record.overall_percent < CONTRACT.overallReadyPercent) return false;
    return essentialStrands.every(id => {
      const score = record.strand_scores?.[id];
      const percent = typeof score === "number" ? score : score?.percent;
      return Number.isFinite(percent) && percent >= CONTRACT.essentialStrandFloorPercent;
    });
  }

  function routeFor(overallPercent, strandScores, essentialStrands = []) {
    if (!Number.isFinite(overallPercent) || !object(strandScores)) return "teacher_review";
    const ready = overallPercent >= CONTRACT.overallReadyPercent && essentialStrands.every(id => {
      const score = strandScores[id];
      const percent = typeof score === "number" ? score : score?.percent;
      return Number.isFinite(percent) && percent >= CONTRACT.essentialStrandFloorPercent;
    });
    return ready ? "advance" : "unit_0_refresher";
  }

  window.KhaemenesCourseEntryContract = Object.freeze({
    ...CONTRACT,
    identityRaw,
    readAcademyProfile,
    scopedKey,
    readJSON,
    writeJSON,
    latest,
    readinessIsValid,
    isReady,
    routeFor
  });
  // Shared Academy continuation contract. This only publishes summary/next-step
  // metadata; it cannot award mastery, change scores, placement, or unlock lessons.
  function ensureLearningContinuationContract() {
    if (typeof document === "undefined" || window.KhaemenesLearningContinuation) return;
    if (document.querySelector('script[data-khaemenes-learning-continuation]')) return;
    const script=document.createElement("script");
    script.src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js";
    script.async=false;
    script.dataset.khaemenesLearningContinuation="1";
    script.addEventListener("load",()=>window.dispatchEvent(new CustomEvent("khaemenes-learning-continuation-ready")));
    (document.head||document.documentElement).append(script);
  }
  ensureLearningContinuationContract();

  // High School mathematics continuation publisher. It summarizes existing
  // course evidence only; it never changes progression, grades, or mastery.
  function ensureMathContinuationPublisher() {
    if (typeof document === "undefined") return;
    const path=String(window.location?.pathname||"").toLowerCase();
    if(!/\/courses\/mathematics\/(pre-algebra|algebra-1|algebra-2)(?:\/|$)/.test(path))return;
    if(document.querySelector('script[data-khaemenes-high-math-continuation]'))return;
    const script=document.createElement("script");
    script.src="https://vervenveda.com/Khaemenes_High.github.io/courses/shared/high-school-math-continuation.js";
    script.async=false;
    script.dataset.khaemenesHighMathContinuation="1";
    (document.head||document.documentElement).append(script);
  }
  ensureMathContinuationPublisher();

  // Persistent High School learner rail.
  // This is a local fallback for pages that use the course-entry contract but do
  // not separately load the universal Verve N Veda beta/profile widget. Existing
  // universal buttons win by ID, so no duplicate controls are created.
  function mountStudentProfileAndBetaRail() {
    if (typeof document === "undefined" || !document.body) return;

    const PROFILE_ID = "khaemenesHighStudentProfileLink";
    const BETA_ID = "vnvBetaProgramLink";
    const TOOLBAR_ID = "khaemenesLearnerUtilityToolbar";
    const TOOLBAR_STYLE_ID = "khaemenesLearnerUtilityToolbarStyles";
    const PROFILE_URL = "https://vervenveda.com/Khaemenes_Academy.github.io/student/";
    const BETA_URL = "https://vervenveda.com/beta/";

    if (!document.getElementById(TOOLBAR_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = TOOLBAR_STYLE_ID;
      style.textContent = `
        #${TOOLBAR_ID}{
          position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));
          z-index:2147482100;display:flex;align-items:stretch;justify-content:flex-end;gap:6px;
          padding:6px;border:1px solid rgba(180,139,69,.48);border-radius:7px;
          background:rgba(255,253,248,.96);box-shadow:0 10px 30px rgba(15,25,37,.16);
          backdrop-filter:blur(10px)
        }
        #${TOOLBAR_ID}>button,#${TOOLBAR_ID}>a{
          position:static!important;right:auto!important;bottom:auto!important;z-index:auto!important;
          width:126px!important;height:42px!important;min-height:42px!important;max-height:42px!important;
          display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;
          margin:0!important;padding:7px 9px!important;border-radius:7px!important;box-sizing:border-box!important;
          white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
          box-shadow:none!important;font:600 10px/1.15 "Avenir Next","Segoe UI",Arial,sans-serif!important;
          letter-spacing:.035em!important;cursor:pointer!important
        }
        #${TOOLBAR_ID}>#learnerRecordNoticeButton{order:10;color:#493719!important;background:#fff4d8!important;border:1px solid #b48b45!important}
        #${TOOLBAR_ID}>#${PROFILE_ID}{order:20;color:#17392f!important;background:#fffdf8!important;border:1px solid rgba(180,139,69,.72)!important}
        #${TOOLBAR_ID}>#${BETA_ID}{order:30;color:#f7efe0!important;background:#0f1925!important;border:1px solid rgba(183,147,77,.72)!important}
        #${TOOLBAR_ID}>button:hover,#${TOOLBAR_ID}>a:hover{transform:translateY(-1px)}
        #${TOOLBAR_ID}>button:focus-visible,#${TOOLBAR_ID}>a:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
        #${PROFILE_ID} .khae-profile-mark{width:20px;height:20px;display:grid;place-items:center;border-radius:50%;color:#fff;background:#17392f;font:600 10px/1 Georgia,serif}
        #${BETA_ID} .vnv-beta-mark{font:600 15px/1 Georgia,serif;color:#dfc48e}
        @media(max-width:520px){
          #${TOOLBAR_ID}{right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));gap:4px;padding:4px}
          #${TOOLBAR_ID}>button,#${TOOLBAR_ID}>a{width:96px!important;height:40px!important;min-height:40px!important;max-height:40px!important;padding:6px!important;font-size:9px!important}
        }
        @media(max-width:330px){#${TOOLBAR_ID}>button,#${TOOLBAR_ID}>a{width:90px!important}}
        @media print{#${TOOLBAR_ID}{display:none!important}}
      `;
      (document.head || document.documentElement).append(style);
    }

    let toolbar=document.getElementById(TOOLBAR_ID);
    if(!toolbar){
      toolbar=document.createElement("nav");
      toolbar.id=TOOLBAR_ID;
      toolbar.setAttribute("aria-label","Khaemenes learner utilities");
      document.body.append(toolbar);
    }

    if (!document.getElementById(PROFILE_ID)) {
      const profile = document.createElement("button");
      profile.id = PROFILE_ID;
      profile.type = "button";
      profile.style.order="20";
      profile.setAttribute("aria-label", "Open Khaemenes Academy Student Profile and pinned courses");
      profile.title = "Student Profile · pinned courses and learning schedule";
      const mark = document.createElement("span");
      mark.className = "khae-profile-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "S";
      const label = document.createElement("span");
      label.textContent = "Student Profile";
      profile.append(mark, label);
      profile.addEventListener("click", () => {
        try { window.location.assign(PROFILE_URL); } catch { window.location.href = PROFILE_URL; }
      });
      toolbar.append(profile);
    } else {
      const profile=document.getElementById(PROFILE_ID);
      profile.style.order="20";
      if(profile.parentElement!==toolbar)toolbar.append(profile);
    }

    if (!document.getElementById(BETA_ID)) {
      const beta = document.createElement("button");
      beta.id = BETA_ID;
      beta.type = "button";
      beta.style.order="30";
      beta.setAttribute("aria-label", "Open the Verve N Veda Beta Program for this page");
      const mark = document.createElement("span");
      mark.className = "vnv-beta-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "β";
      const label = document.createElement("span");
      label.textContent = "Beta Program";
      beta.append(mark, label);
      beta.addEventListener("click", () => {
        try { window.location.assign(BETA_URL); } catch { window.location.href = BETA_URL; }
      });
      toolbar.append(beta);
    } else {
      const beta=document.getElementById(BETA_ID);
      beta.style.order="30";
      if(beta.parentElement!==toolbar)toolbar.append(beta);
    }

    const preserved=document.getElementById("learnerRecordNoticeButton");
    if(preserved){
      preserved.style.order="10";
      if(preserved.parentElement!==toolbar)toolbar.prepend(preserved);
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountStudentProfileAndBetaRail, { once: true });
    } else {
      mountStudentProfileAndBetaRail();
    }
  }

  // Mathematics Applied Mission Studio loader.
  // Narrowly scoped to canonical High School math lesson/project routes.
  // The shared asset remains portfolio evidence only; it does not own mastery gates.
  if(typeof document!=="undefined"&&typeof location!=="undefined"){
    const appliedMissionSource=document.currentScript?.src||"";
    function loadAppliedMissionStudio(){
      if(!/\/courses\/mathematics\/(pre-algebra|geometry|algebra-2)\/units\/unit-\d{2}\/(lessons|projects)\//i.test(location.pathname))return;
      if(document.querySelector('script[data-khae-applied-mission-studio="shared-v1"]'))return;
      const script=document.createElement("script");
      script.async=false;
      script.dataset.khaeAppliedMissionStudio="shared-v1";
      script.src=new URL("../mathematics/assets/applied-mission-studio-v1.js",appliedMissionSource||location.href).href;
      document.head.appendChild(script);
    }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",loadAppliedMissionStudio,{once:true});
    else loadAppliedMissionStudio();
  }

})();
