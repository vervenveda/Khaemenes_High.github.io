import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root=process.cwd();
const write=process.argv.includes("--write");
const specs=[
  {course:"pre-algebra",adapter:"prealgebra-math-lesson-v2-adapter.js"},
  {course:"algebra-1",adapter:"algebra1-math-lesson-v2-adapter.js"},
  {course:"geometry",adapter:"geometry-math-lesson-v2-adapter.js"}
];

function walk(dir,out=[]){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,ent.name);
    if(ent.isDirectory())walk(p,out);
    else out.push(p);
  }
  return out;
}
function versionFor(spec){
  const p=path.join(root,"courses/mathematics",spec.course,"assets",spec.adapter);
  const text=fs.readFileSync(p,"utf8");
  const m=text.match(/const VERSION="([^"]+)"/);
  if(!m)throw new Error("Adapter VERSION not found: "+p);
  return m[1];
}
function escapedAdapter(name){
  return name.split(".").join("\\.");
}

let stale=0,changed=0,replacements=0;
for(const spec of specs){
  const courseRoot=path.join(root,"courses/mathematics",spec.course);
  const version=versionFor(spec);
  const re=new RegExp(escapedAdapter(spec.adapter)+"\\?v=([^\\\"'\\s<]+)","g");
  const files=walk(courseRoot).filter(p=>p.endsWith(".html")||p.endsWith(".js"));
  let courseChanged=0,courseReplacements=0;
  for(const file of files){
    const original=fs.readFileSync(file,"utf8");
    let local=0;
    const next=original.replace(re,(full,v)=>{
      if(v===version)return full;
      stale++;local++;
      return spec.adapter+"?v="+version;
    });
    if(local){
      courseChanged++;
      courseReplacements+=local;
      if(write)fs.writeFileSync(file,next);
    }
  }
  changed+=courseChanged;
  replacements+=courseReplacements;
  console.log(spec.course+": adapter="+version+" changed_files="+courseChanged+" replacements="+courseReplacements);
}
console.log("MATH_ENGINE_ADAPTER_TOKEN_STALE="+stale);
console.log("MATH_ENGINE_ADAPTER_TOKEN_CHANGED_FILES="+changed);
console.log("MATH_ENGINE_ADAPTER_TOKEN_REPLACEMENTS="+replacements);
if(!write&&stale>0)process.exit(1);
