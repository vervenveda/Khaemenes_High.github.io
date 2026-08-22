"use strict";
(() => {
  const STUDIO_URL = "https://vervenveda.com/proresource_hub.github.io/Protools/Evidence_Citation_Studio/";
  const LAB_CLOUD_URL = `${STUDIO_URL}lab-resource-cloud.html`;
  const ATLAS_URL = "https://vervenveda.com/proresource_hub.github.io/Protools/Atlas_Evidence_Analysis.html";

  const path = window.location.pathname.toLowerCase();
  const title = document.title.toLowerCase();
  const bodyText = (document.body?.innerText || "").slice(0, 18000).toLowerCase();
  const context = `${title} ${path} ${bodyText}`;

  // Independent assessment surfaces stay free of research/editorial assistance.
  if (/mastery-quiz|unit-assessment|midterm|final-exam|exam/.test(path)) return;
  if (/independent attempt/.test(context) && /quiz|assessment/.test(context)) return;
  if (document.querySelector("#scienceProtoolsDock")) return;

  const evidenceRelevant = /evidence|source|citation|research|claim|cer|reasoning|provenance|reliability|counterevidence|model audit|scientific explanation|literature|reference/.test(context);
  const labRelevant = /lab|laboratory|investigation|dataset|microscopy|model task|performance task|experiment|experimental|portfolio|resource|field study|simulation/.test(context);
  const atlasRelevant = /competing explanation|alternative interpretation|causation|confound|contradict|opposing evidence|uncertain|uncertainty|timeline|pattern|correlation/.test(context);

  if (!evidenceRelevant && !labRelevant && !atlasRelevant) return;

  const host = document.querySelector("article.lesson-page")
    || document.querySelector("main article")
    || document.querySelector("main .unit-shell")
    || document.querySelector("main");
  if (!host) return;

  const tools = [];
  if (evidenceRelevant) {
    tools.push({
      label: "Evidence & Citation Studio",
      url: STUDIO_URL,
      note: "Build a local-first claim → source → evidence record with source classification, exact evidence locations, conflicting evidence, limitations, citation drafts, and provenance exports.",
      tag: "Research & Verification"
    });
  }
  if (labRelevant) {
    tools.push({
      label: "Lab Resource Cloud",
      url: LAB_CLOUD_URL,
      note: "Package, review, preserve, and route lab resources in a local IndexedDB vault. Use it for resource provenance and portable .khae-lab-resource.json packages—not as a substitute for collecting or analyzing scientific evidence.",
      tag: "Contained Lab Resources"
    });
  }
  if (atlasRelevant) {
    tools.push({
      label: "Atlas Evidence Analysis",
      url: ATLAS_URL,
      note: "Explore competing claims, observations, alternative explanations, contradictions, timelines, and unresolved evidence before formalizing a claim in Evidence & Citation Studio.",
      tag: "Competing Evidence"
    });
  }

  const section = document.createElement("section");
  section.id = "scienceProtoolsDock";
  section.className = "lesson-section science-protools-dock no-print";
  section.setAttribute("aria-labelledby", "scienceProtoolsHeading");
  section.innerHTML = `
    <div class="science-protools-head">
      <div>
        <p class="science-protools-eyebrow">ProReSources · Scientific Workflow</p>
        <h2 id="scienceProtoolsHeading">Evidence, Provenance & Lab Resources</h2>
      </div>
      <span class="science-protools-badge">Use by purpose</span>
    </div>
    <p class="science-protools-intro">These tools extend the scientific workflow when the task calls for them. Your observations, calculations, model choices, causal reasoning, and independent mastery evidence remain your own work.</p>
    <div class="science-protools-grid">
      ${tools.map(tool => `
        <a class="science-protool-card" href="${tool.url}" target="_blank" rel="noopener noreferrer">
          <span class="science-protool-tag">${tool.tag}</span>
          <strong>${tool.label}</strong>
          <span>${tool.note}</span>
        </a>`).join("")}
    </div>
    <div class="science-protools-flow">
      <strong>Recommended evidence flow:</strong>
      <span>Investigate / observe</span><b aria-hidden="true">→</b>
      <span>Atlas when competing interpretations matter</span><b aria-hidden="true">→</b>
      <span>Evidence & Citation Studio for the formal record</span><b aria-hidden="true">→</b>
      <span>PROSE only after the science is established</span>
    </div>
    <p class="science-protools-rule"><strong>Assessment boundary:</strong> ProTools support learning, provenance, correction, and communication. They do not generate first-attempt answers for mastery-gated quizzes, tests, or exams.</p>`;

  const anchor = host.querySelector(".lesson-actions") || host.querySelector("footer");
  if (anchor && anchor.parentNode === host) host.insertBefore(section, anchor);
  else host.append(section);

  if (!document.querySelector("#scienceProtoolsDockStyles")) {
    const style = document.createElement("style");
    style.id = "scienceProtoolsDockStyles";
    style.textContent = `
      .science-protools-dock{margin-top:24px;padding:22px;border:1px solid var(--line,rgba(255,255,255,.16));border-radius:16px;background:color-mix(in srgb,var(--panel,#102437) 92%,transparent)}
      .science-protools-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
      .science-protools-head h2{margin:.15rem 0 .4rem}
      .science-protools-eyebrow{margin:0;color:var(--gold,#d7b363);font-size:.76rem;letter-spacing:.12em;text-transform:uppercase;font-weight:800}
      .science-protools-badge{display:inline-flex;padding:.3rem .6rem;border:1px solid color-mix(in srgb,var(--teal,#62c8c0) 58%,transparent);border-radius:999px;color:var(--teal,#62c8c0);font-size:.75rem;font-weight:800}
      .science-protools-intro,.science-protools-rule{max-width:980px}
      .science-protools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:15px 0}
      .science-protool-card{display:flex;flex-direction:column;gap:7px;min-height:150px;padding:16px;border:1px solid var(--line,rgba(255,255,255,.16));border-radius:13px;background:color-mix(in srgb,var(--card,#0c1b2a) 94%,transparent);color:inherit;text-decoration:none}
      .science-protool-card:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--teal,#62c8c0) 60%,transparent)}
      .science-protool-card strong{font-size:1rem;color:var(--ink,#f4f2e9)}
      .science-protool-card>span:last-child{color:var(--muted,#b8c5cc);font-size:.88rem;line-height:1.52}
      .science-protool-tag{color:var(--gold,#d7b363);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;font-weight:800}
      .science-protools-flow{display:flex;flex-wrap:wrap;align-items:center;gap:7px;padding:12px;border-left:4px solid var(--teal,#62c8c0);border-radius:8px;background:color-mix(in srgb,var(--teal,#62c8c0) 8%,transparent);font-size:.84rem}
      .science-protools-flow b{color:var(--teal,#62c8c0)}
      .science-protools-rule{margin-bottom:0;font-size:.86rem;color:var(--muted,#b8c5cc)}
      @media(max-width:720px){.science-protools-grid{grid-template-columns:1fr}.science-protools-flow{display:block}.science-protools-flow>*{display:block;margin:4px 0}.science-protools-flow b{display:none}}
      @media print{.science-protools-dock{display:none!important}}
    `;
    document.head.append(style);
  }
})();
