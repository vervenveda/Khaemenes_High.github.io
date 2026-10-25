import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const base=path.resolve(import.meta.dirname,"..");
for(let n=2;n<=9;n++){
 const u=String(n).padStart(2,"0"),filename=path.join(base,"units","unit-"+u,"assets","unit"+u+"-core.js");
 const src=fs.readFileSync(filename,"utf8");
 assert.ok(/\bgraded=false\b/.test(src),"Unit "+u+" is missing graded=false state");
 for(const match of ["if(graded)return","score.disabled=true","input.disabled=true","Begin a new shuffled attempt","record.attempts.push","record.best[key]","class=\"feedback\" hidden","retry.hidden=true"]){
  assert.ok(src.includes(match),"Unit "+u+" is missing "+match);
 }
 assert.ok(!src.includes("Try again · clear current answers"),"Unit "+u+" retains the ungraded retry control");
 assert.ok(src.includes("const persisted=saveRecords(record)"),"Unit "+u+" verifies attempt persistence");
 assert.ok(src.includes("No mastery credit was recorded"),"Unit "+u+" warns on storage failure");
 assert.ok(/function (?:save|sv)\(x\)\{try\{localStorage\.setItem\(KEY,JSON\.stringify\(x\)\);return true\}catch\{return false\}\}/.test(src),
   "Unit "+u+" storage writes return a success flag");
}
console.log("PASS Units 02–09 preserve graded answers and require a reshuffled retake");
