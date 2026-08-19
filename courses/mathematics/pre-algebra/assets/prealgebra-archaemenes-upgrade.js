(() => {
"use strict";

/*
  Khaemenes Open-Age Pre-Algebra
  Archaemenes + Academic Style Upgrade v1

  Drop-in presentation/mentor layer.
  Does NOT alter quiz keys, scoring, mastery, exams, learner records, or placement.
*/

const MENTOR_URL = "https://artist1970.github.io/Archaemenes.github.io/high/";
const HIGH_URL = "https://vervenveda.github.io/Khaemenes_High.github.io/";
const BETA_URL = "https://vervenveda.com/beta/";

const css = `
:root{
  --k-paper:#f4f0e7;
  --k-paper2:#fbf9f4;
  --k-ink:#16231e;
  --k-muted:#64716b;
  --k-forest:#17392f;
  --k-forest2:#245246;
  --k-gold:#b48b45;
  --k-gold2:#e4d2aa;
  --k-burgundy:#71363e;
  --k-line:rgba(20,40,32,.14);
  --k-formal:Cinzel,"Palatino Linotype",Palatino,Georgia,serif;
  --k-body:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif;
}

/* Overall course atmosphere */
body{
  font-family:var(--k-body)!important;
  background:
    radial-gradient(circle at 52% -12rem,rgba(180,139,69,.13),transparent 36rem),
    linear-gradient(180deg,#fbfaf6,var(--k-paper))!important;
  color:var(--k-ink)!important;
}
body::before{opacity:.15!important}
.app{grid-template-columns:minmax(290px,330px) minmax(0,1fr)!important}

/* Sidebar */
.sidebar{
  background:linear-gradient(180deg,#102f27,#0c241e)!important;
  border-right:1px solid rgba(255,255,255,.12)!important;
  box-shadow:10px 0 30px rgba(16,35,29,.08)!important;
}
.sidebar .brand,.sidebar .panel{
  background:rgba(255,255,255,.055)!important;
  border-color:rgba(255,255,255,.12)!important;
  box-shadow:none!important;
}
.sidebar .brand h2,.sidebar h3{font-family:var(--k-formal)!important;color:#fff8e8!important}
.sidebar p,.sidebar label,.sidebar .small{color:rgba(255,255,255,.67)!important}
.sidebar .seal{
  color:#172c25!important;
  background:linear-gradient(145deg,#f2dfb2,#d0a85a)!important;
  border-color:#eed49c!important;
}
.sidebar input,.sidebar select,.sidebar textarea{
  background:rgba(0,0,0,.22)!important;
  color:#fff!important;
  border-color:rgba(255,255,255,.18)!important;
}
.sidebar .navBtn,.sidebar .weekBtn{
  background:rgba(0,0,0,.16)!important;
  color:#f8f4ea!important;
  border-color:rgba(255,255,255,.12)!important;
}
.sidebar .navBtn.active,.sidebar .weekBtn.active{
  border-color:var(--k-gold2)!important;
  background:rgba(222,191,126,.14)!important;
}

/* Main */
.main{
  max-width:1420px!important;
  padding:36px clamp(24px,4vw,60px) 64px!important;
}
.hero{
  text-align:center!important;
  color:var(--k-ink)!important;
  border:1px solid var(--k-line)!important;
  border-radius:24px!important;
  background:
    radial-gradient(circle at 50% -10rem,rgba(180,139,69,.14),transparent 28rem),
    linear-gradient(180deg,#fffdf8,#f4eee1)!important;
  box-shadow:0 24px 60px rgba(20,40,32,.09)!important;
  padding:52px clamp(28px,5vw,76px)!important;
}
.hero:after{
  color:rgba(23,57,47,.045)!important;
  right:50%!important;
  transform:translateX(50%)!important;
  font-size:18rem!important;
}
.hero-topline{align-items:center!important}
.hero-identity{text-align:left!important}
.hero-home-badge{
  color:#fff!important;
  background:linear-gradient(145deg,#21483b,#0f2c24)!important;
  border-color:#2b5c4c!important;
  box-shadow:none!important;
}
.hero-route,.hero p{color:var(--k-muted)!important}
.eyebrow{color:var(--k-burgundy)!important;font-family:var(--k-formal)!important}
.hero h1{
  position:relative;z-index:2;
  max-width:1000px;margin:34px auto 18px!important;
  color:var(--k-forest)!important;
  font-family:var(--k-formal)!important;
  font-size:clamp(3.5rem,7vw,6.6rem)!important;
  font-weight:500!important;
  line-height:.94!important;
  letter-spacing:-.035em!important;
}
.hero > p{max-width:900px!important;margin-inline:auto!important;font-size:1.04rem!important}
.hero .actions{justify-content:center!important}

/* Header course controls */
.header-tools{justify-content:flex-end!important}
.header-control,.course-menu>summary{
  color:var(--k-forest)!important;
  background:#fff!important;
  border-color:var(--k-line)!important;
}
.course-menu[open]>summary{background:#f4eee1!important}
.course-menu-panel{
  color:#f9f5ec!important;
  background:rgba(12,35,29,.985)!important;
  border-color:rgba(228,210,170,.32)!important;
}
.course-menu-panel a,.course-menu-panel button{color:#fff!important}
.course-menu-label{color:var(--k-gold2)!important}

/* Tabs */
.tabs{
  justify-content:center!important;
  gap:9px!important;
  padding:12px!important;
  border:1px solid var(--k-line)!important;
  border-radius:16px!important;
  background:rgba(255,255,255,.63)!important;
}
.tab{
  color:var(--k-forest)!important;
  background:#fff!important;
  border-color:var(--k-line)!important;
}
.tab.active{color:#fff!important;background:var(--k-forest)!important;border-color:var(--k-forest)!important}

/* Dynamic course content */
#content{max-width:1240px;margin:0 auto}
#content .card{
  color:var(--k-ink)!important;
  background:rgba(255,253,248,.93)!important;
  border:1px solid var(--k-line)!important;
  border-radius:20px!important;
  box-shadow:0 11px 30px rgba(20,40,32,.055)!important;
}
#content .card h3,#content .card h4{
  color:var(--k-forest)!important;
  font-family:var(--k-formal)!important;
  font-weight:500!important;
}
#content .card p,#content td{color:#46564f!important}
#content th{color:var(--k-burgundy)!important}
.lesson,.assignment,.q,.toolBox,.rubric-item,.feedback-list{
  color:var(--k-ink)!important;
  background:#fbf8f0!important;
  border-color:var(--k-line)!important;
}
.choice{color:var(--k-ink)!important;background:#fff!important;border-color:var(--k-line)!important}
.notice{
  color:#604d27!important;
  background:#fbf4df!important;
  border-left-color:var(--k-gold)!important;
}
.progress{background:#e8e1d5!important;border-color:var(--k-line)!important}
.progress span{background:linear-gradient(90deg,#7c9f91,var(--k-gold),#6d9a75)!important}
.pill{color:#5f6d66!important;background:#f5f0e5!important;border-color:var(--k-line)!important}
.score,.kpi strong{color:var(--k-forest)!important}
.toolResult{color:#17392f!important;background:#f1f7f4!important;border-color:rgba(36,82,70,.22)!important}

/* Unified buttons */
#content button,#content .button,.hero button,.hero .button{
  color:#fff!important;
  background:var(--k-forest)!important;
  border:1px solid var(--k-forest)!important;
  box-shadow:none!important;
  border-radius:9px!important;
}
#content button.secondary,#content .button.secondary,.hero button.secondary,.hero .button.secondary{
  color:var(--k-forest)!important;
  background:#fff!important;
  border-color:var(--k-line)!important;
}
#content button.ghost,#content .button.ghost,.hero button.ghost,.hero .button.ghost{
  color:#6b5328!important;
  background:#fbf3de!important;
  border-color:#d7bc81!important;
}

/* Archaemenes course mentor */
.khae-mentor{
  max-width:1240px;
  margin:0 auto 24px;
  display:grid;
  grid-template-columns:minmax(160px,220px) minmax(0,1fr);
  gap:28px;
  align-items:center;
  padding:28px;
  border:1px solid var(--k-line);
  border-radius:24px;
  color:var(--k-ink);
  background:linear-gradient(135deg,#fffdf8,#f2ead9);
  box-shadow:0 20px 50px rgba(20,40,32,.08);
}
.khae-mentor-portrait{
  width:160px;height:160px;margin:auto;
  display:grid;place-items:center;
  border:1px solid #d4b672;border-radius:50%;
  background:radial-gradient(circle,#fff8e6,#ead7ad);
  overflow:hidden;
}
.khae-mentor-portrait img{width:100%;height:100%;object-fit:cover;object-position:center top}
.khae-mentor-copy{text-align:left}
.khae-mentor-kicker{
  color:var(--k-burgundy);
  font:600 .67rem var(--k-formal);
  letter-spacing:.16em;text-transform:uppercase
}
.khae-mentor h2{
  margin:5px 0 8px;
  color:var(--k-forest);
  font:500 clamp(1.8rem,4vw,3rem)/1 var(--k-formal)
}
.khae-mentor p{margin:0;color:var(--k-muted)}
.khae-mentor-context{
  margin-top:12px!important;
  color:var(--k-forest)!important;
  font-weight:700
}
.khae-mentor-actions{
  margin-top:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px
}
.khae-mentor-actions a,.khae-mentor-actions button{
  min-height:43px;display:flex;align-items:center;justify-content:center;
  padding:9px 13px;border:1px solid var(--k-line);border-radius:8px;
  font:700 .68rem var(--k-body);letter-spacing:.07em;text-transform:uppercase;
  text-decoration:none
}
.khae-mentor-actions .primary{color:#fff;background:var(--k-forest)}
.khae-mentor-actions .secondary{color:var(--k-forest);background:#fff}
.khae-mentor-note{
  margin-top:13px!important;
  font-size:.78rem!important;color:#7a817d!important
}

/* Stationary beta */
.khae-course-beta{
  position:fixed;right:18px;bottom:18px;z-index:1400;
  min-width:112px;min-height:42px;
  display:flex;align-items:center;justify-content:center;
  padding:9px 15px;border:1px solid #cbaa64;border-radius:999px;
  color:#2c2618!important;
  background:linear-gradient(145deg,#f5e6c0,#d9b66a);
  box-shadow:0 11px 28px rgba(18,34,28,.16);
  font:600 .61rem var(--k-formal);
  letter-spacing:.11em;text-transform:uppercase;text-decoration:none
}

@media(max-width:1000px){
  .app{grid-template-columns:1fr!important}
  .sidebar{position:relative!important;height:auto!important}
  .khae-mentor{grid-template-columns:1fr;text-align:center}
  .khae-mentor-copy{text-align:center}
  .header-tools{justify-content:center!important}
}
@media(max-width:620px){
  .main{padding:18px 14px 68px!important}
  .hero{padding:34px 18px!important}
  .hero h1{font-size:clamp(2.8rem,13vw,4.2rem)!important}
  .khae-mentor{padding:22px 16px}
  .khae-mentor-actions{grid-template-columns:1fr}
  .khae-course-beta{right:10px;bottom:10px;min-width:96px;min-height:38px;font-size:.55rem}
}
@media print{
  .khae-mentor,.khae-course-beta{display:none!important}
}
`;

const style = document.createElement("style");
style.id = "khaemenes-prealgebra-archaemenes-theme-v1";
style.textContent = css;
document.head.appendChild(style);

function currentWeekContext(){
  try{
    if(typeof APP !== "undefined" && Array.isArray(APP.weeks)){
      const w = APP.weeks.find(item => item.week === Number(window.activeWeek || 1)) || APP.weeks[0];
      return w ? {
        week:w.week,
        unit:w.unitTitle || "",
        lesson:w.title || "",
        concept:w.domain || ""
      } : null;
    }
  }catch{}
  return null;
}

function mentorHref(){
  const c = currentWeekContext();
  const q = new URLSearchParams({course:"Pre-Algebra"});
  if(c){
    q.set("week",`Week ${c.week}`);
    q.set("unit",c.unit);
    q.set("lesson",c.lesson);
    q.set("concept",c.concept);
  }
  return `${MENTOR_URL}?${q.toString()}`;
}

function mentorContextText(){
  const c = currentWeekContext();
  if(!c) return "Pre-Algebra · Open-Age Mathematics";
  return `Pre-Algebra · Week ${c.week} · ${c.unit} · ${c.lesson}`;
}

function createMentor(){
  if(document.getElementById("khaeCourseMentor")) return;
  const main = document.querySelector(".main");
  const tabs = main?.querySelector(".tabs");
  if(!main || !tabs) return;

  const section = document.createElement("section");
  section.className = "khae-mentor";
  section.id = "khaeCourseMentor";
  section.setAttribute("aria-labelledby","khaeMentorTitle");
  section.innerHTML = `
    <div class="khae-mentor-portrait">
      <img src="https://artist1970.github.io/Archaemenes.github.io/assets/Archaemens-high.png"
           alt="Archaemenes, educational mentor">
    </div>
    <div class="khae-mentor-copy">
      <div class="khae-mentor-kicker">Scholar · Educational Mentor · Mathematics</div>
      <h2 id="khaeMentorTitle">Study with Archaemenes.</h2>
      <p>When you need another explanation, a hint, a fresh practice example, or help organizing your reasoning, Archaemenes can meet you at your current place in the course.</p>
      <p class="khae-mentor-context" id="khaeMentorContext"></p>
      <div class="khae-mentor-actions">
        <a class="primary" id="khaeMentorLink" href="${mentorHref()}">Open Archaemenes</a>
        <a class="secondary" href="${HIGH_URL}">Khaemenes Sr. High</a>
      </div>
      <p class="khae-mentor-note">Mentor boundary: Archaemenes may explain, guide, practice and review. Course code remains authoritative for scoring, mastery, records and progression.</p>
    </div>`;
  tabs.before(section);
  refreshMentor();
}

function refreshMentor(){
  const context = document.getElementById("khaeMentorContext");
  const link = document.getElementById("khaeMentorLink");
  if(context) context.textContent = mentorContextText();
  if(link) link.href = mentorHref();
}

function addBeta(){
  if(document.getElementById("khaeCourseBeta")) return;
  const a = document.createElement("a");
  a.id = "khaeCourseBeta";
  a.className = "khae-course-beta";
  a.href = BETA_URL;
  a.textContent = "Beta Program";
  a.setAttribute("aria-label","Open the Verve N Veda Beta Program");
  document.body.appendChild(a);
}

/* Keep native <details> menus collapsible and mutually exclusive. */
function hardenMenus(){
  const menus = [...document.querySelectorAll("details.course-menu")];
  menus.forEach(menu => {
    menu.addEventListener("toggle",() => {
      if(menu.open) menus.forEach(other => { if(other !== menu) other.open = false; });
    });
  });
  document.addEventListener("pointerdown",event => {
    menus.forEach(menu => {
      if(menu.open && !menu.contains(event.target)) menu.open = false;
    });
  },{passive:true});
  document.addEventListener("keydown",event => {
    if(event.key === "Escape") menus.forEach(menu => menu.open = false);
  });
}

/* Update context when existing course navigation re-renders. */
const observer = new MutationObserver(() => refreshMentor());

function boot(){
  createMentor();
  addBeta();
  hardenMenus();
  const content = document.getElementById("content");
  if(content) observer.observe(content,{childList:true,subtree:true});
  document.addEventListener("click",event => {
    if(event.target.closest("[data-week],[data-view],[data-go]")){
      setTimeout(refreshMentor,30);
    }
  });
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();