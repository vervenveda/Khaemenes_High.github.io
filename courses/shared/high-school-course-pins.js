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
 "algebra-1":Object.freeze({title:"Algebra I",subtitle:"Mathematics pathway · High School",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-1/"}),
 "english-9":Object.freeze({title:"English 9",subtitle:"Language Arts · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-9/"}),
 "integrated-science-9":Object.freeze({title:"Integrated Science 9",subtitle:"Science · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/science/integrated-science-9/"}),
 "global-studies-9":Object.freeze({title:"Global Studies Honors",subtitle:"Social Studies · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/social-studies/grade-09/"}),
 "physical-education-9":Object.freeze({title:"Physical Education 9",subtitle:"Physical Education · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/physical-education/"}),
 "psychology-101":Object.freeze({title:"Psychology 101",subtitle:"Elective · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/electives/grades/grade-09/psych-101/"}),
 "world-language-9-spanish":Object.freeze({title:"Spanish I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=spanish&course=hs1&source=khaemenes-high-grade09"}),
 "world-language-9-french":Object.freeze({title:"French 101",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/apps/French_101_index.html"}),
 "world-language-9-german":Object.freeze({title:"German I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=german&course=hs1&source=khaemenes-high-grade09"}),
 "world-language-9-mandarin":Object.freeze({title:"Mandarin Chinese I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=mandarin&course=hs1&source=khaemenes-high-grade09"}),
 "world-language-9-japanese":Object.freeze({title:"Japanese I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=japanese&course=hs1&source=khaemenes-high-grade09"}),
 "world-language-9-arabic":Object.freeze({title:"Arabic · Exploration",subtitle:"World Language · exploration pathway",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=arabic&mode=atlas&source=khaemenes-high-grade09"}),
 "world-language-9-russian":Object.freeze({title:"Russian · Exploration",subtitle:"World Language · exploration pathway",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=russian&mode=atlas&source=khaemenes-high-grade09"}),
 "geometry":Object.freeze({title:"Geometry",subtitle:"Mathematics pathway · High School",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/geometry/"}),
 "algebra-2":Object.freeze({title:"Algebra II",subtitle:"Mathematics pathway · High School",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-2/"}),
 "english-10":Object.freeze({title:"English 10",subtitle:"Language Arts · Grade 10",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-10/"}),
 "english-11":Object.freeze({title:"English 11",subtitle:"Language Arts · Grade 11",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-11/"}),
 "english-12":Object.freeze({title:"English 12",subtitle:"Language Arts · Grade 12",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-12/"}),
 "social-studies-10":Object.freeze({title:"Social Studies 10",subtitle:"Social Studies · Grade 10",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/social-studies/grade-10/"}),
 "social-studies-11":Object.freeze({title:"Social Studies 11",subtitle:"Social Studies · Grade 11",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/social-studies/grade-11/"}),
 "social-studies-12":Object.freeze({title:"Social Studies 12",subtitle:"Social Studies · Grade 12",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/social-studies/grade-12/"}),
 "biology-10":Object.freeze({title:"Biology 10",subtitle:"Science · Grade 10",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/science/biology-10/"}),
 "chemistry-11":Object.freeze({title:"Chemistry 11",subtitle:"Science · Grade 11",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/science/chemistry-11/"}),
 "physics-engineering-12":Object.freeze({title:"Physics & Engineering 12",subtitle:"Science · Grade 12",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/science/physics-engineering-12/"}),
 "physical-education-10":Object.freeze({title:"Physical Education 10",subtitle:"Physical Education · Grade 10",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/physical-education/"}),
 "physical-education-11":Object.freeze({title:"Physical Education 11",subtitle:"Physical Education · Grade 11",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/physical-education/"}),
 "physical-education-12":Object.freeze({title:"Physical Education 12",subtitle:"Physical Education · Grade 12",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/physical-education/"}),
 "world-language-10":Object.freeze({title:"World Language · Grade 10",subtitle:"Learner-selected language",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/"}),
 "world-language-11":Object.freeze({title:"World Language · Grade 11",subtitle:"Learner-selected language",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/"}),
 "world-language-12":Object.freeze({title:"World Language · Grade 12",subtitle:"Learner-selected language",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/"}),
 "elective-10":Object.freeze({title:"Elective · Grade 10",subtitle:"Learner-selected elective",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/electives/"}),
 "elective-11":Object.freeze({title:"Elective · Grade 11",subtitle:"Learner-selected elective",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/electives/"}),
 "elective-12":Object.freeze({title:"Elective · Grade 12",subtitle:"Learner-selected elective",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/electives/"})
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
  const desiredIds=cleanPins(ids).filter(pin=>COURSE_META[pin]);
  const existingHigh=prior.filter(item=>{
    const itemId=canonical(typeof item==="string"?item:(item?.id||item?.courseId||""));
    return !!COURSE_META[itemId];
  });
  const high=desiredIds.map(pin=>({
    id:pin,
    courseId:pin,
    title:COURSE_META[pin].title,
    subtitle:COURSE_META[pin].subtitle,
    href:COURSE_META[pin].href,
    source:"khaemenes-high",
    updatedAt:new Date().toISOString()
  }));
  const same=existingHigh.length===high.length&&existingHigh.every((item,index)=>{
    const desired=high[index],itemId=canonical(typeof item==="string"?item:(item?.id||item?.courseId||""));
    return itemId===desired.id&&item?.title===desired.title&&item?.subtitle===desired.subtitle&&item?.href===desired.href&&item?.source==="khaemenes-high";
  });
  if(same)return true;
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
const GRADE09_PREFIX="world-language-9-";
const GRADE09_LANGUAGES=Object.freeze(["spanish","french","german","mandarin","japanese","arabic","russian"]);
const validGrade09=code=>GRADE09_LANGUAGES.includes(code);
const languageFromPin=pin=>pin.startsWith(GRADE09_PREFIX)&&validGrade09(pin.slice(GRADE09_PREFIX.length))?pin.slice(GRADE09_PREFIX.length):null;
function storedPins(){
 return cleanPins([...read(PIN_KEY,[]),...academyRecognizedPins()]);
}
function storedLanguages(pins){return [...new Set(pins.map(languageFromPin).filter(Boolean))]}
function readLanguageChoices(){
 const choices=read(LANGUAGE_KEY,{});
 const output=choices&&typeof choices==="object"&&!Array.isArray(choices)?{...choices}:{};
 const local=storedLanguages(cleanPins(read(PIN_KEY,[])));
 const merged=storedLanguages(storedPins());
 // A single explicitly pinned course takes priority over a stale dropdown value.
 if(local.length===1)output["9"]=local[0];
 else if(!validGrade09(output["9"])&&merged.length===1)output["9"]=merged[0];
 return output;
}
function reconcileLanguagePins(all,choices=readLanguageChoices()){
 const languagePins=all.filter(pin=>languageFromPin(pin));
 if(!languagePins.length)return all;
 const languages=storedLanguages(all),chosen=validGrade09(choices["9"])?choices["9"]:languages.length===1?languages[0]:null;
 // An ambiguous legacy state must be resolved by the learner, not guessed.
 if(!chosen)return all;
 const distinct=all.filter(pin=>!languageFromPin(pin));
 const selectedPin=GRADE09_PREFIX+chosen;
 const first=all.findIndex(pin=>languageFromPin(pin));
 distinct.splice(Math.min(first,distinct.length),0,selectedPin);
 return cleanPins(distinct);
}
function readPins(){
 const local=cleanPins(read(PIN_KEY,[]));
 const academy=academyRecognizedPins();
 const merged=reconcileLanguagePins(cleanPins([...local,...academy]));
 if(merged.join("|")!==local.join("|"))write(PIN_KEY,merged);
 syncAcademyPins(merged);
 return merged;
}
function writePins(value){
 const input=cleanPins(value);
 const next=reconcileLanguagePins(input);
 if(!write(PIN_KEY,next))return false;
 const chosen=storedLanguages(next);
 if(chosen.length===1){
  const choices=read(LANGUAGE_KEY,{});
  const updated=choices&&typeof choices==="object"&&!Array.isArray(choices)?{...choices}:{};
  if(updated["9"]!==chosen[0]){updated["9"]=chosen[0];write(LANGUAGE_KEY,updated)}
 }
 return syncAcademyPins(next);
}
function writeLanguageChoices(choices){
 if(!choices||typeof choices!=="object"||Array.isArray(choices))return false;
 const next={...choices},selected=next["9"];
 if(selected!==undefined&&!validGrade09(selected))return false;
 // Preserve existing pin intent, replacing the prior language, not adding a second.
 const existing=storedPins(),hadPin=existing.some(pin=>languageFromPin(pin));
 if(!write(LANGUAGE_KEY,next))return false;
 if(hadPin&&selected){
  const filtered=existing.filter(pin=>!languageFromPin(pin));
  const updated=[...filtered,GRADE09_PREFIX+selected];
  if(!writePins(updated))return false;
 }
 return true;
}
function hasPinRecord(){try{return storage().getItem(scopedKey(PIN_KEY))!==null}catch{return false}}
// Identified learners never inherit another learner's legacy unscoped values.
// Legacy records remain untouched for explicit migration or archival recovery.
window.KhaemenesHighCoursePins=Object.freeze({
 PIN_KEY,LANGUAGE_KEY,ACADEMY_PIN_KEY,COURSE_META,
 activeLearner,scopedKey,readPins,writePins,hasPinRecord,
 clearPins:()=>writePins([]),readLanguageChoices,writeLanguageChoices,
 syncAcademyPins
});
})();
