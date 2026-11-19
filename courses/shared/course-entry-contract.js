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



  /* High School mathematics readability floor · canonical v1 */
  function ensureMathReadabilityFloor(){
    if(typeof document==="undefined"||typeof location==="undefined")return;
    const path=String(location.pathname||"").toLowerCase();
    if(!/\/courses\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)(?:\/|$)/.test(path))return;
    if(document.getElementById("khaeMathReadabilityFloorV1"))return;
    const style=document.createElement("style");
    style.id="khaeMathReadabilityFloorV1";
    style.textContent='html:root:root:root body{font-size:16px!important;line-height:1.65!important}html:root:root:root body :is(p,li,a,button,input,select,textarea,label,summary,small,.muted,.meta,.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){font-size:16px!important}html:root:root:root body :is(.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){line-height:1.35!important;letter-spacing:.02em!important}html:root:root:root body :is(button,.btn,.button,a[role="button"],summary){min-height:44px}html:root:root:root body :is(.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){font-weight:400!important}@media print{html:root:root:root body,html:root:root:root body :is(p,li,a,button,input,select,textarea,label,summary,small,.muted,.meta,.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){font-size:16px!important}}';
    (document.head||document.documentElement).appendChild(style);
  }
  ensureMathReadabilityFloor();

  /* High School mathematics canonical footer · presentation only */
  function ensureMathFooter(){
    if(typeof document==="undefined"||typeof location==="undefined")return;
    const path=String(location.pathname||"").toLowerCase();
    const match=path.match(/\/courses\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)(?:\/|$)/);
    if(!match)return;
    const mount=()=>{
      if(!document.body||document.querySelector("footer"))return;
      if(!document.getElementById("khaeMathCanonicalFooterStyleV1")){
        const style=document.createElement("style");
        style.id="khaeMathCanonicalFooterStyleV1";
        style.textContent='#khaeMathCanonicalFooterV1{box-sizing:border-box;width:100%;min-height:66px;margin-top:44px;padding:22px 16px;display:grid;place-items:center;background:#242c29;color:#fff8eb;text-align:center;font:400 16px/1.55 Nunito,"Avenir Next",Arial,sans-serif;border-top:1px solid rgba(255,248,235,.2)}#khaeMathCanonicalFooterV1 p{margin:0;font-size:16px!important;color:#fff8eb!important}';
        (document.head||document.documentElement).appendChild(style);
      }
      const names={"pre-algebra":"Pre-Algebra","algebra-1":"Algebra I","geometry":"Geometry","algebra-2":"Algebra II"};
      const footer=document.createElement("footer");
      footer.id="khaeMathCanonicalFooterV1";
      footer.dataset.khaemenesMathCanonicalFooter="v1";
      const p=document.createElement("p");
      p.textContent="Khaemenes Academy · "+(names[match[1]]||"Mathematics")+" · Local-first learning evidence";
      footer.appendChild(p);
      document.body.appendChild(footer);
    };
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
    else mount();
  }
  ensureMathFooter();

  /* High School mathematics hardening bridge · canonical v1 */
  function ensureMathHardeningLayer(){
    if(typeof document==="undefined"||typeof location==="undefined")return;
    const path=String(location.pathname||"").toLowerCase();
    if(!/\/courses\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)(?:\/|$)/.test(path))return;
    if(window.KhaemenesMathHardeningLoader||document.getElementById("khaeMathHardeningLoaderScript"))return;
    const source=document.currentScript?.src||location.href;
    const script=document.createElement("script");
    script.id="khaeMathHardeningLoaderScript";
    script.src=new URL("../mathematics/assets/math-hardening-loader-v1.js",source).href;
    script.async=false;
    script.dataset.khaemenesMathHardening="course-entry-v1";
    script.onerror=()=>console.warn("Shared mathematics hardening layer unavailable; existing course behavior remains active.");
    (document.head||document.documentElement).appendChild(script);
  }
  ensureMathHardeningLayer();

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

  // High School learner rail is owned by the synchronized v1.8 widget below.
  // Do not build a second toolbar here: duplicate style IDs previously prevented
  // the canonical five-button responsive rail from taking control.

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

  // Academy utility controls: optional UI, independent of course readiness.
  // The canonical widget owns the profile button, toolbar and print exclusion.
  const entryAssetSource=document.currentScript?.src||location.href;
  function mountLearnerToolbar(){
    if(document.querySelector('script[src*="vnv-beta-link.js"]'))return;
    const tag=document.createElement("script");
    tag.src=/\/courses\/mathematics\/geometry(?:\/|$)/i.test(location.pathname)
      ? new URL("../../assets/vnv-beta-link.js",entryAssetSource).href
      : "https://vervenveda.com/Khaemenes_High.github.io/assets/vnv-beta-link.js?v=20261118-runtime-recovery-2";
    tag.async=true;
    tag.dataset.academyLearnerToolbar="course-entry";
    document.head.appendChild(tag);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mountLearnerToolbar,{once:true});
  else mountLearnerToolbar();

  // Read-only student evidence entry point. No email, cloud write, or grade mutations.
  function mountFamilyEvidenceLink(){
    const path=String(location.pathname||"");
    const match=path.match(/\/courses\/(mathematics|language-arts|science|social-studies)\/([^/]+)\/(?:index\.html)?$/i);
    if(!match||!document.querySelector("main")||document.getElementById("kaFamilyEvidenceLink"))return;
    const course=match[1].toLowerCase()+"/"+match[2].toLowerCase();
    const eligible=new Set(["mathematics/pre-algebra","mathematics/algebra-1","mathematics/geometry","mathematics/algebra-2","language-arts/english-10","language-arts/english-11","language-arts/english-12","science/integrated-science-9","science/biology-10","science/chemistry-11","science/physics-engineering-12","social-studies/grade-10","social-studies/grade-11","social-studies/grade-12"]);
    if(!eligible.has(course))return;
    const section=document.createElement("section");
    section.id="kaFamilyEvidenceLink";
    section.setAttribute("aria-label","Family learning records");
    section.style.cssText="box-sizing:border-box;max-width:960px;margin:24px auto;padding:22px;border:1px solid #b9a47c;border-radius:7px;background:#f7f1e5;color:#242c29;text-align:center;font:400 18px/1.6 Nunito,Arial,sans-serif";
    const title=document.createElement("h2");title.textContent="Preserve Your Learning";title.style.cssText="font:400 24px/1.3 Cinzel,Georgia,serif;margin:0 0 10px";
    const p=document.createElement("p");p.textContent="Download records explicitly linked to your selected learner. Older unattributed work remains untouched. Email delivery and cloud backup are not active.";
    const a=document.createElement("a");a.textContent="Open Family Learning Archive";a.href=new URL("family-records/?course="+encodeURIComponent(course),entryAssetSource).href;
    a.style.cssText="display:inline-block;background:#242c29;color:#fff8eb;border-radius:7px;padding:12px 20px;min-height:48px;box-sizing:border-box;text-decoration:none;font:400 16px/1.5 Nunito,Arial,sans-serif";
    section.append(title,p,a);document.querySelector("main").append(section);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mountFamilyEvidenceLink,{once:true});
  else mountFamilyEvidenceLink();

})();

/* Khaemenes High persistent learner toolbar bootstrap · Student Profile + Beta rail */
(()=>{try{
  const host=String(location.hostname||"").toLowerCase(),path=String(location.pathname||"").toLowerCase();
  const high=host.includes("khaemenes-high")||path.includes("/khaemenes_high.github.io/");
  if(!high)return;
  const already=document.getElementById("vnvBetaProgramLink")||Array.from(document.scripts).some(s=>String(s.src||"").includes("/assets/vnv-beta-link.js"));
  if(already)return;
  const s=document.createElement("script");s.src="https://vervenveda.com/Khaemenes_High.github.io/assets/vnv-beta-link.js?v=20261118-runtime-recovery-2";s.defer=true;s.dataset.khaemenesStudentToolbar="persistent-v1";(document.head||document.documentElement).append(s);
}catch{}})();
