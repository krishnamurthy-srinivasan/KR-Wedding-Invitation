/* Cinematic gopuram band.
 * The image scales slowly as the section crosses the viewport — a scroll-linked
 * zoom rather than a timed one, so it always feels tied to the guest's motion.
 * Uses the native scroll-timeline where available and falls back to rAF. */

export function initGopuram(section) {
  if (!section) return;
  const media = section.querySelector(".gopuram__media");
  if (!media) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    media.style.transform = "scale(1.02)";
    return;
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!vh) return;                                   // not laid out yet
    if (r.bottom < -100 || r.top > vh + 100) return;   // far off-screen
    // 0 as the section enters the bottom, 1 as it leaves the top
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const scale = 1.28 - p * 0.26;          // 1.28 -> 1.02, a slow push-in
    const shift = (p - 0.5) * 6;            // gentle vertical drift
    media.style.transform = `scale(${scale.toFixed(4)}) translate3d(0, ${shift.toFixed(2)}%, 0)`;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Paint immediately, and again once the image has decoded so the first
  // frame is never an untransformed jump.
  if (location.hash === "#zoomdebug") window.__gopuramUpdate = update;

  update();
  const img = media.querySelector("img");
  if (img && !img.complete) img.addEventListener("load", update, { once: true });
  requestAnimationFrame(update);
}
