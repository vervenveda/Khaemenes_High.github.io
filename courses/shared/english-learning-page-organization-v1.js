/* Khaemenes Academy · Evidence-Based English Page Organization v1
   Progressive disclosure for English 9-12 weekly learning pages.
   Presentation/interaction only: no learner records, grades, mastery, or storage are modified.
*/
(()=>{"use strict";
if(window.__KHAE_ENGLISH_PAGE_ORGANIZATION_V1__)return;
window.__KHAE_ENGLISH_PAGE_ORGANIZATION_V1__=true;

const weekPath=/\/courses\/language-arts\/english-(9|10|11|12)\/weeks\/week-(\d{2})\//i;
const match=location.pathname.match(weekPath);
if(!match)return;

const style=document.createElement("style");
style.id="khaeEnglishLearningOrganizationV1";
style.textContent=`
:root{--khae-org-line:rgba(40,35,26,.18);--khae-org-paper:#fffdf8;--khae-org-paper2:#f4efe5;--khae-org-ink:#24231f;--khae-org-muted:#5f5a50;--khae-org-gold:#8d6e2f}
.khae-learning-controls{width:min(1100px,calc(100% - 28px));margin:18px auto;padding:16px;border:1px solid var(--khae-org-line);border-radius:7px;background:var(--khae-org-paper);text-align:center}
.khae-learning-controls .khae-org-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:10px}
.khae-learning-controls button{min-height:44px;padding:10px 16px;border:1px solid var(--khae-org-line);border-radius:7px;background:#22231f;color:#f7f2e8;font:400 16px/1.2 "Brandon Grotesque",Nunito,"Avenir Next",Arial,sans-serif;cursor:pointer}
.khae-learning-controls p{margin:6px auto;color:var(--khae-org-muted);max-width:780px}
details.khae-learning-step{width:100%;margin:14px 0;border:1px solid var(--khae-org-line);border-radius:7px;background:var(--khae-org-paper);overflow:clip}
details.khae-learning-step>summary{list-style:none;cursor:pointer;padding:18px 20px;background:var(--khae-org-paper2);display:grid;gap:5px;text-align:left}
details.khae-learning-step>summary::-webkit-details-marker{display:none}
details.khae-learning-step>summary::after{content:"+";justify-self:end;grid-row:1 / span 2;font-size:24px;line-height:1;color:var(--khae-org-gold)}
details.khae-learning-step[open]>summary::after{content:"−"}
.khae-learning-step-title{font-family:Cinzel,"Iowan Old Style",Georgia,serif;font-size:24px;font-weight:400;color:var(--khae-org-ink)}
.khae-learning-step-meta{font-size:16px;color:var(--khae-org-muted)}
details.khae-learning-step>.khae-learning-step-body{padding:18px 20px}
details.khae-learning-step>.khae-learning-step-body>.lesson-day,
details.khae-learning-step>.khae-learning-step-body>.lesson-detail{margin:0!important;border:0!important;box-shadow:none!important;background:transparent!important;padding:0!important}
details.khae-supporting-section{margin:12px 0;border:1px solid var(--khae-org-line);border-radius:7px;background:var(--khae-org-paper)}
details.khae-supporting-section>summary{cursor:pointer;padding:13px 16px;font-size:16px;font-weight:400}
details.khae-supporting-section>.khae-support-body{padding:0 16px 16px}
@media(max-width:620px){.khae-learning-controls{width:min(100% - 18px,1100px)}details.khae-learning-step>summary{padding:15px}.khae-learning-step-title{font-size:22px}}
@media print{.khae-learning-controls{display:none!important}details.khae-learning-step,details.khae-supporting-section{display:block!important}details.khae-learning-step>.khae-learning-step-body,details.khae-supporting-section>.khae-support-body{display:block!important}}
`;
(document.head||document.documentElement).append(style);

const clean=s=>String(s||"").replace(/\s+/g," ").trim();
const titleOf=el=>clean(el.querySelector("h2,h3")?.textContent)||"Learning step";
const metaOf=el=>{
  const eyebrow=clean(el.querySelector(".eyebrow,.lesson-meta,.tag")?.textContent);
  const objectiveNode=[...el.querySelectorAll("p")].find(p=>/objective:|learning target/i.test(clean(p.textContent)));
  const comment=clean(el.querySelector(".comment")?.textContent);
  const objective=clean(objectiveNode?.textContent);
  return objective || comment || eyebrow || "Open this learning step";
};

function wrapLearningCard(card,index){
  if(!card?.isConnected||card.closest("details.khae-learning-step"))return null;
  const details=document.createElement("details");
  details.className="khae-learning-step";
  details.dataset.learningStep=String(index+1);
  if(index===0)details.open=true;
  const summary=document.createElement("summary");
  const title=document.createElement("span");title.className="khae-learning-step-title";title.textContent=titleOf(card);
  const meta=document.createElement("span");meta.className="khae-learning-step-meta";meta.textContent=metaOf(card);
  summary.append(title,meta);
  const body=document.createElement("div");body.className="khae-learning-step-body";
  card.parentNode.insertBefore(details,card);
  details.append(summary,body);body.append(card);
  return details;
}

function markExistingDetails(){
  document.querySelectorAll("details").forEach(d=>{
    if(d.matches(".khae-learning-step,.khae-supporting-section"))return;
    const label=clean(d.querySelector(":scope>summary")?.textContent).toLowerCase();
    if(/support|access|extension|enrichment|teacher|standards|source|reference|background|vocabulary|how work|navigation/.test(label)){
      d.open=false;
      d.dataset.khaeCollapsedByDefault="true";
    }
  });
}

function wrapSupportingSection(section,label){
  if(!section?.isConnected||section.closest("details"))return;
  const details=document.createElement("details");details.className="khae-supporting-section";details.open=false;
  const summary=document.createElement("summary");summary.textContent=label;
  const body=document.createElement("div");body.className="khae-support-body";
  section.parentNode.insertBefore(details,section);details.append(summary,body);body.append(section);
}

function buildControls(steps){
  if(!steps.length||document.querySelector(".khae-learning-controls"))return;
  const box=document.createElement("section");box.className="khae-learning-controls";box.setAttribute("aria-label","Learning page controls");
  box.innerHTML='<p class="eyebrow">Focused Learning View</p><h2 style="margin:.2rem 0;font-size:24px;font-weight:400">Open one learning step at a time.</h2><p>The lesson path stays visible while supporting detail remains tucked away. Open sections as you need them; your work and scores are unchanged.</p><div class="khae-org-actions"><button type="button" data-khae-expand>Expand All</button><button type="button" data-khae-collapse>Collapse All</button></div>';
  const main=document.querySelector("main")||document.body;
  const first=main.querySelector(".quick-nav,.hero,section");
  if(first?.nextSibling)first.parentNode.insertBefore(box,first.nextSibling); else main.prepend(box);
  box.querySelector("[data-khae-expand]").addEventListener("click",()=>document.querySelectorAll("details.khae-learning-step,details.khae-supporting-section").forEach(d=>d.open=true));
  box.querySelector("[data-khae-collapse]").addEventListener("click",()=>{document.querySelectorAll("details.khae-learning-step,details.khae-supporting-section").forEach(d=>d.open=false);steps[0].open=true;steps[0].scrollIntoView({block:"nearest"});});
}

function enhance(){
  markExistingDetails();
  let cards=[...document.querySelectorAll("article.lesson-day")];
  if(!cards.length)cards=[...document.querySelectorAll("#lessons article.lesson-detail")].filter(x=>x.querySelector("textarea,[data-save-field],.flow,.lesson-grid"));
  const steps=cards.map(wrapLearningCard).filter(Boolean);
  const supportTargets=[
    ["#work","Continuing notebook"],
    ["[data-evidence-architecture]","Retrieval & transfer reference"]
  ];
  for(const [sel,label] of supportTargets)document.querySelectorAll(sel).forEach(el=>wrapSupportingSection(el,label));
  buildControls(steps);
  markExistingDetails();
  document.querySelectorAll("#quiz,#assessment,[data-weekly-quiz],[data-mastery-assessment]").forEach(el=>el.dataset.khaeAlwaysVisible="true");
  document.documentElement.dataset.khaeLearningPageOrganization="v1";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance,{once:true});else enhance();
})();