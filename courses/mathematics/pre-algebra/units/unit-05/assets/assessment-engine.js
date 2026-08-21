(() => {
  "use strict";

  const config = window.ASSESSMENT_CONFIG || {};
  const scriptEl = document.currentScript;
  const coreSrc = new URL("assessment-engine-core.js", scriptEl?.src || location.href).href;
  const CLASSIFICATION = "public-self-check-nonconfidential";
  const RECORD_SCHEMA = "1.0";

  function readJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) ?? fallback : fallback;
    } catch {
      return fallback;
    }
  }

  function unitId() {
    if (config.unit_id) return String(config.unit_id);
    const resourceMatch = String(config.resource_id || "").match(/KH-MATH-PA-U(\d{1,2})/i);
    const storageMatch = String(config.storage_key || "").match(/-u(\d{1,2})-/i);
    const n = Number(resourceMatch?.[1] || storageMatch?.[1]);
    return Number.isFinite(n) && n > 0 ? `KH-MATH-PA-U${String(n).padStart(2, "0")}` : "KH-MATH-PA-UXX";
  }

  function unitNumber() {
    const match = unitId().match(/U(\d{2})$/);
    return match ? Number(match[1]) : null;
  }

  function trust(note) {
    return {
      class: "unscoped_browser_unit_evidence",
      evidence_origin: "canonical_course_engine_evidence",
      storage: "browser_local_course_evidence",
      learner_scoped: false,
      independently_authenticated: false,
      official_record_without_validation: false,
      assessment_classification: CLASSIFICATION,
      note
    };
  }

  function resultRecord(result) {
    const threshold = Number(result?.mastery?.threshold ?? result?.threshold ?? config.threshold) || 80;
    const history = result?.attempt_history || {};
    const latest = Number.isFinite(Number(history.latestScore)) ? Number(history.latestScore) : Number(result?.percent);
    const best = Number.isFinite(Number(history.bestScore)) ? Number(history.bestScore) : latest;
    const first = Number.isFinite(Number(history.firstScore)) ? Number(history.firstScore) : latest;
    const mastered = Number.isFinite(best) ? best >= threshold : Boolean(result?.mastery?.mastered ?? result?.passed);
    const uid = unitId();
    return {
      schema_version: RECORD_SCHEMA,
      record_type: "khaemenes.assessment.result-record",
      exported_at: new Date().toISOString(),
      trust: trust("This public browser assessment is self-scored local evidence. It is not bound to a learner identity and must not be silently attributed to a learner profile or treated as a validated institutional record."),
      course: { id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" },
      unit: { id: uid, number: unitNumber() },
      assessment: {
        id: config.storage_key || null,
        resource_id: result?.resource_id || config.resource_id || `${uid}-MASTERY`,
        title: config.title || result?.title || "Unit Mastery Check",
        pathway: config.pathway || result?.pathway || "Cumulative Assessment",
        assessment_version: result?.assessment_version || config.assessment_version || "1.0",
        classification: CLASSIFICATION
      },
      mastery: {
        threshold,
        state: mastered ? "mastered" : (Number.isFinite(latest) ? "developing" : "not_assessed"),
        mastered,
        mastered_at: history.masteredAt || result?.mastery?.mastered_at || null,
        first_score: Number.isFinite(first) ? first : null,
        latest_score: Number.isFinite(latest) ? latest : null,
        best_score: Number.isFinite(best) ? best : null,
        attempt_count: Number(history.attemptCount) || (Number.isFinite(latest) ? 1 : 0),
        latest_passed: Number.isFinite(latest) ? latest >= threshold : false
      },
      diagnostic_evidence: {
        domains: result?.domains || {},
        skills: result?.skills || {},
        items: Array.isArray(result?.item_evidence) ? result.item_evidence : [],
        program_signal: result?.program_signal || null
      },
      learner_created_evidence: { reasoning: result?.reasoning || {} },
      attempt_history: Array.isArray(history.attempts) ? history.attempts : [],
      source: {
        storage_key: config.storage_key || null,
        environment: "public_browser_localStorage",
        result_schema: result?.result_schema || null
      }
    };
  }

  function draftRecord() {
    const stored = readJSON(config.storage_key ? `${config.storage_key}-draft` : "", {}) || {};
    const answers = {};
    const reasoning = {};
    (config.questions || []).forEach((_, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected) answers[index] = Number(selected.value);
    });
    (config.reasoning_prompts || []).forEach((_, index) => {
      const field = document.getElementById(`reasoning-${index}`);
      reasoning[index] = field ? field.value.trim() : String(stored.reasoning?.[index] || "");
    });
    return {
      schema_version: RECORD_SCHEMA,
      record_type: "khaemenes.assessment.draft-record",
      exported_at: new Date().toISOString(),
      trust: {
        ...trust("This is an unfinished assessment draft. It is not scored mastery evidence and must never grant progression or mastery."),
        evidence_origin: "learner_created_evidence"
      },
      course: { id: "KH-MATH-PA", title: "Khaemenes Global Pre-Algebra" },
      unit: { id: unitId(), number: unitNumber() },
      assessment: { id: config.storage_key || null, title: config.title || "Unit Mastery Check", pathway: config.pathway || "Cumulative Assessment" },
      draft: {
        answers: Object.keys(answers).length ? answers : (stored.answers || {}),
        reasoning,
        saved_at: stored.saved_at || null
      },
      mastery: { threshold: Number(config.threshold) || 80, state: "not_assessed", may_grant_mastery: false },
      source: { storage_key: config.storage_key ? `${config.storage_key}-draft` : null, environment: "public_browser_localStorage" }
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
    const result = config.storage_key ? readJSON(config.storage_key, null) : null;
    const number = String(unitNumber() || "XX").padStart(2, "0");
    if (result && Number.isFinite(Number(result.percent))) {
      downloadJSON(`khaemenes-prealgebra-u${number}-mastery-result.json`, resultRecord(result));
    } else {
      downloadJSON(`khaemenes-prealgebra-u${number}-mastery-draft.json`, draftRecord());
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
      notice.innerHTML = "<strong>Learning mastery check:</strong> this public self-check supports the 80% learning gate, corrections, and progress review. Browser-local results are editable and are not confidential, digitally signed, or independently authenticated academic records.";
      hero.appendChild(notice);
    }
    const saved = config.storage_key ? readJSON(config.storage_key, null) : null;
    if (resultMessage && saved?.attempt_history) {
      const h = saved.attempt_history;
      resultMessage.textContent = `Saved locally · latest ${h.latestScore ?? "—"}% · best ${h.bestScore ?? "—"}% · ${h.attemptCount || 0} attempt(s).`;
    }
  }

  function installGuards() {
    decorate();
    document.getElementById("submitButton")?.addEventListener("click", () => setTimeout(decorate, 0));
    document.getElementById("resetButton")?.addEventListener("click", () => setTimeout(decorate, 0));
    document.getElementById("exportButton")?.addEventListener("click", exportNormalized, true);
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
