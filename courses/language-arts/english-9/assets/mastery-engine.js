(() => {
  "use strict";

  const root = document.querySelector("[data-mastery-unit]");
  if (!root) return;

  const UNIT = root.dataset.masteryUnit;
  const THRESHOLD = Number(root.dataset.masteryThreshold || 80);
  const STORAGE_KEY = "khae-ela9-mastery-v2";
  const PRACTICE_PREFIX = "khae-ela9-field:";
  const SACRED_DELAY = 666;

  const read = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const write = value => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
  };

  const state = read();
  state.units ||= {};
  state.units[UNIT] ||= { lessonScores: {}, reviewedLessons: {}, practiceDrafts: {} };
  const unit = state.units[UNIT];
  unit.lessonScores ||= {};
  unit.reviewedLessons ||= {};
  unit.practiceDrafts ||= {};

  // Defensive normalization: legacy completion claims are never mastery authority.
  // Only finite, in-range lesson scores at or above the published threshold count.
  const scores = {};
  for (const [lesson, raw] of Object.entries(unit.lessonScores)) {
    const score = Number(raw);
    if (Number.isFinite(score) && score >= 0 && score <= 100) scores[lesson] = score;
  }
  unit.lessonScores = scores;
  delete unit.completedLessons;

  root.querySelectorAll(".lesson-block").forEach(block => {
    if (block.dataset.lessonIds) return;
    const heading = block.querySelector(".lesson-kicker")?.textContent || "";
    const match = heading.match(/Lessons?\s+(\d+\.\d+)(?:[–-](\d+\.\d+|\d+))?/i);
    if (!match) return;
    const ids = [match[1]];
    if (match[2]) {
      const end = match[2].includes(".") ? match[2] : `${match[1].split(".")[0]}.${match[2]}`;
      const [chapter, startLesson] = match[1].split(".").map(Number);
      const endLesson = Number(end.split(".")[1]);
      for (let n = startLesson + 1; n <= endLesson; n++) ids.push(`${chapter}.${n}`);
    }
    block.dataset.lessonIds = ids.join(" ");
  });

  const lessonIds = Array.from(root.querySelectorAll("[data-lesson-ids]"))
    .flatMap(block => block.dataset.lessonIds.trim().split(/\s+/))
    .filter((id, index, all) => id && all.indexOf(id) === index);
  unit.lessonIds = lessonIds;

  const escapeId = value => window.CSS?.escape ? CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, "-");
  const isMastered = id => Number(unit.lessonScores[id]) >= THRESHOLD;
  const masteredCount = () => lessonIds.filter(isMastered).length;
  const average = () => {
    const recorded = lessonIds.map(id => unit.lessonScores[id]).filter(Number.isFinite);
    return recorded.length ? Math.round(recorded.reduce((sum, score) => sum + score, 0) / recorded.length) : 0;
  };
  const allMastered = () => lessonIds.length > 0 && masteredCount() === lessonIds.length;

  const status = document.createElement("section");
  status.id = "mastery-authority-note";
  status.className = "mastery-dashboard no-print";
  status.setAttribute("aria-label", "Unit mastery record");
  status.innerHTML = `
    <p class="lesson-kicker">Evidence-Based Progress</p>
    <h2>Unit ${UNIT.replace(/\D/g, "")} mastery record</h2>
    <div class="mastery-stat-grid">
      <div><strong data-mastery-count>0 / ${lessonIds.length}</strong><span>Lessons mastered</span></div>
      <div><strong data-mastery-average>0%</strong><span>Recorded-score average</span></div>
      <div><strong>${THRESHOLD}%</strong><span>Mastery threshold</span></div>
      <div><strong data-draft-count>0</strong><span>Practice drafts preserved</span></div>
    </div>
    <div class="progress-track" aria-hidden="true"><span data-mastery-bar></span></div>
    <p class="progress-label" data-mastery-message></p>`;
  const quickNav = root.querySelector(".quick-nav");
  if (quickNav) quickNav.after(status);
  else root.querySelector("main")?.prepend(status);

  root.querySelectorAll("[data-lesson-ids]").forEach(block => {
    const controls = document.createElement("div");
    controls.className = "lesson-evidence no-print";
    controls.innerHTML = `<h4>Lesson evidence record</h4><p>Enter the reviewed score for each lesson. Reviewing work and mastering it remain separate records.</p>`;
    for (const id of block.dataset.lessonIds.trim().split(/\s+/)) {
      const row = document.createElement("div");
      row.className = "lesson-evidence-row";
      row.innerHTML = `
        <label for="score-${escapeId(id)}">Lesson ${id} score</label>
        <input id="score-${escapeId(id)}" type="number" min="0" max="100" step="1" inputmode="numeric" data-lesson-score="${id}" aria-describedby="state-${escapeId(id)}">
        <span aria-hidden="true">%</span>
        <button class="btn" type="button" data-reviewed-lesson="${id}" aria-pressed="false">Mark Lesson Reviewed</button>
        <strong id="state-${escapeId(id)}" data-lesson-state="${id}">Not scored</strong>`;
      controls.append(row);
    }
    block.append(controls);
  });

  const masteryDialog = document.createElement("dialog");
  masteryDialog.className = "mastery-dialog";
  masteryDialog.innerHTML = `
    <form method="dialog">
      <p class="lesson-kicker">Mastery Gate</p>
      <h2>Unit 2 opens after mastery.</h2>
      <p data-dialog-message></p>
      <p>Review feedback, revise the work, and record a new score. A review mark alone does not unlock progression.</p>
      <button class="btn primary" value="close">Return to Unit 1</button>
    </form>`;
  document.body.append(masteryDialog);

  const inferredNext = root.querySelector('a[href="../unit-02/index.html"]');
  if (inferredNext) inferredNext.dataset.masteryNext = "";
  const nextLinks = root.querySelectorAll("[data-mastery-next]");
  nextLinks.forEach(link => {
    link.dataset.lockedHref = link.getAttribute("href") || "";
    link.addEventListener("click", event => {
      if (allMastered()) return;
      event.preventDefault();
      masteryDialog.querySelector("[data-dialog-message]").textContent =
        `${masteredCount()} of ${lessonIds.length} lessons currently meet the ${THRESHOLD}% threshold.`;
      if (typeof masteryDialog.showModal === "function") masteryDialog.showModal();
      else masteryDialog.setAttribute("open", "");
    });
  });

  root.querySelectorAll(`[data-progress-key="${UNIT}"]`).forEach(button => {
    button.removeAttribute("data-progress-key");
    button.disabled = true;
    button.textContent = "Completion follows mastery evidence";
    button.setAttribute("aria-describedby", "mastery-authority-note");
  });

  const collectDrafts = () => {
    let count = 0;
    root.querySelectorAll("[data-save-field]").forEach(field => {
      const key = field.dataset.saveField;
      let value = field.value || "";
      try { value = localStorage.getItem(PRACTICE_PREFIX + key) || value; } catch {}
      if (value.trim()) {
        unit.practiceDrafts[key] = { present: true, updatedAt: Date.now() };
        count++;
      } else {
        delete unit.practiceDrafts[key];
      }
    });
    return count;
  };

  const render = () => {
    root.querySelectorAll("[data-lesson-score]").forEach(input => {
      const id = input.dataset.lessonScore;
      if (document.activeElement !== input) input.value = Number.isFinite(unit.lessonScores[id]) ? unit.lessonScores[id] : "";
      const label = root.querySelector(`[data-lesson-state="${id}"]`);
      if (label) {
        label.textContent = Number.isFinite(unit.lessonScores[id])
          ? (isMastered(id) ? "Mastered" : "Revise and retry")
          : "Not scored";
        label.dataset.state = isMastered(id) ? "mastered" : "developing";
      }
    });
    root.querySelectorAll("[data-reviewed-lesson]").forEach(button => {
      const reviewed = Boolean(unit.reviewedLessons[button.dataset.reviewedLesson]);
      button.setAttribute("aria-pressed", String(reviewed));
      button.textContent = reviewed ? "Reviewed ✓" : "Mark Lesson Reviewed";
    });
    const count = masteredCount();
    const drafts = collectDrafts();
    status.querySelector("[data-mastery-count]").textContent = `${count} / ${lessonIds.length}`;
    status.querySelector("[data-mastery-average]").textContent = `${average()}%`;
    status.querySelector("[data-draft-count]").textContent = String(drafts);
    status.querySelector("[data-mastery-bar]").style.width = `${Math.round(count / lessonIds.length * 100)}%`;
    status.querySelector("[data-mastery-message]").textContent = allMastered()
      ? "Mastery verified from lesson scores. Unit 2 is available."
      : `${lessonIds.length - count} lesson${lessonIds.length - count === 1 ? "" : "s"} still need a score of ${THRESHOLD}% or higher.`;
    nextLinks.forEach(link => {
      const unlocked = allMastered();
      link.setAttribute("aria-disabled", String(!unlocked));
      link.classList.toggle("is-locked", !unlocked);
      link.textContent = unlocked ? "Continue to Unit 2" : "Unit 2 · Mastery Required";
    });
    unit.masteredLessons = lessonIds.filter(isMastered);
    unit.masteryVerified = allMastered();
    unit.threshold = THRESHOLD;
    write(state);
  };

  root.addEventListener("input", event => {
    if (event.target.matches("[data-lesson-score]")) {
      const id = event.target.dataset.lessonScore;
      const raw = event.target.value;
      const score = Number(raw);
      if (raw === "") delete unit.lessonScores[id];
      else if (Number.isFinite(score) && score >= 0 && score <= 100) unit.lessonScores[id] = score;
      render();
    } else if (event.target.matches("[data-save-field]")) {
      window.clearTimeout(event.target._draftTimer);
      event.target._draftTimer = window.setTimeout(render, SACRED_DELAY);
    }
  });

  root.addEventListener("click", event => {
    const button = event.target.closest("[data-reviewed-lesson]");
    if (!button) return;
    const id = button.dataset.reviewedLesson;
    unit.reviewedLessons[id] = !unit.reviewedLessons[id];
    render();
  });

  render();
})();
