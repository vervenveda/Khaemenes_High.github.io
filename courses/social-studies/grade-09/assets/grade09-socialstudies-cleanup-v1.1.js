(() => {
"use strict";

/*
  Grade 9 Global Studies Honors
  Cleanup + Archaemenes visual refinement v1.1

  Requires the earlier Archaemenes upgrade OR can run standalone.
  Does not alter APP/course data, assessments, records, or progression.
*/

const css = `
/* ---------- GLOBAL CLEANUP ---------- */
body{letter-spacing:0!important}
.main{padding-top:42px!important}
.hero{
  max-width:1240px!important;
  margin:0 auto 30px!important;
  padding:68px clamp(28px,6vw,92px)!important;
  border-radius:26px!important;
}
.hero .eyebrow{
  margin-bottom:12px!important;
  font-size:.67rem!important;
  letter-spacing:.21em!important
}
.hero h2{
  max-width:1000px!important;
  margin:0 auto 20px!important;
  font-size:clamp(3.2rem,6.8vw,6.3rem)!important;
  line-height:.92!important
}
.hero p{
  max-width:820px!important;
  margin:14px auto 0!important;
  line-height:1.78!important
}
.hero .small{
  max-width:680px!important;
  font-size:.79rem!important;
  opacity:.82!important
}
.hero .actions{
  margin-top:30px!important;
  gap:12px!important
}
.hero .actions button{
  min-width:170px!important;
  min-height:46px!important
}

/* ---------- SIDEBAR CALMING ---------- */
.sidebar{
  padding:20px!important;
}
.sidebar .brand{
  text-align:center!important;
  padding:24px 18px!important
}
.sidebar .seal{
  margin:0 auto 14px!important;
}
.sidebar .brand h1{
  margin:0 0 8px!important;
  font-size:1.12rem!important
}
.sidebar .brand p{
  margin:0 auto!important;
  max-width:260px!important;
  font-size:.82rem!important;
  line-height:1.55!important
}
.sidebar .crumbs{
  justify-content:center!important;
  margin-top:12px!important
}
.sidebar .panel{
  padding:17px!important;
  margin:12px 0!important;
  border-radius:16px!important
}
.sidebar .panel h3{
  margin:0 0 12px!important;
  font-size:.91rem!important
}
.sidebar .navBtn,.sidebar .weekButton{
  margin:5px 0!important;
  border-radius:10px!important;
  padding:10px 12px!important
}
.sidebar .weekList{
  gap:4px!important;
}

/* ---------- TABS ---------- */
.tabs{
  max-width:1240px!important;
  margin:0 auto 26px!important;
  padding:10px!important;
  gap:7px!important;
  border-radius:14px!important
}
.tab{
  min-height:40px!important;
  padding:8px 13px!important;
  border-radius:8px!important;
  font-size:.69rem!important;
  letter-spacing:.04em!important
}

/* ---------- CONTENT RHYTHM ---------- */
#content{
  max-width:1240px!important;
  margin:0 auto!important
}
#content > .grid{
  gap:18px!important
}
#content .card{
  padding:26px!important;
  border-radius:18px!important
}
#content .card h3{
  margin:0 0 10px!important;
  font-size:1.32rem!important;
  line-height:1.2!important
}
#content .card h4{
  margin:0 0 8px!important
}
#content .card p{
  line-height:1.72!important
}
.kpi{
  min-height:150px!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important
}
.kpi strong{
  font-size:2.35rem!important;
  line-height:1!important;
  margin-bottom:8px!important
}

/* Equalize 4-up cards where present */
@media(min-width:981px){
  #content .grid > .kpi{grid-column:span 3!important}
  #content .grid > .col4{grid-column:span 4!important}
  #content .grid > .col6{grid-column:span 6!important}
}

/* ---------- WEEK / LESSON CLEANUP ---------- */
.lesson,.assignment,.quizQ{
  margin:14px 0!important;
  padding:19px!important;
  border-radius:15px!important
}
.lessonHeader{
  gap:18px!important;
  align-items:flex-start!important
}
.choice{
  margin:9px 0!important;
  padding:11px 12px!important;
  border-radius:10px!important
}
.notice{
  margin:15px 0!important;
  padding:14px 16px!important;
  border-radius:10px!important
}
table th,table td{
  padding:12px 13px!important;
  line-height:1.5!important
}

/* ---------- MENTOR REFINEMENT ---------- */
.khae-ss-mentor{
  max-width:1100px!important;
  margin:0 auto 32px!important;
  padding:34px!important;
  gap:34px!important;
  border-radius:24px!important
}
.khae-ss-portrait{
  width:150px!important;
  height:150px!important
}
.khae-ss-copy{
  text-align:center!important
}
.khae-ss-kicker{
  font-size:.62rem!important;
  letter-spacing:.18em!important
}
.khae-ss-mentor h2{
  margin:7px 0 12px!important;
  font-size:clamp(2rem,4vw,3.2rem)!important
}
.khae-ss-mentor p{
  max-width:760px!important;
  margin-left:auto!important;
  margin-right:auto!important
}
.khae-ss-context{
  margin-top:14px!important
}
.khae-ss-actions{
  max-width:820px!important;
  margin:20px auto 0!important;
  grid-template-columns:repeat(4,1fr)!important
}
.khae-ss-actions a{
  min-height:44px!important;
  border-radius:9px!important
}
.khae-ss-note{
  max-width:760px!important;
  margin:15px auto 0!important
}

/* ---------- PRINT / MOBILE ---------- */
@media(max-width:980px){
  .main{padding:20px 16px 70px!important}
  .hero{padding:46px 24px!important}
  .khae-ss-actions{grid-template-columns:repeat(2,1fr)!important}
}
@media(max-width:620px){
  .hero h2{font-size:clamp(2.7rem,13vw,4.2rem)!important}
  .hero .actions{display:grid!important;grid-template-columns:1fr!important}
  .hero .actions button{width:100%!important}
  .tabs{display:grid!important;grid-template-columns:repeat(2,1fr)!important}
  .khae-ss-actions{grid-template-columns:1fr!important}
}
`;

const style = document.createElement("style");
style.id = "khaemenes-grade9-socialstudies-cleanup-v1-1";
style.textContent = css;
document.head.appendChild(style);

/* Improve labels without changing functional logic. */
function polishLabels(){
  const hero = document.querySelector(".hero");
  const h2 = hero?.querySelector("h2");
  if(h2 && /Grade 9 Global Studies Honors/i.test(h2.textContent)){
    h2.textContent = "Global Studies Honors";
  }

  const eyebrow = hero?.querySelector(".eyebrow");
  if(eyebrow){
    eyebrow.textContent = "Khaemenes Sr. High · Social Studies · Grade 09 Campus";
  }

  const brandP = document.querySelector(".sidebar .brand p");
  if(brandP){
    brandP.textContent = "World History · Geography · Civics · Economics · Media Literacy";
  }
}

/* Make current week display easier to scan without modifying APP. */
function polishWeekButtons(){
  document.querySelectorAll(".weekButton").forEach((btn, i) => {
    btn.setAttribute("aria-label", btn.textContent.trim() || `Week ${i+1}`);
  });
}

function boot(){
  polishLabels();
  polishWeekButtons();
  const weekList = document.getElementById("weekList");
  if(weekList){
    new MutationObserver(polishWeekButtons).observe(weekList,{childList:true,subtree:true});
  }
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}
})();