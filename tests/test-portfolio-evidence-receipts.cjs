#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const bridge=fs.readFileSync(path.join(root,"portfolio/portfolio-evidence-receipts.js"),"utf8");
const index=fs.readFileSync(path.join(root,"portfolio/index.html"),"utf8");
const report=fs.readFileSync(path.join(root,"portfolio/portfolio-academic-report.js"),"utf8");
assert(bridge.includes("writesCourseRecords:false"));
assert(bridge.includes("writesPortfolio:false"));
assert(bridge.includes("awardsCredit:false"));
assert(bridge.includes("fnv1a32-noncryptographic"));
assert(!/setItem\s*\(/.test(bridge),"receipt bridge must remain read-only");
assert(index.indexOf("portfolio-evidence-receipts.js")<index.indexOf("portfolio-academic-report.js"),"receipt bridge must load before report");
assert(report.includes("evidenceReceipts:"));
assert(report.includes('definition("Evidence receipts"'));
console.log("PASS portfolio evidence receipt bridge is read-only, provenance-bearing and report-connected");
