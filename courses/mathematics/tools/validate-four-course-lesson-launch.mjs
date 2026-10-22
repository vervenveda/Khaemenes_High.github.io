import fs from "node:fs";
import path from "node:path";

const repoRoot=path.resolve(".");
const mathRoot=path.resolve("courses/mathematics");
let failures=0;
const totals={};

function ok(condition,message){
  if(condition)console.log("OK "+message);
  else{console.error("FAIL "+message);failures++}
}
function exists(file){return fs.existsSync(file)}
function read(file){return fs.readFileSync(file,"utf8")}
function json(file){return JSON.parse(read(file))}
function cleanRef(value){return String(value||"").split(/[?#]/)[0]}
function parseWindowJson(file,globalName){
  const raw=read(file),prefix=`window.${globalName}=`,start=raw.indexOf(prefix);
  if(start<0)throw new Error(file+" missing "+prefix);
  const payload=raw.slice(start+prefix.length).trim().replace(/;\s*$/,"");
  return JSON.parse(payload);
}
function localScriptDependencies(htmlFile){
  const html=read(htmlFile),missing=[];
  for(const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)){
    const ref=cleanRef(match[1]);
    if(!ref||/^(?:https?:)?\/\//i.test(ref)||ref.startsWith("data:"))continue;
    const target=ref.startsWith("/")
      ? path.join(repoRoot,ref.replace(/^\/+/,""))
      : path.resolve(path.dirname(htmlFile),ref);
    if(!exists(target))missing.push(match[1]);
  }
  return missing;
}
function validateHtml(file,label){
  ok(exists(file),label+" exists");
  if(!exists(file))return false;
  const html=read(file);
  ok(/<!doctype\s+html|<html\b/i.test(html),label+" is a renderable HTML document");
  ok(html.length>300,label+" is not an empty placeholder");
  const missing=localScriptDependencies(file);
  ok(missing.length===0,label+" local script dependencies exist"+(missing.length?" · "+missing.join(", "):""));
  return true;
}
function resolveLessonEntry(unitRoot,entry,map){
  const target=entry?.file||entry?.path||"";
  if(!target)return {kind:"missing",target:""};
  const ext=path.extname(cleanRef(target)).toLowerCase();
  if(ext===".html")return {kind:"html",target:path.join(unitRoot,cleanRef(target))};
  if(ext===".json"){
    const reader=entry.reader||map.lesson_reader||map.reader||map.lessonReader||"";
    return {kind:"json",target:path.join(unitRoot,cleanRef(target)),reader};
  }
  return {kind:"unsupported",target:path.join(unitRoot,cleanRef(target))};
}
function validateMappedCourse(slug,label){
  const courseRoot=path.join(mathRoot,slug);
  const unitsRoot=path.join(courseRoot,"units");
  const dirs=fs.readdirSync(unitsRoot,{withFileTypes:true})
    .filter(d=>d.isDirectory()&&/^unit-\d{2}$/.test(d.name))
    .map(d=>d.name).sort();
  let htmlLessons=0,jsonLessons=0;
  ok(dirs.length>0,label+" unit directories discovered");
  for(const dir of dirs){
    const unitRoot=path.join(unitsRoot,dir),mapFile=path.join(unitRoot,"unit-map.json");
    ok(exists(mapFile),label+" "+dir+" navigation JSON exists");
    if(!exists(mapFile))continue;
    let map;
    try{map=json(mapFile);ok(true,label+" "+dir+" navigation JSON parses")}
    catch(error){ok(false,label+" "+dir+" navigation JSON parses: "+error.message);continue}
    const lessons=Array.isArray(map.lessons)?map.lessons:[];
    ok(lessons.length>0,label+" "+dir+" exposes mapped lessons");
    for(const entry of lessons){
      const id=entry.id||entry.number||entry.title||"unknown";
      const route=resolveLessonEntry(unitRoot,entry,map);
      if(route.kind==="html"){
        htmlLessons++;
        validateHtml(route.target,label+" "+dir+" lesson "+id);
      }else if(route.kind==="json"){
        jsonLessons++;
        ok(exists(route.target),label+" "+dir+" JSON lesson "+id+" exists");
        ok(Boolean(route.reader),label+" "+dir+" JSON lesson "+id+" declares a reader instead of opening raw JSON");
        if(route.reader){
          const reader=path.resolve(unitRoot,cleanRef(route.reader));
          ok(exists(reader),label+" "+dir+" JSON lesson "+id+" reader exists");
        }
      }else{
        ok(false,label+" "+dir+" lesson "+id+" has a supported .html or reader-backed .json route");
      }
    }
  }
  totals[slug]={htmlLessons,jsonLessons,units:dirs.length};
}
function validateIdDrivenCourse(slug,label,globalName,{requireUnitMapIds=false,requireMapPaths=false}={}){
  const courseRoot=path.join(mathRoot,slug);
  const data=parseWindowJson(path.join(courseRoot,"course-data.js"),globalName);
  const app=read(path.join(courseRoot,"assets/app.js"));
  ok(/units\/unit-\$\{String\([^)]*\.unit|units\/unit-\$\{String\(u\.number/.test(app)||app.includes('/lessons/${id}.html')||app.includes('/lessons/${lesson.id}.html'),label+" app contains dynamic HTML lesson routing");
  let htmlLessons=0,jsonLessons=0;
  const known=new Set();
  for(const unit of data.units||[]){
    const unitId=String(unit.number).padStart(2,"0"),unitRoot=path.join(courseRoot,"units","unit-"+unitId);
    const mapFile=path.join(unitRoot,"unit-map.json");
    ok(exists(mapFile),label+" Unit "+unitId+" navigation JSON exists");
    let map=null;
    if(exists(mapFile)){
      try{map=json(mapFile);ok(true,label+" Unit "+unitId+" navigation JSON parses")}
      catch(error){ok(false,label+" Unit "+unitId+" navigation JSON parses: "+error.message)}
    }
    const lessons=Array.isArray(unit.lessons)?unit.lessons:[];
    ok(lessons.length>0,label+" Unit "+unitId+" course data exposes lessons");
    if(requireUnitMapIds&&map){
      const ids=Array.isArray(map.lesson_ids)?map.lesson_ids:[];
      ok(ids.length===lessons.length,label+" Unit "+unitId+" map/course lesson counts agree");
      for(const lesson of lessons)ok(ids.includes(lesson.id),label+" Unit "+unitId+" map includes "+lesson.id);
    }
    const mapById=new Map((Array.isArray(map?.lessons)?map.lessons:[]).map(item=>[item.id,item]));
    for(const lesson of lessons){
      known.add(lesson.id);
      let route=null;
      const mapped=mapById.get(lesson.id);
      if(requireMapPaths&&mapped){
        route=resolveLessonEntry(unitRoot,mapped,map);
      }else{
        route={kind:"html",target:path.join(unitRoot,"lessons",lesson.id+".html")};
      }
      if(route.kind==="html"){
        htmlLessons++;
        validateHtml(route.target,label+" Unit "+unitId+" lesson "+lesson.id);
      }else if(route.kind==="json"){
        jsonLessons++;
        ok(exists(route.target),label+" Unit "+unitId+" JSON lesson "+lesson.id+" exists");
        ok(Boolean(route.reader),label+" Unit "+unitId+" JSON lesson "+lesson.id+" declares a reader");
        if(route.reader)ok(exists(path.resolve(unitRoot,cleanRef(route.reader))),label+" Unit "+unitId+" JSON lesson "+lesson.id+" reader exists");
      }else{
        ok(false,label+" Unit "+unitId+" lesson "+lesson.id+" has a supported launch route");
      }
    }
  }
  for(const week of data.weeks||[]){
    for(const id of Array.isArray(week.lesson_ids)?week.lesson_ids:[]){
      ok(known.has(id),label+" Week "+week.week+" references known lesson "+id);
      if(week.unit){
        const target=path.join(courseRoot,"units","unit-"+String(week.unit).padStart(2,"0"),"lessons",id+".html");
        ok(exists(target),label+" Week "+week.week+" launch target exists for "+id);
      }
    }
  }
  totals[slug]={htmlLessons,jsonLessons,units:(data.units||[]).length};
}

console.log("\n=== GRADE 9 / PRE-ALGEBRA ===");
validateMappedCourse("pre-algebra","Pre-Algebra");

console.log("\n=== GRADE 10 / ALGEBRA I ===");
validateMappedCourse("algebra-1","Algebra I");

console.log("\n=== GRADE 11 / GEOMETRY ===");
validateIdDrivenCourse("geometry","Geometry","GEOMETRY_DATA",{requireUnitMapIds:true});

console.log("\n=== GRADE 12 / ALGEBRA II ===");
validateIdDrivenCourse("algebra-2","Algebra II","ALGEBRA2_DATA",{requireMapPaths:true});

console.log("\n=== FORMAT SUMMARY ===");
for(const [course,count] of Object.entries(totals)){
  console.log(`${course}: ${count.units} units · ${count.htmlLessons} HTML lesson launches · ${count.jsonLessons} reader-backed JSON lesson launches`);
  ok(count.htmlLessons+count.jsonLessons>0,course+" exposes launchable lesson documents");
}
ok(Object.values(totals).every(x=>x.jsonLessons===0||x.jsonLessons>0),"JSON lesson files, if introduced, require an explicit reader contract");

if(failures){
  console.error("\nHIGH SCHOOL MATH LESSON LAUNCH VALIDATION FAILED: "+failures+" problem(s).");
  process.exit(1);
}
console.log("\nPASS High School Mathematics: Grades 9–12 lesson metadata resolve to renderable student lesson routes.");
