/* Pre-Algebra local learner-scoped resource openings; intentionally does not claim game completion or video watch duration. */
(()=>{"use strict";if(window.KhaemenesPreAlgebraActivityEvidence)return;
const COURSE="KHAE_OPEN_PREALGEBRA_FORGE_V2",PREFIX="khaemenes-prealgebra-activity-v1:";
function active(){try{const r=JSON.parse(localStorage.getItem(COURSE)||"null");return r&&Array.isArray(r.students)&&r.students.some(s=>s.id===r.activeId)?r.activeId:null}catch{return null}}
function record(kind,url,title){
 const learnerId=active();if(!learnerId)return false;
 if(!["game_opened","video_opened"].includes(kind))return false;
 try{const key=PREFIX+learnerId,old=JSON.parse(localStorage.getItem(key)||"null"),events=old?.courseLearnerId===learnerId&&Array.isArray(old.events)?old.events:[];events.push({schema:"khaemenes-prealgebra-activity-event-v1",courseLearnerId:learnerId,kind,resource:String(url||"").slice(0,600),title:String(title||"Learning resource").slice(0,160),at:new Date().toISOString(),status:"opened_only_not_completion",verifiedCompletion:false});localStorage.setItem(key,JSON.stringify({courseLearnerId:learnerId,events:events.slice(-2000)}));return true}catch{return false}
}
document.addEventListener("click",event=>{
 const control=event.target.closest?.("a[href],[data-launch-url]");if(!control)return;
 const ref=control.dataset.launchUrl||control.getAttribute("href")||"";
 let url;try{url=new URL(ref,location.href)}catch{return}
 if(!/^https?:$/.test(url.protocol))return;
 const path=(url.pathname+" "+url.hostname).toLowerCase();
 const game=path.includes("learning-games")||path.includes("/games/"),video=path.includes("youtube.com")||path.includes("youtu.be")||path.includes("vimeo.com");
 if(game||video)record(game?"game_opened":"video_opened",url.href,(control.dataset.launchTitle||control.textContent||control.title||"Learning resource").trim());
},true);
window.KhaemenesPreAlgebraActivityEvidence=Object.freeze({record,version:1});
})();