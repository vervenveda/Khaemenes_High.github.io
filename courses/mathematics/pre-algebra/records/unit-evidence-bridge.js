"use strict";

/* =========================================================
   KHAEMENES PRE-ALGEBRA · RECORDS UNIT EVIDENCE BRIDGE
   Reads browser-local Unit 01–13 lesson mastery evidence.
   IMPORTANT: current unit keys are not learner-scoped.
   This bridge never auto-assigns unit evidence to a learner.
   ========================================================= */

(() => {
  const COURSE_CODE = "KH-MATH-PA";
  const MASTERY_THRESHOLD = 80;
  const UNIT_MIN = 1;
  const UNIT_MAX = 13;

  const numeric = value => {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };

  const safeRead = key => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(`[Pre-Algebra Records Bridge] Could not read ${key}.`, error);
      return null;
    }
  };

  const keyForUnit = unitNumber =>
    `khaemenes-prealgebra-unit${String(unitNumber).padStart(2, "0")}-progress-v1`;

  function normalizeAttempt(raw, fallbackScore = null) {
    const attempt = raw && typeof raw === "object" ? raw : {};
    const fallback = numeric(fallbackScore);
    const first = numeric(attempt.firstScore);
    const latest = numeric(attempt.latestScore);
    const best = numeric(attempt.bestScore);
    const count = Number(attempt.attemptCount);

    return {
      firstScore: first !== null ? first : fallback,
      latestScore: latest !== null ? latest : fallback,
      bestScore: best !== null ? best : fallback,
      attemptCount: Number.isInteger(count) && count > 0 ? count : (fallback !== null ? 1 : 0),
      masteredAt: typeof attempt.masteredAt === "string" && attempt.masteredAt ? attempt.masteredAt : null
    };
  }

  function collectUnit(unitNumber) {
    const storageKey = keyForUnit(unitNumber);
    const raw = safeRead(storageKey);

    if (!raw || typeof raw !== "object") {
      return {
        unitNumber,
        storageKey,
        hasEvidence: false,
        learnerScoped: false,
        trustClass: "unscoped_browser_unit_evidence",
        lessons: [],
        reviewedLessons: []
      };
    }

    const lessonScores = raw.lessonScores && typeof raw.lessonScores === "object" ? raw.lessonScores : {};
    const lessonAttempts = raw.lessonAttempts && typeof raw.lessonAttempts === "object" ? raw.lessonAttempts : {};
    const reviewed = Array.isArray(raw.reviewedLessons) ? [...new Set(raw.reviewedLessons)] : [];
    const completed = new Set(Array.isArray(raw.completedLessons) ? raw.completedLessons : []);
    const lessonIds = new Set([...Object.keys(lessonScores), ...Object.keys(lessonAttempts), ...completed, ...reviewed]);

    const lessons = [...lessonIds].sort().map(lessonId => {
      const attempt = normalizeAttempt(lessonAttempts[lessonId], lessonScores[lessonId]);
      const best = numeric(attempt.bestScore);
      const latest = numeric(attempt.latestScore);
      const mastered = best !== null && best >= MASTERY_THRESHOLD;

      return {
        lessonId,
        latestScore: latest,
        bestScore: best,
        firstScore: numeric(attempt.firstScore),
        attemptCount: attempt.attemptCount,
        masteredAt: attempt.masteredAt,
        mastered,
        reviewed: reviewed.includes(lessonId)
      };
    });

    return {
      unitNumber,
      storageKey,
      hasEvidence: lessons.length > 0,
      learnerScoped: false,
      trustClass: "unscoped_browser_unit_evidence",
      pathway: typeof raw.pathway === "string" ? raw.pathway : null,
      lessons,
      reviewedLessons: reviewed,
      summary: {
        lessonsWithEvidence: lessons.filter(item => item.bestScore !== null || item.latestScore !== null).length,
        masteredLessons: lessons.filter(item => item.mastered).length,
        reviewedLessons: lessons.filter(item => item.reviewed).length,
        totalAttempts: lessons.reduce((sum, item) => sum + item.attemptCount, 0)
      }
    };
  }

  function collectAll() {
    const units = [];
    for (let unit = UNIT_MIN; unit <= UNIT_MAX; unit += 1) units.push(collectUnit(unit));

    const unitsWithEvidence = units.filter(item => item.hasEvidence);
    const lessons = unitsWithEvidence.flatMap(unit => unit.lessons);
    const scored = lessons.filter(item => item.bestScore !== null);

    return {
      schemaVersion: "1.0",
      recordType: "khaemenes.prealgebra.unscoped-unit-evidence",
      courseCode: COURSE_CODE,
      collectedAt: new Date().toISOString(),
      trust: {
        classification: "unscoped_browser_unit_evidence",
        source: "browser-localStorage",
        learnerScoped: false,
        independentlyAuthenticated: false,
        mayAutoAttachToLearner: false,
        note: "Unit evidence is stored under browser-level keys without a learner identifier. Review or explicitly adopt it before associating it with a learner record."
      },
      masteryThreshold: MASTERY_THRESHOLD,
      units,
      summary: {
        unitsWithEvidence: unitsWithEvidence.length,
        lessonsWithEvidence: scored.length,
        masteredLessons: scored.filter(item => item.mastered).length,
        reviewedLessons: lessons.filter(item => item.reviewed).length,
        totalAttempts: lessons.reduce((sum, item) => sum + item.attemptCount, 0),
        bestScoreAverage: scored.length
          ? Math.round(scored.reduce((sum, item) => sum + Number(item.bestScore || 0), 0) / scored.length)
          : null
      }
    };
  }

  window.KhaemenesPreAlgebraUnitEvidence = Object.freeze({
    collectUnit,
    collectAll,
    keyForUnit,
    trustClass: "unscoped_browser_unit_evidence"
  });
})();
