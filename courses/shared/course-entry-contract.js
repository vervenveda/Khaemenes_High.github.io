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
})();
