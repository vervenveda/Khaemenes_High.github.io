/* Grade 09 toolbar connectivity probe. Browser console only; NO CLICKS, NO STORAGE READ/WRITE, NO NAVIGATION. */
(()=>{"use strict";
  const expected=[
    ["Schedule","grade09ScheduleDialog"],
    ["Student Progress","grade09ClassProgressDialog"],
    ["Student Portfolio",null],
    ["KlasaiPeer","grade09StudyStudioDialog"],
    ["Edit Profile",null],
    ["Edit Background","grade09BackgroundDialog"],
    ["Yearbook","grade09YearbookDialog"],
    ["Creative Tools","khaeStudentEcosystemTools"]
  ];
  const rail=document.getElementById("khaeProfileToolRail");
  const controls=rail?[...rail.querySelectorAll("a.grade09-profile-tool,button.grade09-profile-tool")]:[];
  const result=expected.map(([label,id],n)=>{
    const matches=controls.filter(el=>el.textContent.trim()===label);
    const el=matches[0],target=id&&document.getElementById(id);
    const href=el?.tagName==="A"?el.href:null;
    const visible=!!el&&getComputedStyle(el).display!=="none"&&getComputedStyle(el).visibility!=="hidden"&&el.getClientRects().length>0;
    const targetOk=label==="Student Progress"?(!!target||!!document.getElementById("studentCourseProgress")):
      label==="Creative Tools"?!!target:
      label==="KlasaiPeer"?!!target&&typeof window.KhaemenesGrade09StudyStudio?.open==="function":
      label==="Yearbook"?!!target&&typeof window.KhaemenesGrade09Yearbook?.open==="function":
      label==="Student Portfolio"||label==="Edit Profile"?!!href:
      !!target;
    return {position:n+1,button:label,count:matches.length,visible,targetPresent:!!target,
      destination:href?new URL(href).pathname:"dialog/section",
      status:matches.length!==1?"BUTTON_MISSING_OR_DUPLICATED":!visible?"HIDDEN":
        !targetOk?"TARGET_OR_HANDLER_MISSING":el.disabled?"DISABLED":"WIRED_STATIC_CHECK"};
  });
  console.table(result);
  console.log("GRADE09_TOOLBAR_READ_ONLY_AUDIT",{
    origin:location.origin,buttonCount:controls.length,
    staticWired:result.filter(r=>r.status==="WIRED_STATIC_CHECK").length,
    problems:result.filter(r=>r.status!=="WIRED_STATIC_CHECK").map(r=>r.button),
    note:"Static DOM audit only. Does not test click handlers, HTTP status, actual dialog opening or course navigation."
  });
  return result;
})();
