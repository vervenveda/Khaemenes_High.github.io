(()=>{
"use strict";

const THEME_KEY="khaemenes-theme";
const PIN_KEY="khaemenes-high-pinned-courses-v2";
const MATH_PATHWAY_KEY="khaemenes-high-math-pathway-v1";
const COURSE_ID="pre-algebra";
const OTHER_MATH_ID="algebra-1";
const CONTINUE_KEY="khaemenes-grade09-last-open-v1";
const COURSE_HOME="/Khaemenes_High.github.io/courses/mathematics/pre-algebra/";
const STUDENT_HOME="/Khaemenes_High.github.io/grades/grade-09/student-profile/";
const MENTOR_HOME="/Khaemenes_High.github.io/mentor/";

const readJSON=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
const writeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};

function themeButton(){return document.getElementById("themeToggle")}
function setTheme(theme){
  const next=theme==="light"?"light":"dark";
  document.documentElement.dataset.theme=next;
  try{localStorage.setItem(THEME_KEY,next)}catch{}
  const button=themeButton();
  if(button){
    button.dataset.khaeThemeBound="true";
    button.setAttribute("aria-label",next==="light"?"Switch to dark theme":"Switch to light theme");
    button.title=next==="light"?"Switch to dark theme":"Switch to light theme";
    button.textContent=next==="light"?"☾ Dark":"☀ Light";
  }
}
function initTheme(){
  let saved=null;
  try{saved=localStorage.getItem(THEME_KEY)}catch{}
  const preferred=saved||((window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark");
  setTheme(preferred);
  const button=themeButton();
  if(!button||button.dataset.khaeThemeCapture==="true")return;
  button.dataset.khaeThemeCapture="true";
  button.addEventListener("click",event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    setTheme(document.documentElement.dataset.theme==="light"?"dark":"light");
  },true);
}

function readPins(){
  const value=readJSON(PIN_KEY,[]);
  return Array.isArray(value)?value:[];
}
function isPinned(){return readPins().includes(COURSE_ID)}
function updatePinButton(){
  const button=document.getElementById("pinPreAlgebraClass");
  if(!button)return;
  const pinned=isPinned();
  button.setAttribute("aria-pressed",String(pinned));
  button.textContent=pinned?"★ Class Pinned":"☆ Pin Class";
  button.title=pinned?"Remove Pre-Algebra from the student profile":"Pin Pre-Algebra to the student profile";
  const status=document.getElementById("preAlgebraNavStatus");
  if(status&&pinned&&status.dataset.initialized!=="true"){
    status.textContent="Pre-Algebra is pinned to the student profile.";
    status.dataset.initialized="true";
  }
}
function togglePin(){
  const pins=readPins();
  const wasPinned=pins.includes(COURSE_ID);
  const next=wasPinned?pins.filter(id=>id!==COURSE_ID):[COURSE_ID,...pins.filter(id=>id!==COURSE_ID&&id!==OTHER_MATH_ID)];
  if(!writeJSON(PIN_KEY,next)){
    const status=document.getElementById("preAlgebraNavStatus");
    if(status)status.textContent="This browser could not save the profile pin.";
    return;
  }
  if(!wasPinned)writeJSON(MATH_PATHWAY_KEY,COURSE_ID);
  updatePinButton();
  const status=document.getElementById("preAlgebraNavStatus");
  if(status){
    status.dataset.initialized="true";
    status.textContent=wasPinned?"Pre-Algebra was removed from the student profile.":"Pre-Algebra was pinned. It will appear on the student dashboard with a Continue button.";
  }
}

function mentorURL(){
  const params=new URLSearchParams({stage:"high",subject:"mathematics",course:"pre-algebra",source:location.pathname});
  return `${MENTOR_HOME}?${params.toString()}`;
}
function ensureHeaderControls(){
  const actions=document.querySelector(".header-actions");
  if(!actions)return;

  if(!document.getElementById("studentHomeButton")){
    const a=document.createElement("a");
    a.id="studentHomeButton";
    a.className="nav-button secondary";
    a.href=STUDENT_HOME;
    a.textContent="Student Home";
    actions.insertBefore(a,themeButton()||null);
  }

  if(!document.getElementById("mentorHelpButton")){
    const a=document.createElement("a");
    a.id="mentorHelpButton";
    a.className="nav-button secondary";
    a.href=mentorURL();
    a.textContent="Ask Mentor";
    actions.insertBefore(a,themeButton()||null);
  }

  if(!document.getElementById("pinPreAlgebraClass")){
    const button=document.createElement("button");
    button.id="pinPreAlgebraClass";
    button.className="nav-button secondary";
    button.type="button";
    button.setAttribute("aria-pressed","false");
    button.textContent="☆ Pin Class";
    button.addEventListener("click",togglePin);
    actions.insertBefore(button,themeButton()||null);
  }

  if(!document.getElementById("preAlgebraNavStatus")){
    const status=document.createElement("span");
    status.id="preAlgebraNavStatus";
    status.setAttribute("aria-live","polite");
    status.style.position="absolute";
    status.style.width="1px";
    status.style.height="1px";
    status.style.padding="0";
    status.style.margin="-1px";
    status.style.overflow="hidden";
    status.style.clip="rect(0,0,0,0)";
    status.style.whiteSpace="nowrap";
    status.style.border="0";
    actions.appendChild(status);
  }

  updatePinButton();
  initTheme();
}

function recordContinue(){
  if(document.getElementById("academyDirectGate")||document.getElementById("academyUnit1Gate"))return;
  const lesson=window.LESSON_DATA||{};
  if(!lesson.id&&!lesson.title)return;
  const unitMatch=location.pathname.match(/\/units\/(unit-\d+)\//i);
  writeJSON(CONTINUE_KEY,{
    course:COURSE_ID,
    courseTitle:"Pre-Algebra",
    unit:unitMatch?unitMatch[1]:"",
    lesson:lesson.id||"",
    title:lesson.title||document.title||"Pre-Algebra",
    url:location.pathname,
    courseHome:COURSE_HOME,
    at:new Date().toISOString()
  });
}

function addStyles(){
  if(document.getElementById("preAlgebraStudentNavStyles"))return;
  const style=document.createElement("style");
  style.id="preAlgebraStudentNavStyles";
  style.textContent=`
    .header-actions{display:flex;align-items:center;justify-content:flex-end;gap:7px;flex-wrap:wrap;position:relative}
    #pinPreAlgebraClass[aria-pressed="true"]{background:color-mix(in srgb,var(--gold) 18%,transparent);border-color:var(--gold);color:var(--text,inherit)}
    @media(max-width:820px){.header-inner{align-items:flex-start}.header-actions{justify-content:flex-end}.header-actions .nav-button,.header-actions .theme-button{min-height:40px;padding:8px 10px;font-size:10px}}
    @media(max-width:760px){#studentHomeButton,#mentorHelpButton,#pinPreAlgebraClass{display:inline-flex!important}}
    @media(max-width:620px){.header-inner{flex-direction:column;align-items:stretch;padding-block:11px}.brand{justify-content:center}.header-actions{justify-content:center}.header-actions .nav-button,.header-actions .theme-button{flex:1 1 auto}}
  `;
  document.head.appendChild(style);
}

function init(){
  addStyles();
  ensureHeaderControls();
  if(document.readyState==="complete")setTimeout(recordContinue,0);
  else window.addEventListener("load",recordContinue,{once:true});
  window.addEventListener("storage",event=>{
    if(event.key===PIN_KEY)updatePinButton();
    if(event.key===THEME_KEY)setTheme(event.newValue||"dark");
  });
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
