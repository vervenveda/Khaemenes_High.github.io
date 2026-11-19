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

  const count=re=>scripts.filter(s=>re.test(s)).length;
  ok(count(/vnv-dual-ticker-v1\.js/ )===1,`${course}: expected one canonical dual-ticker loader`);
  ok(count(/vnv-header-autopopulate\.js/ )===1,`${course}: expected one official VNV header loader`);
  ok(count(/high-school-global-chrome-v2\.js/ )===0,`${course}: global chrome is forbidden on mathematics landing pages`);
  ok(count(/vnv-333-ticker\.js/ )===0,`${course}: direct 333 loader must not appear`);
  ok(count(/vnv-ticker-autopopulate\.js/ )===0,`${course}: direct AutoPopulate loader must not appear`);
  ok(!/<header\b/i.test(body),`${course}: local <header> markup is not allowed in the landing page body`);
  ok(!/class=["'][^"']*site-header/i.test(body),`${course}: legacy site-header markup is not allowed`);

  ok(count(/vnv-ecosystem-toolbar\.js/ )===1,`${course}: expected one lower-right ecosystem toolbar`);
  ok(count(/vnv-class-tools-toolbar\.js/ )===1,`${course}: expected one lower-left universal class-tools toolbar`);
  ok(count(/math-landing-class-tools-v1\.js/ )===1,`${course}: expected one math landing toolbar configuration`);
  ok(count(/vnv-language\.js/ )===1,`${course}: expected one official language engine`);
  ok(count(/math-learning-tools-v2\.js/ )===0,`${course}: legacy math landing dock must not load`);

  const configPos=html.indexOf("math-landing-class-tools-v1.js");
  const languagePos=html.indexOf("vnv-language.js");
  const classToolsPos=html.indexOf("vnv-class-tools-toolbar.js");
  ok(configPos>=0&&languagePos>configPos&&classToolsPos>languagePos,
    `${course}: toolbar config must load before translator, then universal class tools`);
}

const landingTools=read("courses/mathematics/assets/math-landing-class-tools-v1.js");
const labels=["Calculator","Games","Vocabulary","Search","Translate","Parent"];
for(const label of labels)ok(landingTools.includes(`label:"${label}"`),`math landing toolbar missing ${label}`);
ok((landingTools.match(/label:"(?:Calculator|Games|Vocabulary|Search|Translate|Parent)"/g)||[]).length===6,
  "math landing toolbar must define exactly six canonical tools");
ok(landingTools.includes("data-vnv-language-mount"),"translator must use an explicit hidden mount");
ok(landingTools.includes("data-vct-translator-panel"),"translator must open inside the lower-left toolbar panel");
ok(landingTools.includes('id:"high-school-math-landing"'),"math landing toolbar must select the canonical shared preset");

const ticker=read("assets/vnv-dual-ticker-v1.js");
ok(ticker.includes('THREE33="vnv-333-ticker.js"'),"dual ticker guard must load the 333 ticker");
ok(ticker.includes('AUTO="vnv-ticker-autopopulate.js"'),"dual ticker guard must load the AutoPopulate ticker");

if(fail.length){
  console.error("\nMathematics landing validation failed:");
  fail.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("MATH_LANDING_CHROME_AND_TOOLBARS=PASS · canonical tickers/header plus paired universal corner toolbars, six math tools, embedded translator, no legacy math dock.");
