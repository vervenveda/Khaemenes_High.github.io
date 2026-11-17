/* Khaemenes Academy · Class Tools toolbar v1
   Portable, idempotent lower-left companion to the ecosystem toolbar.
   Local configuration controls age/grade-appropriate tools.
   Navigation only; no grading/mastery mutations. */
(()=>{
"use strict";
const API_KEY="KhaemenesClassToolsToolbarV1";
const CONFIG_KEY="KhaemenesClassToolsConfigV1";
const ROOT_ID="khaeClassToolsToolbar";
const STYLE_ID="khaeClassToolsToolbarStyle";

const HIGH_SCHOOL_DEFAULT=Object.freeze({
  id:"high-school",
  match:/\/grades\/grade-(09|10|11|12)\/student-profile\/(?:index\.html)?$/i,
  toggleLabel:"Class Tools",
  ariaLabel:"Class tools",
  tools:[
    {type:"link",label:"Games",sub:"Practice & logic",href:"games/"},
    {type:"materials",label:"Materials",sub:"Videos & printables"},
    {type:"notes",label:"Notes",sub:"Study workspace"},
    {type:"link",label:"Parent Tools",sub:"Family support",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
    {type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
    {type:"help",label:"Instructions",sub:"How to use tools"}
  ],
  materials:{
    title:"Learning Materials",
    intro:"Open your current lesson first so its games, approved videos, printables and class-specific tools stay matched to what you are learning.",
    links:[
      {label:"Open Daily Lessons",href:"daily-lessons/"},
      {label:"Scientific Calculator",href:"https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/Khaemenes_Scientific_Calculator_index.html"}
    ]
  },
  help:{
    title:"How Class Tools Work",
    paragraphs:[
      "<strong>Lessons stay primary.</strong> Games and videos reinforce classwork; they do not replace written work or mastery checks.",
      "<strong>Printables stay connected.</strong> Open the current lesson to use the worksheet or evidence page that belongs with it.",
      "<strong>Assessment rules still apply.</strong> Use calculators and other tools only when that assessment allows them."
    ]
  }
});

function config(){
  const supplied=window[CONFIG_KEY];
  return supplied&&typeof supplied==="object"?supplied:HIGH_SCHOOL_DEFAULT;
}
function routeAllowed(cfg){
  if(cfg.match instanceof RegExp)return cfg.match.test(location.pathname);
  if(typeof cfg.match==="function")return cfg.match(location);
  if(Array.isArray(cfg.paths))return cfg.paths.some(p=>location.pathname.includes(String(p)));
  return cfg===HIGH_SCHOOL_DEFAULT?HIGH_SCHOOL_DEFAULT.match.test(location.pathname):true;
}
function removeDuplicates(){
  [...document.querySelectorAll("#"+ROOT_ID)].slice(1).forEach(node=>node.remove());
  [...document.querySelectorAll("#"+STYLE_ID)].slice(1).forEach(node=>node.remove());
}
function mounted(){return Boolean(document.getElementById(ROOT_ID)&&document.getElementById(STYLE_ID));}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function toolMarkup(tool){
  const label=esc(tool.label),sub=esc(tool.sub||"");
  const body='<strong>'+label+'</strong><span>'+sub+'</span>';
  if(tool.type==="link")return '<a class="kct-tool" href="'+esc(tool.href||"#")+'">'+body+'</a>';
  if(tool.type==="materials")return '<button class="kct-tool" type="button" data-kct-materials>'+body+'</button>';
  if(tool.type==="notes")return '<button class="kct-tool" type="button" data-kct-notes>'+body+'</button>';
  if(tool.type==="help")return '<button class="kct-tool" type="button" data-kct-help>'+body+'</button>';
  if(tool.type==="button")return '<button class="kct-tool" type="button" data-kct-action="'+esc(tool.action||"")+'">'+body+'</button>';
  return "";
}
function materialsMarkup(cfg){
  const m=cfg.materials||{};
  const links=(m.links||[]).map(x=>'<a href="'+esc(x.href||"#")+'">'+esc(x.label||"Open")+'</a>').join("");
  return '<div class="kct-popover" data-kct-materials-panel hidden>'+
    '<h2>'+esc(m.title||"Learning Materials")+'</h2>'+
    '<p>'+esc(m.intro||"Open your current lesson to find the materials that belong with it.")+'</p>'+
    (links?'<div class="kct-links">'+links+'</div>':"")+
    '</div>';
}
function helpMarkup(cfg){
  const h=cfg.help||{};
  const paragraphs=(h.paragraphs||[]).map(p=>'<p>'+String(p)+'</p>').join("");
  return '<div class="kct-popover" data-kct-help-panel hidden>'+
    '<h2>'+esc(h.title||"How Class Tools Work")+'</h2>'+paragraphs+
    '</div>';
}

function mount(){
  const cfg=config();
  if(!routeAllowed(cfg))return false;
  removeDuplicates();
  if(mounted()){
    document.documentElement.dataset.khaeClassTools="mounted";
    document.documentElement.dataset.khaeClassToolsConfig=String(cfg.id||"custom");
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

  document.getElementById(ROOT_ID)?.remove();
  const tools=(cfg.tools||[]).slice(0,6);
  const root=document.createElement("aside");
  root.id=ROOT_ID;
  root.dataset.khaeClassToolsVersion="1";
  root.dataset.khaeClassToolsConfig=String(cfg.id||"custom");
  root.setAttribute("aria-label",cfg.ariaLabel||"Class tools");
  root.innerHTML='<button id="khaeClassToolsToggle" type="button" aria-expanded="false" aria-controls="khaeClassToolsPanel">'+
    esc(cfg.toggleLabel||"Class Tools")+'</button>'+
    '<section id="khaeClassToolsPanel" hidden aria-label="'+esc(cfg.ariaLabel||"Class tools")+' menu">'+
      '<div class="kct-grid">'+tools.map(toolMarkup).join("")+'</div>'+
      materialsMarkup(cfg)+helpMarkup(cfg)+
    '</section>';
  document.body.appendChild(root);

  const toggle=root.querySelector("#khaeClassToolsToggle");
  const panel=root.querySelector("#khaeClassToolsPanel");
  function closeSubpanels(){
    root.querySelector("[data-kct-materials-panel]")?.setAttribute("hidden","");
    root.querySelector("[data-kct-help-panel]")?.setAttribute("hidden","");
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

  root.querySelector("[data-kct-materials]")?.addEventListener("click",()=>{
    const p=root.querySelector("[data-kct-materials-panel]");
    if(!p)return;const opening=p.hidden;closeSubpanels();p.hidden=!opening;
  },{signal:controller.signal});

  root.querySelector("[data-kct-help]")?.addEventListener("click",()=>{
    const p=root.querySelector("[data-kct-help-panel]");
    if(!p)return;const opening=p.hidden;closeSubpanels();p.hidden=!opening;
  },{signal:controller.signal});

  root.querySelector("[data-kct-notes]")?.addEventListener("click",()=>{
    if(typeof cfg.openNotes==="function"){cfg.openNotes({root,setOpen});return;}
    const trigger=document.querySelector('[data-profile-dialog-for="my-profile-extras"],[data-profile-dialog-for="study-studio"],button[aria-controls*="study" i],a[href*="study" i]');
    if(trigger){setOpen(false);trigger.click();return;}
    const target=document.querySelector("#my-profile-extras,#studyStudio,[data-study-studio]");
    if(target){setOpen(false);target.scrollIntoView({behavior:"smooth",block:"start"});return;}
    if(cfg.notesHref)location.href=new URL(cfg.notesHref,location.href).href;
    else if(cfg===HIGH_SCHOOL_DEFAULT)location.href=new URL("daily-lessons/",location.href).href;
  },{signal:controller.signal});

  root.querySelectorAll("[data-kct-action]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const name=btn.dataset.kctAction;
      const action=cfg.actions?.[name];
      if(typeof action==="function")action({root,setOpen,button:btn});
    },{signal:controller.signal});
  });

  document.documentElement.dataset.khaeClassTools="mounted";
  document.documentElement.dataset.khaeClassToolsConfig=String(cfg.id||"custom");
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
window[API_KEY]=Object.freeze({mount,unmount,isMounted:mounted,defaultConfig:HIGH_SCHOOL_DEFAULT});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true,signal:controller.signal});
else mount();
})();