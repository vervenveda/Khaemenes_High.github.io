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
 # In a fresh browser no Academy learner is selected: the write boundary must refuse saving.
 assert all("Select an Academy learner before saving course work." in error for error in errors),errors

 ctx.close()
def test_resources_are_local_and_present(browser,site):
 ctx=browser.new_context();page=ctx.new_page()
 page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 for href in page.locator("#ss10-tools a").evaluate_all("(els)=>els.map(x=>x.getAttribute('href'))"):
  response=page.request.get(site+BASE+href)
  assert response.status==200,(href,response.status)
 ctx.close()
@pytest.mark.parametrize("week",list(range(1,37))+[24,36])
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

def test_grade10_requires_academy_learner_for_persistence(browser,site):
 ctx=browser.new_context()
 page=ctx.new_page(); errors=[]
 page.on("pageerror",lambda error:errors.append(str(error)))
 page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 assert any("Select an Academy learner before saving course work." in error for error in errors)
 assert page.locator("#ss10-tools").count()==1
 ctx.close()

@pytest.mark.parametrize("week",list(range(1,37)))
def test_original_visual_investigation_present(browser,site,week):
 ctx=browser.new_context()
 page=ctx.new_page()
 page.goto(site+BASE+f"week-{week:02d}/student-packet.html",wait_until="domcontentloaded")
 assert page.locator(".khaemenes-visual-investigation").count()==1
 href=page.locator(".khaemenes-visual-investigation a").get_attribute("href")
 assert page.request.get(site+BASE+f"week-{week:02d}/"+href).status==200
 ctx.close()

@pytest.mark.parametrize("week",[1,12,24,36])
def test_packet_print_and_academy_evidence(browser,site,week):
 ctx=browser.new_context()
 page=ctx.new_page()
 page.goto(site+BASE+f"week-{week:02d}/student-packet.html",wait_until="domcontentloaded")
 assert page.locator("h1").first.is_visible()
 assert page.locator(".khaemenes-visual-investigation").count()==1
 assert "Source(s)" in page.locator(".khaemenes-visual-investigation").inner_text() or "Source" in page.locator(".khaemenes-visual-investigation").inner_text()
 page.emulate_media(media="print")
 assert len(page.pdf(format="A4"))>1000
 ctx.close()

@pytest.mark.parametrize("grade,relative",[
 ("09","grade-09/weeks/week-01/student-packet.html"),
 ("10","grade-10/week-01/student-packet.html"),
 ("11","grade-11/weeks/week-01/student-packet.html"),
 ("12","grade-12/weeks/week-01/student-packet.html"),
])
def test_standardized_printable_evidence_bridge(browser,site,grade,relative):
 ctx=browser.new_context(viewport={"width":255,"height":850})
 page=ctx.new_page()
 page.goto(site+"/courses/social-studies/"+relative,wait_until="domcontentloaded")
 bridge=page.locator("[data-academic-portfolio-link]")
 bridge.wait_for(timeout=10000)
 assert bridge.count()==1
 href=bridge.locator("a").get_attribute("href")
 from urllib.parse import urlparse,parse_qs
 parsed=urlparse(href)
 assert parsed.path.endswith("/courses/social-studies/tools/academic-evidence-printout.html")
 assert parse_qs(parsed.query)["grade"]==[str(int(grade))]
 assert parse_qs(parsed.query)["lesson"]==["Week 1"]
 page.goto(href,wait_until="domcontentloaded")
 assert page.locator("h1").inner_text()=="Khaemenes Academy"
 assert page.locator("#grade").input_value()==str(int(grade))
 assert page.locator('input[name="lesson"]').input_value()=="Week 1"
 assert page.locator('textarea[name="citations"]').count()==1
 assert page.locator('input[name="reviewer"]').count()==1
 page.emulate_media(media="print")
 assert len(page.pdf(format="A4"))>1000
 ctx.close()

@pytest.mark.parametrize("week",list(range(1,37)))
def test_grade10_weekly_portfolio_script_present(week):
 packet=ROOT/"courses"/"social-studies"/"grade-10"/f"week-{week:02d}"/"student-packet.html"
 assert 'src="../../../shared/high-school-formative-evidence-v1.js"' in packet.read_text(encoding="utf-8")
