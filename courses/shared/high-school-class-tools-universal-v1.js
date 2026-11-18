/* Khaemenes High · universal left Class Tools v1.0.0
   Subject-aware navigation shell for non-math High School courses.
   Presentation/navigation only. No learner, grade, assessment, mastery, or persistence authority. */
(()=>{"use strict";
if(window.__KHAE_HIGH_CLASS_TOOLS_UNIVERSAL_V1__||document.getElementById("khae-high-class-tools-universal"))return;
window.__KHAE_HIGH_CLASS_TOOLS_UNIVERSAL_V1__=true;
const path=location.pathname.toLowerCase();
if(/\/(?:assessment|assessments|diagnostic|quiz|quizzes|exam|exams|midterm|final)\//.test(path))return;
if(/\/courses\/mathematics\//.test(path)||/\/courses\/language-arts\//.test(path))return;

const HIGH="/Khaemenes_High.github.io/";
const gradeMatch=path.match(/grade-(09|10|11|12)|(?:biology-10|english-10)|(?:chemistry-11|english-11)|(?:physics-engineering-12|english-12)|(?:integrated-science-9|english-9)/);
let grade="";
if(gradeMatch?.[1])grade=gradeMatch[1];
else if(/(?:biology-10|grade-10)/.test(path))grade="10";
else if(/(?:chemistry-11|grade-11)/.test(path))grade="11";
else if(/(?:physics-engineering-12|grade-12)/.test(path))grade="12";
else if(/(?:integrated-science-9|grade-09)/.test(path))grade="09";

const courseHome=location.pathname.endsWith("/")?location.pathname:location.pathname.replace(/[^/]+$/,"");
const destinations=[
 ["Course",courseHome,"Return to this course home"],
 ["Class",grade?HIGH+"grades/grade-"+grade+"/":HIGH,"Open the grade-level class home"],
 ["Search","https://vervenveda.com/PLERASearch.github.io/","Search learning resources"],
 ["Parent","https://vervenveda.com/Khaemenes_Academy.github.io/family/","Family and parent resources"],
 ["Home",HIGH,"High School home"]
];

const style=document.createElement("style");
style.id="khae-high-class-tools-universal-style";
style.textContent=`
#khae-high-class-tools-universal{position:fixed;left:14px;bottom:16px;z-index:989;width:min(284px,calc(100vw - 28px));font:400 16px/1.4 Nunito,"Avenir Next",Arial,sans-serif;color:#fff8eb}
#khae-high-class-tools-universal details{background:#222b2a;border:1px solid #bb9b62;border-radius:7px;box-shadow:0 10px 28px rgba(0,0,0,.22);overflow:hidden}
#khae-high-class-tools-universal summary{display:block;cursor:pointer;padding:12px 16px;color:#fff8eb;font-size:16px;text-align:center;list-style:none}
#khae-high-class-tools-universal summary::-webkit-details-marker{display:none}
#khae-high-class-tools-universal summary:focus-visible,#khae-high-class-tools-universal a:focus-visible,#khae-high-class-tools-universal button:focus-visible{outline:3px solid #d9b65d;outline-offset:2px}
#khae-high-class-tools-universal .tools-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;padding:10px}
#khae-high-class-tools-universal .tools-grid :is(a,button){display:flex;min-width:0;min-height:44px;align-items:center;justify-content:center;text-align:center;white-space:nowrap;padding:8px 5px;border:1px solid #c4a46b;border-radius:7px;background:#303a37;color:#fff8eb;font:400 16px/1.25 Nunito,Arial,sans-serif;text-decoration:none;cursor:pointer}
#khae-high-class-tools-universal p{font-size:16px;line-height:1.45;margin:0;padding:0 12px 12px;color:#f5eedf;text-align:center}
@media print{#khae-high-class-tools-universal{display:none!important}}
@media(max-width:720px){#khae-high-class-tools-universal{left:7px;bottom:150px;width:min(248px,calc(100vw - 14px))}}
`;
document.head.append(style);

const dock=document.createElement("aside");
dock.id="khae-high-class-tools-universal";
dock.setAttribute("aria-label","Class learning tools");
const details=document.createElement("details");
const summary=document.createElement("summary");summary.textContent="Tools";details.append(summary);
const grid=document.createElement("nav");grid.className="tools-grid";grid.setAttribute("aria-label","Class course resources");
for(const [label,href,title] of destinations){const a=document.createElement("a");a.textContent=label;a.href=href;a.title=title;grid.append(a);}
const print=document.createElement("button");print.type="button";print.textContent="Print";print.title="Print this page";print.addEventListener("click",()=>window.print());
grid.append(print);details.append(grid);
const note=document.createElement("p");note.textContent="Tools support learning; course mastery and grades remain separate.";details.append(note);
dock.append(details);
const mount=()=>{if(!document.getElementById(dock.id))document.body.append(dock);};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();