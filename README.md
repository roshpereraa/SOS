# SOS — Stills on Sticks

A rebuild of [stillsonsticks.com](https://stillsonsticks.com) as a static site: the same
structure as the original, plus a dedicated Contact page.

Hand-written HTML, CSS and JavaScript. **No build step, no dependencies, no framework** —
open `index.html` or drop the folder on any static host.

```
index.html        Home
about.html        About
services.html     Services
portfolio.html    Portfolio  (filterable)
contact.html      Contact    (new)

assets/css/base.css        tokens, reset, typography, animated background
assets/css/glass.css       the liquid-glass system + buttons
assets/css/components.css  nav, footer, cards, media, forms, accordion, marquee
assets/css/sections.css    page layouts, hero, process rail, reveal primitives
assets/js/motion.js        scroll reveals, counters, parallax, tilt, pointer light
assets/js/app.js           nav, drawer, accordion, posters, forms, filters, copy
```

## Adding the real videos

Every video card renders a designed gradient poster by default. Give a card a YouTube ID
and it switches to the real thumbnail and plays inline on click — nothing else to change.

Posters are generated in one place. In `index.html` / `portfolio.html`, find the card and
add the `data-yt` attribute:

```html
<div class="poster" data-yt="dQw4w9WgXcQ" data-title="..." style="--p1:#c23b3b;--p2:#2a0f14">
```

`--p1` / `--p2` set the fallback poster's gradient, so a card still looks deliberate if a
thumbnail ever 404s. The player uses `youtube-nocookie.com`.

## The liquid glass

A glass surface is five stacked ingredients, documented at the top of `glass.css`:
a backdrop filter, a translucent tint, a 1px specular rim drawn with a masked gradient
border, an inner bevel, and a cursor-tracked bloom. `motion.js` drives `--mx` / `--my` /
`--rim-a` from a single pointer listener so the highlight and the rim both lean toward the
cursor. Surfaces opt in with `.glass`; interactive ones add `.glass--react`.

## Motion

Scroll reveals, counters, parallax, the sticky process rail and the 3D card tilt all run
through `motion.js`. Three things to know:

- **Nothing depends on JS to be readable.** The reveal styles are scoped behind a `.js`
  class set inline in `<head>`. If `motion.js` never boots, a timer drops the class and the
  whole page renders normally.
- **Fast scrolling is handled.** `IntersectionObserver` can miss a section when someone hits
  End or drags the scrollbar, which would leave it invisible for good. Both the reveals and
  the counters keep a pending set and sweep it on scroll.
- **`prefers-reduced-motion` is respected** throughout — reveals resolve instantly, counters
  jump to their final value, and the pointer effects don't attach at all.

## The contact form

Validates client-side, then composes a `mailto:` to
`yuhanperera@stillsonsticksteam.com` so an enquiry is never silently dropped. **There is no
backend.** To collect submissions properly, point the form at a handler (Formspree, Vercel
function, etc.) — see `initForms` in `app.js`; the `data-mailto` attribute on the `<form>`
is the only place the address is set.

## Content notes

All copy, client names, case-study figures and testimonials are carried over verbatim from
the original site. Three things were written for this build and should be reviewed:

1. **About page narrative and "how we think" tiles.** Built only from facts already stated
   on the original site (the ZMDE sprint, the Business Basics growth, the 164M+ figure).
2. **FAQ answers 2–4.** The original only exposed the first answer. These are grounded in
   the stated process but deliberately avoid committing to turnaround times or a revision
   count — set those before launch.
3. **The third process column** was labelled "Post Production" on the original, duplicating
   the second. Its steps (Creative & Script, Filming Day, Post & Delivery) are full
   production, so it is labelled **Full Production** here.

Social links in the footer point at the bare platform URLs — swap in the real profiles.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, a focus-trapped mobile drawer, ARIA
on the accordion and form, and keyboard-operable video posters. Every text style was
measured against its composited background and clears WCAG AA (4.5:1).

## Deploying

Static — no build. `vercel.json` enables clean URLs and long-lived caching for `/assets`.
Works as-is on Vercel, Netlify, Cloudflare Pages or GitHub Pages.
