(() => {
  "use strict";

  const config = window.ASSESSMENT_CONFIG;
  const scriptEl = document.currentScript;
  const coreSrc = new URL("assessment-engine-core.js", scriptEl?.src || location.href).href;
  const CLASSIFICATION = "public-self-check-nonconfidential";
  const RESULT_SCHEMA = "khaemenes-unit-mastery-result-v3";
  const RECORD_SCHEMA = "1.0";
  const COURSE = Object.freeze({ id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" });
  const UNIT = Object.freeze({ id: "KH-MATH-PA-U01", number: 1, title: "Number Systems, Factors & Estimation" });

  function readJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) ?? fallback : fallback;
    } catch {
      return fallback;
    }
  }

  function currentDraft() {
    const key = config?.storage_key ? `${config.storage_key}-draft` : null;
    if (!key) return { answers: {}, reasoning: {}, saved_at: null };
    const stored = readJSON(key, {}) || {};
    const answers = {};
    const reasoning = {};

    (config?.questions || []).forEach((_, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected) answers[index] = Number(selected.value);
    });

    (config?.reasoning_prompts || []).forEach((_, index) => {
      const field = document.getElementById(`reasoning-${index}`);
      reasoning[index] = field ? field.value.trim() : String(stored.reasoning?.[index] || "");
    });

    return {
      answers: Object.keys(answers).length ? answers : (stored.answers || {}),
      reasoning,
      saved_at: stored.saved_at || null
    };
  }

  function trust() {
    return {
      class: "unscoped_browser_unit_evidence",
      evidence_origin: "canonical_course_engine_evidence",
      storage: "browser_local_course_evidence",
      learner_scoped: false,
      independently_authenticated: false,
      official_record_without_validation: false,
      assessment_classification: CLASSIFICATION,
      note: "This public browser assessment is self-scored local evidence. It is not bound to a learner identity and must not be silently attributed to a learner profile or treated as a validated institutional record."
    };
  }

  function hardenStoredResult() {
    if (!config?.storage_key) return null;
    try {
      const raw = localStorage.getItem(config.storage_key);
      if (!raw) return null;
      const result = JSON.parse(raw);
      if (!result || typeof result !== "object") return null;
      result.result_schema = RESULT_SCHEMA;
      result.assessment_classification = CLASSIFICATION;
      result.trust = {
        classification: "browser-local-self-scored",
        authoritative: false,
        confidential: false,
        cryptographically_verified: false,
        digitally_signed: false,
        editable_storage: true,
        review_required: true
      };
      localStorage.setItem(config.storage_key, JSON.stringify(result));
      return result;
    } catch {
      return null;
    }
  }

  function assessmentResultRecord(result) {
    const percent = Number.isFinite(Number(result?.percent)) ? Number(result.percent) : null;
    const threshold = Number(config?.threshold) || 80;
    return {
      schema_version: RECORD_SCHEMA,
      record_type: "khaemenes.assessment.result-record",
      exported_at: new Date().toISOString(),
      trust: trust(),
      course: COURSE,
      unit: UNIT,
      assessment: {
        id: config?.storage_key || "khaemenes-prealgebra-u01-mastery-v1",
        title: config?.title || "Unit 1 Mastery Check",
        pathway: config?.pathway || "Cumulative Assessment",
        classification: CLASSIFICATION
      },
      mastery: {
        threshold,
        state: percent === null ? "not_assessed" : (percent >= threshold ? "mastered" : "developing"),
        percent,
        passed: percent !== null ? percent >= threshold : false,
        score: Number.isFinite(Number(result?.score)) ? Number(result.score) : null,
        total: Number.isFinite(Number(result?.total)) ? Number(result.total) : null,
        completed_at: result?.completed_at || null
      },
      diagnostic_evidence: {
        domains: result?.domains || {},
        answers: result?.answers || {}
      },
      learner_created_evidence: {
        reasoning: result?.reasoning || {}
      },
      source: {
        storage_key: config?.storage_key || null,
        environment: "public_browser_localStorage",
        result_schema: RESULT_SCHEMA
      }
    };
  }

  function assessmentDraftRecord() {
    const draft = currentDraft();
    return {
      schema_version: RECORD_SCHEMA,
      record_type: "khaemenes.assessment.draft-record",
      exported_at: new Date().toISOString(),
      trust: {
        ...trust(),
        evidence_origin: "learner_created_evidence",
        note: "This is an unfinished assessment draft. It is not scored mastery evidence and must never grant progression or mastery."
      },
      course: COURSE,
      unit: UNIT,
      assessment: {
        id: config?.storage_key || "khaemenes-prealgebra-u01-mastery-v1",
        title: config?.title || "Unit 1 Mastery Check",
        pathway: config?.pathway || "Cumulative Assessment"
      },
      draft: {
        answers: draft.answers || {},
        reasoning: draft.reasoning || {},
        saved_at: draft.saved_at || null
      },
      mastery: {
        threshold: Number(config?.threshold) || 80,
        state: "not_assessed",
        may_grant_mastery: false
      },
      source: {
        storage_key: config?.storage_key ? `${config.storage_key}-draft` : null,
        environment: "public_browser_localStorage"
      }
    };
  }

  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 666);
  }

  function exportNormalized(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const result = hardenStoredResult();
    if (result) {
      downloadJSON("khaemenes-prealgebra-u01-mastery-result.json", assessmentResultRecord(result));
    } else {
      downloadJSON("khaemenes-prealgebra-u01-mastery-draft.json", assessmentDraftRecord());
    }
  }

  function decorate() {
    const submit = document.getElementById("submitButton");
    const exportButton = document.getElementById("exportButton");
    const resultMessage = document.getElementById("resultMessage");
    if (submit && /submit/i.test(submit.textContent)) submit.textContent = "Submit & Self-Check";
    if (exportButton) exportButton.textContent = "Export Learning Record";

    const hero = document.querySelector("main .hero .wrap");
    if (hero && !document.getElementById("masteryTrustNotice")) {
      const notice = document.createElement("p");
      notice.id = "masteryTrustNotice";
      notice.className = "notice";
      notice.innerHTML = "<strong>Learning mastery check:</strong> this public self-check supports the 80% learning gate, corrections, and progress review. Its browser-local result is editable and is not a confidential, digitally signed, or independently authenticated academic record.";
      hero.appendChild(notice);
    }

    if (resultMessage && localStorage.getItem(config?.storage_key || "")) {
      resultMessage.textContent = "Saved locally as an unverified learning-mastery result. Parent/administrator review is required before using it as portfolio evidence.";
    }
  }

  function installGuards() {
    hardenStoredResult();
    decorate();

    const submit = document.getElementById("submitButton");
    const exportButton = document.getElementById("exportButton");

    submit?.addEventListener("click", () => {
      setTimeout(() => {
        hardenStoredResult();
        decorate();
      }, 0);
    });

    exportButton?.addEventListener("click", exportNormalized, true);
  }

  const core = document.createElement("script");
  core.src = coreSrc;
  core.async = false;
  core.onload = installGuards;
  core.onerror = () => {
    const message = document.getElementById("resultMessage");
    if (message) message.textContent = "Assessment engine could not load. Do not submit until the page is refreshed successfully.";
  };
  document.head.appendChild(core);
})();
