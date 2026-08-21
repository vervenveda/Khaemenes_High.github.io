"use strict";

/* Khaemenes Pre-Algebra · PA-13.2
   Normalizes legacy browser exports without granting additional authority. */

window.KHAEMENES_RECORD_NORMALIZER = Object.freeze({
  schemaVersion: "1.0",

  trust(note) {
    return {
      class: "unscoped_browser_unit_evidence",
      evidence_origin: "canonical_course_engine_evidence",
      storage: "browser_local_course_evidence",
      learner_scoped: false,
      independently_authenticated: false,
      official_record_without_validation: false,
      note
    };
  },

  numeric(value) {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  },

  normalizeLesson(payload = {}) {
    if (payload?.record_type === "khaemenes.lesson.learning-record") return payload;

    const attempt = payload.attempt && typeof payload.attempt === "object" ? payload.attempt : {};
    const latest = this.numeric(attempt.latestScore ?? payload.score);
    const first = this.numeric(attempt.firstScore ?? payload.score);
    const best = this.numeric(attempt.bestScore ?? payload.score);
    const threshold = this.numeric(payload.mastery_threshold) ?? 80;
    const completed = Boolean(payload.completed || (best !== null && best >= threshold));

    return {
      schema_version: this.schemaVersion,
      record_type: "khaemenes.lesson.learning-record",
      exported_at: payload.exported_at || new Date().toISOString(),
      trust: this.trust("Normalized from a legacy Unit 01 browser lesson export. The source evidence remains unscoped, browser-local, editable, and not independently authenticated."),
      course: payload.course || { id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" },
      unit: payload.unit || { id: "KH-MATH-PA-U01", number: 1, title: "Number Systems, Factors & Estimation" },
      lesson: payload.lesson || null,
      pathway: payload.pathway || "Core",
      mastery: {
        threshold,
        state: completed ? "mastered" : (latest !== null ? "developing" : "not_assessed"),
        first_score: first,
        latest_score: latest,
        best_score: best,
        attempt_count: Number.isInteger(Number(attempt.attemptCount)) ? Number(attempt.attemptCount) : (latest !== null ? 1 : 0),
        mastered_at: typeof attempt.masteredAt === "string" && attempt.masteredAt ? attempt.masteredAt : null
      },
      reviewed: Boolean(payload.reviewed),
      learner_created_evidence: {
        notes: String(payload.notes || ""),
        reflection: String(payload.reflection || "")
      },
      source: {
        progress_key: "khaemenes-prealgebra-unit01-progress-v1",
        environment: "public_browser_localStorage",
        normalized_from_schema: payload.schema_version || null
      }
    };
  },

  normalizeAssessment(payload = {}) {
    if (payload?.record_type === "khaemenes.assessment.result-record" || payload?.record_type === "khaemenes.assessment.draft-record") return payload;

    const threshold = this.numeric(payload.threshold) ?? 80;
    const percent = this.numeric(payload.percent);
    const hasScoredResult = percent !== null && (payload.completed_at || payload.score !== undefined || payload.passed !== undefined);

    if (!hasScoredResult) {
      const draft = payload.draft && typeof payload.draft === "object" ? payload.draft : payload;
      return {
        schema_version: this.schemaVersion,
        record_type: "khaemenes.assessment.draft-record",
        exported_at: payload.exported_at || new Date().toISOString(),
        trust: {
          ...this.trust("Normalized from an unfinished legacy assessment export. Draft evidence can never grant mastery."),
          evidence_origin: "learner_created_evidence"
        },
        course: { id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" },
        unit: { id: "KH-MATH-PA-U01", number: 1, title: "Number Systems, Factors & Estimation" },
        assessment: {
          id: "khaemenes-prealgebra-u01-mastery-v1",
          title: payload.title || "Unit 1 Mastery Check",
          pathway: payload.pathway || "Cumulative Assessment"
        },
        draft: {
          answers: draft.answers || {},
          reasoning: draft.reasoning || {},
          saved_at: draft.saved_at || null
        },
        mastery: { threshold, state: "not_assessed", may_grant_mastery: false },
        source: { environment: "public_browser_localStorage", normalized_from_schema: payload.schema_version || null }
      };
    }

    return {
      schema_version: this.schemaVersion,
      record_type: "khaemenes.assessment.result-record",
      exported_at: payload.exported_at || new Date().toISOString(),
      trust: this.trust("Normalized from a legacy public browser self-scored assessment result. It remains unscoped and is not a validated institutional record."),
      course: { id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" },
      unit: { id: "KH-MATH-PA-U01", number: 1, title: "Number Systems, Factors & Estimation" },
      assessment: {
        id: "khaemenes-prealgebra-u01-mastery-v1",
        title: payload.title || "Unit 1 Mastery Check",
        pathway: payload.pathway || "Cumulative Assessment",
        classification: payload.assessment_classification || "public-self-check-nonconfidential"
      },
      mastery: {
        threshold,
        state: percent >= threshold ? "mastered" : "developing",
        percent,
        passed: percent >= threshold,
        score: this.numeric(payload.score),
        total: this.numeric(payload.total),
        completed_at: payload.completed_at || null
      },
      diagnostic_evidence: {
        domains: payload.domains || {},
        answers: payload.answers || {}
      },
      learner_created_evidence: { reasoning: payload.reasoning || {} },
      source: { environment: "public_browser_localStorage", normalized_from_schema: payload.schema_version || null }
    };
  },

  normalize(payload = {}) {
    if (payload?.record_type) return payload;
    if (payload?.lesson || payload?.attempt || Object.prototype.hasOwnProperty.call(payload, "completed")) return this.normalizeLesson(payload);
    return this.normalizeAssessment(payload);
  }
});
