/* Grade 09 learner-owned visual preferences.
   Presentation only: cannot hide grades, change enrollment, mastery, placement, or academic records. */
(()=>{
"use strict";
const BASE_KEY="khaemenes-grade09-profile-design-v1";
const ACTIVE_KEY="khaemenes_active_learner_v1";
const FAMILY_KEY="khaemenes_family_registry_v1";
const THEMES=new Set(["parchment","forest","midnight"]);
const ACCENTS=new Set(["gold","teal","plum"]);
const DENSITIES=new Set(["comfortable","compact"]);
const AVATAR_SHAPES=new Set(["circle","soft-square"]);
const AVATAR_MARKS=new Set(["initials","star","book","compass","atom","palette"]);
const DEFAULT=Object.freeze({theme:"parchment",accent:"gold",density:"comfortable",avatarShape:"circle",avatarMark:"initials"});
const MARKS=Object.freeze({star:"★",book:"⌑",compass:"✧",atom:"⚛",palette:"◌"});

function activeLearner(){
 try{
  const id=JSON.parse(localStorage.getItem(ACTIVE_KEY)||"null");
  const registry=JSON.parse(localStorage.getItem(FAMILY_KEY)||"null");
  return typeof id==="string"&&registry?.learners?.[id]?.learnerId===id?id:null;
 }catch{return null}
}
function key(){const id=activeLearner();return id?`${BASE_KEY}:learner:${encodeURIComponent(id)}`:BASE_KEY}
function normalize(value={}){
 const v=value&&typeof value==="object"&&!Array.isArray(value)?value:{};
 return {
  theme:THEMES.has(v.theme)?v.theme:DEFAULT.theme,
  accent:ACCENTS.has(v.accent)?v.accent:DEFAULT.accent,
  density:DENSITIES.has(v.density)?v.density:DEFAULT.density,
  avatarShape:AVATAR_SHAPES.has(v.avatarShape)?v.avatarShape:DEFAULT.avatarShape,
  avatarMark:AVATAR_MARKS.has(v.avatarMark)?v.avatarMark:DEFAULT.avatarMark
 };
}
function read(){try{return normalize(JSON.parse(localStorage.getItem(key())||"{}"))}catch{return {...DEFAULT}}}
function apply(value=read()){
 const p=normalize(value),body=document.body;
 if(!body)return p;
 body.dataset.studentTheme=p.theme;
 body.dataset.studentAccent=p.accent;
 body.dataset.studentDensity=p.density;
 body.dataset.studentAvatarShape=p.avatarShape;
 body.dataset.studentAvatarMark=p.avatarMark;
 return p;
}
function write(value){
 try{
  const owner=activeLearner(),p=normalize(value);
  if(activeLearner()!==owner)return false;
  localStorage.setItem(key(),JSON.stringify({...p,updatedAt:new Date().toISOString()}));
  apply(p);
  if(typeof window.dispatchEvent==="function"&&typeof CustomEvent==="function"){
    window.dispatchEvent(new CustomEvent("khaemenes-grade09-design-changed",{detail:{learnerId:owner,preferences:p}}));
  }
  return true;
 }catch{return false}
}
function clear(){try{localStorage.removeItem(key());apply(DEFAULT);return true}catch{return false}}
function avatarText(initials="S",preferences=read()){
 const p=normalize(preferences);
 return p.avatarMark==="initials"?String(initials||"S").slice(0,2).toUpperCase():(MARKS[p.avatarMark]||String(initials||"S").slice(0,2).toUpperCase());
}
window.KhaemenesGrade09Design=Object.freeze({BASE_KEY,defaults:DEFAULT,read,write,clear,apply,avatarText,storageKey:key});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>apply(),{once:true});else apply();
window.addEventListener("storage",event=>{if(String(event.key||"")===key())apply()});
})();
