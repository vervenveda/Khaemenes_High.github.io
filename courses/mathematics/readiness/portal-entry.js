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
  const h=document.createElement('h3');
  h.textContent='Mathematics Readiness & Placement';
  const p=document.createElement('p');
  p.textContent='Use the shared adaptive readiness assessment as pre-course evidence. It never counts as Week 1, and it does not replace the Pre-Algebra NAIB readiness gateway.';
  const strong=document.createElement('strong');
  strong.textContent='Open readiness assessment →';
  a.append(h,p,strong);
  grid.prepend(a);
}
function boot(){addHeroEntry();addResourceEntry()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
