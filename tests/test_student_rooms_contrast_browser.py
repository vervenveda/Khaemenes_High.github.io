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
                        if scenario == "default" and width == 1280:
                            audit = page.evaluate("""() => {
                                const css='student-profile-rooms-contrast.css';
                                const nodes=['.student-rooms-contrast','.student-access-contrast','.student-campus-contrast'];
                                return {
                                    sheets:[...document.styleSheets].map(s=>({href:s.href||'INLINE',disabled:s.disabled,media:s.media?.mediaText,owner:s.ownerNode?.outerHTML?.slice(0,200),rules:s.cssRules?.length})),
                                    inlineStyleSheets:[...document.adoptedStyleSheets].map(s=>({disabled:s.disabled,rules:s.cssRules?.length})),
                                    bodyAttrs:document.body.outerHTML.slice(0,450),
                                    computedMatch:(()=>{const e=document.querySelector('.student-access-contrast'),r=e.getBoundingClientRect();
                                      return {style:getComputedStyle(e).cssText,background:getComputedStyle(e).background,
                                        color:getComputedStyle(e).color,rect:[r.width,r.height],
                                        transition:getComputedStyle(e).transition,animation:getComputedStyle(e).animationName,
                                        bgFromVar:getComputedStyle(e).getPropertyValue('--panel')}})(),
                                    applicableRules:(()=>{
                                      const e=document.querySelector('.student-access-contrast'),found=[];
                                      for(const sheet of document.styleSheets){
                                        let rules;
                                        try{rules=sheet.cssRules}catch{continue}
                                        for(const rule of rules){
                                          if(!rule.selectorText||!rule.style)continue;
                                          let ok=false;
                                          try{ok=e.matches(rule.selectorText)}catch{}
                                          if(!ok)continue;
                                          for(const prop of ['background','background-color','background-image']){
                                            const val=rule.style.getPropertyValue(prop);
                                            if(val)found.push({sheet:sheet.href||'INLINE',selector:rule.selectorText.slice(0,220),
                                              prop,value:val,priority:rule.style.getPropertyPriority(prop)});
                                          }
                                        }
                                      }
                                      return found.slice(-32);
                                    })(),
                                    sections:nodes.map(q=>{
                                        const el=document.querySelector(q), computed=getComputedStyle(el);
                                        return {name:q,domParent:el.parentElement?.className,
                                            selectorMatch:el.matches('html body main .grid > section'+q),
                                            inline:el.getAttribute('style'),
                                            background:computed.backgroundColor,
                                            image:computed.backgroundImage,
                                            title:getComputedStyle(el.querySelector('h2')).color,
                                            customMode:el.getAttribute('data-student-section-color-override')}
                                    })
                                };
                            }""")
                            print("CSS_TOPOLOGY_DIAGNOSTIC", audit, flush=True)
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
                            bg_css = surface.evaluate("(el) => getComputedStyle(el).backgroundColor")
                            # Transparent buttons inherit the panel's visible background;
                            # rgba(0,0,0,0) is not an opaque black button.
                            if bg_css.startswith("rgba(") and float(bg_css.split(",")[-1].strip(" )")) == 0:
                                bg_css = surface.evaluate(
                                    "(el) => getComputedStyle(el.closest('.student-access-contrast,.student-campus-contrast,.student-rooms-contrast')).backgroundColor"
                                )
                            bg = rgb(bg_css)
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


def test_student_rooms_upper_grades_reference():
    """Grade 10–12 must remain readable even before family registration."""
    OUT.mkdir(parents=True, exist_ok=True)
    with local_site() as site, sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        try:
            for grade in (10, 11, 12):
                for width in (1280, 390):
                    ctx = browser.new_context(viewport={"width": width, "height": 840})
                    try:
                        page = ctx.new_page()
                        response = page.goto(
                            site + f"/grades/grade-{grade}/student-profile/",
                            wait_until="domcontentloaded",
                            timeout=25000,
                        )
                        assert response and response.status == 200
                        rooms = page.locator("section.student-rooms-contrast")
                        parent = page.locator("section.student-access-contrast")
                        campus = page.locator("section.student-campus-contrast")
                        assert rooms.count() == parent.count() == campus.count() == 1
                        assert rooms.is_visible() and parent.is_visible() and campus.is_visible()
                        assert rooms.locator("a.door").count() == 4
                        for surface in (rooms, parent, campus):
                            assert surface.evaluate(
                                "(el) => getComputedStyle(el).borderRadius"
                            ) == "7px"
                            assert surface.evaluate(
                                "(el) => el.scrollWidth <= el.clientWidth + 3"
                            )
                        for text, surface, label in [
                            (rooms.locator("h2"), rooms, "Student Rooms heading"),
                            (rooms.locator("p").first, rooms, "Student Rooms copy"),
                            (parent.locator("h2"), parent, "Parent Access heading"),
                            (parent.locator("p"), parent, "Parent Access copy"),
                            (campus.locator("h2"), campus, "Different Door heading"),
                            (campus.locator("p"), campus, "Different Door copy"),
                            (rooms.locator(".door").first.locator("b"), rooms.locator(".door").first, "Room title"),
                        ]:
                            fore = rgb(text.evaluate("(el) => getComputedStyle(el).color"))
                            back = rgb(surface.evaluate("(el) => getComputedStyle(el).backgroundColor"))
                            ratio = contrast(fore, back)
                            assert ratio >= 4.5, (
                                f"Grade {grade} {width}px {label} contrast={ratio:.2f} "
                                f"fg={fore}, bg={back}"
                            )
                        for section, name in (
                            (rooms, "student-rooms"),
                            (parent, "parent-access"),
                            (campus, "different-door"),
                        ):
                            section.screenshot(
                                path=str(OUT / f"grade{grade}-{name}-default-{width}.png")
                            )
                        if grade in (11, 12):
                            assert rooms.locator("a.door").last.get_attribute("href") == "#grade09ProfileFirst"
                            assert parent.locator("a.btn").get_attribute("href") == (
                                "https://vervenveda.com/Khaemenes_Academy.github.io/family/"
                            )
                        print(f"PASS Grade {grade} approved Student Rooms at {width}px")
                    finally:
                        ctx.close()
        finally:
            browser.close()
