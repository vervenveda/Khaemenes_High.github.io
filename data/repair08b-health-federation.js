(() => {
  "use strict";

  const BASE = "https://vervenveda.com/medicament-hub.github.io/academy/high-school-health/";
  const ROUTES = {
    academy: BASE,
    pe: BASE + "courses/physical-education/",
    health: BASE + "courses/health-wellness/",
    electives: BASE + "courses/electives/"
  };

  const style = document.createElement("style");
  style.textContent = `
    .r08b-section{padding:80px 22px;border-block:1px solid rgba(23,36,56,.15);background:#fffdf9}
    .r08b-inner{width:min(100%,1440px);margin:auto}
    .r08b-heading{max-width:900px;margin:0 auto 34px;text-align:center}
    .r08b-heading small{color:#9a5d4f;letter-spacing:.14em;text-transform:uppercase}
    .r08b-heading h2{margin:10px 0;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(2.5rem,4vw,4rem);font-weight:500;color:#0c1c2f}
    .r08b-heading p{color:#667382}
    .r08b-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    .r08b-card{display:flex;flex-direction:column;min-height:310px;padding:24px;border:1px solid rgba(23,36,56,.15);border-top:4px solid var(--a);border-radius:7px;background:#fff;box-shadow:0 18px 44px rgba(12,28,47,.08);text-align:left}
    .r08b-card small{color:#667382;letter-spacing:.08em;text-transform:uppercase}
    .r08b-card h3{margin:10px 0;font-family:"Cormorant Garamond",Georgia,serif;font-size:2.15rem;font-weight:500;color:#0c1c2f}
    .r08b-card p{color:#667382}.r08b-card a{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 13px;border-radius:7px;background:#0c1c2f;color:#fff;text-decoration:none}
    .r08b-fed{margin-top:18px;color:#667382;font-size:.78rem;text-align:center}
    @media(max-width:820px){.r08b-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function wireDepartment(titlePattern, href, label) {
    const headings = [...document.querySelectorAll("h2,h3,h4,strong")];
    const heading = headings.find(el => titlePattern.test((el.textContent || "").trim()));
    if (!heading) return false;

    const card = heading.closest("article,.department-card,.card") || heading.parentElement;
    if (!card) return false;

    card.querySelectorAll("a[data-r08b-link]").forEach(a => a.remove());

    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    a.dataset.r08bLink = "true";
    a.style.cssText = "display:inline-flex;align-items:center;justify-content:center;min-height:42px;margin-top:14px;padding:9px 13px;border-radius:7px;background:#0c1c2f;color:#fff;text-decoration:none;font-size:.76rem;letter-spacing:.05em;text-transform:uppercase";
    card.appendChild(a);
    return true;
  }

  function insertFederatedSection() {
    if (document.getElementById("whole-student-federation")) return;

    const section = document.createElement("section");
    section.className = "r08b-section";
    section.id = "whole-student-federation";
    section.innerHTML = `
      <div class="r08b-inner">
        <div class="r08b-heading">
          <small>Federated Whole-Student Campus</small>
          <h2>Movement, health and exploration — connected without duplication.</h2>
          <p>Khaemenes High routes students into the Medicament High School Health Academy. Medicament maintains the PE and Health course files; specialist repositories retain ownership of federated electives.</p>
        </div>
        <div class="r08b-grid">
          <article class="r08b-card" style="--a:#6f8374">
            <small>Grades 9–12 · Physical Education</small>
            <h3>Physical Education</h3>
            <p>42-week core curriculum, grade study guides and quizzes, PLERA reader, teacher guide, progress tools and current standards crosswalk.</p>
            <a href="${ROUTES.pe}">Open Physical Education</a>
          </article>
          <article class="r08b-card" style="--a:#9a5d4f">
            <small>Grades 9–12 · Health Education</small>
            <h3>Health & Wellness</h3>
            <p>Skills-based health literacy, relationships and safety, public-health systems, independent living, privacy and adult health navigation.</p>
            <a href="${ROUTES.health}">Open Health & Wellness</a>
          </article>
          <article class="r08b-card" style="--a:#b89a61">
            <small>Federated Specialist Study</small>
            <h3>Electives & Explorations</h3>
            <p>Visual art, music, languages, weather science, law, finance, environmental service, research, media literacy and professional tools.</p>
            <a href="${ROUTES.electives}">Explore Electives</a>
          </article>
        </div>
        <p class="r08b-fed">Source authority: Medicament High School Health Academy · Academic route: Khaemenes High · Specialist elective ownership remains distributed.</p>
      </div>`;
    const footer = document.querySelector("footer");
    if (footer?.parentNode) footer.parentNode.insertBefore(section, footer);
    else document.body.appendChild(section);
  }

  function boot() {
    wireDepartment(/Arts\s*&\s*Music/i, ROUTES.electives, "Open Electives");
    wireDepartment(/Health\s*&\s*Wellness/i, ROUTES.academy, "Open Health Academy");
    wireDepartment(/Career\s*&\s*Life/i, ROUTES.electives, "Explore Career & Life");
    insertFederatedSection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(boot, 0), {once:true});
  } else {
    setTimeout(boot, 0);
  }
})();