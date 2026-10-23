# -*- coding: utf-8 -*-
"""Generates the five HTML pages in the repo root.

The HTML files ARE the deliverable — the site has no build step and deploys as
static files. This script exists so shared chrome (nav, footer, <head>, the FAQ,
the icon set) lives in one place instead of being hand-synced across five pages.

    python3 tools/build.py

If you would rather work in the HTML directly, that is fine: delete this file so
nobody regenerates over your edits. Do not keep both as sources of truth.

Requires Pillow (reads the work-image dimensions so every <img> ships width and
height): pip install pillow
"""
import pathlib
from PIL import Image

OUT = pathlib.Path(__file__).resolve().parent.parent
IMGDIR = OUT / "assets/img/work"

# The production origin. Change this one line when the final domain is known —
# it drives every canonical URL, the og:url tags and sitemap.xml.
SITE_URL = "https://stillsonsticks.com"

EMAIL = "yuhanperera@stillsonsticksteam.com"
PHONE_H = "+61 452 273 793"
PHONE_R = "+61452273793"
ADDRESS = "120, Lotus Grove, Dehiwala, Colombo, Sri Lanka"

# key -> (client, video title, category)
W = {
 "cybersec-career":     ("CyberSec People", "10 Minutes of the Best Cybersecurity Career Advice on the Internet", "growth"),
 "untold-racing":       ("Untold Racing",   "Funny Racing Fails In F1 History (&amp; others)", "growth"),
 "jake-gordon":         ("Jake Gordon",     "Beginner Tries Dropshipping with $0 (LIFE CHANGING)", "growth"),
 "drkaran-cgm":         ("Dr. Karan",       "The Dumbest Health Trend Of 2024: CGM", "growth"),
 "andy-3k-day":         ("Andy Stauring",   "How To Find $3K/Day Winning Dropshipping Products In 10 Minutes", "growth"),
 "bb-tiananmen":        ("Business Basics", "Tiananmen Square 2.0: Protesters Demand Xi Jinping Step Down", "growth"),
 "bb-china-mortgage":   ("Business Basics", "China&rsquo;s Mortgage Crisis, Banks are Failing, Protests Everywhere", "post"),
 "drkaran-vaping":      ("Dr Karan",        "The Truth About Vaping", "post"),
 "andy-vision-pro":     ("Andy Stauring",   "I Tried Dropshipping in Apple Vision Pro (RAW)", "full"),
 "gridware-cyber":      ("Gridware",        "The Cyber Onslaught of 2023: Inside the Biggest Digital Disasters", "full"),
 "drkaran-supplements": ("Dr Karan",        "Doctor Ranks Every Supplement: Worst to Best", "post"),
 "bb-north-korea":      ("Business Basics", "North Korea is FINISHED, KIM can no longer hide it", "post"),
}
DIM = {k: Image.open(IMGDIR / f"{k}.jpg").size for k in W}

CAT = {"growth": "Growth / Optimization", "post": "Post-Production", "full": "Full Production"}

I = {
"arr":  '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
"chev": '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
"close":'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
"li":   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9.5 9H13v1.7a3.8 3.8 0 0 1 3.4-1.9c3 0 4.6 1.9 4.6 5.4V21h-4v-5.9c0-1.5-.5-2.5-1.9-2.5-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1V21h-4V9Z"/></svg>',
"yt":   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z"/></svg>',
"ig":   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.9 3.9 0 0 1-1.4-.9 3.9 3.9 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.4A6.4 6.4 0 1 0 18.4 12 6.4 6.4 0 0 0 12 5.6Zm0 10.5A4.1 4.1 0 1 1 16.1 12 4.1 4.1 0 0 1 12 16.1Zm6.6-10.7a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5Z"/></svg>',
}


# A single 24px line set. Geometry only — .ico supplies stroke, width and caps,
# so every icon on the site is visually consistent by construction.
_P = {
 "target":  '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
 "film":    '<rect x="2.6" y="4.6" width="18.8" height="14.8" rx="2"/><path d="M7.4 4.6v14.8M16.6 4.6v14.8M2.6 12h18.8M2.6 8.3h4.8M2.6 15.7h4.8M16.6 8.3h4.8M16.6 15.7h4.8"/>',
 "camera":  '<rect x="2.6" y="6.6" width="13" height="10.8" rx="2.2"/><path d="m15.6 11 5.8-3.2v8.4L15.6 13z"/>',
 "play":    '<circle cx="12" cy="12" r="9"/><path d="M10.2 8.6 15.6 12l-5.4 3.4z"/>',
 "trend":   '<path d="M3 17.5 9 11l4 3.6 7.2-7.6"/><path d="M15.4 6.6h5v5"/>',
 "clock":   '<circle cx="12" cy="12" r="8.8"/><path d="M12 7.2V12l3.2 1.9"/>',
 "mail":    '<rect x="2.6" y="5" width="18.8" height="14" rx="2.2"/><path d="m3.4 7.2 8.6 5.6 8.6-5.6"/>',
 "phone":   '<path d="M5 3.8h3l1.6 4-2.1 1.5a12.2 12.2 0 0 0 6.2 6.2l1.5-2.1 4 1.6v3a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 3 6 2 2 0 0 1 5 3.8Z"/>',
 "pin":     '<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
 "check":   '<path d="m4.5 12.5 4.8 4.8L19.5 7"/>',
 "spark":   '<path d="M12 3.2 13.9 9l5.8 1.9-5.8 1.9L12 18.6 10.1 12.8 4.3 10.9 10.1 9z"/><path d="M18.6 3.4v3M17.1 4.9h3"/>',
 "layers":  '<path d="m12 3.4 8.6 4.5-8.6 4.5-8.6-4.5z"/><path d="m3.4 12.6 8.6 4.5 8.6-4.5"/><path d="m3.4 16.4 8.6 4.5 8.6-4.5"/>',
 "users":   '<circle cx="9.2" cy="8.4" r="3.4"/><path d="M3 19.2a6.2 6.2 0 0 1 12.4 0"/><path d="M16.2 5.4a3.4 3.4 0 0 1 0 6M17.6 13.6a6.2 6.2 0 0 1 3.6 5.6"/>',
 "bolt":    '<path d="M13.2 2.8 5.4 13.4h5.1l-.7 7.8 7.8-10.6h-5.1z"/>',
 "scissors":'<circle cx="6.4" cy="6.4" r="2.6"/><circle cx="6.4" cy="17.6" r="2.6"/><path d="M8.6 7.9 20 17.2M20 6.8 8.6 16.1"/>',
 "wave":    '<path d="M3 12h2.4M8.2 12h2.4M13.4 12h2.4M18.6 12H21"/><path d="M5.4 7.6v8.8M10.6 5v14M15.8 8.8v6.4"/>',
 "calendar":'<rect x="3.2" y="5" width="17.6" height="16" rx="2.2"/><path d="M3.2 9.6h17.6M8 3.2v3.6M16 3.2v3.6"/>',
 "message": '<path d="M20.6 12.4a7.8 7.8 0 0 1-8.4 7.8L5 21.2l1-5.6a7.8 7.8 0 1 1 14.6-3.2Z"/>',
 "compass": '<circle cx="12" cy="12" r="8.8"/><path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6z"/>',
 "arrowdn": '<path d="M12 4v15M6.6 13.4 12 19l5.4-5.6"/>',
}

def ico(name, cls=""):
    return ('<svg class="ico%s" viewBox="0 0 24 24" aria-hidden="true">%s</svg>'
            % ((" " + cls) if cls else "", _P[name]))

def icotile(name):
    return '<span class="ico-tile" aria-hidden="true">%s</span>' % ico(name, "ico--lg")

NAV_ITEMS = [("Home", "index.html"), ("About", "about.html"), ("Services", "services.html"), ("Portfolio", "portfolio.html")]

# ------------------------------------------------------------------ helpers
def img(key, sizes, eager=False, cls=""):
    client, title, _ = W[key]
    w, h = DIM[key]
    return ('<img src="assets/img/work/%s.jpg" alt="Still from &ldquo;%s&rdquo; &mdash; %s" '
            'width="%d" height="%d" sizes="%s" %s%s>'
            % (key, title.replace('"', "&quot;"), client, w, h, sizes,
               'loading="eager" fetchpriority="high" decoding="async"' if eager
               else 'loading="lazy" decoding="async"',
               (' class="%s"' % cls) if cls else ""))

def btn(label, href, kind="line", size="", icon="arr"):
    cls = "btn btn--" + kind + ((" btn--" + size) if size else "")
    return '<a class="%s" href="%s"><span>%s</span>%s</a>' % (cls, href, label, I.get(icon, ""))

def workcard(key, sizes="(max-width:620px) 92vw, 30vw", wide=False, extra=""):
    client, title, cat = W[key]
    return ('<article class="wk%s" data-cat="%s" data-reveal%s>'
            '<div class="wk__shot" data-wipe data-title="%s">%s</div>'
            '<div><h3 class="wk__client">%s</h3><p class="wk__desc">%s</p></div>'
            '<p class="wk__meta"><span>%s</span></p>'
            '</article>'
            % (" is-wide" if wide else "", cat, (" " + extra) if extra else "",
               title.replace('"', "&quot;"), img(key, sizes), client, title, CAT[cat]))

def reel(keys, speed, reverse=False):
    items = "".join(
        '<div class="reel__item">%s</div>' % img(k, "(max-width:700px) 60vw, 24vw") for k in keys)
    return ('<div class="reel" style="--speed:%ds%s"><div class="reel__track">%s</div></div>'
            % (speed, ";--dir:reverse" if reverse else "", items))

def ticker(words, speed=40):
    item = '<span class="ticker__item">%s</span>' % "".join(
        "%s<i>&#9679;</i>" % w for w in words)
    return ('<div class="ticker" style="--speed:%ds"><div class="ticker__track">%s</div></div>'
            % (speed, item))

# ------------------------------------------------------------------ chrome
def head(title, desc, page):
    return """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%s</title>
<meta name="description" content="%s">
<meta name="theme-color" content="#0c0c0e">
<script>
  /* Mark that JS is live so the scroll-reveal styles apply. If motion.js never
     boots (blocked, failed or slow), drop the flag so nothing stays hidden. */
  document.documentElement.classList.add("js");
  setTimeout(function () {
    if (!document.body || !document.body.dataset.motion) {
      document.documentElement.classList.remove("js");
    }
  }, 2500);
</script>
<link rel="canonical" href="%s/%s">
<meta property="og:url" content="%s/%s">
<meta property="og:type" content="website">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:site_name" content="SOS — Stills on Sticks">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@84..100,400..900&family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/glass.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/sections.css">
<link rel="stylesheet" href="assets/css/cinema.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="atmos" aria-hidden="true"><div class="atmos__vignette"></div><div class="atmos__grain"></div></div>
<div class="progress" aria-hidden="true"></div>
""" % (title, desc, SITE_URL, page, SITE_URL, page, title, desc)

def nav(active):
    links = "".join(
        '<a href="%s"%s%s>%s</a>' % (h, ' class="is-active"' if l == active else "",
                                     ' aria-current="page"' if l == active else "", l)
        for l, h in NAV_ITEMS)
    drawer = "".join(
        '<a href="%s" style="--i:%d"%s><i>0%d</i>%s</a>'
        % (h, i, ' class="is-active"' if l == active else "", i + 1, l)
        for i, (l, h) in enumerate(NAV_ITEMS + [("Contact", "contact.html")]))
    return """
<header class="nav">
  <div class="nav__inner shell">
    <a class="nav__logo" href="index.html" aria-label="SOS, Stills on Sticks — home"><span>SOS</span><em>.</em></a>
    <nav class="nav__links" aria-label="Primary">%s</nav>
    <div class="nav__actions">
      <a class="btn btn--primary btn--sm" href="contact.html"><span>Book a call</span>%s</a>
      <button class="nav__burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer__list">%s
    <a class="btn btn--primary btn--lg" href="contact.html"><span>Book a free call</span>%s</a>
  </div>
</div>
""" % (links, I["arr"], drawer, I["arr"])

def footer():
    nav_links = "".join('<a href="%s">%s</a>' % (h, l) for l, h in NAV_ITEMS)
    return """
<footer class="footer">
  <div class="shell">
    <div class="footer__grid">
      <div>
        <a class="nav__logo" href="index.html" aria-label="SOS, Stills on Sticks — home"><span>SOS</span><em>.</em></a>
        <p class="small muted" style="margin-block-start:.9rem;max-inline-size:34ch">
          End-to-end production for YouTube brands &mdash; creators and businesses of all sizes, any niche.
        </p>
        <div class="socials" style="margin-block-start:1.3rem">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">%s</a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">%s</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">%s</a>
        </div>
      </div>
      <nav aria-label="Footer">
        <h2 class="footer__title">Pages</h2>
        <div class="footer__list">%s<a href="contact.html">Contact</a></div>
      </nav>
      <div>
        <h2 class="footer__title">Contact</h2>
        <div class="footer__list">
          <span style="color:var(--fg-2)">Yuhan Perera</span>
          <a href="tel:%s">%s</a>
          <a href="mailto:%s">%s</a>
        </div>
      </div>
      <div>
        <h2 class="footer__title">Location</h2>
        <div class="footer__list"><span>%s</span></div>
      </div>
    </div>
    <div class="footer__base">
      <span>&copy; <span data-year>2026</span> Stills on Sticks. All rights reserved.</span>
      <span>Built for creators who refuse to be skipped.</span>
    </div>
  </div>
</footer>
<script src="assets/js/cinema.js" defer></script>
<script src="assets/js/motion.js" defer></script>
<script src="assets/js/app.js" defer></script>
</body>
</html>
""" % (I["li"], I["yt"], I["ig"], nav_links, PHONE_R, PHONE_H, EMAIL, EMAIL, ADDRESS)


def _assert_clean(fn):
    import html.parser, collections
    bad = []
    class P(html.parser.HTMLParser):
        def handle_starttag(self, t, attrs):
            for n, c in collections.Counter(a[0] for a in attrs).items():
                if c > 1: bad.append((self.getpos()[0], t, n))
        handle_startendtag = handle_starttag
    P().feed((OUT / fn).read_text())
    if bad:
        raise SystemExit("duplicate attributes in %s: %s" % (fn, bad))

def write(fn, title, desc, active, body):
    (OUT / fn).write_text(head(title, desc, fn) + nav(active) + '\n<main id="main">\n' + body + '\n</main>\n' + footer(), encoding="utf-8")
    _assert_clean(fn)
    print("wrote", fn)

# ================================================================== shared
FAQS = [
 ("What services do you offer?",
  "YouTube strategy, post-production, and full video production. Whether you&rsquo;re starting from "
  "scratch or refining an approach that already works, we cover it end to end."),
 ("How long does production take?",
  "It depends on scope. A post-production edit moves fastest &mdash; we start the moment your footage "
  "lands. A full production runs creative &amp; script, filming day, then post and delivery, so your "
  "shoot schedule sets the timeline. We agree exact dates on the kickoff call."),
 ("Can you help with strategy?",
  "Yes &mdash; it&rsquo;s where every engagement starts. We audit your niche, audience and channel, then "
  "build a monthly roadmap covering pillars and cadence, with ongoing performance tracking."),
 ("Do you offer revisions?",
  "Yes. Client review is a built-in stage, not an afterthought. Every edit comes to you before delivery "
  "and we work your notes until the cut is right."),
]

def faq(prefix="f"):
    out = ""
    for i, (q, a) in enumerate(FAQS):
        op = i == 0
        out += ('<div class="acc__item%s" data-reveal style="--i:%d">'
                '<button class="acc__btn" type="button" aria-expanded="%s" aria-controls="%s-p%d" id="%s-b%d">'
                '<span>%s</span><span class="acc__icon" aria-hidden="true"></span></button>'
                '<div class="acc__panel" id="%s-p%d" role="region" aria-labelledby="%s-b%d" aria-hidden="%s">'
                '<div><p>%s</p></div></div></div>'
                % (" is-open" if op else "", i, "true" if op else "false", prefix, i, prefix, i, q,
                   prefix, i, prefix, i, "false" if op else "true", a))
    return out

STEPS = [
 ("Strategy", "compass", "Where the work actually starts.", [
   "Audit &amp; research", "Content plan", "Growth support"]),
 ("Post-production", "scissors", "Raw footage in, scroll-stopping cut out.", [
   "Footage intake", "Edit + effects", "Client review"]),
 ("Full production", "camera", "First idea to final frame.", [
   "Creative &amp; script", "Filming day", "Post &amp; delivery"]),
]

def steps():
    out = ""
    for i, (t, icon, note, items) in enumerate(STEPS):
        lis = "".join("<li>%s</li>" % x for x in items)
        out += ('<div class="step" data-reveal style="--i:%d">'
                '<span class="step__n" aria-hidden="true">%02d</span>'
                '<div><h3 class="step__t">%s %s</h3><p class="step__note">%s</p>'
                '<ul class="step__items">%s</ul></div></div>'
                % (i, i + 1, ico(icon), t, note, lis))
    return out

SERVICES = [
 ("YouTube Strategy", "target", "drkaran-cgm",
  "Data-backed plans built for YouTube&rsquo;s demands &mdash; content pillars, packaging and cadence that turn viewers into customers."),
 ("Post-Production", "scissors", "bb-china-mortgage",
  "Sharp cuts, colour, motion graphics, sound design and smart CTAs, all tuned for retention."),
 ("Full Video Production", "camera", "gridware-cyber",
  "Scripting, storyboarding, directing, lighting and production &mdash; in-studio or on location."),
]

def srows(linked=True):
    out = ""
    for i, (t, icon, peek, d) in enumerate(SERVICES):
        tag = "a" if linked else "div"
        href = ' href="services.html"' if linked else ""
        go = ('<span class="srow__go" aria-hidden="true">%s</span>' % I["chev"]) if linked else ""
        out += ('<%s class="srow"%s data-peek="assets/img/work/%s.jpg" data-reveal style="--i:%d">'
                '<span class="srow__n">%s 0%d</span>'
                '<span class="srow__t">%s</span>'
                '<span class="srow__d">%s</span>%s</%s>'
                % (tag, href, peek, i, ico(icon), i + 1, t, d, go, tag))
    return out

def cta(title, body, label="Book a free call", href="contact.html"):
    stills = "".join(img(k, "25vw") for k in ["bb-tiananmen", "andy-3k-day", "drkaran-cgm", "untold-racing"])
    return """
<section class="section">
  <div class="shell">
    <div class="cta glass glass--r" data-reveal="still">
      <div class="cta__stills" aria-hidden="true">%s</div>
      <div class="cta__inner">
        <h2 class="cta__title">%s</h2>
        <p class="lede">%s</p>
        <div class="hero__cta">%s%s</div>
      </div>
    </div>
  </div>
</section>
""" % (stills, title, body, btn(label, href, "primary", "lg"), btn("See the work", "portfolio.html", "line", "lg"))

CLIENTS = ["Business Basics", "Dr Karan", "ZMDE", "Gridware", "Uppercuts",
           "Andy Stauring", "CyberSec People", "Untold Racing", "Jake Gordon"]

# ================================================================== HOME
CASES = [
 ("drkaran-supplements", "Dr Karan", "10%", " CTR &amp; 1M views",
  "Packaging first, then the edit &mdash; complex ideas broken down with high-quality motion graphics."),
 ("bb-north-korea", "Business Basics", "5M+", " views in 6 months",
  "Three years with the Business Basics team and several videos past five million. How? Timing."),
 ("cybersec-career", "ZMDE", "10M", " views in 30 days",
  "Fifteen videos in thirty days in early 2022, taking the channel past ten million views a month."),
]

def cases():
    out = ""
    for i, (key, client, big, rest, copy) in enumerate(CASES):
        out += ('<article class="case" data-reveal-group>'
                '<div class="case__media" data-wipe>%s</div>'
                '<div class="case__body">'
                '<p class="label label--red" data-reveal>%s</p>'
                '<h3 class="case__stat" data-reveal style="--i:1"><em>%s</em>%s</h3>'
                '<p class="case__copy" data-reveal style="--i:2">%s</p>'
                '</div></article>'
                % ('<div class="wk__shot">%s</div>' % img(key, "(max-width:860px) 92vw, 54vw"),
                   client, big, rest, copy))
    return out

ALL_KEYS = list(W.keys())


def wall():
    """Five drifting columns of real stills behind the headline."""
    out = ""
    for c in range(5):
        sl = [ALL_KEYS[(c * 5 + i) % len(ALL_KEYS)] for i in range(5)]
        items = "".join('<div class="cine__shot">%s</div>' % img(k, "24vw") for k in sl * 2)
        out += '<div class="cine__col">%s</div>' % items
    return out

def scrub_frames():
    out = ""
    for i, k in enumerate(ALL_KEYS):
        client, title, _ = W[k]
        w, h = DIM[k]
        out += ('<img src="assets/img/work/%s.jpg" alt="" width="%d" height="%d" '
                'data-client="%s" data-vtitle="%s" %s class="%s">'
                % (k, w, h, client, title.replace('"', "&quot;"),
                   'loading="lazy" decoding="async"', "is-on" if i == 0 else ""))
    return out

def scrub_ticks():
    return "".join('<span class="scrub__tick%s"></span>' % (" is-on" if i == 0 else "")
                   for i in range(len(ALL_KEYS)))

HGAL = ["bb-tiananmen", "drkaran-cgm", "gridware-cyber", "andy-vision-pro", "cybersec-career",
        "bb-china-mortgage", "andy-3k-day", "drkaran-vaping", "untold-racing", "jake-gordon",
        "bb-north-korea", "drkaran-supplements"]

def hgal_cards():
    out = ""
    for i, k in enumerate(HGAL):
        client, title, cat = W[k]
        out += ('<article class="hgal__card wk">'
                '<div class="wk__shot">%s</div>'
                '<div><h3 class="wk__client">%s</h3><p class="wk__desc">%s</p></div>'
                '<p class="wk__meta"><span>%02d</span><span>%s</span></p>'
                '</article>'
                % (img(k, "(max-width:700px) 80vw, 36vw"), client, title, i + 1, CAT[cat]))
    return out

HOME = """
<section class="cine">
  <div class="cine__wall" aria-hidden="true"><div class="cine__plane">%s</div></div>
  <div class="cine__veil" aria-hidden="true"></div>

  <div class="shell cine__body">
    <span class="gchip gchip--live"><span class="dot" aria-hidden="true"></span>Booking new channels for 2026</span>
    <h1 class="cine__title">
      <span class="line-mask"><span style="--w:0"><em class="counter" data-count="164" data-suffix="M+">0</em></span></span>
      <span class="line-mask"><span style="--w:1">views, edited</span></span>
      <span class="line-mask"><span style="--w:2">frame by frame<em>.</em></span></span>
      <span class="sm">Strategy, post-production and full production for YouTube brands.</span>
    </h1>
    <div class="hero__cta">%s%s</div>
  </div>

  <div class="cine__hud" aria-hidden="false">
    <div class="shell cine__hud-in">
      <div class="hud-stats">
        <span class="hud-stat">%s<b><span class="counter" data-count="10" data-suffix="M">0</span></b><span>views / 30 days</span></span>
        <span class="hud-stat">%s<b><span class="counter" data-count="5" data-suffix="M+">0</span></b><span>on one video</span></span>
        <span class="hud-stat">%s<b><span class="counter" data-count="3" data-suffix="+ yrs">0</span></b><span>with Business Basics</span></span>
      </div>
      <span class="cue">%s Scroll to scrub</span>
    </div>
  </div>
</section>

%s

<section aria-label="Recent work">
  %s
  %s
</section>

<section class="pin" data-pin data-scrub aria-labelledby="scrub-h">
  <div class="pin__stage">
    <div class="shell scrub">
      <div class="scrub__hud">
        <p class="label label--red">%s The cutting room</p>
        <h2 class="h2" id="scrub-h">Every frame <span class="serif">earns</span> the next.</h2>
        <p class="lede">Scroll to run the reel. Twelve videos we packaged, cut and shipped.</p>
        <div class="scrub__meta">
          <span class="scrub__idx">01</span><span class="scrub__total">/ %02d</span>
        </div>
        <div>
          <p class="scrub__client">%s</p>
          <p class="scrub__title">%s</p>
        </div>
        <div class="scrub__rail">%s<span class="scrub__head"></span></div>
      </div>
      <div class="scrub__frame">%s</div>
    </div>
  </div>
</section>

<section class="section bloom" aria-labelledby="fig-h">
  <div class="shell">
    <div class="section-head">
      <p class="label" data-reveal>%s By the numbers</p>
      <h2 class="h2" id="fig-h" data-reveal style="--i:1">Proof, not <span class="serif">promises.</span></h2>
    </div>
    <div class="figs" data-reveal-group>
      <div class="fig" data-reveal><p class="bignum"><span class="counter" data-count="164" data-suffix="M+">0</span></p><p class="fig__k">Views generated in 2026</p></div>
      <div class="fig" data-reveal><p class="bignum"><span class="counter" data-count="900" data-suffix="k+">0</span></p><p class="fig__k">Subscribers grown to</p></div>
      <div class="fig" data-reveal><p class="bignum"><span class="counter" data-count="15" data-suffix="">0</span></p><p class="fig__k">Videos shipped in 30 days</p></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="cases-h">
  <div class="shell">
    <div class="section-head">
      <p class="label" data-reveal>%s Case studies</p>
      <h2 class="h2" id="cases-h" data-reveal style="--i:1">Real results. <span class="serif">Real impact.</span></h2>
    </div>
    <div class="cases">%s</div>
  </div>
</section>

<section class="section" aria-labelledby="hg-h">
  <div class="shell hgal__head">
    <div>
      <p class="label" data-reveal>%s Selected work</p>
      <h2 class="h2" id="hg-h" data-reveal style="--i:1">The reel, <span class="serif">sideways.</span></h2>
    </div>
    <p class="muted small" data-reveal style="--i:2">Drag or scroll &rarr;</p>
  </div>
  <div class="hgal"><div class="hgal__track">%s</div></div>
</section>

<section class="section" aria-labelledby="svc-h">
  <div class="shell">
    <div class="section-head">
      <p class="label" data-reveal>%s What we do</p>
      <h2 class="h2" id="svc-h" data-reveal style="--i:1">Three ways <span class="serif">in.</span></h2>
    </div>
    <div data-reveal-group>%s</div>
  </div>
</section>

<section class="section" data-steps aria-labelledby="proc-h">
  <div class="shell">
    <div class="split">
      <div class="split__sticky">
        <p class="label" data-reveal>%s How we work</p>
        <h2 class="h2" id="proc-h" data-reveal style="--i:1;margin-block:.7rem 1rem">Simple, strategic, <span class="serif">seamless.</span></h2>
        <p class="lede" data-reveal style="--i:2">From concept to creation, content your audience finishes and your brand grows from.</p>
        <div data-reveal style="--i:3;margin-block-start:1.2rem">%s</div>
      </div>
      <div class="steps" data-reveal-group>%s</div>
    </div>
  </div>
</section>

<section class="section bloom" aria-labelledby="say-h">
  <div class="shell">
    <div class="split split--even">
      <div>
        <p class="label" data-reveal>%s What clients say</p>
        <h2 class="sr-only" id="say-h">Testimonials</h2>
        <div class="quote" style="margin-block-start:1.2rem">
          <blockquote class="quote__q" data-reveal>&ldquo;One of the best editors I&rsquo;ve worked with on YouTube. We started around
            <em>200k subs</em> &mdash; now I&rsquo;m at <em>900k+</em> in less than a year. I also had my most viewed video (5m+) with him.&rdquo;</blockquote>
          <figcaption class="quote__by" data-reveal style="--i:1">
            <span class="quote__ava" aria-hidden="true">BB</span>
            <span><span class="quote__name">Business Basics</span><br><span class="quote__handle">@BusinessBasicsYT</span></span>
          </figcaption>
        </div>
      </div>
      <div class="chart" data-reveal="still">
        <p class="label">%s Subscribers, one year</p>
        <div class="chart__plot">%s</div>
        <div class="chart__foot"><span>200k</span><span>900k+</span></div>
      </div>
    </div>
    <div class="grid grid-3" style="margin-block-start:clamp(2rem,5vw,3.5rem)" data-reveal-group>%s</div>
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="shell">
    <div class="split">
      <div class="split__sticky">
        <p class="label" data-reveal>%s FAQs</p>
        <h2 class="h2" id="faq-h" data-reveal style="--i:1">Questions, <span class="serif">answered.</span></h2>
        <div data-reveal style="--i:2;margin-block-start:1.2rem">%s</div>
      </div>
      <div class="acc" data-reveal-group>%s</div>
    </div>
  </div>
</section>

%s
"""

SHORT_QUOTES = [
 ("Steven", "@ZMDE", "ZM", "Very professional and amazing to work with. Takes instructions well and implements them quickly."),
 ("Brandon li", "@UntoldFinance", "UF", "An excellent video editor and visual storyteller. Patient, highly skilled, highly recommended."),
 ("Nir Tzvi", "@tzvi-eliezer-nir", "NT", "A hard worker, overdelivering and very creative. He knows how to receive feedback and quickly fix issues."),
]

def short_quotes():
    return "".join(
        '<figure class="tq" data-reveal style="--i:%d"><blockquote class="tq__q">&ldquo;%s&rdquo;</blockquote>'
        '<figcaption class="tq__by"><span class="quote__ava" aria-hidden="true">%s</span>'
        '<span><span class="quote__name">%s</span><br><span class="quote__handle">%s</span></span></figcaption></figure>'
        % (i, q, ini, n, h) for i, (n, h, ini, q) in enumerate(SHORT_QUOTES))

def chart_bars():
    vals = [18, 20, 23, 26, 25, 30, 34, 39, 43, 48, 46, 53, 59, 64, 70, 68, 75, 82, 88, 100]
    return "".join('<span class="chart__bar" style="--h:%d%%;--i:%d"></span>' % (v, i)
                   for i, v in enumerate(vals))

def build_home():
    first_client, first_title, _ = W[ALL_KEYS[0]]
    body = HOME % (
      wall(),
      btn("Book a free call", "contact.html", "primary", "lg"),
      btn("See the reel", "portfolio.html", "line", "lg"),
      ico("trend"), ico("play"), ico("users"), ico("arrowdn"),
      ticker(["Strategy", "Packaging", "Post-production", "Motion graphics", "Sound design", "Full production"]),
      reel(ALL_KEYS[:6] + ALL_KEYS[6:9], 70),
      reel(ALL_KEYS[6:] + ALL_KEYS[:3], 84, reverse=True),
      ico("film"), len(ALL_KEYS), first_client, first_title, scrub_ticks(), scrub_frames(),
      ico("trend"),
      ico("spark"),
      cases(),
      ico("layers"),
      hgal_cards(),
      ico("compass"),
      srows(),
      ico("wave"),
      btn("Start a project", "contact.html", "line"),
      steps(),
      ico("message"),
      ico("trend"),
      chart_bars(),
      short_quotes(),
      ico("message"),
      btn("Contact us", "contact.html", "line"),
      faq("h"),
      cta("Create videos that truly <em>make an impact</em>.",
          "From launch to growth, content designed to connect, engage and deliver."),
    )
    write("index.html",
          "SOS — Stills on Sticks | YouTube Strategy, Post-Production & Full Video Production",
          "164M+ views in 2026 alone. We strategize, script and produce YouTube content that fuels growth and drives real conversions.",
          "Home", body)

# ================================================================== PORTFOLIO
def page_hero(crumb, title, lede, aside=""):
    return """
<section class="page-hero">
  <div class="shell page-hero__grid">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb" data-reveal><a href="index.html">Home</a><span>/</span><span>%s</span></nav>
      <h1 class="page-hero__title" data-reveal style="--i:1">%s</h1>
    </div>
    <div data-reveal style="--i:2"><p class="lede">%s</p>%s</div>
  </div>
</section>
""" % (crumb, title, lede, aside)

WALL_ORDER = ["bb-tiananmen", "drkaran-cgm", "cybersec-career", "untold-racing", "jake-gordon",
              "andy-3k-day", "bb-china-mortgage", "drkaran-vaping", "andy-vision-pro",
              "gridware-cyber", "bb-north-korea", "drkaran-supplements"]
# Alternating wide/narrow rows stop the grid reading as a template
WIDE = {0, 1, 5, 6, 10, 11}

def build_portfolio():
    cards = "".join(
        workcard(k, "(max-width:620px) 92vw, (max-width:1000px) 46vw, %s" % ("46vw" if i in WIDE else "30vw"),
                 wide=(i in WIDE))
        for i, k in enumerate(WALL_ORDER))
    body = page_hero("Portfolio", "Where content meets <em>results</em>.",
        "Ideas turned into high-performing YouTube series that drive reach, revenue and real impact.") + """
<section class="section" style="padding-block-start:0">
  <div class="shell">
    <div class="filters" style="margin-block-end:clamp(1.5rem,3vw,2.5rem)" role="group" aria-label="Filter work" data-reveal>
      <button type="button" data-filter="all" aria-pressed="true">All work</button>
      <button type="button" data-filter="growth" aria-pressed="false">Growth / Optimization</button>
      <button type="button" data-filter="post" aria-pressed="false">Post-Production</button>
      <button type="button" data-filter="full" aria-pressed="false">Full Production</button>
    </div>
    <h2 class="sr-only">All work</h2>
    <div class="wall" data-reveal-group>%s</div>
  </div>
</section>
""" % cards + cta("Your channel could be next.",
                  "Tell us where you are and where you want to be. We&rsquo;ll show you the path between.")
    write("portfolio.html", "Portfolio — SOS | Stills on Sticks",
          "High-performing YouTube series that drive reach, revenue and real impact.", "Portfolio", body)

# ================================================================== SERVICES
SERVICE_DETAIL = [
 ("YouTube Strategy", "target", "drkaran-cgm", "Plan. Position. Perform.",
  ["Audit &amp; research &mdash; your niche, audience and channel insights",
   "Content plan &mdash; a monthly roadmap built for your brand",
   "Packaging &mdash; titles, thumbnails and hooks tested against your own back catalogue",
   "Growth support &mdash; ongoing insight, feedback and performance tracking"]),
 ("Post-Production", "scissors", "bb-china-mortgage", "Polish that pops.",
  ["Footage intake &mdash; you upload, we take it from there",
   "Edit + effects &mdash; pacing, cuts, colour, motion graphics, sound design",
   "Client review &mdash; your notes, worked until the cut is right",
   "Smart CTAs placed where retention data says they land"]),
 ("Full Video Production", "camera", "gridware-cyber", "First idea to final frame.",
  ["Creative &amp; script &mdash; concept, structure, storyboard",
   "Filming day &mdash; directing, lighting and camera, studio or location",
   "Post &amp; delivery &mdash; the full pipeline, ready to publish",
   "Cinematic visuals built on purpose-driven storytelling"]),
]

def build_services():
    blocks = ""
    for i, (title, icon, key, tag, items) in enumerate(SERVICE_DETAIL):
        lis = "".join("<li>%s</li>" % x for x in items)
        blocks += ("""
<div class="case" data-reveal-group>
  <div class="case__media" data-wipe><div class="wk__shot">%s</div></div>
  <div class="case__body">
    <p class="label label--red" data-reveal>%s Service 0%d</p>
    <h2 class="case__stat" data-reveal style="--i:1">%s</h2>
    <p class="case__label" data-reveal style="--i:2">%s</p>
    <ul class="step__items" data-reveal style="flex-direction:column;gap:.55rem;margin-block-start:.4rem;--i:3">%s</ul>
    <div data-reveal style="--i:4;margin-block-start:.6rem">%s</div>
  </div>
</div>""" % (img(key, "(max-width:860px) 92vw, 54vw"), ico(icon), i + 1, title, tag, lis,
             btn("Start a project", "contact.html", "line", "sm")))

    body = page_hero("Services", "Three ways <em>in</em>.",
        "From concept to creation &mdash; binge-worthy content your audience craves and your brand needs to grow.") + """
<section class="section" style="padding-block-start:0"><div class="shell"><div class="cases">%s</div></div></section>

<section class="section" data-steps aria-labelledby="sp-h">
  <div class="shell">
    <div class="split">
      <div class="split__sticky">
        <p class="label" data-reveal>How we work</p>
        <h2 class="h2" id="sp-h" data-reveal style="--i:1">Simple, strategic, <span class="serif">seamless.</span></h2>
        <p class="lede" data-reveal style="--i:2;margin-block-start:.8rem">Every engagement runs the same spine, scaled to the scope.</p>
      </div>
      <div class="steps" data-reveal-group>%s</div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="sf-h">
  <div class="shell">
    <div class="split">
      <div class="split__sticky">
        <p class="label" data-reveal>FAQs</p>
        <h2 class="h2" id="sf-h" data-reveal style="--i:1">Questions, <span class="serif">answered.</span></h2>
        <div data-reveal style="--i:2;margin-block-start:1.2rem">%s</div>
      </div>
      <div class="acc" data-reveal-group>%s</div>
    </div>
  </div>
</section>
""" % (blocks, steps(), btn("Contact us", "contact.html", "line"), faq("s")) + cta(
        "Not sure which one <em>you need</em>?",
        "Most channels start with a strategy audit and grow into full production. Tell us the goal.")
    write("services.html", "Services — SOS | Stills on Sticks",
          "YouTube strategy, post-production and full video production, end to end.", "Services", body)

# ================================================================== STUDIO
TL = [
 ("Early 2022", "The ZMDE sprint", "Fifteen videos in thirty days, taking the channel past ten million views a month."),
 ("3+ years", "Business Basics", "From under 200k subscribers to 900k+, with several videos crossing five million &mdash; including their most-viewed upload."),
 ("Today", "164M+ views in 2026", "Across cybersecurity, geopolitics, medicine, motorsport and commerce."),
]
VALUES = [
 ("target", "Strategy before edit", "Every project opens with an audit. The cut only works if the idea underneath it does."),
 ("wave", "Retention is the craft", "Cuts, colour, motion and sound aren&rsquo;t decoration &mdash; each one is tuned to keep a viewer watching."),
 ("users", "A creative alliance", "Clients stay for years, not projects. Honest feedback, shared goals."),
 ("clock", "Deadlines are a promise", "The thing clients mention most: the work lands when we said it would."),
]

def build_about():
    tl = "".join('<div class="tl__item" data-reveal style="--i:%d"><p class="tl__k">%s</p>'
                 '<div><h3 class="tl__t">%s</h3><p class="tl__d">%s</p></div></div>'
                 % (i, k, t, d) for i, (k, t, d) in enumerate(TL))
    tiles = "".join('<div class="tile" data-reveal style="--i:%d">%s<p class="tile__n">0%d</p>'
                    '<h3 class="tile__t">%s</h3><p class="tile__d">%s</p></div>'
                    % (i, icotile(icon), i + 1, t, d) for i, (icon, t, d) in enumerate(VALUES))
    body = page_hero("About", "We make videos <em>people finish</em>.",
        "The first free end-to-end production service tailored for YouTube brands &mdash; creators and businesses of all sizes, any niche.") + """
<section class="section" style="padding-block-start:0">
  <div class="shell"><div class="wk__shot" data-wipe style="aspect-ratio:21/9">%s</div></div>
</section>

<section class="section">
  <div class="shell">
    <div class="figs" data-reveal-group>
      <div class="fig" data-reveal><p class="fig__n"><span class="counter" data-count="164" data-suffix="M+">0</span></p><p class="fig__k">Views in 2026</p></div>
      <div class="fig" data-reveal><p class="fig__n"><span class="counter" data-count="900" data-suffix="k+">0</span></p><p class="fig__k">Subscribers grown to</p></div>
      <div class="fig" data-reveal><p class="fig__n"><span class="counter" data-count="15" data-suffix="">0</span></p><p class="fig__k">Videos in 30 days</p></div>
      <div class="fig" data-reveal><p class="fig__n"><span class="counter" data-count="10" data-suffix="/10">0</span></p><p class="fig__k">Client rating</p></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="st-h">
  <div class="shell">
    <div class="split">
      <div class="split__sticky">
        <p class="label" data-reveal>Our story</p>
        <h2 class="h2" id="st-h" data-reveal style="--i:1">Built in the edit bay, <span class="serif">not the boardroom.</span></h2>
        <p class="lede" data-reveal style="--i:2;margin-block-start:.8rem">Yuhan Perera founded SOS in Colombo on one working rule: the edit is downstream of the idea. Packaging, pacing and payoff get decided before a clip is cut.</p>
        <div data-reveal style="--i:3;margin-block-start:1.2rem">%s</div>
      </div>
      <div class="tl" data-reveal-group>%s</div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="vl-h">
  <div class="shell">
    <div class="section-head">
      <p class="label" data-reveal>How we think</p>
      <h2 class="h2" id="vl-h" data-reveal style="--i:1">Four things we don&rsquo;t compromise on.</h2>
    </div>
    <div class="tiles" data-reveal-group>%s</div>
  </div>
</section>

<section class="section">
  <div class="shell shell--narrow">
    <div class="quote center" data-reveal>
      <blockquote class="quote__q">&ldquo;I am yet to find an individual as <em>committed and goal oriented</em> as him. His style of work is unparalleled and sure to get the attention of the viewer. <em>10/10.</em>&rdquo;</blockquote>
      <figcaption class="quote__by" style="justify-content:center">
        <span class="quote__ava" aria-hidden="true">ME</span>
        <span style="text-align:left"><span class="quote__name">Michael Shannon Ebenezer</span><br><span class="quote__handle">@michael-shannon-ebenezer</span></span>
      </figcaption>
    </div>
  </div>
</section>
""" % (img("andy-vision-pro", "95vw", eager=True), btn("Work with us", "contact.html", "line"), tl, tiles) + cta(
        "Bring us a channel, a launch, <em>or half an idea</em>.",
        "We&rsquo;ll tell you honestly what it needs.")
    write("about.html", "About — SOS | Stills on Sticks",
          "End-to-end production for YouTube brands. Founded by Yuhan Perera in Colombo.", "About", body)

# ================================================================== CONTACT
def build_contact():
    body = page_hero("Contact", "Let&rsquo;s make something <em>worth finishing</em>.",
        "Tell us about your channel and what you&rsquo;re building. We come back with an honest read on what it takes.") + """
<section class="section" style="padding-block-start:0">
  <div class="shell">
    <div class="split split--form">
      <div data-reveal-group>
        <button class="detail" type="button" data-copy="%s" data-reveal>
          <span class="detail__k">%s Email</span><span class="detail__v">%s</span><span class="detail__copy" aria-hidden="true">Copy</span>
        </button>
        <button class="detail" type="button" data-copy="%s" data-reveal style="--i:1">
          <span class="detail__k">%s Phone</span><span class="detail__v">%s</span><span class="detail__copy" aria-hidden="true">Copy</span>
        </button>
        <div class="detail" data-reveal style="--i:2"><span class="detail__k">%s Studio</span><span class="detail__v">%s</span></div>
        <div class="detail" data-reveal style="--i:3"><span class="detail__k">%s Reply</span><span class="detail__v">Within one business day</span></div>
        <div data-reveal style="--i:4;margin-block-start:1.6rem">
          <p class="label">Prefer to talk?</p>
          <p class="muted small" style="margin-block:.5rem 1rem;max-inline-size:34ch">A call is the fastest way to work out whether we&rsquo;re a fit. Bring your channel and your goal.</p>
          %s
        </div>
        <div class="wk__shot" data-wipe style="margin-block-start:2rem">%s</div>
      </div>

      <div data-reveal="still">
        <h2 class="h3">Tell us about your project</h2>
        <p class="muted small" style="margin-block-start:.4rem">Fields marked <span style="color:var(--red)">*</span> are required.</p>
        <form class="stack" style="--s:1.3rem;margin-block-start:1.8rem" data-validate data-mailto="%s" novalidate>
          <div class="grid grid-2" style="gap:1.3rem">
            <div class="field">
              <label class="field__label" for="f-name">Name <span class="req">*</span></label>
              <input class="input" id="f-name" name="name" type="text" required autocomplete="name" placeholder="Your name">
              <span class="field__error" aria-live="polite"></span>
            </div>
            <div class="field">
              <label class="field__label" for="f-email">Email <span class="req">*</span></label>
              <input class="input" id="f-email" name="email" type="email" required autocomplete="email" placeholder="you@channel.com">
              <span class="field__error" aria-live="polite"></span>
            </div>
          </div>
          <div class="grid grid-2" style="gap:1.3rem">
            <div class="field">
              <label class="field__label" for="f-company">Company or channel</label>
              <input class="input" id="f-company" name="company" type="text" autocomplete="organization" placeholder="Optional">
              <span class="field__error" aria-live="polite"></span>
            </div>
            <div class="field">
              <label class="field__label" for="f-link">Channel link</label>
              <input class="input" id="f-link" name="link" type="url" placeholder="youtube.com/@you">
              <span class="field__error" aria-live="polite"></span>
            </div>
          </div>
          <fieldset style="border:0;padding:0;margin:0">
            <legend class="field__label" style="margin-block-end:.7rem">What are you after?</legend>
            <div class="chipset">
              <input type="checkbox" id="s1" name="service" value="YouTube Strategy"><label for="s1">Strategy</label>
              <input type="checkbox" id="s2" name="service" value="Post-Production"><label for="s2">Post-Production</label>
              <input type="checkbox" id="s3" name="service" value="Full Video Production"><label for="s3">Full Production</label>
              <input type="checkbox" id="s4" name="service" value="Not sure yet"><label for="s4">Not sure yet</label>
            </div>
          </fieldset>
          <div class="field">
            <label class="field__label" for="f-when">When do you want to start?</label>
            <select class="input" id="f-when" name="timing">
              <option value="">Select one</option>
              <option>As soon as possible</option>
              <option>Within a month</option>
              <option>Next quarter</option>
              <option>Just exploring</option>
            </select>
          </div>
          <div class="field">
            <label class="field__label" for="f-msg">Message <span class="req">*</span></label>
            <textarea class="input" id="f-msg" name="message" required placeholder="Where is your channel now, and where do you want it to be?"></textarea>
            <span class="field__error" aria-live="polite"></span>
          </div>
          <div class="consent field">
            <input type="checkbox" id="f-terms" name="terms" required>
            <label for="f-terms">I agree to SOS contacting me about this enquiry. <span class="req">*</span></label>
            <span class="field__error" aria-live="polite" style="flex-basis:100%%"></span>
          </div>
          <div class="form-status" role="status" aria-live="polite"></div>
          <button class="btn btn--primary btn--lg btn--block" type="submit"><span>Send enquiry</span>%s</button>
        </form>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="cf-h">
  <div class="shell shell--narrow">
    <p class="label" data-reveal>Before you write</p>
    <h2 class="h2" id="cf-h" data-reveal style="--i:1;margin-block:.7rem 1.5rem">Questions, <span class="serif">answered.</span></h2>
    <div class="acc" data-reveal-group>%s</div>
  </div>
</section>
""" % (EMAIL, ico("mail"), EMAIL, PHONE_R, ico("phone"), PHONE_H, ico("pin"), ADDRESS, ico("clock"),
       btn("Call " + PHONE_H, "tel:" + PHONE_R, "line"),
       img("bb-north-korea", "(max-width:900px) 92vw, 38vw"),
       EMAIL, I["arr"], faq("c"))
    write("contact.html", "Contact — SOS | Stills on Sticks",
          "Tell us about your channel. We reply within one business day.", "Contact", body)

def build_site_files():
    pages = ["index.html", "about.html", "services.html", "portfolio.html", "contact.html"]
    (OUT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % SITE_URL, encoding="utf-8")
    urls = "".join(
        '  <url><loc>%s/%s</loc><changefreq>monthly</changefreq><priority>%s</priority></url>\n'
        % (SITE_URL, p, "1.0" if p == "index.html" else "0.8") for p in pages)
    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s</urlset>\n' % urls,
        encoding="utf-8")
    print("wrote robots.txt + sitemap.xml")

build_home(); build_portfolio(); build_services(); build_about(); build_contact(); build_site_files()
