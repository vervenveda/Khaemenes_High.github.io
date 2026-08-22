(() => {
  "use strict";

  const config = window.ASSESSMENT_CONFIG;
  const scriptEl = document.currentScript;
  const coreSrc = new URL("assessment-engine-core.js", scriptEl?.src || location.href).href;
  const CLASSIFICATION = "public-self-check-nonconfidential";
  const RESULT_SCHEMA = "khaemenes-unit-mastery-result-v3";
  const NAIB_KEY = "naib:math-prealgebra:course-mastery:u01";

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
      writeNaibProfile(result);
      return result;
    } catch {
      return null;
    }
  }

  function writeNaibProfile(result) {
    if (!result || typeof result !== "object") return;
    const domains = result.domains || {};
    const strand_scores = Object.fromEntries(Object.entries(domains).map(([name, values]) => {
      const total = Number(values?.total) || 0;
      const correct = Number(values?.correct) || 0;
      return [name, total ? Math.round((correct / total) * 100) : 0];
    }));
    const percent = Number.isFinite(Number(result.percent)) ? Number(result.percent) : 0;
    const profile = {
      schema_version: "1.0",
      profile_type: "course_mastery",
      course_id: "math-prealgebra",
      unit_id: "u01",
      assessment_id: "KH-MATH-PA-U01-MASTERY",
      assessment_version: "2026.08.22",
      overall_percent: percent,
      raw_score: Number(result.score) || 0,
      total: Number(result.total) || 20,
      strand_scores,
      strengths: Object.entries(strand_scores).filter(([,v]) => v >= 80).map(([k]) => k),
      refresh_priorities: Object.entries(strand_scores).filter(([,v]) => v < 80).map(([k]) => k),
      mastery_threshold: Number(result.threshold ?? config?.threshold ?? 80),
      mastered: Boolean(result.passed ?? percent >= Number(config?.threshold ?? 80)),
      correction_status: percent >= Number(config?.threshold ?? 80) ? "not_required" : "required",
      source_storage_key: config?.storage_key || null,
      timestamp: result.completed_at || new Date().toISOString(),
      trust: result.trust || null
    };
    localStorage.setItem(NAIB_KEY, JSON.stringify(profile));
  }

  function decorate() {
    const submit = document.getElementById("submitButton");
    const exportButton = document.getElementById("exportButton");
    const resultMessage = document.getElementById("resultMessage");
    if (submit && /submit/i.test(submit.textContent)) submit.textContent = "Submit & Self-Check";
    if (exportButton) exportButton.textContent = "Export Unverified Result";

    const hero = document.querySelector("main .hero .wrap");
    if (hero && !document.getElementById("masteryTrustNotice")) {
      const notice = document.createElement("p");
      notice.id = "masteryTrustNotice";
      notice.className = "notice";
      notice.innerHTML = "<strong>Learning mastery check:</strong> this public self-check supports the 80% learning gate, corrections, progress review, and NAIB skill profiling. Its browser-local result is editable and is not a confidential, digitally signed, or independently authenticated academic record.";
      hero.appendChild(notice);
    }

    if (resultMessage && localStorage.getItem(config?.storage_key || "")) {
      resultMessage.textContent = "Saved locally as an unverified learning-mastery result and synchronized to the local NAIB course-mastery profile. Parent/administrator review is required before using it as portfolio evidence.";
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

    exportButton?.addEventListener("click", () => {
      hardenStoredResult();
    }, true);
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