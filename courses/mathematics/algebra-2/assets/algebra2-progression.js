(() => {
  "use strict";

  const MASTERY = 80;
  const ASSESSMENT_KEY = "khaemenes-algebra2-assessment-records-v1";
  const LESSON_KEY = "khaemenes-algebra2-lesson-progress-v1";
  const ACTIVE_LEARNER_KEY = "khaemenes_active_learner_v1";
  const FAMILY_REGISTRY_KEY = "khaemenes_family_registry_v1";
  const LESSON_COUNTS = { 1: 6, 2: 8, 3: 7, 4: 8, 5: 6, 6: 7, 7: 7, 8: 6, 9: 7, 10: 10, 11: 8, 12: 7, 13: 5 };

  function activeLearnerId() {
    try {
      const id = JSON.parse(localStorage.getItem(ACTIVE_LEARNER_KEY) || "null");
      const registry = JSON.parse(localStorage.getItem(FAMILY_REGISTRY_KEY) || "null");
      return typeof id === "string" && registry?.learners?.[id]?.learnerId === id ? id : null;
    } catch {
      return null;
    }
  }

  function storageKey(base) {
    const learnerId = activeLearnerId();
    return learnerId ? `${base}:learner:${encodeURIComponent(learnerId)}` : base;
  }

  function readJSON(key, fallback = {}) {
    try {
      // Do not use anonymous historical records as current learner progression.
      const contract = window.KhaemenesCourseEntryContract;
      if (contract && (!contract.readAcademyProfile?.() || !activeLearnerId())) return fallback;
      const value = JSON.parse(localStorage.getItem(storageKey(key)) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch {
      return fallback;
    }
  };

  function writeJSON(key, value) {
    try {
      const contract = window.KhaemenesCourseEntryContract;
      if (contract && (!contract.readAcademyProfile?.() || !activeLearnerId())) return false;
      localStorage.setItem(storageKey(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  const unitKey = unit => `unit-${String(unit).padStart(2, "0")}-mastery`;
  const lessonKey = (unit, lesson) => `u${String(unit).padStart(2, "0")}-l${String(lesson).padStart(2, "0")}`;
  const assessmentData = () => readJSON(ASSESSMENT_KEY, {});
  const lessonData = () => readJSON(LESSON_KEY, {});

  function recordedScore(value) {
    // Empty, booleans, missing, nonfinite and out-of-range values are not grades.
    if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return null;
    const score = Number(value);
    return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
  }

  function recordMastered(record) {
    if (!record || typeof record !== "object" || Array.isArray(record)) return false;
    // When original attempts exist, they outrank potentially stale summary flags.
    // A failed retake does not erase an earlier numeric 80%+ passing attempt.
    if (Array.isArray(record.attempts) && record.attempts.length) {
      return record.attempts.some(attempt =>
        attempt && typeof attempt === "object" && recordedScore(attempt.score) >= MASTERY
      );
    }
    // Preserve legitimate summary-only legacy passing grades, but not boolean-only mastery.
    return recordedScore(record.bestScore) >= MASTERY ||
      recordedScore(record.score) >= MASTERY;
  }

  function readinessRecorded() {
    return recordMastered(assessmentData()["readiness-diagnostic"]);
  }

  function unitMastered(unit) {
    return recordMastered(assessmentData()[unitKey(unit)]);
  }

  function midtermMastered() {
    return recordMastered(assessmentData().midterm);
  }

  function lessonComplete(id) {
    return lessonData()[id]?.complete === true;
  }

  function lessonEvidence(id) {
    const record = lessonData()[id] || null;
    if (!record || typeof record !== "object") return { lessonId:id, threshold:MASTERY, mastery:false, best:null, source:LESSON_KEY };
    const scores = [
      Number(record.bestScore),
      Number(record.score),
      ...(Array.isArray(record.attempts) ? record.attempts.map(attempt => Number(attempt?.score)) : [])
    ].filter(Number.isFinite);
    const best = scores.length ? Math.max(...scores) : null;
    return { lessonId:id, threshold:MASTERY, mastery:recordMastered(record), best, source:LESSON_KEY };
  }

  function lessonMastered(id) {
    return lessonEvidence(id).mastery;
  }

  function allLessonsMastered(unit) {
    const count = LESSON_COUNTS[unit] || 0;
    return count > 0 && Array.from({ length: count }, (_, index) => lessonKey(unit, index + 1)).every(lessonMastered);
  }

  function allLessonsComplete(unit) {
    return allLessonsMastered(unit);
  }

  function unitUnlocked(unit) {
    if (!readinessRecorded()) return false;
    if (unit === 1) return true;
    if (!unitMastered(unit - 1)) return false;
    return unit < 7 || midtermMastered();
  }

  function lessonUnlocked(unit, lesson) {
    if (!unitUnlocked(unit)) return false;
    return lesson === 1 || lessonMastered(lessonKey(unit, lesson - 1));
  }

  function missingFor(config) {
    if (config?.source === "diagnostic") return [];
    const missing = [];
    if (!readinessRecorded()) missing.push(`Complete the Algebra II readiness diagnostic at ${MASTERY}%`);
    const unitMatch = String(config?.recordKey || "").match(/^u(\d{2})-mastery$/);
    if (unitMatch) {
      const unit = Number(unitMatch[1]);
      if (unit > 1 && !unitMastered(unit - 1)) missing.push(`Unit ${String(unit - 1).padStart(2, "0")} mastery at ${MASTERY}%`);
      if (unit >= 7 && !midtermMastered()) missing.push(`Reviewed midterm mastery at ${MASTERY}%`);
      if (!allLessonsMastered(unit)) missing.push(`Master all Unit ${String(unit).padStart(2, "0")} lessons at ${MASTERY}%`);
      return missing;
    }
    if (config?.recordKey === "midterm") {
      for (let unit = 1; unit <= 6; unit += 1) {
        if (!unitMastered(unit)) missing.push(`Unit ${String(unit).padStart(2, "0")} mastery at ${MASTERY}%`);
      }
      return missing;
    }
    if (config?.recordKey === "final") {
      for (let unit = 1; unit <= 13; unit += 1) {
        if (!unitMastered(unit)) missing.push(`Unit ${String(unit).padStart(2, "0")} mastery at ${MASTERY}%`);
      }
      if (!midtermMastered()) missing.push(`Reviewed midterm mastery at ${MASTERY}%`);
    }
    return missing;
  }

  function lockMain(title, message, href, label, homeHref = "../../") {
    const main = document.querySelector("main");
    if (!main) return;
    main.innerHTML = `<section class="unit-hero"><div class="wrap"><p class="eyebrow">Strict ${MASTERY}% progression</p><h1>${title}</h1><p>${message}</p><div class="actions"><a class="btn primary" href="${href}">${label}</a><a class="btn" href="${homeHref}">Course Home</a></div></div></section>`;
  }

  function disableLink(link, message) {
    if (!link || link.dataset.progressionLocked === "true") return;
    link.dataset.progressionLocked = "true";
    link.dataset.originalHref = link.getAttribute("href") || "";
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.style.opacity = ".58";
    link.style.cursor = "not-allowed";
    link.addEventListener("click", event => event.preventDefault());
    const note = document.createElement("p");
    note.className = "notice";
    note.textContent = message;
    link.append(note);
  }

  function unitGate() {
    const unit = Number(document.body.dataset.unit);
    if (!unit) return;
    if (!readinessRecorded()) {
      lockMain("Begin with readiness", `Complete the Algebra II readiness diagnostic at ${MASTERY}% or higher before opening the course sequence.`, "../../diagnostic/", "Open readiness diagnostic");
      return;
    }
    if (!unitUnlocked(unit)) {
      const prior = `Unit ${String(unit - 1).padStart(2, "0")}`;
      const href = unit === 7 ? "../../assessments/midterm.html" : `../unit-${String(unit - 1).padStart(2, "0")}/assessment/mastery-check.html`;
      const message = unit === 7
        ? `Complete Unit 06 and the reviewed midterm at ${MASTERY}% before beginning Unit 07.`
        : `Complete ${prior} mastery at ${MASTERY}% before beginning this unit.`;
      lockMain(`Unit ${String(unit).padStart(2, "0")} is locked`, message, href, "Return to required mastery");
      return;
    }
    const cards = [...document.querySelectorAll('.lesson-grid > a.card[href*="lessons/"]')];
    cards.forEach((card, index) => {
      const lesson = index + 1;
      const id = lessonKey(unit, lesson);
      card.dataset.lessonId = id;
      if (lessonMastered(id)) {
        const tag = document.createElement("span");
        tag.className = "pill";
        tag.textContent = "80% mastery met";
        card.prepend(tag);
      }
      if (!lessonUnlocked(unit, lesson)) {
        disableLink(card, `Locked · master Lesson ${String(lesson - 1).padStart(2, "0")} at ${MASTERY}% first.`);
      }
    });
    const mastery = document.querySelector('a.btn[href*="assessment/mastery-check.html"]');
    if (mastery && !allLessonsMastered(unit)) disableLink(mastery, `Mastery Check locked · every lesson in this unit must reach ${MASTERY}% first.`);
    const note = document.createElement("p");
    note.className = "notice";
    note.textContent = `Progression is sequential: each lesson must reach ${MASTERY}% mastery, then the unit mastery check must reach ${MASTERY}%. Completion alone never unlocks the next lesson.`;
    document.querySelector(".unit-hero .wrap")?.append(note);
  }

  function lessonGate() {
    const match = String(document.body.dataset.lessonId || "").match(/^u(\d{2})-l(\d{2})$/);
    if (!match) return;
    const unit = Number(match[1]);
    const lesson = Number(match[2]);
    if (lessonUnlocked(unit, lesson)) return;
    let href = "../../../diagnostic/";
    let label = "Open readiness diagnostic";
    let message = `Complete the Algebra II readiness diagnostic at ${MASTERY}% or higher before opening lessons.`;
    if (readinessRecorded() && unit === 7 && unitMastered(6) && !midtermMastered()) {
      href = "../../../assessments/midterm.html";
      label = "Open reviewed midterm";
      message = `Complete the reviewed midterm at ${MASTERY}% before opening Unit 07 lessons.`;
    } else if (readinessRecorded() && unit > 1 && !unitMastered(unit - 1)) {
      href = `../../unit-${String(unit - 1).padStart(2, "0")}/assessment/mastery-check.html`;
      label = "Return to prior unit mastery";
      message = `Complete Unit ${String(unit - 1).padStart(2, "0")} mastery at ${MASTERY}% before opening this lesson.`;
    } else if (readinessRecorded() && lesson > 1) {
      href = `u${String(unit).padStart(2, "0")}-l${String(lesson - 1).padStart(2, "0")}.html`;
      label = "Return to previous lesson";
      message = `Complete Lesson ${String(lesson - 1).padStart(2, "0")} before opening this lesson.`;
    }
    lockMain("Lesson locked", message, href, label, "../../../");
  }

  window.KhaemenesAlgebra2Progression = Object.freeze({
    MASTERY,
    assessmentData,
    allLessonsComplete,
    allLessonsMastered,
    lessonComplete,
    lessonEvidence,
    lessonMastered,
    lessonUnlocked,
    midtermMastered,
    missingFor,
    readinessRecorded,
    recordMastered,
    readJSON,
    storageKey,
    unitMastered,
    unitUnlocked,
    writeJSON
  });

  const boot = () => {
    if (document.body.dataset.unit) unitGate();
    if (document.body.dataset.lessonId) lessonGate();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
