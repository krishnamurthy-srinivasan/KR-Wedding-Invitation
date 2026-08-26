/* Scroll reveal, self-drawing ornaments, parallax, ambient petals.
   IntersectionObserver + rAF only — no dependencies, no canvas. */

export const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Scroll reveals ---------- */
export function initReveals() {
  const targets = document.querySelectorAll("[data-reveal], .img-reveal, .line-mask, .draw");
  if (reduceMotion()) {
    targets.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  targets.forEach((el) => io.observe(el));
}

/* Measure each ornament path so the dash animation is exact. */
export function prepareDrawings() {
  document.querySelectorAll(".draw").forEach((svgHost) => {
    svgHost.querySelectorAll(".d").forEach((path, i) => {
      let len = 400;
      try {
        if (typeof path.getTotalLength === "function") len = Math.ceil(path.getTotalLength()) || 400;
      } catch { /* detached / display:none — keep the fallback */ }
      path.style.setProperty("--len", len);
      path.style.setProperty("--i", i);
    });
  });
}

/* ---------- Parallax (transform-only, rAF-batched) ---------- */
export function initParallax() {
  if (reduceMotion()) return;
  const items = [...document.querySelectorAll("[data-parallax]")];
  if (!items.length) return;
  if (!window.matchMedia("(min-width: 760px)").matches) return;

  let ticking = false;
  const vh = () => window.innerHeight;

  const update = () => {
    ticking = false;
    for (const el of items) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh() + 200) continue;
      const speed = parseFloat(el.dataset.parallax) || 0.12;
      // -1 .. 1 across the viewport
      const progress = (rect.top + rect.height / 2 - vh() / 2) / vh();
      el.style.transform = `translate3d(0, ${(-progress * speed * 100).toFixed(2)}px, 0)`;
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/* ---------- Ambient background ----------
 * Three quiet layers, all CSS-animated so nothing runs on the main thread:
 *   1. a slow "temple light" aurora that drifts behind everything
 *   2. floating diya embers that rise like lamp light
 *   3. drifting jasmine petals
 * Density scales down on small or low-core devices, and the whole layer is
 * skipped entirely under prefers-reduced-motion.
 */

const PETAL_SVG = `
<svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
  <path d="M12 1C6.6 8 4 13.4 4 17.6 4 23.4 7.6 27 12 27s8-3.6 8-9.4C20 13.4 17.4 8 12 1z"
        fill="currentColor" opacity="0.55"/>
  <path d="M12 27V6" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>
</svg>`;

export function initAmbient() {
  const layer = document.querySelector(".ambient");
  if (!layer) return;
  if (reduceMotion()) return;

  const wide = window.innerWidth > 900;
  const beefy = (navigator.hardwareConcurrency || 4) >= 4;
  const tier = wide && beefy ? 2 : wide || beefy ? 1 : 0;

  const frag = document.createDocumentFragment();

  /* 1. Aurora: two huge, very soft, slowly wandering colour fields. */
  for (let i = 0; i < 2; i++) {
    const a = document.createElement("span");
    a.className = `aurora aurora--${i + 1}`;
    frag.appendChild(a);
  }

  /* 2. Diya embers: small warm points that rise and fade. */
  const embers = [6, 10, 14][tier];
  for (let i = 0; i < embers; i++) {
    const e = document.createElement("span");
    e.className = "ember";
    e.style.left = `${Math.random() * 100}%`;
    e.style.setProperty("--size", `${2 + Math.random() * 3}px`);
    e.style.setProperty("--dur", `${13 + Math.random() * 14}s`);
    e.style.setProperty("--delay", `${-Math.random() * 26}s`);
    e.style.setProperty("--sway", `${(Math.random() - 0.5) * 120}px`);
    e.style.setProperty("--peak", (0.35 + Math.random() * 0.4).toFixed(2));
    frag.appendChild(e);
  }

  /* 3. Jasmine petals. */
  const petals = [5, 8, 12][tier];
  for (let i = 0; i < petals; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.innerHTML = PETAL_SVG;
    p.style.left = `${Math.random() * 100}%`;
    p.style.width = `${9 + Math.random() * 13}px`;
    p.style.setProperty("--dur", `${20 + Math.random() * 20}s`);
    p.style.setProperty("--delay", `${-Math.random() * 30}s`);
    p.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
    p.style.setProperty("--spin", `${140 + Math.random() * 320}deg`);
    p.style.setProperty("--peak", (0.12 + Math.random() * 0.14).toFixed(2));
    frag.appendChild(p);
  }

  layer.appendChild(frag);

  /* Stop everything while the tab is hidden so we never burn battery. */
  const setPlay = (state) => {
    layer.querySelectorAll("span").forEach((n) => { n.style.animationPlayState = state; });
  };
  document.addEventListener("visibilitychange", () => {
    setPlay(document.hidden ? "paused" : "running");
  });
}
