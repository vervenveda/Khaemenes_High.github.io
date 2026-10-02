import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");const fail=[];const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const app=read("app.js"),idx=JSON.parse(read("data/week-index.json")),loader=read("assets/grade09-integration-loader.js"),sw=read("service-worker.js");
if(!app.includes("week-27/student-packet-v2.html"))fail.push("app Week27 route not v2");if(!String(idx.find(x=>x.week===27)?.packet||"").includes("student-packet-v2.html"))fail.push("week index Week27 route not v2");
for(const p of ["weeks/week-26/simulation-lab.html","weeks/week-27/economic-lab.html","resources/historical-systems-lab.html","resources/tool-gateway.html"])if(!fs.existsSync(path.join(ROOT,p)))fail.push(`missing local tool ${p}`);
for(const p of ["weeks/week-26/simulation-lab.html","weeks/week-27/economic-lab.html","resources/historical-systems-lab.html"]){const s=read(p);if(/vervenveda\.github\.io\/finance|github\.com\/vervenveda\/proresource_hub/.test(s))fail.push(`${p} still requires public simulator`)}
if(!loader.includes("historical-systems-lab-bridge-v1.js")||!loader.includes("grade09-socialstudies-systems-integration-v1.js"))fail.push("shared systems integration not activated");if(!sw.includes("resources/historical-systems-lab.html"))fail.push("local systems lab not offline shell");
const bridges=fs.readdirSync(path.join(ROOT,"assets")).filter(x=>/(bridge|integration).*\.js$/.test(x));for(const f of bridges){const s=read(`assets/${f}`);if(/<script[^>]+https?:|\.src\s*=\s*["']https?:/.test(s))fail.push(`${f} automatically acquires remote script`);if(/github\.com\/vervenveda\/proresource_hub\.github\.io/.test(s))fail.push(`${f} retains public systems-lab dependency`)}

const activation=JSON.parse(read("data/integration-activation-manifest.json"));
for(const x of activation.retained_not_runtime){if(sw.includes(`./${x.path}`))fail.push(`retained-not-runtime script still cached: ${x.path}`)}
for(const x of activation.active_runtime.filter(x=>!x.path.includes("grade-engine"))){if(!sw.includes(`./${x.path}`))fail.push(`active student runtime not cached: ${x.path}`)}
const beta=read("assets/socialstudies-beta-bridge.js");if(/https?:\/\//.test(beta))fail.push("beta bridge retains remote URL");
console.log(`Global Studies connectivity hardening: bridges=${bridges.length} failures=${fail.length}`);if(fail.length){for(const f of fail)console.error("FAIL",f);process.exit(1)}console.log("PASS — Global Studies local/STOS connectivity gate");
