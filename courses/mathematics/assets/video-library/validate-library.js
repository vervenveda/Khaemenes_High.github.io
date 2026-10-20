#!/usr/bin/env node
/**
 * Khaemenes Academy: validate the EXISTING mathematics video JSON conventions.
 * Node built-ins only. Usage (from repository root):
 *   node courses/mathematics/assets/video-library/validate-library.js
 * Checks format/references without rewriting any JSON or changing lesson state.
 */
"use strict";
const fs=require("node:fs"),path=require("node:path");
const library=__dirname,math=path.resolve(library,"../..");
const courses=["pre-algebra","algebra-1","algebra-2","geometry","precalculus-trigonometry","calculus-1"];
let checked=0,warnings=0,errors=0;const coverage={};const strict=process.argv.includes("--strict");
const fail=s=>{console.error("ERROR:",s);errors++};
const warn=s=>{console.warn("WARN:",s);warnings++};
const json=p=>{try{return JSON.parse(fs.readFileSync(p,"utf8"))}catch(e){fail("Invalid JSON "+p+": "+e.message);return null}};
const assetIds=new Map();
for(const filename of fs.readdirSync(library).filter(x=>x.endsWith(".json")&&x!=="instructor-index.json")){
 const full=path.join(library,filename),d=json(full);if(!d)continue;checked++;
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(filename))fail("Noncanonical lowercase kebab-case filename: "+filename);
 if(d.schema_version!=="1.1")warn(filename+" uses shared schema "+String(d.schema_version)+" (expected 1.1)");
 if(!/^MATH-[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(d.asset_id||""))fail(filename+" invalid MATH-* asset_id");
 if(assetIds.has(d.asset_id))fail("Duplicate asset_id "+d.asset_id+": "+filename+" and "+assetIds.get(d.asset_id));
 assetIds.set(d.asset_id,filename);
 if(d.provider!=="youtube")warn(filename+" provider is not YouTube; needs provider-specific validation");
 if(d.provider==="youtube"){
   if(!/^[A-Za-z0-9_-]{11}$/.test(d.video_id||""))fail(filename+" invalid video ID");
   if(d.embed_url!=="https://www.youtube-nocookie.com/embed/"+d.video_id)fail(filename+" noncanonical privacy-enhanced embed URL");
   if(d.source_url&&d.source_url!=="https://www.youtube.com/watch?v="+d.video_id)warn(filename+" source URL differs from its video ID");
   if(d.enabled===true&&d.playback_verified!==true)warn(filename+" marked enabled with no verified playback");
   if(d.playback_verified===true&&d.captions_verified!==true)warn(filename+" playback verified but captions still unverified");
   if(!d.instructor)warn(filename+" missing instructor attribution; source should be checked before reuse");
 }
 if(d.lesson_id!==undefined||d.unit!==undefined||d.week!==undefined)fail(filename+" contains course-placement metadata");
 if(d.captions_verified===true&&(!d.transcript||!d.playback_verified))warn(filename+" approved captions without a transcript and verified playback; review manually");
}
let mappings=0;
for(const course of courses){
 const mapPath=path.join(math,course,"video-map.json");if(!fs.existsSync(mapPath))continue;
 const map=json(mapPath);if(!map)continue;
 const exact=new Set();const perUnit={};
 for(const p of map.placements||[]){
   mappings++;
   const key=p.lesson_id+"|"+p.asset_id;
   if(exact.has(key))fail(course+" duplicate lesson/asset placement "+key);
   exact.add(key);
   const parsed=/^KH-MATH-[A-Z0-9]+-U(\d{2})-L(\d{2})$/.exec(p.lesson_id||"");
   if(parsed){const u=Number(parsed[1]),l=Number(parsed[2]);if(p.unit!==undefined&&Number(p.unit)!==u)fail(course+" unit number does not match lesson ID "+key);if(p.lesson!==undefined&&Number(p.lesson)!==l)fail(course+" lesson number does not match lesson ID "+key);}
   const group=String(p.unit??(parsed?Number(parsed[1]):"unknown")).padStart(2,"0");
   const u=perUnit[group]||(perUnit[group]={placements:0,enabled:0,lessons:new Set(),enabledLessons:new Set(),assets:new Set()});u.placements++;u.lessons.add(p.lesson_id);u.assets.add(p.asset_id);if(p.enabled===true){u.enabled++;u.enabledLessons.add(p.lesson_id)}
   if(p.enabled!==true&&p.enabled!==false)warn(course+" placement missing boolean enabled "+key);
   if(!/^KH-MATH-[A-Z0-9]+-U\d{2}-L\d{2}$/.test(p.lesson_id||""))warn(course+" noncanonical lesson ID "+p.lesson_id);
   if(!p.shared_file||!p.shared_file.endsWith(".json")){fail(course+" missing shared JSON path "+key);continue}
   const ref=path.resolve(path.dirname(mapPath),p.shared_file);
   if(!fs.existsSync(ref)){fail(course+" missing shared asset "+p.shared_file);continue}
   const asset=json(ref);if(!asset)continue;
   if(asset.asset_id!==p.asset_id)fail(course+" mismatched asset ID in "+p.shared_file);
   if(p.lesson_file&&!fs.existsSync(path.resolve(path.dirname(mapPath),p.lesson_file)))fail(course+" missing lesson file "+p.lesson_file);
   if(p.enabled===true&&asset.playback_verified!==true)warn(course+" enabled placement lacks verified playback "+key+" (legacy placement may precede policy)");
   if(p.enabled===true&&asset.captions_verified!==true)warn(course+" enabled placement lacks caption verification "+key);
   if(p.enabled===true&&asset.transcript==null)warn(course+" enabled placement lacks a linked transcript "+key);
 }
 coverage[course]=Object.fromEntries(Object.entries(perUnit).sort(([a],[b])=>a.localeCompare(b)).map(([unit,v])=>[unit,{mapped_lessons:v.lessons.size,placements:v.placements,enabled_lessons:v.enabledLessons.size,enabled_placements:v.enabled,unique_assets:v.assets.size}]));
}
console.log(JSON.stringify({assets:checked,placements:mappings,warnings,errors,mode:"read-only",mastery_records_changed:false,coverage},null,2));
process.exitCode=errors||strict&&warnings?1:0;
