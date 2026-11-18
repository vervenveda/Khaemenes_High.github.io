/* Khaemenes High · subject-aware left-hand learning resources v1
   Presentation and navigation only. No learner identity, grade, assessment,
   persistence, or mastery authority. Shared shell for Grades 9–12. */
(()=>{"use strict";
if(document.getElementById("khae-class-tools-left"))return;
const path=location.pathname.toLowerCase();
if(/\/(?:assessment|assessments|diagnostic)\//.test(path))return;
const match=path.match(/\/courses\/language-arts\/(english-(?:9|10|11|12))\//);
if(!match)return;
const subject=match[1];
const high="/Khaemenes_High.github.io/";
const home=high+"courses/language-arts/"+subject+"/";
const destinations=[
 ["Reading",home+"learning-tools.html#literary-toolbox","English literature, language, writing, research and word-study resource directory"],
 ["Writing",home+"evidence-studio.html","Reading-to-Writing Evidence Studio"],
 ["Lessons",home+"weeks/week-01/index.html","Start the first English lesson"],
 ["Assess",home+"assessments/","Official English assessments"],
 ["Search","https://vervenveda.com/PLERASearch.github.io/","Explore learning resources"],
 ["Parent","https://vervenveda.com/Khaemenes_Academy.github.io/family/","Family and parent resources"]
];
const style=document.createElement("style");
style.id="khae-class-tools-left-style";
style.textContent=`
#khae-class-tools-left{position:fixed;left:14px;bottom:16px;z-index:989;width:min(284px,calc(100vw - 28px));font:400 16px/1.4 Nunito,"Avenir Next",Arial,sans-serif;color:#fff8eb}
#khae-class-tools-left details{background:#222b2a;border:1px solid #bb9b62;border-radius:7px;box-shadow:0 10px 28px rgba(0,0,0,.22)}
#khae-class-tools-left summary{display:block;cursor:pointer;padding:12px 16px;color:#fff8eb;font-size:16px;text-align:center;list-style:none}
#khae-class-tools-left summary::-webkit-details-marker{display:none}
#khae-class-tools-left summary:focus-visible,#khae-class-tools-left a:focus-visible,#khae-class-tools-left button:focus-visible{outline:3px solid #d9b65d;outline-offset:2px}
#khae-class-tools-left .tools-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;padding:10px}
#khae-class-tools-left .tools-grid :is(a,button){display:flex;min-width:0;min-height:44px;align-items:center;justify-content:center;text-align:center;white-space:nowrap;padding:8px 5px;border:1px solid #c4a46b;border-radius:7px;background:#303a37;color:#fff8eb;font:400 16px/1.25 Nunito,Arial,sans-serif;text-decoration:none;cursor:pointer}
#khae-class-tools-left p{font-size:16px;line-height:1.45;margin:0;padding:0 12px 12px;color:#f5eedf;text-align:center}
@media print{#khae-class-tools-left{display:none!important}}
@media(max-width:720px){#khae-class-tools-left{left:7px;bottom:150px;width:min(248px,calc(100vw - 14px))}}
`;
document.head.append(style);
const dock=document.createElement("aside");
dock.id="khae-class-tools-left";
dock.setAttribute("aria-label","English learning tools");
const details=document.createElement("details");
const summary=document.createElement("summary");summary.textContent="Tools";
details.append(summary);
const grid=document.createElement("nav");grid.className="tools-grid";grid.setAttribute("aria-label","English course resources");
for(const [label,href,title] of destinations){const a=document.createElement("a");a.textContent=label;a.href=href;a.title=title;grid.append(a);}
const print=document.createElement("button");print.type="button";print.textContent="Print";print.title="Print this lesson";print.addEventListener("click",()=>window.print());
const course=document.createElement("a");course.textContent="Course";course.href=home;course.title="English course home";
grid.append(print,course);details.append(grid);
const note=document.createElement("p");note.textContent="Tools support learning; course mastery and grades remain separate.";details.append(note);dock.append(details);
const mount=()=>{if(!document.getElementById(dock.id))document.body.append(dock);};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
