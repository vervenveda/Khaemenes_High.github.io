(() => {
  "use strict";
  const contract = window.KhaemenesCourseEntryContract;
  const essentials = ["Scientific practices", "Measurement", "Data and evidence"];
  const courseId = "integrated-science-9";

  function decision() {
    const profile = contract?.readAcademyProfile?.();
    if (!profile) return {
      allow: false,
      title: "Choose your Academy learner",
      message: "Science 9 cannot identify the learner selected in this browser. Select your existing Academy student profile to keep lessons, scores and evidence attached to the right learner.",
      href: "https://vervenveda.com/Khaemenes_Academy.github.io/student/",
      label: "Choose My Student Profile",
      kind: "learner"
    };
    const readiness = contract.readJSON("khaemenes_naib_readiness_science9_v1", [], profile);
    const latest = contract.latest(readiness);
    if (contract.isReady(latest, essentials, courseId)) return { allow: true, profile };
    const foundation = contract.readJSON("khaemenes_science_foundations_v1", null, profile);
    if (foundation?.readiness?.route === "advance" && foundation.readiness.status === "mastered") return { allow: true, profile, pathway: "supported_42_week" };
    if (latest?.route === "unit_0_refresher") return {
      allow: false,
      title: "Continue Science Foundations",
      message: "This readiness result recommends the six-week Science Foundations pathway before Official Unit 1. Take the time you need; the route remains available without a deadline.",
      href: "foundations/",
      label: "Open Science Foundations"
    };
    return {
      allow: false,
      title: "Begin with Science readiness",
      message: "This low-stakes check identifies the support that will make the 36-week course safer and more useful. Complete it at your own pace.",
      href: "diagnostic/readiness-diagnostic.html",
      label: "Open readiness diagnostic"
    };
  }

  function mount(result) {
    if(result.allow || document.getElementById("science9EntryGate")) return;
    document.documentElement.dataset.science9EntryBlocked="true";
    const learnerMissing=result.kind==="learner";
    const make=(tag,words,style,id)=>{
      const el=document.createElement(tag);
      if(id)el.id=id;
      if(words!==null)el.textContent=words;
      if(style)el.style.cssText=style;
      return el;
    };
    const sans="'Brandon Grotesque','Avenir Next','Segoe UI',Arial,sans-serif";
    const ink="#20241f";
    const gate=make("section",null,
      "position:fixed!important;inset:0!important;z-index:2147483000!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:clamp(14px,4vw,32px)!important;overflow:auto!important;background:#eee9df!important;color:#20241f!important;",
      "science9EntryGate");
    gate.setAttribute("role","dialog");
    gate.setAttribute("aria-modal","true");
    gate.setAttribute("aria-labelledby","science9EntryTitle");
    gate.setAttribute("aria-describedby","science9EntryDescription");
    const card=make("article",null,
      "box-sizing:border-box!important;width:min(100%,720px)!important;margin:auto!important;padding:clamp(20px,4vw,40px)!important;border:2px solid #b9aa90!important;border-top:7px solid #1e534c!important;border-radius:11px!important;background:#fffdf7!important;color:#20241f!important;box-shadow:0 16px 46px rgba(36,39,34,.13)!important;font:400 17px/1.6 "+sans+"!important;");
    const eyebrow=make("p","KHAEMENES ACADEMY · INTEGRATED SCIENCE 9",
      "color:#39453f!important;font:400 13px/1.5 "+sans+"!important;letter-spacing:.08em!important;margin:0 0 12px!important;");
    const heading=make("h1",result.title,
      "color:#20241f!important;font:400 clamp(25px,4vw,35px)/1.25 Cinzel,Georgia,serif!important;letter-spacing:0!important;margin:0 0 16px!important;","science9EntryTitle");
    const summary=make("p",result.message,
      "color:#20241f!important;font:400 17px/1.65 "+sans+"!important;margin:0 0 18px!important;","science9EntryDescription");
    const instructions=make("div",null,
      "padding:18px 20px!important;margin-bottom:22px!important;background:#f3efe6!important;color:#20241f!important;border:1px solid #c7bdab!important;border-radius:7px!important;");
    const stepsHeader=make("h2",learnerMissing?"How to enter your classroom":"What to do next",
      "color:#20241f!important;font:400 21px/1.35 Cinzel,Georgia,serif!important;margin:0 0 10px!important;");
    const ordered=make("ol",null,
      "color:#20241f!important;padding-left:24px!important;margin:0!important;font:400 16px/1.6 "+sans+"!important;");
    const steps=learnerMissing?[
      "Open the Student Portal using the button below.",
      "Select your existing learner. Do not create another account.",
      "Return to Science 9. If needed, the readiness check will guide your next lesson."
    ]:[
      "Open the recommended readiness or Science Foundations activity.",
      "Complete it at your own pace under your selected Academy learner.",
      "Return to Integrated Science 9 when ready."
    ];
    steps.forEach(s=>ordered.append(make("li",s,
      "color:#20241f!important;font:400 16px/1.6 "+sans+"!important;margin:6px 0!important;")));
    instructions.append(stepsHeader,ordered);
    const actionRow=make("nav",null,"display:flex!important;flex-wrap:wrap!important;gap:10px!important;margin-bottom:15px!important;");
    actionRow.setAttribute("aria-label","Science 9 entrance actions");
    function action(href,label,primary){
      const link=make("a",label,"box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:48px!important;padding:12px 15px!important;border:2px solid "+(primary?"#173e37":"#737d76")+"!important;border-radius:7px!important;background:"+(primary?"#173e37":"#fffdf7")+"!important;color:"+(primary?"#ffffff":ink)+"!important;text-decoration:none!important;font:600 15px/1.3 "+sans+"!important;text-align:center!important;white-space:normal!important;");
      link.href=href;
      return link;
    }
    const primary=action(result.href,result.label,true);
    actionRow.append(primary);
    if(learnerMissing)actionRow.append(action("https://vervenveda.com/Khaemenes_Academy.github.io/family/","Find Existing Learner",false));
    actionRow.append(action("../","Science Department",false));
    const note=make("p",learnerMissing
      ?"Already enrolled? This page does not erase or reset your work. If your student is missing, try the Chrome profile where the learner was originally set up, or check the Family Learning Center. Do not create a duplicate profile."
      :"Your existing student records and readiness evidence remain unchanged; this screen does not award mastery.",
      "color:#39453f!important;font:400 14px/1.55 "+sans+"!important;margin:0!important;");
    card.append(eyebrow,heading,summary,instructions,actionRow,note);
    gate.append(card);
    document.querySelectorAll("body > :not(script)").forEach(node=>{node.inert=true;});
    document.body.append(gate);
    primary.focus();
  }

  const result = decision();
  window.KhaemenesScience9Entry = Object.freeze({ decision: () => result });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => mount(result), { once: true });
  else mount(result);
})();
