import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const mathRoot=path.resolve(here,"..");
const specs=[
  {course:"pre-algebra",old:"prealgebra-math-lesson-v2-adapter.js?v=2.2.3",next:"prealgebra-math-lesson-v2-adapter.js?v=2.3.0",cacheOld:"v24-assessment-firewall-20261119",cacheNext:"v25-engine-parity-20261119"},
  {course:"algebra-1",old:"algebra1-math-lesson-v2-adapter.js?v=2.2.3",next:"algebra1-math-lesson-v2-adapter.js?v=2.3.0",cacheOld:"khaemenes-algebra1-v46-hardening-20261119",cacheNext:"khaemenes-algebra1-v47-engine-parity-20261119"},
  {course:"geometry",old:"geometry-math-lesson-v2-adapter.js?v=2.2.3",next:"geometry-math-lesson-v2-adapter.js?v=2.3.0",cacheOld:"khaemenes-geometry-v19-hardening-20261119",cacheNext:"khaemenes-geometry-v20-engine-parity-20261119"}
];

function walk(dir,out=[]){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);entry.isDirectory()?walk(full,out):out.push(full)}return out}
let changed=0;
for(const spec of specs){
  const root=path.join(mathRoot,spec.course),files=walk(root).filter(f=>/\.(?:html|js|mjs)$/i.test(f));
  let replacements=0;
  for(const file of files){
    const before=fs.readFileSync(file,"utf8"),count=before.split(spec.old).length-1;
    if(!count)continue;
    fs.writeFileSync(file,before.split(spec.old).join(spec.next));
    replacements+=count;changed++;
  }
  const sw=path.join(root,"service-worker.js");
  let swText=fs.readFileSync(sw,"utf8");
  if(!swText.includes(spec.cacheOld))throw new Error(spec.course+": expected cache boundary not found: "+spec.cacheOld);
  swText=swText.replace(spec.cacheOld,spec.cacheNext);
  fs.writeFileSync(sw,swText);changed++;
  const adapterName=spec.course==="pre-algebra"?"prealgebra-math-lesson-v2-adapter.js":spec.course==="algebra-1"?"algebra1-math-lesson-v2-adapter.js":"geometry-math-lesson-v2-adapter.js";
  const adapterText=fs.readFileSync(path.join(root,"assets",adapterName),"utf8");
  if(!adapterText.includes('VERSION="2.3.0"'))throw new Error(spec.course+": adapter source is not VERSION 2.3.0");
  const stale=walk(root).filter(f=>/\.(?:html|js|mjs)$/i.test(f)&&fs.readFileSync(f,"utf8").includes(spec.old));
  if(stale.length)throw new Error(spec.course+": stale adapter references remain: "+stale.join(", "));
  console.log("PASS · "+spec.course+" · replaced "+replacements+" token(s) · "+spec.cacheNext);
}
console.log("CHANGED_FILES="+changed);
console.log("MATH_ENGINE_ADAPTER_PARITY=PASS");
