import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const courses=["pre-algebra","algebra-1","geometry","algebra-2"];
const fail=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ok=(v,m)=>{if(!v)fail.push(m)};

for(const course of courses){
  const rel=`courses/mathematics/${course}/index.html`;
  const html=read(rel);
  const body=(html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)||[])[1]||"";
  const scripts=[...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
  const dual=scripts.filter(s=>/vnv-dual-ticker-v1\.js/.test(s));
  const chrome=scripts.filter(s=>/high-school-global-chrome-v2\.js/.test(s));
  const direct333=scripts.filter(s=>/vnv-333-ticker\.js/.test(s));
  const directAuto=scripts.filter(s=>/vnv-ticker-autopopulate\.js/.test(s));

  ok(dual.length===1,`${course}: expected exactly one canonical dual-ticker loader, found ${dual.length}`);
  ok(chrome.length===1,`${course}: expected exactly one global chrome loader, found ${chrome.length}`);
  ok(direct333.length===0,`${course}: direct 333 ticker loader must not appear in index.html`);
  ok(directAuto.length===0,`${course}: direct AutoPopulate ticker loader must not appear in index.html`);
  ok(!/<header\b/i.test(body),`${course}: local <header> markup is not allowed in the landing page body`);
  ok(!/class=["'][^"']*site-header/i.test(body),`${course}: legacy site-header markup is not allowed`);

  const dualPos=html.indexOf("vnv-dual-ticker-v1.js");
  const chromePos=html.indexOf("high-school-global-chrome-v2.js");
  ok(dualPos>=0&&chromePos>dualPos,`${course}: dual ticker must load before global chrome`);
}

const chrome=read("assets/high-school-global-chrome-v2.js");
ok(chrome.includes('HEADER="vnv-header-autopopulate.js"'),"global chrome must own the official VNV header loader");
ok(chrome.includes('TICKER_GUARD="vnv-dual-ticker-v1.js"'),"global chrome must recognize the canonical dual ticker guard");
ok(chrome.includes("ensureHeader()"),"global chrome must mount the official ecosystem header");
ok(chrome.includes("ensureTickerGuard()"),"global chrome must preserve the canonical ticker pair");

const ticker=read("assets/vnv-dual-ticker-v1.js");
ok(ticker.includes('THREE33="vnv-333-ticker.js"'),"dual ticker guard must load the 333 ticker");
ok(ticker.includes('AUTO="vnv-ticker-autopopulate.js"'),"dual ticker guard must load the AutoPopulate ticker");
ok(ticker.includes('vnv333NetworkTicker'),"dual ticker guard must verify the 333 ticker mount");
ok(ticker.includes('vnvTickerAutoPopulate'),"dual ticker guard must verify the AutoPopulate ticker mount");

if(fail.length){
  console.error("\nMathematics landing chrome validation failed:");
  fail.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("MATH_LANDING_CHROME=PASS · four landing pages use one canonical 333+AutoPopulate ticker pair followed by one official VNV ecosystem header owner, with no local header/ticker duplicates.");
