/* Khaemenes Academy · English Unified Lesson Engine v1.0.0
 * Shared learner-facing presentation for English 9–12.
 * Existing grade course scripts remain the sole owners of learner identity,
 * storage, mastery, grading, progress, and assessment submissions.
 * Only first-party static DOM. No network requests, no learner-state reads/writes.
 */
(()=>{"use strict";
const API="KhaemenesEnglishUnifiedLessonEngine";
if(window[API])return;
const STYLE_ID="khae-english-unified-lesson-engine-style-v1";
const PANEL_ID="khae-english-unified-lesson-map";
const selectors={
  grade9:/\/english-9\/weeks\/week-(\d{2})\/day-(\d{2})\/(?:index\.html)?$/i,
  grade10:/\/english-10\/weeks\/week-(\d{2})\/(monday|tuesday|wednesday|thursday|friday)\/(?:index\.html)?$/i,
  senior:/\/english-(11|12)\/weeks\/week-(\d{2})\/lessons\/day-(\d{2})\.html$/i
};
const days=["monday","tuesday","wednesday","thursday","friday"];
function route(path=location.pathname){
  let m=path.match(selectors.grade9);
  if(m)return {grade:9,week:Number(m[1]),day:Number(m[2]),kind:"english9-daily"};
  m=path.match(selectors.grade10);
  if(m)return {grade:10,week:Number(m[1]),day:days.indexOf(m[2].toLowerCase())+1,kind:"english10-studio"};
  m=path.match(selectors.senior);
  if(m)return {grade:Number(m[1]),week:Number(m[2]),day:Number(m[3]),kind:"senior-companion"};
  return null;
}
function injectStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement("style");
  style.id=STYLE_ID;
  style.textContent=`
#${PANEL_ID}{box-sizing:border-box;max-width:1000px;margin:18px auto 24px;padding:16px 20px;border:1px solid #c7bba3;border-radius:7px;background:#fffdf8;color:#202724;text-align:center;font:400 18px/1.6 "Brandon Grotesque",Nunito,Arial,sans-serif}
#${PANEL_ID} *{box-sizing:border-box}
#${PANEL_ID} .khae-engine-eyebrow{margin:0 auto 7px;color:#795c29;letter-spacing:.09em;font-size:16px}
#${PANEL_ID} .khae-engine-title{margin:0 auto 10px;color:#202724;font:400 clamp(22px,3vw,33px)/1.3 Cinzel,Georgia,serif}
#${PANEL_ID} .khae-engine-summary{max-width:75ch;margin:0 auto 12px;color:#39443f}
#${PANEL_ID} .khae-engine-actions{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:9px}
#${PANEL_ID} button,#${PANEL_ID} a.khae-engine-link{min-height:44px;display:inline-flex;justify-content:center;align-items:center;padding:9px 13px;border-radius:7px;border:1px solid #202724;background:#202724;color:#fff8e9!important;font:400 16px/1.35 "Brandon Grotesque",Nunito,Arial,sans-serif;text-decoration:none;cursor:pointer}
#${PANEL_ID} button[aria-pressed="true"]{background:#fff8e9;color:#202724!important;border-color:#b48b45}
#${PANEL_ID} details{margin-top:13px;text-align:left}
#${PANEL_ID} details>summary{cursor:pointer;min-height:44px;padding:9px 15px;background:#f5efe1;border-radius:7px;border:1px solid #c7bba3;color:#202724;font-size:18px;text-align:center}
#${PANEL_ID} .khae-engine-map{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px;padding:14px 0 0}
#${PANEL_ID} .khae-engine-map a{display:block;padding:11px 12px;border:1px solid #c7bba3;border-radius:7px;color:#202724;text-decoration:none;background:white;font-size:16px}
#${PANEL_ID} .khae-engine-map a:hover,#${PANEL_ID} .khae-engine-map a:focus-visible{background:#f5efe1;text-decoration:underline}
#${PANEL_ID} :focus-visible{outline:3px solid #b48b45;outline-offset:3px}
body.khae-english-focus-view main :is(.phase,.card,.lesson-day,.text-passage){max-width:850px;margin-inline:auto}
body.khae-english-focus-view main :is(p,blockquote,li){line-height:1.85}
@media(max-width:650px){#${PANEL_ID}{margin:14px 10px;padding:15px}#${PANEL_ID} .khae-engine-map{grid-template-columns:1fr}}
@media print{#${PANEL_ID}{display:none!important}}
`;
  document.head.append(style);
}
function ensureHeadingId(heading,index){
  if(heading.id)return heading.id;
  const value="khae-lesson-part-"+index;
  if(document.getElementById(value))return null;
  heading.id=value;
  return value;
}
function headingsFor(main){
  return [...main.querySelectorAll("h2")].filter(el=>!el.closest("#"+PANEL_ID+" ,[hidden]") && el.textContent.trim());
}
function getTitle(main){return document.querySelector("h1")?.textContent?.replace(/\s+/g," ").trim()||"Daily lesson"}
function insertPanel(main,panel,info){
  if(info.kind==="english9-daily"){
    const hero=main.querySelector(".daily-hero");
    if(hero){hero.insertAdjacentElement("afterend",panel);return;}
  }
  main.prepend(panel);
}
function addText(parent,tag,content,cls){
  const el=document.createElement(tag);el.textContent=content;if(cls)el.className=cls;parent.append(el);return el;
}
/* Optional safe content adapter for future JSON-first lesson shells.
 * Schema: {version:1, title:string, sections:[{title:string, paragraphs:string[], bullets:string[]}]}
 * Page must explicitly opt in with [data-khae-lesson-content] and a
 * <script type="application/json" data-khae-lesson-payload> element.
 * No HTML interpolation, scripts, URLs, external resources, or student fields.
 */
function renderOptInContent(main){
  const target=main.querySelector("[data-khae-lesson-content]");
  const script=document.querySelector('script[type="application/json"][data-khae-lesson-payload]');
  if(!target||!script||target.dataset.khaeLessonRendered==="true")return false;
  let payload;try{payload=JSON.parse(script.textContent||"{}")}catch{return false}
  if(payload?.version!==1||!Array.isArray(payload.sections)||payload.sections.length>30)return false;
  const fragment=document.createDocumentFragment();
  for(const section of payload.sections){
    if(!section||typeof section.title!=="string"||section.title.length>160)return false;
    const block=document.createElement("section");block.className="khae-english-data-section";
    addText(block,"h2",section.title);
    for(const text of Array.isArray(section.paragraphs)?section.paragraphs:[]){
      if(typeof text!=="string"||text.length>5000)return false;
      addText(block,"p",text);
    }
    if(Array.isArray(section.bullets)&&section.bullets.length){
      const ul=document.createElement("ul");
      for(const text of section.bullets){if(typeof text!=="string"||text.length>1000)return false;addText(ul,"li",text)}
      block.append(ul);
    }
    fragment.append(block);
  }
  target.replaceChildren(fragment);
  target.dataset.khaeLessonRendered="true";
  return true;
}
function mount(){
  const info=route();if(!info)return null;
  const main=document.querySelector("main");if(!main)return null;
  const existing=document.getElementById(PANEL_ID);if(existing)return existing;
  injectStyles();
  renderOptInContent(main);
  const panel=document.createElement("section");
  panel.id=PANEL_ID;panel.setAttribute("aria-label","Shared English lesson navigation and study view");
  addText(panel,"p","Khaemenes Academy · English "+info.grade+" · Week "+String(info.week).padStart(2,"0")+" · Day "+info.day,"khae-engine-eyebrow");
  addText(panel,"h2","Your Lesson Path","khae-engine-title");
  addText(panel,"p","Move through the original lesson at your pace. The guide and focus controls do not submit work, award grades, or bypass course mastery.","khae-engine-summary");
  const actions=document.createElement("div");actions.className="khae-engine-actions";
  const focus=document.createElement("button");focus.type="button";focus.textContent="Focused Reading";focus.setAttribute("aria-pressed","false");
  focus.addEventListener("click",()=>{
    const pressed=focus.getAttribute("aria-pressed")!=="true";
    focus.setAttribute("aria-pressed",String(pressed));
    document.body.classList.toggle("khae-english-focus-view",pressed);
    focus.textContent=pressed?"Exit Focused Reading":"Focused Reading";
  });
  actions.append(focus);panel.append(actions);
  const headings=headingsFor(main);
  const details=document.createElement("details");
  const summary=document.createElement("summary");summary.textContent="Explore lesson sections";details.append(summary);
  const map=document.createElement("nav");map.className="khae-engine-map";map.setAttribute("aria-label","This lesson's sections");
  headings.slice(0,24).forEach((heading,i)=>{
    const id=ensureHeadingId(heading,i+1);if(!id)return;
    const link=document.createElement("a");link.href="#"+id;link.textContent=heading.textContent.replace(/\s+/g," ").trim().slice(0,85);
    map.append(link);
  });
  if(map.childElementCount){details.append(map);panel.append(details);}
  insertPanel(main,panel,info);
  document.documentElement.dataset.khaeEnglishUnifiedEngine="v1";
  document.documentElement.dataset.khaeEnglishUnifiedGrade=String(info.grade);
  return panel;
}
window[API]=Object.freeze({version:"1.0.0",route,mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
