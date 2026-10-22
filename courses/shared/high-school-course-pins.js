/* High School course pins; learner-scoped and mirrored to the Academy Student Portal.
   Pins never award grades, mastery, placement, or lesson unlocks. */
(()=>{
"use strict";

const PIN_KEY="khaemenes-high-pinned-courses-v2";
const LANGUAGE_KEY="khaemenes-high-language-choices-v1";
const ACADEMY_PIN_KEY="khaemenes_course_pins_v1";
const ACTIVE_KEY="khaemenes_active_learner_v1";
const FAMILY_KEY="khaemenes_family_registry_v1";
const storage=()=>window.localStorage;

const COURSE_META=Object.freeze({
 "pre-algebra":Object.freeze({title:"Pre-Algebra",subtitle:"Mathematics · Grade 09 pathway",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/pre-algebra/"}),
 "algebra-1":Object.freeze({title:"Algebra I",subtitle:"Mathematics · placement pathway",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-1/"}),
 "english-9":Object.freeze({title:"English 9",subtitle:"Language Arts · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-9/"}),
 "integrated-science-9":Object.freeze({title:"Integrated Science 9",subtitle:"Science · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/science/integrated-science-9/"}),
 "global-studies-9":Object.freeze({title:"Global Studies Honors",subtitle:"Social Studies · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/social-studies/grade-09/"}),
 "physical-education-9":Object.freeze({title:"Physical Education 9",subtitle:"Physical Education · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/physical-education/"}),
 "psychology-101":Object.freeze({title:"Psychology 101",subtitle:"Elective · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/electives/grades/grade-09/psych-101/"}),
 "world-language-9-spanish":Object.freeze({title:"Spanish I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html"}),
 "world-language-9-french":Object.freeze({title:"French I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html"}),
 "world-language-9-german":Object.freeze({title:"German I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html"}),
 "world-language-9-mandarin":Object.freeze({title:"Mandarin Chinese I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html"}),
 "world-language-9-japanese":Object.freeze({title:"Japanese I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html"}),
 "world-language-9-arabic":Object.freeze({title:"Arabic · Exploration",subtitle:"World Language · exploration pathway",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html"}),
 "world-language-9-russian":Object.freeze({title:"Russian · Exploration",subtitle:"World Language · exploration pathway",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html"})
});
const ALIASES=Object.freeze({"science-9":"integrated-science-9","social-studies-9":"global-studies-9"});
const canonical=id=>ALIASES[id]||id;

function activeLearner(){
 try{
  const id=JSON.parse(storage().getItem(ACTIVE_KEY)||"null");
  const family=JSON.parse(storage().getItem(FAMILY_KEY)||"null");
  return typeof id==="string"&&family?.learners?.[id]?.learnerId===id?id:null;
 }catch{return null}
}
function scopedKey(base,id=activeLearner()){return id?`${base}:learner:${encodeURIComponent(id)}`:base}
function read(base,fallback){
 try{const raw=storage().getItem(scopedKey(base));return raw===null?fallback:JSON.parse(raw)}
 catch{return fallback}
}
function write(base,value){
 try{
  const owner=activeLearner(),key=scopedKey(base,owner);
  if(activeLearner()!==owner)return false;
  storage().setItem(key,JSON.stringify(value));
  return true;
 }catch{return false}
}
function cleanPins(value){
 if(!Array.isArray(value))return [];
 const seen=new Set();
 return value.map(canonical).filter(id=>typeof id==="string"&&/^[a-z0-9][a-z0-9-]{0,95}$/.test(id)&&!seen.has(id)&&seen.add(id));
}
function readAcademyStore(){
 try{
  const value=JSON.parse(storage().getItem(ACADEMY_PIN_KEY)||"null");
  return value&&typeof value==="object"&&!Array.isArray(value)&&value.learners&&typeof value.learners==="object"
    ? value
    : {version:1,learners:{}};
 }catch{return {version:1,learners:{}}}
}
function academyRecognizedPins(id=activeLearner()){
 if(!id)return [];
 const list=readAcademyStore().learners?.[id];
 if(!Array.isArray(list))return [];
 return cleanPins(list.map(item=>typeof item==="string"?item:(item?.id||item?.courseId||"")).filter(id=>COURSE_META[id]));
}
function syncAcademyPins(ids,id=activeLearner()){
 if(!id)return true;
 try{
  const store=readAcademyStore();
  const prior=Array.isArray(store.learners?.[id])?store.learners[id]:[];
  const preserved=prior.filter(item=>{
    const itemId=canonical(typeof item==="string"?item:(item?.id||item?.courseId||""));
    return !COURSE_META[itemId];
  });
  const high=cleanPins(ids).filter(pin=>COURSE_META[pin]).map(pin=>({
    id:pin,
    courseId:pin,
    title:COURSE_META[pin].title,
    subtitle:COURSE_META[pin].subtitle,
    href:COURSE_META[pin].href,
    source:"khaemenes-high",
    updatedAt:new Date().toISOString()
  }));
  store.version=1;
  store.learners=store.learners&&typeof store.learners==="object"?store.learners:{};
  store.learners[id]=[...preserved,...high];
  store.updatedAt=new Date().toISOString();
  storage().setItem(ACADEMY_PIN_KEY,JSON.stringify(store));
  if(typeof window.dispatchEvent==="function"&&typeof CustomEvent==="function"){
    window.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed",{detail:{learnerId:id}}));
  }
  return true;
 }catch{return false}
}
function readPins(){
 const local=cleanPins(read(PIN_KEY,[]));
 const academy=academyRecognizedPins();
 const merged=cleanPins([...local,...academy]);
 if(merged.join("|")!==local.join("|"))write(PIN_KEY,merged);
 syncAcademyPins(merged);
 return merged;
}
function writePins(value){
 const clean=cleanPins(value);
 if(!write(PIN_KEY,clean))return false;
 return syncAcademyPins(clean);
}
function hasPinRecord(){try{return storage().getItem(scopedKey(PIN_KEY))!==null}catch{return false}}
function readLanguageChoices(){
 const choices=read(LANGUAGE_KEY,{});
 return choices&&typeof choices==="object"&&!Array.isArray(choices)?{...choices}:{};
}
function writeLanguageChoices(choices){
 return choices&&typeof choices==="object"&&!Array.isArray(choices)?write(LANGUAGE_KEY,choices):false;
}
// Identified learners never inherit another learner's legacy unscoped values.
// Legacy records remain untouched for explicit migration or archival recovery.
window.KhaemenesHighCoursePins=Object.freeze({
 PIN_KEY,LANGUAGE_KEY,ACADEMY_PIN_KEY,COURSE_META,
 activeLearner,scopedKey,readPins,writePins,hasPinRecord,
 clearPins:()=>writePins([]),readLanguageChoices,writeLanguageChoices,
 syncAcademyPins
});
})();
