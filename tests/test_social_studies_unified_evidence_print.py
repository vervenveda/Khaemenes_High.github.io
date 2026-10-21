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
