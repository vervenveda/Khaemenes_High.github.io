"""Shared Social Studies evidence printout, Grade 9-12."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import pytest
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE="/courses/social-studies/"
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
@pytest.fixture(scope="module")
def site():
 server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
 worker=Thread(target=server.serve_forever,daemon=True);worker.start()
 yield f"http://127.0.0.1:{server.server_port}"
 server.shutdown();worker.join(timeout=3)
@pytest.fixture(scope="module")
def browser():
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,args=["--no-sandbox"]);yield b;b.close()
@pytest.mark.parametrize("grade",[9,10,11,12])
def test_grade_entrance_links_to_printout(site,browser,grade):
 page=browser.new_page()
 url=site+BASE+f"grade-{grade:02d}/index.html"
 assert page.goto(url,wait_until="domcontentloaded").status==200
 link=page.locator("a[href*='academic-evidence-printout.html']")
 assert link.count()>=1
 assert page.request.get(site+BASE+"tools/academic-evidence-printout.html?grade="+str(grade)).status==200
 page.close()
@pytest.mark.parametrize("grade",[9,10,11,12])
def test_evidence_fields_and_print(site,browser,grade):
 page=browser.new_page(viewport={"width":255,"height":760})
 assert page.goto(site+BASE+f"tools/academic-evidence-printout.html?grade={grade}&unit=3&lesson=Week%205",wait_until="domcontentloaded").status==200
 for name in ["student","date","grade","subject","unit","lesson","title","assignment","findings","visual","citations","limitations","reviewer","reviewdate","feedback","signature"]:
  assert page.locator(f'[name="{name}"]').count()==1,name
 assert page.locator('[name="grade"]').input_value()==str(grade)
 assert page.locator('[name="unit"]').input_value()=="3"
 assert page.locator('[name="lesson"]').input_value()=="Week 5"
 page.locator('[name="student"]').fill("Sample Student")
 page.locator('[name="citations"]').fill("Source: sample archival reference")
 page.emulate_media(media="print")
 assert len(page.pdf(format="A4"))>1000
 page.emulate_media(media="screen")
 assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2")
 page.close()

import json

@pytest.mark.parametrize("grade",[9,10,11,12])
@pytest.mark.parametrize("week",[1,6,18,36])
def test_weekly_evidence_link_and_prefill(site,browser,grade,week):
 page=browser.new_page()
 url=site+BASE+f"grade-{grade:02d}/weeks/week-{week:02d}/student-packet.html"
 assert page.goto(url,wait_until="domcontentloaded").status==200
 link=page.locator("[data-academic-portfolio-link] a")
 assert link.count()==1,(grade,week)
 assert "Save Academic Evidence" in link.inner_text()
 href=link.get_attribute("href")
 assert f"grade={grade}" in href and f"Week+{week}" in href
 assert page.request.get(href).status==200
 page.goto(href,wait_until="domcontentloaded")
 assert page.locator('[name="grade"]').input_value()==str(grade)
 assert page.locator('[name="lesson"]').input_value()==f"Week {week}"
 assert page.locator('[name="title"]').input_value()
 page.close()

@pytest.mark.parametrize("week",list(range(1,37)))
def test_senior_original_visual_coverage(site,browser,week):
 page=browser.new_page()
 assert page.goto(site+BASE+f"grade-12/weeks/week-{week:02d}/student-packet.html",wait_until="domcontentloaded").status==200
 assert page.locator(".khaemenes-visual-investigation").count()==1,week
 assert page.locator(".khaemenes-visual-investigation a").count()>=1
 page.close()

def _evidence_json(grade=9,student="Test Learner",date="2026-10-20"):
 return dict(schema="khaemenes-social-studies-evidence-v1",student=student,date=date,grade=str(grade),subject="Social Studies",unit="Unit 1",lesson="Week 1",title="Civic question",assignment="Read sources",findings="Example evidence",visual="Chart",citations="Official archive",limitations="Small dataset",reviewer="Reviewer",reviewdate=date,feedback="Reviewed",signature="Signed")

def _upload(page,payload):
 page.locator("#upload").set_input_files({"name":"evidence.json","mimeType":"application/json","buffer":json.dumps(payload).encode("utf-8")})
 page.wait_for_function("document.querySelector('#upload').value === ''")

@pytest.mark.parametrize("grade",[9,10,11,12])
def test_evidence_import_identity_and_grade_safeguards(site,browser,grade):
 page=browser.new_page()
 page.goto(site+BASE+f"tools/academic-evidence-printout.html?grade={grade}&lesson=Week%201")
 alerts=[];prompts=[]
 page.on("dialog",lambda d:(prompts.append(d.message) if d.type=="confirm" else alerts.append(d.message),d.accept()))
 page.locator('[name="student"]').fill("Test Learner")
 _upload(page,_evidence_json(grade=grade,student="Other Learner"))
 assert page.locator('[name="student"]').input_value()=="Test Learner"
 assert any("Different learner" in a for a in alerts)
 alerts.clear()
 _upload(page,_evidence_json(grade=10 if grade==9 else 9))
 assert any("grade does not match" in a.lower() for a in alerts)
 alerts.clear()
 _upload(page,_evidence_json(grade=grade,date="2026-02-30"))
 assert any("dates must be valid" in a for a in alerts)
 alerts.clear()
 _upload(page,_evidence_json(grade=grade))
 assert prompts and "Student: Test Learner" in prompts[-1]
 assert page.locator('[name="citations"]').input_value()=="Official archive"
 assert page.locator('[name="reviewer"]').input_value()=="Reviewer"
 page.close()

@pytest.mark.parametrize("grade",[9,10,11,12])
def test_weekly_evidence_export_import_and_review_roundtrip(site,browser,grade):
 ctx=browser.new_context(accept_downloads=True)
 page=ctx.new_page()
 page.goto(site+BASE+f"grade-{grade:02d}/weeks/week-01/student-packet.html",wait_until="domcontentloaded")
 if grade==9:
  # The Grade 9 learner diagnostic intentionally blocks pointer clicks until completed.
  # Verify the link destination directly without disabling the protective overlay.
  target=page.locator("[data-academic-portfolio-link] a").get_attribute("href")
  assert page.request.get(target).status==200
  page.goto(target,wait_until="domcontentloaded")
 else:
  page.locator("[data-academic-portfolio-link] a").click()
 # Opening may remain in the same tab for standalone print forms.
 if page.locator("#evidence").count()==0:
  evidence=ctx.pages[-1]
 else: evidence=page
 evidence.wait_for_selector("#evidence")
 evidence.locator('[name="student"]').fill("Portfolio Sample")
 evidence.locator('[name="citations"]').fill("Example dated archive record")
 evidence.locator('[name="findings"]').fill("Evidence-based summary")
 evidence.locator('[name="reviewer"]').fill("Parent / Teacher")
 evidence.locator('[name="feedback"]').fill("Reviewed and discussed")
 with evidence.expect_download() as info:
  evidence.locator("#export").click()
 downloaded=info.value
 content=json.loads(Path(downloaded.path()).read_text(encoding="utf-8"))
 assert content["student"]=="Portfolio Sample"
 assert content["grade"]==str(grade)
 assert content["reviewer"]=="Parent / Teacher"
 evidence.locator("#evidence").evaluate("(el)=>el.reset()")
 evidence.locator('[name="student"]').fill("Portfolio Sample")
 messages=[]
 evidence.on("dialog",lambda d:(messages.append(d.message),d.accept()))
 _upload(evidence,content)
 assert any("Import saved Academic Evidence?" in m for m in messages)
 assert evidence.locator('[name="findings"]').input_value()=="Evidence-based summary"
 assert evidence.locator('[name="feedback"]').input_value()=="Reviewed and discussed"
 evidence.emulate_media(media="print")
 assert len(evidence.pdf(format="A4"))>1000
 ctx.close()

@pytest.mark.parametrize("field,wrong",[
 ("lesson","Week 2"),("unit","Unit 2"),("title","Another unit's lesson")
])
def test_import_rejects_cross_week_metadata(site,browser,field,wrong):
 page=browser.new_page()
 page.goto(site+BASE+"tools/academic-evidence-printout.html?grade=9&unit=Unit%201&lesson=Week%201&title=Civic%20question")
 alerts=[];confirms=[]
 page.on("dialog",lambda d:(confirms.append(d.message) if d.type=="confirm" else alerts.append(d.message),d.accept()))
 page.locator('[name="student"]').fill("Test Learner")
 original=page.locator('[name="lesson"]').input_value()
 data=_evidence_json()
 data[field]=wrong
 _upload(page,data)
 assert any("does not match" in message for message in alerts),alerts
 assert not confirms
 assert page.locator('[name="lesson"]').input_value()==original
 assert page.locator('[name="citations"]').input_value()==""
 page.close()

@pytest.mark.parametrize("scenario",["selected-grade","subject","review-before-work"])
def test_import_safety_three_additional_guards(site,browser,scenario):
 page=browser.new_page()
 page.goto(site+BASE+"tools/academic-evidence-printout.html",wait_until="domcontentloaded")
 page.locator('[name="student"]').fill("Test Learner")
 alerts=[];confirms=[]
 page.on("dialog",lambda d:(confirms.append(d.message) if d.type=="confirm" else alerts.append(d.message),d.accept()))
 data=_evidence_json(grade=9,student="Test Learner")
 if scenario=="selected-grade":
  page.locator('[name="grade"]').select_option("11")
 elif scenario=="subject":
  data["subject"]="Other Subject"
 else:
  data["date"]="2026-10-20"
  data["reviewdate"]="2026-10-19"
 _upload(page,data)
 assert alerts and "Import blocked:" in alerts[-1],alerts
 assert not confirms
 assert page.locator('[name="student"]').input_value()=="Test Learner"
 assert page.locator('[name="citations"]').input_value()==""
 assert page.locator('[name="subject"]').input_value()=="Social Studies"
 page.close()

def test_export_requires_student_and_lesson(site,browser):
 page=browser.new_page()
 page.goto(site+BASE+"tools/academic-evidence-printout.html?grade=11",wait_until="domcontentloaded")
 messages=[]
 page.on("dialog",lambda d:(messages.append(d.message),d.accept()))
 page.locator("#export").click()
 assert any("student name" in m for m in messages)
 page.locator('[name="student"]').fill("Test Learner")
 page.locator("#export").click()
 assert any("lesson/week" in m for m in messages)
 page.locator('[name="lesson"]').fill("Week 7")
 with page.expect_download() as transfer:
  page.locator("#export").click()
 assert transfer.value.suggested_filename.endswith(".json")
 page.close()

def test_reset_requires_confirmation_and_preserves_unsaved_work(site,browser):
 page=browser.new_page()
 page.goto(site+BASE+"tools/academic-evidence-printout.html?grade=10",wait_until="domcontentloaded")
 page.locator('[name="student"]').fill("Test Learner")
 page.locator('[name="findings"]').fill("Unsaved evidence must be retained")
 page.on("dialog",lambda d:d.dismiss())
 page.get_by_role("button",name="Clear form").click()
 assert page.locator('[name="findings"]').input_value()=="Unsaved evidence must be retained"
 page.close()

@pytest.mark.parametrize("bad_date",["","2026-02-30"])
def test_portfolio_import_rejects_missing_or_invalid_work_date(site,browser,bad_date):
 page=browser.new_page();page.goto(site+BASE+"tools/academic-evidence-printout.html?grade=9&lesson=Week%201")
 alerts=[];page.on("dialog",lambda d:(alerts.append(d.message),d.accept()))
 payload=_evidence_json();payload["date"]=bad_date;payload["reviewdate"]=""
 _upload(page,payload)
 assert any("dates must be valid" in m for m in alerts)
 assert page.locator('[name="citations"]').input_value()==""
 page.close()

def test_portfolio_export_rejects_changed_lesson_metadata(site,browser):
 ctx=browser.new_context(accept_downloads=True);page=ctx.new_page()
 page.goto(site+BASE+"tools/academic-evidence-printout.html?grade=9&unit=Unit%201&lesson=Week%201&title=Civic%20question")
 alerts=[];page.on("dialog",lambda d:(alerts.append(d.message),d.accept()))
 page.locator('[name="student"]').fill("Sample Learner")
 page.locator('[name="lesson"]').fill("Week 2")
 page.locator("#export").click()
 assert any("lesson no longer matches" in m for m in alerts)
 ctx.close()

def test_portfolio_export_filename_contains_lesson_and_date(site,browser):
 ctx=browser.new_context(accept_downloads=True);page=ctx.new_page()
 page.goto(site+BASE+"tools/academic-evidence-printout.html?grade=9&lesson=Week%201&title=Civic%20question")
 page.locator('[name="student"]').fill("Sample Learner")
 with page.expect_download() as info:page.locator("#export").click()
 name=info.value.suggested_filename
 assert "grade-9-1-" in name and name.endswith(".json")
 ctx.close()

@pytest.mark.parametrize("grade",[9,10,11,12])
def test_import_requires_second_confirmation_for_unsaved_work(site,browser,grade):
 page=browser.new_page()
 page.goto(site+BASE+f"tools/academic-evidence-printout.html?grade={grade}")
 page.locator('[name="student"]').fill("Test Learner")
 page.locator('[name="findings"]').fill("Do not overwrite these unsaved findings")
 prompts=[]
 def decline_overwrite(dialog):
  if dialog.type=="confirm":
   prompts.append(dialog.message)
   dialog.dismiss() if "Safety check" in dialog.message else dialog.accept()
  else: dialog.accept()
 page.on("dialog",decline_overwrite)
 _upload(page,_evidence_json(grade=grade))
 assert any("Safety check" in prompt for prompt in prompts)
 assert page.locator('[name="findings"]').input_value()=="Do not overwrite these unsaved findings"
 page.close()

@pytest.mark.parametrize("grade",[9,10,11,12])
def test_reject_incomplete_imported_review(site,browser,grade):
 page=browser.new_page()
 page.goto(site+BASE+f"tools/academic-evidence-printout.html?grade={grade}")
 alerts=[]
 page.on("dialog",lambda d:(alerts.append(d.message),d.accept()))
 invalid=_evidence_json(grade=grade)
 invalid["reviewer"]=""
 _upload(page,invalid)
 assert any("Reviewer name is required" in a for a in alerts)
 assert page.locator('[name="student"]').input_value()==""
 page.close()

@pytest.mark.parametrize("grade",[9,10,11,12])
def test_reject_undated_and_inconsistent_review_on_export(site,browser,grade):
 ctx=browser.new_context(accept_downloads=True)
 page=ctx.new_page()
 page.goto(site+BASE+f"tools/academic-evidence-printout.html?grade={grade}")
 page.locator('[name="student"]').fill("Test Learner")
 page.locator('[name="lesson"]').fill("Week 1")
 page.locator('[name="date"]').fill("2026-10-20")
 page.locator('[name="reviewer"]').fill("Teacher")
 alerts=[]
 page.on("dialog",lambda d:(alerts.append(d.message),d.accept()))
 page.locator("#export").click()
 assert any("Enter the review date" in a for a in alerts)
 page.locator('[name="reviewdate"]').fill("2026-10-19")
 alerts.clear()
 page.locator("#export").click()
 assert any("cannot precede" in a for a in alerts)
 ctx.close()
