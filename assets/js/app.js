/* ==========================================================================
   app.js — nav, drawer, accordion, work cards, marquees, forms, filters
   ========================================================================== */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------------------------------------------------------- Toast */
  let toastTimer;
  function toast(msg) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add("is-on"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2400);
  }

  /* ------------------------------------------------------------------ Nav */
  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 16);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------- Drawer */
  function initDrawer() {
    const burger = $(".nav__burger");
    const drawer = $(".drawer");
    if (!burger || !drawer) return;

    const focusables = () =>
      $$("a[href], button:not([disabled])", drawer).filter((el) => el.offsetParent !== null);

    const setOpen = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("no-scroll", open);
      if (open) focusables()[0]?.focus();
      else burger.focus();
    };

    burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
    $$("a", drawer).forEach((a) => a.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (e) => {
      if (!drawer.classList.contains("is-open")) return;
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ------------------------------------------------------------ Accordion */
  function initAccordion() {
    $$(".acc").forEach((acc) => {
      const items = $$(".acc__item", acc);
      items.forEach((item) => {
        const btn = $(".acc__btn", item);
        const panel = $(".acc__panel", item);
        if (!btn || !panel) return;
        btn.addEventListener("click", () => {
          const willOpen = !item.classList.contains("is-open");
          items.forEach((o) => {
            o.classList.remove("is-open");
            $(".acc__btn", o)?.setAttribute("aria-expanded", "false");
            $(".acc__panel", o)?.setAttribute("aria-hidden", "true");
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

  /* ----------------------------------------------------------- Work cards *
   * The stills are real screengrabs of the published videos, so they already
   * carry YouTube's own play button. A card only becomes clickable once a
   * video id is supplied via data-yt — otherwise it stays a static still
   * rather than pretending to be a player.
   * ---------------------------------------------------------------------- */
  function initWork() {
    $$(".wk__shot").forEach((shot) => {
      const id = shot.dataset.yt;
      if (!id) return;

      shot.classList.add("has-video");
      shot.setAttribute("role", "button");
      shot.setAttribute("tabindex", "0");

      const play = () => {
        if (shot.classList.contains("is-playing")) return;
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
        f.title = shot.dataset.title || "Video player";
        f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        f.allowFullscreen = true;
        shot.appendChild(f);
        shot.classList.add("is-playing");
      };

      shot.addEventListener("click", play);
      shot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
      });
    });
  }

  /* -------------------------------------------------------- Looping rails *
   * Duplicating the track makes the -50% translate seamless.
   * ---------------------------------------------------------------------- */
  function initRails() {
    $$(".reel__track, .ticker__track").forEach((track) => {
      if (track.dataset.cloned) return;
      track.dataset.cloned = "1";
      $$(":scope > *", track).forEach((child) => {
        const copy = child.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        $$("img", copy).forEach((i) => (i.loading = "lazy"));
        track.appendChild(copy);
      });
    });
  }

  /* ----------------------------------------------------------------- Copy */
  function initCopy() {
    $$("[data-copy]").forEach((el) => {
      el.addEventListener("click", async () => {
        const v = el.dataset.copy;
        try {
          await navigator.clipboard.writeText(v);
          toast("Copied");
        } catch {
          // Clipboard API needs a secure context — fall back to a selection
          const t = document.createElement("textarea");
          t.value = v;
          t.setAttribute("readonly", "");
          t.style.cssText = "position:fixed;opacity:0";
          document.body.appendChild(t);
          t.select();
          try { document.execCommand("copy"); toast("Copied"); }
          catch { toast(v); }
          t.remove();
        }
      });
    });
  }

  /* -------------------------------------------------------------- Filters */
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
            card.style.setProperty("--i", String(i % 6));
            card.classList.remove("is-in");
            requestAnimationFrame(() => card.classList.add("is-in"));
          }
        });
        document.dispatchEvent(new CustomEvent("sos:refresh"));
      });
    });
  }

  /* ---------------------------------------------------------------- Forms *
   * No backend is wired up: a valid submit hands off to the mail client so an
   * enquiry is never silently dropped.
   * ---------------------------------------------------------------------- */
  function initForms() {
    $$("form[data-validate]").forEach((form) => {
      const status = $(".form-status", form);
      const fieldOf = (i) => i.closest(".field") || i.closest(".consent");

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
        input.addEventListener("blur", () => { if (input.value || input.required) validate(input); });
        input.addEventListener("input", () => {
          if (fieldOf(input)?.classList.contains("is-invalid")) validate(input);
        });
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let firstBad = null;
        $$("input, textarea, select", form).forEach((i) => {
          if (!validate(i) && !firstBad) firstBad = i;
        });
        if (firstBad) {
          firstBad.focus();
          if (status) {
            status.className = "form-status form-status--err is-shown";
            status.textContent = "Please check the highlighted fields and try again.";
          }
          return;
        }

        const d = new FormData(form);
        const name = (d.get("name") || "there").toString().trim();
        if (status) {
          status.className = "form-status form-status--ok is-shown";
          status.textContent = `Thanks ${name} — opening your email app to send this across. We reply within one business day.`;
        }

        const to = form.dataset.mailto || "yuhanperera@stillsonsticksteam.com";
        const services = d.getAll("service").join(", ");
        const lines = [
          `Name: ${d.get("name") || ""}`,
          `Email: ${d.get("email") || ""}`,
          d.get("company") ? `Company / channel: ${d.get("company")}` : "",
          d.get("link") ? `Channel link: ${d.get("link")}` : "",
          services ? `Interested in: ${services}` : "",
          d.get("timing") ? `Timing: ${d.get("timing")}` : "",
          "",
          (d.get("message") || "").toString(),
        ].filter(Boolean);

        location.href = `mailto:${to}?subject=${encodeURIComponent(
          `New enquiry from ${d.get("name") || "the website"}`
        )}&body=${encodeURIComponent(lines.join("\n"))}`;

        form.reset();
        $$(".field", form).forEach((f) => f.classList.remove("is-invalid"));
      });
    });
  }

  function initYear() {
    $$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
  }

  const boot = () => {
    initNav(); initDrawer(); initAccordion(); initWork();
    initRails(); initCopy(); initFilters(); initForms(); initYear();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
