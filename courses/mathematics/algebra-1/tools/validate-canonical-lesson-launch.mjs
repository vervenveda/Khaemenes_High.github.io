import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";import vm from "node:vm";
const root="courses/mathematics/algebra-1/";
let lessons=0;
for(let n=1;n<=13;n++){
 const unit="unit-"+String(n).padStart(2,"0"),dir=root+"units/"+unit+"/";
 const map=JSON.parse(fs.readFileSync(dir+"unit-map.json","utf8"));
 assert.ok(Array.isArray(map.lessons)&&map.lessons.length>0,unit+" missing lesson map");
 for(const lesson of map.lessons){
  assert.ok(/^lessons\/[^/]+\.html$/.test(lesson.file),unit+" invalid lesson path: "+lesson.file);
  const target=dir+lesson.file;
  assert.ok(fs.existsSync(target),unit+" missing "+lesson.file);
  const html=fs.readFileSync(target,"utf8");
  assert.match(html,/data-mode="lesson"/,target+" lacks lesson mode");
  assert.ok(html.includes('data-lesson="'+lesson.number+'"'),target+" has wrong lesson number");
  const assets=[...html.matchAll(/<script\s+src="([^"]+\.js)(?:\?[^"]*)?"/g)];
  for(const m of assets){if(m[1].startsWith("http"))continue;const local=path.normalize(path.join(path.dirname(target),m[1]));assert.ok(fs.existsSync(local),target+" missing dependency "+m[1]);}
  lessons++;
 }
 const unitPage=fs.readFileSync(dir+"index.html","utf8");
 assert.match(unitPage,/data-mode="unit"/,unit+" wrong unit reader");
 const data=dir+"assets/"+unit.replace("-","")+"-data.js";
 assert.ok(fs.existsSync(data),unit+" missing data asset "+data);
 new vm.Script(fs.readFileSync(data,"utf8"),{filename:data});
 const reader=dir+"assets/"+unit.replace("-","")+".js";
 assert.ok(fs.existsSync(reader),unit+" missing engine "+reader);
 new vm.Script(fs.readFileSync(reader,"utf8"),{filename:reader});
}
console.log("PASS Algebra I: 13 JSON navigation maps -> "+lessons+" HTML lesson shells, verified local JS data/engine imports");
