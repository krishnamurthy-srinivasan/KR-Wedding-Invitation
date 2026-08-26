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

/* ---------- Ambient drifting petals ---------- */
const PETAL_SVG = `
<svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
  <path d="M12 1C6.6 8 4 13.4 4 17.6 4 23.4 7.6 27 12 27s8-3.6 8-9.4C20 13.4 17.4 8 12 1z"
        fill="currentColor" opacity="0.55"/>
  <path d="M12 27V6" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>
</svg>`;

export function initAmbient() {
  if (reduceMotion()) return;
  const layer = document.querySelector(".ambient");
  if (!layer) return;

  // Fewer petals on small / low-core devices
  const wide = window.innerWidth > 900;
  const beefy = (navigator.hardwareConcurrency || 4) >= 4;
  const count = wide && beefy ? 11 : 6;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.innerHTML = PETAL_SVG;
    const size = 9 + Math.random() * 13;
    p.style.left = `${Math.random() * 100}%`;
    p.style.width = `${size}px`;
    p.style.setProperty("--dur", `${20 + Math.random() * 20}s`);
    p.style.setProperty("--delay", `${-Math.random() * 30}s`);
    p.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
    p.style.setProperty("--spin", `${140 + Math.random() * 320}deg`);
    p.style.setProperty("--peak", (0.14 + Math.random() * 0.16).toFixed(2));
    frag.appendChild(p);
  }
  layer.appendChild(frag);

  // Pause the whole layer when the tab is hidden
  document.addEventListener("visibilitychange", () => {
    layer.style.animationPlayState = document.hidden ? "paused" : "running";
    layer.querySelectorAll(".petal").forEach((p) => {
      p.style.animationPlayState = document.hidden ? "paused" : "running";
    });
  });
}
