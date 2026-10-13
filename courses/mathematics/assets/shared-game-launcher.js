(() => {
"use strict";
const script = document.currentScript;
if (!script) return;
const game = script.dataset.game, course = script.dataset.course;
const unit = script.dataset.unit || "", lesson = script.dataset.lesson || "";
const mode = script.dataset.mode || "", title = script.dataset.title || "Learning Game";
if (!game || !course || !/^[a-z0-9_-]+$/i.test(game)) return;

const gameURL = new URL("learning-games/" + game + "/index.html", script.src);
gameURL.searchParams.set("course", course);
if (unit) gameURL.searchParams.set("unit", unit);
if (lesson) gameURL.searchParams.set("lesson", lesson);
if (mode) gameURL.searchParams.set("mode", mode);

const sectionId = "mathSharedGameCompanion-" + game;
const titleId = "mathSharedGameTitle-" + game;
const focusByGame = {
  "unit-circle-navigator": "Investigate radians, reference angles, coordinate signs and exact trigonometric values.",
  "trigonometric-wave-studio": "Compare graphs, transformations, inverse restrictions, asymptotes and periodic evidence.",
  "trigonometric-identity-forge": "Apply algebraic identities, explain a valid transformation and solve trigonometric equations.",
  "triangle-law-expedition": "Check the Law of Sines or Cosines, SSA cases, areas and compass bearings.",
  "integer-compass": "Use signed vector components and coordinate directions to interpret a journey.",
  "coordinated-mission-control": "Compose routes, interpret vectors and verify resultant displacement."
};

const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

function makeLink(label) {
  const anchor = make("a", "btn primary", label);
  anchor.href = gameURL.href;
  anchor.setAttribute("aria-label", "Open " + title + " practice for this lesson");
  return anchor;
}

function makeFocusedCompanion() {
  const section = make("section", "lesson-section math-shared-game-companion");
  section.id = sectionId;
  section.setAttribute("aria-labelledby", titleId);
  const kicker = make("p", "math-game-companion-kicker", "Connected practice · optional game");
  kicker.style.cssText = "font-size:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:inherit;margin:0 0 8px;";
  section.appendChild(kicker);
  const heading = make("h2", "", title);
  heading.id = titleId;
  section.appendChild(heading);
  section.appendChild(make("p", "", focusByGame[game] || "Apply the mathematics in this lesson through independent practice."));
  section.appendChild(make("p", "",
    "Use the lesson explanations and worked examples, practice the matching skill, then return here to explain your strategy. The game reinforces one part of the lesson and does not replace its assignment."));
  section.appendChild(make("p", "", "Game progress is local practice, not an official course assessment."));
  section.style.cssText = "border:2px solid #a98954;border-radius:7px;padding:18px;margin-bottom:18px;background:#fff9ed;color:#30281e;";
  const actions = make("div", "actions");
  actions.appendChild(makeLink("Practice with " + title + " →"));
  section.appendChild(actions);
  return section;
}

function makeGeneralCompanion() {
  const section = make("section", "block math-shared-game-companion");
  section.id = sectionId;
  section.setAttribute("aria-labelledby", titleId);
  const wrap = make("div", "wrap"), card = make("article", "card");
  const label = make("span", "math-game-companion-kicker", "Lesson game · skill practice");
  label.style.cssText = "display:block;font-size:14px;font-weight:600;letter-spacing:.04em;margin-bottom:8px;";
  card.appendChild(label);
  const heading = make("h2", "", title);
  heading.id = titleId;
  card.appendChild(heading);
  card.style.cssText = "border:2px solid #a98954;border-radius:7px;background:#fff9ed;color:#30281e;";
  card.appendChild(make("p", "",
    focusByGame[game] || "Practice a related mathematical skill, then return to the lesson to explain what it shows. This game supports, but does not replace, the full lesson."));
  const actions = make("div", "actions");
  actions.appendChild(makeLink("Open Learning Game"));
  card.appendChild(actions);wrap.appendChild(card);section.appendChild(wrap);
  return section;
}

function inject() {
  if (document.getElementById(sectionId)) return true;
  const main = document.querySelector("main");
  if (!main) return false;
  // Place the companion at the top of the learning content in every math course.
  // The first lesson content remains directly below it and keeps its original order.
  const lessonColumn = main.querySelector(".lesson-main") ||
    main.querySelector(".lesson-content") ||
    main.querySelector(".lesson-body");
  if (lessonColumn) {
    const section = makeFocusedCompanion();
    const companions = [...lessonColumn.querySelectorAll(".math-shared-game-companion")];
    if (companions.length) companions[companions.length - 1].insertAdjacentElement("afterend", section);
    else lessonColumn.insertBefore(section, lessonColumn.firstChild);
    return true;
  }

  const section = makeGeneralCompanion();
  const companions = [...main.querySelectorAll(".math-shared-game-companion")];
  const hero = main.querySelector(".lesson-hero, .lesson-header, .hero, .page-header");
  if (companions.length) companions[companions.length - 1].insertAdjacentElement("afterend", section);
  else if (hero && hero.parentNode === main) hero.insertAdjacentElement("afterend", section);
  else main.insertBefore(section, main.firstChild);
  return true;
}

function start() {
  if (inject()) return;
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (inject() || tries > 20) clearInterval(timer);
  }, 100);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
})();
