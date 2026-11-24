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
 # The current canonical dashboard has six course-view buttons in its own nav.
 nav=page.locator('nav[aria-label="Course sections"] .navBtn')
 assert nav.count()==6
 assert page.locator('.tabs button[data-view="week"]').count()==1
 assert page.locator("#weekList .weekBtn").count()==36
 assert page.locator('#content h2').first.is_visible()
 overflow=page.evaluate("""() => ({
   scrollWidth:document.documentElement.scrollWidth,
   viewport:innerWidth,
   offenders:[...document.querySelectorAll('body *')]
     .filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+2||r.left< -2})
     .slice(0,18).map(e=>({tag:e.tagName,id:e.id,cls:String(e.className).slice(0,70),
       text:(e.innerText||'').slice(0,55),left:Math.round(e.getBoundingClientRect().left),
       right:Math.round(e.getBoundingClientRect().right)}))
 })""")
 assert overflow["scrollWidth"]<=width+2,f"Horizontal overflow at {width}px: {overflow}"
 assert not errors,errors

 ctx.close()

def test_grade10_portal_does_not_expose_javascript_as_lesson_text(browser,site):
 ctx=browser.new_context(viewport={"width":375,"height":850})
 page=ctx.new_page()
 page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 # Earlier an inline report string broke the application script and leaked code.
 # The canonical app.js now uses module-local report functions; do not expose
 # them as writable globals merely to satisfy a historical browser check.
 assert page.locator('#content h2').first.inner_text()
 assert page.locator('.tabs button[data-view="reports"]').count()==1
 page.locator('.tabs button[data-view="reports"]').click()
 assert page.locator('#content').get_by_text("Reports and Backups").count()==1
 assert not page.evaluate("document.body.innerText.includes('function printReport(){')")
 assert not page.evaluate("document.body.innerText.includes('function downloadCSV(){')")
 assert not page.evaluate("document.body.innerText.includes('function saveDB(){')")
 assert page.locator('nav[aria-label="Course sections"] .navBtn').count()==6
 ctx.close()

def test_resources_are_local_and_present(browser,site):
 ctx=browser.new_context();page=ctx.new_page()
 page.goto(site+BASE+"index.html",wait_until="domcontentloaded")
 # Verify actual locally hosted resources rather than iterating an obsolete
 # selector that now returns zero matches (a false-positive PASS).
 hrefs=page.locator('.sidebar a[href]').evaluate_all("(els)=>els.map(x=>x.getAttribute('href')).filter(x=>x && !x.startsWith('http'))")
 assert len(hrefs)>=2
 for href in hrefs:
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
 assert page.locator('nav[aria-label="Course sections"] .navBtn').count()==6
 assert not errors,errors
 page.locator("#studentName").fill("Synthetic Browser Learner")
 # Saving is forbidden without Academy learner identity; errors arise on the
 # attempted write, not on initial page load.
 page.locator("#addStudentBtn").click()
 page.wait_for_timeout(150)
 assert any("Select an Academy learner before saving course work." in error for error in errors),errors
 assert page.locator("#studentSelect").input_value()==""
 assert page.evaluate("Object.keys(localStorage).every(k=>!k.includes(':academy:'))")
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
 packet=ROOT/"courses"/"social-studies"/"grade-10"/"weeks"/f"week-{week:02d}"/"student-packet.html"
 assert 'src="../../../shared/high-school-formative-evidence-v1.js"' in packet.read_text(encoding="utf-8")
