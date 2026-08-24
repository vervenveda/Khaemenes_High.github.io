(() => {
"use strict";
const READY_URL="readiness/";
const STORAGE_KEY="KHAEMENES_MATH_READINESS_V1";
function readResult(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")}catch{return null}}
function addHeroEntry(){
  const actions=document.querySelector('.hero .hero-actions');
  if(!actions||actions.querySelector('[data-math-readiness-entry]'))return;
  const a=document.createElement('a');
  a.className='btn primary';
  a.href=READY_URL;
  a.dataset.mathReadinessEntry='true';
  a.textContent=readResult()?'View Math Readiness Result':'Take Math Readiness Assessment';
  actions.prepend(a);
}
function addResourceEntry(){
  const grid=document.querySelector('#resources .resource-grid');
  if(!grid||grid.querySelector('[data-math-readiness-resource]'))return;
  const a=document.createElement('a');
  a.className='resource-card';
  a.href=READY_URL;
  a.dataset.mathReadinessResource='true';
  a.innerHTML='<h3>Mathematics Readiness & Placement</h3><p>Complete the one-time adaptive readiness assessment before choosing a mathematics course. The result is advisory, stored separately from grades, and never counts as Week 1.</p><strong>Open readiness assessment →</strong>';
  grid.prepend(a);
}
function deprecateLegacyDiagnosticCard(){
  document.querySelectorAll('#resources .resource-card').forEach(card=>{
    const href=card.getAttribute('href')||'';
    if(/pre-algebra\/diagnostic\/?$/.test(href)){
      card.setAttribute('href',READY_URL);
      const h=card.querySelector('h3');if(h)h.textContent='Shared Math Readiness';
      const p=card.querySelector('p');if(p)p.textContent='Use the shared Khaemenes Mathematics Readiness & Placement assessment rather than a course-local Week 1 diagnostic.';
      const strong=card.querySelector('strong');if(strong)strong.textContent='Open shared readiness →';
    }
  });
}
function boot(){addHeroEntry();addResourceEntry();deprecateLegacyDiagnosticCard()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();