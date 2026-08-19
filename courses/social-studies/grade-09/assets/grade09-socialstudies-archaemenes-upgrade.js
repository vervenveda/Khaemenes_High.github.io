(() => {
"use strict";

/*
  Khaemenes Grade 9 Global Studies Honors
  Archaemenes + Academic Style Upgrade v1
  Presentation / mentor layer only.
*/

const MENTOR_URL = "https://artist1970.github.io/Archaemenes.github.io/high/";
const HIGH_URL = "https://vervenveda.com/Khaemenes_High.github.io/";
const ARSHIF_URL = "https://vervenveda.github.io/Arshif.github.io/";
const VERIFIER_URL = "https://vervenveda.github.io/theverifier.github.io/";
const BETA_URL = "https://vervenveda.com/beta/";

const css = `
:root{
  --k-paper:#f4f0e7;--k-paper2:#fbf9f4;--k-ink:#16231e;--k-muted:#64716b;
  --k-forest:#17392f;--k-gold:#b48b45;--k-gold2:#e4d2aa;--k-burgundy:#71363e;
  --k-line:rgba(20,40,32,.14);
  --k-formal:Cinzel,"Palatino Linotype",Palatino,Georgia,serif;
  --k-body:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif;
}

body{
  font-family:var(--k-body)!important;
  color:var(--k-ink)!important;
  background:
    radial-gradient(circle at 50% -10rem,rgba(180,139,69,.13),transparent 35rem),
    linear-gradient(180deg,#fbfaf6,var(--k-paper))!important;
}
body:before{opacity:.12!important}
.app{grid-template-columns:minmax(290px,330px) minmax(0,1fr)!important}
.sidebar{
  background:linear-gradient(180deg,#102f27,#0c241e)!important;
  border-right:1px solid rgba(255,255,255,.11)!important;
}
.sidebar .brand,.sidebar .panel{
  background:rgba(255,255,255,.055)!important;
  border-color:rgba(255,255,255,.12)!important;
  box-shadow:none!important;
}
.sidebar .brand h1,.sidebar h3{
  color:#fff8e8!important;
  font-family:var(--k-formal)!important;
  font-weight:500!important;
}
.sidebar p,.sidebar label,.sidebar .small,.sidebar .crumbs{color:rgba(255,255,255,.68)!important}
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
.sidebar .navBtn,.sidebar .weekButton{
  background:rgba(0,0,0,.16)!important;
  color:#f8f4ea!important;
  border-color:rgba(255,255,255,.12)!important;
}
.sidebar .navBtn.active,.sidebar .weekButton.active{
  border-color:var(--k-gold2)!important;
  background:rgba(222,191,126,.14)!important;
}

.main{max-width:1420px!important;padding:36px clamp(24px,4vw,60px) 64px!important}
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
.eyebrow{
  color:var(--k-burgundy)!important;
  font-family:var(--k-formal)!important;
  font-weight:600!important;
}
.hero h2{
  color:var(--k-forest)!important;
  font-family:var(--k-formal)!important;
  font-size:clamp(3rem,6vw,5.8rem)!important;
  font-weight:500!important;
  line-height:.95!important;
  letter-spacing:-.035em!important;
}
.hero p{max-width:920px!important;margin-inline:auto!important;color:var(--k-muted)!important}
.hero .actions{justify-content:center!important}

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
.tab.active{
  color:#fff!important;
  background:var(--k-forest)!important;
  border-color:var(--k-forest)!important;
}

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
.lesson,.quizQ,.assignment{
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
.progressbar{background:#e8e1d5!important;border-color:var(--k-line)!important}
.progressbar span{background:linear-gradient(90deg,#7c9f91,var(--k-gold),#6d9a75)!important}
.pill{color:#5f6d66!important;background:#f5f0e5!important;border-color:var(--k-line)!important}
.score,.kpi strong{color:var(--k-forest)!important}

/* Buttons */
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

/* Archaemenes social studies mentor */
.khae-ss-mentor{
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
.khae-ss-portrait{
  width:160px;height:160px;margin:auto;
  border:1px solid #d4b672;border-radius:50%;
  background:radial-gradient(circle,#fff8e6,#ead7ad);
  overflow:hidden;
}
.khae-ss-portrait img{width:100%;height:100%;object-fit:cover;object-position:center top}
.khae-ss-copy{text-align:left}
.khae-ss-kicker{
  color:var(--k-burgundy);
  font:600 .67rem var(--k-formal);
  letter-spacing:.16em;text-transform:uppercase
}
.khae-ss-mentor h2{
  margin:5px 0 8px;
  color:var(--k-forest);
  font:500 clamp(1.8rem,4vw,3rem)/1 var(--k-formal)
}
.khae-ss-mentor p{margin:0;color:var(--k-muted)}
.khae-ss-context{margin-top:12px!important;color:var(--k-forest)!important;font-weight:700}
.khae-ss-actions{
  margin-top:18px;
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:9px
}
.khae-ss-actions a{
  min-height:43px;
  display:flex;align-items:center;justify-content:center;
  padding:9px 13px;
  border:1px solid var(--k-line);
  border-radius:8px;
  font-size:.68rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;
  text-decoration:none
}
.khae-ss-actions .primary{color:#fff;background:var(--k-forest)}
.khae-ss-actions .secondary{color:var(--k-forest);background:#fff}
.khae-ss-note{margin-top:13px!important;font-size:.78rem!important;color:#7a817d!important}

/* Beta */
.khae-ss-beta{
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

@media(max-width:1080px){.khae-ss-actions{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:980px){
  .app{grid-template-columns:1fr!important}
  .sidebar{position:relative!important;height:auto!important}
  .khae-ss-mentor{grid-template-columns:1fr;text-align:center}
  .khae-ss-copy{text-align:center}
}
@media(max-width:620px){
  .main{padding:18px 14px 68px!important}
  .hero{padding:34px 18px!important}
  .hero h2{font-size:clamp(2.6rem,12vw,4.2rem)!important}
  .khae-ss-mentor{padding:22px 16px}
  .khae-ss-actions{grid-template-columns:1fr}
  .khae-ss-beta{right:10px;bottom:10px;min-width:96px;min-height:38px;font-size:.55rem}
}
@media print{.khae-ss-mentor,.khae-ss-beta{display:none!important}}
`;

const style=document.createElement("style");
style.id="khaemenes-grade9-socialstudies-archaemenes-theme-v1";
style.textContent=css;
document.head.appendChild(style);

function currentContext(){
  let week="", unit="", title="", view="";
  try{
    view=document.querySelector(".tab.active,.navBtn.active")?.textContent?.trim()||"";
    if(typeof APP!=="undefined" && Array.isArray(APP.weeks)){
      const activeBtn=document.querySelector(".weekButton.active");
      const activeWeekNum=Number(activeBtn?.dataset?.week || activeBtn?.getAttribute("data-week") || 1);
      const w=APP.weeks.find(x=>x.week===activeWeekNum)||APP.weeks[0];
      if(w){week=`Week ${w.week}`;unit=w.unit||"";title=w.title||"";}
    }
  }catch{}
  return {week,unit,title,view};
}

function mentorHref(){
  const c=currentContext();
  const q=new URLSearchParams({course:"Global Studies Honors",concept:"history, geography, civics, economics, and media literacy"});
  if(c.week)q.set("week",c.week);
  if(c.unit)q.set("unit",c.unit);
  if(c.title)q.set("lesson",c.title);
  if(c.view)q.set("view",c.view);
  return `${MENTOR_URL}?${q.toString()}`;
}

function contextText(){
  const c=currentContext(),parts=["Global Studies Honors"];
  if(c.week)parts.push(c.week);
  if(c.unit)parts.push(c.unit);
  if(c.title)parts.push(c.title);
  return parts.join(" · ");
}

function createMentor(){
  if(document.getElementById("khaeSocialStudiesMentor"))return;
  const main=document.querySelector(".main");
  const tabs=main?.querySelector(".tabs");
  if(!main||!tabs)return;
  const s=document.createElement("section");
  s.className="khae-ss-mentor";
  s.id="khaeSocialStudiesMentor";
  s.setAttribute("aria-labelledby","khaeSSMentorTitle");
  s.innerHTML=`
    <div class="khae-ss-portrait">
      <img src="https://artist1970.github.io/Archaemenes.github.io/assets/Archaemens-high.png"
           alt="Archaemenes, educational mentor">
    </div>
    <div class="khae-ss-copy">
      <div class="khae-ss-kicker">Scholar · Educational Mentor · Social Studies</div>
      <h2 id="khaeSSMentorTitle">Study the world with Archaemenes.</h2>
      <p>Use Archaemenes to examine evidence, compare interpretations, read maps, test claims, distinguish fact from inference, explore institutions and economies, and strengthen historical and civic reasoning.</p>
      <p class="khae-ss-context" id="khaeSSContext"></p>
      <div class="khae-ss-actions">
        <a class="primary" id="khaeSSMentorLink" href="${mentorHref()}">Open Archaemenes</a>
        <a class="secondary" href="${ARSHIF_URL}">Open ARSHIF</a>
        <a class="secondary" href="${VERIFIER_URL}">Open The Verifier</a>
        <a class="secondary" href="${HIGH_URL}">Khaemenes Sr. High</a>
      </div>
      <p class="khae-ss-note">Mentor boundary: Archaemenes may explain, question, compare, contextualize and guide source analysis. Course code remains authoritative for quizzes, assessments, records and progression.</p>
    </div>`;
  tabs.before(s);
  refresh();
}

function refresh(){
  const c=document.getElementById("khaeSSContext");
  const l=document.getElementById("khaeSSMentorLink");
  if(c)c.textContent=contextText();
  if(l)l.href=mentorHref();
}

function addBeta(){
  if(document.getElementById("khaeSSBeta"))return;
  const a=document.createElement("a");
  a.id="khaeSSBeta";
  a.className="khae-ss-beta";
  a.href=BETA_URL;
  a.textContent="Beta Program";
  a.setAttribute("aria-label","Open the Verve N Veda Beta Program");
  document.body.appendChild(a);
}

function boot(){
  createMentor();
  addBeta();
  document.addEventListener("click",e=>{
    if(e.target.closest(".weekButton,.tab,.navBtn,[data-go],[data-view]"))setTimeout(refresh,30);
  });
  const content=document.getElementById("content");
  if(content)new MutationObserver(refresh).observe(content,{subtree:true,childList:true});
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();