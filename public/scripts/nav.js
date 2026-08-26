/* Nav appears after the hero; scroll-spy; mobile sheet. */

export function initNav() {
  const nav = document.querySelector(".nav");
  const hero = document.querySelector("#home");
  if (!nav) return;

  const toggle = nav.querySelector(".nav__toggle");
  const links = [...nav.querySelectorAll(".nav__link")];

  /* Reveal the bar once the hero has scrolled past */
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => nav.classList.toggle("is-visible", !entry.isIntersecting),
      { rootMargin: "-72% 0px 0px 0px" }
    ).observe(hero);
  } else {
    nav.classList.add("is-visible");
  }

  /* Mobile sheet */
  const setOpen = (open) => {
    nav.dataset.open = String(open);
    toggle?.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle?.addEventListener("click", () => setOpen(nav.dataset.open !== "true"));
  links.forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.dataset.open === "true") { setOpen(false); toggle?.focus(); }
  });
  // Reset when resizing up to desktop
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });

  /* Scroll spy */
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.setAttribute("aria-current", String(a.getAttribute("href") === `#${entry.target.id}`))
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }
}

/* Brief, skippable opening. Remembers that it has been seen. */
export function initOverture() {
  const ov = document.querySelector(".overture");
  if (!ov) return;

  const seen = sessionStorage.getItem("kr-overture") === "seen";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (seen || reduce) {
    ov.remove();
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "hidden";

  const dismiss = () => {
    if (ov.classList.contains("is-done")) return;
    ov.classList.add("is-done");
    document.body.style.overflow = "";
    sessionStorage.setItem("kr-overture", "seen");
    setTimeout(() => ov.remove(), 1200);
  };

  ov.querySelector(".overture__skip")?.addEventListener("click", dismiss);
  ov.addEventListener("click", dismiss);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") dismiss(); }, { once: true });

  // Auto-continue — short by design
  setTimeout(dismiss, 3400);
}
