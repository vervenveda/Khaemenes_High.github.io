/* Khaemenes Academy · Biology 10 · canonical presentation shell v1
   Idempotent presentation/navigation layer only. It does not read, write, migrate,
   score, reset, or synchronize learner records.
*/
(function(global){
"use strict";
if(global.__KHAEMENES_BIOLOGY10_ACADEMY_SHELL_V1__) return;
global.__KHAEMENES_BIOLOGY10_ACADEMY_SHELL_V1__=true;
const current=document.currentScript?.src||location.href;
const CSS=new URL("./biology10-readable-type-v1.css",current).href;
const ASSET="https://vervenveda.com/assets/";
function hasScript(name){return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname.endsWith("/"+name)}catch{return false}})}
function ensureStyle(){
 if(document.querySelector('link[data-biology10-readable-type]'))return;
 const l=document.createElement("link");l.rel="stylesheet";l.href=CSS;l.dataset.biology10ReadableType="true";document.head.append(l);
}
function ensureScript(name,key){
 if(hasScript(name))return Promise.resolve();
 return new Promise(resolve=>{const s=document.createElement("script");s.src=ASSET+name;s.async=false;s.dataset[key]="true";s.addEventListener("load",resolve,{once:true});s.addEventListener("error",resolve,{once:true});document.head.append(s)});
}
async function mount(){
 ensureStyle();
 await ensureScript("vnv-333-ticker.js","biology10333");
 await ensureScript("vnv-ticker-autopopulate.js","biology10AutoTicker");
 if(!document.getElementById("vnvTickerAutoPopulate")){try{global.VNV_TICKER?.autoPopulate?.({label:"Biology 10",max:14})}catch{}}
 await ensureScript("vnv-header-autopopulate.js","biology10Header");
 if(!document.getElementById("vnvHeaderAutoPopulate")){try{global.VNV_HEADER?.mount?.({title:"Khaemenes Academy",subtitle:"Biology & Biotechnology 10",icon:"K",home:"https://vervenveda.com/Khaemenes_Academy.github.io/",actions:[]})}catch{}}
 await ensureScript("vnv-language.js","biology10Language");
 await ensureScript("vnv-ecosystem-toolbar.js","biology10Toolbar");
}
mount();
})(window);
