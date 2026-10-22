/* Khaemenes Algebra I canonical lesson companions. Optional navigation only. */
(()=>{
"use strict";
const selfScript=document.currentScript;
if(!selfScript?.src)return;
const math=new URL("../../",selfScript.src);
const course=new URL("algebra-1/",math);
const match=/\/units\/unit-(\d{2})\/lessons\/lesson-(\d{2})-[^/]+\.html$/i.exec(location.pathname);
if(!match)return;
const [,unit,lesson]=match;
const host=document.getElementById("main");if(!host)return;
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==null)e.textContent=text;if(cls)e.className=cls;return e};
const json=async url=>{const r=await fetch(url,{credentials:"same-origin"});if(!r.ok)throw Error("HTTP "+r.status);return r.json()};
function render(){
 if(document.getElementById("a1CanonicalLessonTools"))return true;
 // Never attach supplementary activities over a mastery lock or loading failure.
 if(!host.querySelector(".question")||document.body.dataset.masteryLocked==="true"||
    document.body.dataset.algebra1LoadFailed==="true")return false;
 const outer=node("section",null,"block"),wrap=node("div",null,"wrap"),card=node("article",null,"card full");
 outer.id="a1CanonicalLessonTools";outer.setAttribute("aria-label","Algebra I lesson tools");
 card.append(node("h2","Lesson resources and practice"));
 card.append(node("p","Practice games and printable evidence are optional; they never award mastery or replace the lesson check."));
 const actions=node("div",null,"nav");
 const evidence=new URL("../science/integrated-science-9/academic-evidence-companion.html",math);
 evidence.searchParams.set("course","algebra-1");
 evidence.searchParams.set("unit",unit);
 evidence.searchParams.set("lesson",lesson);
 const a=node("a","Save Academic Evidence","btn");a.href=evidence.href;
 a.setAttribute("aria-label","Open Academy-wide printable Academic Evidence companion");
 actions.append(a);
 const print=node("button","Print lesson","btn");print.type="button";
 print.addEventListener("click",()=>window.print());actions.append(print);
 card.append(actions);
 const vocab=node("div",null);vocab.id="a1CanonicalVocabulary";
 const games=node("div",null);games.id="a1CanonicalGames";
 card.append(vocab,games);wrap.append(card);outer.append(wrap);host.append(outer);
 vocabulary(vocab);gameLinks(games);
 return true;
}
async function vocabulary(host){
 try{
  const data=await json(new URL("units/unit-"+unit+"/vocabulary.json",course));
  if(!Array.isArray(data.terms)||!data.terms.length)return;
  const details=node("details",null),summary=node("summary","Unit "+Number(unit)+" vocabulary · "+data.terms.length+" terms");
  const dl=node("dl",null);details.append(summary);
  for(const term of data.terms){
   const name=String(term.term||term.en||term.id||"").trim();if(!name)continue;
   dl.append(node("dt",name),node("dd",String(term.definition||"Refer to the lesson reading.")));
  }
  details.append(dl);host.append(details);
 }catch(err){console.warn("Algebra I vocabulary unavailable",err)}
}
async function gameLinks(host){
 try{
  const library=await json(new URL("assets/learning-games/game-registry.json",math));
  const links=[];
  for(const [slug,game] of Object.entries(library.games||{})){
   if(!/^[a-z0-9-]+$/i.test(slug))continue;
   const placement=(game.placements||[]).find(p=>p.course==="algebra-1"&&p.wired===true&&
     Number(p.unit)===Number(unit)&&Number(String(p.lesson).match(/\d+$/)?.[0])===Number(lesson));
   // Existing explicitly inserted game companions always take priority.
   if(!placement||
     document.querySelector('script[data-game="'+slug+'"]')||
     host.querySelector('a[href*="/learning-games/'+slug+'/"]')||
     document.getElementById("mathSharedGameCompanion-"+slug))continue;
   const url=new URL("assets/learning-games/"+slug+"/index.html",math);
   url.searchParams.set("course","algebra1");
   url.searchParams.set("unit",unit);url.searchParams.set("lesson",lesson);
   const q=new URLSearchParams(placement.query||"");
   if(q.has("mode"))url.searchParams.set("mode",q.get("mode"));
   const a=node("a","Play · "+String(game.title||slug),"btn");
   a.href=url.href;a.setAttribute("aria-label","Play "+String(game.title||slug)+" for this Algebra I lesson");
   links.push(a);
  }
  if(links.length){
   host.append(node("h3","Matching mathematics games"));
   host.append(node("p","Practice the skill, then return here to explain your reasoning."));
   const buttons=node("div",null,"nav");buttons.append(...links);host.append(buttons);
  }
 }catch(err){console.warn("Algebra I game library unavailable; lessons remain usable",err)}
}
if(!render()){
 const observer=new MutationObserver(()=>{if(render())observer.disconnect()});
 observer.observe(host,{childList:true,subtree:true});
 window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
}
})();