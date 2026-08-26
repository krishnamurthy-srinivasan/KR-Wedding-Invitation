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

/* Sealed-envelope opening.
 * The seal press is the single user gesture that (a) opens the envelope and
 * (b) unlocks audio. Nothing plays or moves before it. */
export function initOverture({ onOpen } = {}) {
  const ov = document.querySelector(".overture");
  if (!ov) return;

  const seal = ov.querySelector("#seal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = sessionStorage.getItem("kr-opened") === "yes";

  const release = () => {
    ov.classList.add("is-done");
    document.body.style.overflow = "";
    document.body.classList.add("is-entered");
    setTimeout(() => ov.remove(), 1300);
  };

  // Returning guest in the same session: don't make them open it twice.
  if (seen) { ov.remove(); document.body.style.overflow = ""; document.body.classList.add("is-entered"); return; }

  document.body.style.overflow = "hidden";
  seal?.focus({ preventScroll: true });

  let opening = false;
  const open = () => {
    if (opening) return;
    opening = true;
    sessionStorage.setItem("kr-opened", "yes");

    onOpen?.();                       // start the music from this gesture

    if (reduce) return release();     // no choreography, just enter

    ov.classList.add("is-opening");   // flaps unfold, card rises
    setTimeout(release, 1900);        // let the card be seen before we hand over
  };

  seal?.addEventListener("click", open);
  ov.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });
}
