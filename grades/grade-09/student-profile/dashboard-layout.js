/* Grade 09 layout steward: keep features, restore a readable daily-start hierarchy. */
(()=>{"use strict";
const main=document.querySelector("main"),schedule=document.querySelector(".grade09-priority-schedule");
if(!main||!schedule)return;
const progress=document.getElementById("studentCourseProgress");
const dashboardWidth="min(calc(100% - 33px), 1100px)";
const align=node=>{if(!node)return;node.style.setProperty("width",dashboardWidth,"important");node.style.setProperty("max-width","1100px","important");node.style.setProperty("margin-left","auto","important");node.style.setProperty("margin-right","auto","important")};
const shortcuts=document.querySelector(".grade09-priority");
const portfolio=main.querySelector('aside[aria-label="Student Learning Portfolio"]');
// Student profile first: identity/photo, first step, pins, then the existing course schedule.
const grid=main.querySelector(".section .grid");
const identity=grid?.querySelector(".profile-row")?.closest(".card");
const firstStep=grid?.querySelector("#todayTitle")?.closest(".card");
const pins=grid?.querySelector("#classes");
const top=document.createElement("section");
top.className="grade09-profile-first";
top.id="grade09ProfileFirst";
top.setAttribute("aria-label","Student profile and daily starting point");
for(const card of [identity,firstStep,pins])if(card)top.append(card);
main.prepend(top);
align(top);

// Profile photo and personal information must lead; the Profile Tools toolbar follows the identity card.
// It reuses existing Grade 09 features; no course records or learner storage are changed.
if(!document.getElementById("khaeProfileToolRail")){
 const rail=document.createElement("nav");
 rail.id="khaeProfileToolRail";
 rail.setAttribute("aria-label","My Profile Tools");
 rail.style.cssText="box-sizing:border-box;width:min(calc(100% - 33px),1100px);max-width:1100px;margin:14px auto 12px;padding:16px;border:1px solid #b48b45;border-radius:7px;background:#242d2b;color:#fff8e9";
 const heading=document.createElement("h2");
 heading.textContent="My Profile Tools";
 heading.style.cssText="margin:0 0 12px;text-align:center;color:#e2bd78;font:400 24px/1.3 Cinzel,Georgia,serif";
 const grid=document.createElement("div");
 grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:9px";
 const reveal=id=>{
  const element=document.getElementById(id);
  if(!element)return false;
  const details=element.closest("details");
  if(details)details.open=true;
  element.scrollIntoView({behavior:"smooth",block:"start"});
  return true;
 };
 const tools=[
  {label:"Edit Profile",href:"profile/"},
  {label:"Class Progress",target:"studentCourseProgress",fallback:"grades/"},
  {label:"Quick Pins",run:()=>{
   const pinned=document.querySelector(".schedule-tile.schedule-quick");
   if(pinned)pinned.scrollIntoView({behavior:"smooth",block:"center"});
   else if(!reveal("scheduleBarTitle"))window.location.assign("games/");
  }},
  {label:"Study Studio",run:()=>{
   const opener=document.getElementById("openLearningJourney");
   if(opener)opener.click();
   else window.location.assign("profile/");
  }},
  {label:"Dreams & Achievements",target:"khaeDreamsAchievements",fallback:"profile/"},
  {label:"Sticker Box",target:"khaeStickerBox",fallback:"games/"},
  {label:"Creative Tools",target:"khaeStudentEcosystemTools",fallback:"games/"}
 ];
 for(const tool of tools){
  const item=document.createElement(tool.href?"a":"button");
  item.className="grade09-profile-tool";
  item.textContent=tool.label;
  if(tool.href)item.href=tool.href;
  else{
   item.type="button";
   if(tool.target)item.setAttribute("aria-controls",tool.target);
   item.addEventListener("click",()=>{
    if(tool.run)tool.run();
    else if(!reveal(tool.target))window.location.assign(tool.fallback);
   });
  }
  item.style.cssText="box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;min-width:0;min-height:56px;padding:10px 12px;border:1px solid #65716c;border-radius:7px;background:#33454b;color:#fff8e9;-webkit-text-fill-color:#fff8e9;text-align:center;text-decoration:none;font:400 16px/1.3 'Brandon Grotesque',Nunito,Arial,sans-serif;cursor:pointer";
  item.addEventListener("focus",()=>{item.style.outline="3px solid #e2bd78";item.style.outlineOffset="2px"});
  item.addEventListener("blur",()=>{item.style.outline=""});
  grid.append(item);
 }
 // Rehome the existing Learning Journey button, preserving its original
 // learner-scoped dialog click handler and saved portfolio evidence.
 const photoActions=identity?.querySelector(".grade09-profile-actions");
 const learningButton=photoActions?.querySelector("#openLearningJourney");
 if(learningButton){
  learningButton.textContent="Learning Journey";
  learningButton.className="grade09-profile-tool";
  learningButton.style.cssText="box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;min-width:0;min-height:56px;padding:10px 12px;border:1px solid #65716c;border-radius:7px;background:#33454b;text-align:center;text-decoration:none;font:400 16px/1.3 'Brandon Grotesque',Nunito,Arial,sans-serif;cursor:pointer";
  learningButton.style.setProperty("color","#fff8e9","important");
  learningButton.style.setProperty("-webkit-text-fill-color","#fff8e9","important");
  grid.append(learningButton);
  // The toolbar already has its own Edit Profile link. Remove the duplicate
  // from the photo card only after the Learning Journey control is safe.
  photoActions.querySelector('a.grade09-profile-action[href="profile/"]')?.remove();
  if(!photoActions.children.length)photoActions.remove();
 }
 rail.append(heading,grid);
 top.insertBefore(rail,firstStep||pins||null);
}
if(shortcuts)top.insertAdjacentElement("afterend",shortcuts);

if(shortcuts)shortcuts.insertAdjacentElement("afterend",schedule);
else top.insertAdjacentElement("afterend",schedule);
if(progress)schedule.insertAdjacentElement("afterend",progress);
[shortcuts,schedule,progress,portfolio].forEach(align);
const region=document.createElement("section");region.id="grade09Explore";region.className="grade09-explore";
const title=document.createElement("h2");title.textContent="Explore, Create & Celebrate";region.append(title);
const summary=document.createElement("p");summary.textContent="Your creative spaces, personal dreams and earned stickers—organized together so daily classes stay easy to find.";region.append(summary);
const sections=[
 ["khaeStudentEcosystemTools","Creative & Discovery Tools"],
 ["khaeStickerBox","My Sticker Box"],
 ["khaeDreamsAchievements","Achievements & Dream Board"]
];
for(const [id,label] of sections){
 const node=document.getElementById(id);if(!node)continue;
 const details=document.createElement("details");details.className="grade09-explore-item";
 const toggle=document.createElement("summary");toggle.textContent=label;details.append(toggle,node);region.append(details);
 node.style.margin="0";node.style.maxWidth="none";
}
if(portfolio)portfolio.style.maxWidth="none";
main.append(region);
align(region);
})();
