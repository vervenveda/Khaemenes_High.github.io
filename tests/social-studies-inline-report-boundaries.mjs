#!/usr/bin/env node
/**
 * Regression: Grade 10-12 Social Studies printable reports must not
 * terminate main JavaScript blocks with embedded closing-script tags.
 * Parser/source check only, not live browser certification.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
for(const grade of ["10","11","12"]){
 const relative="courses/social-studies/grade-"+grade+"/index.html";
 const html=fs.readFileSync(path.join(root,relative),"utf8");
 const opens=[...html.matchAll(/<script\b[^>]*>/gi)];
 const closes=[...html.matchAll(/<\/script\s*>/gi)];
 assert.equal(opens.length,closes.length,relative+": mismatched script tags");
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
 const program=scripts.find(m=>m[1].includes("function reportHTML()"));
 assert(program,relative+": report handler missing from browser script");
 new vm.Script(program[1],{filename:relative});
 assert(program[1].includes("function printReport()"),relative+": browser cannot reach print handler");
 assert(program[1].includes("function downloadReport()"),relative+": browser cannot reach export handler");
 const a=program[1].indexOf("function reportHTML()");
 const b=program[1].indexOf("function printReport()",a);
 const report=program[1].slice(a,b);
 assert(!/<\/?script\b/i.test(report),relative+": report contains executable script tags");
 for(const file of ["../../../assets/high-school-return-to-classes.js","../../../assets/high-navigation-v1.js"]){
  assert.equal(html.split('src="'+file+'"').length-1,1,relative+": wrong page-level navigation script count");
  assert(!report.includes(file),relative+": navigation script included in printable report");
 }
 assert(report.includes("<!doctype html>")&&report.includes("</body></html>"),relative+": report markup is incomplete");
 console.log("PASS grade "+grade+": browser script parses; exported report includes no scripts");
}
console.log("Pending: completed CI and live-device/browser inspection.");
