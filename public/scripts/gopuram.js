/* Cinematic gopuram band: the temple starts pushed in and eases OUT as the
 * section travels up the viewport, so the town and sky open up around it.
 *
 * Preferred path is a native CSS scroll-driven animation (compositor-driven,
 * no JS on the scroll thread). Where that is unsupported we fall back to a
 * rAF loop driven by the scroll position. Both use the same keyframes so the
 * motion is identical.
 */

const SCALE_IN = 1.34;   // as the band enters from below
const SCALE_OUT = 1.0;   // once it has travelled past

export function initGopuram(section) {
  if (!section) return;
  const media = section.querySelector(".gopuram__media");
  if (!media) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    media.style.transform = "none";
    return;
  }

  // --- Native scroll-timeline (Chrome/Edge 115+, Safari 26+) ---
  const nativeOK =
    CSS.supports("animation-timeline: view()") &&
    CSS.supports("animation-range: cover 0% cover 100%");

  if (nativeOK) {
    section.classList.add("gopuram--native");
    return; // the CSS in sections.css drives it from here
  }

  // --- Fallback: rAF tied to scroll position ---
  let raf = 0;

  const paint = () => {
    raf = 0;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (!vh) return;
    const r = section.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;

    // p: 0 when the band's top edge is at the bottom of the screen,
    //    1 when its bottom edge has reached the top of the screen.
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const scale = SCALE_IN - (SCALE_IN - SCALE_OUT) * p;
    media.style.transform = `scale(${scale.toFixed(4)})`;
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Keep painting while the band is anywhere near the viewport, so the zoom
  // is never left stale by a scroll event the browser coalesced away.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const loop = () => {
            paint();
            if (section.dataset.live === "1") requestAnimationFrame(loop);
          };
          section.dataset.live = "1";
          loop();
        } else {
          section.dataset.live = "0";
        }
      });
    },
    { rootMargin: "200px" }
  );
  io.observe(section);

  paint();
  const img = media.querySelector("img");
  if (img && !img.complete) img.addEventListener("load", paint, { once: true });
}
