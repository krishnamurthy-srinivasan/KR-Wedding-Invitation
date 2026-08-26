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

export function burst(origin, { count = 62 } = {}) {
  const doc = origin.ownerDocument || document;
  const win = doc.defaultView || window;
  if (win.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = doc.createElement("div");
  layer.className = "burst";
  layer.setAttribute("aria-hidden", "true");
  doc.body.appendChild(layer);

  const r = origin.getBoundingClientRect();
  const ox = r.left + r.width / 2;
  const oy = r.top + r.height / 2;

  for (let i = 0; i < count; i++) {
    const bit = doc.createElement("span");
    bit.className = "burst__bit";

    const kind = Math.random();
    bit.innerHTML = kind < 0.55 ? PETAL : kind < 0.8 ? LEAF : FOIL;
    const colour = COLOURS[(Math.random() * COLOURS.length) | 0];

    // Fan upward and outward from the card, then let gravity take over.
    const angle = (-90 + (Math.random() - 0.5) * 130) * (Math.PI / 180);
    const power = 190 + Math.random() * 300;
    const dx = Math.cos(angle) * power + (Math.random() - 0.5) * 90;
    const dy = Math.sin(angle) * power;
    const fall = 320 + Math.random() * 420;   // how far it drifts down after

    const size = 8 + Math.random() * 13;
    bit.style.cssText =
      `position:fixed;display:block;left:${ox}px;top:${oy}px;` +
      `width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;` +
      `pointer-events:none;opacity:0;color:${colour};`;
    bit.style.setProperty("--dx", `${dx.toFixed(0)}px`);
    bit.style.setProperty("--dy", `${dy.toFixed(0)}px`);
    bit.style.setProperty("--fall", `${fall.toFixed(0)}px`);
    bit.style.setProperty("--spin", `${(Math.random() - 0.5) * 900}deg`);
    bit.style.setProperty("--dur", `${1.9 + Math.random() * 0.9}s`);
    bit.style.setProperty("--delay", `${Math.random() * 0.16}s`);

    layer.appendChild(bit);
  }

  // Tear the whole layer down once the longest bit has finished.
  setTimeout(() => layer.remove(), 3200);
}
