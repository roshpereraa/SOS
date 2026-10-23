/* ==========================================================================
   motion.js — scroll reveals, counters, parallax, pointer light, peek preview
   --------------------------------------------------------------------------
   All progressive enhancement. With JS off, or with prefers-reduced-motion,
   the page is fully readable and static.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ------------------------------------------------------------------ *
   * Reveals
   * ------------------------------------------------------------------ */
  function initReveal() {
    const items = $$("[data-reveal], [data-wipe]");
    if (!items.length) return;

    $$("[data-reveal-group]").forEach((g) =>
      $$("[data-reveal], [data-wipe]", g).forEach((el, i) => {
        if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", String(i));
      })
    );

    if (reduced.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const pending = new Set(items);
    const show = (el) => {
      el.classList.add("is-in");
      pending.delete(el);
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && show(e.target)),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));

    // A fast jump (End key, scrollbar drag, hash link) can carry a section past
    // the viewport before the observer reports it, which would leave it hidden
    // for good. Sweep up anything left behind.
    const sweep = () => {
      if (!pending.size) return;
      const line = window.innerHeight * 0.92;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < line) show(el);
      });
    };
    addEventListener("scroll", sweep, { passive: true });
    addEventListener("resize", sweep, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Headline lines rise once the page has painted
   * ------------------------------------------------------------------ */
  function initLines() {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.body.classList.add("is-lit"))
    );
  }

  /* ------------------------------------------------------------------ *
   * Counters — data-count="164" data-suffix="M+"
   * ------------------------------------------------------------------ */
  function initCounters() {
    const nodes = $$("[data-count]");
    if (!nodes.length) return;

    const render = (el, v) => {
      const dp = Number(el.dataset.decimals || 0);
      el.textContent =
        (el.dataset.prefix || "") +
        v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp }) +
        (el.dataset.suffix || "");
    };

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      if (Number.isNaN(target)) return;
      if (reduced.matches) return render(el, target);
      const dur = Number(el.dataset.duration || 1700);
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min((now - t0) / dur, 1);
        render(el, target * (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) return nodes.forEach(run);

    const pending = new Set(nodes);
    const start = (el) => {
      pending.delete(el);
      io.unobserve(el);
      run(el);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && start(e.target)),
      { threshold: 0.45 }
    );
    nodes.forEach((el) => {
      render(el, 0);
      io.observe(el);
    });

    const sweep = () => {
      if (!pending.size) return;
      const vh = window.innerHeight;
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) start(el);
      });
    };
    addEventListener("scroll", sweep, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Scroll work: progress bar, parallax, active process step
   * ------------------------------------------------------------------ */
  function initScroll() {
    const bar = $(".progress");
    const para = $$("[data-parallax]");
    const stepGroups = $$("[data-steps]");
    if (!bar && !para.length && !stepGroups.length) return;

    let ticking = false;
    const frame = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;

      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.setProperty("--p", max > 0 ? String(Math.min(y / max, 1)) : "0");
      }

      if (!reduced.matches) {
        para.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          const speed = parseFloat(el.dataset.parallax) || 0.08;
          const off = (r.top + r.height / 2 - vh / 2) * speed;
          el.style.translate = `0 ${(-off).toFixed(1)}px`;
        });
      }

      stepGroups.forEach((group) => {
        const steps = $$(".step", group);
        let best = null;
        let bestD = Infinity;
        steps.forEach((s) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - vh * 0.45);
          if (d < bestD) { bestD = d; best = s; }
        });
        steps.forEach((s) => s.classList.toggle("is-active", s === best));
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    frame();
  }

  /* ------------------------------------------------------------------ *
   * Pointer: glass rim + bloom, and the peek preview on service rows
   * ------------------------------------------------------------------ */
  function initPointer() {
    if (!fine.matches || reduced.matches) return;

    let surfaces = $$(".glass");
    const rows = $$("[data-peek]");
    let peek = null;

    if (rows.length) {
      peek = document.createElement("div");
      peek.className = "peek";
      peek.setAttribute("aria-hidden", "true");
      // A transparent placeholder — an <img> with no src counts as a broken image
      // until the first hover supplies one.
      peek.innerHTML = '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">';
      document.body.appendChild(peek);
    }
    const peekImg = peek && peek.querySelector("img");

    let px = 0, py = 0, pending = false, activeRow = null;

    const frame = () => {
      pending = false;

      surfaces.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        el.style.setProperty("--mx", `${(((px - r.left) / r.width) * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(((py - r.top) / r.height) * 100).toFixed(1)}%`);
        // CSS gradient angles run clockwise from "up", and the first colour stop
        // sits opposite the angle, so +180 brings the highlight to the pointer.
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        el.style.setProperty("--rim-a", `${((Math.atan2(dx, -dy) * 180) / Math.PI + 180).toFixed(0)}deg`);
      });

      if (peek && activeRow) {
        peek.style.left = `${px}px`;
        peek.style.top = `${py}px`;
      }
    };

    addEventListener("pointermove", (e) => {
      px = e.clientX; py = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(frame);
    }, { passive: true });

    rows.forEach((row) => {
      row.addEventListener("pointerenter", () => {
        if (!peek) return;
        activeRow = row;
        peekImg.src = row.dataset.peek;
        peek.classList.add("is-on");
      });
      row.addEventListener("pointerleave", () => {
        if (!peek) return;
        activeRow = null;
        peek.classList.remove("is-on");
      });
    });

    document.addEventListener("sos:refresh", () => { surfaces = $$(".glass"); });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  const boot = () => {
    document.body.dataset.motion = "1";
    initLines();
    initReveal();
    initCounters();
    initScroll();
    initPointer();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
