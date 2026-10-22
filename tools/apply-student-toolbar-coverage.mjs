import fs from "node:fs";
import path from "node:path";
import {isStudentFacing,toolbarStatus,injectToolbar} from "./student-toolbar-policy.mjs";

const root=process.cwd();
let scanned=0,studentFacing=0,updated=0,excluded=0;
const changed=[];

function walk(dir){
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    if(item.name===".git"||item.name==="node_modules")continue;
    const full=path.join(dir,item.name);
    if(item.isDirectory()){walk(full);continue}
    if(!item.name.endsWith(".html"))continue;
    scanned++;
    const rel=path.relative(root,full).replaceAll(path.sep,"/");
    const html=fs.readFileSync(full,"utf8");
    if(!isStudentFacing(rel,html)){excluded++;continue}
    studentFacing++;
    if(toolbarStatus(html)!=="uncovered")continue;
    const next=injectToolbar(html);
    if(next!==html){
      fs.writeFileSync(full,next);
      updated++;changed.push(rel);
    }
  }
}
walk(root);
console.log(JSON.stringify({scanned,studentFacing,excluded,updated,samples:changed.slice(0,40)},null,2));
if(updated===0)console.log("No uncovered student-facing toolbar pages required repair.");
