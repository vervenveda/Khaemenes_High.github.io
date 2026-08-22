"use strict";
(() => {
  const path = window.location.pathname;
  if (!/\/courses\/science\/integrated-science-9\/units\/unit-03\/lessons\/day-\d{2}\.html$/.test(path)) return;

  const words = {
    "day-01": {word:"homeostasis", pron:"hoh-mee-oh-STAY-sis", pos:"noun", definition:"The dynamic regulation of internal conditions within functional ranges despite changing conditions.", context:"Homeostasis depends on feedback, sensing, coordination, and responses rather than keeping every variable perfectly constant.", check:"Why is homeostasis better described as dynamic regulation than perfect constancy?"},
    "day-02": {word:"perfusion", pron:"per-FYOO-zhun", pos:"noun", definition:"The delivery of blood through the vessels of a tissue or organ.", context:"Gas exchange depends not only on ventilation but also on perfusion that carries gases to and from exchange surfaces.", check:"How could reduced perfusion affect exchange even if ventilation stayed the same?"},
    "day-03": {word:"compliance", pron:"kum-PLY-uns", pos:"noun", definition:"The ability of a biological structure to stretch or deform in response to pressure or force.", context:"Vessel structure influences how walls respond to pressure and therefore affects circulation and flow.", check:"Why can mechanical properties of a vessel matter to its biological function?"},
    "day-04": {word:"gradient", pron:"GRAY-dee-unt", pos:"noun", definition:"A difference in a quantity across distance that can drive net movement or change.", context:"Oxygen and carbon dioxide show net diffusion across alveolar surfaces because concentration differences create gradients.", check:"What happens to net diffusion when a relevant concentration gradient becomes smaller?"},
    "day-05": {word:"recovery", pron:"rih-KUV-uh-ree", pos:"noun", definition:"The change of a measured system toward prior or baseline conditions after a disturbance or demand.", context:"Heart and breathing rates can be studied during recovery after activity without treating one curve as a diagnosis.", check:"Why can a recovery curve be scientifically useful without being diagnostically sufficient?"},
    "day-06": {word:"assimilation", pron:"uh-sim-uh-LAY-shun", pos:"noun", definition:"The uptake and use of absorbed nutrients by cells and tissues after those nutrients enter internal transport pathways.", context:"Absorption moves nutrients into blood or lymph; assimilation describes their later uptake and use by cells.", check:"How is assimilation different from absorption?"},
    "day-07": {word:"deamination", pron:"dee-am-uh-NAY-shun", pos:"noun", definition:"The removal of an amino group from an amino acid during metabolism, producing nitrogen-containing waste that can contribute to urea formation.", context:"The liver processes amino acids and helps convert nitrogen-containing waste into urea for later excretion.", check:"Why does amino-acid processing create a connection between the liver and urinary system?"},
    "day-08": {word:"osmoregulation", pron:"oz-moh-reg-yoo-LAY-shun", pos:"noun", definition:"The regulation of water and dissolved-solute balance within an organism.", context:"ADH contributes to osmoregulation by changing how much water the kidneys reabsorb.", check:"Why is changing water reabsorption a regulatory response rather than simply filtration?"},
    "day-09": {word:"evaporation", pron:"ih-vap-uh-RAY-shun", pos:"noun", definition:"The change of liquid molecules into gas, transferring energy and often cooling the remaining surface.", context:"Sweat can cool skin when evaporation transfers thermal energy away from the body surface.", check:"Why can high humidity reduce the cooling effectiveness of sweating?"},
    "day-10": {word:"antagonistic", pron:"an-tag-uh-NIS-tik", pos:"adjective", definition:"Producing opposing effects within a system.", context:"Insulin and glucagon have antagonistic effects that help regulate blood glucose in opposite directions.", check:"How can opposing hormonal effects contribute to stable regulation?"},
    "day-11": {word:"synapse", pron:"SIN-aps", pos:"noun", definition:"A junction where one cell communicates with another, commonly through neurotransmitter release and receptor binding at a chemical synapse.", context:"A reflex pathway is not a simple wire because information passes through living cells and synaptic junctions.", check:"What makes a chemical synapse more than a passive connection?"},
    "day-12": {word:"specificity", pron:"spes-uh-FIS-uh-tee", pos:"noun", definition:"The selective relationship in which a signal, receptor, molecule, or response interacts with particular compatible targets.", context:"A hormone may circulate broadly, but only cells with suitable receptors respond in the relevant way.", check:"Why does the presence of a circulating hormone not mean every cell responds equally?"},
    "day-13": {word:"antigen", pron:"AN-tih-jen", pos:"noun", definition:"A molecular feature that can be specifically recognized by components of the adaptive immune system.", context:"A pathogen can contain many antigens; antigen, pathogen, symptom, and immune response are not interchangeable terms.", check:"Why is an antigen not the same thing as a pathogen?"},
    "day-14": {word:"interdependence", pron:"in-ter-dih-PEN-dens", pos:"noun", definition:"A condition in which parts of a system rely on and influence one another.", context:"Whole-body regulation depends on respiratory, circulatory, digestive, nervous, endocrine, muscular, skin, liver, and urinary functions interacting rather than operating independently.", check:"What is one example of two body systems whose functions depend directly on one another?"},
    "day-15": {word:"synthesis", pron:"SIN-thuh-sis", pos:"noun", definition:"The process of combining multiple ideas, observations, or lines of evidence into a coherent explanation or model.", context:"Unit mastery requires more than recalling organ names; it requires synthesizing matter, energy, information, feedback, evidence, and limitations.", check:"How is synthesis different from simply listing facts?"}
  };

  const match = path.match(/(day-\d{2})\.html$/);
  if (!match || !words[match[1]]) return;
  const entry = words[match[1]];
  const STORAGE_KEY = "khaemenes_science9_daily_vocab_v1";
  const learnaUrl = `https://vervenveda.github.io/arcade.github.io/Learn_a_New_Word_index.html?word=${encodeURIComponent(entry.word)}&source=science9-unit03-${match[1]}`;

  const host = document.querySelector("article.lesson-page");
  if (!host || host.querySelector("[data-science-daily-word]")) return;
  const meta = host.querySelector(".lesson-meta");
  const section = document.createElement("section");
  section.className = "lesson-section";
  section.dataset.scienceDailyWord = "true";
  section.innerHTML = `
    <div style="border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:14px;padding:18px;background:color-mix(in srgb,currentColor 4%,transparent)">
      <p class="eyebrow" style="margin-top:0">LeArnA · Daily Science Word</p>
      <h2 style="margin-bottom:4px">${entry.word}</h2>
      <p style="margin-top:0"><strong>${entry.pron}</strong> · ${entry.pos}</p>
      <p>${entry.definition}</p>
      <p><strong>In today's science:</strong> ${entry.context}</p>
      <div class="checkpoint" style="margin-top:14px"><p><strong>One-minute word check:</strong> ${entry.check}</p></div>
      <div class="lesson-actions no-print" style="margin-top:14px">
        <button class="btn" type="button" data-vocab-hear>🔊 Hear Word</button>
        <button class="btn" type="button" data-vocab-learned>✓ Mark Word Learned</button>
        <a class="btn primary" href="${learnaUrl}" target="_blank" rel="noopener noreferrer">Open LeArnA Adventure</a>
      </div>
      <p style="font-size:.88em;opacity:.8;margin-bottom:0">Vocabulary practice supports the lesson but does not replace science mastery evidence.</p>
    </div>`;

  if (meta && meta.nextSibling) host.insertBefore(section, meta.nextSibling);
  else host.prepend(section);

  const hear = section.querySelector("[data-vocab-hear]");
  hear?.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(entry.word);
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
  });

  const learned = section.querySelector("[data-vocab-learned]");
  let state = {};
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { state = {}; }
  function renderLearned() {
    if (!learned) return;
    const done = Boolean(state[match[1]]?.learned);
    learned.textContent = done ? "✓ Word Learned" : "✓ Mark Word Learned";
    learned.setAttribute("aria-pressed", String(done));
  }
  learned?.addEventListener("click", () => {
    const previous = Boolean(state[match[1]]?.learned);
    state[match[1]] = {word:entry.word, learned:!previous, updatedAt:new Date().toISOString()};
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    renderLearned();
  });
  renderLearned();
})();
