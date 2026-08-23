/* Khaemenes High · Academy Mentor doorway · v2.0.0 */
(() => {
  "use strict";

  const ID="khaemenesMentorLink";
  const STYLE_ID="khaemenesMentorLinkStyles";
  const LIVE_ORIGIN="https://vervenveda.com";
  const MENTOR_PATH="/Khaemenes_High.github.io/mentor/";

  if(document.getElementById(ID))return;

  const clean=(value,max=160)=>String(value??"").replace(/[\u0000-\u001f\u007f?#]/g,"").trim().slice(0,max);

  function subjectContext(){
    const p=String(location.pathname||"").toLowerCase();
    if(/language-arts|english|literature|writing/.test(p))return"language-arts";
    if(/social-studies|history|civics|government|econom/.test(p))return"social-studies";
    if(/mathemat|algebra|geometry|calculus|statistics/.test(p))return"mathematics";
    if(/biology|chemistry|physics|science|engineering/.test(p))return"science";
    if(/language|linguistic|spanish|french|german/.test(p))return"world-languages";
    if(/art|music|design/.test(p))return"arts";
    if(/health|wellness|physical-education|\bpe\b/.test(p))return"health";
    if(/technology|computer|coding|program/.test(p))return"technology";
    return"general";
  }

  function courseContext(){
    const p=String(location.pathname||"/").split("/").filter(Boolean);
    const i=p.findIndex(x=>x.toLowerCase()==="courses");
    return clean(i>=0&&p[i+2]?p[i+2]:(i>=0&&p[i+1]?p[i+1]:""),100);
  }

  function safeSource(){
    try{return clean(location.pathname||"/",240)||"/"}catch{return"/"}
  }

  function mentorURL(){
    const params=new URLSearchParams();
    params.set("stage","high");
    params.set("subject",subjectContext());
    params.set("source",safeSource());
    const course=courseContext();
    if(course)params.set("course",course);
    return `${LIVE_ORIGIN}${MENTOR_PATH}?${params.toString()}`;
  }

  function mount(){
    if(document.getElementById(ID)||!document.body)return;

    if(!document.getElementById(STYLE_ID)){
      const s=document.createElement("style");
      s.id=STYLE_ID;
      s.textContent=`#${ID}{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:64px;z-index:2147481999;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:42px;padding:8px 12px;border:1px solid rgba(98,200,192,.72);border-radius:10px;color:#effffc;background:rgba(10,39,48,.96);box-shadow:0 8px 24px rgba(0,0,0,.18);font:700 11px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.035em;cursor:pointer}#${ID}:hover{transform:translateY(-1px);border-color:#9fe2dc;background:#103f4d}#${ID}:focus-visible{outline:3px solid #9fe2dc;outline-offset:3px}#${ID} .mentor-mark{font:700 14px/1 Georgia,serif;color:#9fe2dc}@media print{#${ID}{display:none!important}}@media(prefers-reduced-motion:reduce){#${ID}{transition:none!important;transform:none!important}}`;
      document.head.append(s);
    }

    const b=document.createElement("button");
    b.id=ID;
    b.type="button";
    b.setAttribute("aria-label","Open the Khaemenes Academy educational mentor for this learning context");
    b.innerHTML='<span class="mentor-mark" aria-hidden="true">✦</span><span>Mentor</span>';
    b.addEventListener("click",()=>{
      try{location.assign(mentorURL())}catch{location.href=`${LIVE_ORIGIN}${MENTOR_PATH}`}
    });
    document.body.append(b);
  }

  window.KhaemenesHighMentorDoorway=Object.freeze({version:"2.0.0",subjectContext,courseContext,safeSource,mentorURL});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
