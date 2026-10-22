/* ==========================================================================
   app.js — navigation, drawer, accordion, lightbox, posters, forms, filters
   ========================================================================== */
(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------------------------------------------------------------------ *
   * Toast
   * ------------------------------------------------------------------ */
  let toastTimer;
  function toast(message) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(() => el.classList.add("is-on"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2600);
  }

  /* ------------------------------------------------------------------ *
   * Navigation — scrolled state + sliding pill indicator
   * ------------------------------------------------------------------ */
  function initNav() {
    const nav = $(".nav");
    const capsule = $(".nav__links");
    if (!nav) return;

    // Compact the bar once the page has moved
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!capsule) return;
    const pill = $(".nav__pill", capsule);
    const links = $$("a", capsule);
    const active = links.find((a) => a.classList.contains("is-active"));
    if (!pill) return;

    const moveTo = (link) => {
      if (!link) return;
      pill.style.setProperty("--px", `${link.offsetLeft}px`);
      pill.style.setProperty("--pw", `${link.offsetWidth}px`);
      pill.classList.add("is-on");
    };

    // Position on the active link once fonts have settled, so widths are right
    const settle = () => moveTo(active);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(settle);
    }
    requestAnimationFrame(settle);
    window.addEventListener("resize", settle);

    links.forEach((link) => {
      link.addEventListener("pointerenter", () => moveTo(link));
      link.addEventListener("focus", () => moveTo(link));
    });
    capsule.addEventListener("pointerleave", settle);
    capsule.addEventListener("focusout", (e) => {
      if (!capsule.contains(e.relatedTarget)) settle();
    });
  }

  /* ------------------------------------------------------------------ *
   * Mobile drawer
   * ------------------------------------------------------------------ */
  function initDrawer() {
    const burger = $(".nav__burger");
    const drawer = $(".drawer");
    if (!burger || !drawer) return;

    const focusables = () =>
      $$('a[href], button:not([disabled])', drawer).filter((el) => el.offsetParent !== null);

    const setOpen = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("no-scroll", open);
      if (open) focusables()[0]?.focus();
      else burger.focus();
    };

    burger.addEventListener("click", () =>
      setOpen(burger.getAttribute("aria-expanded") !== "true")
    );
    $$("a", drawer).forEach((a) => a.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (e) => {
      if (!drawer.classList.contains("is-open")) return;
      if (e.key === "Escape") return setOpen(false);
      // Keep tabbing inside the open drawer
      if (e.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Accordion
   * ------------------------------------------------------------------ */
  function initAccordion() {
    $$(".acc").forEach((acc) => {
      const items = $$(".acc__item", acc);
      items.forEach((item) => {
        const btn = $(".acc__btn", item);
        const panel = $(".acc__panel", item);
        if (!btn || !panel) return;

        btn.addEventListener("click", () => {
          const willOpen = !item.classList.contains("is-open");
          // One panel at a time
          items.forEach((other) => {
            other.classList.remove("is-open");
            $(".acc__btn", other)?.setAttribute("aria-expanded", "false");
            $(".acc__panel", other)?.setAttribute("aria-hidden", "true");
          });
          if (willOpen) {
            item.classList.add("is-open");
            btn.setAttribute("aria-expanded", "true");
            panel.setAttribute("aria-hidden", "false");
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Posters
   *   data-yt="VIDEO_ID"  → loads the real YouTube poster, plays inline.
   *   no data-yt          → keeps the designed gradient poster, and the
   *                         click is a no-op rather than a broken player.
   * ------------------------------------------------------------------ */
  function initPosters() {
    $$(".poster").forEach((poster) => {
      const id = poster.dataset.yt;

      if (id) {
        // maxresdefault is not guaranteed to exist; hqdefault always does.
        const img = document.createElement("img");
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = "";
        img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
        img.addEventListener("error", () => {
          if (!img.dataset.fallback) {
            img.dataset.fallback = "1";
            img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          } else {
            img.remove(); // fall back to the CSS gradient poster
          }
        });
        poster.prepend(img);
      }

      poster.addEventListener("click", () => {
        if (!id || poster.classList.contains("is-playing")) return;
        const frame = document.createElement("iframe");
        frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
        frame.title = poster.dataset.title || "Video player";
        frame.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        frame.allowFullscreen = true;
        poster.appendChild(frame);
        poster.classList.add("is-playing");
      });

      // Posters are buttons in spirit — make them behave like one
      poster.setAttribute("role", "button");
      poster.setAttribute("tabindex", "0");
      poster.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          poster.click();
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Marquee — clone the track so the loop has no seam
   * ------------------------------------------------------------------ */
  function initMarquee() {
    $$(".marquee__track").forEach((track) => {
      if (track.dataset.cloned) return;
      track.dataset.cloned = "1";
      $$(":scope > *", track).forEach((child) => {
        const copy = child.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Copy to clipboard
   * ------------------------------------------------------------------ */
  function initCopy() {
    $$("[data-copy]").forEach((el) => {
      el.addEventListener("click", async () => {
        const value = el.dataset.copy;
        try {
          await navigator.clipboard.writeText(value);
          toast("Copied to clipboard");
        } catch {
          // Clipboard API needs a secure context; fall back to selection
          const tmp = document.createElement("textarea");
          tmp.value = value;
          tmp.setAttribute("readonly", "");
          tmp.style.position = "fixed";
          tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
          try {
            document.execCommand("copy");
            toast("Copied to clipboard");
          } catch {
            toast(value);
          }
          tmp.remove();
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Portfolio filters
   * ------------------------------------------------------------------ */
  function initFilters() {
    const bar = $(".filters");
    if (!bar) return;
    const buttons = $$("button", bar);
    const cards = $$("[data-cat]");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const want = btn.dataset.filter;
        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        cards.forEach((card, i) => {
          const show = want === "all" || card.dataset.cat === want;
          card.classList.toggle("is-filtered", !show);
          if (show) {
            // Re-run the entrance so the new set animates in
            card.style.setProperty("--i", String(i % 6));
            card.classList.remove("is-in");
            requestAnimationFrame(() => card.classList.add("is-in"));
          }
        });
        document.dispatchEvent(new CustomEvent("sos:refresh"));
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Forms — client-side validation
   *   No backend is wired up: on a valid submit we show a success state and
   *   hand off to the mail client, so the form never silently drops a lead.
   * ------------------------------------------------------------------ */
  function initForms() {
    $$("form[data-validate]").forEach((form) => {
      const status = $(".form-status", form);

      const fieldOf = (input) => input.closest(".field") || input.closest(".consent");

      const validate = (input) => {
        const field = fieldOf(input);
        if (!field) return input.checkValidity();
        const ok = input.checkValidity();
        field.classList.toggle("is-invalid", !ok);
        const err = $(".field__error", field);
        if (err) err.textContent = ok ? "" : input.validationMessage;
        return ok;
      };

      $$("input, textarea, select", form).forEach((input) => {
        input.addEventListener("blur", () => {
          if (input.value || input.required) validate(input);
        });
        input.addEventListener("input", () => {
          const field = fieldOf(input);
          if (field?.classList.contains("is-invalid")) validate(input);
        });
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputs = $$("input, textarea, select", form);
        let firstBad = null;
        inputs.forEach((input) => {
          if (!validate(input) && !firstBad) firstBad = input;
        });

        if (firstBad) {
          firstBad.focus();
          if (status) {
            status.className = "form-status form-status--err is-shown";
            status.textContent = "Please check the highlighted fields and try again.";
          }
          return;
        }

        const data = new FormData(form);
        const name = (data.get("name") || "there").toString().trim();

        if (status) {
          status.className = "form-status form-status--ok is-shown";
          status.textContent = `Thanks ${name} — opening your email app to send this across. We reply within one business day.`;
        }

        // Compose a mailto so the enquiry actually reaches the inbox.
        const to = form.dataset.mailto || "yuhanperera@stillsonsticksteam.com";
        const services = data.getAll("service").join(", ");
        const lines = [
          `Name: ${data.get("name") || ""}`,
          `Email: ${data.get("email") || ""}`,
          data.get("company") ? `Company / channel: ${data.get("company")}` : "",
          data.get("link") ? `Channel link: ${data.get("link")}` : "",
          services ? `Interested in: ${services}` : "",
          data.get("budget") ? `Budget: ${data.get("budget")}` : "",
          "",
          (data.get("message") || "").toString(),
        ].filter(Boolean);

        const subject = encodeURIComponent(`New enquiry from ${data.get("name") || "the website"}`);
        const body = encodeURIComponent(lines.join("\n"));
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

        form.reset();
        $$(".field", form).forEach((f) => f.classList.remove("is-invalid"));
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Current year
   * ------------------------------------------------------------------ */
  function initYear() {
    $$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  const boot = () => {
    initNav();
    initDrawer();
    initAccordion();
    initMarquee();
    initPosters();
    initCopy();
    initFilters();
    initForms();
    initYear();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
