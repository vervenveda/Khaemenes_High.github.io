import fs from "node:fs";
import path from "node:path";

/*
 * Khaemenes Mathematics Engine guarded lesson-shell contract.
 * Static inspection only: no learner storage, DOM mutation, or assessment execution.
 * The established 01–13 unit workload counts are release baselines, not invented
 * substitutes for course-specific scoring and teaching architecture.
 */
const root=process.cwd();
const mathRoot=path.join(root,"courses/mathematics");
const baseline=Object.freeze({
  "pre-algebra":{lessons:97,adapter:"prealgebra-math-lesson-v2-adapter.js"},
  "algebra-1":{lessons:87,adapter:"algebra1-math-lesson-v2-adapter.js"},
  "geometry":{lessons:90,adapter:"geometry-math-lesson-v2-adapter.js"},
  "algebra-2":{lessons:92,adapter:"algebra2-math-lesson-v2-adapter.js",rollout:"pending"}
});
const protectedRoute=/(^|\/)(assessment|assessments|diagnostic|diagnostics|midterm|midterms|final|finals)(\/|$)/i;
const standardLesson=/^units\/unit-(?:0[1-9]|1[0-3])\/lessons\/[^/]+\.html$/i;
const adapterPattern=/[-\w]+-math-lesson-v2-adapter\.js/gi;
const failures=[],report=[];

function walk(dir){
  if(!fs.existsSync(dir))return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    const full=path.join(dir,e.name);
    return e.isDirectory()?walk(full):e.isFile()?[full]:[];
  });
}
function isStandard(course,rel){
  if(!standardLesson.test(rel))return false;
  const name=path.posix.basename(rel);
  // Preview is a separate shell: the original 97-lesson baseline excludes it.
  if(course==="pre-algebra")return /^lesson-\d{2}-.+\.html$/i.test(name)&&!/-engine-preview\.html$/i.test(name);
  if(course==="algebra-1")return /^lesson-\d{2}-.+\.html$/i.test(name);
  return /^u\d{2}-l\d{2}\.html$/i.test(name);
}
if(!fs.existsSync(mathRoot))failures.push("Mathematics course root missing");
const courses=fs.existsSync(mathRoot)?fs.readdirSync(mathRoot,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name):[];
for(const [course,expected] of Object.entries(baseline)){
  if(!courses.includes(course)){
    failures.push(course+": course root missing");
    continue;
  }
  const courseRoot=path.join(mathRoot,course);
  const adapterPath=path.join(courseRoot,"assets",expected.adapter);
  if(!fs.existsSync(adapterPath)){
    failures.push(course+": canonical adapter missing: "+expected.adapter);
    continue;
  }
  const adapter=fs.readFileSync(adapterPath,"utf8");
  const match=adapter.match(/const VERSION=["']([^"']+)["']/);
  if(!match){failures.push(course+": internal VERSION missing");continue}
  const version=match[1];
  const files=walk(courseRoot).filter(x=>x.endsWith(".html"));
  let adopted=0,protectedHits=0,missing=0;
  const standard=files.filter(file=>isStandard(course,path.relative(courseRoot,file).split(path.sep).join("/")));
  if(standard.length!==expected.lessons)
    failures.push(course+": course lesson inventory changed: "+standard.length+" (approved baseline "+expected.lessons+"); review syllabus before accepting a new count");
  for(const file of files){
    const rel=path.relative(courseRoot,file).split(path.sep).join("/");
    const html=fs.readFileSync(file,"utf8");
    const names=[...html.matchAll(adapterPattern)].map(m=>m[0]);
    const localCount=names.filter(name=>name===expected.adapter).length;
    if(protectedRoute.test(rel)){
      if(names.length){protectedHits+=names.length;failures.push(course+": lesson adapter on protected assessment route: "+rel)}
      continue;
    }
    if(!isStandard(course,rel))continue;
    if(localCount!==1){
      if(localCount===0)missing++;
      if(expected.rollout!=="pending" || localCount>1)
        failures.push(course+": "+rel+" requires exactly one "+expected.adapter+" (found "+localCount+")");
    }else{
      adopted++;
      const escaped=expected.adapter.replace(/[.*+?^\x24{}()|[\]\\]/g,"\\$&");
      const script=new RegExp("<script\\b[^>]*\\bsrc=[\\\"'][^\\\"']*"+escaped+"\\?v="+version.replace(/\./g,"\\.")+"(?:[\\\"'&#]|$)","i");
      if(!script.test(html))failures.push(course+": stale or absent versioned script source on "+rel+" (expected ?v="+version+")");
    }
    if(names.some(name=>name!==expected.adapter))
      failures.push(course+": foreign lesson engine adapter found: "+rel);
  }
  if(expected.rollout==="pending"){
    if(adopted!==0)failures.push(course+": partial adapter rollout "+adopted+"/"+expected.lessons+"; perform representative lesson acceptance and authorize atomic rollout before certification");
  }else if(adopted!==expected.lessons)failures.push(course+": adopted lessons "+adopted+" / "+expected.lessons);
  report.push({course,rollout:expected.rollout||"certified-source",version,expected:expected.lessons,standard:standard.length,adopted,missing,protectedHits});
}
// Future course adapters cannot be silently introduced without an explicit
// approved syllabus inventory and assessment-firewall release review.
for(const course of courses){
  if(baseline[course])continue;
  const assets=path.join(mathRoot,course,"assets");
  if(fs.existsSync(assets)){
    const found=fs.readdirSync(assets).filter(x=>/-math-lesson-v2-adapter\.js$/.test(x));
    if(found.length)failures.push(course+": new adapter detected ("+found.join(", ")+"); add reviewed course baseline");
  }
}
console.table(report);
if(failures.length){
  console.error("\nMathematics Engine integrity FAIL ("+failures.length+" issue(s))");
  for(const msg of failures)console.error(" - "+msg);
  process.exitCode=1;
}else console.log("\nMathematics Engine integrity PASS for certified course rollouts. Algebra II is explicitly pending (0/92), not certified.");
