import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const root=new URL("../",import.meta.url);
function store(){const map=new Map();return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v))};}
const localStorage=store();
for(const unit of ["01","02","03","04"]){
  const file="units/unit-"+unit+"/unit"+unit+".js";
  const source=fs.readFileSync(new URL(file,root),"utf8");
  const declaration=source.match(/let scienceLastSeen=localStorage\.getItem\(KEY\),scienceConflict=false;/);
  const start=source.indexOf("function save(){",source.indexOf(declaration?.[0]||"@@@@"));
  const next=source.indexOf("function ",start+9);
  const snippet=source.slice(start,next);
  assert.ok(declaration&&start>=0&&snippet.includes("scienceConflict")&&snippet.includes("scienceLastSeen"),file+" missing guard");
  const key="learner:alex:unit:"+unit;
  const initial=JSON.stringify({completedPages:["day01"]});
  localStorage.setItem(key,initial);
  function tab(){
    const ctx={KEY:key,localStorage,window:{alert(){}},state:{completedPages:["day01","day02"]},scienceLastSeen:localStorage.getItem(key),scienceConflict:false,
      prerequisiteMet(){return true},showPrerequisiteGate(){},showGate(){},syncRoot(){},update(){},updatePage(){}};
    vm.createContext(ctx);
    vm.runInContext(snippet+";this.performSave=save;",ctx);
    return ctx;
  }
  const first=tab(),stale=tab();
  first.performSave();
  const latest=localStorage.getItem(key);
  assert.notEqual(latest,initial,"first tab should save");
  stale.state.completedPages=["day01","day03"];
  stale.performSave();
  assert.equal(localStorage.getItem(key),latest,"stale tab must not overwrite");
  assert.equal(stale.scienceConflict,true,"stale tab should flag conflict");
  const otherKey="learner:river:unit:"+unit;
  assert.equal(localStorage.getItem(otherKey),null,"other learner must remain separate");
  console.log("PASS Unit "+unit+": first write succeeds, stale write rejected, separate learner untouched");
}
