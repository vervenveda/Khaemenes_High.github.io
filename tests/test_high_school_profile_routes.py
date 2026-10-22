#!/usr/bin/env python3
"""Read-only checks for High School grade-profile navigation and learner-scope guards."""
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
for grade in range(9,13):
    prefix=ROOT / f"grades/grade-{grade:02d}"
    landing=(prefix/"index.html").read_text(encoding="utf-8")
    profile=(prefix/"student-profile/index.html").read_text(encoding="utf-8")
    assert 'data-khae-secondary href="student-profile/"' in landing, f"Grade {grade} landing points away from profile"
    assert 'data-khae-secondary href="./"' in profile, f"Grade {grade} dashboard loops to portal"
    assert (prefix/"student-profile/index.html").is_file()
    if grade==9:
        assert (prefix/"student-profile/profile/index.html").is_file(), "Grade 9 editor missing"
        assert 'href="profile/"' in profile, "Grade 9 editor not linked"
    else:
        assert "upper-grade-seven-class.js" in profile, f"Grade {grade} course dashboard missing"
        if grade==10:
            assert 'id="grade10Personalize"' in profile
            script=prefix/"student-profile/personalize.js"
        else:
            assert 'id="upperGradePersonalize"' in profile
            script=ROOT/"grades/shared/upper-grade-personalize.js"
        assert script.is_file() and script.name in profile
        code=script.read_text(encoding="utf-8")
        assert "sameLearner()" in code and "learnerId" in code, f"Grade {grade} preference scope guard missing"
    print(f"PASS Grade {grade} profile route and editor wiring")
print("PASS High School grade-profile structural checks; interactive login tests remain separate")

shared=(ROOT/"grades/shared/upper-grade-profile-enhancements.js").read_text(encoding="utf-8")
for required in ("pageshow", "focus", "khaemenes_active_learner_v1", "goal.value=\"\"", "save.disabled=true", "exportBtn.disabled=true", "localStorage.getItem(originalKey)"):
    assert required in shared, f"Profile return-visit safety check absent: {required}"
print("PASS Grade 10–12 return-visit restoration and cross-learner concealment wiring")

theme=(ROOT/"grades/shared/student-profile-theme-photo.js").read_text(encoding="utf-8")
for grade in (10,11,12):
    html=(ROOT/f"grades/grade-{grade:02d}/student-profile/index.html").read_text(encoding="utf-8")
    assert 'student-profile-theme-photo.js' in html
assert 'color.type="color"' in theme and 'file.type="file"' in theme
assert 'canvas.toDataURL("image/jpeg"' in theme
assert 'api?.activeLearner' in theme and 'function guard()' in theme
assert 'URL.revokeObjectURL(url)' in theme
print("PASS Grades 10–12 color and private portrait integration wiring")

for grade in range(9,13):
    html=(ROOT/f"grades/grade-{grade:02d}/student-profile/index.html").read_text(encoding="utf-8")
    assert 'student-achievements-dreams.js' in html, f"Grade {grade} dream board missing"
shared_dreams=(ROOT/"grades/shared/student-achievements-dreams.js").read_text(encoding="utf-8")
for requirement in ("achievement-constellation", "dream-discovery-board", "readAcademyProfile", "localStorage.setItem(boardKey", "khae-learning-portfolio-v1:learner:"):
    assert requirement in shared_dreams, f"Missing dream/constellation safeguard: {requirement}"
print("PASS Grades 9–12 evidence stars and learner-scoped dream board wiring")

journey=(ROOT/"grades/shared/student-learning-journey.js").read_text(encoding="utf-8")
for grade in range(9,13):
    html=(ROOT/f"grades/grade-{grade:02d}/student-profile/index.html").read_text(encoding="utf-8")
    assert 'student-learning-journey.js' in html, f"Grade {grade} journey popup missing"
for token in ("showModal()", 'dialog.close()', "readAcademyProfile", "futureSelfLetter", "localStorage.setItem(notesKey", "if(!authorized())return"):
    assert token in journey, f"Journey safety or control missing: {token}"
print("PASS Grades 9–12 private journey popup integration")

for token in ('type="date"', 'khaemenes-future-letter-v2', 'storedLetter.openDate>today()', 'sealed:true', 'function readLetter()', 'function presentLetter()'):
    assert token in journey, f"Future Self sealed-letter control missing: {token}"
print("PASS Future Self opening-date and sealed export guards wired")

progress=(ROOT/"grades/shared/student-course-progress-bars.js").read_text(encoding="utf-8")
for grade in range(9,13):
    html=(ROOT/f"grades/grade-{grade:02d}/student-profile/index.html").read_text(encoding="utf-8")
    assert 'student-course-progress-bars.js' in html, f"Grade {grade} progress widget missing"
for token in ('readLearner?.(initial)', 'snap?.progress?.percent', 'Not reported', 'aria-valuenow', 'learnerId()!==initial'):
    assert token in progress, f"Course progress read-only guard missing: {token}"
print("PASS Grades 9–12 source-reported progress bar integration")
