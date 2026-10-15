import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../units/unit-01");
for(const file of ["unit01.js","quiz-app.js","assessment-app.js"]){
 const source=fs.readFileSync(path.join(root,file),"utf8");
 new vm.Script(source,{filename:file});
 assert.ok(source.includes("KhaemenesScienceU01Scope"),file+" must use learner scope");
 assert.ok(!source.includes('KEY="khaemenes_science_u01_v1"'),file+" must not use shared key");
}
const controller=fs.readFileSync(path.join(root,"unit01.js"),"utf8");
assert.ok(controller.includes("recoverLegacy"),"explicit legacy recovery must remain");
assert.ok(controller.includes("kh_sci9_learner_v1:"),"course root must use learner-scoped key");
assert.ok(controller.includes("localStorage.getItem(ORIGINAL)"),"legacy record must remain readable");
assert.ok(!controller.includes("localStorage.removeItem(ORIGINAL)"),"legacy records must not be removed");
console.log("PASS: Unit 01 scope contract, syntax, and non-destructive legacy recovery (structural checks).");
