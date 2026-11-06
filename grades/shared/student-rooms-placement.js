/* Khaemenes High School Grades 09–12 — Student Rooms placement.
 * Move existing three cards (never clone them) immediately after the
 * existing Student Learning Portfolio, preserving their course links,
 * styling, learner-specific background choices and registered handlers.
 * No storage, enrollment, academic or STOS operations.
 */
(function(global){
 "use strict";
 if(global.KhaemenesStudentRoomsPlacement)return;
 const GROUP=[".student-rooms-contrast",".student-access-contrast",".student-campus-contrast"];
 function place(){
  const main=document.querySelector("main");
  const portfolio=main?.querySelector('aside[aria-label="Student Learning Portfolio"]');
  const cards=GROUP.map(selector=>main?.querySelector(selector));
  if(!main||!portfolio||portfolio.parentElement!==main||cards.some(node=>!node))return false;
  const roomCards=cards.filter(Boolean);
  // Never move an unrelated dialog/card or duplicate a component.
  if(new Set(roomCards).size!==3||roomCards.some(card=>!main.contains(card)))return false;
  let host=main.querySelector(":scope > #studentRoomsAfterPortfolio");
  if(!host){
   host=document.createElement("section");
   host.id="studentRoomsAfterPortfolio";
   host.className="student-rooms-placement";
   host.setAttribute("aria-label","Student rooms and campus access");
   const grid=document.createElement("div");
   grid.className="grid student-rooms-placement-grid";
   host.append(grid);
  }
  const target=host.querySelector(":scope > .student-rooms-placement-grid");
  if(!target)return false;
  if(portfolio.nextElementSibling!==host)portfolio.insertAdjacentElement("afterend",host);
  for(const card of roomCards){
   if(card.parentElement!==target||card!==target.children[roomCards.indexOf(card)]){
    target.append(card);
   }
  }
  // Grade 09 already owns the real Explore, Create & Celebrate section.
  // Keep the existing component immediately after Student Rooms without
  // cloning its accordions, Yearbook controls, or learner-owned content.
  // Grades without Explore keep their own current content untouched.
  const explore=main.querySelector(":scope > #grade09Explore");
  if(explore&&host.nextElementSibling!==explore)host.insertAdjacentElement("afterend",explore);
  return portfolio.nextElementSibling===host
   &&roomCards.every((card,index)=>target.children[index]===card)
   &&(!explore||host.nextElementSibling===explore);
 }
 global.KhaemenesStudentRoomsPlacement=Object.freeze({version:"1.0.0",place});
 place();
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",place,{once:true});
})(window);
