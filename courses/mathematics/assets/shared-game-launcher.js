(()=>{
"use strict";
const script=document.currentScript;
if(!script)return;
const game=script.dataset.game;
const course=script.dataset.course;
const unit=script.dataset.unit||"";
const lesson=script.dataset.lesson||"";
const mode=script.dataset.mode||"";
const title=script.dataset.title||"Learning Game";
if(!game||!course)return;

const gameURL=new URL(`learning-games/${game}/index.html`,script.src);
gameURL.searchParams.set("course",course);
if(unit)gameURL.searchParams.set("unit",unit);
if(lesson)gameURL.searchParams.set("lesson",lesson);
if(mode)gameURL.searchParams.set("mode",mode);

const safeGameId=game.replace(/[^a-z0-9_-]/gi,"-");
const sectionId=`mathSharedGameCompanion-${safeGameId}`;
const titleId=`mathSharedGameTitle-${safeGameId}`;
function inject(){
  if(document.getElementById(sectionId))return true;
  const main=document.querySelector("main");
  if(!main)return false;
  const section=document.createElement("section");
  section.id=sectionId;
  section.className="block math-shared-game-companion";
  section.setAttribute("aria-labelledby",titleId);
  section.innerHTML=`
    <div class="wrap">
      <article class="card">
        <span class="pill good">Shared Mathematics Game</span>
        <h2 id="${titleId}">${title}</h2>
        <p>This lesson is connected to the canonical Khaemenes Mathematics game library. The same game grows in mathematical depth across courses rather than being duplicated.</p>
        <div class="actions">
          <a class="btn primary" href="${gameURL.href}">Open Learning Game</a>
        </div>
      </article>
    </div>`;
  const companions=[...main.querySelectorAll(".math-shared-game-companion")];
  const blocks=[...main.querySelectorAll("section.block")];
  const target=companions.length?companions[companions.length-1]:(blocks[0]||main.firstElementChild);
  if(target&&target.parentNode)target.insertAdjacentElement("afterend",section);
  else main.appendChild(section);
  return true;
}
function start(){
  if(inject())return;
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(inject()||tries>20)clearInterval(timer);
  },100);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();