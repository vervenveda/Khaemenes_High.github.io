/* High School course pins; local only. Never handles grades or mastery. */
(()=>{
"use strict";
const PIN_KEY="khaemenes-high-pinned-courses-v2";
const LANGUAGE_KEY="khaemenes-high-language-choices-v1";
const storage=()=>window.localStorage;
function activeLearner(){
 try{
  const id=JSON.parse(storage().getItem("khaemenes_active_learner_v1")||"null");
  const family=JSON.parse(storage().getItem("khaemenes_family_registry_v1")||"null");
  return typeof id==="string"&&family?.learners?.[id]?.learnerId===id?id:null;
 }catch{return null}
}
function scopedKey(base,id=activeLearner()){return id?`${base}:learner:${encodeURIComponent(id)}`:base}
function read(base,fallback){
 try{const raw=storage().getItem(scopedKey(base));return raw===null?fallback:JSON.parse(raw)}
 catch{return fallback}
}
function write(base,value){
 try{const owner=activeLearner(),key=scopedKey(base,owner);
  if(activeLearner()!==owner)return false;
  storage().setItem(key,JSON.stringify(value));return true
 }catch{return false}
}
function cleanPins(value){
 if(!Array.isArray(value))return [];
 const seen=new Set();
 const aliases={"science-9":"integrated-science-9","social-studies-9":"global-studies-9"};
 return value.map(id=>aliases[id]||id).filter(id=>typeof id==="string"&&/^[a-z0-9][a-z0-9-]{0,95}$/.test(id)&&!seen.has(id)&&seen.add(id));
}
function readPins(){return cleanPins(read(PIN_KEY,[]))}
function writePins(value){return write(PIN_KEY,cleanPins(value))}
function hasPinRecord(){try{return storage().getItem(scopedKey(PIN_KEY))!==null}catch{return false}}
function readLanguageChoices(){
 const choices=read(LANGUAGE_KEY,{});
 return choices&&typeof choices==="object"&&!Array.isArray(choices)?{...choices}:{};
}
function writeLanguageChoices(choices){
 return choices&&typeof choices==="object"&&!Array.isArray(choices)?write(LANGUAGE_KEY,choices):false;
}
// Older unscoped values are never automatically copied into another learner's
// records. They remain available as legacy data instead of being deleted.
window.KhaemenesHighCoursePins=Object.freeze({
 PIN_KEY,LANGUAGE_KEY,activeLearner,scopedKey,readPins,writePins,hasPinRecord,
 clearPins:()=>writePins([]),readLanguageChoices,writeLanguageChoices
});
})();
