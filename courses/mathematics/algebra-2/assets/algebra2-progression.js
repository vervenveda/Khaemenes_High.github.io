(() => {
  "use strict";

  const MASTERY = 80;
  const ASSESSMENT_KEY = "khaemenes-algebra2-assessment-records-v1";
  const LESSON_KEY = "khaemenes-algebra2-lesson-progress-v1";
  const WEEKLY_KEY = "khaemenes-algebra2-weekly-mastery-v1";
  const UNIT_WEEKS = {1:[2,3],2:[4,5,6],3:[7,8,9],4:[10,11,12],5:[13,14],6:[15,16,17],7:[19,20,21],8:[22,23],9:[24,25,26],10:[27,28,29,30],11:[31,32,33],12:[34,35],13:[36]};
  const ACTIVE_LEARNER_KEY = "khaemenes_active_learner_v1";
  const FAMILY_REGISTRY_KEY = "khaemenes_family_registry_v1";
  const LESSON_COUNTS = { 1: 6, 2: 8, 3: 7, 4: 8, 5: 6, 6: 7, 7: 7, 8: 6, 9: 7, 10: 10, 11: 8, 12: 7, 13: 5 };
  const LESSON_WEEK = {"u01-l01":2,"u01-l02":2,"u01-l03":2,"u01-l04":3,"u01-l05":3,"u01-l06":3,"u02-l01":4,"u02-l02":4,"u02-l03":4,"u02-l04":5,"u02-l05":5,"u02-l06":6,"u02-l07":6,"u02-l08":6,"u03-l01":7,"u03-l02":7,"u03-l03":8,"u03-l04":8,"u03-l05":8,"u03-l06":9,"u03-l07":9,"u04-l01":10,"u04-l02":10,"u04-l03":10,"u04-l04":11,"u04-l05":11,"u04-l06":12,"u04-l07":12,"u04-l08":12,"u05-l01":13,"u05-l02":13,"u05-l03":13,"u05-l04":14,"u05-l05":14,"u05-l06":14,"u06-l01":15,"u06-l02":15,"u06-l03":16,"u06-l04":16,"u06-l05":16,"u06-l06":17,"u06-l07":17,"u07-l01":19,"u07-l02":19,"u07-l03":20,"u07-l04":20,"u07-l05":20,"u07-l06":21,"u07-l07":21,"u08-l01":22,"u08-l02":22,"u08-l03":22,"u08-l04":23,"u08-l05":23,"u08-l06":23,"u09-l01":24,"u09-l02":24,"u09-l03":25,"u09-l04":25,"u09-l05":25,"u09-l06":26,"u09-l07":26,"u10-l01":27,"u10-l02":27,"u10-l03":28,"u10-l04":28,"u10-l05":28,"u10-l06":29,"u10-l07":29,"u10-l08":29,"u10-l09":30,"u10-l10":30,"u11-l01":31,"u11-l02":31,"u11-l03":31,"u11-l04":32,"u11-l05":32,"u11-l06":33,"u11-l07":33,"u11-l08":33,"u12-l01":34,"u12-l02":34,"u12-l03":34,"u12-l04":34,"u12-l05":35,"u12-l06":35,"u12-l07":35,"u13-l01":36,"u13-l02":36,"u13-l03":36,"u13-l04":36,"u13-l05":36};

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
      const actualKey=storageKey(key),S=window.KhaemenesMathStorageAdapter;
      if(S?.writeJSON){const result=S.writeJSON(actualKey,value)||{};return result.persisted===true&&(result.verified!==false);}
      const raw=JSON.stringify(value);localStorage.setItem(actualKey,raw);
      return localStorage.getItem(actualKey)===raw;
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

  function weeklyData() {
    return readJSON(WEEKLY_KEY, { weeks:{} }) || { weeks:{} };
  }

  function weekMastered(week) {
    const record = weeklyData()?.weeks?.[week];
    if (!record || typeof record !== "object") return false;
    if (Number(record.best) >= MASTERY) return true;
    return Array.isArray(record.attempts) && record.attempts.some(attempt => recordedScore(attempt?.score) >= MASTERY);
  }

  function allWeeksMastered(unit) {
    const weeks = UNIT_WEEKS[unit] || [];
    return weeks.length > 0 && weeks.every(weekMastered);
  }

  function unitUnlocked(unit) {
    if (!readinessRecorded()) return false;
    if (unit === 1) return true;
    if (!unitMastered(unit - 1)) return false;
    return unit < 7 || midtermMastered();
  }

  function lessonWeek(unit, lesson) {
    return Number(LESSON_WEEK[lessonKey(unit, lesson)]) || null;
  }

  function lessonUnlocked(unit, lesson) {
    if (!unitUnlocked(unit)) return false;
    if (lesson === 1) return true;
    if (!lessonMastered(lessonKey(unit, lesson - 1))) return false;
    const previousWeek=lessonWeek(unit,lesson-1),currentWeek=lessonWeek(unit,lesson);
    return !previousWeek || !currentWeek || currentWeek===previousWeek || weekMastered(previousWeek);
  }

  function finalMastered() {
    return recordMastered(assessmentData().final);
  }

  function nextTarget(unit, lesson) {
    unit=Number(unit);lesson=Number(lesson);
    if(!unit||!lesson)return null;
    const id=lessonKey(unit,lesson);
    if(!lessonMastered(id))return {kind:"lesson",href:"#main",label:"Review Lesson",title:"Master this lesson before moving on"};
    const count=LESSON_COUNTS[unit]||0,nextLesson=lesson+1;
    if(nextLesson<=count){
      const currentWeek=lessonWeek(unit,lesson),nextWeek=lessonWeek(unit,nextLesson);
      if(currentWeek&&nextWeek&&nextWeek!==currentWeek&&!weekMastered(currentWeek)){
        return {kind:"weekly",href:`../../../assessments/weekly-mastery.html?week=${currentWeek}`,label:`Open Week ${String(currentWeek).padStart(2,"0")} Mastery`,title:`Week ${String(currentWeek).padStart(2,"0")} Mastery`};
      }
      return {kind:"lesson",href:`u${String(unit).padStart(2,"0")}-l${String(nextLesson).padStart(2,"0")}.html`,label:`Next Lesson · ${String(nextLesson).padStart(2,"0")}`,title:`Lesson ${String(nextLesson).padStart(2,"0")}`};
    }
    const pendingWeek=(UNIT_WEEKS[unit]||[]).find(week=>!weekMastered(week));
    if(pendingWeek)return {kind:"weekly",href:`../../../assessments/weekly-mastery.html?week=${pendingWeek}`,label:`Open Week ${String(pendingWeek).padStart(2,"0")} Mastery`,title:`Week ${String(pendingWeek).padStart(2,"0")} Mastery`};
    if(!unitMastered(unit))return {kind:"unit",href:"../assessment/mastery-check.html",label:"Open Unit Mastery",title:`Unit ${String(unit).padStart(2,"0")} Mastery`};
    if(unit===6&&!midtermMastered())return {kind:"midterm",href:"../../../assessments/midterm.html",label:"Open Midterm",title:"Midterm Examination"};
    if(unit<13)return {kind:"unit",href:`../../unit-${String(unit+1).padStart(2,"0")}/lessons/u${String(unit+1).padStart(2,"0")}-l01.html`,label:`Begin Unit ${String(unit+1).padStart(2,"0")}`,title:`Unit ${String(unit+1).padStart(2,"0")} · Lesson 01`};
    if(!finalMastered())return {kind:"final",href:"../../../assessments/final.html",label:"Open Final Examination",title:"Comprehensive Final Examination"};
    return {kind:"completion",href:"../../../records/course-completion-certificate.html",label:"Review Completion Record",title:"Course Completion Record"};
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
      if (!allWeeksMastered(unit)) missing.push(`Complete all Unit ${String(unit).padStart(2, "0")} weekly mastery checks at ${MASTERY}%`);
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
    if (mastery && (!allLessonsMastered(unit) || !allWeeksMastered(unit))) disableLink(mastery, `Mastery Check locked · every lesson and instructional weekly mastery check in this unit must reach ${MASTERY}% first.`);
    const note = document.createElement("p");
    note.className = "notice";
    note.textContent = `Progression is sequential: each lesson and instructional weekly mastery check must reach ${MASTERY}%, then the unit mastery check must reach ${MASTERY}%. Completion alone never unlocks the next stage.`;
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
    allWeeksMastered,
    lessonComplete,
    lessonEvidence,
    lessonMastered,
    lessonUnlocked,
    lessonWeek,
    midtermMastered,
    finalMastered,
    nextTarget,
    missingFor,
    readinessRecorded,
    recordMastered,
    readJSON,
    storageKey,
    unitMastered,
    weekMastered,
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
