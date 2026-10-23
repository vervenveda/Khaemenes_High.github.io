/* Grade 09 layout steward: keep features, restore a readable daily-start hierarchy. */
(()=>{"use strict";
const main=document.querySelector("main"),schedule=document.querySelector(".grade09-priority-schedule");
if(!main||!schedule)return;
const progress=document.getElementById("studentCourseProgress");
const dashboardWidth="min(calc(100% - 33px), 1100px)";
const align=node=>{if(!node)return;node.style.setProperty("width",dashboardWidth,"important");node.style.setProperty("max-width","1100px","important");node.style.setProperty("margin-left","auto","important");node.style.setProperty("margin-right","auto","important")};
const shortcuts=document.querySelector(".grade09-priority");
const portfolio=main.querySelector('aside[aria-label="Student Learning Portfolio"]');
if(shortcuts)main.prepend(shortcuts);
if(shortcuts)shortcuts.insertAdjacentElement("afterend",schedule);else main.prepend(schedule);
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
