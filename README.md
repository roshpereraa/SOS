# SOS — Stills on Sticks

A rebuild of [stillsonsticks.com](https://stillsonsticks.com) as a static site: the same
structure as the original (Home, About, Services, Portfolio) plus a Contact page.

Hand-written HTML, CSS and JavaScript. **No build step, no dependencies, no framework** —
open `index.html` or drop the folder on any static host.

```
index.html  about.html  services.html  portfolio.html  contact.html

assets/css/base.css        tokens, reset, typography, atmosphere
assets/css/glass.css       the liquid-glass layer (used selectively)
assets/css/components.css  nav, work cards, reel, case rows, forms, footer
assets/css/sections.css    page layouts, reveal primitives
assets/css/cinema.css      intro, play cursor, hero wall, scrub, gallery
assets/js/motion.js        scroll reveals, counters, parallax, pointer light
assets/js/app.js           nav, drawer, accordion, rails, forms, filters
assets/js/cinema.js        intro, cursor, scroll-pinned scrub + gallery
assets/img/work/*.jpg      12 stills from the client's published videos
```

## Art direction

Keyed to the original site's own colours, sampled from the full-resolution captures:
the field is `#060c1a` — the exact background of the live site — and the accent is
`--azure: #4f9bf0`, taken from the blue glow under the original hero. Almost no colour
lives in the chrome beyond that; the rest comes from the work itself, so the page is
carried by thumbnails rather than gradients.

What made the first pass look generic was the cyan→violet *gradients*, aurora blobs,
centred symmetry and uniform glass — not the blue. Those are gone; the brand blue stayed.

Red is reserved for form errors (`--danger`), where it's a semantic signal rather than
styling. Note that white on the azure fill only reaches 2.88:1, so filled buttons use
dark ink on azure instead.

Type is **Archivo** (heavy, slightly condensed, poster-like) for display, **Inter Tight**
for body, and **Instrument Serif** italic for the occasional emphasised word. Layouts are
left-aligned and asymmetric: alternating full-bleed case rows, a varied-tile work wall,
oversized numerals used as layout rather than decoration.

**Liquid glass is deliberate, not ambient.** It's reserved for things that genuinely float
above the work — the nav bar, hover chips, the pointer peek, the lightbox. Each glass
surface is a backdrop filter, a tint, a masked 1px gradient rim and a specular bloom, with
`--mx` / `--my` / `--rim-a` driven from a single pointer listener so the highlight leans
toward the cursor.

## The thumbnails

`assets/img/work/` holds twelve stills of real published videos, cropped from the
full-resolution page captures of the live site (two of them stitched across a PDF page
break). They carry YouTube's own play button and title bar, so the cards deliberately add
no competing chrome of their own.

**They are images, not players.** To make a card playable, add a video id:

```html
<div class="wk__shot" data-yt="VIDEO_ID"> … </div>
```

`app.js` then makes that card keyboard-operable and plays the video inline via
`youtube-nocookie.com`. Without an id the card stays a static still rather than pretending
to be a player. The ids could not be verified from the build environment — YouTube was
unreachable — and guessing them would have risked putting the wrong video on a client's
portfolio, so they're left for you to paste in.

## The set pieces

Three things carry the page, all built from the same twelve stills:

**The hero wall** — five columns of real work drifting at different speeds on a tilted
3D plane, pushed gently against the pointer, dimmed hard behind the headline.

**The scrub** (`[data-scrub]`) — a pinned section where scrolling cuts between all twelve
frames like running an edit timeline, with a frame counter, client name and a tick rail
that fills as you go. This is the one moment that's specific to what SOS actually does.

**The work rail** (`.hgal`) — a natively scrollable, snap-aligned row of large cards.
This was briefly a pinned scroll-jacked section; it cost ~4900px of page height to show
one screen of cards and fought the user on touch, so it's a normal overflow rail now.

`cinema.js` drives the scrub from one scroll loop. **Pinning only runs at ≥1024px with a
fine pointer** — on touch it fights the user's scroll and leaves long stretches of
near-empty page. Below that, and under `prefers-reduced-motion`, the scrub renders as an
ordinary two-column gallery of all twelve stills.

`.pin` defaults to `block-size: auto`, so if `cinema.js` never runs the section collapses
to one screen instead of leaving thousands of pixels of empty page.

## Icons

One 24px line set, defined as geometry only in `_P` in the generator — `.ico` supplies
stroke, width and caps, so every icon is consistent by construction rather than by
discipline.

## Motion

- **Nothing depends on JS to be readable.** Reveal styles sit behind a `.js` class set
  inline in `<head>`; if `motion.js` never boots, a timer drops the class and the page
  renders normally.
- **Fast scrolling is handled.** `IntersectionObserver` can miss a section when someone
  hits End or drags the scrollbar, which would leave it invisible for good. Reveals and
  counters keep a pending set and sweep it on scroll.
- **`prefers-reduced-motion` is respected** throughout — reveals resolve instantly,
  counters jump to their final value, pointer effects never attach.

## The contact form

Validates client-side, then composes a `mailto:` so an enquiry is never silently dropped.
**There is no backend.** To collect submissions properly, point the form at a handler
(Formspree, a Vercel function, …) — see `initForms` in `app.js`; `data-mailto` on the
`<form>` is the only place the address is set.

## Content notes

Copy, client names, case-study figures and testimonials come from the original site. Three
things were written for this build and should be reviewed:

1. **The About narrative and the four "how we think" tiles** — built only from facts
   already stated on the original site.
2. **FAQ answers 2–4.** The original only exposed the first. These stay deliberately vague
   on turnaround times and revision counts — set those before launch.
3. **The subscriber chart** on the home page plots the shape of a year's growth between the
   two figures the client states (200k → 900k+). The endpoints are real; the curve between
   them is illustrative. Replace it with real data or drop it if that's not acceptable.

The original's third process column was labelled "Post Production" twice; its steps
(Creative & Script, Filming Day, Post & Delivery) are full production, so it reads
**Full production** here. Footer social links point at bare platform URLs — swap in the
real profiles.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, a focus-trapped mobile drawer, ARIA
on the accordion and form. Every text style was measured against its composited background
and clears WCAG AA — the muted greys were lifted specifically to pass at small sizes.

## Deploying

Static, no build. `vercel.json` enables clean URLs and long-lived caching for `/assets`.
Works as-is on Vercel, Netlify, Cloudflare Pages or GitHub Pages.
