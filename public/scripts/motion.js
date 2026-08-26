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
 * Five layers, all pure CSS animation so nothing runs on the main thread:
 *   1. aurora        slow wandering colour fields
 *   2. kolam         large rotating temple-geometry rings
 *   3. stars         a faint drifting starfield (comes alive in dark mode)
 *   4. embers        rising diya lights
 *   5. petals        falling jasmine
 * Density scales with the device, everything pauses when the tab is hidden,
 * and the whole layer is skipped under prefers-reduced-motion.
 */

const PETAL_SVG = `
<svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
  <path d="M12 1C6.6 8 4 13.4 4 17.6 4 23.4 7.6 27 12 27s8-3.6 8-9.4C20 13.4 17.4 8 12 1z"
        fill="currentColor" opacity="0.6"/>
  <path d="M12 27V6" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>
</svg>`;

const KOLAM_SVG = `
<svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
  <g stroke="currentColor" stroke-width="0.7" fill="none">
    <circle cx="100" cy="100" r="94"/>
    <circle cx="100" cy="100" r="70"/>
    <circle cx="100" cy="100" r="44"/>
    <path d="M100 6c26 26 26 62 0 88s-62 26-88 0"/>
    <path d="M100 194c-26-26-26-62 0-88s62-26 88 0"/>
    <path d="M100 30c18 18 18 42 0 60s-42 18-60 0"/>
    <path d="M100 170c-18-18-18-42 0-60s42-18 60 0"/>
  </g>
</svg>`;

export function initAmbient() {
  const layer = document.querySelector(".ambient");
  if (!layer) return;
  if (reduceMotion()) return;

  const wide = window.innerWidth > 900;
  const beefy = (navigator.hardwareConcurrency || 4) >= 4;
  const tier = wide && beefy ? 2 : wide || beefy ? 1 : 0;

  const frag = document.createDocumentFragment();
  const add = (cls, css = "", html = "") => {
    const n = document.createElement("span");
    n.className = cls;
    if (css) n.style.cssText = css;
    if (html) n.innerHTML = html;
    frag.appendChild(n);
    return n;
  };

  /* 1. Aurora */
  add("aurora aurora--1");
  add("aurora aurora--2");
  if (tier >= 1) add("aurora aurora--3");

  /* 2. Rotating kolam rings */
  const kolams = [1, 2, 2][tier];
  const spots = [
    "top:-16vmax; left:-12vmax; width:56vmax;",
    "bottom:-20vmax; right:-14vmax; width:64vmax;",
  ];
  for (let i = 0; i < kolams; i++) {
    const k = add("kolam", spots[i], KOLAM_SVG);
    k.style.setProperty("--dur", `${150 + i * 70}s`);
    k.style.setProperty("--dir", i % 2 ? "reverse" : "normal");
  }

  /* 3. Starfield */
  const stars = [0, 26, 46][tier];
  for (let i = 0; i < stars; i++) {
    const s = add("star");
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty("--size", `${1 + Math.random() * 2}px`);
    s.style.setProperty("--dur", `${3 + Math.random() * 6}s`);
    s.style.setProperty("--delay", `${-Math.random() * 8}s`);
    s.style.setProperty("--peak", (0.3 + Math.random() * 0.6).toFixed(2));
  }

  /* 4. Diya embers */
  const embers = [7, 12, 18][tier];
  for (let i = 0; i < embers; i++) {
    const e = add("ember");
    e.style.left = `${Math.random() * 100}%`;
    e.style.setProperty("--size", `${2 + Math.random() * 4}px`);
    e.style.setProperty("--dur", `${12 + Math.random() * 14}s`);
    e.style.setProperty("--delay", `${-Math.random() * 26}s`);
    e.style.setProperty("--sway", `${(Math.random() - 0.5) * 140}px`);
    e.style.setProperty("--peak", (0.4 + Math.random() * 0.45).toFixed(2));
  }

  /* 5. Jasmine petals */
  const petals = [6, 10, 15][tier];
  for (let i = 0; i < petals; i++) {
    const p = add("petal", "", PETAL_SVG);
    p.style.left = `${Math.random() * 100}%`;
    p.style.width = `${9 + Math.random() * 14}px`;
    p.style.setProperty("--dur", `${18 + Math.random() * 20}s`);
    p.style.setProperty("--delay", `${-Math.random() * 30}s`);
    p.style.setProperty("--drift", `${(Math.random() - 0.5) * 240}px`);
    p.style.setProperty("--spin", `${140 + Math.random() * 320}deg`);
    p.style.setProperty("--peak", (0.16 + Math.random() * 0.18).toFixed(2));
  }

  layer.appendChild(frag);

  document.addEventListener("visibilitychange", () => {
    const state = document.hidden ? "paused" : "running";
    layer.querySelectorAll("span").forEach((n) => { n.style.animationPlayState = state; });
  });
}
