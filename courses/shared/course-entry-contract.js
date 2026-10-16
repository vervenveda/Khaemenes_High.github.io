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
  // Persistent High School learner rail.
  // This is a local fallback for pages that use the course-entry contract but do
  // not separately load the universal Verve N Veda beta/profile widget. Existing
  // universal buttons win by ID, so no duplicate controls are created.
  function mountStudentProfileAndBetaRail() {
    if (typeof document === "undefined" || !document.body) return;

    const PROFILE_ID = "khaemenesHighStudentProfileLink";
    const BETA_ID = "vnvBetaProgramLink";
    const PROFILE_STYLE_ID = "khaemenesHighStudentProfileLinkStyles";
    const BETA_STYLE_ID = "vnvBetaProgramLinkStyles";
    const PROFILE_URL = "https://vervenveda.com/Khaemenes_Academy.github.io/student/";
    const BETA_URL = "https://vervenveda.com/beta/";

    if (!document.getElementById(BETA_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = BETA_STYLE_ID;
      style.textContent = `
        #${BETA_ID}{
          position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));
          z-index:2147482000;display:inline-flex;align-items:center;justify-content:center;gap:7px;
          min-height:40px;padding:8px 12px;border:1px solid rgba(183,147,77,.72);border-radius:7px;
          color:#f7efe0;background:rgba(15,25,37,.94);box-shadow:0 8px 24px rgba(0,0,0,.18);
          font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.045em;cursor:pointer
        }
        #${BETA_ID}:hover{transform:translateY(-1px);border-color:#dfc48e;background:#152538}
        #${BETA_ID}:focus-visible{outline:3px solid #dfc48e;outline-offset:3px}
        #${BETA_ID} .vnv-beta-mark{font:600 15px/1 Georgia,serif;color:#dfc48e}
        @media(max-width:520px){#${BETA_ID}{right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));min-height:38px;padding:7px 10px}}
        @media print{#${BETA_ID}{display:none!important}}
      `;
      (document.head || document.documentElement).append(style);
    }

    if (!document.getElementById(PROFILE_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = PROFILE_STYLE_ID;
      style.textContent = `
        #${PROFILE_ID}{
          position:fixed;right:max(12px,env(safe-area-inset-right));bottom:calc(max(12px,env(safe-area-inset-bottom)) + 62px);
          z-index:2147481999;display:inline-flex;align-items:center;justify-content:center;gap:8px;
          min-height:40px;padding:8px 12px;border:1px solid rgba(180,139,69,.72);border-radius:7px;
          color:#17392f;background:rgba(255,253,248,.97);box-shadow:0 8px 24px rgba(23,57,47,.14);
          font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.045em;cursor:pointer
        }
        #${PROFILE_ID}:hover{transform:translateY(-1px);border-color:#b48b45;background:#fffaf0}
        #${PROFILE_ID}:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
        #${PROFILE_ID} .khae-profile-mark{
          width:20px;height:20px;display:grid;place-items:center;border-radius:50%;
          color:#fff;background:#17392f;font:600 10px/1 Georgia,serif
        }
        @media(max-width:520px){#${PROFILE_ID}{right:max(8px,env(safe-area-inset-right));min-height:38px;padding:7px 10px}}
        @media print{#${PROFILE_ID}{display:none!important}}
      `;
      (document.head || document.documentElement).append(style);
    }

    if (!document.getElementById(BETA_ID)) {
      const beta = document.createElement("button");
      beta.id = BETA_ID;
      beta.type = "button";
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
      document.body.append(beta);
    }

    if (!document.getElementById(PROFILE_ID)) {
      const profile = document.createElement("button");
      profile.id = PROFILE_ID;
      profile.type = "button";
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
      document.body.append(profile);
    }

    const beta = document.getElementById(BETA_ID);
    const profile = document.getElementById(PROFILE_ID);
    if (beta && profile) {
      const height = beta.getBoundingClientRect?.().height || 40;
      profile.style.bottom = `calc(max(12px, env(safe-area-inset-bottom)) + ${Math.max(58, Math.ceil(height) + 22)}px)`;
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
