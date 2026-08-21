"use strict";

/* Khaemenes Pre-Algebra · PA-13.2 lesson learning-record builder
   Pure helper: builds a portable record object but grants no authority. */

window.KHAEMENES_LESSON_RECORDS = Object.freeze({
  schemaVersion: "1.0",
  recordType: "khaemenes.lesson.learning-record",

  build({ course, unit, lesson, pathway, threshold, attempt, completed, reviewed, notes = "", reflection = "", sourceKey = null }) {
    const first = attempt && Number.isFinite(Number(attempt.firstScore)) ? Number(attempt.firstScore) : null;
    const latest = attempt && Number.isFinite(Number(attempt.latestScore)) ? Number(attempt.latestScore) : null;
    const best = attempt && Number.isFinite(Number(attempt.bestScore)) ? Number(attempt.bestScore) : null;
    const count = attempt && Number.isInteger(Number(attempt.attemptCount)) ? Number(attempt.attemptCount) : 0;
    const masteredAt = attempt && typeof attempt.masteredAt === "string" && attempt.masteredAt ? attempt.masteredAt : null;
    const masteryState = completed ? "mastered" : (latest !== null ? "developing" : "not_assessed");

    return {
      schema_version: this.schemaVersion,
      record_type: this.recordType,
      exported_at: new Date().toISOString(),
      trust: {
        class: "unscoped_browser_unit_evidence",
        evidence_origin: "canonical_course_engine_evidence",
        storage: "browser_local_course_evidence",
        learner_scoped: false,
        independently_authenticated: false,
        official_record_without_validation: false,
        note: "This export reflects local course-engine evidence but is not bound to a learner identity and must not be silently attributed to a learner profile."
      },
      course: course || { id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" },
      unit: unit || null,
      lesson: lesson || null,
      pathway: pathway || "Core",
      mastery: {
        threshold: Number(threshold) || 80,
        state: masteryState,
        first_score: first,
        latest_score: latest,
        best_score: best,
        attempt_count: count,
        mastered_at: masteredAt
      },
      reviewed: Boolean(reviewed),
      learner_created_evidence: {
        notes: String(notes || ""),
        reflection: String(reflection || "")
      },
      source: {
        progress_key: sourceKey,
        environment: "public_browser_localStorage"
      }
    };
  }
});
