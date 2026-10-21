"use strict";
/* Optional Academy-wide evidence route: navigation only. No persistence, grading or network calls. */
(()=>{
const script=document.currentScript;
const base=new URL("./",script?.src||location.href);
const routes=[
 ["Shared evidence convention","ACADEMIC_EVIDENCE_CONVENTION_V1.md","Eight-part Academy reporting standard"],
 ["Optional evidence companion","../science/integrated-science-9/academic-evidence-companion.html","Print or export research, vocabulary and reflections"]
];
function mount(){
 if(document.getElementById("khEvidenceAdoption"))return;
 const host=document.createElement("aside");host.id="khEvidenceAdoption";host.setAttribute("aria-label","Academy-wide academic evidence");
 const h=document.createElement("h2");h.textContent="Connected Academy evidence";host.append(h);
 const intro=document.createElement("p");intro.textContent="Use one consistent homeschool evidence format across subjects. This optional companion does not submit grades or modify course progress.";host.append(intro);
 for(const [name,path,detail] of routes){const a=document.createElement("a");a.href=new URL(path,base).href;a.textContent=name;const p=document.createElement("p");p.append(a,document.createTextNode(" — "+detail));host.append(p)}
 const style=document.createElement("style");style.textContent="#khEvidenceAdoption{box-sizing:border-box;max-width:950px;width:calc(100% - 18px);margin:24px auto;padding:17px;border:1px solid #aeaa9c;border-radius:7px;background:#faf5e9;color:#292d30;overflow-wrap:anywhere;font:400 17px/1.55 'Brandon Grotesque','Avenir Next',Arial,sans-serif}#khEvidenceAdoption h2{font-size:23px;font-weight:400;margin:0 0 9px}#khEvidenceAdoption p{margin:8px 0}#khEvidenceAdoption a{color:#195578;text-decoration:underline}#khEvidenceAdoption a:focus-visible{outline:3px solid #176c90;outline-offset:3px}@media(max-width:280px){#khEvidenceAdoption{padding:9px}}@media print{#khEvidenceAdoption{display:none!important}}";document.head.append(style);
 const footer=document.querySelector("footer");if(footer)footer.before(host);else document.body.append(host);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();