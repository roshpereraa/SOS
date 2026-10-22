/* ==========================================================================
   motion.js — scroll reveals, counters, parallax, tilt, glass light tracking
   --------------------------------------------------------------------------
   Everything here is progressive enhancement: with JS off, or with
   prefers-reduced-motion set, the page is fully readable and static.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------------------------------------------------------------------ *
   * 1. Reveal on scroll
   * ------------------------------------------------------------------ */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    // Stagger siblings inside an explicit group.
    $$("[data-reveal-group]").forEach((group) => {
      $$("[data-reveal]", group).forEach((el, i) => {
        if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", String(i));
      });
    });

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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) show(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    items.forEach((el) => io.observe(el));

    // Safety net. A fast jump — End key, dragging the scrollbar, following a
    // hash link — can carry a section past the viewport before the observer
    // reports it, which would leave it invisible for good. Sweep up anything
    // left behind, using the same trigger line as the observer's rootMargin.
    const sweep = () => {
      if (!pending.size) return;
      const line = window.innerHeight * 0.9;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < line) show(el);
      });
    };
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 2. Headline word rise
   *    Splits [data-words] into per-word spans so they can rise in turn.
   * ------------------------------------------------------------------ */
  function initWords() {
    $$("[data-words]").forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = "";
      words.forEach((word, i) => {
        const outer = document.createElement("span");
        outer.className = "word-rise";
        outer.style.setProperty("--w", String(i));
        const inner = document.createElement("span");
        inner.textContent = word;
        outer.appendChild(inner);
        el.appendChild(outer);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      });
    });

    // Light them after first paint so the transition actually runs.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.add("is-lit"));
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. Counters
   *    data-count="164" data-suffix="M+" data-decimals="0"
   * ------------------------------------------------------------------ */
  function initCounters() {
    const nodes = $$("[data-count]");
    if (!nodes.length) return;

    const render = (el, value) => {
      const decimals = Number(el.dataset.decimals || 0);
      const body = value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      el.textContent = (el.dataset.prefix || "") + body + (el.dataset.suffix || "");
    };

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      if (Number.isNaN(target)) return;
      if (reduced.matches) return render(el, target);

      const duration = Number(el.dataset.duration || 1900);
      const start = performance.now();

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo — fast out of the gate, long settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        render(el, target * eased);
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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    nodes.forEach((el) => {
      render(el, 0);
      io.observe(el);
    });

    // Same safety net as the reveals: a fast scroll past a counter must not
    // leave it frozen at zero.
    const sweep = () => {
      if (!pending.size) return;
      const vh = window.innerHeight;
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) start(el);
      });
    };
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 4. Scroll-driven work: progress bar, parallax, process rail
   *    All of it runs in one rAF-throttled scroll handler.
   * ------------------------------------------------------------------ */
  function initScroll() {
    const bar = document.querySelector(".progress");
    const parallax = $$("[data-parallax]");
    const processes = $$("[data-process]");
    if (!bar && !parallax.length && !processes.length) return;

    let ticking = false;

    const frame = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;

      // Progress bar
      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.setProperty("--p", max > 0 ? String(Math.min(y / max, 1)) : "0");
      }

      // Parallax — only when the element is near the viewport
      if (!reduced.matches) {
        parallax.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > vh + 200) return;
          const speed = parseFloat(el.dataset.parallax) || 0.12;
          // Offset measured from the element's centre crossing the viewport centre
          const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
          el.style.translate = `0 ${(-offset).toFixed(2)}px`;
        });
      }

      // Process rail: fill proportionally, light the step nearest the middle
      processes.forEach((section) => {
        const rail = section.querySelector(".prail");
        const steps = $$(".pstep", section);
        const rect = section.getBoundingClientRect();
        const total = rect.height - vh * 0.5;
        const progressed = Math.min(Math.max((vh * 0.5 - rect.top) / (total || 1), 0), 1);
        if (rail) rail.style.setProperty("--fill", progressed.toFixed(3));

        let best = null;
        let bestDist = Infinity;
        steps.forEach((step) => {
          const r = step.getBoundingClientRect();
          const dist = Math.abs(r.top + r.height / 2 - vh * 0.45);
          if (dist < bestDist) {
            bestDist = dist;
            best = step;
          }
        });
        steps.forEach((step) => step.classList.toggle("is-active", step === best));
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    frame();
  }

  /* ------------------------------------------------------------------ *
   * 5. Pointer light
   *    One listener drives every glass surface, the tilt cards, the
   *    magnetic buttons and the ambient background glow.
   * ------------------------------------------------------------------ */
  function initPointer() {
    if (!finePointer.matches || reduced.matches) return;

    const atmos = document.querySelector(".atmos__cursor");
    const lit = () => $$(".glass--react, .btn--glass, [data-tilt]");
    let surfaces = lit();
    let magnets = $$("[data-magnetic]");
    let pending = false;
    let px = 0;
    let py = 0;

    // Re-collect after dynamic content (e.g. filtered cards) changes.
    const refresh = () => {
      surfaces = lit();
      magnets = $$("[data-magnetic]");
    };
    document.addEventListener("sos:refresh", refresh);

    const frame = () => {
      pending = false;

      if (atmos) {
        atmos.style.setProperty("--cx", `${px}px`);
        atmos.style.setProperty("--cy", `${py}px`);
      }

      surfaces.forEach((el) => {
        const r = el.getBoundingClientRect();
        // Skip anything off screen — saves a lot of layout thrash on long pages
        if (r.bottom < 0 || r.top > window.innerHeight) return;

        const nearX = px >= r.left - 60 && px <= r.right + 60;
        const nearY = py >= r.top - 60 && py <= r.bottom + 60;

        const mx = ((px - r.left) / r.width) * 100;
        const my = ((py - r.top) / r.height) * 100;
        el.style.setProperty("--mx", `${mx.toFixed(1)}%`);
        el.style.setProperty("--my", `${my.toFixed(1)}%`);

        // Rim highlight faces the pointer. CSS gradient angles run clockwise
        // from "up", and the first colour stop sits opposite the angle, so we
        // add 180deg to bring the bright stop round to the pointer's side.
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const deg = (Math.atan2(dx, -dy) * 180) / Math.PI + 180;
        el.style.setProperty("--rim-a", `${deg.toFixed(1)}deg`);

        // 3D tilt
        if (el.hasAttribute("data-tilt")) {
          if (nearX && nearY) {
            const max = parseFloat(el.dataset.tilt) || 6;
            const ry = ((px - (r.left + r.width / 2)) / (r.width / 2)) * max;
            const rx = -((py - (r.top + r.height / 2)) / (r.height / 2)) * max;
            el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`;
          } else if (el.style.transform) {
            el.style.transform = "";
          }
        }
      });

      // Magnetic pull — buttons lean toward the cursor inside a radius
      magnets.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.hypot(dx, dy);
        const radius = parseFloat(el.dataset.magnetic) || 90;
        const reach = Math.max(r.width, r.height) / 2 + radius;
        if (dist < reach) {
          const pull = (1 - dist / reach) * 0.34;
          el.style.translate = `${(dx * pull).toFixed(2)}px ${(dy * pull).toFixed(2)}px`;
        } else if (el.style.translate) {
          el.style.translate = "";
        }
      });
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        px = e.clientX;
        py = e.clientY;
        if (!document.body.classList.contains("cursor-ready")) {
          document.body.classList.add("cursor-ready");
        }
        if (pending) return;
        pending = true;
        requestAnimationFrame(frame);
      },
      { passive: true }
    );

    // Clear transforms when the pointer leaves the window
    document.addEventListener("pointerleave", () => {
      surfaces.forEach((el) => {
        if (el.hasAttribute("data-tilt")) el.style.transform = "";
      });
      magnets.forEach((el) => (el.style.translate = ""));
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  const boot = () => {
    document.body.dataset.motion = "1";
    initWords();
    initReveal();
    initCounters();
    initScroll();
    initPointer();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
