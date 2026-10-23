/* ==========================================================================
   cinema.js — play cursor, hero wall parallax, scroll-pinned scrub
   --------------------------------------------------------------------------
   Progressive enhancement throughout. Without JS the pinned sections are
   ordinary stacked blocks (CSS handles that via html:not(.js)); with
   prefers-reduced-motion they're unpinned here and the cursor never attaches.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);

  /* ------------------------------------------------------------------ *
   * Cursor — a disc that turns into PLAY over any still
   * ------------------------------------------------------------------ */
  function initCursor() {
    if (!fine.matches || reduced.matches) return;

    const ring = document.createElement("div");
    ring.className = "cursor";
    ring.setAttribute("aria-hidden", "true");
    ring.innerHTML = '<span class="cursor__label">PLAY</span>';
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0;

    const loop = () => {
      // The ring lags the pointer slightly; the dot tracks it exactly
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.left = `${rx.toFixed(1)}px`;
      ring.style.top = `${ry.toFixed(1)}px`;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      raf = requestAnimationFrame(loop);
    };

    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!document.body.classList.contains("cursor-on")) {
        document.body.classList.add("cursor-on");
        if (!raf) raf = requestAnimationFrame(loop);
      }
      const over = e.target.closest?.(".wk__shot, .cine__shot, .scrub__frame, .collage__item");
      ring.classList.toggle("is-play", !!over);
      document.body.classList.toggle("is-play", !!over);
    }, { passive: true });

    addEventListener("pointerleave", () => document.body.classList.remove("cursor-on"));
  }

  /* ------------------------------------------------------------------ *
   * Hero wall — a slow push against the pointer, for depth
   * ------------------------------------------------------------------ */
  function initWall() {
    const plane = $(".cine__plane");
    if (!plane || reduced.matches || !fine.matches) return;
    addEventListener("pointermove", (e) => {
      const dx = (e.clientX / innerWidth - 0.5) * -26;
      const dy = (e.clientY / innerHeight - 0.5) * -18;
      plane.style.setProperty("--wx", `${dx.toFixed(1)}px`);
      plane.style.setProperty("--wy", `${dy.toFixed(1)}px`);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Pin engine — one scroll loop drives every pinned section
   * ------------------------------------------------------------------ */
  function initPins() {
    const pins = $$("[data-pin]");
    if (!pins.length) return;

    // Pinning is a wide-viewport, fine-pointer affordance. On touch it fights
    // the user's scroll and leaves long stretches of near-empty page.
    const canPin = () =>
      !reduced.matches && innerWidth >= 1024 && !window.matchMedia("(pointer: coarse)").matches;

    const sizePins = () => {
      if (!canPin()) {
        pins.forEach((pin) => {
          pin.classList.add("no-pin");
          pin.style.removeProperty("--pin-h");
        });
        return;
      }
      pins.forEach((pin) => {
        pin.classList.remove("no-pin");
        const frames = $$(".scrub__frame img", pin).length || 8;
        pin.style.setProperty("--pin-h", `${Math.round(innerHeight * (1 + frames * 0.18))}px`);
      });
    };

    const frame = () => {
      ticking = false;
      if (!canPin()) return;
      pins.forEach((pin) => {
        const r = pin.getBoundingClientRect();
        const total = pin.offsetHeight - innerHeight;
        const prog = total > 0 ? clamp(-r.top / total) : 0;

        // Scrub
        const imgs = $$(".scrub__frame img", pin);
        if (!imgs.length) return;
        const i = Math.min(imgs.length - 1, Math.floor(prog * imgs.length));
        if (pin.dataset.i === String(i)) {
          const head = $(".scrub__head", pin);
          if (head) head.style.setProperty("--x", String(prog * (pin.querySelector(".scrub__rail")?.offsetWidth || 0)));
          return;
        }
        pin.dataset.i = String(i);
        imgs.forEach((im, n) => im.classList.toggle("is-on", n === i));
        $$(".scrub__tick", pin).forEach((t, n) => t.classList.toggle("is-on", n <= i));
        const idx = $(".scrub__idx", pin);
        const client = $(".scrub__client", pin);
        const title = $(".scrub__title", pin);
        if (idx) idx.textContent = String(i + 1).padStart(2, "0");
        if (client) client.textContent = imgs[i].dataset.client || "";
        if (title) title.textContent = imgs[i].dataset.vtitle || "";
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    };

    sizePins();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { sizePins(); onScroll(); }, { passive: true });
    // Fonts and images settle after first paint and change track width
    if (document.fonts?.ready) document.fonts.ready.then(() => { sizePins(); onScroll(); });
    addEventListener("load", () => { sizePins(); onScroll(); });
    frame();
  }

  const boot = () => {
    initCursor();
    initWall();
    initPins();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
