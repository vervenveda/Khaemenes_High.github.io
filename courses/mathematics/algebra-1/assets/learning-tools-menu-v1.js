/* Algebra I non-grading learning tools menu; optional, no storage or mastery changes. */
(()=>{"use strict";
if(document.getElementById("khae-algebra1-tool-menu")||/\/(?:assessment|assessments|diagnostic)\//.test(location.pathname))return;
const links=[
 ["Scientific calculator","https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/"],
 ["Slope & Rate Studio","https://vervenveda.github.io/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/slope-and-rate-studio/"],
 ["Quadratic Graph Lab","https://vervenveda.github.io/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/quadratic-graph-lab/"],
 ["PROSE · ProTools","https://vervenveda.github.io/proresource_hub.github.io/"]
];
function mount(){
 if(document.getElementById("khae-algebra1-tool-menu"))return;
 const root=document.createElement("aside");root.id="khae-algebra1-tool-menu";root.setAttribute("aria-label","Algebra I learning tools");
 const style=document.createElement("style");style.textContent=`
 #khae-algebra1-tool-menu{position:fixed;right:14px;bottom:16px;z-index:990;max-width:min(310px,calc(100vw - 28px));font:400 15px/1.5 "Avenir Next",Arial,sans-serif;color:#f6f0df}
 #khae-algebra1-tool-menu details{background:#172c40;border:1px solid #ae9467;border-radius:7px;box-shadow:0 8px 24px #0005}
 #khae-algebra1-tool-menu summary{cursor:pointer;padding:11px 16px;list-style-position:inside}
 #khae-algebra1-tool-menu nav{display:grid;gap:5px;padding:0 12px 12px}
 #khae-algebra1-tool-menu a{display:block;color:#f6f0df;text-decoration:underline;text-underline-offset:3px;padding:7px 6px;border-radius:7px}
 #khae-algebra1-tool-menu a:focus-visible,#khae-algebra1-tool-menu summary:focus-visible{outline:2px solid #f0d58a;outline-offset:2px}
 #khae-algebra1-tool-menu p{margin:4px 5px 0;font-size:12px;line-height:1.4;color:#ebdab7}
 @media print{#khae-algebra1-tool-menu{display:none!important}}`;
 root.innerHTML="<details><summary>Learning Tools ▾</summary><nav aria-label='Learning tools links'></nav></details>";
 const nav=root.querySelector("nav");
 links.forEach(([label,url])=>{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label;nav.append(a)});
 const note=document.createElement("p");note.textContent="Practice and lessons: show your reasoning. Follow assessment tool rules during tests.";nav.append(note);
 document.head.append(style);document.body.append(root);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();