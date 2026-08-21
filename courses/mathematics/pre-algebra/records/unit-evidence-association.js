"use strict";

/* =========================================================
   KHAEMENES PRE-ALGEBRA · UNIT EVIDENCE ASSOCIATION
   Explicitly binds one browser-local Unit 01–13 evidence set
   to one learner profile without rewriting either source.

   IMPORTANT
   - Association is not authentication.
   - Association does not copy or alter mastery evidence.
   - One unscoped browser evidence set may have one active
     learner association at a time.
   - Rebinding to a different learner requires explicit release.
   ========================================================= */

(() => {
  const STORAGE_KEY = "khaemenes-prealgebra-unit-evidence-associations-v1";
  const SCHEMA_VERSION = "1.0";
  const RECORD_TYPE = "khaemenes.evidence.learner-association";

  const safeRead = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || typeof parsed !== "object") return { schemaVersion: SCHEMA_VERSION, active: null, history: [] };
      return {
        schemaVersion: SCHEMA_VERSION,
        active: parsed.active && typeof parsed.active === "object" ? parsed.active : null,
        history: Array.isArray(parsed.history) ? parsed.history : []
      };
    } catch {
      return { schemaVersion: SCHEMA_VERSION, active: null, history: [] };
    }
  };

  const safeWrite = value => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("[Pre-Algebra Evidence Association] Could not save association.", error);
      return false;
    }
  };

  function stable(value) {
    if (Array.isArray(value)) return value.map(stable);
    if (!value || typeof value !== "object") return value;
    return Object.keys(value).sort().reduce((out, key) => {
      if (key === "collectedAt") return out;
      out[key] = stable(value[key]);
      return out;
    }, {});
  }

  async function fingerprint(snapshot) {
    const canonical = JSON.stringify(stable(snapshot));
    if (globalThis.crypto?.subtle && globalThis.TextEncoder) {
      const bytes = new TextEncoder().encode(canonical);
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
    }

    // Non-cryptographic fallback for older/offline browsers. It is only a
    // change detector and is deliberately labeled as such in the record.
    let hash = 2166136261;
    for (let i = 0; i < canonical.length; i += 1) {
      hash ^= canonical.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `fallback-${(hash >>> 0).toString(16).padStart(8, "0")}`;
  }

  function learnerIdentity(learner) {
    if (!learner || typeof learner !== "object") throw new Error("A learner profile is required.");
    const id = String(learner.id ?? "").trim();
    if (!id) throw new Error("The selected learner does not have a stable learner ID.");
    return {
      learnerId: id,
      learnerName: String(learner.name || learner.displayName || "Learner").trim() || "Learner"
    };
  }

  function evidenceSummary(snapshot) {
    const summary = snapshot?.summary || {};
    return {
      unitsWithEvidence: Number(summary.unitsWithEvidence) || 0,
      lessonsWithEvidence: Number(summary.lessonsWithEvidence) || 0,
      masteredLessons: Number(summary.masteredLessons) || 0,
      reviewedLessons: Number(summary.reviewedLessons) || 0,
      totalAttempts: Number(summary.totalAttempts) || 0,
      bestScoreAverage: summary.bestScoreAverage === null || summary.bestScoreAverage === undefined
        ? null
        : Number(summary.bestScoreAverage)
    };
  }

  function evidenceKeys(snapshot) {
    return (snapshot?.units || [])
      .filter(unit => unit?.hasEvidence && unit?.storageKey)
      .map(unit => String(unit.storageKey));
  }

  async function associate(learner, snapshot, confirmation = {}) {
    if (!snapshot || snapshot.recordType !== "khaemenes.prealgebra.unscoped-unit-evidence") {
      throw new Error("A current Unit 01–13 evidence snapshot is required.");
    }
    if (!(snapshot?.summary?.unitsWithEvidence > 0)) {
      throw new Error("There is no unit evidence to associate yet.");
    }

    const identity = learnerIdentity(learner);
    const store = safeRead();
    if (store.active && String(store.active.learnerId) !== identity.learnerId) {
      throw new Error("This browser evidence set is already associated with another learner. Release that association before choosing a different learner.");
    }

    const evidenceFingerprint = await fingerprint(snapshot);
    const now = new Date().toISOString();
    const association = {
      schema_version: SCHEMA_VERSION,
      record_type: RECORD_TYPE,
      association_id: `pa-unit-${identity.learnerId}-${Date.now()}`,
      learnerId: identity.learnerId,
      learnerName: identity.learnerName,
      confirmedAt: now,
      confirmedByRole: String(confirmation.confirmedByRole || "parent_or_administrator"),
      confirmationText: String(confirmation.confirmationText || "I intentionally associate the current browser-local Pre-Algebra unit evidence with this learner profile."),
      evidenceFingerprint,
      fingerprintMethod: evidenceFingerprint.startsWith("fallback-") ? "local-change-detector" : "SHA-256",
      evidenceSummary: evidenceSummary(snapshot),
      evidenceKeys: evidenceKeys(snapshot),
      sourceRecordType: snapshot.recordType,
      sourceTrustClass: snapshot?.trust?.classification || "unscoped_browser_unit_evidence",
      learnerScopedAfterAssociation: true,
      independentlyAuthenticated: false,
      validatedAcademicRecord: false,
      mutatesSourceEvidence: false,
      authorityNote: "This explicit local association binds browser evidence to a selected learner profile for records continuity. It does not independently authenticate the learner, validate the evidence, or convert the evidence into an institutional record."
    };

    if (store.active) {
      store.history.push({ ...store.active, supersededAt: now, supersededReason: "association_refreshed" });
    }
    store.active = association;
    safeWrite(store);
    return association;
  }

  async function status(snapshot) {
    const store = safeRead();
    if (!store.active) return { state: "unassociated", active: null, currentFingerprint: null, matchesCurrentEvidence: false };
    const currentFingerprint = snapshot ? await fingerprint(snapshot) : null;
    const matches = Boolean(currentFingerprint && currentFingerprint === store.active.evidenceFingerprint);
    return {
      state: matches ? "associated_current" : "associated_evidence_changed",
      active: store.active,
      currentFingerprint,
      matchesCurrentEvidence: matches
    };
  }

  function release(reason = "explicit_release") {
    const store = safeRead();
    if (!store.active) return null;
    const released = {
      ...store.active,
      releasedAt: new Date().toISOString(),
      releasedReason: String(reason || "explicit_release")
    };
    store.history.push(released);
    store.active = null;
    safeWrite(store);
    return released;
  }

  function history() {
    return [...safeRead().history];
  }

  function current() {
    return safeRead().active;
  }

  window.KhaemenesPreAlgebraEvidenceAssociation = Object.freeze({
    storageKey: STORAGE_KEY,
    associate,
    release,
    status,
    history,
    current,
    fingerprint
  });
})();