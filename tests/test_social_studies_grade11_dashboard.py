"""Grade 11 learner entrance and original tools Chromium smoke QA."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import pytest
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];BASE="/courses/social-studies/grade-11/"
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
@pytest.fixture(scope="session")
def site():
 server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
 worker=Thread(target=server.serve_forever,daemon=True);worker.start()
 yield "http://127.0.0.1:"+str(server.server_port)
 server.shutdown();worker.join(timeout=3)
@pytest.fixture
def browser():
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,args=["--no-sandbox"])
  yield b
  b.close()
@pytest.mark.parametrize("width",[255,375,900])
def test_grade11_original_tools_and_responsive_layout(browser,site,width):
 ctx=browser.new_context(viewport={"width":width,"height":850});page=ctx.new_page()
 page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 assert page.locator("#ss11-tools .ss11-tools-grid a").count()==6
 assert page.locator('button[data-view="week"]').count()>=1
 assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2"),f"Horizontal overflow at {width}px"
 ctx.close()
def test_grade11_tools_are_local(browser,site):
 ctx=browser.new_context();page=ctx.new_page();page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 for href in page.locator("#ss11-tools a").evaluate_all("(els)=>els.map(x=>x.getAttribute('href'))"):
  assert page.request.get(site+BASE+href).status==200,href
 ctx.close()
def test_grade11_week_one_packet(browser,site):
 ctx=browser.new_context();page=ctx.new_page()
 response=page.goto(site+BASE+"weeks/week-01/student-packet.html",wait_until="domcontentloaded")
 assert response.status==200
 ctx.close()

@pytest.mark.parametrize("week",list(range(1,7)))
def test_grade11_early_week_visual_investigation(browser,site,week):
 ctx=browser.new_context(viewport={"width":375,"height":850})
 page=ctx.new_page()
 result=page.goto(site+BASE+f"weeks/week-{week:02d}/student-packet.html",wait_until="domcontentloaded")
 assert result.status==200
 panel=page.locator(".khaemenes-visual-investigation")
 assert panel.count()==1
 assert "Source" in panel.inner_text() or "source" in panel.inner_text()
 link=panel.locator("a").get_attribute("href")
 assert page.request.get(site+BASE+f"weeks/week-{week:02d}/"+link).status==200
 ctx.close()
