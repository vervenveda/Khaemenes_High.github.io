/* Khaemenes High local navigation fallback. Never writes learner records. */
(() => {
 "use strict";
 const script=document.currentScript;
 if(!script?.src)return;
 const root=new URL("../",script.src);
 const page=location.pathname.startsWith(root.pathname)?location.pathname.slice(root.pathname.length):"";
 const names={"mathematics":"Mathematics","language-arts":"Language Arts","science":"Science","social-studies":"Social Studies","physical-education":"Physical Education","electives":"Electives"};
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null");}catch{return null;}};
 const gradeFrom=value=>{
   const match=String(value??"").trim().match(/^(?:grade\s*)?(0?9|1[0-2])(?:st|nd|rd|th)?(?:\s*grade)?$/i);
   return match?Number(match[1]):null;
 };
 function activeGrade(){
   const active=read("khaemenes_active_learner_v1");
   const id=typeof active==="string"?active:active?.learnerId;
   const registry=read("khaemenes_family_registry_v1");
   const person=(typeof id==="string"&&id)?registry?.learners?.[id]:null;
   return person&&(!person.learnerId||person.learnerId===id)?gradeFrom(person.grade):null;
 }
 function profileHref(){
   const grade=activeGrade();
   const dest=grade?"grades/grade-"+String(grade).padStart(2,"0")+"/student-profile/":"index.html#student-portal";
   return new URL(dest,root).href;
 }
 function updateProfiles(){
   const destination=profileHref(),grade=activeGrade();
   document.querySelectorAll("a").forEach(a=>{
     const label=(a.textContent||"").replace(/\s+/g," ").trim();
     const aria=a.getAttribute("aria-label")||"";
     const href=a.getAttribute("href")||"";
     const matching=a.hasAttribute("data-high-profile-door")||
       a.classList.contains("profile-button")||
       /^(?:open my |my )?student profile$/i.test(label)||
       /^open student profile$/i.test(aria)||
       (!!a.closest("[data-khae-actions]")&&/student profile/i.test(label));
     if(!matching||(/(?:edit|academy)/i.test(label)&&/profile\.html|student-profile\/profile/i.test(href)))return;
     a.href=destination;a.dataset.highProfileResolved="true";
     if(!grade)a.title="Choose an Academy learner from the High School student portal";
   });
 }
 const crumb=(href,text)=>({href:new URL(href,root).href,text});
 function crumbList(relative=page){
   const parts=relative.split("/").filter(Boolean);
   if(!parts.length||parts[0]==="index.html")return [];
   const list=[crumb("index.html","High School")];
   if(parts[0]==="grades"&&/^grade-(09|10|11|12)$/.test(parts[1]||"")){
     list.push(crumb("grades/"+parts[1]+"/","Grade "+Number(parts[1].slice(-2))));
     if(parts[2]==="student-profile")list.push(crumb("grades/"+parts[1]+"/student-profile/","Student Profile"));
     return list;
   }
   if(parts[0]!=="courses")return list;
   list.push(crumb("courses/","Courses"));
   const subject=parts[1];
   if(!subject||!names[subject])return list;
   list.push(crumb("courses/"+subject+"/",names[subject]));
   const course=parts[2];
   if(!course||course==="index.html")return list;
   list.push(crumb("courses/"+subject+"/"+course+"/",course.replace(/-/g," ").replace(/\b\w/g,m=>m.toUpperCase())));
   const unit=parts.find(s=>/^unit-(?:0?[1-9]|1[0-3])$/.test(s));
   if(unit)list.push(crumb("courses/"+subject+"/"+course+"/units/"+unit+"/","Unit "+Number(unit.split("-")[1])));
   const lesson=parts.find(s=>/^u\d{1,2}-l\d{1,2}\.html$/.test(s));
   if(lesson)list.push(crumb(relative,"Lesson "+Number(lesson.match(/-l(\d+)/)[1])));
   return list;
 }
 function breadcrumbs(){
   if(!page||document.querySelector('[aria-label="Breadcrumb"],[aria-label="Breadcrumbs"],.breadcrumb,.breadcrumbs,#highNavigationBreadcrumbs'))return;
   const entries=crumbList(),main=document.querySelector("main,[role=main]");
   if(entries.length<2||!main?.parentNode)return;
   const nav=document.createElement("nav");nav.id="highNavigationBreadcrumbs";nav.setAttribute("aria-label","Breadcrumb");
   const ol=document.createElement("ol");
   entries.forEach((item,index)=>{
     const li=document.createElement("li");
     if(index===entries.length-1){
       const span=document.createElement("span");span.textContent=item.text;span.setAttribute("aria-current","page");li.appendChild(span);
     }else{
       const a=document.createElement("a");a.href=item.href;a.textContent=item.text;li.appendChild(a);
     }
     ol.appendChild(li);
   });
   nav.appendChild(ol);main.parentNode.insertBefore(nav,main);
 }
 function skip(){
   const main=document.querySelector("main,[role=main]");if(!main)return;
   if(!main.id)main.id="main";
   if(document.querySelector('a[href="#'+main.id+'"]'))return;
   const a=document.createElement("a");a.className="high-nav-skip";a.href="#"+main.id;a.textContent="Skip to main content";
   document.body.insertBefore(a,document.body.firstChild);
 }
 const links=[
  ["Verve N Veda","https://vervenveda.com/"],["Khaemenes Academy","https://vervenveda.com/Khaemenes_Academy.github.io/"],
  ["High School","index.html"],["High School Courses","courses/"],["Mathematics","courses/mathematics/"],
  ["Academy Arcade","https://vervenveda.com/arcade.github.io/"],
  ["ProResource Hub","https://vervenveda.com/proresource_hub.github.io/"],
  ["The Verifier","https://vervenveda.com/theverifier.github.io/"],
  ["Higher Learning","https://vervenveda.com/Khaemenes_Higher_Learning.github.io/"]
 ];
 function fallbackMenu(){
   if(document.getElementById("vnvEcosystemMenuButton")||
      document.getElementById("vnvEcosystemMenuOverlay")||
      document.getElementById("khaeLocalEcosystemToggle"))return;
   const slots=[...document.querySelectorAll("[data-vnv-ecosystem-slot]")];
   if(slots.some(s=>s.querySelector("button,summary,[aria-haspopup],.vnv-eco-icon-only")))return;
   let slot=slots.find(s=>s.closest("[data-khae-header]"))||slots[0];
   let standAlone=false;
   if(!slot){
     const header=document.querySelector("header");
     if(!header||header.querySelector("details,button[aria-expanded][aria-controls],.hamburger"))return;
     slot=header;standAlone=true;
   }
   const wrap=document.createElement("div");wrap.className="high-nav-menu";
   if(standAlone)wrap.classList.add("high-nav-menu-fixed");
   const button=document.createElement("button");button.type="button";
   button.id="khaeLocalEcosystemToggle";button.textContent="☰";button.title="Ecosystem directory";
   button.setAttribute("aria-label","Open Ecosystem menu");button.setAttribute("aria-controls","khaeLocalEcosystemPanel");
   button.setAttribute("aria-expanded","false");
   const panel=document.createElement("nav");panel.id="khaeLocalEcosystemPanel";
   panel.setAttribute("aria-label","Ecosystem directory");panel.hidden=true;
   const heading=document.createElement("p");heading.textContent="Ecosystem Directory";panel.appendChild(heading);
   links.forEach(([name,href])=>{
     const a=document.createElement("a");a.textContent=name;
     a.href=href.startsWith("https:")?href:new URL(href,root).href;panel.appendChild(a);
   });
   const close=()=>{panel.hidden=true;button.setAttribute("aria-expanded","false");};
   const open=()=>{panel.hidden=false;button.setAttribute("aria-expanded","true");panel.querySelector("a")?.focus();};
   button.addEventListener("click",()=>panel.hidden?open():close());
   document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!panel.hidden){close();button.focus();}});
   document.addEventListener("click",event=>{if(!panel.hidden&&!wrap.contains(event.target))close();});
   wrap.append(button,panel);slot.appendChild(wrap);
 }
 function init(){
   updateProfiles();skip();breadcrumbs();fallbackMenu();
 }
 window.addEventListener("pageshow",updateProfiles);
 window.addEventListener("storage",event=>{
   if(["khaemenes_active_learner_v1","khaemenes_family_registry_v1"].includes(event.key))updateProfiles();
 });
 document.addEventListener("click",event=>{
   const a=event.target?.closest?.("a[data-high-profile-resolved]");
   if(a)a.href=profileHref();
 },true);
 window.KhaemenesHighNavigation=Object.freeze({activeGrade,profileHref,crumbList,init});
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();
