(() => {
  "use strict";

  const config = window.ASSESSMENT_CONFIG;
  const scriptEl = document.currentScript;
  const coreSrc = new URL("assessment-engine-core.js", scriptEl?.src || location.href).href;
  const CLASSIFICATION = "public-self-check-nonconfidential";
  const RESULT_SCHEMA = "khaemenes-unit-mastery-result-v3";

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
