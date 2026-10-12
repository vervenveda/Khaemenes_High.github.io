(() => {
  "use strict";
  const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const percent = value => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
  const safeObject = value => object(value) && !Object.keys(value).some(k => ["__proto__", "constructor", "prototype"].includes(k));
  function valid(value, courseId) {
    if (!safeObject(value) || value.courseId !== courseId || value.version !== 1) return false;
    if (![value.weeks, value.units, value.exams, value.records, value.profile].every(safeObject)) return false;
    if (!Array.isArray(value.records.attendance) || !Array.isArray(value.records.reading)) return false;
    if (![...value.records.attendance, ...value.records.reading].every(safeObject)) return false;
    if (value.studentName !== undefined && typeof value.studentName !== "string") return false;
    const result = record => safeObject(record) && Array.isArray(record.attempts) && (record.best === undefined || record.best === null || percent(record.best)) && record.attempts.every(a => safeObject(a) && percent(a.score));
    for (const [key, week] of Object.entries(value.weeks)) {
      if (!/^\d+$/.test(key) || +key < 1 || +key > 36 || !safeObject(week) || !safeObject(week.days || {}) || !safeObject(week.notes || {}) || (week.quiz && !result(week.quiz))) return false;
    }
    for (const [key, unit] of Object.entries(value.units)) {
      if (!/^\d+$/.test(key) || +key < 1 || +key > 12 || !safeObject(unit) || (unit.assessment && !result(unit.assessment))) return false;
      if (unit.projectScore !== undefined && unit.projectScore !== "" && !percent(unit.projectScore)) return false;
    }
    if (!Object.entries(value.exams).every(([key, record]) => ["diagnostic", "midterm", "final"].includes(key) && result(record))) return false;
    return (!value.checks || safeObject(value.checks)) && (!value.misc || safeObject(value.misc));
  }
  function exportText(name, text) {
    const a = document.createElement("a"), url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function warning(message, getText) {
    const show = () => {
      if (!document.body) return;
      let box = document.getElementById("englishRecordWarning");
      if (!box) { box = document.createElement("aside"); box.id = "englishRecordWarning"; box.setAttribute("role", "alert"); box.style.cssText = "padding:14px;margin:14px;border:1px solid #963f46;border-radius:7px;background:#fff8e8;color:#20241f"; document.body.prepend(box); }
      box.replaceChildren(); const p = document.createElement("p"); p.textContent = message; box.append(p);
      const button = document.createElement("button"); button.type = "button"; button.textContent = "Export recovery copy"; button.onclick = () => exportText("english-record-recovery.json", getText()); box.append(button);
      const reload = document.createElement("button"); reload.type = "button"; reload.textContent = "Reload saved record"; reload.onclick = () => { if (confirm("Export any unsaved work before reloading. Continue?")) location.reload(); }; box.append(reload);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show, { once: true }); else show();
  }
  function create(courseId, key, defaults) {
    let snapshot = null, blocked = false, state = defaults();
    const owner = window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId || null;
    try {
      snapshot = localStorage.getItem(key);
      if (snapshot !== null) { const saved = JSON.parse(snapshot); if (!valid(saved, courseId)) throw new Error("invalid saved record"); state = saved; }
    } catch {
      blocked = true; warning("The saved record needs recovery. It has been preserved; automatic saving is paused.", () => snapshot || JSON.stringify(state));
    }
    function save(next) {
      state = next;
      try {
        if (blocked) throw new Error("Saving is paused. Export a recovery copy and reload the saved record.");
        const currentOwner = window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId || null;
        if (owner !== currentOwner) { blocked = true; throw new Error("The Academy learner changed. Export unsaved work, then reload."); }
        if (!valid(next, courseId)) throw new Error("The record is incomplete or contains an invalid score. Saving was paused.");
        if (localStorage.getItem(key) !== snapshot) { blocked = true; throw new Error("Another tab changed this record. Export your unsaved work before reloading."); }
        const text = JSON.stringify(next); localStorage.setItem(key, text); snapshot = text;
        const box = document.getElementById("englishRecordWarning"); if (box) box.remove();
        return true;
      } catch (error) { warning(`${error.message} Your current work remains available for export.`, () => JSON.stringify(state, null, 2)); return false; }
    }
    function replace(next) {
      if (!valid(next, courseId)) { warning("This backup has an invalid structure, version, or score. Your existing work was not replaced.", () => JSON.stringify(state, null, 2)); return false; }
      try { if (snapshot !== null) localStorage.setItem(`${key}:recovery:${Date.now()}`, snapshot); } catch { warning("A recovery copy could not be saved. Export the current work before importing.", () => JSON.stringify(state)); return false; }
      const wasBlocked = blocked; blocked = false;
      const saved = save(next); if (!saved) blocked = blocked || wasBlocked;
      return saved;
    }
    window.addEventListener?.("storage", event => {
      const target = window.KhaemenesLearnerScope?.scopedKey(key) || key;
      if (event.key === target || event.key === "khaemenes_active_learner_v1") {
        blocked = true; warning("The learner or saved record changed in another tab. Saving is paused; export unsaved work before reloading.", () => JSON.stringify(state, null, 2));
      }
    });
    return { state, save, replace, get blocked() { return blocked; } };
  }
  function score(record) {
    if (!record || !object(record)) return null;
    const scores = (Array.isArray(record.attempts) ? record.attempts : []).map(a => a?.score).filter(percent);
    if (percent(record.best) && (record.best > 0 || scores.length)) scores.push(record.best);
    return scores.length ? Math.max(...scores) : null;
  }
  function weeksComplete(state) {
    return Array.from({ length: 36 }, (_, i) => {
      const week = state?.weeks?.[i + 1];
      return !!week && ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].every(day => week.days?.[day]) && score(week.quiz) >= 80;
    });
  }
  window.KhaemenesEnglishRecords = Object.freeze({ valid, create, score, weeksComplete, warning });
})();
