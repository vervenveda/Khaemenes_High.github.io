/* Grade 09-approved Explore, Create & Celebrate architecture for Grades 10–12.
 * Moves existing presentation nodes only; no records, grades, pins or course state written.
 * Idempotent even when the entry script is included twice.
 */
(()=>{"use strict";
const grade=Number(document.body?.dataset.grade);
if(![10,11,12].includes(grade)||document.getElementById("grade09Explore"))return;
const main=document.querySelector("main");
if(!main)return;
const make=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
const region=make("section");region.id="grade09Explore";region.className="grade09-explore";
region.append(make("h2","Explore, Create & Celebrate"),make("p","Your creative spaces, personal dreams and earned stickers—organized together so daily classes stay easy to find."));
function panel(label,id){
 const details=make("details");details.className="grade09-explore-item";
 if(id)details.id=id;
 details.append(make("summary",label));
 region.append(details);return details;
}
for(const [id,label] of [
 ["khaeStudentEcosystemTools","Creative & Discovery Tools"],
 ["khaeDreamsAchievements","Achievements & Dream Board"]
]){
 const node=document.getElementById(id);
 if(!node)continue;
 const details=panel(label);
 details.append(node);
 node.style.margin="0";node.style.maxWidth="none";
}
const sticker=panel("My Sticker Box");
const stickerButton=make("button","Open My Sticker Box");stickerButton.type="button";
stickerButton.className="btn secondary";
stickerButton.addEventListener("click",()=>{
 const dialog=window.KhaemenesGrade09StickerBoxDialog;
 if(dialog?.open)dialog.open(stickerButton);
});
sticker.append(stickerButton);
const studio=panel("My Academy Profile Studio","grade09ExploreAcademyStudio");
const studioBody=make("div");studioBody.className="grade09-yearbook-explore-body grade09-explore-editorial-panel";
studioBody.append(make("h3","Your Academy Profile Studio"),
 make("p","Your registered Grade "+grade+" editor manages personal details and preferences. The Academy Learning Profile maintains its own records."));
const studioActions=make("div");studioActions.className="grade09-yearbook-explore-actions";
const edit=make("a","Edit My Profile");edit.href="profile/";
const academy=make("a","Open My Academy Profile Studio");
academy.href="https://vervenveda.com/Khaemenes_Academy.github.io/student/profile.html#profileStudio";
studioActions.append(edit,academy);
const journey=make("div");journey.id="grade09ExploreJourneyActions";
journey.className="grade09-yearbook-explore-actions";
studioBody.append(studioActions,journey);studio.append(studioBody);
const yearbook=panel("My School Yearbook","grade09ExploreYearbook");
const yearbookBody=make("div");yearbookBody.className="grade09-yearbook-explore-body grade09-explore-editorial-panel";
yearbookBody.append(make("h3","Your School Yearbook"),
 make("p","Create and preserve memories in the existing Yearbook Studio. Export a backup there to keep your photographs."));
const yearbookLink=make("a","Open Full Yearbook");yearbookLink.href="https://vervenveda.com/Academy-Yearbook.github.io/";
yearbookLink.target="_blank";yearbookLink.rel="noopener noreferrer";
const yearbookActions=make("div");yearbookActions.className="grade09-yearbook-explore-actions";
yearbookActions.append(yearbookLink);yearbookBody.append(yearbookActions);yearbook.append(yearbookBody);
main.append(region);
})();
