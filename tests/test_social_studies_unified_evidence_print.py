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
