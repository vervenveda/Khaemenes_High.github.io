"use strict";

/* =========================================================
   KHAEMENES HIGH · PRE-ALGEBRA
   SHARED LESSON ENGINE · UNIT 1
   Sacred scale: 3 · 7 · 11 · 14 · 24 · 33 · 55 · 66
   ========================================================= */

(() => {
  const lesson = window.LESSON_DATA;
  let unitMap = window.UNIT_MAP_FALLBACK;
  let vocabulary = window.VOCAB_FALLBACK;

  if (!lesson) {
    console.error("[Lesson Engine] LESSON_DATA is missing.");
    return;
  }

  const CONFIG = Object.freeze({
    themeKey: "khaemenes-theme",
    fallbackProgressKey: "khaemenes-prealgebra-unit01-progress-v1",
    masteryThreshold: 80,
    defaultPathway: "Core",
    continueKey: "khaemenes-grade09-last-open-v1"
  });

  const PROGRESS_KEY =
    unitMap?.unit?.progress_key || CONFIG.fallbackProgressKey;

  const DEFAULT_PROGRESS = {
    pathway: CONFIG.defaultPathway,
    completedLessons: [],
    reviewedLessons: [],
    lessonScores: {},
    reflections: {}
  };

  let progress = loadJSON(PROGRESS_KEY, structuredCloneSafe(DEFAULT_PROGRESS));

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

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) ?? fallback : fallback;
    } catch (error) {
      console.warn(`[Lesson Engine] Could not read ${key}.`, error);
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[Lesson Engine] Could not save ${key}.`, error);
      return false;
    }
  }

  function normalizeProgress() {
    if (!progress || typeof progress !== "object") {
      progress = structuredCloneSafe(DEFAULT_PROGRESS);
    }
    if (!Array.isArray(progress.completedLessons)) progress.completedLessons = [];
    if (!Array.isArray(progress.reviewedLessons)) progress.reviewedLessons = [];
    if (!progress.lessonScores || typeof progress.lessonScores !== "object") progress.lessonScores = {};
    if (!progress.reflections || typeof progress.reflections !== "object") progress.reflections = {};
    if (!progress.pathway) progress.pathway = CONFIG.defaultPathway;

    const reviewed = new Set(progress.reviewedLessons);
    progress.completedLessons.forEach(id => {
      if (Number(progress.lessonScores[id]) < CONFIG.masteryThreshold) reviewed.add(id);
    });

    progress.completedLessons = Object.entries(progress.lessonScores)
      .filter(([, score]) => Number(score) >= CONFIG.masteryThreshold)
      .map(([id]) => id);

    progress.reviewedLessons = [...reviewed];
  }

  function saveProgress() {
    normalizeProgress();
    saveJSON(PROGRESS_KEY, progress);
  }

  /* ---------------------------------------------------------
     THEME
     --------------------------------------------------------- */

  function setTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(CONFIG.themeKey, next); } catch {}

    const toggle = $("#themeToggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        next === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
    }
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(CONFIG.themeKey); } catch {}

    const preferred =
      saved ||
      (window.matchMedia?.("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");

    setTheme(preferred);

    $("#themeToggle")?.addEventListener("click", () => {
      setTheme(
        document.documentElement.dataset.theme === "light"
          ? "dark"
          : "light"
      );
    });
  }

  /* ---------------------------------------------------------
     MASTER RENDER
     --------------------------------------------------------- */

  function render() {
    normalizeProgress();
    renderObjectives();
    renderWarmup();
    renderConcepts();
    renderExamples();
    renderApplication();
    renderPathways();
    renderLanguages();
    renderVocabulary();
    renderQuestions();
    renderRecord();
    renderNavigation();
    renderMasteryLanguage();
  }

  function renderObjectives() {
    const target = $("#objectives");
    if (!target) return;

    target.innerHTML = (lesson.objectives || [])
      .map(item => `<li>${escapeHTML(item)}</li>`)
      .join("");
  }

  function renderWarmup() {
    const target = $("#warmup");
    if (!target) return;

    target.innerHTML = (lesson.warmup || [])
      .map(item => `<li>${escapeHTML(item)}</li>`)
      .join("");
  }

  function renderConcepts() {
    const target = $("#conceptGrid");
    if (!target) return;

    target.innerHTML = (lesson.concepts || [])
      .map(concept => `
        <article class="card concept">
          <p class="eyebrow">Concept</p>
          <h3>${escapeHTML(concept.heading)}</h3>
          <p>${escapeHTML(concept.body)}</p>
        </article>
      `)
      .join("");
  }

  function renderExamples() {
    const target = $("#exampleList");
    if (!target) return;

    target.innerHTML = (lesson.examples || [])
      .map((example, index) => `
        <article class="card example">
          <p class="eyebrow">Worked Example ${index + 1}</p>
          <h3>${escapeHTML(example.problem)}</h3>
          <ol>
            ${(example.steps || [])
              .map(step => `<li>${escapeHTML(step)}</li>`)
              .join("")}
          </ol>
          <p class="answer">
            <strong>Answer:</strong> ${escapeHTML(example.answer)}
          </p>
        </article>
      `)
      .join("");
  }

  function renderApplication() {
    const target = $("#application");
    if (target) target.textContent = lesson.application || "";
  }

  /* ---------------------------------------------------------
     PATHWAYS
     --------------------------------------------------------- */

  function validPathway(name) {
    return Boolean(lesson.pathways && lesson.pathways[name]);
  }

  function currentPathway() {
    return validPathway(progress.pathway)
      ? progress.pathway
      : CONFIG.defaultPathway;
  }

  function renderPathways() {
    const pathway = currentPathway();
    progress.pathway = pathway;

    const select = $("#pathwaySelect");
    if (select && [...select.options].some(option => option.value === pathway)) {
      select.value = pathway;
    }

    const tabs = $("#pathwayTabs");
    if (tabs) {
      tabs.innerHTML = Object.keys(lesson.pathways || {})
        .map(name => `
          <button
            type="button"
            class="pathway-tab"
            data-pathway="${escapeHTML(name)}"
            aria-pressed="${name === pathway}"
          >
            ${escapeHTML(name)}
          </button>
        `)
        .join("");
    }

    const panel = $("#pathwayPanel");
    if (panel) panel.textContent = lesson.pathways?.[pathway] || "";
  }

  function selectPathway(pathway) {
    if (!validPathway(pathway)) return;
    progress.pathway = pathway;
    saveProgress();
    renderPathways();
  }

  /* ---------------------------------------------------------
     VOCABULARY
     --------------------------------------------------------- */

  function renderLanguages() {
    const select = $("#vocabLanguage");
    if (!select || !vocabulary?.languages) return;

    const current = select.value || "es";

    select.innerHTML = Object.entries(vocabulary.languages)
      .filter(([id]) => id !== "en")
      .map(([id, label]) =>
        `<option value="${escapeHTML(id)}">${escapeHTML(label)}</option>`
      )
      .join("");

    if ([...select.options].some(option => option.value === current)) {
      select.value = current;
    }
  }

  function renderVocabulary() {
    const select = $("#vocabLanguage");
    const body = $("#vocabBody");
    if (!select || !body || !vocabulary?.terms) return;

    const language = select.value || "es";

    const heading = $("#languageHeading");
    if (heading) {
      heading.textContent =
        vocabulary.languages?.[language] || "Translation";
    }

    const terms = (lesson.vocab_ids || [])
      .map(id => vocabulary.terms.find(term => term.id === id))
      .filter(Boolean);

    body.innerHTML = terms
      .map(term => `
        <tr>
          <td><strong>${escapeHTML(term.en)}</strong></td>
          <td>${escapeHTML(term[language] || term.en)}</td>
          <td>${escapeHTML(term.definition)}</td>
        </tr>
      `)
      .join("");
  }

  /* ---------------------------------------------------------
     INTERACTIVE PRACTICE
     --------------------------------------------------------- */

  function renderQuestions() {
    const target = $("#questionList");
    if (!target) return;

    target.innerHTML = (lesson.questions || [])
      .map((question, index) => `
        <article class="question" data-question="${index}">
          <fieldset>
            <legend>
              <span class="question-number">${index + 1}</span>
              ${escapeHTML(question.prompt)}
            </legend>

            <div class="options">
              ${(question.options || [])
                .map((option, optionIndex) => `
                  <label class="option">
                    <input
                      type="radio"
                      name="q${index}"
                      value="${optionIndex}"
                    >
                    <span>${escapeHTML(option)}</span>
                  </label>
                `)
                .join("")}
            </div>

            <div
              class="feedback"
              id="feedback-${index}"
              role="status"
              aria-live="polite"
              hidden
            ></div>
          </fieldset>
        </article>
      `)
      .join("");
  }

  function scorePractice() {
    const questions = lesson.questions || [];

    if (!questions.length) {
      setMessage("#scoreMessage", "No practice questions are available.");
      return;
    }

    let correct = 0;
    let complete = true;

    questions.forEach((question, index) => {
      const selected =
        document.querySelector(`input[name="q${index}"]:checked`);

      const feedback = $(`#feedback-${index}`);
      if (!feedback) return;

      feedback.hidden = false;

      if (!selected) {
        complete = false;
        feedback.className = "feedback incorrect";
        feedback.textContent = "Choose an answer before scoring.";
        return;
      }

      const isCorrect = Number(selected.value) === question.answer;

      if (isCorrect) correct += 1;

      feedback.className =
        `feedback ${isCorrect ? "correct" : "incorrect"}`;

      feedback.textContent =
        `${isCorrect ? "Correct." : "Review."} ${question.explanation || ""}`;
    });

    if (!complete) {
      setMessage(
        "#scoreMessage",
        "Answer every question before calculating a lesson score."
      );
      return;
    }

    const percent = Math.round((correct / questions.length) * 100);

    progress.lessonScores[lesson.id] = percent;

    /*
      IMPORTANT:
      Practice no longer auto-completes at the old 70% threshold.
      80% is the Khaemenes mastery standard.
    */
    if (
      percent >= CONFIG.masteryThreshold &&
      !progress.completedLessons.includes(lesson.id)
    ) {
      progress.completedLessons.push(lesson.id);
    }

    saveProgress();
    renderRecord();

    setMessage(
      "#scoreMessage",
      `Score: ${correct}/${questions.length} (${percent}%). ` +
      (
        percent >= CONFIG.masteryThreshold
          ? `Practice mastery reached. Lesson completion saved.`
          : `Reach ${CONFIG.masteryThreshold}% to complete this practice. Review the explanations and try again.`
      )
    );
  }

  function resetPractice() {
    $$('#questionList input[type="radio"]').forEach(input => {
      input.checked = false;
    });

    $$(".feedback").forEach(feedback => {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.className = "feedback";
    });

    setMessage("#scoreMessage", "Practice reset.");
  }

  /* ---------------------------------------------------------
     LESSON RECORD
     --------------------------------------------------------- */

  function renderRecord() {
    const score = Number(progress.lessonScores[lesson.id]);
    const hasScore = Number.isFinite(score);
    const completed = progress.completedLessons.includes(lesson.id);
    const reviewed = progress.reviewedLessons.includes(lesson.id);

    const status = $("#lessonStatus");
    if (status) {
      if (hasScore) {
        status.textContent =
          `Latest practice score: ${score}% · ` +
          (completed ? "Lesson mastery reached" : `${CONFIG.masteryThreshold}% mastery required`);
      } else {
        status.textContent = reviewed
          ? `Lesson reviewed. Complete the practice and reach ${CONFIG.masteryThreshold}% to save mastery.`
          : `Complete the practice and reach ${CONFIG.masteryThreshold}% to save lesson mastery.`;
      }
    }

    const button = $("#markComplete");
    if (button) {
      button.textContent = reviewed ? "Remove Review Mark" : "Mark Lesson Reviewed";
      button.setAttribute("aria-pressed", String(reviewed));
    }

    const reflection = $("#reflection");
    if (reflection) {
      reflection.value = progress.reflections[lesson.id] || "";
    }
  }

  function toggleReviewed() {
    const reviewed = progress.reviewedLessons.includes(lesson.id);

    progress.reviewedLessons = reviewed
      ? progress.reviewedLessons.filter(id => id !== lesson.id)
      : [...progress.reviewedLessons, lesson.id];

    saveProgress();
    renderRecord();
  }

  function saveReflection() {
    const field = $("#reflection");
    if (!field) return;

    progress.reflections[lesson.id] = field.value.trim();
    saveProgress();

    setMessage(
      "#reflectionMessage",
      "Reflection saved in this browser."
    );
  }

  /* ---------------------------------------------------------
     NAVIGATION
     --------------------------------------------------------- */

  function renderNavigation() {
    if (!Array.isArray(unitMap?.lessons)) return;

    const index =
      unitMap.lessons.findIndex(item => item.id === lesson.id);

    const previous = unitMap.lessons[index - 1];
    const next = unitMap.lessons[index + 1];

    const previousLink = $("#previousLesson");
    const nextLink = $("#nextLesson");

    if (previousLink) {
      if (previous) {
        previousLink.href = previous.file.split("/").pop();
        previousLink.textContent = `← ${previous.title}`;
      } else {
        previousLink.href = "../";
        previousLink.textContent = "← Unit Home";
      }
    }

    if (nextLink) {
      if (next) {
        nextLink.href = next.file.split("/").pop();
        nextLink.textContent = `${next.title} →`;
      } else {
        nextLink.href = "../practice/core.html";
        nextLink.textContent = "Core Practice →";
      }
    }
  }

  function recordContinueLearning() {
    try {
      saveJSON(CONFIG.continueKey, {
        course: "prealgebra",
        unit: unitMap?.unit?.id || "unit-01",
        lesson: lesson.id,
        title: lesson.title,
        url: window.location.pathname,
        at: new Date().toISOString()
      });
    } catch {}
  }

  /* ---------------------------------------------------------
     MASTERY LANGUAGE
     --------------------------------------------------------- */

  function renderMasteryLanguage() {
    $$("[data-mastery-threshold]").forEach(node => {
      node.textContent = `${CONFIG.masteryThreshold}%`;
    });
  }

  /* ---------------------------------------------------------
     EXPORT / PRINT
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

    setTimeout(() => URL.revokeObjectURL(url), 666);
  }

  function exportLesson() {
    downloadJSON(
      `unit01-${lesson.id}-record.json`,
      {
        schema_version: "2.0",
        exported_at: new Date().toISOString(),
        course: {
          id: "KH-MATH-PA",
          title: "Pre-Algebra"
        },
        unit: {
          id: unitMap?.unit?.id || "KH-MATH-PA-U01",
          title: unitMap?.unit?.title || "Unit 1"
        },
        lesson: {
          id: lesson.id,
          title: lesson.title
        },
        pathway: progress.pathway,
        mastery_threshold: CONFIG.masteryThreshold,
        score: progress.lessonScores[lesson.id] ?? null,
        completed: progress.completedLessons.includes(lesson.id),
        reflection: progress.reflections[lesson.id] || ""
      }
    );
  }

  /* ---------------------------------------------------------
     UTILITIES
     --------------------------------------------------------- */

  function setMessage(selector, message) {
    const target = $(selector);
    if (target) target.textContent = message;
  }

  /* ---------------------------------------------------------
     EVENTS
     --------------------------------------------------------- */

  function bindEvents() {
    $("#pathwayTabs")?.addEventListener("click", event => {
      const button = event.target.closest("[data-pathway]");
      if (!button) return;
      selectPathway(button.dataset.pathway);
    });

    $("#pathwaySelect")?.addEventListener("change", event => {
      selectPathway(event.target.value);
    });

    $("#vocabLanguage")?.addEventListener(
      "change",
      renderVocabulary
    );

    $("#submitPractice")?.addEventListener(
      "click",
      scorePractice
    );

    $("#resetPractice")?.addEventListener(
      "click",
      resetPractice
    );

    $("#markComplete")?.addEventListener(
      "click",
      toggleReviewed
    );

    $("#saveReflection")?.addEventListener(
      "click",
      saveReflection
    );

    $("#exportLesson")?.addEventListener(
      "click",
      exportLesson
    );

    $("#printLesson")?.addEventListener(
      "click",
      () => window.print()
    );
  }

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */

  function init() {
    normalizeProgress();
    initTheme();
    bindEvents();
    render();
    recordContinueLearning();
  }

  init();
})();
