"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),base="courses/science/integrated-science-9/";
const shell=fs.readFileSync(path.join(root,base,"science9-academy-shell-v1.js"),"utf8");
const readable=fs.readFileSync(path.join(root,base,"science9-readable-type-v1.css"),"utf8");
assert.doesNotThrow(()=>new vm.Script(shell,{filename:"science9-academy-shell-v1.js"}));
for(const asset of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-language.js","vnv-ecosystem-toolbar.js"])assert.ok(shell.includes(asset),"Shell retains "+asset);
assert.match(readable,/font-size:16px!important/,"Readable type floor remains 16px");
const gate=fs.readFileSync(path.join(root,base,"assets/science9-entry-gate.js"),"utf8");
assert.ok(gate.includes("data-science9-academy-shell"),"Course portal mounts canonical shell");
const unit00=fs.readFileSync(path.join(root,base,"diagnostic/unit00.js"),"utf8");
assert.ok(unit00.includes("data-science9-academy-shell"),"Readiness engine mounts canonical shell");
for(let n=1;n<=12;n++){
 const id=String(n).padStart(2,"0"),file=fs.readFileSync(path.join(root,base,"units/unit-"+id+"/unit"+id+".js"),"utf8");
 assert.ok(file.includes("data-science9-academy-shell"),"Unit "+id+" mounts canonical shell");
}
console.log("PASS Science 9 canonical Academy shell: portal + readiness + Units 01-12 share tickers, header, translator, toolbar and 16px floor.");
