"""Cumulative high-school Social Studies Monte Carlo Arcade QA."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import pytest
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
GAME="/courses/social-studies/games/high-school-monte-carlo-trivia.html"
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
  b=p.chromium.launch(headless=True,args=["--no-sandbox"])
  yield b
  b.close()
@pytest.mark.parametrize("grade",[9,10,11,12])
def test_cumulative_grade_draw(browser,site,grade):
 ctx=browser.new_context(viewport={"width":375,"height":850})
 page=ctx.new_page(); errors=[]
 page.on("pageerror",lambda error:errors.append(str(error)))
 page.goto(site+GAME,wait_until="domcontentloaded")
 page.locator(f'.level[data-grade="{grade}"]').click()
 page.locator("#seed").fill("academy-regression-2026")
 page.locator("#length").select_option("10")
 page.locator("#start").click()
 page.locator("#play:not([hidden])").wait_for(timeout=45000)
 assert page.locator(".option").count()==4
 assert page.locator("#source").inner_text().startswith("Grade ")
 assert int(page.locator("#source").inner_text().split(" · ")[0].replace("Grade ",""))<=grade
 assert not errors,errors
 page.locator(".option").first.click()
 assert page.locator("#next").is_visible()
 assert page.locator("#explanation").is_visible()
 assert page.evaluate("localStorage.length")==0
 ctx.close()
@pytest.mark.parametrize("width",[255,375,900])
def test_trivia_responsive(browser,site,width):
 ctx=browser.new_context(viewport={"width":width,"height":900})
 page=ctx.new_page();page.goto(site+GAME,wait_until="domcontentloaded")
 assert page.locator(".level").count()==4
 assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 2")
 ctx.close()
def test_department_game_link(browser,site):
 ctx=browser.new_context()
 page=ctx.new_page();page.goto(site+"/courses/social-studies/index.html",wait_until="domcontentloaded")
 assert page.locator('a[href="games/high-school-monte-carlo-trivia.html"]').count()==1
 ctx.close()
