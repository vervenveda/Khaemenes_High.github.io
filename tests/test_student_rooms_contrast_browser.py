"""Visual and accessible-color gate for the Grade 09 Student Rooms reference section.
Runs against a locally served checkout with a fresh, unregistered browser context.
No learner data, account mutation, or STOS authority access.
"""
import functools
import json
import http.server
import pathlib
import re
import threading
from contextlib import contextmanager
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
PAGE = "/grades/grade-09/student-profile/"
OUT = ROOT / "artifacts" / "grade09-student-rooms"


@contextmanager
def local_site():
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, fmt, *args):
            pass
    server = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 0), functools.partial(Handler, directory=str(ROOT))
    )
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=3)


def rgb(value):
    found = re.search(r"rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)", value)
    assert found, f"Unrecognized computed color: {value}"
    return tuple(int(part) for part in found.groups())


def luminance(color):
    values = []
    for component in color:
        c = component / 255.0
        values.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2]


def contrast(a, b):
    x, y = sorted([luminance(a), luminance(b)], reverse=True)
    return (x + 0.05) / (y + 0.05)


def test_student_rooms_reference_contrast_desktop_mobile():
    """Check both canonical and saved section colors; never read real student data."""
    OUT.mkdir(parents=True, exist_ok=True)
    guest_key = "khaemenes.grade09.profile.background.sections.v1:__grade09_guest_design__"
    with local_site() as site, sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        try:
            for scenario, selected_color in (
                ("default", None),
                ("saved-light", "#fffdf8"),
                ("saved-dark", "#243038"),
            ):
                for width in (1280, 390):
                    ctx = browser.new_context(viewport={"width": width, "height": 840})
                    try:
                        page = ctx.new_page()
                        if selected_color:
                            choices = {
                                key: {"mode": "custom", "color": selected_color, "emoji": ""}
                                for key in ("rooms", "family", "campus")
                            }
                            page.add_init_script(
                                "localStorage.setItem("
                                + json.dumps(guest_key) + ","
                                + json.dumps(json.dumps(choices)) + ");"
                            )
                        response = page.goto(site + PAGE, wait_until="domcontentloaded", timeout=20000)
                        assert response and response.status == 200
                        page.wait_for_function(
                            "() => !document.body.classList.contains('grade09-preparing')",
                            timeout=6500,
                        )
                        rooms = page.locator("section.student-rooms-contrast")
                        parent = page.locator("section.student-access-contrast")
                        campus = page.locator("section.student-campus-contrast")
                        assert rooms.count() == parent.count() == campus.count() == 1
                        assert rooms.is_visible() and parent.is_visible() and campus.is_visible()
                        assert rooms.locator("a.door").count() == 4
                        if selected_color:
                            page.wait_for_function(
                                "() => ['.student-rooms-contrast','.student-access-contrast','.student-campus-contrast'].every("
                                "s => document.querySelector(s)?.getAttribute('data-student-section-color-override') === 'true')",
                                timeout=10000,
                            )
                        else:
                            assert not rooms.get_attribute("data-student-section-color-override")
                        for section in (rooms, parent, campus):
                            assert section.evaluate("(el) => getComputedStyle(el).borderRadius") == "7px"

                        def readable(label, text, surface):
                            fg = rgb(text.evaluate("(el) => getComputedStyle(el).color"))
                            bg = rgb(surface.evaluate("(el) => getComputedStyle(el).backgroundColor"))
                            ratio = contrast(fg, bg)
                            assert ratio >= 4.5, (
                                f"{scenario} {width}px {label} contrast too low: {ratio:.2f} "
                                f"fg={fg} bg={bg}"
                            )

                        checks = [
                            (rooms.locator("h2"), rooms, "Student Rooms heading"),
                            (rooms.locator("p").first, rooms, "Student Rooms description"),
                            (rooms.locator("a.door").first.locator("b"), rooms.locator("a.door").first, "Room heading"),
                            (rooms.locator("a.door").first.locator("span span"), rooms.locator("a.door").first, "Room description"),
                            (parent.locator("h2"), parent, "Parent Access heading"),
                            (parent.locator("p"), parent, "Parent Access description"),
                            (campus.locator("h2"), campus, "Different Door heading"),
                            (campus.locator("p"), campus, "Different Door description"),
                        ]
                        for text, surface, label in checks:
                            readable(label, text, surface)
                        for surface, label in (
                            (parent, "Parent Access"),
                            (campus, "Different Door"),
                        ):
                            for button in surface.locator("a.btn").all():
                                readable(label + " button", button, button)
                        for section, name in (
                            (rooms, "student-rooms"),
                            (parent, "parent-access"),
                            (campus, "different-door"),
                        ):
                            assert section.evaluate("(el) => el.scrollWidth <= el.clientWidth + 3")
                            section.screenshot(
                                path=str(OUT / f"grade09-{name}-{scenario}-{width}.png")
                            )
                        print(f"PASS Grade 09 {scenario} three-section contrast at {width}px")
                    finally:
                        ctx.close()
        finally:
            browser.close()
