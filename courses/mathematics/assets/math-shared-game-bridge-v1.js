(() => {
  "use strict";
  if (typeof document === "undefined" || typeof location === "undefined") return;
  const script=document.currentScript;
  const path=String(location.pathname||"");
  const lessonMatch=path.match(/\/courses\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)\/units\/unit-(\d{2})\/lessons\/([^/?#]+\.html)$/i);
  if(!lessonMatch)return;
  if(/\/(?:assessment|assessments|diagnostic)\//i.test(path))return;

  const course=lessonMatch[1].toLowerCase(),unit=lessonMatch[2],file=lessonMatch[3];
  const courseAliases={"pre-algebra":"pre-algebra","algebra-1":"algebra-1","geometry":"geometry","algebra-2":"algebra-2"};
  const source=script?.src||location.href;
  const registryURL=new URL("learning-games/game-registry.json",source);
  const gameBase=new URL("learning-games/",source);
  const normalize=n=>String(Number(String(n).match(/(\d+)$/)?.[1]||n)).padStart(2,"0");

  async function lessonNumber(){
    const direct=file.match(/u\d{2}-l(\d{2})\.html$/i);
    if(direct)return direct[1];
    try{
      const mapURL=new URL("../unit-map.json",location.href);
      const response=await fetch(mapURL.href,{cache:"no-store"});
      if(!response.ok)return null;
      const map=await response.json();
      const entries=Array.isArray(map.lessons)?map.lessons:[];
      const current=decodeURIComponent(location.pathname);
      const hit=entries.find((entry,index)=>{
        const ref=String(entry.file||entry.path||"").split(/[?#]/)[0];
        if(!ref)return false;
        const target=new URL(ref,mapURL.href);
        return decodeURIComponent(target.pathname)===current ||
          decodeURIComponent(target.pathname).endsWith("/"+decodeURIComponent(file));
      });
      if(!hit)return null;
      return normalize(hit.number ?? hit.lesson ?? hit.id ?? (entries.indexOf(hit)+1));
    }catch{return null}
  }

  function gameURL(slug,placement){
    const url=new URL(slug+"/index.html",gameBase);
    const alias={"pre-algebra":"prealgebra","algebra-1":"algebra1","geometry":"geometry","algebra-2":"algebra2"}[course]||course;
    url.searchParams.set("course",alias);
    url.searchParams.set("unit",unit);
    url.searchParams.set("lesson",placement.lesson||"");
    if(placement.mode)url.searchParams.set("mode",placement.mode);
    const level={"pre-algebra":"1","algebra-1":"2","geometry":"2","algebra-2":"3"}[course];
    if(level)url.searchParams.set("level",level);
    return url.href;
  }

  function mount(matches){
    if(!matches.length||document.getElementById("khaeMathSharedGameBridgeV1"))return;
    const main=document.querySelector("main"); if(!main)return;
    const section=document.createElement("section");
    section.id="khaeMathSharedGameBridgeV1";
    section.className="math-shared-game-companion";
    section.dataset.khaemenesMathGameBridge="v1";
    section.setAttribute("aria-label","Connected mathematics games");
    section.style.cssText="box-sizing:border-box;max-width:960px;margin:18px auto;padding:18px;border:1px solid #b9a47c;border-radius:7px;background:#fff9ed;color:#30281e;text-align:center;";
    const eyebrow=document.createElement("p");eyebrow.textContent="Connected Practice";eyebrow.style.cssText="margin:0 0 7px;font-size:16px;letter-spacing:.05em;text-transform:uppercase;";
    const h=document.createElement("h2");h.textContent=matches.length===1?"Learning Game":"Learning Games";h.style.cssText="margin:0 0 9px;font:400 24px/1.3 Cinzel,Georgia,serif;";
    const p=document.createElement("p");p.textContent="These games reinforce this lesson. Game progress is practice evidence and does not replace lesson work, mastery checks, Midterms, or Finals.";p.style.cssText="margin:0 auto 14px;max-width:760px;font-size:16px;line-height:1.6;";
    const actions=document.createElement("div");actions.style.cssText="display:flex;flex-wrap:wrap;justify-content:center;gap:9px;";
    for(const {slug,game,placement} of matches){
      const a=document.createElement("a");a.className="btn";a.href=gameURL(slug,placement);a.textContent=game.title||slug;a.dataset.game=slug;a.dataset.mode=placement.mode||"";a.dataset.course=course;a.dataset.unit=unit;a.dataset.lesson=placement.lesson||"";a.style.cssText="min-height:44px;padding:10px 14px;border:1px solid #30281e;border-radius:7px;background:#30281e;color:#fff9ed;text-decoration:none;font-size:16px;";
      actions.appendChild(a);
    }
    section.append(eyebrow,h,p,actions);
    const target=main.querySelector(".lesson-main,.lesson-content,.lesson-body,.lesson-shell,.sheet")||main;
    const first=target.firstElementChild;
    if(first)target.insertBefore(section,first);else target.append(section);
  }

  async function start(){
    const lesson=await lessonNumber(); if(!lesson)return;
    try{
      const response=await fetch(registryURL.href,{cache:"no-store"}); if(!response.ok)return;
      const registry=await response.json(),matches=[];
      for(const [slug,game] of Object.entries(registry.games||{})){
        for(const placement of game.placements||[]){
          if(placement.wired!==true)continue;
          if(courseAliases[String(placement.course||"").toLowerCase()]!==course)continue;
          if(normalize(placement.unit)!==unit||normalize(placement.lesson)!==lesson)continue;
          matches.push({slug,game,placement});
        }
      }
      mount(matches);
    }catch{}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();