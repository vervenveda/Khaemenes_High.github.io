import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
let assets=0,inlineScripts=0,dependencies=0;

function walk(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);
}
function label(file){return path.relative(courseRoot,file).split(path.sep).join("/");}
function fail(file,message){failures.push(`${label(file)}: ${message}`);}

const files=walk(courseRoot),pages=files.filter(file=>file.endsWith(".html"));
for(const file of files.filter(item=>item.endsWith(".js"))){
  try{new vm.Script(fs.readFileSync(file,"utf8"),{filename:file});assets++;}
  catch(error){fail(file,`JavaScript syntax: ${error.message}`);}
}

for(const page of pages){
  const source=fs.readFileSync(page,"utf8"),defined=new Set([...source.matchAll(/window\.([A-Z][A-Z0-9_]*)\s*=/g)].map(match=>match[1]));
  if(/window\.VOCABULARY_FALLBACK\s*=/.test(source))fail(page,"legacy VOCABULARY_FALLBACK name; engines require VOCAB_FALLBACK");
  for(const match of source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(!match[1].trim())continue;
    try{new vm.Script(match[1],{filename:page});inlineScripts++;}
    catch(error){fail(page,`inline script syntax: ${error.message}`);}
  }
  for(const match of source.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)){
    const url=match[1];
    if(/^(?:https?:|\/)/i.test(url))continue;
    const asset=path.resolve(path.dirname(page),url.split(/[?#]/)[0]);
    if(!fs.existsSync(asset)){fail(page,`missing script ${url}`);continue;}
    const script=fs.readFileSync(asset,"utf8"),needed=new Set([...script.matchAll(/window\.([A-Z][A-Z0-9_]*)\b/g)].map(item=>item[1]));
    for(const name of needed){
      dependencies++;
      const optional=name==="APP"||new RegExp(`window\\.${name}\\s*\\|\\|`).test(script);
      if(!defined.has(name)&&!optional)fail(page,`${url} requires undefined window.${name}`);
    }
  }
}

if(failures.length){
  console.error(`Runtime integrity audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Runtime integrity audit passed: ${assets} JavaScript assets, ${inlineScripts} inline scripts, ${dependencies} page-to-script dependencies.`);
