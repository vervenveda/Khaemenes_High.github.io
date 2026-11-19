import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const mathRoot=path.join(root,"courses/mathematics");
const protectedRoute=/(^|\/)(assessment|assessments|diagnostic|diagnostics|midterm|midterms|final|finals)(\/|$)/i;
const lessonRoute=/(^|\/)lessons\/.*\.html$/i;
const adapterPattern=/-math-lesson-v2-adapter\.js$/;
const failures=[];
const report=[];

function walk(dir){
  const out=[];
  if(!fs.existsSync(dir)) return out;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const courseDirs=fs.readdirSync(mathRoot,{withFileTypes:true})
  .filter(entry=>entry.isDirectory())
  .map(entry=>path.join(mathRoot,entry.name));

for(const courseRoot of courseDirs){
  const assets=path.join(courseRoot,"assets");
  if(!fs.existsSync(assets)) continue;
  const adapterFiles=fs.readdirSync(assets)
    .filter(name=>adapterPattern.test(name));

  for(const adapterName of adapterFiles){
    const adapterPath=path.join(assets,adapterName);
    const adapter=fs.readFileSync(adapterPath,"utf8");
    const versionMatch=adapter.match(/const VERSION="([^"]+)"/);
    const course=path.basename(courseRoot);

    if(!versionMatch){
      failures.push(course+": adapter VERSION not found in "+adapterName);
      continue;
    }

    const version=versionMatch[1];
    const files=walk(courseRoot);
    let adoptedLessons=0;
    let protectedAdapterHits=0;

    for(const file of files){
      if(!file.endsWith(".html")) continue;
      const rel=path.relative(courseRoot,file).split(path.sep).join("/");
      const html=fs.readFileSync(file,"utf8");
      const count=html.split(adapterName).length-1;
      const hasRef=count>0;

      if(protectedRoute.test(rel) && hasRef){
        protectedAdapterHits++;
        failures.push(course+": protected route contains lesson adapter: "+rel);
        continue;
      }

      if(!lessonRoute.test(rel) || !hasRef) continue;
      adoptedLessons++;

      const expected=adapterName+"?v="+version;
      if(count!==1) failures.push(course+": expected exactly one adapter reference in "+rel+"; found "+count);
      if(!html.includes(expected)) failures.push(course+": stale cache/version token in "+rel+"; expected "+expected);
    }

    report.push({course,adapter:adapterName,version,adoptedLessons,protectedAdapterHits});
  }
}

console.table(report);

if(!report.length){
  console.error("No Mathematics Engine lesson adapters were discovered.");
  process.exit(1);
}

if(failures.length){
  console.error("\nMathematics Engine lesson-shell integrity FAILED");
  for(const failure of failures) console.error(" - "+failure);
  process.exit(1);
}

console.log("\nMathematics Engine lesson-shell integrity PASS");
