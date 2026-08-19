(() => {
"use strict";

/*
  Khaemenes Open-Age Algebra I / Integrated Mathematics I
  Archaemenes + Academic Style Upgrade v1

  Presentation + mentor layer only.
  Does not alter curriculum, practice banks, assessments, mastery, records, or profile logic.
*/

const MENTOR_URL = "https://artist1970.github.io/Archaemenes.github.io/high/";
const HIGH_URL = "https://vervenveda.com/Khaemenes_High.github.io/";
const PREALGEBRA_URL = "https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/pre-algebra/";
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

html{color-scheme:light!important}
html[data-theme="dark"],html[data-theme="light"]{
  --black:#f4f0e7!important;
  --bg:#f7f4ed!important;
  --panel:#fffdf8!important;
  --panel2:#f0eadf!important;
  --ink:#16231e!important;
  --muted:#64716b!important;
  --line:rgba(180,139,69,.28)!important;
  --soft-line:rgba(20,40,32,.13)!important;
  --grid:rgba(20,40,32,.035)!important;
  --shadow:0 20px 55px rgba(20,40,32,.08)!important;
}

body{
  font-family:var(--k-body)!important;
  color:var(--k-ink)!important;
  background:
    radial-gradient(circle at 50% -10rem,rgba(180,139,69,.13),transparent 35rem),
    linear-gradient(180deg,#fbfaf6,var(--k-paper))!important;
}
body::before{opacity:.25!important}

/* Header */
.site-header{
  background:rgba(244,240,231,.975)!important;
  border-bottom:1px solid var(--k-line)!important;
  box-shadow:0 8px 26px rgba(20,40,32,.06)!important;
}
.brand-home{
  color:#fff!important;
  background:linear-gradient(145deg,#21483b,#0f2c24)!important;
  border-color:#2b5c4c!important;
  box-shadow:none!important;
}
.brand-copy strong{
  font-family:var(--k-formal)!important;
  color:var(--k-forest)!important;
  font-weight:500!important;
}
.brand-copy small{color:var(--k-muted)!important}
.header-control,.course-menu>summary{
  color:var(--k-forest)!important;
  background:#fff!important;
  border-color:var(--k-line)!important;
}
.course-menu-panel{
  color:#fff!important;
  background:rgba(12,35,29,.985)!important;
  border-color:rgba(228,210,170,.30)!important;
}
.course-menu-panel a,.course-menu-panel button{color:#fff!important}
.course-menu-panel a:hover,.course-menu-panel button:hover{background:rgba(255,255,255,.08)!important}
.breadcrumb{
  background:rgba(255,255,255,.5)!important;
  border-bottom:1px solid var(--k-line)!important;
}
.breadcrumb .wrap{color:var(--k-muted)!important}
.breadcrumb a{color:var(--k-forest)!important}

/* Hero */
.hero{
  padding:clamp(84px,9vw,132px) 0 clamp(78px,8vw,116px)!important;
  color:var(--k-ink)!important;
  border-bottom:1px solid var(--k-line)!important;
  background:
    radial-gradient(circle at 50% -20%,rgba(180,139,69,.18),transparent 34rem),
    linear-gradient(180deg,#fffdf8,#f4eee2)!important;
}
.hero::before{
  border-color:rgba(23,57,47,.065)!important;
  box-shadow:0 0 0 72px rgba(23,57,47,.02),0 0 0 144px rgba(23,57,47,.013)!important;
}
.hero-badge{
  color:#fff!important;
  background:linear-gradient(145deg,#21483b,#0f2c24)!important;
  border-color:#2b5c4c!important;
}
.eyebrow{
  color:var(--k-burgundy)!important;
  font-family:var(--k-formal)!important;
  font-weight:600!important;
}
.hero h1{
  color:var(--k-forest)!important;
  font-family:var(--k-formal)!important;
  font-size:clamp(3.7rem,7vw,7rem)!important;
  font-weight:500!important;
  line-height:.94!important;
  letter-spacing:-.04em!important;
}
.hero .lead{color:var(--k-muted)!important}
.snapshot{
  border-color:var(--k-line)!important;
  background:rgba(255,255,255,.7)!important;
  box-shadow:0 18px 45px rgba(20,40,32,.06)!important;
}
.metric{border-color:var(--k-line)!important}
.metric strong{color:var(--k-forest)!important;font-family:var(--k-formal)!important}
.metric span{color:var(--k-muted)!important}

/* Quick navigation */
.quick-nav{
  background:rgba(244,240,231,.97)!important;
  border-bottom:1px solid var(--k-line)!important;
}
.quick-nav button{
  color:var(--k-forest)!important;
  border-color:var(--k-line)!important;
  background:#fff!important;
}
.quick-nav button:hover,.quick-nav button.active{
  color:#fff!important;
  background:var(--k-forest)!important;
  border-color:var(--k-forest)!important;
}

/* Main cards */
main{background:transparent!important}
.section-head h2,.card h2,.card h3,.card h4,.day-card h4{
  color:var(--k-forest)!important;
  font-family:var(--k-formal)!important;
  font-weight:500!important;
}
.section-head p:not(.eyebrow),.card p,.day-card p,.card li{color:var(--k-muted)!important}
.card,.day-card,.question{
  border:1px solid var(--k-line)!important;
  background:rgba(255,253,248,.94)!important;
  box-shadow:0 11px 30px rgba(20,40,32,.055)!important;
}
.card a:not(.btn):not(.button){color:#6d5428!important}
.progress{background:#e7dfd2!important}
.progress span{background:linear-gradient(90deg,#7c9f91,var(--k-gold))!important}
.pill{color:#5f6d66!important;background:#f5f0e5!important;border-color:var(--k-line)!important}
.score{color:var(--k-forest)!important;font-family:var(--k-formal)!important}
.notice{color:#604d27!important;background:#fbf4df!important;border-left-color:var(--k-gold)!important}
input,select,textarea{color:var(--k-ink)!important;background:#fff!important;border-color:var(--k-line)!important}

/* Buttons */
.btn,.button{
  color:var(--k-forest)!important;
  background:#fff!important;
  border-color:var(--k-line)!important;
}
.btn.primary,.button.primary,.btn.gold{
  color:#fff!important;
  background:var(--k-forest)!important;
  border-color:var(--k-forest)!important;
}
.btn:hover,.button:hover{background:#f7f2e7!important}

/* Archaemenes mentor */
.khae-algebra-mentor{
  width:min(calc(100% - 42px),1240px);
  margin:0 auto 30px;
  padding:30px;
  display:grid;
  grid-template-columns:minmax(160px,220px) minmax(0,1fr);
  gap:30px;
  align-items:center;
  border:1px solid var(--k-line);
  border-radius:24px;
  background:linear-gradient(135deg,#fffdf8,#f2ead9);
  box-shadow:0 20px 50px rgba(20,40,32,.08);
}
.khae-algebra-portrait{
  width:168px;height:168px;margin:auto;
  overflow:hidden;border:1px solid #d4b672;border-radius:50%;
  background:radial-gradient(circle,#fff8e6,#ead7ad)
}
.khae-algebra-portrait img{width:100%;height:100%;object-fit:cover;object-position:center top}
.khae-algebra-copy{text-align:left}
.khae-algebra-kicker{
  color:var(--k-burgundy);
  font:600 .67rem var(--k-formal);
  letter-spacing:.16em;text-transform:uppercase
}
.khae-algebra-mentor h2{
  margin:5px 0 8px;
  color:var(--k-forest);
  font:500 clamp(1.9rem,4vw,3.1rem)/1 var(--k-formal)
}
.khae-algebra-mentor p{margin:0;color:var(--k-muted)}
.khae-algebra-context{
  margin-top:12px!important;
  color:var(--k-forest)!important;
  font-weight:700
}
.khae-algebra-actions{
  margin-top:18px;
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px
}
.khae-algebra-actions a{
  min-height:43px;display:flex;align-items:center;justify-content:center;
  padding:9px 13px;border:1px solid var(--k-line);border-radius:8px;
  font-size:.68rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;
  text-decoration:none
}
.khae-algebra-actions .primary{color:#fff;background:var(--k-forest)}
.khae-algebra-actions .secondary{color:var(--k-forest);background:#fff}
.khae-algebra-note{margin-top:13px!important;font-size:.78rem!important;color:#7a817d!important}

/* Fixed beta */
.khae-algebra-beta{
  position:fixed;right:18px;bottom:18px;z-index:1300;
  min-width:112px;min-height:42px;
  display:flex;align-items:center;justify-content:center;
  padding:9px 15px;border:1px solid #cbaa64;border-radius:999px;
  color:#2c2618!important;background:linear-gradient(145deg,#f5e6c0,#d9b66a);
  box-shadow:0 11px 28px rgba(18,34,28,.16);
  font:600 .61rem var(--k-formal);letter-spacing:.11em;text-transform:uppercase;text-decoration:none
}

@media(max-width:860px){
  .khae-algebra-mentor{grid-template-columns:1fr;text-align:center}
  .khae-algebra-copy{text-align:center}
  .khae-algebra-actions{grid-template-columns:1fr}
}
@media(max-width:620px){
  .hero h1{font-size:clamp(3rem,13vw,4.8rem)!important}
  .khae-algebra-mentor{width:min(calc(100% - 28px),1240px);padding:22px 16px}
  .khae-algebra-beta{right:10px;bottom:10px;min-width:96px;min-height:38px;font-size:.55rem}
}
@media print{
  .khae-algebra-mentor,.khae-algebra-beta{display:none!important}
}
`;

const style = document.createElement("style");
style.id = "khaemenes-algebra1-archaemenes-theme-v1";
style.textContent = css;
document.head.appendChild(style);

function contextFromPage(){
  const activeView = document.querySelector(".quick-nav button.active")?.textContent?.trim() || "";
  const heading = document.querySelector(".view.active .section-head h2, .view.active h2, .view.active h3")?.textContent?.trim() || "";
  const week = document.querySelector(".week-chip.active strong")?.textContent?.trim() || "";
  return {activeView, heading, week};
}

function mentorHref(){
  const c = contextFromPage();
  const q = new URLSearchParams({course:"Algebra I"});
  if(c.week) q.set("week",`Week ${c.week}`);
  if(c.activeView) q.set("unit",c.activeView);
  if(c.heading) q.set("lesson",c.heading.slice(0,120));
  q.set("concept","algebra");
  return `${MENTOR_URL}?${q.toString()}`;
}

function mentorContext(){
  const c = contextFromPage();
  const parts = ["Algebra I"];
  if(c.week) parts.push(`Week ${c.week}`);
  if(c.activeView) parts.push(c.activeView);
  if(c.heading && c.heading !== c.activeView) parts.push(c.heading);
  return parts.join(" · ");
}

function createMentor(){
  if(document.getElementById("khaeAlgebraMentor")) return;
  const main = document.querySelector("main");
  if(!main) return;

  const section = document.createElement("section");
  section.className = "khae-algebra-mentor";
  section.id = "khaeAlgebraMentor";
  section.setAttribute("aria-labelledby","khaeAlgebraMentorTitle");
  section.innerHTML = `
    <div class="khae-algebra-portrait">
      <img src="https://artist1970.github.io/Archaemenes.github.io/assets/Archaemens-high.png"
           alt="Archaemenes, High School educational mentor">
    </div>
    <div class="khae-algebra-copy">
      <div class="khae-algebra-kicker">Scholar · Educational Mentor · Mathematics</div>
      <h2 id="khaeAlgebraMentorTitle">Study Algebra with Archaemenes.</h2>
      <p>Use Archaemenes when you want another explanation, a hint, a fresh example, or help organizing algebraic reasoning without handing over graded work.</p>
      <p class="khae-algebra-context" id="khaeAlgebraContext"></p>
      <div class="khae-algebra-actions">
        <a class="primary" id="khaeAlgebraMentorLink" href="${mentorHref()}">Open Archaemenes</a>
        <a class="secondary" href="${PREALGEBRA_URL}">Review Pre-Algebra</a>
        <a class="secondary" href="${HIGH_URL}">Khaemenes Sr. High</a>
      </div>
      <p class="khae-algebra-note">Mentor boundary: Archaemenes can explain, guide, practice and review. Algebra I course code remains authoritative for assessment, mastery, records and progression.</p>
    </div>`;
  main.prepend(section);
  refreshMentor();
}

function refreshMentor(){
  const ctx = document.getElementById("khaeAlgebraContext");
  const link = document.getElementById("khaeAlgebraMentorLink");
  if(ctx) ctx.textContent = mentorContext();
  if(link) link.href = mentorHref();
}

function addBeta(){
  if(document.getElementById("khaeAlgebraBeta")) return;
  const a = document.createElement("a");
  a.id = "khaeAlgebraBeta";
  a.className = "khae-algebra-beta";
  a.href = BETA_URL;
  a.textContent = "Beta Program";
  a.setAttribute("aria-label","Open the Verve N Veda Beta Program");
  document.body.appendChild(a);
}

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

function boot(){
  createMentor();
  addBeta();
  hardenMenus();
  document.addEventListener("click",event => {
    if(event.target.closest(".quick-nav button,.week-chip,[data-view],[data-go]")){
      setTimeout(refreshMentor,30);
    }
  });
  const main = document.querySelector("main");
  if(main){
    new MutationObserver(refreshMentor).observe(main,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});
  }
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();