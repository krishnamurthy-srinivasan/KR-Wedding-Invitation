/* Background music.
 *
 * Rules that shape this module:
 *  - Never autoplay. Sound only ever starts from the user's press on the seal.
 *  - Never start at full volume. We fade 0 -> TARGET over several seconds, so
 *    the music arrives under the reveal rather than interrupting it.
 *  - Always leave an obvious way out: a persistent, labelled mute control.
 *  - Respect the OS: if the tab is hidden we duck to silence and restore after.
 */

const TARGET = 0.34;        // a background level, deliberately not loud
const FADE_IN_MS = 5200;    // slow enough that the entrance is felt, not heard
const FADE_MS = 650;

export function initAudio({ onReady } = {}) {
  const el = document.querySelector("#theme-audio");
  const btn = document.querySelector("#music-toggle");
  if (!el || !btn) return null;

  el.volume = 0;
  el.loop = true;

  let wanted = false;    // has the guest opted in?
  let raf = null;

  const fadeTo = (to, ms) =>
    new Promise((resolve) => {
      if (raf) cancelAnimationFrame(raf);
      const from = el.volume;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        // ease-out cubic: quick to leave silence, gentle as it settles
        el.volume = Math.max(0, Math.min(1, from + (to - from) * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
        else resolve();
      };
      raf = requestAnimationFrame(step);
    });

  const paint = () => {
    btn.dataset.on = String(wanted);
    btn.setAttribute("aria-pressed", String(wanted));
    btn.setAttribute("aria-label", wanted ? "Mute music" : "Play music");
    btn.title = wanted ? "Mute music" : "Play music";
  };

  /** Called by the seal press — the one user gesture that unlocks audio. */
  const start = async () => {
    try {
      await el.play();
      wanted = true;
      paint();
      btn.hidden = false;
      requestAnimationFrame(() => btn.classList.add("is-in"));
      await fadeTo(TARGET, FADE_IN_MS);
      onReady?.(true);
    } catch {
      // Autoplay policy or a missing file — show the control so it can be
      // started manually, and never surface an error to the guest.
      btn.hidden = false;
      requestAnimationFrame(() => btn.classList.add("is-in"));
      wanted = false;
      paint();
      onReady?.(false);
    }
  };

  const toggle = async () => {
    if (wanted) {
      wanted = false; paint();
      await fadeTo(0, FADE_MS);
      el.pause();
    } else {
      wanted = true; paint();
      try { await el.play(); await fadeTo(TARGET, 1400); }
      catch { wanted = false; paint(); }
    }
  };

  btn.addEventListener("click", toggle);

  // Duck when the guest leaves the tab; restore only if they had it on.
  document.addEventListener("visibilitychange", async () => {
    if (!wanted) return;
    if (document.hidden) { await fadeTo(0, 400); el.pause(); }
    else { try { await el.play(); fadeTo(TARGET, 1200); } catch {} }
  });

  return { start, toggle, isOn: () => wanted };
}
