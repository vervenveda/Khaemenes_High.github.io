#!/usr/bin/env python3
"""Read-only browser smoke check. Run: python3 tests/math-browser-lesson-smoke.py
Serves the checkout on localhost and launches Chrome with an isolated temporary profile.
Does not use or alter students' real browser data.
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
failed = 0
try:
    with tempfile.TemporaryDirectory(prefix="khae-math-browser-") as profiles:
        for number, (name, rel) in enumerate(paths):
            if not (ROOT / rel).is_file():
                print("FAIL", name, "missing file", rel); failed += 1; continue
            if name == "Geometry lesson 01":
                # Check actual student-facing DOM + mastery controls without depending on
                # Chrome --dump-dom process termination. Fail on navigation or gate errors.
                cmd = ["node", str(ROOT / "tests/math-browser-geometry-cdp.mjs"), CHROME, base + rel]
                try:
                    result = subprocess.run(cmd, capture_output=True, text=True, timeout=70)
                    print(result.stdout.strip(), flush=True)
                    if result.returncode:
                        print("FAIL", name, "CDP DOM/gate verification", result.stderr.strip()[-1800:], flush=True)
                        failed += 1
                except subprocess.TimeoutExpired:
                    print("FAIL", name, "CDP browser diagnostic timeout", flush=True)
                    failed += 1
                continue
            profile = str(pathlib.Path(profiles) / ("lesson-" + str(number)))
            cmd = [CHROME, "--headless", "--no-first-run", "--no-default-browser-check",
                   "--disable-gpu", "--disable-extensions", "--disable-background-networking",
                   "--disable-dev-shm-usage", "--user-data-dir="+profile,
                   "--virtual-time-budget=4000", "--dump-dom", base+rel]
            try:
                run = subprocess.run(cmd, capture_output=True, text=True, timeout=35)
                dom = run.stdout
                if run.returncode or "<html" not in dom.lower():
                    print("FAIL", name, "browser failed", run.returncode); failed += 1
                elif 'data-algebra1-lesson-render="error"' in dom:
                    print("FAIL", name, "Algebra I renderer error"); failed += 1
                elif name == "Algebra I lesson 01" and 'data-algebra1-lesson-render="ready"' not in dom:
                    print("REVIEW", name, "renderer status not ready (possible learner gate)")
                elif re.search(r"Lesson unavailable|Unrecognized Unit 01 page mode", dom, re.I):
                    print("FAIL", name, "lesson unavailable"); failed += 1
                else:
                    print("PASS", name, "page rendered (not a full interaction certification)")
            except subprocess.TimeoutExpired:
                print("FAIL", name, "browser timeout"); failed += 1

finally:
    server.shutdown()
print("Browser smoke failures:", failed)
sys.exit(1 if failed else 0)
