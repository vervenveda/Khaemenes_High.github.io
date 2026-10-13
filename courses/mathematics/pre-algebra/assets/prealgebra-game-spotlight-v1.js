(() => {
"use strict";
function mount(options) {
  const o=options||{};
  if(!o.url||!o.game||document.getElementById("prealgebraLessonGameSpotlight"))return;
  const main=document.querySelector("main");if(!main)return;
  const target=document.createElement("section");
  target.id="prealgebraLessonGameSpotlight";
  target.setAttribute("aria-label","Lesson game and skill connection");
  target.style.cssText="margin:18px auto;padding:20px;max-width:1100px;background:#fff9ed;color:#29251e;border:2px solid #a98954;border-radius:7px;";
  function add(tag,label,style){const el=document.createElement(tag);el.textContent=label;if(style)el.style.cssText=style;target.appendChild(el);return el;}
  add("p","Lesson game · Targeted skill practice","margin:0 0 8px;color:#665037;font:600 14px/1.4 system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;");
  add("h2",o.title||o.game.replace(/-/g," "),"margin:0 0 8px;color:#29251e;font:400 24px/1.3 Georgia,serif;");
  add("p","Lesson focus: "+(o.focus||"the mathematical objective in this lesson"),"margin:0 0 8px;color:#29251e;font:400 15px/1.5 system-ui,sans-serif;");
  add("p","Play the related game, then return to the lesson for its examples, written assignment and 80% mastery check. Game practice is not an official lesson grade.","margin:0 0 14px;color:#51463a;font:400 14px/1.5 system-ui,sans-serif;");
  const row=add("div","");row.style.cssText="display:flex;gap:10px;flex-wrap:wrap;";
  const link=document.createElement("a");link.href=o.url;link.textContent="Play "+(o.title||o.game.replace(/-/g," "))+" →";
  link.style.cssText="display:inline-flex;align-items:center;min-height:44px;padding:11px 15px;border-radius:7px;background:#44372b;color:white;text-decoration:none;font:500 15px/1.4 system-ui,sans-serif;";
  row.appendChild(link);
  if(o.extra){
    const other=document.createElement("a");other.href=o.extra;other.textContent="Application game · Group or Cycle? →";
    other.style.cssText="display:inline-flex;align-items:center;min-height:44px;padding:11px 15px;border:1px solid #927b53;border-radius:7px;background:white;color:#29251e;text-decoration:none;font:500 14px/1.4 system-ui,sans-serif;";
    row.appendChild(other);
  }
  const hero=main.querySelector(".hero,.lesson-header,.lesson-hero");
  if(hero&&hero.parentNode===main)hero.insertAdjacentElement("afterend",target);
  else main.insertBefore(target,main.firstChild);
}
window.KhaemenesPreAlgebraGameSpotlight=Object.freeze({mount});
})();