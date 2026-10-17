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
      const TOOLBAR_ID="khaemenesLearnerUtilityToolbar";
      const BUTTON_ID="englishRecordWarningButton";
      const PANEL_ID="englishRecordWarning";
      let button=document.getElementById(BUTTON_ID);
      let box=document.getElementById(PANEL_ID);
      const toolbar=document.getElementById(TOOLBAR_ID);

      if(!button){
        button=document.createElement("button");
        button.id=BUTTON_ID;
        button.type="button";
        button.textContent="Record Recovery";
        button.setAttribute("aria-haspopup","dialog");
        button.setAttribute("aria-controls",PANEL_ID);
        button.setAttribute("aria-expanded","false");
        button.style.cssText="position:fixed;right:14px;bottom:122px;z-index:2147483000;width:126px;height:42px;padding:7px 9px;border:1px solid #963f46;border-radius:7px;background:#fff2e6;color:#5b2529;font:600 10px/1.15 'Avenir Next','Segoe UI',Arial,sans-serif;letter-spacing:.035em;cursor:pointer";
        (toolbar||document.body).append(button);
      }
      if(toolbar&&button.parentElement!==toolbar){
        button.style.position="static";
        button.style.order="12";
        toolbar.append(button);
      }

      if(!box){
        box=document.createElement("section");
        box.id=PANEL_ID;
        box.hidden=true;
        box.setAttribute("role","dialog");
        box.setAttribute("aria-modal","false");
        box.setAttribute("aria-labelledby","englishRecordWarningTitle");
        box.style.cssText="position:fixed;right:14px;bottom:170px;z-index:2147483001;width:min(430px,calc(100vw - 28px));max-height:min(70vh,560px);overflow:auto;padding:14px;border:1px solid #963f46;border-radius:7px;background:#fff8e8;color:#20241f;box-shadow:0 14px 40px rgba(34,31,27,.24);font:inherit";
        document.body.append(box);
      }

      box.replaceChildren();
      const head=document.createElement("div");
      head.style.cssText="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px";
      const title=document.createElement("h2");
      title.id="englishRecordWarningTitle";
      title.textContent="English Record Recovery";
      title.style.cssText="margin:0;font:400 24px/1.2 Cinzel,'Iowan Old Style',Georgia,serif";
      const close=document.createElement("button");
      close.type="button";close.textContent="Close";
      close.style.cssText="padding:6px 9px;border:1px solid #b9a37f;border-radius:7px;background:#fffdf7;color:#20241f;font:inherit;font-size:12px";
      head.append(title,close);box.append(head);
      const p=document.createElement("p");p.style.cssText="margin:0 0 10px;line-height:1.55";p.textContent=message;box.append(p);
      const actions=document.createElement("div");actions.style.cssText="display:flex;flex-wrap:wrap;gap:7px";
      const exportButton=document.createElement("button");exportButton.type="button";exportButton.textContent="Export recovery copy";
      const reload=document.createElement("button");reload.type="button";reload.textContent="Reload saved record";
      [exportButton,reload].forEach(x=>x.style.cssText="padding:7px 10px;border:1px solid #967342;border-radius:7px;background:#fffdf7;color:#20241f;font:inherit;font-size:12px");
      exportButton.onclick=()=>exportText("english-record-recovery.json",getText());
      reload.onclick=()=>{if(confirm("Export any unsaved work before reloading. Continue?"))location.reload()};
      actions.append(exportButton,reload);box.append(actions);

      const position=()=>{
        const rail=document.getElementById(TOOLBAR_ID);
        if(rail){
          if(button.parentElement!==rail){button.style.position="static";button.style.order="12";rail.append(button)}
          const h=Math.ceil(rail.getBoundingClientRect().height||54);
          box.style.right="max(12px, env(safe-area-inset-right))";
          box.style.bottom=`calc(max(12px, env(safe-area-inset-bottom)) + ${h+10}px)`;
        }else{
          button.style.right="14px";button.style.bottom="122px";
          box.style.right="14px";box.style.bottom="170px";
        }
      };
      const setOpen=open=>{box.hidden=!open;button.setAttribute("aria-expanded",String(open));position();if(open)close.focus();else button.focus()};
      button.onclick=()=>setOpen(box.hidden);
      close.onclick=()=>setOpen(false);
      position();
      setTimeout(position,500);
      setTimeout(position,1600);
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
        const box = document.getElementById("englishRecordWarning"); if (box) box.remove(); const recoveryButton=document.getElementById("englishRecordWarningButton"); if(recoveryButton) recoveryButton.remove();
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
