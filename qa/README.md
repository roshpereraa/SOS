# QA suite

Four checks. Start a static server on the repo root first:

```bash
python3 -m http.server 8777      # or any static server
```

| Command | Covers |
|---|---|
| `python3 qa/static.py` | HTML validity, duplicate ids/attributes, heading order, image alt + dimensions, label association, `aria-*` references that point at missing ids, metadata, broken internal links, robots/sitemap |
| `node qa/layout.js` | 10 viewports (320→1920, touch and mouse) × 5 pages: horizontal overflow, text overlap, clipped content, broken images, tap-target size, failed requests, console and page errors |
| `node qa/functional.js` | Nav active states, link resolution, skip link, focus ring, accordion (mouse + keyboard + ARIA), scrub pinning, work rail, portfolio filters, form validation, mobile drawer + focus trap, reduced motion, JS disabled |
| `node qa/perf.js` | Page weight by type, request count, lazy-loading coverage, oversized images |

`static.py` and `layout.js` exit non-zero on findings, so they drop straight into CI.
Point any of them at a deployed URL with `QA_BASE=https://… node qa/layout.js`.

Requires `playwright` (`npm i -D playwright && npx playwright install chromium`).
