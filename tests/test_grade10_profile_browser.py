"""Grade 09 visual reference versus Grade 10 student-profile browser smoke.
Read-only, fictional/anonymous browser contexts; never touches live learner data.
"""
from __future__ import annotations

import functools
import http.server
import pathlib
import threading
from contextlib import contextmanager
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
PREFIX = "/grades/grade-10/student-profile/"
ROOMS = ["", "profile/", "daily-lessons/", "grades/", "games/", "settings/"]


@contextmanager
def local_site():
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, fmt, *args):
            pass
    handler = functools.partial(Handler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


def test_grade10_profile_rooms_desktop_and_mobile():
    with local_site() as origin, sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        try:
            for width in [1280, 390]:
                ctx = browser.new_context(viewport={"width": width, "height": 820})
                try:
                    page = ctx.new_page()
                    for route in ROOMS:
                        response = page.goto(origin + PREFIX + route, wait_until="domcontentloaded", timeout=20000)
                        assert response and response.status == 200, f"{route}: not delivered"
                        page.wait_for_timeout(900)
                        title = page.locator("h1").first
                        assert title.is_visible(), f"{width}px {route}: no visible heading"
                        assert title.count() == 1
                        assert page.locator("main").count() == 1, f"{route}: one main landmark required"
                        assert page.locator("footer").count() >= 1, f"{route}: footer missing"
                        if route:
                            hero = page.locator(".g10-hero")
                            assert hero.is_visible(), f"{route}: Grade 10 room hero is missing"
                            assert page.locator(".g10-rooms a").count() >= 5
                            assert page.locator("body").get_attribute("data-grade") == "10"
                            # Empty storage is not a valid learner session. Owner-only controls fail closed.
                            if route in ["daily-lessons/", "settings/"]:
                                assert not page.locator("[data-owner-only]").first.is_visible(), (
                                    f"{route}: private controls visible without learner selection"
                                )
                        else:
                            assert title.inner_text().strip() == "My Student Profile"
                            assert page.locator("a[href='profile/']").count() >= 1
                            assert page.locator("a[href='daily-lessons/']").count() >= 1
                            assert page.locator("a[href='grades/']").count() >= 1
                        # Measure page-owned content; shared tickers have their own independent rail.
                        w = page.evaluate("""() => {
                            const host = document.querySelector('.g10-shell,main .shell') || document.querySelector('main');
                            return host ? {scroll:host.scrollWidth,client:host.clientWidth} : null
                        }""")
                        assert w and w["scroll"] <= w["client"] + 3, f"{width}px {route}: local content overflows {w}"
                        print(f"PASS Grade 10 {route or 'dashboard/'} {width}px")
                    # Grade 09 reference remains readable and on its own route.
                    reference = page.goto(origin + "/grades/grade-09/student-profile/", wait_until="domcontentloaded", timeout=20000)
                    assert reference and reference.status == 200
                    page.wait_for_timeout(600)
                    assert page.locator("h1").first.inner_text().strip() == "My Student Profile"
                    print(f"PASS Grade 09 reference {width}px")
                finally:
                    ctx.close()
        finally:
            browser.close()
