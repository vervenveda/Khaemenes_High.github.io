/* Read-only, architecture-preserving math lesson launch path audit.
   Run from repository checkout: node tests/math-lesson-launch-paths.test.cjs */
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const courses=["pre-algebra","algebra-1","geometry","algebra-2"];
let pages=0,lessons=0,failures=[],scripts=0;
function exists(p){return fs.existsSync(p)&&fs.statSync(p).isFile()}
function checkPage(file){
  pages++;
  const html=fs.readFileSync(file,"utf8");
  const isLesson=/[/\\]lessons[/\\]/.test(file);
  if(isLesson)lessons++;
  for(const m of html.matchAll(/<(a|script|link)\b[^>]*?\b(href|src)=["']([^"']+)["']/gi)){
    const kind=m[1].toLowerCase(),value=m[3].trim();
    if(!value||/^(?:https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(value))continue;
    const clean=value.split(/[?#]/)[0];
    if(!clean||clean.startsWith("/"))continue;
    const target=path.resolve(path.dirname(file),decodeURIComponent(clean));
    if(!target.startsWith(root+path.sep))continue;
    const valid=exists(target)||exists(path.join(target,"index.html"));
    if(!valid)failures.push({page:path.relative(root,file),kind,target:clean});
  }
}
function walk(dir){
  if(!fs.existsSync(dir))return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,entry.name);
    if(entry.isDirectory())walk(p);
    else if(entry.name.endsWith(".html"))checkPage(p);
    else if(entry.name.endsWith(".js")){
      scripts++;
      try{new vm.Script(fs.readFileSync(p,"utf8"),{filename:p})}
      catch(err){failures.push({page:path.relative(root,p),kind:"syntax",target:err.message})}
    }
  }
}
for(const course of courses)walk(path.join(root,"courses","mathematics",course));
console.log(JSON.stringify({courses,pages,lessonPages:lessons,scripts,failures:failures.length,samples:failures.slice(0,80)},null,2));
assert.equal(failures.length,0,"Unresolved local links or invalid JavaScript found");
