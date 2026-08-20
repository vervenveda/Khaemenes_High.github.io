import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const courseRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repoRoot=execFileSync("git",["rev-parse","--show-toplevel"],{cwd:courseRoot,encoding:"utf8"}).trim();
const tree=process.env.COURSE_AUDIT_TREE||"HEAD";
const inventory=new Set(execFileSync("git",["ls-tree","-r","--name-only",tree],{cwd:repoRoot,encoding:"utf8"}).trim().split("\n").filter(Boolean));
const failures=[];
let references=0,anchors=0;

function walk(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);
}

function repoPath(file){return path.relative(repoRoot,file).split(path.sep).join("/");}
function targetPath(source,url){
  const clean=decodeURIComponent(url.split(/[?#]/)[0]);
  if(clean.startsWith("/Khaemenes_High.github.io/"))return clean.slice("/Khaemenes_High.github.io/".length);
  if(clean.startsWith("/"))return clean.slice(1);
  const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(repoPath(source)),clean));
  return /^\.\/?$/.test(resolved)?"":resolved;
}
function exists(target){return target?inventory.has(target)||inventory.has(`${target.replace(/\/$/,"")}/index.html`):inventory.has("index.html");}
function localFile(target){
  const direct=path.join(repoRoot,target),index=path.join(direct,"index.html");
  return fs.existsSync(direct)&&fs.statSync(direct).isFile()?direct:fs.existsSync(index)?index:null;
}

const pages=walk(courseRoot).filter(file=>file.endsWith(".html"));
for(const page of pages){
  const source=fs.readFileSync(page,"utf8");
  for(const match of source.matchAll(/\b(href|src)\s*=\s*["']([^"']+)["']/gi)){
    const type=match[1].toLowerCase(),url=match[2].trim();
    if(!url||url.includes("${")||/^(?:https?:|mailto:|tel:|data:|blob:|javascript:|about:)/i.test(url))continue;
    references++;
    if(url.startsWith("#")){
      if(type!=="href")continue;
      const id=decodeURIComponent(url.slice(1));
      if(id&&!new RegExp(`\\b(?:id|name)=["']${id.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}["']`).test(source))failures.push(`${repoPath(page)}: missing local anchor #${id}`);
      else anchors++;
      continue;
    }
    const target=targetPath(page,url);
    if(!exists(target)){failures.push(`${repoPath(page)}: ${url} -> missing ${target}`);continue;}
    const fragment=url.includes("#")?decodeURIComponent(url.slice(url.indexOf("#")+1)):"";
    const targetFile=fragment&&localFile(target);
    if(targetFile){
      const targetSource=fs.readFileSync(targetFile,"utf8"),escaped=fragment.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
      if(!new RegExp(`\\b(?:id|name)=["']${escaped}["']`).test(targetSource))failures.push(`${repoPath(page)}: missing target anchor ${url}`);
      else anchors++;
    }
  }
}

if(failures.length){
  console.error(`Navigation audit failed (${failures.length}):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Navigation audit passed: ${pages.length} HTML pages, ${references} local references, ${anchors} verified anchors, tree ${tree}.`);
