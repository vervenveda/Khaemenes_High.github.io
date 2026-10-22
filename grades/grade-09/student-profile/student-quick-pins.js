/* Grade 09 compatibility adapter for Academy-wide learner Quick Pins.
   Personal shortcuts only: never enrollment, grades, mastery, placement, or lesson unlocks. */
(()=>{
"use strict";
const BASE_KEY="khaemenes-grade09-quick-pins-v1";
const canonical=window.KhaemenesStudentQuickPinsV1||null;
const pinStore=window.KhaemenesHighCoursePins||null;
const RESOURCES=canonical?.resources||Object.freeze({
  "prealgebra-games":Object.freeze({id:"prealgebra-games",title:"Pre-Algebra Games",subtitle:"Mathematics practice",category:"Game",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/pre-algebra/#games",mark:"∑"}),
  "academy-arcade":Object.freeze({id:"academy-arcade",title:"Verve N Veda Arcade",subtitle:"Logic · vocabulary · strategy",category:"Game",href:"https://vervenveda.com/arcade.github.io/",mark:"◇"}),
  "scientific-calculator":Object.freeze({id:"scientific-calculator",title:"Scientific Calculator",subtitle:"Mathematics tool",category:"Tool",href:"https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/",mark:"ƒ"}),
  "the-verifier":Object.freeze({id:"the-verifier",title:"The Verifier",subtitle:"Research and source checking",category:"Resource",href:"https://vervenveda.com/theverifier.github.io/",mark:"✓"}),
  "citation-studio":Object.freeze({id:"citation-studio",title:"Evidence Citation Studio",subtitle:"Research evidence tool",category:"Resource",href:"https://vervenveda.com/proresource_hub.github.io/Protools/Evidence_Citation_Studio/",mark:"§"}),
  "electives-hall":Object.freeze({id:"electives-hall",title:"Electives Hall",subtitle:"Explore current and future electives",category:"Elective",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/electives/",mark:"✦"})
});
function activeLearner(){return pinStore?.activeLearner?.()||null}
function key(){const id=activeLearner();return pinStore?.scopedKey?pinStore.scopedKey(BASE_KEY,id):(id?BASE_KEY+":learner:"+encodeURIComponent(id):BASE_KEY)}
function clean(value){
 if(!Array.isArray(value))return [];
 const seen=new Set();
 return value.filter(id=>typeof id==="string"&&RESOURCES[id]&&!seen.has(id)&&seen.add(id));
}
function fallbackRead(){try{return clean(JSON.parse(localStorage.getItem(key())||"[]"))}catch{return []}}
function fallbackWrite(value){
 try{
  const owner=activeLearner(),target=key();
  if(activeLearner()!==owner)return false;
  localStorage.setItem(target,JSON.stringify(clean(value)));
  window.dispatchEvent?.(new CustomEvent("khaemenes-grade09-quick-pins-changed",{detail:{learnerId:owner}}));
  return true;
 }catch{return false}
}
function list(){return canonical?canonical.list():fallbackRead().map(id=>RESOURCES[id]).filter(Boolean)}
function isPinned(id){return canonical?canonical.isPinned(id):fallbackRead().includes(id)}
function setPinned(id,on=true){
 if(!RESOURCES[id])return false;
 if(canonical){
   const ok=canonical.setPinned(id,on);
   if(ok)window.dispatchEvent?.(new CustomEvent("khaemenes-grade09-quick-pins-changed",{detail:{learnerId:activeLearner()}}));
   return ok;
 }
 const current=fallbackRead().filter(x=>x!==id);
 return fallbackWrite(on?[...current,id]:current);
}
function toggle(id){const next=!isPinned(id);return setPinned(id,next)?next:null}
function clear(){return canonical?canonical.clear():fallbackWrite([])}
window.KhaemenesGrade09QuickPins=Object.freeze({BASE_KEY,resources:RESOURCES,list,isPinned,setPinned,toggle,clear,storageKey:canonical?.storageKey||key});
})();
