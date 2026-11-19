/* Khaemenes Academy · Mathematics assessment directive dialog v1.0.0
   Shared post-assessment routing only. Presentation and navigation do not alter grading.
*/
(function(global){
"use strict";
if(global.KhaemenesMathAssessmentDirective)return;
const cfg=global.KhaemenesMathAssessmentDirectiveConfig;
if(!cfg){console.warn("Mathematics assessment directive config unavailable.");return}
const MASTER=Number(cfg.masteryThreshold)||80;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const courseFromPath=()=>{
 const p=location.pathname.toLowerCase();
 return p.includes("/pre-algebra/")?"pre-algebra":p.includes("/algebra-1/")?"algebra-1":p.includes("/geometry/")?"geometry":p.includes("/algebra-2/")?"algebra-2":null;
};
const kindFrom=(detail={})=>{
 if(detail.kind)return String(detail.kind).toLowerCase();
 const p=location.pathname.toLowerCase();
 if(p.includes("/diagnostic/")||p.includes("readiness"))return"readiness";
 if(p.includes("weekly-mastery"))return"weekly";
 if(p.includes("midterm"))return"midterm";
 if(p.includes("final"))return"final";
 if(p.includes("/assessment/mastery-check"))return"unit";
 return"assessment";
};
const unitFrom=(detail={})=>{
 const n=Number(detail.unit);if(Number.isFinite(n)&&n>0)return n;
 const m=location.pathname.match(/unit-(\d{2})/i);return m?Number(m[1]):null;
};
const weekFrom=(detail={})=>{
 const n=Number(detail.week);if(Number.isFinite(n)&&n>0)return n;
 const q=new URLSearchParams(location.search),w=Number(q.get("week"));return Number.isFinite(w)&&w>0?w:null;
};
function ensureStyles(){
 if(document.getElementById("khaeMathAssessmentDirectiveStyle"))return;
 const s=document.createElement("style");s.id="khaeMathAssessmentDirectiveStyle";
 s.textContent=`
 #khaeMathAssessmentDirective{width:min(calc(100% - 32px),660px);border:1px solid #b48b45;border-radius:7px;padding:0;background:#f4f0e7;color:#252b2b;box-shadow:0 24px 70px rgba(0,0,0,.32);font:400 18px/1.6 "Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif}
 #khaeMathAssessmentDirective::backdrop{background:rgba(20,25,23,.62)}
 #khaeMathAssessmentDirective .khae-dir-head{padding:24px;background:#252b2b;color:#fff8e9;border-bottom:3px solid #b48b45;text-align:center}
 #khaeMathAssessmentDirective .khae-dir-kicker{margin:0 0 7px;font:400 16px/1.3 Cinzel,Georgia,serif;letter-spacing:.06em;text-transform:uppercase}
 #khaeMathAssessmentDirective h2{margin:0;color:#fff8e9;font:400 33px/1.2 Cinzel,Georgia,serif}
 #khaeMathAssessmentDirective .khae-dir-body{padding:24px;text-align:center}
 #khaeMathAssessmentDirective .khae-dir-score{margin:0 0 12px;font:400 33px/1.2 Cinzel,Georgia,serif;color:#6e4d1c}
 #khaeMathAssessmentDirective .khae-dir-body p{margin:0 auto 16px;max-width:560px}
 #khaeMathAssessmentDirective .khae-dir-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;padding:0 24px 24px}
 #khaeMathAssessmentDirective .khae-dir-actions a,#khaeMathAssessmentDirective .khae-dir-actions button{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:11px 18px;border:1px solid #252b2b;border-radius:7px;background:#252b2b;color:#fff8e9;text-decoration:none;font:400 16px/1.3 Cinzel,Georgia,serif;cursor:pointer}
 #khaeMathAssessmentDirective .khae-dir-actions button{background:#fffaf0;color:#252b2b}
 @media(max-width:560px){#khaeMathAssessmentDirective .khae-dir-actions{display:grid;grid-template-columns:1fr}#khaeMathAssessmentDirective .khae-dir-actions>*{width:100%}}
 @media print{#khaeMathAssessmentDirective{display:none!important}}
 `;
 document.head.appendChild(s);
}
function ensureDialog(){
 ensureStyles();
 let d=document.getElementById("khaeMathAssessmentDirective");
 if(d)return d;
 d=document.createElement("dialog");d.id="khaeMathAssessmentDirective";
 d.setAttribute("aria-labelledby","khaeMathDirectiveTitle");
 d.innerHTML='<div class="khae-dir-head"><p class="khae-dir-kicker">Khaemenes Academy · Mathematics</p><h2 id="khaeMathDirectiveTitle">Assessment Complete</h2></div><div class="khae-dir-body"><p class="khae-dir-score" id="khaeMathDirectiveScore"></p><p id="khaeMathDirectiveMessage"></p></div><div class="khae-dir-actions"><a id="khaeMathDirectivePrimary" href="#">Continue</a><button id="khaeMathDirectiveClose" type="button">Stay on Results</button></div>';
 document.body.appendChild(d);
 d.querySelector("#khaeMathDirectiveClose").addEventListener("click",()=>d.close());
 d.addEventListener("cancel",()=>d.close());
 return d;
}
function passRoute(course,kind,detail){
 const c=cfg.courses[course],unit=unitFrom(detail),week=weekFrom(detail);
 if(detail.nextHref)return{href:String(detail.nextHref),label:String(detail.nextLabel||cfg.passLabels[kind]||cfg.passLabels.assessment)};
 if(!c)return{href:location.href,label:"Continue"};
 if(kind==="readiness")return{href:c.unit1,label:cfg.passLabels.readiness};
 if(kind==="unit"){
  if(unit&&unit<13)return{href:c.root+"units/unit-"+String(unit+1).padStart(2,"0")+"/",label:"Continue to Unit "+String(unit+1).padStart(2,"0")};
  return{href:c.final,label:"Continue to Final Examination"};
 }
 if(kind==="midterm")return{href:c.unit7,label:cfg.passLabels.midterm};
 if(kind==="final")return{href:c.records,label:cfg.passLabels.final};
 if(kind==="weekly"&&week&&week<36)return{href:c.root+"assessments/weekly-mastery.html?week="+(week+1),label:"Continue to Week "+String(week+1).padStart(2,"0")};
 return{href:c.root,label:cfg.passLabels[kind]||cfg.passLabels.assessment};
}
function belowRoute(course,kind,detail){
 if(detail.retryHref||detail.retryLabel)return{title:cfg.retry.title,message:cfg.retry.message,href:String(detail.retryHref||location.href),label:String(detail.retryLabel||cfg.retry.label)};
 if(kind==="readiness"&&cfg.readinessBelow[course])return cfg.readinessBelow[course];
 return{title:cfg.retry.title,message:cfg.retry.message,href:location.href,label:cfg.retry.label};
}
function show(detail={}){
 const score=Number(detail.score??detail.percent??detail.overallPercent);
 if(!Number.isFinite(score))return false;
 if(detail.masteryReady===false||detail.pendingReview===true)return false;
 const course=String(detail.course||courseFromPath()||"");
 const kind=kindFrom(detail),mastered=typeof detail.mastered==="boolean"?detail.mastered:score>=MASTER;
 const dialog=ensureDialog(),route=mastered?passRoute(course,kind,detail):belowRoute(course,kind,detail);
 dialog.querySelector("#khaeMathDirectiveTitle").textContent=mastered?"Mastery achieved":route.title;
 dialog.querySelector("#khaeMathDirectiveScore").textContent=Math.round(score*10)/10+"%";
 dialog.querySelector("#khaeMathDirectiveMessage").textContent=mastered
  ?String(detail.successMessage||"You reached the 80% mastery standard. Continue to the next required Mathematics step.")
  :String(detail.failureMessage||route.message);
 const primary=dialog.querySelector("#khaeMathDirectivePrimary");
 primary.href=route.href;primary.textContent=route.label;
 try{dialog.showModal()}catch{dialog.setAttribute("open","")}
 return true;
}
global.addEventListener("khaemenes:math-assessment-complete",e=>show(e.detail||{}));
global.KhaemenesMathAssessmentDirective=Object.freeze({version:"1.0.0",show,courseFromPath,kindFrom,unitFrom,weekFrom});
})(window);
