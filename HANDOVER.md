# SOS — handover

Static marketing site for Stills on Sticks. **No build step, no dependencies, no
framework.** The five HTML files in the repo root are the deliverable; drop the folder
on any static host.

Live: https://sos-new-test.vercel.app · deploys from `claude/gallant-hypatia-a4yma4`.

---

## 1. Run it

```bash
python3 -m http.server 8777      # any static server works
```

There is nothing to install to *run* the site. Node + Playwright and Pillow are only
needed for the QA suite and the page generator.

## 2. Layout of the repo

```
index.html about.html services.html portfolio.html contact.html   ← the deliverable
robots.txt sitemap.xml vercel.json

assets/css/base.css        tokens (colour, type scale, spacing), reset, atmosphere
assets/css/glass.css       the liquid-glass layer — used deliberately, not everywhere
assets/css/components.css  nav, buttons, work cards, case rows, forms, footer
assets/css/sections.css    page layouts, grids, reveal primitives
assets/css/cinema.css      hero wall, scroll-scrub, work rail, icons, bloom
assets/js/motion.js        scroll reveals, counters, parallax, pointer light, peek
assets/js/app.js           nav, drawer, accordion, rails, forms, filters, clipboard
assets/js/cinema.js        play cursor, hero-wall parallax, scroll-pinned scrub
assets/img/work/*.jpg      12 stills of the client's published videos

tools/build.py             regenerates the 5 pages (shared chrome lives here)
qa/                        four QA scripts — see qa/README.md
```

### The generator

`tools/build.py` exists so the nav, footer, `<head>`, FAQ and icon set live in one
place rather than being hand-synced across five files. Run `python3 tools/build.py`
after editing it.

**If you would rather work in the HTML directly, delete `tools/build.py`** so nobody
regenerates over your edits. Do not keep both as sources of truth.

## 3. QA

```bash
python3 qa/static.py     # HTML validity, a11y, metadata, links   → exits non-zero on findings
node qa/layout.js        # 10 viewports × 5 pages                 → exits non-zero on findings
node qa/functional.js    # 32 interaction / keyboard / fallback checks
node qa/perf.js          # weight, requests, lazy coverage
```

Point any of them at a deployment with `QA_BASE=https://… node qa/layout.js`.
`static.py` and `layout.js` are CI-ready as-is. Full detail in `qa/README.md`.

### Last full run — all green

| Suite | Result |
|---|---|
| Static (HTML, a11y, SEO, links) | **0 issues** |
| Layout — 320/360/390/414/768/834/1024/1280/1440/1920 × 5 pages | **0 findings** in 50 combos |
| Functional | **32 / 32 pass** |
| Contrast | every text style **4.5:1 → 11.09:1**, all WCAG AA |
| Page weight | index 1.6 MB / 25 req · others 0.36–1.55 MB · 117 of 118 images lazy |

Covered: no horizontal overflow, no text overlap, no clipped content, no broken
images, no 404s, no console or page errors, tap targets ≥24 px (WCAG 2.5.8), nav
active states, keyboard accordion, focus ring, skip link, form validation, mobile
drawer with focus trap and Escape, `prefers-reduced-motion`, and the page with
JavaScript disabled.

## 4. How the moving parts work

**Scroll reveals** are hidden behind a `.js` class set inline in `<head>`. If
`motion.js` never boots, a timer drops the class and the page renders normally — a JS
failure can never blank the page. Reveals and counters also keep a pending set and
sweep it on scroll, because `IntersectionObserver` misses sections when someone hits
End or drags the scrollbar, which would otherwise leave them invisible permanently.

**The scrub** (`[data-scrub]`) pins and cuts between the twelve stills as you scroll.
`cinema.js` sizes the pin from real content and recomputes on resize and after fonts
settle. **It only pins at ≥1024 px with a fine pointer** — on touch it fights the user
and leaves long stretches of near-empty page. Below that it renders as a two-column
gallery. `.pin` defaults to `block-size: auto`, so an unsized pin collapses to one
screen rather than leaving thousands of pixels of void.

**The work rail** (`.hgal`) is a native snap-scrolling overflow row. It was briefly a
pinned scroll-jacked section; that cost ~4,900 px of page height to show one screen of
cards, so it was reverted deliberately — please don't re-pin it.

**Icons** are one 24 px line set defined as geometry only in `_P` in the generator;
`.ico` supplies stroke, width and caps, so every icon is consistent by construction.

## 5. Open items — things that need a decision, not a bug fix

1. **Video IDs.** `assets/img/work/*.jpg` are real stills cropped from full-resolution
   captures of the live site, but they are **images, not players**. Add
   `data-yt="VIDEO_ID"` to a `.wk__shot` and `app.js` makes that card keyboard-operable
   and plays it inline via `youtube-nocookie.com`. IDs were left out rather than
   guessed — YouTube was unreachable from the build environment and a wrong ID puts the
   wrong video on a client's portfolio.
2. **The contact form has no backend.** It validates, then composes a `mailto:` so an
   enquiry is never silently dropped. Point it at a real handler (Formspree, a Vercel
   function) — see `initForms` in `app.js`; `data-mailto` on the `<form>` is the only
   place the address is set.
3. **`SITE_URL` in `tools/build.py`** is `https://stillsonsticks.com`. It drives every
   canonical URL, `og:url` and `sitemap.xml`. Change it once the final domain is
   confirmed and re-run the generator.
4. **The subscriber chart** on the home page: the endpoints are real (200k → 900k+,
   from the Business Basics testimonial) but **the curve between them is illustrative**.
   Replace with real data or remove it.
5. **Footer social links** point at bare platform URLs. Swap in the real profiles.
6. **Copy written for this build, not taken from the original site:** the About
   narrative and its four value tiles, and FAQ answers 2–4. All are grounded in facts
   already stated on the original site and deliberately avoid committing to turnaround
   times or a revision count. Have the client confirm before launch.
7. The original site's third process column was labelled "Post Production" twice; its
   steps are full production, so it reads **Full production** here.

## 6. Worth doing next

- **Responsive images.** The work stills ship at one size (821 or 1251 px wide) and are
  sometimes displayed at ~300 px. A `srcset` would cut roughly 40% off the 1.6 MB home
  page. This is the single biggest performance win left.
- **Self-host the fonts.** Three Google families cost ~153 KB and a third-party
  connection on every page.
- Add `qa/static.py` and `qa/layout.js` to CI — both already exit non-zero on findings.
