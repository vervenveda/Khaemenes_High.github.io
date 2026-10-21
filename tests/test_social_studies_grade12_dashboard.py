"""Grade 12 Senior Research original tools and source investigations browser regression."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import pytest
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];BASE="/courses/social-studies/grade-12/"
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
  b=p.chromium.launch(headless=True,args=["--no-sandbox"]);yield b;b.close()
@pytest.mark.parametrize("width",[255,375,900])
def test_senior_original_tools(browser,site,width):
 ctx=browser.new_context(viewport={"width":width,"height":850});page=ctx.new_page()
 assert page.goto(site+BASE+"index.html",wait_until="domcontentloaded").status==200
 assert page.locator("#ss12-tools .ss12-tools-grid a").count()==6
 assert page.evaluate("document.documentElement.scrollWidth<=innerWidth+2"),f"Overflow at {width}px"
 for href in page.locator("#ss12-tools a").evaluate_all("(els)=>els.map(x=>x.getAttribute('href'))"):
  assert page.request.get(site+BASE+href).status==200,href
 ctx.close()
@pytest.mark.parametrize("week",list(range(1,7)))
def test_senior_initial_visual_investigations(browser,site,week):
 ctx=browser.new_context();page=ctx.new_page()
 assert page.goto(site+BASE+f"weeks/week-{week:02d}/student-packet.html",wait_until="domcontentloaded").status==200
 assert page.locator(".khaemenes-visual-investigation").count()==1
 for href in page.locator(".khaemenes-visual-investigation a").evaluate_all("(els)=>els.map(x=>x.getAttribute('href'))"):
  assert page.request.get(site+BASE+f"weeks/week-{week:02d}/"+href).status==200,href
 ctx.close()
