/* Science 9 Unit 04 learner isolation pilot. No legacy records are moved or deleted. */
(function(){
  "use strict";
  const ACTIVE="kh_sci9_u04_active_learner_v1",PREFIX="kh_sci9_u04_learner_v1:";
  const ORIGINAL="khaemenes_science_u04_v1";
  const safeId=v=>typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null;
  function active(){try{return safeId(sessionStorage.getItem(ACTIVE))}catch{return null}}
  function key(){const id=active();return id?PREFIX+id+":"+ORIGINAL:null}
  function choose(){
    const raw=window.prompt("Science 9 Unit 04: enter a learner ID (3–32 letters, numbers, - or _). Use the same ID on this device to resume. Existing shared-browser records stay preserved separately.","");
    if(raw===null)return false;
    const id=safeId(raw.trim());if(!id){window.alert("Invalid learner ID; no record was changed.");return false}
    try{sessionStorage.setItem(ACTIVE,id);window.location.reload();return true}catch{window.alert("Browser session storage is unavailable; no record was changed.");return false}
  }
  function guard(){
    if(active())return true;
    if(document.getElementById("scienceLearnerGuard"))return false;
    const panel=document.createElement("aside");
    panel.id="scienceLearnerGuard";panel.setAttribute("role","alert");
    panel.style.cssText="position:fixed;z-index:2147483647;inset:0;background:#f7f3e9;color:#181818;display:grid;place-items:center;padding:24px";
    const inner=document.createElement("div");inner.style.cssText="max-width:580px;background:white;border:1px solid #aaa;border-radius:7px;padding:24px;text-align:center";
    const title=document.createElement("h2");title.textContent="Choose a Science 9 learner record";
    const msg=document.createElement("p");msg.textContent="This Unit 04 pilot keeps selected learners in separate local browser records. Earlier shared records are preserved, not assigned automatically. This is not password-protected authentication, and other units and labs are not yet isolated.";
    const button=document.createElement("button");button.type="button";button.textContent="Select learner";button.style.cssText="border-radius:7px;padding:12px 20px;cursor:pointer";button.onclick=choose;
    inner.append(title,msg,button);panel.append(inner);document.body.append(panel);return false;
  }
  window.KhaemenesScienceU04Scope={active,key,choose,guard,legacyKey:ORIGINAL};
  document.addEventListener("DOMContentLoaded",guard);
})();
