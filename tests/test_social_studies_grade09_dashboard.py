"""Khaemenes Social Studies Grade 9 learner-dashboard regression.
Run: pip install playwright pytest && python -m playwright install chromium
     python -m pytest -q tests/test_social_studies_grade09_dashboard.py
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import pytest
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
BASE="/courses/social-studies/grade-09/"
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

@pytest.mark.parametrize("width",[255,375,900])
def test_grade09_dashboard_width_and_links(browser,site,width):
    context=browser.new_context(viewport={"width":width,"height":850})
    page=context.new_page();errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
    assert page.locator("#quick-tools .ss9-tool").count()==6
    assert page.locator("#next-action").count()==1
    assert page.locator("#evidence").count()==1
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2"),f"Horizontal overflow at {width}px"
    assert not errors,errors
    context.close()

def test_grade09_placement_is_preserved(browser,site):
    context=browser.new_context()
    page=context.new_page()
    page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
    page.wait_for_function("document.querySelector('#next-action').getAttribute('href') !== null")
    route=page.locator("#next-action").get_attribute("href")
    assert route and not route.startswith("javascript:")
    assert page.locator("#next-message").inner_text()
    context.close()

def test_grade09_local_tool_links_load(browser,site):
    context=browser.new_context()
    page=context.new_page()
    page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
    links=page.locator("#quick-tools .ss9-tool")
    for i in range(links.count()):
        target=links.nth(i).get_attribute("href")
        response=page.request.get(site+BASE+target)
        assert response.status==200,(target,response.status)
    context.close()

def test_grade09_visual_studio_workspace(browser,site):
    context=browser.new_context(viewport={"width":255,"height":850},accept_downloads=True)
    page=context.new_page();errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.goto(site+"/courses/social-studies/tools/visual-studio.html",wait_until="domcontentloaded")
    assert page.locator("#atlasGraphic svg").count()==1
    page.locator('button[data-panel="timeline"]').click()
    page.locator("#eventYear").fill("1776")
    page.locator("#eventTitle").fill("Declaration of Independence")
    page.locator("#addEvent").click()
    assert "1776" in page.locator("#timelineList").inner_text()
    page.locator('button[data-panel="source"]').click()
    page.locator("#docTitle").fill("Test primary source")
    page.locator("#student").fill("QA Learner")
    with page.expect_download() as evt:
        page.locator("#download").click()
    assert evt.value.suggested_filename.endswith(".json")
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2")
    assert not errors,errors
    context.close()
