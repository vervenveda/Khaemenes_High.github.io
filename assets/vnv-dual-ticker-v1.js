/* Khaemenes High · canonical dual ticker guard v1.0.0
   Landing-page presentation only. No learner records are read, written, scored,
   migrated, synchronized, or used to select ticker content.
   Authorized pair: VNV 333 Network ticker + VNV AutoPopulate page-link ticker.
*/
(function(global){
"use strict";
if(global.__KHAEMENES_HIGH_DUAL_TICKER_V1__)return;
global.__KHAEMENES_HIGH_DUAL_TICKER_V1__=true;

const ASSET="https://vervenveda.com/assets/";
const ROOT="https://vervenveda.com/Khaemenes_High.github.io/";
const THREE33="vnv-333-ticker.js";
const AUTO="vnv-ticker-autopopulate.js";

function hasScript(name){
  return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname.endsWith("/"+name)}catch{return false}});
}
function load(name,key){
  if(hasScript(name))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement("script");
    s.src=ASSET+name;
    s.async=false;
    s.dataset[key]="true";
    s.addEventListener("load",resolve,{once:true});
    s.addEventListener("error",resolve,{once:true});
    (document.head||document.documentElement).append(s);
  });
}
function fallbackLinks(){
  return [
    {label:"High School",href:ROOT},
    {label:"Courses",href:ROOT+"courses/"},
    {label:"Mathematics",href:ROOT+"courses/mathematics/"},
    {label:"Language Arts",href:ROOT+"courses/language-arts/"},
    {label:"Science",href:ROOT+"courses/science/"},
    {label:"Social Studies",href:ROOT+"courses/social-studies/"}
  ];
}
function label(){
  return document.body?.dataset.vnvTickerLabel ||
    document.querySelector("h1")?.textContent?.replace(/\s+/g," ").trim().slice(0,38) ||
    "High School";
}
async function mount(){
  if(!document.body)return;

  await load(THREE33,"khaeHigh333");
  try{global.VNV333Ticker?.mount?.()}catch{}

  await load(AUTO,"khaeHighAutoTicker");
  if(!document.getElementById("vnvTickerAutoPopulate")){
    try{
      const discovered=global.VNV_TICKER?.discover?.()||[];
      global.VNV_TICKER?.autoPopulate?.({
        label:label(),
        max:14,
        links:discovered.length?discovered:fallbackLinks()
      });
    }catch{}
  }

  /* If a page loaded AutoPopulate before 333, mounting 333 here still places
     it ahead of the page-link strip; the canonical 333 asset owns stack offsets. */
  try{global.VNV333Ticker?.mount?.()}catch{}
  document.documentElement.dataset.khaeDualTicker="mounted";
  global.dispatchEvent?.(new CustomEvent("khaemenes-high-dual-ticker-ready",{detail:{
    three33:Boolean(document.getElementById("vnv333NetworkTicker")),
    auto:Boolean(document.getElementById("vnvTickerAutoPopulate"))
  }}));
}
function ready(){
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
  else mount();
}
ready();
})(window);
