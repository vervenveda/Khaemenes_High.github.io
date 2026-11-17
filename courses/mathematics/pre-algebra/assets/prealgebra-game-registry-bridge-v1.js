/* Khaemenes Pre-Algebra canonical game registry bridge v1.
   Reads the shared mathematics game registry and mounts matching practice companions.
   Practice only: never awards course mastery or assessment credit. */
(()=>{
"use strict";
const self=document.currentScript;
if(!self?.src)return;
if(!/\/courses\/mathematics\/pre-algebra\/units\/unit-\d+\/lessons\//i.test(location.pathname))return;

const match=/\/units\/unit-(\d+)\/lessons\/lesson-(\d+)-[^/]+\.html$/i.exec(location.pathname);
if(!match)return;
const unitNumber=Number(match[1]);
if(unitNumber>=1&&unitNumber<=3)return; // Units 01–03 retain their explicit validated companion maps.
const unit=String(unitNumber).padStart(2,"0");
const lesson=String(Number(match[2])).padStart(2,"0");
const mathRoot=new URL("../../assets/",self.src);
const registryURL=new URL("learning-games/game-registry.json",mathRoot);
const launcherURL=new URL("shared-game-launcher.js",mathRoot);

function lessonNumber(value){
  const m=String(value??"").match(/\d+$/);
  return m?String(Number(m[0])).padStart(2,"0"):"";
}
function alreadyPresent(slug){
  return Boolean(
    document.getElementById("mathSharedGameCompanion-"+slug) ||
    document.querySelector('script[data-game="'+CSS.escape(slug)+'"]') ||
    document.querySelector('a[href*="/learning-games/'+CSS.escape(slug)+'/"]')
  );
}
async function boot(){
  let registry;
  try{
    const response=await fetch(registryURL,{credentials:"same-origin",cache:"no-cache"});
    if(!response.ok)throw Error("HTTP "+response.status);
    registry=await response.json();
  }catch(err){
    console.warn("Pre-Algebra game registry unavailable; lesson remains usable.",err);
    return;
  }
  const matches=[];
  for(const [slug,game] of Object.entries(registry.games||{})){
    if(!/^[a-z0-9-]+$/i.test(slug))continue;
    const placement=(game.placements||[]).find(p=>
      p?.wired===true &&
      (p.course==="pre-algebra"||p.course==="prealgebra") &&
      String(Number(p.unit)).padStart(2,"0")===unit &&
      lessonNumber(p.lesson)===lesson
    );
    if(placement&&!alreadyPresent(slug))matches.push({slug,game,placement});
  }
  for(const item of matches){
    const s=document.createElement("script");
    s.src=launcherURL.href;
    s.dataset.game=item.slug;
    s.dataset.course="prealgebra";
    s.dataset.unit=unit;
    s.dataset.lesson=lesson;
    s.dataset.mode=item.placement.mode||"";
    s.dataset.title=item.game.title||item.slug;
    s.dataset.mathLevel="1";
    s.dataset.prealgebraRegistryBridge="v1";
    document.head.appendChild(s);
  }
  document.documentElement.dataset.prealgebraGameRegistry=
    matches.length?"mounted-"+matches.length:"no-placement";
}
document.readyState==="loading"
  ?document.addEventListener("DOMContentLoaded",boot,{once:true})
  :boot();
})();