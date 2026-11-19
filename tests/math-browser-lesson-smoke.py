#!/usr/bin/env python3
"""Read-only High School mathematics browser smoke.
Serves the checkout on localhost and launches Chrome with disposable profiles.
A rendered DOM is authoritative even if CI Chrome needs forced shutdown after
--dump-dom has already produced the page; learner data is never used.
"""
import functools, http.server, pathlib, shutil, subprocess, tempfile, threading, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
CHROME = next((p for p in (
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    shutil.which("google-chrome"), shutil.which("chromium"),
) if p and pathlib.Path(p).exists()), None)
if not CHROME:
    sys.exit("SKIP: Chrome/Chromium executable not found")

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = "http://127.0.0.1:%d/" % server.server_port

paths = [
    ("Pre-Algebra", "courses/mathematics/pre-algebra/units/unit-01/index.html"),
    ("Algebra I unit", "courses/mathematics/algebra-1/units/unit-01/index.html"),
    ("Algebra I lesson 01", "courses/mathematics/algebra-1/units/unit-01/lessons/lesson-01-algebraic-habits-notation-mathematical-argument.html"),
    ("Geometry lesson 01", "courses/mathematics/geometry/units/unit-01/lessons/u01-l01.html"),
    ("Algebra II lesson 01", "courses/mathematics/algebra-2/units/unit-01/lessons/u01-l01.html"),
]

def text(value):
    if value is None: return ""
    if isinstance(value, bytes): return value.decode("utf-8", "replace")
    return value

def render(name, rel, profile):
    cmd = [
        CHROME, "--headless=new", "--no-first-run", "--no-default-browser-check",
        "--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu",
        "--disable-extensions", "--disable-background-networking",
        "--disable-component-update", "--disable-default-apps", "--disable-sync",
        "--disable-translate", "--metrics-recording-only", "--no-pings",
        "--disable-dev-shm-usage", "--no-proxy-server",
        "--host-resolver-rules=MAP vervenveda.com 127.0.0.1, MAP www.vervenveda.com 127.0.0.1",
        "--user-data-dir="+profile, "--virtual-time-budget=5000", "--dump-dom", base+rel
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    timed_out = False
    try:
        stdout, stderr = proc.communicate(timeout=30)
    except subprocess.TimeoutExpired as exc:
        timed_out = True
        partial_out, partial_err = text(exc.stdout), text(exc.stderr)
        proc.kill()
        stdout2, stderr2 = proc.communicate(timeout=5)
        stdout = partial_out + text(stdout2)
        stderr = partial_err + text(stderr2)

    dom = text(stdout)
    if "<html" not in dom.lower():
        return False, "no rendered HTML" + (" before CI cleanup timeout" if timed_out else "") + (" · "+text(stderr)[-500:] if stderr else "")

    if 'data-algebra1-lesson-render="error"' in dom:
        return False, "Algebra I renderer error"
    if re.search(r"Lesson unavailable|Unrecognized Unit 01 page mode", dom, re.I):
        return False, "lesson unavailable"

    if name == "Algebra I lesson 01" and 'data-algebra1-lesson-render="ready"' not in dom:
        return False, "Algebra I dynamic lesson renderer did not reach ready state"
    if name == "Geometry lesson 01":
        required = ['data-lesson-id="u01-l01"', 'id="lessonMain"', 'id="lessonStatus"']
        missing = [item for item in required if item not in dom]
        if missing:
            return False, "Geometry rendered DOM missing "+", ".join(missing)
    if name == "Algebra II lesson 01":
        required = ['data-lesson-id="u01-l01"', 'id="lessonNote"', 'id="lessonStatus"']
        missing = [item for item in required if item not in dom]
        if missing:
            return False, "Algebra II rendered DOM missing "+", ".join(missing)

    lifecycle = "rendered; Chrome required forced CI cleanup" if timed_out else "rendered and exited cleanly"
    return True, lifecycle

failed = 0
try:
    with tempfile.TemporaryDirectory(prefix="khae-math-browser-") as profiles:
        for number, (name, rel) in enumerate(paths):
            if not (ROOT / rel).is_file():
                print("FAIL", name, "missing file", rel, flush=True)
                failed += 1
                continue
            profile = str(pathlib.Path(profiles) / ("lesson-" + str(number)))
            ok, detail = render(name, rel, profile)
            if ok:
                print("PASS", name, detail, flush=True)
            else:
                print("FAIL", name, detail, flush=True)
                failed += 1
finally:
    server.shutdown()

print("Browser smoke failures:", failed)
sys.exit(1 if failed else 0)
