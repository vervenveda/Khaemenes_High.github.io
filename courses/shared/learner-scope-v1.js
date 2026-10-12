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
    "english-12": { prefixes: ["khae-ela12-state-v1", "KA_ENGLISH12_LANDING_V1"] }
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
    const keys = legacyKeys().filter(k => { const claim = parse(raw.get.call(local, claimKey(k))); return !claim?.legacyLearnerId && raw.get.call(local, learnerKey(k, learner?.learnerId || "")) === null; });
    if (!problem && learner && !keys.length) return;
    let box = document.getElementById("learnerRecordNotice");
    if (!box) { box = document.createElement("aside"); box.id = "learnerRecordNotice"; box.setAttribute("role", "status"); box.style.cssText = "position:relative;padding:14px;margin:14px;border:1px solid #967342;border-radius:7px;background:#fff8e8;color:#20241f"; document.body.prepend(box); }
    box.replaceChildren();
    const p = document.createElement("p"); p.textContent = problem || `Preserved work on this device has no confirmed owner. Select the records that belong to ${learner?.name || 'the active learner'}; the originals will be retained.`; box.append(p);
    const link = document.createElement("a"); link.href = "https://vervenveda.com/Khaemenes_Academy.github.io/"; link.textContent = "Select Academy learner"; box.append(link);
    if (keys.length) {
      const choices = keys.map(key => { const record = parse(raw.get.call(local,key)); const label = document.createElement("label"), input = document.createElement("input"); input.type = "checkbox"; label.style.display = "block"; label.append(input, document.createTextNode(` ${/mastery|assessment|score/i.test(key)?"Assessment results":/lesson|progress/i.test(key)?"Lesson progress":"Course work"}${parse(raw.get.call(local,key))?.studentName?" · "+parse(raw.get.call(local,key)).studentName:""}`)); box.append(label); let select;
        if (Array.isArray(record?.students) && record.students.length > 1) {
          select = document.createElement("select"); select.setAttribute("aria-label", "Which saved student belongs to this learner?");
          const placeholder = document.createElement("option"); placeholder.value = ""; placeholder.textContent = "Choose the saved student"; select.append(placeholder);
          for (const student of record.students) { const option = document.createElement("option"); option.value = String(student.id); option.textContent = String(student.name || student.id); const claim = parse(raw.get.call(local,claimKey(key))); option.disabled = !!claim?.studentOwners?.[student.id] && claim.studentOwners[student.id] !== learner?.learnerId; select.append(option); }
          box.append(select);
        }
        return { key, input, select }; });
      const exportButton = document.createElement("button"); exportButton.type = "button"; exportButton.textContent = "Export preserved work"; exportButton.onclick = downloadLegacy; box.append(exportButton);
      const claim = document.createElement("button"); claim.type = "button"; claim.textContent = `Copy selected records for ${learner?.name || 'active learner'}`;
      claim.disabled = !learner; claim.onclick = () => { const selected = choices.filter(x => x.input.checked); if (!selected.length || !confirm(`Confirm these ${selected.length} records belong to ${learner.name}. Existing learner records will not be replaced.`)) return; try { for (const item of selected) { if (!claimLegacy(item.key, item.select?.value || null)) { p.textContent = "Choose the saved student for each selected record. Existing learner records were not replaced."; return; } } location.reload(); } catch { p.textContent = "The copy could not be saved. Export the preserved work and try again when storage is available."; } }; box.append(claim);
    }
  }
  function scheduleNotice() { if (noticeScheduled || typeof document?.addEventListener !== "function") return; noticeScheduled = true; const run = () => { noticeScheduled = false; notice(); }; if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true }); else setTimeout(run, 0); }
  window.addEventListener?.("storage", event => { if (event.key === "khaemenes_active_learner_v1") { owner(); scheduleNotice(); } });
  window.KhaemenesLearnerScope = Object.freeze({ version: 2, course: scope, profile, claimLegacy, legacyKeys, scopedKey(base) { return targetForKey(base, "read"); } });
  scheduleNotice();
})();
