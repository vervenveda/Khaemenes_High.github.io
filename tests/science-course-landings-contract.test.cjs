"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const courses=[
["integrated-science-9","Integrated Science 9"],
["biology-10","Biology & Biotechnology 10"],
["chemistry-11","Chemistry & Materials Science 11"],
["physics-engineering-12","Physics & Engineering 12"]
];
const requiredScripts=[
"https://vervenveda.com/assets/vnv-header-autopopulate.js",
"../assets/science-minimal-header-mount-v1.js",
"https://vervenveda.com/assets/khaemenes-campus-phrases.js",
"https://vervenveda.com/assets/khaemenes-interlingual-core.js",
"https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1",
"https://vervenveda.com/assets/vnv-language.js?v=20261121-half-height",
"../assets/science-landing-class-tools-v1.js",
"https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1",
"https://vervenveda.com/assets/vnv-333-ticker.js",
"https://vervenveda.com/assets/vnv-ticker-autopopulate.js",
"https://vervenveda.com/assets/vnv-ecosystem-toolbar.js"
];
for(const [slug,title] of courses){
 const html=fs.readFileSync(path.join(root,"courses/science",slug,"landing.html"),"utf8");
 assert.ok(html.includes('<p class="eyebrow">Khaemenes Academy</p>'),slug+" Academy eyebrow");
 assert.ok(html.includes('<h1 id="course-title">'+title.replaceAll("&","&amp;")+"</h1>"),slug+" course title");
 for(const label of ["Learner Profile","Parent Profile","Enrollment"])assert.ok(html.includes(">"+label+"</a>"),slug+" access "+label);
 assert.equal((html.match(/class="science-feature-trigger"/g)||[]).length,4,slug+" exactly four feature cards");
 assert.ok(html.includes('class="science-breadcrumbs"'),slug+" centered breadcrumbs");
 assert.ok(html.includes('class="science-footer"'),slug+" footer");
 assert.ok(html.includes('id="scienceFeatureDialog"'),slug+" popup dialog");
 for(const src of requiredScripts)assert.ok(html.includes('src="'+src),slug+" canonical asset "+src);
}
const css=fs.readFileSync(path.join(root,"courses/science/assets/science-minimal-landing-v1.css"),"utf8");
for(const rule of [
".science-hero .eyebrow{margin:0 0 18px;color:var(--cream);font:400 33px",
".science-hero h1{margin:0;color:var(--cream);font:400 66px",
".science-hero .descriptor{max-width:900px;margin:26px auto 0;color:var(--cream);font:400 24px",
".science-feature-grid{max-width:900px",
"grid-template-columns:repeat(2,minmax(0,1fr))",
".science-footer p{font-size:14px}",
"#vnvClassToolsToolbar :is(button,a),#vnvEcosystemUtilityDock :is(button,a){min-width:44px;min-height:44px}"
])assert.ok(css.includes(rule),"Landing CSS contract missing: "+rule);
assert.ok(css.includes("--radius:7px"),"7px radius token");
const tools=fs.readFileSync(path.join(root,"courses/science/assets/science-landing-class-tools-v1.js"),"utf8");
assert.ok(tools.includes("landing\\.html"),"Class tools must match landing.html");
const department=fs.readFileSync(path.join(root,"courses/science/index.html"),"utf8");
for(const [slug] of courses)assert.ok(department.includes('href="./'+slug+'/landing.html"'),"Department must route through "+slug+" landing");
console.log("PASS: four Science course landings use canonical VNV chrome, translator, toolbars and symmetrical landing contract.");
