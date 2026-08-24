(() => {
  "use strict";

  const STORAGE_KEY = "KHAEMENES_MATH_READINESS_V1";
  const COURSE_PATHS = new Set([
    "pre-algebra",
    "algebra-1",
    "geometry",
    "algebra-2",
    "precalculus-trigonometry",
    "calculus-1"
  ]);

  function safeRead(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw || raw.length > 500000) return null;
      const value = JSON.parse(raw);
      return value && typeof value === "object" ? value : null;
    }catch{return null;}
  }

  function courseIdFromPath(){
    const parts = location.pathname.split("/").filter(Boolean);
    const mathIndex = parts.lastIndexOf("mathematics");
    const candidate = mathIndex >= 0 ? parts[mathIndex + 1] : "";
    return COURSE_PATHS.has(candidate) ? candidate : null;
  }

  function recommendationMatches(courseId, result){
    const target = String(result?.recommendedCourseId || result?.recommendedCourse || "").toLowerCase();
    if(!target) return false;
    return target.includes(courseId) || target.replaceAll(" ","-").includes(courseId);
  }

  function addLink(host, href, label){
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    host.appendChild(document.createTextNode(" "));
    host.appendChild(a);
  }

  function createNotice(){
    const courseId = courseIdFromPath();
    if(!courseId || document.querySelector("[data-khae-readiness-bridge]")) return;

    const box = document.createElement("section");
    box.dataset.khaeReadinessBridge = "true";
    box.setAttribute("aria-label","Mathematics readiness information");
    box.style.cssText = "margin:14px auto;padding:14px 16px;max-width:1100px;border:1px solid rgba(166,123,53,.45);border-radius:12px;background:#fffaf0;color:#1f2933;font:14px/1.55 system-ui,sans-serif";

    const strong = document.createElement("strong");
    const body = document.createElement("span");
    box.append(strong, body);

    if(courseId === "pre-algebra"){
      strong.textContent = "Pre-Algebra entrance policy: ";
      body.textContent = "The shared mathematics readiness record is advisory evidence only. The required course entrance remains the NAIB readiness gateway and, when assigned, Unit 0. A shared readiness result cannot unlock or bypass those gates.";
      addLink(box,"../pre-algebra/diagnostic/","Open NAIB readiness gateway");
    }else{
      const result = safeRead();
      if(!result){
        strong.textContent = "Optional readiness check: ";
        body.textContent = "Use the shared Khaemenes mathematics readiness assessment before beginning this course if placement evidence would be helpful. It is advisory and does not count toward course completion.";
      }else{
        const recommended = String(result.recommendedCourseLabel || result.recommendedCourse || "a mathematics course").slice(0,120);
        const review = Array.isArray(result.reviewDomains)
          ? result.reviewDomains.map(value=>String(value).slice(0,60)).slice(0,8)
          : [];
        strong.textContent = recommendationMatches(courseId,result) ? "Readiness match: " : "Readiness record available: ";
        body.textContent = `Your saved placement recommendation is ${recommended}.${review.length ? ` Suggested review: ${review.join(", ")}.` : ""} This recommendation is advisory.`;
      }
      addLink(box,"../readiness/","Review or reassess");
    }

    const target = document.querySelector("main, .main, #main") || document.body;
    target.insertBefore(box,target.firstChild);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",createNotice,{once:true});
  else createNotice();
})();
