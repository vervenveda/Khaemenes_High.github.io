/* Khaemenes High · Public Mentor button · v1.0.0 */
(() => {
  "use strict";
  const ID="khaemenesMentorLink", STYLE_ID="khaemenesMentorLinkStyles";
  const MENTOR_URL="https://artist1970.github.io/Archaemenes.github.io/";
  if(document.getElementById(ID))return;
  const safeContext=()=>{try{return String(location.pathname||"/").replace(/[\u0000-\u001f\u007f?#]/g,"").slice(0,240)||"science";}catch{return "science"}};
  function mount(){
    if(document.getElementById(ID)||!document.body)return;
    if(!document.getElementById(STYLE_ID)){
      const s=document.createElement("style");s.id=STYLE_ID;
      s.textContent=`#${ID}{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:64px;z-index:2147481999;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:42px;padding:8px 12px;border:1px solid rgba(98,200,192,.72);border-radius:10px;color:#effffc;background:rgba(10,39,48,.96);box-shadow:0 8px 24px rgba(0,0,0,.18);font:700 11px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.035em;cursor:pointer}#${ID}:hover{transform:translateY(-1px);border-color:#9fe2dc;background:#103f4d}#${ID}:focus-visible{outline:3px solid #9fe2dc;outline-offset:3px}#${ID} .mentor-mark{font:700 14px/1 Georgia,serif;color:#9fe2dc}@media print{#${ID}{display:none!important}}@media(prefers-reduced-motion:reduce){#${ID}{transition:none!important;transform:none!important}}`;
      document.head.append(s);
    }
    const b=document.createElement("button");b.id=ID;b.type="button";
    b.setAttribute("aria-label","Open the Khaemenes educational mentor");
    b.innerHTML='<span class="mentor-mark" aria-hidden="true">✦</span><span>Mentor</span>';
    b.addEventListener("click",()=>{
      const source=encodeURIComponent(safeContext());
      const target=`${MENTOR_URL}?subject=science&source=${source}`;
      try{location.assign(target)}catch{location.href=MENTOR_URL}
    });
    document.body.append(b);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
