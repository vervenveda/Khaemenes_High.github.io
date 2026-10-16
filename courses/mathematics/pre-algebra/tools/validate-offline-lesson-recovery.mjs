import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const source=fs.readFileSync("courses/mathematics/pre-algebra/service-worker.js","utf8");
new vm.Script(source);
assert(!/localStorage|sessionStorage/.test(source),"Offline worker must never manipulate student records");
const scope="https://academy.example/Khaemenes_High.github.io/courses/mathematics/pre-algebra/";
const external="https://another.example/resource.js";
const exact=x=>new URL(typeof x==="string"?x:x.url,scope).href;
const pathOnly=x=>{const u=new URL(exact(x));return u.origin+u.pathname};
function reply(label,status=200){
 return {label,status,ok:status>=200&&status<300,type:"basic",
  clone(){return reply(label,status)}};
}
class Request {
 constructor(input,opts={}){
  this.url=exact(input);
  this.method=opts.method||"GET";
  this.mode=opts.mode||"same-origin";
 }
}
const handlers={},buckets=new Map(),deleted=[],served=[];
const bucket=name=>{
 if(!buckets.has(name)){
  const contents=new Map();
  buckets.set(name,{
   contents,
   async addAll(items){for(const item of items)contents.set(exact(item),reply("precache:"+exact(item)))},
   async add(item){contents.set(exact(item),reply("precache:"+exact(item)))},
   async put(item,response){contents.set(exact(item),response)},
   async match(item,opts={}){
    const url=exact(item);
    if(contents.has(url))return contents.get(url);
    if(opts.ignoreSearch){const key=pathOnly(item);for(const [stored,value] of contents)if(pathOnly(stored)===key)return value}
    return undefined;
   }
  });
 }
 return buckets.get(name);
};
let offline=false;
const self={
 location:{origin:new URL(scope).origin},
 registration:{scope},
 addEventListener(n,fn){handlers[n]=fn},
 skipWaiting:async()=>{},
 clients:{claim:async()=>{}}
};
const caches={
 open:async name=>bucket(name),
 keys:async()=>[...buckets.keys()],
 delete:async name=>{deleted.push(name);return buckets.delete(name)}
};
const fetch=async request=>{
 served.push(exact(request));
 if(offline)throw new Error("simulated offline network");
 return request.url.includes("server-404")?reply("not-found",404):reply("network:"+exact(request));
};
const ctx=vm.createContext({self,Request,Response:{error:()=>reply("error",0)},URL,fetch,caches,console});
vm.runInContext(source,ctx);
let promise;
handlers.install({waitUntil(p){promise=p}});
await promise;
const name=vm.runInContext("CACHE_NAME",ctx);
assert(name.startsWith("khaemenes-prealgebra-core-"));
const cache=bucket(name);
assert(cache.contents.has(exact("./offline.html")));
assert(cache.contents.has(exact("./units/unit-02/projects/signed-data-investigation.html")));
const old="khaemenes-prealgebra-core-prior";
bucket(old);bucket("unrelated-course-records");
handlers.activate({waitUntil(p){promise=p}});await promise;
assert(deleted.includes(old)&&!deleted.includes("unrelated-course-records"));
assert(buckets.has(name),"Active course release must survive activation");

async function request(url,{mode="navigate",method="GET"}={}){
 let result;
 handlers.fetch({request:new Request(url,{mode,method}),respondWith(p){result=p}});
 return result?await result:null;
}
const lesson="./units/unit-07/lessons/lesson-01-example.html";
const first=await request(lesson);
assert.equal(first.label,"network:"+exact(lesson));
assert.equal(cache.contents.get(exact(lesson))?.label,first.label,
 "Successfully visited lesson should be cached.");
offline=true;
const second=await request(lesson);
assert.equal(second.label,first.label,"Visited lesson should work offline");
const withParams=await request(lesson+"?mode=review");
assert.equal(withParams.label,first.label,"Offline matching must ignore harmless navigation search parameters");
const absent=await request("./units/unit-13/lessons/not-visited.html");
assert.equal(absent.label,"precache:"+exact("./offline.html"),"Unvisited lesson requires the honest offline page");
offline=false;
const notFound=await request("./server-404.html");
assert.equal(notFound.status,404);
assert(!cache.contents.has(exact("./server-404.html")),"HTTP errors must never be cached");
const assessment="./units/unit-07/assessment/mastery-check.html";
const fetchedAssessment=await request(assessment);
assert.equal(fetchedAssessment.label,"network:"+exact(assessment));
assert(!cache.contents.has(exact(assessment)),"Official assessments must remain online/on-demand");
const asset="./units/unit-07/assets/lesson-engine-core.js";
const loaded=await request(asset,{mode:"same-origin"});
assert.equal(loaded.label,"network:"+exact(asset));
offline=true;
const backed=await request(asset+"?v=1",{mode:"same-origin"});
assert.equal(backed.label,loaded.label,"Previously used course assets should remain available offline");
const unavailableAssessment=await request(assessment);
assert.equal(unavailableAssessment.label,"precache:"+exact("./offline.html"),"Uncached official assessment must use honest offline guidance");
const outside=await request(external,{mode:"same-origin"});
assert.equal(outside,null,"Cross-origin requests must not be intercepted");
const otherCourse=await request("../algebra-1/units/unit-01/lessons/lesson-01.html");
assert.equal(otherCourse,null,"Worker must not capture other course navigation");

for(const rel of vm.runInContext("MISSION_CRITICAL",ctx)){
 const clean=path.normalize(path.join(pre,rel));
 assert(fs.existsSync(clean),"Mission-critical Pre-Algebra asset missing: "+clean);
}
console.log("PASS: Pre-Algebra cached visited lessons and assets, offline query recovery, honest fallback, 404 exclusion, release ownership, and course isolation.");
