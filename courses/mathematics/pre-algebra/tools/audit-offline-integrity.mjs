import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
const fail=message=>failures.push(message);
const read=relative=>fs.readFileSync(path.join(courseRoot,relative),"utf8");

let manifest;
try{manifest=JSON.parse(read("manifest.webmanifest"));}catch(error){fail(`Manifest is not valid JSON: ${error.message}`);}
if(manifest){
  if(manifest.start_url!=="./")fail("Manifest start_url must stay inside the course root");
  if(manifest.scope!=="./")fail("Manifest scope must stay inside the course root");
  if(!["standalone","minimal-ui","browser"].includes(manifest.display))fail("Manifest display mode is invalid");
  for(const field of ["name","short_name","theme_color","background_color"])if(!manifest[field])fail(`Manifest ${field} is missing`);
}

const index=read("index.html");
if(!/<link\s+rel="manifest"\s+href="manifest\.webmanifest"/i.test(index))fail("Course home does not link its manifest");
if(!/navigator\.serviceWorker\.register\("service-worker\.js",\{scope:"\.\/"\}\)/.test(index))fail("Course home does not register a course-scoped service worker");

const offline=read("offline.html");
for(const [pattern,label] of [[/^<!doctype html>/i,"doctype"],[/<html lang="en">/i,"language"],[/<meta name="viewport"/i,"viewport"],[/<main>/i,"main landmark"],[/full units, assessments, and external learning tools require a connection/i,"offline limitation"]])if(!pattern.test(offline))fail(`Offline page is missing its ${label}`);

const worker=read("service-worker.js");
try{new vm.Script(worker,{filename:"service-worker.js"});}catch(error){fail(`Service worker has invalid JavaScript: ${error.message}`);}
const cacheMatch=worker.match(/const CORE_FILES=\[([\s\S]*?)\];/);
if(!cacheMatch)fail("Service worker core file list could not be read");
else{
  const files=[...cacheMatch[1].matchAll(/"(\.\/[^"\n]+)"/g)].map(match=>match[1]);
  if(files.length>12)fail(`Course Core is too large (${files.length} precache entries)`);
  for(const file of files){
    const relative=file==="./"?"index.html":file.slice(2);
    if(!fs.existsSync(path.join(courseRoot,relative)))fail(`Precache target does not exist: ${file}`);
    if(/units\/|assessments\/|worksheets\/|practice\//.test(file))fail(`Curriculum content must not be eagerly precached: ${file}`);
  }
  for(const required of ["./index.html","./offline.html","./manifest.webmanifest","./course-map.json","./records/","./records/course-completion-certificate.html"])if(!files.includes(required))fail(`Course Core is missing ${required}`);
}
if(!/name\.startsWith\(CACHE_PREFIX\)/.test(worker))fail("Cache cleanup is not restricted to the Pre-Algebra cache prefix");

if(failures.length){
  console.error(`Offline integrity audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Offline integrity audit passed: scoped registration, valid manifest, honest fallback, compact Course Core with family records, and prefix-limited cache cleanup verified.");
