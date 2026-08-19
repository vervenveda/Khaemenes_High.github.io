(() => {
"use strict";

const scriptEl=document.currentScript;
const coreSrc=new URL("prealgebra-archaemenes-upgrade-core.js",scriptEl?.src||location.href).href;
const CALCULATOR="https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/";
const ROUTES=new Map([
 ["https://vervenveda.com/arcade.github.io/a_sacred_geometry_game_index.html","https://vervenveda.com/arcade.github.io/Geometry/sacred_geometry_game_index.html"],
 ["https://vervenveda.com/arcade.github.io/a_mandala_rings_game_index.html","https://vervenveda.com/arcade.github.io/Geometry/mandala_rings_game_index.html"],
 ["../tools/calculator",CALCULATOR]
]);

function canonicalRoute(value){
 if(!value)return value;
 if(ROUTES.has(value))return ROUTES.get(value);
 try{
  const url=new URL(value,location.href);
  if(url.pathname.endsWith("/arcade.github.io/a_sacred_geometry_game_index.html")){
   url.pathname="/arcade.github.io/Geometry/sacred_geometry_game_index.html";
   return url.href;
  }
  if(url.pathname.endsWith("/arcade.github.io/a_mandala_rings_game_index.html")){
   url.pathname="/arcade.github.io/Geometry/mandala_rings_game_index.html";
   return url.href;
  }
  if(url.pathname.endsWith("/Khaemenes_High.github.io/courses/mathematics/tools/calculator"))return CALCULATOR;
 }catch{}
 return value;
}

function patchResourceRoutes(root=document){
 try{
  if(Array.isArray(window.APP?.tools)){
   window.APP.tools.forEach(tool=>{
    if(/scientific calculator/i.test(String(tool?.name||"")))tool.url=CALCULATOR;
   });
  }
 }catch{}
 const scope=root.querySelectorAll?root:document;
 scope.querySelectorAll("[data-launch-url]").forEach(el=>{
  const next=canonicalRoute(el.getAttribute("data-launch-url"));
  if(next)el.setAttribute("data-launch-url",next);
 });
 scope.querySelectorAll("a[href]").forEach(a=>{
  const next=canonicalRoute(a.getAttribute("href"));
  if(next&&next!==a.getAttribute("href"))a.setAttribute("href",next);
 });
}

function installRouteGuard(){
 patchResourceRoutes();
 document.addEventListener("click",event=>{
  const target=event.target.closest?.("[data-launch-url],a[href]");
  if(!target)return;
  if(target.hasAttribute("data-launch-url"))target.setAttribute("data-launch-url",canonicalRoute(target.getAttribute("data-launch-url")));
  if(target.matches("a[href]"))target.setAttribute("href",canonicalRoute(target.getAttribute("href")));
 },true);
 const observer=new MutationObserver(records=>{
  records.forEach(record=>record.addedNodes.forEach(node=>{
   if(node.nodeType===1)patchResourceRoutes(node);
  }));
 });
 observer.observe(document.body,{childList:true,subtree:true});
}

const core=document.createElement("script");
core.src=coreSrc;
core.async=false;
core.onload=installRouteGuard;
core.onerror=()=>console.error("Pre-Algebra hardening core could not load.");
document.head.appendChild(core);
})();
