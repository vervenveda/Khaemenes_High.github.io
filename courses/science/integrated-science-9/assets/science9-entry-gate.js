(() => {
  "use strict";
  const contract = window.KhaemenesCourseEntryContract;
  const essentials = ["Scientific practices", "Measurement", "Data and evidence"];
  const courseId = "integrated-science-9";

  function decision() {
    const profile = contract?.readAcademyProfile?.();
    if (!profile) return {
      allow: false,
      title: "Choose your learner",
      message: "Select your learner in the Academy Family Portal before opening Science 9. Course records stay separated by Academy learner.",
      href: "https://vervenveda.com/Khaemenes_Academy.github.io/",
      label: "Return to Academy sign-in"
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
    if (result.allow) return;
    document.documentElement.dataset.science9EntryBlocked = "true";
    const gate = document.createElement("section");
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "science9EntryTitle");
    gate.style.cssText = "position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:#07131df2;color:#fff";
    const card = document.createElement("article");
    card.style.cssText = "max-width:640px;padding:28px;border:1px solid #62c8c0;border-radius:11px;background:#102437";
    const title = document.createElement("h1");
    title.id = "science9EntryTitle";
    title.textContent = result.title;
    title.style.fontWeight = "400";
    const message = document.createElement("p");
    message.textContent = result.message;
    const open = document.createElement("a");
    open.href = result.href;
    open.textContent = result.label;
    open.style.cssText = "display:inline-block;padding:12px 16px;border-radius:7px;background:#62c8c0;color:#071815;text-decoration:none";
    const home = document.createElement("a");
    home.href = "../";
    home.textContent = "Science Department";
    home.style.cssText = "display:inline-block;margin-left:10px;padding:12px 16px;border:1px solid #b8c5cc;border-radius:7px;color:#fff;text-decoration:none";
    card.append(title, message, open, home);
    gate.append(card);
    document.querySelectorAll("body > :not(script)").forEach(node => { node.inert = true; });
    document.body.append(gate);
    open.focus();
  }

  const result = decision();
  window.KhaemenesScience9Entry = Object.freeze({ decision: () => result });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => mount(result), { once: true });
  else mount(result);
})();
