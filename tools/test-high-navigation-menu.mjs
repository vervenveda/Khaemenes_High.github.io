import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const source=fs.readFileSync("assets/high-navigation-v1.js","utf8");
class Element{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.parentNode=null;this.id="";this.className="";
 this.hidden=false;this.textContent="";this.href="";this.dataset={};this.attrs=new Map();this.handlers=new Map();this.focused=false;
 this.classList={contains:value=>this.className.split(/\s+/).includes(value),add:value=>{this.className+=(this.className?" ":"")+value}};
 }
 appendChild(node){node.parentNode=this;this.children.push(node);return node;}
 append(...nodes){for(const node of nodes)this.appendChild(node);}
 insertBefore(node,next){node.parentNode=this;const at=this.children.indexOf(next);this.children.splice(at<0?this.children.length:at,0,node);return node;}
 setAttribute(key,val){this.attrs.set(key,String(val));if(key==="id")this.id=String(val);}
 hasAttribute(key){return this.attrs.has(key);}
 getAttribute(key){return key==="href"?this.href:this.attrs.get(key)||null;}
 addEventListener(key,fn){this.handlers.set(key,fn);}
 focus(){this.focused=true;}
 walk(){return this.children.flatMap(e=>[e,...e.walk()]);}
 contains(node){return node===this||this.children.some(c=>c.contains(node));}
 closest(selector){let n=this;while(n){if(selector==="[data-khae-header]"&&n.attrs.has("data-khae-header"))return n;
 if(selector==="[data-khae-actions]"&&n.attrs.has("data-khae-actions"))return n;
 if(selector==="a[data-high-profile-resolved]"&&n.tagName==="A"&&n.dataset.highProfileResolved)return n;n=n.parentNode;}return null;}
 querySelector(query){
  if(query==="a")return this.walk().find(e=>e.tagName==="A")||null;
  if(query==="button,summary,[aria-haspopup],.vnv-eco-icon-only")return this.walk().find(e=>e.tagName==="BUTTON")||null;
  if(query==="details,button[aria-expanded][aria-controls],.hamburger")return this.walk().find(e=>e.tagName==="DETAILS")||null;
  return null;
 }
}
const root="https://academy.example/Khaemenes_High.github.io/";
function boot({learner="one",grade=9,canonical=false,slot=true,relative="courses/science/index.html"}={}){
 const store=new Map(),events=new Map(),hostEvents=new Map();
 store.set("khaemenes_active_learner_v1",JSON.stringify(learner));
 store.set("khaemenes_family_registry_v1",JSON.stringify({learners:{[learner]:{learnerId:learner,grade}}}));
 const body=new Element("body"),head=new Element("head"),header=new Element("header"),main=new Element("main"),section=new Element("section");
 header.setAttribute("data-khae-header","");body.append(header,main);main.appendChild(section);
 const actions=new Element("div");actions.setAttribute("data-khae-actions","");header.appendChild(actions);
 const profile=new Element("a");profile.textContent="Student Profile";profile.href="https://vervenveda.com/Khaemenes_Academy.github.io/student/";actions.appendChild(profile);
 const family=new Element("a");family.textContent="Family";family.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";actions.appendChild(family);
 const study=new Element("a");study.textContent="Academy Learning Profile";study.href="https://vervenveda.com/Khaemenes_Academy.github.io/student/profile.html";actions.appendChild(study);
 const ecosystem=new Element("div");if(slot){ecosystem.setAttribute("data-vnv-ecosystem-slot","");header.appendChild(ecosystem);}
 if(canonical){const button=new Element("button");button.id="vnvEcosystemMenuButton";ecosystem.appendChild(button);}
 const doc={
 currentScript:{src:root+"assets/high-navigation-v1.js"},readyState:"loading",body,head,
 createElement:tag=>new Element(tag),
 addEventListener:(name,fn)=>events.set(name,fn),
 getElementById:id=>[body,...body.walk()].find(e=>e.id===id)||null,
 querySelectorAll:q=>q==="a"?body.walk().filter(e=>e.tagName==="A"):q==="[data-vnv-ecosystem-slot]"?(slot?[ecosystem]:[]):[],
 querySelector:q=>{
  if(q==="main,[role=main]")return main;if(q==="header")return header;
  if(q.startsWith("a[href="))return body.walk().find(e=>e.tagName==="A"&&e.href==="#main")||null;
  if(q.startsWith('[aria-label="Breadcrumb"'))return body.walk().find(e=>e.id==="highNavigationBreadcrumbs")||null;
  return null;
 }};
 const window={addEventListener:(name,fn)=>hostEvents.set(name,fn)};
 const context=vm.createContext({document:doc,window,localStorage:{getItem:k=>store.get(k)||null},URL,console,
  location:{pathname:new URL(relative,root).pathname}});
 vm.runInContext(source,context,{timeout:1200});
 events.get("DOMContentLoaded")();
 return {body,header,main,section,profile,family,study,doc,events,hostEvents,store,window,ecosystem};
}
const a=boot();
assert.ok(a.profile.href.endsWith("/grades/grade-09/student-profile/"),"grade-aware profile");
assert.ok(a.family.href.endsWith("/family/"),"family untouched");
assert.ok(a.study.href.endsWith("/student/profile.html"),"profile editor untouched");
assert.ok(a.main.children.includes(a.section),"original lesson material intact");
const nav=a.doc.getElementById("highNavigationBreadcrumbs");
assert.ok(nav&&nav.attrs.get("aria-label")==="Breadcrumb","science breadcrumbs visible");
assert.equal(nav.children[0].children.length,3,"High School, Courses, Science");
assert.ok(a.body.walk().some(e=>e.tagName==="A"&&e.href==="#main"),"skip link inserted");
const button=a.doc.getElementById("khaeLocalEcosystemToggle");
const panel=a.doc.getElementById("khaeLocalEcosystemPanel");
assert.ok(button&&panel&&panel.hidden,"fallback initially collapsed");
button.handlers.get("click")();
assert.equal(panel.hidden,false);assert.equal(button.attrs.get("aria-expanded"),"true");
assert.ok(panel.querySelector("a").focused,"opening menu focuses first link");
a.events.get("keydown")({key:"Escape"});
assert.equal(panel.hidden,true);assert.ok(button.focused,"Escape restores focus");
button.handlers.get("click")();assert.equal(panel.hidden,false);
a.events.get("click")({target:a.family});
assert.equal(panel.hidden,true,"outside click dismisses menu");
assert.ok(a.body.walk().filter(e=>e.id==="khaeLocalEcosystemToggle").length===1,"one hamburger");
a.window.KhaemenesHighNavigation.init();
assert.ok(a.body.walk().filter(e=>e.id==="khaeLocalEcosystemToggle").length===1,"idempotent menu");
a.store.set("khaemenes_active_learner_v1",JSON.stringify("two"));
a.store.set("khaemenes_family_registry_v1",JSON.stringify({learners:{two:{learnerId:"two",grade:12}}}));
a.hostEvents.get("pageshow")();
assert.ok(a.profile.href.endsWith("/grades/grade-12/student-profile/"),"browser Back resolves new learner");
a.store.set("khaemenes_active_learner_v1",JSON.stringify("absent"));
a.hostEvents.get("storage")({key:"khaemenes_active_learner_v1"});
assert.ok(a.profile.href.endsWith("/index.html#student-portal"),"unknown learner safe doorway");
const b=boot({canonical:true});
assert.ok(!b.doc.getElementById("khaeLocalEcosystemToggle"),"no duplicate canonical ecosystem menu");
const c=boot({slot:false,relative:"courses/mathematics/algebra-2/index.html"});
assert.ok(c.doc.getElementById("khaeLocalEcosystemToggle"),"menu available when global slot absent");
assert.ok(c.doc.getElementById("khaeLocalEcosystemToggle").parentNode.className.includes("high-nav-menu-fixed"));
console.log("PASS: local menu keyboard/open/close/outside/focus, canonical compatibility, two learners, browser Back, safe fallback, breadcrumbs and original links intact.");
