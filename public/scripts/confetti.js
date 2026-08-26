/* Rose-petal + gold-foil burst, fired once when the scratch card is cleared.
 *
 * Deliberately DOM-based rather than canvas: it is a single short-lived burst
 * (~2.6s) of ~60 nodes, animated entirely on the compositor via transform and
 * opacity, then removed. No render loop is left running afterwards.
 */

const PETAL = `<svg viewBox="0 0 24 30" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M12 1C6.6 8 4 13.4 4 17.6 4 23.4 7.6 27 12 27s8-3.6 8-9.4C20 13.4 17.4 8 12 1z"/></svg>`;
const LEAF  = `<svg viewBox="0 0 24 24" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M12 2C6 8 4 13 4 16.5 4 20.6 7.4 23 12 23s8-2.4 8-6.5C20 13 18 8 12 2z"/></svg>`;
const FOIL  = `<svg viewBox="0 0 12 12" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"><rect fill="currentColor" width="12" height="12" rx="1"/></svg>`;

/* Rose, marigold and the site's own golds. */
const COLOURS = [
  "#c0345f", "#9c2350", "#d4577c",   // rose
  "#d9b569", "#b08d3f", "#ecd9ab",   // gold
  "#6d2c91", "#8e1749",              // purple / kumkum
];

/* Full-viewport celebration.
 * Two side cannons fire inward and up, plus a rain of petals from above the
 * fold, so the whole screen celebrates rather than a puff over one card. */
export function burst(origin, { count = 200 } = {}) {
  const doc = (origin && origin.ownerDocument) || document;
  const win = doc.defaultView || window;
  if (win.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const W = win.innerWidth, H = win.innerHeight;

  const layer = doc.createElement("div");
  layer.className = "burst";
  layer.setAttribute("aria-hidden", "true");
  doc.body.appendChild(layer);

  const make = (x, y, angleDeg, spread, power, delayBase, drop) => {
    const bit = doc.createElement("span");
    bit.className = "burst__bit";

    const kind = Math.random();
    bit.innerHTML = kind < 0.5 ? PETAL : kind < 0.78 ? LEAF : FOIL;
    const colour = COLOURS[(Math.random() * COLOURS.length) | 0];

    const a = (angleDeg + (Math.random() - 0.5) * spread) * (Math.PI / 180);
    const p = power * (0.55 + Math.random() * 0.75);
    const dx = Math.cos(a) * p;
    const dy = Math.sin(a) * p;
    const size = 9 + Math.random() * 15;

    bit.style.cssText =
      `position:fixed;display:block;left:${x}px;top:${y}px;` +
      `width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;` +
      `pointer-events:none;opacity:0;color:${colour};`;
    bit.style.setProperty("--dx", `${dx.toFixed(0)}px`);
    bit.style.setProperty("--dy", `${dy.toFixed(0)}px`);
    bit.style.setProperty("--fall", `${drop + Math.random() * 500}px`);
    bit.style.setProperty("--spin", `${(Math.random() - 0.5) * 1000}deg`);
    bit.style.setProperty("--dur", `${2.4 + Math.random() * 1.6}s`);
    bit.style.setProperty("--delay", `${delayBase + Math.random() * 0.5}s`);
    layer.appendChild(bit);
  };

  const each = Math.round(count / 4);

  // Two cannons from the lower corners, firing inward and up.
  for (let i = 0; i < each; i++) make(-10,    H * 0.9, -52,  46, W * 0.95, 0,    H * 0.9);
  for (let i = 0; i < each; i++) make(W + 10, H * 0.9, -128, 46, W * 0.95, 0.08, H * 0.9);

  // A shower from above the fold, so the top half celebrates too.
  for (let i = 0; i < each; i++) {
    make(Math.random() * W, -30, 90, 40, 140, Math.random() * 1.1, H + 200);
  }

  // And a burst out of whatever triggered it, so the source still feels alive.
  if (origin) {
    const r = origin.getBoundingClientRect();
    const ox = r.left + r.width / 2, oy = r.top + r.height / 2;
    for (let i = 0; i < each; i++) make(ox, oy, -90, 150, 420, 0, 460);
  }

  setTimeout(() => layer.remove(), 5200);
}
