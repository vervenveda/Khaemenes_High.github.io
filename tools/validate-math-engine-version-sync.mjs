import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const courses=[
  {id:"pre-algebra",root:"courses/mathematics/pre-algebra",adapter:"assets/prealgebra-math-lesson-v2-adapter.js",ref:"prealgebra-math-lesson-v2-adapter.js"},
  {id:"algebra-1",root:"courses/mathematics/algebra-1",adapter:"assets/algebra1-math-lesson-v2-adapter.js",ref:"algebra1-math-lesson-v2-adapter.js"}
];

const protectedRoute=/(^|\\/)(assessment|assessments|diagnostic|diagnostics|midterm|midterms|final|finals)(\\/|$)/i;
const lessonRoute=/(^|\\/)lessons\\/.*\\.html$/i;
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

for(const course of courses){
  const courseRoot=path.join(root,course.root);
  const adapterPath=path.join(courseRoot,course.adapter);
  const adapter=fs.readFileSync(adapterPath,"utf8");
  const m=adapter.match(/const VERSION="([^"]+)"/);
  if(!m) throw new Error(course.id+": adapter VERSION not found");
  const version=m[1];
  const files=walk(courseRoot);
  const adopted=[];
  const protectedHits=[];

  for(const file of files){
    if(!file.endsWith(".html")) continue;
    const rel=path.relative(courseRoot,file).split(path.sep).join("/");
    const html=fs.readFileSync(file,"utf8");
    const hasRef=html.includes(course.ref);

    if(protectedRoute.test(rel) && hasRef){
      protectedHits.push(rel);
      failures.push(course.id+": protected route contains lesson adapter: "+rel);
      continue;
    }

    if(!lessonRoute.test(rel) || !hasRef) continue;
    adopted.push(rel);

    const expected=course.ref+"?v="+version;
    const escaped=course.ref.replace(/[.*+?^\${}()|[\\]\\\\]/g,"\\$&");
    const count=(html.match(new RegExp(escaped,"g"))||[]).length;
    if(count!==1) failures.push(course.id+": expected exactly one adapter reference in "+rel+"; found "+count);
    if(!html.includes(expected)) failures.push(course.id+": stale cache/version token in "+rel+"; expected "+expected);
  }

  report.push({course:course.id,version,adoptedLessons:adopted.length,protectedAdapterHits:protectedHits.length});
}

console.table(report);
if(failures.length){
  console.error("\\nMathematics Engine lesson-shell integrity FAILED");
  for(const failure of failures) console.error(" - "+failure);
  process.exit(1);
}
console.log("\\nMathematics Engine lesson-shell integrity PASS");
