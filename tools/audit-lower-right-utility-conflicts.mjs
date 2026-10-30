import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const HTML=[];
const LEGACY_IDS=[
  "vnvBetaProgramLink",
  "vnvBetaProgramFallback",
  "khaemenesLearnerUtilityToolbar",
  "khaeLandingUtilityDock",
  "khaemenesHomeUtilityDock"
];

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name===".git"||entry.name==="node_modules"||entry.name==="reports")continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.name.endsWith(".html"))HTML.push(full);
  }
}
walk(ROOT);

const failures=[];
for(const file of HTML){
  const rel=path.relative(ROOT,file).replaceAll(path.sep,"/");
  const html=fs.readFileSync(file,"utf8");
  const officialIds=(html.match(/id=["']vnvEcosystemUtilityDock["']/g)||[]).length;
  if(officialIds>1)failures.push(rel+": multiple static vnvEcosystemUtilityDock elements");
  for(const id of LEGACY_IDS){
    const re=new RegExp('id=["\\\']'+id+'["\\\']','g');
    const count=(html.match(re)||[]).length;
    if(count>1)failures.push(rel+": duplicate legacy lower-right id "+id);
  }
}

const highBeta=fs.readFileSync(path.join(ROOT,"assets/vnv-beta-link.js"),"utf8");
const highNav=fs.readFileSync(path.join(ROOT,"assets/high-navigation-v1.js"),"utf8");
for(const [name,source] of [["assets/vnv-beta-link.js",highBeta],["assets/high-navigation-v1.js",highNav]]){
  if(!source.includes("vnv-ecosystem-toolbar.js"))failures.push(name+": official toolbar bootstrap missing");
  if(!source.includes("vnvEcosystemUtilityDock"))failures.push(name+": canonical dock guard missing");
}
if(highBeta.includes('label.textContent="Beta Program"'))failures.push("assets/vnv-beta-link.js: legacy standalone Beta constructor returned");
if(!highBeta.includes("removeLegacyUtilitySurfaces"))failures.push("assets/vnv-beta-link.js: legacy lower-right cleanup missing");
if(!highNav.includes("highUtilityConflictGuard"))failures.push("assets/high-navigation-v1.js: lower-right conflict guard missing");

if(failures.length){
  console.error("Lower-right utility conflict audit FAILED ("+failures.length+" issue"+(failures.length===1?"":"s")+"):");
  for(const failure of failures)console.error("- "+failure);
  process.exit(1);
}
console.log("PASS lower-right utility topology: one canonical ecosystem dock; legacy solo Beta/learner rails cannot coexist visibly.");
