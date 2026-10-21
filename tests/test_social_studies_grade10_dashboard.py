"""Grade 10 Social Studies smoke tests; runs on a local HTTP server."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import pytest
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE="/courses/social-studies/grade-10/"
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
@pytest.fixture(scope="session")
def site():
 server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
 t=Thread(target=server.serve_forever,daemon=True);t.start()
 yield "http://127.0.0.1:"+str(server.server_port)
 server.shutdown();t.join(timeout=3)
@pytest.fixture
def browser():
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
  yield browser
  browser.close()
@pytest.mark.parametrize("width",[255,375,900])
def test_entrance_and_original_tools(browser,site,width):
 ctx=browser.new_context(viewport={"width":width,"height":850})
 page=ctx.new_page();errors=[]
 page.on("pageerror",lambda error: errors.append(str(error)))
 page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 assert page.locator("#ss10-tools .ss10-tools-grid a").count()==6
 assert page.locator('button[data-view="week"]').count()>=1
 assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2"),f"Horizontal overflow: {width}px"
 assert not errors,errors
 ctx.close()
def test_resources_are_local_and_present(browser,site):
 ctx=browser.new_context();page=ctx.new_page()
 page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 for href in page.locator("#ss10-tools a").evaluate_all("(els)=>els.map(x=>x.getAttribute('href'))"):
  response=page.request.get(site+BASE+href)
  assert response.status==200,(href,response.status)
 ctx.close()
@pytest.mark.parametrize("week",[1,2,12,24,36])
def test_weekly_packet_loads(browser,site,week):
 ctx=browser.new_context(viewport={"width":375,"height":850})
 page=ctx.new_page();errors=[]
 page.on("pageerror",lambda error:errors.append(str(error)))
 url=site+BASE+f"week-{week:02d}/student-packet.html"
 response=page.goto(url,wait_until="domcontentloaded")
 assert response.status==200
 assert f"Week {week}" in page.locator("h1").first.inner_text()
 assert not errors,errors
 ctx.close()
