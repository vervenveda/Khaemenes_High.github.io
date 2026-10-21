"use strict";
(()=>{
  // Shared print-only student evidence header; never reads or changes learner records.
  const match=location.pathname.match(/\/units\/unit-(\d{2})\/lessons\/day-(\d{2})\.html$/i);
  if(!match)return;
  const mount=()=>{
    const article=document.querySelector("article.lesson-page");
    if(!article||article.querySelector(".science-evidence-heading"))return;
    const heading=document.createElement("section");
    heading.className="science-evidence-heading";
    heading.setAttribute("aria-label","Printable student evidence identification");
    const title=document.createElement("p");
    title.textContent="Khaemenes Academy · Grade 9 · Science · Unit "+match[1]+" · Lesson "+match[2];
    const fields=document.createElement("p");
    fields.textContent="Student name: __________________________________ Date: __________________";
    heading.append(title,fields);
    article.prepend(heading);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
  else mount();
})();