/* Intelegistics, Inc. — site behaviour (no dependencies) */

/* ==========================================================
   SITE SETTINGS — edit these two values
   CONTACT_EMAIL: where the contact form sends (opens the
   visitor's email app, so it works on GitHub Pages with no
   server). Leave "" to hide email and point people to LinkedIn.
   ========================================================== */
const CONTACT_EMAIL = "";
const LINKEDIN_URL  = "https://www.linkedin.com/company/109301424/";

(function () {
  const root = document.documentElement;
  root.classList.add("js");

  /* ---- Header: solid background after scrolling ---- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  const toggle = document.querySelector(".nav-toggle");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle && toggle.setAttribute("aria-expanded", "false");
  };
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNav();
      document.querySelectorAll(".has-dropdown.is-open").forEach((d) => {
        d.classList.remove("is-open");
        d.querySelector(".nav-link").setAttribute("aria-expanded", "false");
      });
    }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 960) closeNav(); });

  /* ---- Services dropdown: click/tap + keyboard ---- */
  document.querySelectorAll(".has-dropdown > .nav-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const li = btn.parentElement;
      const open = li.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".has-dropdown.is-open").forEach((d) => {
      if (!d.contains(e.target) && window.innerWidth > 960) {
        d.classList.remove("is-open");
        d.querySelector(".nav-link").setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---- Contact details driven by settings ---- */
  document.querySelectorAll("[data-linkedin]").forEach((a) => { a.href = LINKEDIN_URL; });
  document.querySelectorAll("[data-email-item]").forEach((el) => {
    if (!CONTACT_EMAIL) { el.remove(); return; }
    const a = el.querySelector("a");
    if (a) { a.href = "mailto:" + CONTACT_EMAIL; a.textContent = CONTACT_EMAIL; }
  });

  /* ---- Contact form → opens the visitor's email app ---- */
  const form = document.querySelector("#contact-form");
  if (form) {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      if (!CONTACT_EMAIL) {
        status.innerHTML = 'Thanks! Online messages aren’t switched on yet. Please reach us on <a href="' +
          LINKEDIN_URL + '" target="_blank" rel="noopener" style="color:#ff4b4f">LinkedIn</a> for now.';
        return;
      }
      const subject = "Website inquiry: " + (d.get("topic") || "General") + " (" + (d.get("company") || d.get("name")) + ")";
      const body = [
        "Name: " + d.get("name"),
        "Company: " + (d.get("company") || "—"),
        "Email: " + d.get("email"),
        "Phone: " + (d.get("phone") || "—"),
        "Topic: " + (d.get("topic") || "—"),
        "",
        d.get("message") || ""
      ].join("\n");
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "Opening your email app… If nothing happens, email us at " + CONTACT_EMAIL + ".";
    });
  }
})();
