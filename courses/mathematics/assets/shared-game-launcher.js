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
if (lesson && typeof location !== "undefined" && location.href) gameURL.searchParams.set("returnTo", location.href.split("#")[0]);
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
    "Read the worked examples above, practice the linked mission, then use the visible return-to-lesson link in the game. Record a strategy, correction or question in your private lesson note."));
  section.appendChild(make("p", "", "Game progress is local practice, not an official course assessment."));
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
  card.appendChild(make("span", "pill good", "Shared Mathematics Game"));
  const heading = make("h2", "", title);
  heading.id = titleId;
  card.appendChild(heading);
  card.appendChild(make("p", "",
    "This lesson is connected to the canonical Khaemenes Mathematics game library. The same game grows in mathematical depth across courses rather than being duplicated."));
  const actions = make("div", "actions");
  actions.appendChild(makeLink("Open Learning Game"));
  card.appendChild(actions);wrap.appendChild(card);section.appendChild(wrap);
  return section;
}

function inject() {
  if (document.getElementById(sectionId)) return true;
  const main = document.querySelector("main");
  if (!main) return false;
  const lessonColumn = course === "algebra2" && (unit === "10" || unit === "11")
    ? main.querySelector(".lesson-main") : null;

  if (lessonColumn) {
    const section = makeFocusedCompanion();
    const companions = [...lessonColumn.querySelectorAll(".math-shared-game-companion")];
    const guided = [...lessonColumn.querySelectorAll(".lesson-section")].find(block =>
      block.querySelector("h2")?.textContent?.trim() === "Guided and independent practice");
    const target = companions.length ? companions[companions.length - 1] : (guided || null);
    if (target && target.parentNode === lessonColumn) target.insertAdjacentElement("afterend", section);
    else lessonColumn.appendChild(section);
    return true;
  }

  const section = makeGeneralCompanion();
  const companions = [...main.querySelectorAll(".math-shared-game-companion")];
  const blocks = [...main.querySelectorAll("section.block")];
  const target = companions.length ? companions[companions.length - 1] : (blocks[0] || main.firstElementChild);
  if (target && target.parentNode) target.insertAdjacentElement("afterend", section);
  else main.appendChild(section);
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
