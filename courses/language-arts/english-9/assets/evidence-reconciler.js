(function (global, factory) {
  "use strict";
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.KhaemenesELA9Evidence = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CANONICAL_KEY = "khae-ela9-mastery-v2";
  const CONTRACT_VERSION = "1.0.0";

  const finiteScore = value => {
    const score = Number(value);
    return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
  };

  const readJSON = (storage, key) => {
    try {
      const parsed = JSON.parse(storage.getItem(key) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const summarizeUnit = (id, record = {}) => {
    const threshold = finiteScore(record.threshold) ?? 80;
    const lessonIds = Array.from(new Set(Array.isArray(record.lessonIds) ? record.lessonIds.filter(Boolean).map(String) : []));
    const attempts = record.lessonAttempts && typeof record.lessonAttempts === "object" ? record.lessonAttempts : {};
    const legacyScores = record.lessonScores && typeof record.lessonScores === "object" ? record.lessonScores : {};
    const scores = lessonIds.map(lessonId => ({
      lessonId,
      bestScore: finiteScore(attempts[lessonId]?.bestScore) ?? finiteScore(legacyScores[lessonId]),
      attemptCount: Math.max(0, Number(attempts[lessonId]?.attemptCount) || (finiteScore(legacyScores[lessonId]) !== null ? 1 : 0)),
      masteredAt: attempts[lessonId]?.masteredAt || null
    }));
    const recorded = scores.filter(item => item.bestScore !== null);
    const mastered = recorded.filter(item => item.bestScore >= threshold);
    const masteryVerified = lessonIds.length > 0 && mastered.length === lessonIds.length;
    return {
      id,
      threshold,
      lessonCount: lessonIds.length,
      scoredCount: recorded.length,
      masteredCount: mastered.length,
      bestScoreAverage: recorded.length ? Math.round(recorded.reduce((sum, item) => sum + item.bestScore, 0) / recorded.length) : null,
      masteryVerified,
      status: masteryVerified ? "mastered" : recorded.length ? "in-progress" : "not-started",
      masteredAt: masteryVerified ? (record.masteredAt || null) : null,
      lessons: scores
    };
  };

  const summarizeCanonical = canonicalState => {
    const units = canonicalState?.units && typeof canonicalState.units === "object" ? canonicalState.units : {};
    const records = Object.keys(units).sort().map(id => summarizeUnit(id, units[id]));
    return {
      source: "canonical-coursebook-evidence",
      authority: "mastery",
      learnerAttribution: "unverified-browser-local",
      mayAttributeToActivePortalStudent: false,
      units: records,
      masteredUnits: records.filter(unit => unit.masteryVerified).length,
      unitsWithEvidence: records.filter(unit => unit.scoredCount > 0).length
    };
  };

  const summarizeHistoricalActivity = (student, weeks = []) => {
    const progress = student?.progress || {};
    const weekRecords = progress.weeks || {};
    let reviewedLessons = 0;
    let quizAttempts = 0;
    const quizBestScores = [];
    for (const week of weeks) {
      const record = weekRecords[week.week] || weekRecords[String(week.week)] || {};
      reviewedLessons += Object.values(record.lessons || {}).filter(Boolean).length;
      quizAttempts += Array.isArray(record.quiz?.attempts) ? record.quiz.attempts.length : 0;
      const best = finiteScore(record.quiz?.best);
      if (best !== null) quizBestScores.push(best);
    }
    return {
      source: "legacy-portal-activity",
      authority: "practice-history-only",
      reviewedLessons,
      totalPlannedLessons: weeks.length * 5,
      quizAttempts,
      practiceQuizBestAverage: quizBestScores.length ? Math.round(quizBestScores.reduce((sum, score) => sum + score, 0) / quizBestScores.length) : null,
      midtermPracticeBest: finiteScore(progress.exams?.midterm?.best),
      finalPracticeBest: finiteScore(progress.exams?.final?.best),
      mayAwardMastery: false,
      mayUnlockProgression: false,
      mayOverwriteCanonicalEvidence: false
    };
  };

  const buildSnapshot = ({ canonicalState = {}, student = null, weeks = [] } = {}) => ({
    schema: "khaemenes.english9.evidence-snapshot",
    version: CONTRACT_VERSION,
    generatedAt: new Date().toISOString(),
    authorityStatement: "Canonical coursebook evidence determines mastery. Historical portal activity documents practice and review only. Browser-local coursebook evidence must not be attributed to a named learner until learner identity is verified.",
    canonical: summarizeCanonical(canonicalState),
    historicalActivity: summarizeHistoricalActivity(student, weeks)
  });

  const fromStorage = (storage, student, weeks) => buildSnapshot({
    canonicalState: readJSON(storage, CANONICAL_KEY),
    student,
    weeks
  });

  return { CANONICAL_KEY, CONTRACT_VERSION, finiteScore, summarizeUnit, summarizeCanonical, summarizeHistoricalActivity, buildSnapshot, fromStorage };
});
