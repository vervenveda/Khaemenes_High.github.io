(() => {
  "use strict";

  const STORAGE_KEY = "KHAEMENES_MATH_READINESS_V1";
  const COURSE_PATHS = {
    "pre-algebra":"pre-algebra",
    "algebra-1":"algebra-1",
    "geometry":"geometry",
    "algebra-2":"algebra-2",
    "precalculus-trigonometry":"precalculus-trigonometry",
    "calculus-1":"calculus-1"
  };

  function safeRead(){
    try{
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return value && typeof value === "object" ? value : null;
    }catch{return null;}
  }

  function courseIdFromPath(){
    const parts = location.pathname.split("/").filter(Boolean);
    const mathIndex = parts.lastIndexOf("mathematics");
    const candidate = mathIndex >= 0 ? parts[mathIndex + 1] : "";
    return COURSE_PATHS[candidate] ? candidate : null;
  }

  function recommendationMatches(courseId, result){
    const target = String(result?.recommendedCourseId || result?.recommendedCourse || "").toLowerCase();
    if(!target) return false;
    return target.includes(courseId) || target.replaceAll(" ","-").includes(courseId);
  }

  function createNotice(){
    const result = safeRead();
    const courseId = courseIdFromPath();
    if(!courseId || document.querySelector("[data-khae-readiness-bridge]")) return;

    const box = document.createElement("section");
    box.dataset.khaeReadinessBridge = "true";
    box.setAttribute("aria-label","Mathematics readiness information");
    box.style.cssText = "margin:14px auto;padding:14px 16px;max-width:1100px;border:1px solid rgba(166,123,53,.45);border-radius:12px;background:#fffaf0;color:#1f2933;font:14px/1.55 system-ui,sans-serif";

    const readinessHref = "../readiness/";
    if(!result){
      box.innerHTML = `<strong>Optional readiness check:</strong> If you have not completed mathematics placement yet, use the shared Khaemenes readiness assessment before beginning this course. It is advisory and does not count toward course completion. <a href="${readinessHref}">Open readiness assessment</a>`;
    }else{
      const recommended = result.recommendedCourseLabel || result.recommendedCourse || "a mathematics course";
      const reviewed = Array.isArray(result.reviewDomains) && result.reviewDomains.length
        ? ` Suggested review: ${result.reviewDomains.join(", ")}.`
        : "";
      const match = recommendationMatches(courseId,result);
      box.innerHTML = `<strong>${match ? "Readiness match" : "Readiness record available"}:</strong> Your saved placement recommendation is <strong>${String(recommended)}</strong>.${reviewed} This recommendation is advisory; authorized learners, families, and instructors may choose another appropriate pathway. <a href="${readinessHref}">Review or reassess</a>`;
    }

    const target = document.querySelector("main, .main, #main") || document.body;
    target.insertBefore(box,target.firstChild);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",createNotice,{once:true});
  else createNotice();
})();
