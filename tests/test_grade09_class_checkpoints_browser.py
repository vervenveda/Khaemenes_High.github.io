"""Grade 09 Academy: read-only 4x4 daily checkpoint visual / topology gate.
Serves a clean repository checkout, never opens real learner records.
"""
import functools
import http.server
import pathlib
import threading
from contextlib import contextmanager

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "artifacts" / "grade09-class-checkpoints"


@contextmanager
def serve_checkout():
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, fmt, *args):
            pass
    site = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 0), functools.partial(Handler, directory=str(ROOT))
    )
    thread = threading.Thread(target=site.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{site.server_address[1]}"
    finally:
        site.shutdown()
        site.server_close()
        thread.join(timeout=3)


def test_grade09_checkpoints_below_explore_four_by_four():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with serve_checkout() as origin, sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        try:
            for width, height, expected_columns in (
                (1280, 900, 4),
                (720, 900, 2),
                (390, 844, 1),
            ):
                context = browser.new_context(
                    viewport={"width": width, "height": height},
                    reduced_motion="reduce",
                )
                try:
                    page = context.new_page()
                    response = page.goto(
                        origin + "/grades/grade-09/student-profile/",
                        wait_until="domcontentloaded",
                        timeout=30000,
                    )
                    assert response and response.status == 200
                    page.wait_for_function(
                        "() => document.querySelectorAll("
                        "'main > #grade09AcademicCheckpoints .grade09-academic-box').length === 16",
                        timeout=18000,
                    )
                    section = page.locator("main > #grade09AcademicCheckpoints")
                    explore = page.locator("main > #grade09Explore")
                    assert section.count() == 1
                    assert section.is_visible()
                    assert explore.count() == 1
                    assert explore.evaluate(
                        "(el) => el.nextElementSibling?.id === 'grade09AcademicCheckpoints'"
                    ), "Checkpoints must immediately follow the completed Explore section"
                    cards = section.locator(".grade09-academic-box")
                    assert cards.count() == 16
                    assert section.locator('[data-checkpoint-type="lesson"]').count() == 8
                    assert section.locator('[data-checkpoint-type="unit"]').count() == 8
                    assert section.locator('input[type="checkbox"]').count() == 0, (
                        "Academic checkpoints must not accept student self-awarded mastery"
                    )
                    assert section.locator(".grade09-academic-link").count() == 16
                    metrics = section.evaluate("""el => {
                        const grid=el.querySelector('.grade09-academic-grid');
                        const style=getComputedStyle(grid),box=grid.getBoundingClientRect();
                        return {
                            columns:style.gridTemplateColumns.trim().split(/\s+/).length,
                            scrollOverflow:el.scrollWidth > el.clientWidth + 3,
                            gridOverflow:grid.scrollWidth > grid.clientWidth + 3,
                            border:getComputedStyle(el).borderTopWidth
                        };
                    }""")
                    assert metrics["columns"] == expected_columns, metrics
                    assert not metrics["scrollOverflow"], metrics
                    assert not metrics["gridOverflow"], metrics
                    assert metrics["border"] == "3px", metrics
                    assert cards.first.locator(".grade09-academic-state").inner_text() == "Not reported today"
                    section.screenshot(
                        path=str(OUTPUT / f"grade09-sixteen-checkpoints-{width}.png"),
                        animations="disabled",
                    )
                    print(f"PASS Grade 09 checkpoint grid {width}px = {expected_columns} columns x "
                          f"{16 // expected_columns} rows")
                finally:
                    context.close()
        finally:
            browser.close()
