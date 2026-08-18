"use strict";

/* =========================================================
   KHAEMENES HIGH · PRE-ALGEBRA
   SHARED ASSESSMENT ENGINE
   Sacred scale: 3 · 7 · 11 · 14 · 24 · 33 · 55 · 66
   ========================================================= */

(() => {
  const config = window.ASSESSMENT_CONFIG;

  if (!config) {
    console.error("[Assessment Engine] ASSESSMENT_CONFIG is missing.");
    return;
  }

  const SETTINGS = Object.freeze({
    themeKey: "khaemenes-theme",
    fallbackThreshold: 80,
    cleanupDelay: 666
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const storageKey = String(config.storage_key || "khaemenes-assessment");
  const draftKey = `${storageKey}-draft`;

  const threshold = Number.isFinite(Number(config.threshold))
    ? Math.max(1, Math.min(100, Number(config.threshold)))
    : SETTINGS.fallbackThreshold;

  /* ---------------------------------------------------------
     STORAGE
     --------------------------------------------------------- */

  function loadJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) ?? fallback : fallback;
    } catch (error) {
      console.warn(`[Assessment Engine] Could not read ${key}.`, error);
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[Assessment Engine] Could not save ${key}.`, error);
      return false;
    }
  }

  function removeStored(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Assessment Engine] Could not remove ${key}.`, error);
    }
  }

  /* ---------------------------------------------------------
     THEME
     --------------------------------------------------------- */

  function preferredTheme() {
    try {
      const saved = localStorage.getItem(SETTINGS.themeKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch {}

    return window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function setTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem(SETTINGS.themeKey, next);
    } catch {}

    const button = $("#themeToggle");
    if (button) {
      button.setAttribute(
        "aria-label",
        next === "light"
          ? "Switch to dark theme"
          : "Switch to light theme"
      );
      button.setAttribute(
        "title",
        next === "light"
          ? "Dark theme"
          : "Light theme"
      );
    }
  }

  function initTheme() {
    setTheme(preferredTheme());

    $("#themeToggle")?.addEventListener("click", () => {
      setTheme(
        document.documentElement.dataset.theme === "light"
          ? "dark"
          : "light"
      );
    });
  }

  /* ---------------------------------------------------------
     DRAFT / EXISTING RECORD
     --------------------------------------------------------- */

  function getDraft() {
    const draft = loadJSON(draftKey, {
      answers: {},
      reasoning: {}
    });

    if (!draft || typeof draft !== "object") {
      return { answers: {}, reasoning: {} };
    }

    return {
      answers:
        draft.answers && typeof draft.answers === "object"
          ? draft.answers
          : {},
      reasoning:
        draft.reasoning && typeof draft.reasoning === "object"
          ? draft.reasoning
          : {},
      saved_at: draft.saved_at || null
    };
  }

  function getExistingResult() {
    const result = loadJSON(storageKey, null);
    if (!result || typeof result !== "object") return null;

    const total = Number(result.total) || config.questions.length || 0;
    const score = Number(result.score) || 0;

    const percent = Number.isFinite(Number(result.percent))
      ? Math.max(0, Math.min(100, Number(result.percent)))
      : total > 0
        ? Math.round((score / total) * 100)
        : 0;

    return {
      ...result,
      score,
      total,
      percent,
      threshold,
      passed: percent >= threshold
    };
  }

  /* ---------------------------------------------------------
     RENDER
     --------------------------------------------------------- */

  function render() {
    const draft = getDraft();

    renderQuestions(draft);
    renderReasoning(draft);
    updateDots();
    renderThresholdLanguage();

    const existing = getExistingResult();
    if (existing) {
      showResult(existing, false);
      revealFeedback(existing);
    }
  }

  function renderQuestions(draft) {
    const target = $("#questionList");
    if (!target) return;

    const questions = Array.isArray(config.questions)
      ? config.questions
      : [];

    target.innerHTML = questions
      .map((question, index) => {
        const savedValue = Number(draft.answers?.[index]);

        const options = Array.isArray(question.options)
          ? question.options
          : [];

        return `
          <article
            class="question"
            data-question="${index}"
          >
            <fieldset>
              <legend>
                <span class="question-number">${index + 1}</span>
                ${escapeHTML(question.prompt)}
              </legend>

              <div class="options">
                ${options
                  .map((option, optionIndex) => `
                    <label class="option">
                      <input
                        type="radio"
                        name="q${index}"
                        value="${optionIndex}"
                        ${savedValue === optionIndex ? "checked" : ""}
                      >
                      <span>${escapeHTML(option)}</span>
                    </label>
                  `)
                  .join("")}
              </div>

              ${
                config.show_hints && question.hint
                  ? `
                    <button
                      class="hint-button"
                      type="button"
                      data-hint="${index}"
                      aria-expanded="false"
                      aria-controls="hint-${index}"
                    >
                      Show Hint
                    </button>

                    <p
                      class="hint"
                      id="hint-${index}"
                      hidden
                    >
                      ${escapeHTML(question.hint)}
                    </p>
                  `
                  : ""
              }

              <div
                class="feedback"
                id="feedback-${index}"
                role="status"
                aria-live="polite"
                hidden
              ></div>
            </fieldset>
          </article>
        `;
      })
      .join("");
  }

  function renderReasoning(draft) {
    const target = $("#reasoningSection");
    if (!target) return;

    const prompts = Array.isArray(config.reasoning_prompts)
      ? config.reasoning_prompts
      : [];

    if (!prompts.length) {
      target.hidden = true;
      target.innerHTML = "";
      return;
    }

    target.hidden = false;

    target.innerHTML = `
      <h2>Reasoning Reflection</h2>
      <p class="small">
        Use these prompts to think about strengths, weak areas, and next steps.
      </p>

      <div class="reasoning-grid">
        ${prompts
          .map((prompt, index) => `
            <div class="field">
              <label for="reasoning-${index}">
                ${escapeHTML(prompt)}
              </label>

              <textarea
                id="reasoning-${index}"
                data-reasoning="${index}"
              >${escapeHTML(draft.reasoning?.[index] || "")}</textarea>
            </div>
          `)
          .join("")}
      </div>
    `;
  }

  function renderThresholdLanguage() {
    $$("[data-mastery-threshold]").forEach(node => {
      node.textContent = `${threshold}%`;
    });
  }

  /* ---------------------------------------------------------
     ANSWERS / REASONING
     --------------------------------------------------------- */

  function currentAnswers() {
    const answers = {};

    (config.questions || []).forEach((_, index) => {
      const selected =
        document.querySelector(`input[name="q${index}"]:checked`);

      if (selected) {
        answers[index] = Number(selected.value);
      }
    });

    return answers;
  }

  function currentReasoning() {
    const reasoning = {};

    (config.reasoning_prompts || []).forEach((_, index) => {
      const field = $(`#reasoning-${index}`);
      reasoning[index] = field ? field.value.trim() : "";
    });

    return reasoning;
  }

  /* ---------------------------------------------------------
     PROGRESS DOTS
     --------------------------------------------------------- */

  function updateDots() {
    const grid = $("#dotGrid");
    if (!grid) return;

    const answers = currentAnswers();
    const questions = Array.isArray(config.questions)
      ? config.questions
      : [];

    grid.innerHTML = questions
      .map((_, index) => {
        const answered = Object.prototype.hasOwnProperty.call(
          answers,
          index
        );

        return `
          <span
            class="dot ${answered ? "answered" : ""}"
            aria-label="Question ${index + 1}${answered ? ", answered" : ", unanswered"}"
          >
            ${index + 1}
          </span>
        `;
      })
      .join("");
  }

  /* ---------------------------------------------------------
     CALCULATION
     --------------------------------------------------------- */

  function calculate() {
    const questions = Array.isArray(config.questions)
      ? config.questions
      : [];

    const answers = currentAnswers();

    if (Object.keys(answers).length !== questions.length) {
      return null;
    }

    let correct = 0;
    const domains = {};

    questions.forEach((question, index) => {
      const isCorrect =
        answers[index] === Number(question.answer);

      if (isCorrect) correct += 1;

      const domain = question.domain || "General";

      if (!domains[domain]) {
        domains[domain] = {
          correct: 0,
          total: 0
        };
      }

      domains[domain].total += 1;

      if (isCorrect) {
        domains[domain].correct += 1;
      }
    });

    const total = questions.length;
    const percent =
      total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    return {
      schema_version: "2.0",
      title: config.title || "Assessment",
      pathway: config.pathway || "Assessment",
      score: correct,
      total,
      percent,
      passed: percent >= threshold,
      threshold,
      answers,
      reasoning: currentReasoning(),
      domains,
      completed_at: new Date().toISOString()
    };
  }

  /* ---------------------------------------------------------
     SUBMIT / FEEDBACK
     --------------------------------------------------------- */

  function revealFeedback(result) {
    const questions = Array.isArray(config.questions)
      ? config.questions
      : [];

    questions.forEach((question, index) => {
      const feedback = $(`#feedback-${index}`);
      if (!feedback) return;

      const isCorrect =
        Number(result.answers?.[index]) === Number(question.answer);

      feedback.hidden = false;
      feedback.className =
        `feedback ${isCorrect ? "correct" : "incorrect"}`;

      feedback.textContent =
        `${isCorrect ? "Correct." : "Review."} ${question.explanation || ""}`;
    });
  }

  function submit() {
    const result = calculate();

    if (!result) {
      setMessage(
        "#resultMessage",
        "Answer every scored question before submitting."
      );
      return;
    }

    revealFeedback(result);

    saveJSON(storageKey, result);
    removeStored(draftKey);

    showResult(result, true);
  }

  /* ---------------------------------------------------------
     RESULTS
     --------------------------------------------------------- */

  function showResult(result, shouldScroll = false) {
    const section = $("#results");
    if (!section) return;

    section.hidden = false;

    const score = $("#resultScore");
    if (score) {
      score.textContent = `${result.score} / ${result.total}`;
    }

    const title = $("#resultTitle");
    if (title) {
      title.textContent =
        result.passed
          ? "Mastery Reached"
          : "Review Required";
    }

    const summary = $("#resultSummary");
    if (summary) {
      summary.textContent =
        `${result.percent}% · mastery threshold ${threshold}%. ` +
        (
          result.passed
            ? "You met the mastery standard. Review missed explanations before continuing."
            : `You need ${threshold}% to advance. Review the lowest domains, practice again, and retake the assessment.`
        );
    }

    renderDomainResults(result.domains);

    setMessage(
      "#resultMessage",
      `Saved locally: ${formatDate(result.completed_at)}`
    );

    if (shouldScroll) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function renderDomainResults(domains) {
    const target = $("#domainGrid");
    if (!target) return;

    target.innerHTML = Object.entries(domains || {})
      .map(([domain, values]) => {
        const percent =
          values.total > 0
            ? Math.round((values.correct / values.total) * 100)
            : 0;

        let status = "Developing";

        if (percent === 100) status = "Secure on this check";
        else if (percent === 0) status = "Priority review";
        else if (percent >= threshold) status = "Mastery range";

        return `
          <article class="card domain-card">
            <strong>${values.correct}/${values.total}</strong>
            <h3>${escapeHTML(domain)}</h3>
            <p>${status}</p>
          </article>
        `;
      })
      .join("");
  }

  /* ---------------------------------------------------------
     DRAFT
     --------------------------------------------------------- */

  function saveDraft() {
    const draft = {
      schema_version: "2.0",
      answers: currentAnswers(),
      reasoning: currentReasoning(),
      saved_at: new Date().toISOString()
    };

    saveJSON(draftKey, draft);

    setMessage(
      "#resultMessage",
      "Draft saved in this browser."
    );
  }

  /* ---------------------------------------------------------
     RESET
     --------------------------------------------------------- */

  function resetAssessment() {
    const confirmed = window.confirm(
      "Clear this assessment, saved draft, answers, and result from this browser?"
    );

    if (!confirmed) return;

    removeStored(storageKey);
    removeStored(draftKey);

    const results = $("#results");
    if (results) results.hidden = true;

    render();

    setMessage(
      "#resultMessage",
      "Assessment reset complete."
    );
  }

  /* ---------------------------------------------------------
     EXPORT
     --------------------------------------------------------- */

  function downloadJSON(filename, data) {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(
      () => URL.revokeObjectURL(url),
      SETTINGS.cleanupDelay
    );
  }

  function exportAssessment() {
    const result = getExistingResult();

    const payload =
      result ||
      {
        schema_version: "2.0",
        title: config.title || "Assessment",
        pathway: config.pathway || "Assessment",
        threshold,
        draft: {
          answers: currentAnswers(),
          reasoning: currentReasoning()
        },
        exported_at: new Date().toISOString()
      };

    downloadJSON(`${storageKey}.json`, payload);
  }

  /* ---------------------------------------------------------
     HINTS
     --------------------------------------------------------- */

  function toggleHint(button) {
    const index = button.dataset.hint;
    const hint = $(`#hint-${index}`);

    if (!hint) return;

    hint.hidden = !hint.hidden;

    button.textContent =
      hint.hidden ? "Show Hint" : "Hide Hint";

    button.setAttribute(
      "aria-expanded",
      String(!hint.hidden)
    );
  }

  /* ---------------------------------------------------------
     UTILITIES
     --------------------------------------------------------- */

  function setMessage(selector, message) {
    const target = $(selector);
    if (target) target.textContent = message;
  }

  function formatDate(value) {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value || "saved";
    }
  }

  /* ---------------------------------------------------------
     EVENTS
     --------------------------------------------------------- */

  function bindEvents() {
    $("#questionList")?.addEventListener(
      "change",
      updateDots
    );

    $("#questionList")?.addEventListener(
      "click",
      event => {
        const button = event.target.closest("[data-hint]");
        if (!button) return;
        toggleHint(button);
      }
    );

    $("#submitButton")?.addEventListener(
      "click",
      () => {
        const confirmed = window.confirm(
          `Submit this assessment and reveal explanations?\n\nA score of ${threshold}% is required for mastery.`
        );

        if (confirmed) submit();
      }
    );

    $("#saveDraft")?.addEventListener(
      "click",
      saveDraft
    );

    $("#resetButton")?.addEventListener(
      "click",
      resetAssessment
    );

    $("#exportButton")?.addEventListener(
      "click",
      exportAssessment
    );

    $("#printPage")?.addEventListener(
      "click",
      () => window.print()
    );
  }

  /* ---------------------------------------------------------
     INITIALIZE
     --------------------------------------------------------- */

  function init() {
    initTheme();
    bindEvents();
    render();
  }

  init();
})();
