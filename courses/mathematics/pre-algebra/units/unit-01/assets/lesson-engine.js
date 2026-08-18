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

  const PROGRESS_KEY = unitMap?.unit?.progress_key || CONFIG.fallbackProgressKey;

  const DEFAULT_PROGRESS = {
    pathway: CONFIG.defaultPathway,
    completedLessons: [],
    reviewedLessons: [],
    lessonScores: {},
    reflections: {},
    lessonNotes: {},
    practiceDrafts: {}
  };

  let progress = loadJSON(PROGRESS_KEY, clone(DEFAULT_PROGRESS));

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[char]);

  function clone(value) {
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
    if (!progress || typeof progress !== "object") progress = clone(DEFAULT_PROGRESS);
    if (!Array.isArray(progress.completedLessons)) progress.completedLessons = [];
    if (!Array.isArray(progress.reviewedLessons)) progress.reviewedLessons = [];
    if (!progress.lessonScores || typeof progress.lessonScores !== "object") progress.lessonScores = {};
    if (!progress.reflections || typeof progress.reflections !== "object") progress.reflections = {};
    if (!progress.lessonNotes || typeof progress.lessonNotes !== "object") progress.lessonNotes = {};
    if (!progress.practiceDrafts || typeof progress.practiceDrafts !== "object") progress.practiceDrafts = {};
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

  function setTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(CONFIG.themeKey, next); } catch {}
    const toggle = $("#themeToggle");
    if (toggle) toggle.setAttribute("aria-label", next === "light" ? "Switch to dark theme" : "Switch to light theme");
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(CONFIG.themeKey); } catch {}
    const preferred = saved || (window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(preferred);
    $("#themeToggle")?.addEventListener("click", () => {
      setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
    });
  }

  function render() {
    normalizeProgress();
    renderObjectives();
    renderWarmup();
    renderConcepts();
    renderReadingSections();
    renderNumberSets();
    renderQuickChecks();
    renderExamples();
    renderApplication();
    renderPathways();
    renderLanguages();
    renderVocabulary();
    renderQuestions();
    renderRecord();
    renderNavigation();
    renderMasteryLanguage();
    renderNotes();
    updatePracticeProgress();
  }

  function renderObjectives() {
    const target = $("#objectives");
    if (!target) return;
    target.innerHTML = (lesson.objectives || []).map(item => `<li>${escapeHTML(item)}</li>`).join("");
  }

  function renderWarmup() {
    const target = $("#warmup");
    if (!target) return;
    target.innerHTML = (lesson.warmup || []).map(item => `<li>${escapeHTML(item)}</li>`).join("");
  }

  function renderConcepts() {
    const target = $("#conceptGrid");
    if (!target) return;
    target.innerHTML = (lesson.concepts || []).map(concept => `
      <article class="card concept">
        <p class="eyebrow">Concept</p>
        <h3>${escapeHTML(concept.heading)}</h3>
        <p>${escapeHTML(concept.body)}</p>
      </article>`).join("");
  }

  function renderReadingSections() {
    const target = $("#readingSections");
    if (!target) return;
    const sections = lesson.reading_sections || [];
    target.innerHTML = sections.map((section, index) => `
      <article class="reading-card lesson-reading" id="reading-${index + 1}">
        <p class="eyebrow">Reading ${index + 1}</p>
        <h3>${escapeHTML(section.heading)}</h3>
        ${(section.paragraphs || []).map(p => `<p>${escapeHTML(p)}</p>`).join("")}
        ${(section.bullets || []).length ? `<ul>${section.bullets.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>` : ""}
        ${section.takeaway ? `<div class="takeaway"><strong>Keep:</strong> ${escapeHTML(section.takeaway)}</div>` : ""}
      </article>`).join("");
  }

  function renderNumberSets() {
    const target = $("#setExplorer");
    if (!target) return;
    const sets = lesson.number_sets || [];
    if (!sets.length) {
      target.closest("section")?.setAttribute("hidden", "");
      return;
    }

    target.innerHTML = `
      <div class="set-tabs" role="tablist" aria-label="Number family explorer">
        ${sets.map((set, i) => `
          <button type="button" class="set-tab" data-set-index="${i}" role="tab" aria-selected="${i === 0}">
            <span class="set-symbol">${escapeHTML(set.symbol)}</span>
            <span>${escapeHTML(set.name)}</span>
          </button>`).join("")}
      </div>
      <article class="card set-panel" id="setPanel" aria-live="polite"></article>`;

    showSet(0);
  }

  function showSet(index) {
    const sets = lesson.number_sets || [];
    const set = sets[index];
    if (!set) return;
    $$(".set-tab").forEach((button, i) => button.setAttribute("aria-selected", String(i === index)));
    const panel = $("#setPanel");
    if (!panel) return;
    panel.innerHTML = `
      <p class="eyebrow">${escapeHTML(set.symbol)} · ${escapeHTML(set.name)} numbers</p>
      <h3>${escapeHTML(set.name)}</h3>
      <p>${escapeHTML(set.definition)}</p>
      <dl class="set-details">
        <div><dt>Examples</dt><dd>${escapeHTML(set.examples)}</dd></div>
        <div><dt>Relationship</dt><dd>${escapeHTML(set.contains)}</dd></div>
      </dl>`;
  }

  function renderQuickChecks() {
    const target = $("#quickCheckList");
    if (!target) return;
    const checks = lesson.quick_checks || [];
    target.innerHTML = checks.map((check, index) => `
      <article class="question quick-check" data-quick-check="${index}">
        <fieldset>
          <legend><span class="question-number">${index + 1}</span>${escapeHTML(check.prompt)}</legend>
          <div class="options">
            ${(check.options || []).map((option, optionIndex) => `
              <label class="option">
                <input type="radio" name="quick${index}" value="${optionIndex}">
                <span>${escapeHTML(option)}</span>
              </label>`).join("")}
          </div>
          <button class="btn compact quick-check-button" type="button" data-check="${index}">Check</button>
          <div class="feedback" id="quick-feedback-${index}" role="status" aria-live="polite" hidden></div>
        </fieldset>
      </article>`).join("");
  }

  function checkQuick(index) {
    const check = lesson.quick_checks?.[index];
    if (!check) return;
    const selected = document.querySelector(`input[name="quick${index}"]:checked`);
    const feedback = $(`#quick-feedback-${index}`);
    if (!feedback) return;
    feedback.hidden = false;
    if (!selected) {
      feedback.className = "feedback incorrect";
      feedback.textContent = "Choose an answer first.";
      return;
    }
    const correct = Number(selected.value) === Number(check.answer);
    feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
    feedback.textContent = `${correct ? "Correct." : "Try again."} ${check.explanation || ""}`;
  }

  function renderExamples() {
    const target = $("#exampleList");
    if (!target) return;
    target.innerHTML = (lesson.examples || []).map((example, index) => `
      <article class="card example">
        <p class="eyebrow">Worked Example ${index + 1}</p>
        <h3>${escapeHTML(example.problem)}</h3>
        <ol>${(example.steps || []).map(step => `<li>${escapeHTML(step)}</li>`).join("")}</ol>
        <p class="answer"><strong>Answer:</strong> ${escapeHTML(example.answer)}</p>
      </article>`).join("");
  }

  function renderApplication() {
    const target = $("#application");
    if (target) target.textContent = lesson.application || "";
  }

  function validPathway(name) {
    return Boolean(lesson.pathways && lesson.pathways[name]);
  }

  function currentPathway() {
    return validPathway(progress.pathway) ? progress.pathway : CONFIG.defaultPathway;
  }

  function renderPathways() {
    const pathway = currentPathway();
    progress.pathway = pathway;

    const select = $("#pathwaySelect");
    if (select && [...select.options].some(option => option.value === pathway)) select.value = pathway;

    const tabs = $("#pathwayTabs");
    if (tabs) {
      tabs.innerHTML = Object.keys(lesson.pathways || {}).map(name => `
        <button type="button" class="pathway-tab" data-pathway="${escapeHTML(name)}" aria-pressed="${name === pathway}">
          ${escapeHTML(name)}
        </button>`).join("");
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

  function renderLanguages() {
    const select = $("#vocabLanguage");
    if (!select || !vocabulary?.languages) return;
    const current = select.value || "es";
    select.innerHTML = Object.entries(vocabulary.languages)
      .filter(([id]) => id !== "en")
      .map(([id, label]) => `<option value="${escapeHTML(id)}">${escapeHTML(label)}</option>`)
      .join("");
    if ([...select.options].some(option => option.value === current)) select.value = current;
  }

  function renderVocabulary() {
    const select = $("#vocabLanguage");
    const body = $("#vocabBody");
    if (!select || !body || !vocabulary?.terms) return;
    const language = select.value || "es";
    const heading = $("#languageHeading");
    if (heading) heading.textContent = vocabulary.languages?.[language] || "Translation";
    const terms = (lesson.vocab_ids || []).map(id => vocabulary.terms.find(term => term.id === id)).filter(Boolean);
    body.innerHTML = terms.map(term => `
      <tr>
        <td><strong>${escapeHTML(term.en)}</strong></td>
        <td>${escapeHTML(term[language] || term.en)}</td>
        <td>${escapeHTML(term.definition)}</td>
      </tr>`).join("");
  }

  function draftForLesson() {
    const draft = progress.practiceDrafts?.[lesson.id];
    return draft && typeof draft === "object" ? draft : {};
  }

  function renderQuestions() {
    const target = $("#questionList");
    if (!target) return;
    const draft = draftForLesson();
    target.innerHTML = (lesson.questions || []).map((question, index) => `
      <article class="question" data-question="${index}">
        <fieldset>
          <legend><span class="question-number">${index + 1}</span>${escapeHTML(question.prompt)}</legend>
          <div class="options">
            ${(question.options || []).map((option, optionIndex) => `
              <label class="option">
                <input type="radio" name="q${index}" value="${optionIndex}" ${Number(draft[index]) === optionIndex ? "checked" : ""}>
                <span>${escapeHTML(option)}</span>
              </label>`).join("")}
          </div>
          <div class="feedback" id="feedback-${index}" role="status" aria-live="polite" hidden></div>
        </fieldset>
      </article>`).join("");
  }

  function savePracticeDraft() {
    const draft = {};
    (lesson.questions || []).forEach((_, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected) draft[index] = Number(selected.value);
    });
    progress.practiceDrafts[lesson.id] = draft;
    saveProgress();
    updatePracticeProgress();
  }

  function updatePracticeProgress() {
    const questions = lesson.questions || [];
    if (!questions.length) return;
    let answered = 0;
    questions.forEach((_, index) => {
      if (document.querySelector(`input[name="q${index}"]:checked`)) answered += 1;
    });
    const label = $("#practiceProgressLabel");
    const bar = $("#practiceProgressBar");
    if (label) label.textContent = `${answered} of ${questions.length} answered`;
    if (bar) {
      const percent = Math.round((answered / questions.length) * 100);
      bar.style.setProperty("--value", `${percent}%`);
      bar.setAttribute("aria-valuenow", String(percent));
    }
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
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      const feedback = $(`#feedback-${index}`);
      if (!feedback) return;
      feedback.hidden = false;

      if (!selected) {
        complete = false;
        feedback.className = "feedback incorrect";
        feedback.textContent = "Choose an answer before scoring.";
        return;
      }

      const isCorrect = Number(selected.value) === Number(question.answer);
      if (isCorrect) correct += 1;
      feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
      feedback.textContent = `${isCorrect ? "Correct." : "Review."} ${question.explanation || ""}`;
    });

    if (!complete) {
      setMessage("#scoreMessage", "Answer every question before calculating a lesson score.");
      updatePracticeProgress();
      return;
    }

    const percent = Math.round((correct / questions.length) * 100);
    progress.lessonScores[lesson.id] = percent;

    if (percent >= CONFIG.masteryThreshold && !progress.completedLessons.includes(lesson.id)) {
      progress.completedLessons.push(lesson.id);
    }

    saveProgress();
    renderRecord();
    renderNavigation();

    setMessage(
      "#scoreMessage",
      `Score: ${correct}/${questions.length} (${percent}%). ` +
      (percent >= CONFIG.masteryThreshold
        ? "Practice mastery reached. The next lesson is now unlocked."
        : `Reach ${CONFIG.masteryThreshold}% to unlock the next lesson. Review the explanations and try again.`)
    );
  }

  function resetPractice() {
    $$('#questionList input[type="radio"]').forEach(input => { input.checked = false; });
    $$(".feedback", $("#questionList") || document).forEach(feedback => {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.className = "feedback";
    });
    progress.practiceDrafts[lesson.id] = {};
    saveProgress();
    updatePracticeProgress();
    setMessage("#scoreMessage", "Practice reset.");
  }

  function renderRecord() {
    const rawScore = progress.lessonScores[lesson.id];
    const score = Number(rawScore);
    const hasScore = rawScore !== undefined && rawScore !== null && Number.isFinite(score);
    const completed = progress.completedLessons.includes(lesson.id);
    const reviewed = progress.reviewedLessons.includes(lesson.id);

    const status = $("#lessonStatus");
    if (status) {
      if (hasScore) {
        status.textContent = `Latest practice score: ${score}% · ${completed ? "Lesson mastery reached" : `${CONFIG.masteryThreshold}% mastery required`}`;
      } else {
        status.textContent = reviewed
          ? `Lesson reviewed. Reach ${CONFIG.masteryThreshold}% on practice to save mastery.`
          : `Reach ${CONFIG.masteryThreshold}% on practice to save lesson mastery.`;
      }
    }

    const button = $("#markComplete");
    if (button) {
      button.textContent = reviewed ? "Remove Review Mark" : "Mark Lesson Reviewed";
      button.setAttribute("aria-pressed", String(reviewed));
    }

    const reflection = $("#reflection");
    if (reflection) reflection.value = progress.reflections[lesson.id] || "";
  }

  function toggleReviewed() {
    const reviewed = progress.reviewedLessons.includes(lesson.id);
    progress.reviewedLessons = reviewed
      ? progress.reviewedLessons.filter(id => id !== lesson.id)
      : [...progress.reviewedLessons, lesson.id];
    saveProgress();
    renderRecord();
  }

  function renderNotes() {
    const notes = $("#guidedNotes");
    if (notes) notes.value = progress.lessonNotes[lesson.id] || "";
  }

  function saveNotes() {
    const notes = $("#guidedNotes");
    if (!notes) return;
    progress.lessonNotes[lesson.id] = notes.value.trim();
    saveProgress();
    setMessage("#notesMessage", "Guided notes saved in this browser.");
  }

  function saveReflection() {
    const field = $("#reflection");
    if (!field) return;
    progress.reflections[lesson.id] = field.value.trim();
    saveProgress();
    setMessage("#reflectionMessage", "Reflection saved in this browser.");
  }

  function ensureMasteryModal() {
    if ($("#masteryModal")) return;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="mastery-modal" id="masteryModal" hidden>
        <div class="mastery-modal-backdrop" data-close-mastery></div>
        <section class="mastery-modal-card" role="dialog" aria-modal="true" aria-labelledby="masteryModalTitle">
          <p class="eyebrow">Mastery Gate · ${CONFIG.masteryThreshold}%</p>
          <h2 id="masteryModalTitle">This lesson is still in progress.</h2>
          <p id="masteryModalText">Complete the lesson practice at ${CONFIG.masteryThreshold}% or higher before moving ahead.</p>
          <div class="actions">
            <button class="btn primary" type="button" id="jumpToPractice">Go to Practice</button>
            <button class="btn" type="button" data-close-mastery>Stay Here</button>
          </div>
        </section>
      </div>`;
    document.body.appendChild(wrapper.firstElementChild);
  }

  function showMasteryModal(nextTitle = "the next lesson") {
    ensureMasteryModal();
    const modal = $("#masteryModal");
    const score = Number(progress.lessonScores[lesson.id]);
    const hasScore = Number.isFinite(score);
    const text = $("#masteryModalText");
    if (text) {
      text.textContent = hasScore
        ? `Your current practice score is ${score}%. Reach ${CONFIG.masteryThreshold}% or higher to unlock ${nextTitle}.`
        : `Complete all lesson practice questions and reach ${CONFIG.masteryThreshold}% or higher to unlock ${nextTitle}.`;
    }
    modal.hidden = false;
    $("#jumpToPractice")?.focus();
  }

  function closeMasteryModal() {
    const modal = $("#masteryModal");
    if (modal) modal.hidden = true;
  }

  function renderNavigation() {
    if (!Array.isArray(unitMap?.lessons)) return;
    const index = unitMap.lessons.findIndex(item => item.id === lesson.id);
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
      const mastered = progress.completedLessons.includes(lesson.id);
      const targetHref = next ? next.file.split("/").pop() : "../practice/core.html";
      const targetTitle = next ? next.title : "Core Practice";

      nextLink.dataset.targetHref = targetHref;
      nextLink.dataset.targetTitle = targetTitle;
      nextLink.dataset.locked = String(!mastered);
      nextLink.setAttribute("aria-disabled", String(!mastered));

      if (mastered) {
        nextLink.href = targetHref;
        nextLink.textContent = `${targetTitle} →`;
        nextLink.classList.remove("locked");
      } else {
        nextLink.href = "#practice";
        nextLink.textContent = `Master ${CONFIG.masteryThreshold}% to unlock ${targetTitle} →`;
        nextLink.classList.add("locked");
      }
    }
  }

  function recordContinueLearning() {
    saveJSON(CONFIG.continueKey, {
      course: "prealgebra",
      unit: unitMap?.unit?.id || "unit-01",
      lesson: lesson.id,
      title: lesson.title,
      url: window.location.pathname,
      at: new Date().toISOString()
    });
  }

  function renderMasteryLanguage() {
    $$("[data-mastery-threshold]").forEach(node => {
      node.textContent = `${CONFIG.masteryThreshold}%`;
    });
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

  function exportLesson() {
    downloadJSON(`unit01-${lesson.id}-record.json`, {
      schema_version: "2.1",
      exported_at: new Date().toISOString(),
      course: { id: "KH-MATH-PA", title: "Pre-Algebra" },
      unit: { id: unitMap?.unit?.id || "KH-MATH-PA-U01", title: unitMap?.unit?.title || "Unit 1" },
      lesson: { id: lesson.id, title: lesson.title },
      pathway: progress.pathway,
      mastery_threshold: CONFIG.masteryThreshold,
      score: progress.lessonScores[lesson.id] ?? null,
      completed: progress.completedLessons.includes(lesson.id),
      reviewed: progress.reviewedLessons.includes(lesson.id),
      notes: progress.lessonNotes[lesson.id] || "",
      reflection: progress.reflections[lesson.id] || ""
    });
  }

  function setMessage(selector, message) {
    const target = $(selector);
    if (target) target.textContent = message;
  }

  function bindEvents() {
    $("#pathwayTabs")?.addEventListener("click", event => {
      const button = event.target.closest("[data-pathway]");
      if (button) selectPathway(button.dataset.pathway);
    });

    $("#pathwaySelect")?.addEventListener("change", event => selectPathway(event.target.value));
    $("#vocabLanguage")?.addEventListener("change", renderVocabulary);

    $("#setExplorer")?.addEventListener("click", event => {
      const button = event.target.closest("[data-set-index]");
      if (button) showSet(Number(button.dataset.setIndex));
    });

    $("#quickCheckList")?.addEventListener("click", event => {
      const button = event.target.closest("[data-check]");
      if (button) checkQuick(Number(button.dataset.check));
    });

    $("#questionList")?.addEventListener("change", savePracticeDraft);
    $("#submitPractice")?.addEventListener("click", scorePractice);
    $("#resetPractice")?.addEventListener("click", resetPractice);
    $("#markComplete")?.addEventListener("click", toggleReviewed);
    $("#saveNotes")?.addEventListener("click", saveNotes);
    $("#saveReflection")?.addEventListener("click", saveReflection);
    $("#exportLesson")?.addEventListener("click", exportLesson);
    $("#printLesson")?.addEventListener("click", () => window.print());

    $("#nextLesson")?.addEventListener("click", event => {
      const link = event.currentTarget;
      if (link.dataset.locked !== "true") return;
      event.preventDefault();
      showMasteryModal(link.dataset.targetTitle || "the next lesson");
    });

    document.addEventListener("click", event => {
      if (event.target.closest("[data-close-mastery]")) closeMasteryModal();
      if (event.target.closest("#jumpToPractice")) {
        closeMasteryModal();
        $("#practice")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !$("#masteryModal")?.hidden) closeMasteryModal();
    });
  }

  function init() {
    normalizeProgress();
    initTheme();
    ensureMasteryModal();
    bindEvents();
    render();
    recordContinueLearning();
  }

  init();
})();