(()=>{
"use strict";
const script=document.currentScript;
function ensureCss(){
  if(document.querySelector('link[data-algebra1-student-experience="v2"]'))return;
  const link=document.createElement("link");
  link.rel="stylesheet";
  link.href=new URL("algebra1-student-experience-v2.css",script?.src||location.href).href;
  link.dataset.algebra1StudentExperience="v2";
  document.head.appendChild(link);
  if(!document.querySelector('link[data-algebra1-dark-dashboard="v1"]')){
    const dark=document.createElement("link");
    dark.rel="stylesheet";
    dark.href=new URL("algebra1-dark-dashboard-v1.css",script?.src||location.href).href;
    dark.dataset.algebra1DarkDashboard="v1";
    document.head.appendChild(dark);
  }
}
function routeMode(){
  const path=location.pathname.toLowerCase();
  if(/\/algebra-1\/?(?:index\.html)?$/.test(path))return "course";
  if(/\/lessons\//.test(path)||document.body?.dataset?.mode==="lesson")return "lesson";
  if(/\/units\/unit-\d+\/?(?:index\.html)?$/.test(path)||document.body?.dataset?.mode==="unit")return "unit";
  return "other";
}
function quickNav(items,meter=false){
  if(document.getElementById("algebra1QuickNav"))return;
  const nav=document.createElement("nav");
  nav.id="algebra1QuickNav";
  nav.className="algebra1-quick-nav";
  nav.setAttribute("aria-label","Algebra I page sections");
  const inner=document.createElement("div");
  inner.className="algebra1-quick-nav-inner";
  items.filter(x=>x&&x.href).forEach(item=>{
    const a=document.createElement("a");a.href=item.href;a.textContent=item.label;inner.appendChild(a);
  });
  if(meter){
    const m=document.createElement("div");m.className="algebra1-lesson-meter";m.id="algebra1LessonMeter";
    m.innerHTML='<span id="algebra1MeterText">0% answered</span><span class="algebra1-meter-track"><span id="algebra1MeterBar"></span></span>';
    inner.appendChild(m);
  }
  nav.appendChild(inner);
  const hero=document.querySelector("#main .hero");
  hero?.after(nav);
}
function courseDashboard(){
  const main=document.getElementById("main"),hero=main?.querySelector(".hero");
  if(!main||!hero||document.getElementById("algebra1StudentDashboard"))return;
  document.body.classList.add("algebra1-course-home","algebra1-has-header");
  const A=window.KhaemenesAlgebra1MasteryAuthority;
  let units=0,weeks=0;
  if(A){
    for(let n=1;n<=13;n++)if(A.unitMastered(n))units++;
    for(let n=2;n<=36;n++)if(A.weekMastered(n))weeks++;
  }
  const mid=A?.midtermEvidence?.(),fin=A?.finalEvidence?.();
  const section=document.createElement("section");
  section.id="algebra1StudentDashboard";
  section.className="algebra1-student-dashboard";
  section.innerHTML=`<div class="algebra1-dashboard-shell"><div class="algebra1-dashboard-head"><p class="eyebrow">Student workspace</p><h2>Your Algebra I course at a glance</h2><p>Continue learning, inspect mastery evidence, open assessments, or move directly to the tools you need without searching through the full course page.</p></div><div class="algebra1-dashboard-grid"><article class="algebra1-dashboard-card"><strong>${units}/13</strong><span>Units mastered at the canonical 80% gate</span></article><article class="algebra1-dashboard-card"><strong>${weeks}/35</strong><span>Weekly mastery gates completed</span></article><article class="algebra1-dashboard-card"><strong>${mid?.mastery?"Met":mid?.best!=null?Math.round(mid.best)+"%":"—"}</strong><span>Reviewed midterm evidence</span></article><article class="algebra1-dashboard-card"><strong>${fin?.mastery?"Met":fin?.best!=null?Math.round(fin.best)+"%":"—"}</strong><span>Reviewed final evidence</span></article></div><div class="algebra1-dashboard-actions"><a class="primary" id="algebra1DashboardResume" href="#lessons">Continue learning</a><a href="#units">Unit pathway</a><a href="assessments/">Assessment Center</a><a href="../tools/vocabulary-studio.html?course=algebra-1">Vocabulary Studio</a><a href="https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/">Scientific Calculator</a></div></div>`;
  hero.after(section);
  quickNav([{label:"Dashboard",href:"#algebra1StudentDashboard"},{label:"Start",href:"#start"},{label:"Units",href:"#units"},{label:"Lessons",href:"#lessons"},{label:"Support",href:"#support"}]);
  const source=document.getElementById("courseResumeLink"),target=document.getElementById("algebra1DashboardResume");
  const sync=()=>{if(!source||!target)return;target.href=source.getAttribute("href")||"#lessons";target.textContent=source.textContent?.trim()||"Continue learning"};
  sync();
  if(source)new MutationObserver(sync).observe(source,{attributes:true,childList:true,subtree:true});
}
function unitExperience(){
  document.body.classList.toggle("algebra1-has-header",!!document.querySelector(".site-header"));
  const main=document.getElementById("main"),hero=main?.querySelector(".hero");if(!main||!hero)return;
  const lessonGrid=main.querySelector(".lesson-grid");
  const lessonSection=lessonGrid?.closest("section");if(lessonSection&&!lessonSection.id)lessonSection.id="lessons";
  const practiceLink=main.querySelector('a[href*="practice/"]');
  const practiceSection=practiceLink?.closest("section");if(practiceSection&&!practiceSection.id)practiceSection.id="practice";
  const masteryLink=main.querySelector('a[href*="assessment/mastery-check"]');
  if(masteryLink&&!masteryLink.id)masteryLink.id="unit-mastery-link";
  quickNav([{label:"Overview",href:"#main"},{label:"Continue",href:document.getElementById("algebra1NextStep")?"#algebra1NextStep":"#lessons"},{label:"Lessons",href:lessonSection?"#lessons":null},{label:"Practice",href:practiceSection?"#practice":null},{label:"Mastery",href:masteryLink?"#unit-mastery-link":null}]);
}
function lessonExperience(){
  document.body.classList.toggle("algebra1-has-header",!!document.querySelector(".site-header"));
  const main=document.getElementById("main"),hero=main?.querySelector(".hero");if(!main||!hero)return;
  const cards=[...main.querySelectorAll("article.card")];
  let learn=null,explore=null,defend=null,check=null;
  cards.forEach((card,i)=>{
    card.classList.add("lesson-stage-card");
    const text=(card.querySelector(".eyebrow")?.textContent||"")+" "+(card.querySelector("h2,h3")?.textContent||"");
    if(!card.id)card.id="lesson-stage-"+(i+1);
    if(!learn&&/learn|objective|concept/i.test(text))learn=card;
    if(!explore&&/experiment|laboratory|discover|worked example/i.test(text))explore=card;
    if(!defend&&/defend|defense|error analysis|repair/i.test(text))defend=card;
    if(!check&&/lesson check|retrieve|practice/i.test(text)){check=card;card.id="lesson-check";}
  });
  const reading=document.getElementById("lessonReading");
  quickNav([{label:"Start",href:"#main"},{label:"Learn",href:learn?"#"+learn.id:reading?"#lessonReading":null},{label:"Explore",href:explore?"#"+explore.id:null},{label:"Explain",href:defend?"#"+defend.id:null},{label:"Check",href:check?"#"+check.id:"#questions"}],true);
  const update=()=>{
    const inputs=[...main.querySelectorAll('.question input[type="radio"],.question input[type="checkbox"]')];
    const groups=new Set(inputs.map(x=>x.name).filter(Boolean));
    const total=groups.size;
    const answered=[...groups].filter(name=>main.querySelector('input[name="'+CSS.escape(name)+'"]:checked')).length;
    const pct=total?Math.round(answered/total*100):0;
    const t=document.getElementById("algebra1MeterText"),b=document.getElementById("algebra1MeterBar");
    if(t)t.textContent=total?`${answered}/${total} answered`:"Lesson work";
    if(b)b.style.width=pct+"%";
  };
  if(main.dataset.algebra1MeterBound!=="true"){main.addEventListener("change",update,{passive:true});main.dataset.algebra1MeterBound="true"}update();
}
function enhance(){
  ensureCss();
  const mode=routeMode();
  if(mode==="course")courseDashboard();
  else if(mode==="unit")unitExperience();
  else if(mode==="lesson")lessonExperience();
}
ensureCss();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(enhance,0),{once:true});else setTimeout(enhance,0);
const main=document.getElementById("main");
if(main){let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;enhance()},0)}).observe(main,{childList:true,subtree:false})}
window.KhaemenesAlgebra1StudentExperience=Object.freeze({version:"2.0",enhance});
})();
