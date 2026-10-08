import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT=process.cwd();
const registryPath="courses/mathematics/assets/learning-games/game-registry.json";
const errors=[];
let canonicalCount=0,placementCount=0,higherCount=0,legacyCount=0,scriptCount=0,localRefCount=0;

const read=(p)=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=(p)=>fs.existsSync(path.join(ROOT,p));
const registry=JSON.parse(read(registryPath));

function normLesson(value){
  const s=String(value);
  const m=s.match(/(?:u\d+-l)?(\d+)$/i);
  return String(Number(m?m[1]:s)).padStart(2,"0");
}

function resolvePlacement(p){
  const unit=String(p.unit).padStart(2,"0");
  const lesson=normLesson(p.lesson);
  if(p.course==="geometry") return "courses/mathematics/geometry/units/unit-"+unit+"/lessons/u"+unit+"-l"+lesson+".html";
  if(p.course==="algebra-2") return "courses/mathematics/algebra-2/units/unit-"+unit+"/lessons/u"+unit+"-l"+lesson+".html";
  if(p.course==="pre-algebra" || p.course==="algebra-1"){
    const root="courses/mathematics/"+p.course+"/units/unit-"+unit;
    const mapPath=root+"/unit-map.json";
    if(!exists(mapPath)){errors.push("missing unit map: "+mapPath);return null}
    const map=JSON.parse(read(mapPath));
    const lessons=map.lessons||[];
    const match=lessons.find((x,i)=>{
      const id=String(x.id||"").toLowerCase();
      const n=String(x.number??i+1).padStart(2,"0");
      return id==="l"+lesson || id==="u"+unit+"-l"+lesson || n===lesson;
    });
    if(!match){errors.push("cannot resolve "+p.course+" U"+unit+"-L"+lesson);return null}
    const file=match.file||match.path;
    if(!file){errors.push("resolved lesson has no file: "+p.course+" U"+unit+"-L"+lesson);return null}
    return root+"/"+file;
  }
  errors.push("unsupported course in registry: "+p.course);
  return null;
}

function resolveLocal(from,ref){
  if(!ref || /^(?:https?:|#|mailto:|tel:|data:|javascript:)/i.test(ref)) return null;
  const clean=ref.split("?")[0].split("#")[0];
  if(!clean) return null;
  return path.posix.normalize(path.posix.join(path.posix.dirname(from),clean));
}

for(const [slug,game] of Object.entries(registry.games||{})){
  canonicalCount++;
  if(!game.canonical_path || !exists(game.canonical_path)){
    errors.push(slug+": missing canonical file "+(game.canonical_path||"(unset)"));
    continue;
  }
  const html=read(game.canonical_path);

  let inlineIndex=0;
  for(const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(!m[1].trim()) continue;
    inlineIndex++;
    scriptCount++;
    try{new vm.Script(m[1],{filename:game.canonical_path+"#inline-"+inlineIndex})}
    catch(err){errors.push(slug+": inline JavaScript syntax: "+err.message)}
  }

  for(const m of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)){
    const target=resolveLocal(game.canonical_path,m[1]);
    if(!target) continue;
    localRefCount++;
    if(!exists(target) && !exists(path.posix.join(target,"index.html"))){
      errors.push(slug+": broken local reference "+m[1]+" -> "+target);
    }
  }

  for(const legacy of game.legacy_paths||[]){
    legacyCount++;
    if(!exists(legacy)) errors.push(slug+": missing retained legacy rollback path "+legacy);
  }

  for(const p of game.placements||[]){
    placementCount++;
    if(p.wired!==true) errors.push(slug+": placement not marked wired: "+p.course+" U"+p.unit+" L"+p.lesson);
    const lessonPath=resolvePlacement(p);
    if(!lessonPath || !exists(lessonPath)){
      errors.push(slug+": missing placement lesson "+(lessonPath||"(unresolved)"));
      continue;
    }

    if(p.course==="pre-algebra"){
      const unit=String(p.unit).padStart(2,"0");
      const lesson=normLesson(p.lesson);
      const enginePath="courses/mathematics/pre-algebra/units/unit-"+unit+"/assets/lesson-engine.js";
      if(!exists(enginePath)){errors.push(slug+": missing Pre-Algebra engine "+enginePath);continue}
      const engine=read(enginePath);
      const start=engine.indexOf("l"+lesson+":");
      const nextLesson=String(Number(lesson)+1).padStart(2,"0");
      const next=engine.indexOf("l"+nextLesson+":",start+1);
      const block=start>=0?engine.slice(start,next>=0?next:Math.min(engine.length,start+2600)):"";
      if(start<0) errors.push(slug+": Pre-Algebra engine missing l"+lesson);
      if(!block.includes('sharedGame:"'+slug+'"')) errors.push(slug+": Pre-Algebra l"+lesson+" does not map to sharedGame");
    }else{
      higherCount++;
      const lessonHtml=read(lessonPath);
      if(!lessonHtml.includes("shared-game-launcher.js")) errors.push(slug+": launcher missing in "+lessonPath);
      if(!lessonHtml.includes('data-game="'+slug+'"')) errors.push(slug+": game id missing in "+lessonPath);
      if(p.mode && !lessonHtml.includes('data-mode="'+p.mode+'"')) errors.push(slug+": mode "+p.mode+" missing in "+lessonPath);
    }
  }
}

if(errors.length){
  console.error(errors.map(x=>"ERROR: "+x).join("\n"));
  process.exit(1);
}
console.log("PASS: "+canonicalCount+" canonical shared games");
console.log("PASS: "+placementCount+" registry placements ("+higherCount+" higher-course placements)");
console.log("PASS: "+legacyCount+" retained legacy rollback paths");
console.log("PASS: "+scriptCount+" inline JavaScript blocks parse");
console.log("PASS: "+localRefCount+" canonical local references resolve");
