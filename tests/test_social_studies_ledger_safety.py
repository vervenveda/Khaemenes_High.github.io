"""Safety regression for standalone Grade 9–12 common evidence ledger."""
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
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
def page(site):
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,args=["--no-sandbox"])
  pg=b.new_page(accept_downloads=True)
  pg.goto(site+"/courses/social-studies/tools/evidence-ledger.html")
  yield pg
  b.close()
def seed(page,name="Sample Learner",grade="9"):
 page.locator("#student").fill(name);page.locator("#grade").select_option(grade)
def test_record_isolation_and_explicit_load(page):
 seed(page);page.locator("#question").fill("First student's evidence");page.locator("#save").click()
 assert "Saved for" in page.locator("#status").inner_text()
 page.on("dialog",lambda d:d.accept());page.locator("#reset").click()
 seed(page,"Other Learner","9");page.locator("#load").click()
 assert "No saved worksheet" in page.locator("#status").inner_text()
 assert page.locator("#question").input_value()==""
 page.locator("#reset").click();seed(page)
 page.locator("#load").click()
 assert page.locator("#question").input_value()=="First student's evidence"
def test_cross_student_import_rejected(page):
 seed(page,"Other Learner");page.locator("#question").fill("Keep this")
 payload={"schema":2,"app":"khaemenes-evidence-ledger","data":{}}
 ids=['student','date','grade','week','question','title','author','published','accessed','location','type','claim','extract','unit','c1','c2','c3','c4','c5','counter','conclusion']
 for k in ids:payload["data"][k]=False if k.startswith("c") and len(k)==2 else ""
 payload["data"].update(student="Different Learner",grade="9")
 page.locator("#file").set_input_files({"name":"backup.json","mimeType":"application/json","buffer":json.dumps(payload).encode()})
 assert "Different learner" in page.locator("#status").inner_text()
 assert page.locator("#question").input_value()=="Keep this"
def test_invalid_import_fails_closed(page):
 seed(page);page.locator("#question").fill("Preserve")
 payload={"schema":2,"app":"khaemenes-evidence-ledger","data":{"student":"Sample Learner","grade":"9"}}
 page.locator("#file").set_input_files({"name":"incomplete.json","mimeType":"application/json","buffer":json.dumps(payload).encode()})
 assert "Import rejected" in page.locator("#status").inner_text()
 assert page.locator("#question").input_value()=="Preserve"
