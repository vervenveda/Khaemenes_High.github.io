/* Khaemenes Academy · canonical High School mathematics assessment hub v1 */
(()=>{"use strict";
if(document.getElementById("khaeMathAssessmentHub"))return;
const M=window.KhaemenesMathCourseManifest?.get?.();if(!M)return;
const main=document.querySelector("main");if(!main)return;
const root=new URL(window.KhaemenesMathCourseManifest.courseRoot());
const abs=p=>new URL(p,root).href;
const section=document.createElement("section");section.id="khaeMathAssessmentHub";section.className="khae-math-assessment-hub";
const units=(M.assessment?.unit_mastery||[]).map((href,i)=>({label:"Unit "+String(i+1).padStart(2,"0"),href}));
const items=[{label:"Readiness",href:M.assessment?.diagnostic},{label:"Weekly Mastery",href:M.assessment?.weekly_mastery},...units,{label:"Midterm",href:M.assessment?.midterm},{label:"Final",href:M.assessment?.final}].filter(x=>x.href);
section.innerHTML=`<div class="khae-math-hub-wrap"><p class="eyebrow">Canonical Mathematics Assessment Path</p><h2>${M.title} · Assessment Hub</h2><p class="khae-math-hub-note">Readiness → weekly mastery → unit mastery → mixed-evidence Midterm → mixed-evidence Final. Existing learner records remain the evidence authority.</p><div class="khae-math-hub-grid">${items.map(x=>`<a href="${abs(x.href)}">${x.label}</a>`).join("")}</div></div>`;
main.prepend(section);
const style=document.createElement("style");style.id="khaeMathAssessmentHubStyle";style.textContent=`#khaeMathAssessmentHub{width:100%;padding:24px;background:#f4ecd9;color:#292d31;border-bottom:1px solid #b39a6b}#khaeMathAssessmentHub .khae-math-hub-wrap{width:min(1100px,100%);margin:auto;text-align:center}#khaeMathAssessmentHub h2{font-family:Cinzel,Georgia,serif;font-size:24px;font-weight:400;margin:7px 0 11px}#khaeMathAssessmentHub .khae-math-hub-note{font-size:16px;line-height:1.6;margin:0 auto 16px;max-width:900px}#khaeMathAssessmentHub .khae-math-hub-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}#khaeMathAssessmentHub a{display:flex;align-items:center;justify-content:center;min-height:48px;padding:10px;border:1px solid #806a3d;border-radius:7px;background:#292d31;color:#f8f3e9;text-decoration:none;font-size:16px;font-weight:400}#khaeMathAssessmentHub a:hover,#khaeMathAssessmentHub a:focus{outline:2px solid #b39a6b;outline-offset:2px}@media(max-width:800px){#khaeMathAssessmentHub .khae-math-hub-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){#khaeMathAssessmentHub .khae-math-hub-grid{grid-template-columns:1fr}}`;(document.head||document.documentElement).appendChild(style);
})();