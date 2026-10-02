(() => {
  "use strict";
  const READINESS_KEY = "khaemenes_ss9_readiness_v1";
  const FOUNDATIONS_KEY = "khaemenes_ss9_unit0_v2";
  const COURSE_KEY = "khaemenes_grade09_social_studies_v1";
  const MASTERY = 80;
  const read = (key, fallback = null) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  function hasCourseProgress() {
    const db = read(COURSE_KEY, {});
    return Array.isArray(db.students) && db.students.some(student => Object.values(student.completedLessons || {}).some(days => Array.isArray(days) && days.some(Boolean)) || Object.keys(student.assignments || {}).length || Object.keys(student.quizzes || {}).length || Object.keys(student.exams || {}).length);
  }
  function foundationsMastered() {
    const record = read(FOUNDATIONS_KEY, {}), scores = Object.values(record.mastery || {}).map(item => Number(item?.best || 0));
    return record.gateway?.route === "advance" && scores.length === 6 && scores.every(score => score >= MASTERY);
  }
  function decision() {
    if (hasCourseProgress()) return { allow: true, pathway: "returning_learner" };
    if (foundationsMastered()) return { allow: true, pathway: "supported_42_week" };
    const readiness = read(READINESS_KEY, null);
    if (readiness?.route === "advance") return { allow: true, pathway: "core_36_week" };
    if (readiness?.route === "unit_0_refresher") return { allow: false, title: "Complete the six Foundation Weeks first", message: "Your readiness record assigns the Supported 42-week Pathway. Complete P1–P6 at 80% before Official Week 01.", href: "prep/index.html", label: "Open Foundation Weeks" };
    return { allow: false, title: "Begin with the Readiness Gateway", message: "Every first-time learner completes placement before the official 36-week course begins.", href: "assessments/readiness.html", label: "Start Readiness Gateway" };
  }
  function mount(result) {
    if (result.allow) { document.documentElement.dataset.grade09Entry = "open"; document.documentElement.dataset.durationPathway = result.pathway; return; }
    document.documentElement.dataset.grade09Entry = "locked";
    const style = document.createElement("style");
    style.textContent = ".grade09-entry-gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:22px;background:rgba(4,12,20,.97);color:#fff}.grade09-entry-card{width:min(700px,100%);padding:30px;border:1px solid rgba(234,211,154,.5);border-radius:7px;background:#0b1c2d;text-align:center}.grade09-entry-card h1{font-family:Georgia,serif;font-weight:444}.grade09-entry-actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:22px}.grade09-entry-actions a{min-height:46px;padding:10px 15px;border:1px solid #ead39a;border-radius:7px;color:#211a0f;background:#ead39a;text-decoration:none;font-weight:700}.grade09-entry-actions a.secondary{color:#fff;background:transparent}";
    document.head.appendChild(style);
    const gate = document.createElement("section");
    gate.className = "grade09-entry-gate"; gate.setAttribute("role", "dialog"); gate.setAttribute("aria-modal", "true"); gate.setAttribute("aria-labelledby", "grade09EntryTitle");
    gate.innerHTML = `<article class="grade09-entry-card"><p>GRADE 09 · GLOBAL STUDIES PLACEMENT</p><h1 id="grade09EntryTitle">${result.title}</h1><p>${result.message}</p><p>Readiness and Foundation evidence remain separate from the official course grade.</p><div class="grade09-entry-actions"><a href="${result.href}">${result.label}</a><a class="secondary" href="index.html">Course Entrance</a></div></article>`;
    document.body.appendChild(gate); gate.querySelector("a")?.focus();
  }
  const run = () => mount(decision());
  window.KhaemenesSocialStudies9Entry = { decision, run };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true }); else run();
})();
