import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";

const base="courses/mathematics";
const code=fs.readFileSync("courses/shared/math-lesson-vocabulary-link.js","utf8");
const scope=fs.readFileSync("courses/shared/learner-scope-v1.js","utf8");
new vm.Script(code);
new vm.Script(scope);
assert(scope.includes('new URL("./math-lesson-vocabulary-link.js",current.src)'));
assert(scope.includes('typeof location==="undefined"'));

function scan(dir){
 const result=[];
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,ent.name);
  if(ent.isDirectory())result.push(...scan(full));
  else if(ent.name.endsWith(".html"))result.push(full);
 }
 return result;
}
const courses={"pre-algebra":103,"algebra-1":87,"geometry":90,"algebra-2":92};
let count=0;
for(const [course,minimum] of Object.entries(courses)){
 const paths=scan(base+"/"+course+"/units").filter(p=>/[/\\]unit-\d{2}[/\\]lessons[/\\][^/\\]+\.html$/.test(p));
 assert(paths.length>=minimum,"Lesson inventory "+course);
 for(const file of paths){
  const html=fs.readFileSync(file,"utf8");
  assert(html.includes("shared/learner-scope-v1.js"),"Missing bootstrap on "+file);
  const unit=file.match(/[/\\]unit-(\d{2})[/\\]lessons[/\\]/)?.[1];
  assert(unit,"Missing unit "+file);
  const json=base+"/"+course+"/units/unit-"+unit+"/vocabulary.json";
  assert(fs.existsSync(json),"Missing vocabulary "+json);
  assert(JSON.parse(fs.readFileSync(json,"utf8")).terms.length>0,"Empty "+json);
  count++;
 }
}
assert(count>=372);
const bridge=JSON.parse(fs.readFileSync(base+"/pre-algebra/units/unit-00/vocabulary.json","utf8"));
assert.equal(bridge.terms.length,32);
for(const term of bridge.terms){
 for(const k of ["en","definition","es","fr","ar","pt"])
  assert(typeof term[k]==="string"&&term[k].trim(),"Missing "+k);
}
function exercise(course,unit,delayed=false){
 const href="https://vervenveda.github.io/Khaemenes_High.github.io/courses/mathematics/"+
  course+"/units/unit-"+unit+"/lessons/example.html";
 const location=new URL(href);
 const registry=new Map();
 let created=null,observer=null,visible=!delayed;
 function el(tag){
  return {tag,children:[],attributes:{},append(...parts){this.children.push(...parts)},
   appendChild(child){this.children.push(child);if(child.id)registry.set(child.id,child);
     if(tag==="host"&&child.tag==="a")created=child;return child;},
   setAttribute(k,v){this.attributes[k]=v}};
 }
 const host=el("host");
 const main={querySelector(selector){
  if(!visible)return null;
  if(course==="algebra-1"&&selector.includes(".hero"))return host;
  if(course==="geometry"&&selector.includes(".lesson-sidebar"))return host;
  if(course==="algebra-2"&&selector.includes(".lesson-hero"))return host;
  return null;
 }};
 const document={
  readyState:"complete",
  head:{appendChild(item){if(item.id)registry.set(item.id,item)}},
  createElement:el,
  createTextNode(text){return {textContent:text}},
  getElementById(id){return registry.get(id)||null},
  querySelector(selector){
   if(selector==="main")return main;
   if(course==="pre-algebra"&&unit!=="00"&&selector===".site-header .header-actions")return host;
   if(course==="pre-algebra"&&unit==="00"&&selector==="header .actions")return host;
   if(course==="geometry"&&selector===".site-header .header-tools")return host;
   if(course==="algebra-2"&&selector===".site-header .header-tools")return host;
   return null;
  }
 };
 class MutationObserver{
  constructor(callback){observer=callback}
  observe(node,opts){assert(node===main&&opts.childList)}
  disconnect(){observer=null}
 }
 vm.runInNewContext(code,{document,location,URL,URLSearchParams,MutationObserver},{timeout:1000});
 if(delayed){assert(!created);assert(observer,"No delayed lesson observer");visible=true;observer()}
 assert(created,"No vocabulary anchor "+course+" "+unit);
 const parsed=new URL(created.href);
 assert(parsed.pathname.endsWith("/courses/mathematics/tools/vocabulary-studio.html"));
 assert.equal(parsed.searchParams.get("course"),course);
 assert.equal(parsed.searchParams.get("unit"),unit);
 assert.equal(created.target,"_blank");
 assert(created.rel.includes("noopener"));
 assert(created.attributes["aria-label"].includes("new tab"));
}
exercise("pre-algebra","00");
exercise("pre-algebra","01");
exercise("pre-algebra","13");
exercise("algebra-1","01",true);
exercise("algebra-1","13");
exercise("geometry","01");
exercise("geometry","13");
exercise("algebra-2","01");
exercise("algebra-2","13");
const studio=fs.readFileSync(base+"/tools/vocabulary-studio.html","utf8");
assert(studio.includes('unit00.hidden=unit00.disabled=course.value!=="pre-algebra"'));
console.log("PASS: "+count+" lesson pages, complete unit dictionaries, 32 bridge terms, correct Studio routing, and delayed Algebra I rendering.");
