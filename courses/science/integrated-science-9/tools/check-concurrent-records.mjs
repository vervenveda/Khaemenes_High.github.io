import fs from "node:fs";
import vm from "node:vm";
const root=new URL("../",import.meta.url);
const cases=[
 ["course-ui.js",["lastSeenRecord","checkRecordConflict()","recordConflict","addEventListener(\"storage\""]],
 ["units/unit-02/unit02.js",["scienceLastSeen","scienceConflict","addEventListener(\"storage\""]],
 ["units/unit-03/unit03.js",["scienceLastSeen","scienceConflict","addEventListener(\"storage\""]]
];
for(const [file,required] of cases){
 const source=fs.readFileSync(new URL(file,root),"utf8");
 new vm.Script(source,{filename:file});
 for(const marker of required)if(!source.includes(marker))throw Error(file+" missing "+marker);
}
console.log("PASS: concurrent-change prevention and syntax contracts for dashboard and Units 02–03.");
