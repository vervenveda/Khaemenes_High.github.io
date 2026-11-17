/* Khaemenes High · Class Tools toolbar v1
   Lower-left companion to the ecosystem toolbar.
   Idempotent student-profile navigation only; no grading/mastery mutations. */
(()=>{
"use strict";
const API_KEY="KhaemenesClassToolsToolbarV1";
const ROOT_ID="khaeClassToolsToolbar";
const STYLE_ID="khaeClassToolsToolbarStyle";
const PATH_RE=/\/grades\/grade-(09|10|11|12)\/student-profile\/(?:index\.html)?$/i;

function removeDuplicates(){
  const roots=[...document.querySelectorAll("#"+ROOT_ID)];
  roots.slice(1).forEach(node=>node.remove());
  const styles=[...document.querySelectorAll("#"+STYLE_ID)];
  styles.slice(1).forEach(node=>node.remove());
}

function mounted(){
  return Boolean(document.getElementById(ROOT_ID)&&document.getElementById(STYLE_ID));
}

function mount(){
  if(!PATH_RE.test(location.pathname))return false;
  removeDuplicates();
  if(mounted()){
    document.documentElement.dataset.khaeClassTools="mounted";
    return true;
  }

  let style=document.getElementById(STYLE_ID);
  if(!style){
    style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=[
      '#khaeClassToolsToolbar{position:fixed;left:14px;bottom:16px;z-index:1180;width:min(276px,calc(100vw - 28px));font:400 16px/1.45 "Brandon Grotesque","Avenir Next",Arial,sans-serif;color:#fff8e9}',
      '#khaeClassToolsToggle{min-height:48px;padding:10px 17px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.4 Cinzel,Georgia,serif;box-shadow:0 8px 24px #0004;cursor:pointer}',
      '#khaeClassToolsPanel{margin-top:8px;padding:10px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;box-shadow:0 12px 34px #0006}',
      '#khaeClassToolsPanel[hidden]{display:none!important}',
      '#khaeClassToolsPanel .kct-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
      '#khaeClassToolsPanel .kct-tool{box-sizing:border-box;display:flex;min-width:0;min-height:78px;padding:10px 8px;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:1px solid #b48b45;border-radius:7px;background:#fffaf0;color:#243038;text-align:center;text-decoration:none;cursor:pointer;font:400 16px/1.35 "Brandon Grotesque","Avenir Next",Arial,sans-serif}',
      '#khaeClassToolsPanel .kct-tool strong{font:400 16px/1.3 Cinzel,Georgia,serif;color:#243038}',
      '#khaeClassToolsPanel .kct-tool span{font-size:16px;line-height:1.3;color:#4b554f}',
      '#khaeClassToolsPanel .kct-popover{margin-top:9px;padding:13px;border:1px solid #b48b45;border-radius:7px;background:#fffaf0;color:#243038}',
      '#khaeClassToolsPanel .kct-popover[hidden]{display:none!important}',
      '#khaeClassToolsPanel .kct-popover h2{margin:0 0 8px;font:400 20px/1.35 Cinzel,Georgia,serif}',
      '#khaeClassToolsPanel .kct-popover p{margin:7px 0;font-size:16px;line-height:1.5}',
      '#khaeClassToolsPanel .kct-links{display:grid;gap:7px;margin-top:10px}',
      '#khaeClassToolsPanel .kct-links a{display:block;min-height:44px;box-sizing:border-box;padding:10px 12px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;text-align:center;text-decoration:none;font-size:16px}',
      '#khaeClassToolsToolbar :is(button,a):focus-visible{outline:3px solid #e0bf83;outline-offset:3px}',
      '@media(max-width:620px){#khaeClassToolsToolbar{left:10px;bottom:10px;width:min(252px,calc(100vw - 20px))}#khaeClassToolsPanel .kct-tool{min-height:74px}}',
      '@media print{#khaeClassToolsToolbar{display:none!important}}'
    ].join("");
    document.head.appendChild(style);
  }

  const existing=document.getElementById(ROOT_ID);
  if(existing)existing.remove();

  const root=document.createElement("aside");
  root.id=ROOT_ID;
  root.dataset.khaeClassToolsVersion="1";
  root.setAttribute("aria-label","Class tools");
  root.innerHTML='<button id="khaeClassToolsToggle" type="button" aria-expanded="false" aria-controls="khaeClassToolsPanel">Class Tools</button>'+
    '<section id="khaeClassToolsPanel" hidden aria-label="Class tools menu">'+
      '<div class="kct-grid">'+
        '<a class="kct-tool" href="games/"><strong>Games</strong><span>Practice &amp; logic</span></a>'+
        '<button class="kct-tool" type="button" data-kct-materials><strong>Materials</strong><span>Videos &amp; printables</span></button>'+
        '<button class="kct-tool" type="button" data-kct-notes><strong>Notes</strong><span>Study workspace</span></button>'+
        '<a class="kct-tool" href="https://vervenveda.com/Khaemenes_Academy.github.io/family/"><strong>Parent Tools</strong><span>Family support</span></a>'+
        '<a class="kct-tool" href="https://vervenveda.com/PLERASearch.github.io/"><strong>Search</strong><span>Search ecosystem</span></a>'+
        '<button class="kct-tool" type="button" data-kct-help><strong>Instructions</strong><span>How to use tools</span></button>'+
      '</div>'+
      '<div class="kct-popover" data-kct-materials-panel hidden>'+
        '<h2>Learning Materials</h2>'+
        '<p>Open your current lesson first so its games, approved videos, printables and class-specific tools stay matched to what you are learning.</p>'+
        '<div class="kct-links">'+
          '<a href="daily-lessons/">Open Daily Lessons</a>'+
          '<a href="https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/Khaemenes_Scientific_Calculator_index.html">Scientific Calculator</a>'+
        '</div>'+
      '</div>'+
      '<div class="kct-popover" data-kct-help-panel hidden>'+
        '<h2>How Class Tools Work</h2>'+
        '<p><strong>Lessons stay primary.</strong> Games and videos reinforce classwork; they do not replace written work or mastery checks.</p>'+
        '<p><strong>Printables stay connected.</strong> Open the current lesson to use the worksheet or evidence page that belongs with it.</p>'+
        '<p><strong>Assessment rules still apply.</strong> Use calculators and other tools only when that assessment allows them.</p>'+
      '</div>'+
    '</section>';
  document.body.appendChild(root);

  const toggle=root.querySelector("#khaeClassToolsToggle");
  const panel=root.querySelector("#khaeClassToolsPanel");
  function closeSubpanels(){
    root.querySelector("[data-kct-materials-panel]").hidden=true;
    root.querySelector("[data-kct-help-panel]").hidden=true;
  }
  function setOpen(open){
    panel.hidden=!open;
    toggle.setAttribute("aria-expanded",open?"true":"false");
    if(!open)closeSubpanels();
  }

  toggle.addEventListener("click",()=>setOpen(panel.hidden),{signal:controller.signal});
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&!panel.hidden){setOpen(false);toggle.focus();}
  },{signal:controller.signal});

  root.querySelector("[data-kct-materials]").addEventListener("click",()=>{
    const p=root.querySelector("[data-kct-materials-panel]");
    const opening=p.hidden;closeSubpanels();p.hidden=!opening;
  },{signal:controller.signal});

  root.querySelector("[data-kct-help]").addEventListener("click",()=>{
    const p=root.querySelector("[data-kct-help-panel]");
    const opening=p.hidden;closeSubpanels();p.hidden=!opening;
  },{signal:controller.signal});

  root.querySelector("[data-kct-notes]").addEventListener("click",()=>{
    const trigger=document.querySelector('[data-profile-dialog-for="my-profile-extras"],[data-profile-dialog-for="study-studio"],button[aria-controls*="study" i],a[href*="study" i]');
    if(trigger){setOpen(false);trigger.click();return;}
    const target=document.querySelector("#my-profile-extras,#studyStudio,[data-study-studio]");
    if(target){setOpen(false);target.scrollIntoView({behavior:"smooth",block:"start"});return;}
    location.href=new URL("daily-lessons/",location.href).href;
  },{signal:controller.signal});

  document.documentElement.dataset.khaeClassTools="mounted";
  return true;
}

function unmount(){
  controller.abort();
  document.getElementById(ROOT_ID)?.remove();
  document.documentElement.dataset.khaeClassTools="unmounted";
}

const prior=window[API_KEY];
if(prior?.unmount)try{prior.unmount()}catch{}
const controller=new AbortController();
window[API_KEY]=Object.freeze({mount,unmount,isMounted:mounted});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true,signal:controller.signal});
else mount();
})();