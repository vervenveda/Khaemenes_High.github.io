/* Khaemenes High: safe student return navigation. No records, grades, or assessment state touched. */
(()=>{"use strict";
const current=document.currentScript;
if(!current)return;
const grade=current.dataset.grade;
if(!["09","10","11","12"].includes(grade))return;
const root=new URL("../",current.src);
const target=new URL(grade==="09"?"grades/grade-09/student-profile/daily-lessons/":"grades/grade-"+grade+"/student-profile/",root);
function mount(){
 if(document.getElementById("khaeReturnToClasses"))return;
 const nav=document.createElement("nav");nav.id="khaeReturnToClasses";nav.setAttribute("aria-label","Student class navigation");
 nav.style.cssText="display:flex;justify-content:center;align-items:center;padding:11px 18px;background:#172b3a;border-bottom:1px solid #a38c61;position:relative;z-index:4";
 const link=document.createElement("a");link.href=target.href;link.textContent="← Return to My Classes";
 link.style.cssText="font:400 15px/1.4 system-ui,sans-serif;color:#fff3d6;text-decoration:underline;text-underline-offset:3px;padding:6px 10px";
 nav.append(link);
 document.body.insertBefore(nav,document.body.firstChild);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();