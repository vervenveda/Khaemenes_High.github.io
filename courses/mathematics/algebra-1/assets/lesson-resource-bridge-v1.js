/* Algebra I lesson presentation: shared, reversible, no course-state mutations. */
(()=>{
  if(document.getElementById('algebra1-lesson-readable-style'))return;
  const style=document.createElement('style');
  style.id='algebra1-lesson-readable-style';
  style.textContent=`
html:root:root body .hero .eyebrow{font-size:clamp(26px,3.8vw,44px)!important;line-height:1.2!important;letter-spacing:.02em!important;text-transform:none!important;max-width:950px;margin:0 auto 14px}
html:root:root body .hero h1{font-size:clamp(26px,3vw,33px)!important;line-height:1.3!important;letter-spacing:0!important;max-width:950px;margin:12px auto 18px}
html:root:root body .hero .lead{font-size:clamp(18px,2vw,24px)!important;line-height:1.5!important;max-width:850px;margin-inline:auto}
html:root:root body .hero{padding-block:clamp(42px,6vw,72px) clamp(32px,4vw,56px)}
html:root:root body main .block{padding-block:clamp(30px,4vw,54px)}
html:root:root body main .card{line-height:1.72}
html:root:root body main .card p,html:root:root body main .question,html:root:root body main .option{font-size:clamp(16px,1.3vw,18px)!important;line-height:1.7}
html:root:root body main .card h2{font-size:clamp(23px,2.5vw,30px)!important;line-height:1.32!important}
html:root:root body main .card h3{font-size:clamp(20px,2vw,25px)!important;line-height:1.4!important}
html:root:root body main .card .eyebrow{font-size:13px!important;line-height:1.5!important;letter-spacing:.08em!important}
@media(max-width:700px){html:root:root body .hero .eyebrow{font-size:clamp(26px,7vw,36px)!important}html:root:root body .hero .lead{font-size:18px!important}html:root:root body .hero{padding-block:36px}html:root:root body main .card{padding:clamp(16px,4vw,22px)}}
@media print{html:root:root body .hero{padding-block:12px!important}html:root:root body .hero .eyebrow{font-size:23px!important}html:root:root body main .block{padding-block:12px!important}}
`;
  (document.head||document.documentElement).appendChild(style);
})();
(()=>{'use strict';function id(){const u=(location.pathname.match(/unit-(\d+)/)||[])[1],n=(document.body?.dataset?.lesson)||(location.pathname.match(/lesson-(\d+)/)||[])[1];if(!u||!n)return null;return `u${String(Number(u)).padStart(2,'0')}-l${String(Number(n)).padStart(2,'0')}`}function render(){const key=id(),map=window.KhaemenesAlgebra1LessonResources?.entries,rec=key&&map?.[key],main=document.getElementById('main');if(!rec||!main||document.getElementById('a1LessonResourceBridge'))return;const host=main.querySelector('.block .wrap')||main;const s=document.createElement('section');s.id='a1LessonResourceBridge';s.className='block';s.innerHTML=`<div class="wrap"><article class="card full"><p class="eyebrow">Applied Connection · ${key}</p><h2>Connect this lesson to a real mathematical product</h2><p>${rec.application_prompt}</p><div class="nav">${rec.project?`<a class="btn primary" href="${rec.project}">Open Unit Project · ${rec.project_title}</a>`:''}${rec.lab?`<a class="btn" href="${rec.lab}">Open Related Local Lab</a>`:''}</div><details><summary>Choose a readiness pathway</summary><p><strong>Foundation:</strong> ${rec.pathways.Foundation}</p><p><strong>Core:</strong> ${rec.pathways.Core}</p><p><strong>Extended:</strong> ${rec.pathways.Extended}</p></details><p class="lead" style="font-size:.95rem">Games and video companions are intentionally not fabricated here. They can be attached later through the same lesson ID without changing the lesson or project paths.</p></article></div>`;main.appendChild(s)}function boot(){render();new MutationObserver(render).observe(document.getElementById('main')||document.body,{childList:true,subtree:true})}document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();})();