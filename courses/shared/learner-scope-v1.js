(() => {
  "use strict";
  const scope = document.currentScript?.dataset?.learnerScope || "";
  const configs = {
    "pre-algebra": { prefixes: ["KHAE_OPEN_PREALGEBRA_FORGE_V2", "KHAE_MATH9_PREALGEBRA_", "khaemenes-naib-", "khaemenes-prealgebra-", "khaemenes_math_unit", "khaemenes-grade09-last-open-v1"] },
    "algebra-1": { prefixes: ["khaemenes-algebra1-", "khaemenes-math-algebra1-readiness-v1"] },
    "geometry": { prefixes: ["khaemenes-geometry-", "khaemenes-math-geometry-readiness-v1"] },
    "math-games": { prefixes: ["khaemenes-", "khaemenes.", "khaemenes_group_cycle", "KHAE_MATH"] },
    "algebra-2": { prefixes: ["khaemenes-algebra2-", "khaemenes-math-algebra2-readiness-v1"] },
    "english-10": { prefixes: ["khae-ela10-state-v1", "KA_ENGLISH10_LANDING_V1"] },
    "english-11": { prefixes: ["khae-ela11-state-v1", "KA_ENGLISH11_LANDING_V1"] },
    "english-12": { prefixes: ["khae-ela12-state-v1", "KA_ENGLISH12_LANDING_V1"] },
    "integrated-science-9": { prefixes: ["khaemenes_science9_", "khaemenes_science_units", "khaemenes_science_foundations_v1", "khaemenes-science9-", "khae_science9_", "kh_sci9_"] },
    "biology-10": { prefixes: ["khaemenes-biology-10-v1", "khae_high_science_evidence_v1:sci-biology-10-", "khae:bio10:w04:lesson:"] },
    "chemistry-11": { prefixes: ["khaemenes-chemistry-11-v1", "khae_high_science_evidence_v1:sci-chemistry-11-"] },
    "physics-engineering-12": { prefixes: ["khaemenes-physics-engineering-12-v1", "khae_high_science_evidence_v1:sci-physics-&-engineering-12-"] },
    "social-studies-10": { prefixes: ["KHAE_SS10_USH_CLEAN_PORTAL_V1"] },
    "social-studies-11": { prefixes: ["KHAE_SS11_GLE_CIVIC_LEDGER_V1"] },
    "social-studies-12": { prefixes: ["KHAE_SS12_GPIR_OBSERVATORY_V1"] }
  };
  const config = configs[scope];
  if (!config || typeof Storage === "undefined" || window.KhaemenesLearnerScope) return;
  let local;
  try { local = window.localStorage; } catch { return; }
  if (!local) return;
  const raw = { get: Storage.prototype.getItem, set: Storage.prototype.setItem, remove: Storage.prototype.removeItem, key: Storage.prototype.key };
  const claimPrefix = `__khaemenes_learner_scope_v1:${encodeURIComponent(scope)}:`;
  const parse = value => { try { return JSON.parse(value || "null"); } catch { return null; } };
  const profile = () => window.KhaemenesCourseEntryContract?.readAcademyProfile?.() || null;
  const matches = key => config.prefixes.some(prefix => key === prefix || key.startsWith(prefix));
  const claimKey = base => `${claimPrefix}${encodeURIComponent(base)}`;
  const learnerKey = (base, id) => `${base}:learner:${encodeURIComponent(id)}`;
  let pageOwner = profile()?.learnerId || null;
  let problem = "";
  const pending = new Set();
  let noticeScheduled = false;
  function owner() {
    const learner = profile();
    if (!learner) { problem = "Select an Academy learner before saving course work."; return null; }
    if (!pageOwner) pageOwner = learner.learnerId;
    if (pageOwner !== learner.learnerId) { problem = "The Academy learner changed. Export any unsaved work, then reload this page."; return null; }
    return learner;
  }
  function readTarget(base, learner) {
    const target = learnerKey(base, learner.learnerId);
    if (raw.get.call(local, target) !== null) return target;
    const oldClaim = parse(raw.get.call(local, claimKey(base))) || parse(raw.get.call(local, `__khaemenes_legacy_claim_v1:math-${scope.replace('-', '')}:${encodeURIComponent(base)}`));
    const legacyOwner = oldClaim?.legacyLearnerId || oldClaim?.learnerId;
    const legacy = raw.get.call(local, base);
    if (legacy !== null && legacyOwner === learner.learnerId) { raw.set.call(local, target, legacy); return target; }
    if (legacy !== null && !legacyOwner) { pending.add(base); scheduleNotice(); }
    return target;
  }
  function targetForKey(key, mode) {
    const base = String(key);
    if (!matches(base)) return base;
    const learner = owner();
    if (!learner) { scheduleNotice(); return null; }
    const marker = base.indexOf(":learner:");
    if (marker >= 0) {
      // Enumerated scoped keys must never be re-scoped or read by another learner.
      return base.slice(marker) === `:learner:${encodeURIComponent(learner.learnerId)}` ? base : null;
    }
    if (mode === "read") return readTarget(base, learner);
    const target = learnerKey(base, learner.learnerId);
    const claim = parse(raw.get.call(local, claimKey(base)));
    if (raw.get.call(local, target) === null && raw.get.call(local, base) !== null && !claim?.legacyLearnerId && !claim?.learnerId) {
      problem = "Preserved device work needs an ownership decision before a new record can be saved.";
      pending.add(base); scheduleNotice(); return null;
    }
    return target;
  }
  Storage.prototype.getItem = function(key) {
    if (this !== local) return raw.get.call(this, key);
    const target = targetForKey(key, "read");
    return target === null ? null : raw.get.call(this, target);
  };
  Storage.prototype.setItem = function(key, value) {
    if (this !== local) return raw.set.call(this, key, value);
    const target = targetForKey(key, "write");
    if (target === null) throw new Error(problem || "This record belongs to another learner.");
    raw.set.call(this, target, value);
  };
  Storage.prototype.removeItem = function(key) {
    if (this !== local) return raw.remove.call(this, key);
    const target = targetForKey(key, "write");
    if (target === null) throw new Error(problem || "This record belongs to another learner.");
    raw.remove.call(this, target);
  };
  function legacyKeys() {
    const keys = [];
    if (!raw.key) return [...pending];
    for (let i = 0; i < local.length; i++) {
      const key = raw.key.call(local, i);
      if (key && matches(key) && !key.includes(":learner:") && raw.get.call(local, key) !== null) keys.push(key);
    }
    return keys;
  }
  function claimLegacy(base, studentId = null) {
    const learner = owner();
    if (!learner || !matches(base) || base.includes(":learner:")) return false;
    const claim = parse(raw.get.call(local, claimKey(base)));
    const text = raw.get.call(local, base), target = learnerKey(base, learner.learnerId);
    if (text === null || raw.get.call(local, target) !== null) return false;
    const record = parse(text);
    if (Array.isArray(record?.students) && record.students.length > 1) {
      const student = record.students.find(item => String(item?.id) === studentId);
      const assigned = claim?.studentOwners?.[studentId];
      if (!student || (assigned && assigned !== learner.learnerId)) return false;
      raw.set.call(local, target, JSON.stringify({ ...record, students: [student], activeId: student.id }));
      raw.set.call(local, claimKey(base), JSON.stringify({ version: 2, studentOwners: { ...(claim?.studentOwners || {}), [studentId]: learner.learnerId }, claimed_at: new Date().toISOString() }));
    } else {
      if (claim?.legacyLearnerId && claim.legacyLearnerId !== learner.learnerId) return false;
      raw.set.call(local, target, text);
      raw.set.call(local, claimKey(base), JSON.stringify({ version: 2, legacyLearnerId: learner.learnerId, learners: [learner.learnerId], claimed_at: new Date().toISOString() }));
    }
    pending.delete(base); problem = "";
    return true;
  }
  function downloadLegacy() {
    const records = Object.fromEntries(legacyKeys().map(k => [k, raw.get.call(local, k)]));
    const a = document.createElement("a"), url = URL.createObjectURL(new Blob([JSON.stringify({ course: scope, records }, null, 2)], { type: "application/json" }));
    a.href = url; a.download = `${scope}-preserved-device-records.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function notice() {
    if (!document.body || !document.createElement) return;
    const learner = profile();
    const keys = legacyKeys().filter(k => {
      const claim = parse(raw.get.call(local, claimKey(k)));
      return !claim?.legacyLearnerId && raw.get.call(local, learnerKey(k, learner?.learnerId || "")) === null;
    });

    const obsolete = document.getElementById("learnerRecordNotice");
    if (obsolete) obsolete.remove();

    let trigger = document.getElementById("learnerRecordNoticeButton");
    let panel = document.getElementById("learnerRecordNoticePanel");
    if (!problem && learner && !keys.length) {
      trigger?.remove();
      panel?.remove();
      return;
    }

    if (!trigger) {
      trigger = document.createElement("button");
      trigger.id = "learnerRecordNoticeButton";
      trigger.type = "button";
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.setAttribute("aria-controls", "learnerRecordNoticePanel");
      trigger.setAttribute("aria-expanded", "false");
      trigger.style.cssText = "position:fixed;right:14px;bottom:122px;z-index:2147483000;padding:8px 11px;border:1px solid #967342;border-radius:7px;background:#fff8e8;color:#20241f;box-shadow:0 4px 18px rgba(34,31,27,.16);font:inherit;font-size:13px;font-weight:400;line-height:1.2;cursor:pointer";
      (document.getElementById("khaemenesLearnerUtilityToolbar") || document.body).append(trigger);
    }

    if (!panel) {
      panel = document.createElement("section");
      panel.id = "learnerRecordNoticePanel";
      panel.hidden = true;
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-labelledby", "learnerRecordNoticeTitle");
      panel.style.cssText = "position:fixed;right:14px;bottom:170px;z-index:2147483001;width:min(430px,calc(100vw - 28px));max-height:min(70vh,560px);overflow:auto;padding:14px;border:1px solid #967342;border-radius:7px;background:#fff8e8;color:#20241f;box-shadow:0 14px 40px rgba(34,31,27,.24);font:inherit";
      document.body.append(panel);
    }

    panel.replaceChildren();

    function positionRecoveryRail() {
      const toolbar = document.getElementById("khaemenesLearnerUtilityToolbar");
      if (toolbar) {
        trigger.style.order = "10";
        if (trigger.parentElement !== toolbar) toolbar.prepend(trigger);
        const rect = toolbar.getBoundingClientRect();
        const toolbarHeight = Math.ceil(rect.height || 54);
        panel.style.right = "max(12px, env(safe-area-inset-right))";
        panel.style.bottom = `calc(max(12px, env(safe-area-inset-bottom)) + ${toolbarHeight + 10}px)`;
        return;
      }

      /* Fallback for pages where the shared utility toolbar has not mounted yet. */
      trigger.style.right = "max(12px, env(safe-area-inset-right))";
      trigger.style.bottom = "122px";
      requestAnimationFrame(() => {
        const rect = trigger.getBoundingClientRect();
        const panelBottom = Math.max(156, Math.ceil(window.innerHeight - rect.top + 8));
        panel.style.right = "max(12px, env(safe-area-inset-right))";
        panel.style.bottom = `calc(max(12px, env(safe-area-inset-bottom)) + ${Math.max(144, panelBottom - 12)}px)`;
      });
    }

    positionRecoveryRail();

    const head = document.createElement("div");
    head.style.cssText = "display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:8px";
    const title = document.createElement("h2");
    title.id = "learnerRecordNoticeTitle";
    title.textContent = "Preserved Work";
    title.style.cssText = "margin:0;font:inherit;font-family:Cinzel,'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif;font-size:24px;font-weight:400;line-height:1.2";
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Close";
    close.setAttribute("aria-label", "Close preserved work panel");
    close.style.cssText = "padding:6px 9px;border:1px solid #b9a37f;border-radius:7px;background:#fffdf7;color:#20241f;font:inherit;font-size:12px;font-weight:400;cursor:pointer";
    head.append(title, close);
    panel.append(head);

    const p = document.createElement("p");
    p.style.cssText = "margin:0 0 10px;line-height:1.55";
    p.textContent = problem || ("Preserved work on this device has no confirmed owner. Select the records that belong to " + (learner?.name || "the active learner") + "; the originals will be retained.");
    panel.append(p);

    const link = document.createElement("a");
    link.href = "https://vervenveda.com/Khaemenes_Academy.github.io/";
    link.textContent = "Select Academy learner";
    link.style.cssText = "display:inline-block;margin:0 0 10px;color:inherit;text-underline-offset:3px";
    panel.append(link);

    const choices = [];
    if (keys.length) {
      const list = document.createElement("div");
      list.style.cssText = "margin:2px 0 10px;border-top:1px solid #d9c49a";
      for (const key of keys) {
        const record = parse(raw.get.call(local, key));
        const row = document.createElement("div");
        row.style.cssText = "padding:8px 0;border-bottom:1px solid #d9c49a";
        const label = document.createElement("label");
        label.style.cssText = "display:grid;grid-template-columns:auto 1fr;gap:9px;align-items:start;line-height:1.4;cursor:pointer";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.style.marginTop = "3px";
        const description = (/mastery|assessment|score/i.test(key) ? "Assessment results" : /lesson|progress/i.test(key) ? "Lesson progress" : "Course work") + (record?.studentName ? " · " + record.studentName : "");
        label.append(input, document.createTextNode(description));
        row.append(label);

        let select;
        if (Array.isArray(record?.students) && record.students.length > 1) {
          select = document.createElement("select");
          select.setAttribute("aria-label", "Which saved student belongs to this learner?");
          select.style.cssText = "width:100%;margin-top:7px;padding:7px;border:1px solid #b9a37f;border-radius:7px;background:#fffdf7;color:#20241f;font:inherit";
          const placeholder = document.createElement("option");
          placeholder.value = "";
          placeholder.textContent = "Choose the saved student";
          select.append(placeholder);
          for (const student of record.students) {
            const option = document.createElement("option");
            option.value = String(student.id);
            option.textContent = String(student.name || student.id);
            const claim = parse(raw.get.call(local, claimKey(key)));
            option.disabled = !!claim?.studentOwners?.[student.id] && claim.studentOwners[student.id] !== learner?.learnerId;
            select.append(option);
          }
          row.append(select);
        }
        list.append(row);
        choices.push({ key, input, select });
      }
      panel.append(list);

      const actions = document.createElement("div");
      actions.style.cssText = "display:flex;flex-wrap:wrap;gap:7px";
      const styleAction = button => {
        button.style.cssText = "padding:7px 10px;border:1px solid #967342;border-radius:7px;background:#fffdf7;color:#20241f;font:inherit;font-size:12px;font-weight:400;cursor:pointer";
      };

      const exportButton = document.createElement("button");
      exportButton.type = "button";
      exportButton.textContent = "Export preserved work";
      styleAction(exportButton);
      exportButton.onclick = downloadLegacy;

      const claim = document.createElement("button");
      claim.type = "button";
      claim.textContent = "Copy selected records for " + (learner?.name || "active learner");
      styleAction(claim);
      claim.disabled = !learner;
      claim.onclick = () => {
        const selected = choices.filter(x => x.input.checked);
        if (!selected.length || !confirm("Confirm these " + selected.length + " records belong to " + learner.name + ". Existing learner records will not be replaced.")) return;
        try {
          for (const item of selected) {
            if (!claimLegacy(item.key, item.select?.value || null)) {
              p.textContent = "Choose the saved student for each selected record. Existing learner records were not replaced.";
              return;
            }
          }
          location.reload();
        } catch {
          p.textContent = "The copy could not be saved. Export the preserved work and try again when storage is available.";
        }
      };
      actions.append(exportButton, claim);
      panel.append(actions);
    }

    const setOpen = open => {
      panel.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
      if (open) close.focus();
      else trigger.focus();
    };
    trigger.textContent = problem ? "Preserved Work · Action Needed" : "Preserved Work";
    trigger.setAttribute("aria-label", problem ? "Preserved work requires attention" : "Review preserved work");
    trigger.onclick = () => setOpen(panel.hidden);
    close.onclick = () => setOpen(false);

    if (!trigger.dataset.utilityRailBound) {
      trigger.dataset.utilityRailBound = "1";
      window.addEventListener("resize", positionRecoveryRail, { passive: true });
      if (typeof MutationObserver === "function") {
        const railObserver = new MutationObserver(() => positionRecoveryRail());
        railObserver.observe(document.body, { childList: true });
      }
    }

    if (!panel.dataset.escapeBound) {
      panel.dataset.escapeBound = "1";
      document.addEventListener("keydown", event => {
        const currentPanel = document.getElementById("learnerRecordNoticePanel");
        const currentTrigger = document.getElementById("learnerRecordNoticeButton");
        if (event.key === "Escape" && currentPanel && !currentPanel.hidden) {
          currentPanel.hidden = true;
          currentTrigger?.setAttribute("aria-expanded", "false");
          currentTrigger?.focus();
        }
      });
    }
  }
  function scheduleNotice() { if (noticeScheduled || typeof document?.addEventListener !== "function") return; noticeScheduled = true; const run = () => { noticeScheduled = false; notice(); }; if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true }); else setTimeout(run, 0); }
  window.addEventListener?.("storage", event => { if (event.key === "khaemenes_active_learner_v1") { owner(); scheduleNotice(); } });
  window.KhaemenesLearnerScope = Object.freeze({ version: 2, course: scope, profile, claimLegacy, legacyKeys, scopedKey(base) { return targetForKey(base, "read"); } });
  scheduleNotice();
})();

/* Separate lesson vocabulary bootstrap; does not modify learner state. */
(() => {
  "use strict";
  if(typeof location==="undefined"||typeof location.pathname!=="string")return;
  if(!/\/courses\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)\/units\/unit-(?:0[0-9]|1[0-3])\/lessons\/[^/]+\.html$/.test(location.pathname))return;
  const current=document.currentScript;
  if(!current)return;
  const script=document.createElement("script");
  script.src=new URL("./math-lesson-vocabulary-link.js",current.src).href;
  script.async=true;
  script.onerror=()=>console.warn("Vocabulary helper unavailable. Lesson remains usable.");
  document.head.appendChild(script);
})();
