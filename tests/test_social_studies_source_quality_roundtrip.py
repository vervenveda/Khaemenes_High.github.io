"""Source Quality Lab: shared Grade 9–12 offline evidence round-trip."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import json
import pytest
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
@pytest.fixture(scope="module")
def site():
 server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
 t=Thread(target=server.serve_forever,daemon=True);t.start()
 yield "http://127.0.0.1:"+str(server.server_port)
 server.shutdown();t.join(timeout=3)
@pytest.fixture
def page():
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
  pg=browser.new_page(viewport={"width":255,"height":850},accept_downloads=True)
  yield pg
  browser.close()
def test_shared_link_exists_in_every_grade(page,site):
 for grade in ["09","10","11","12"]:
  page.goto(site+f"/courses/social-studies/grade-{grade}/index.html",wait_until="domcontentloaded")
  link=page.locator('a[href="../tools/source-quality-lab.html"]')
  assert link.count()>=1,grade
def test_offline_import_export_roundtrip(page,site):
 page.goto(site+"/courses/social-studies/tools/source-quality-lab.html")
 page.locator("#student").fill("Offline Learner")
 page.locator("#claim").fill("Claim with <markup> and citations")
 page.locator("#check-origin").select_option("yes")
 with page.expect_download() as download_info:page.locator("#export").click()
 download=download_info.value
 data=json.loads(Path(download.path()).read_text())
 assert data["schema"]=="khaemenes.source-quality.v1"
 page.locator("#student").fill("Changed")
 page.on("dialog",lambda dialog:dialog.accept())
 page.locator("#import-file").set_input_files({"name":"worksheet.json","mimeType":"application/json","buffer":json.dumps(data).encode()})
 assert page.locator("#student").input_value()=="Offline Learner"
 assert page.locator("#claim").input_value()=="Claim with <markup> and citations"
 assert page.locator("#check-origin").input_value()=="yes"
 assert page.locator("#score").inner_text().startswith("1 of 4")
def test_invalid_import_does_not_overwrite(page,site):
 page.goto(site+"/courses/social-studies/tools/source-quality-lab.html")
 page.locator("#student").fill("Keep record")
 page.locator("#import-file").set_input_files({"name":"invalid.json","mimeType":"application/json","buffer":b'{"schema":"wrong","fields":{},"checks":{}}'})
 assert page.locator("#student").input_value()=="Keep record"
 assert "Import rejected" in page.locator("#status").inner_text()
