#!/usr/bin/env node
/* Fictional-only regression. Never reads actual student records. */
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","courses","shared","high-school-course-pins.js"),"utf8");
const primary="khaemenes-high-pinned-courses-v2",choices="khaemenes-high-language-choices-v1";
const canonical="khaemenes_course_pins_v1", active="khaemenes_active_learner_v1", family="khaemenes_family_registry_v1";
const learnerA="fictional-french-learner",learnerB="fictional-spanish-learner";
function boot(){
 const map=new Map(),events=[];
 const localStorage={
   getItem:k=>map.has(k)?map.get(k):null,
   setItem:(k,v)=>map.set(k,String(v)),
   removeItem:k=>map.delete(k)
 };
 const json=(key,val)=>localStorage.setItem(key,JSON.stringify(val));
 const parse=key=>JSON.parse(localStorage.getItem(key)||"null");
 const scope=(key,id)=>key+":learner:"+encodeURIComponent(id);
 json(family,{learners:{[learnerA]:{learnerId:learnerA},[learnerB]:{learnerId:learnerB}}});
 json(active,learnerA);
 json(scope(primary,learnerA),["english-9","world-language-9-spanish"]);
 json(scope(choices,learnerA),{"9":"spanish"});
 json(scope(primary,learnerB),["physical-education-9","world-language-9-spanish"]);
 json(scope(choices,learnerB),{"9":"spanish"});
 json(canonical,{version:1,learners:{
   [learnerA]:[{id:"english-9",courseId:"english-9",title:"English 9"},{id:"world-language-9-spanish",courseId:"world-language-9-spanish",title:"Spanish I"}],
   [learnerB]:[{id:"world-language-9-spanish",courseId:"world-language-9-spanish",title:"Spanish I"}]
 }});
 json("fictional-course-mastery",{score:92,completed:true});
 const ctx={window:{localStorage,dispatchEvent:e=>events.push(e.detail)},CustomEvent:class{constructor(name,arg){this.type=name;this.detail=arg.detail}}};
 vm.runInNewContext(source,ctx,{filename:"high-school-course-pins.js",timeout:2000});
 return {api:ctx.window.KhaemenesHighCoursePins,json,parse,scope,events};
}
const t=boot(),p=t.api;
assert.equal(p.activeLearner(),learnerA);
assert.equal(p.readPins().includes("world-language-9-spanish"),true);
assert.equal(p.writeLanguageChoices({"9":"french"}),true);
const after=p.readPins();
assert.deepEqual([...after].filter(x=>x.startsWith("world-language-9-")),["world-language-9-french"]);
assert.equal(p.readLanguageChoices()["9"],"french");
assert.equal(t.parse(t.scope(primary,learnerA)).includes("world-language-9-spanish"),false);
assert.equal(t.parse(canonical).learners[learnerA].some(e=>e.id==="world-language-9-spanish"),false);
assert.equal(t.parse(canonical).learners[learnerA].some(e=>e.id==="world-language-9-french"),true);
assert.equal(p.COURSE_META["world-language-9-french"].title,"French 101");
assert.match(p.COURSE_META["world-language-9-french"].href,/\/apps\/French_101_index\.html$/);
assert.equal(t.parse(t.scope(choices,learnerB))["9"],"spanish");
assert.equal(t.parse(t.scope(primary,learnerB)).includes("world-language-9-spanish"),true);
assert.equal(t.parse("fictional-course-mastery").score,92);
// Explicit pinning from course library must update chosen language.
assert.equal(p.writePins(["english-9","world-language-9-german"]),true);
assert.equal(p.readLanguageChoices()["9"],"german");
assert.deepEqual([...p.readPins()].filter(x=>x.startsWith("world-language-9-")),["world-language-9-german"]);
// Old Academy Spanish alone must never displace a new High French pin.
t.json(t.scope(primary,learnerA),["world-language-9-french"]);
t.json(t.scope(choices,learnerA),{"9":"spanish"});
const store=t.parse(canonical);
store.learners[learnerA]=[{id:"world-language-9-spanish",courseId:"world-language-9-spanish",title:"Spanish I"}];
t.json(canonical,store);
assert.equal(p.readLanguageChoices()["9"],"french");
assert.deepEqual([...p.readPins()].filter(x=>x.startsWith("world-language-9-")),["world-language-9-french"]);
// Removing a language shortcut must not resurrect old Academy pins.
assert.equal(p.writePins(["english-9"]),true);
assert.equal(p.readPins().some(x=>x.startsWith("world-language-9-")),false);
assert.equal(t.parse("fictional-course-mastery").completed,true);
console.log("HIGH_LANGUAGE_PIN_REGRESSION=PASS; French survives Spanish legacy, per-learner isolation and unpin preserved.");
