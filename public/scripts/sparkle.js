/* Sparkles drifting over the painting.
 *
 * A small canvas is the right tool here (unlike the confetti burst, which is
 * one short-lived event): this runs continuously, so ~40 DOM nodes each with
 * their own compositor layer would cost far more than one canvas.
 *
 * It stops itself whenever the canvas is off-screen or the tab is hidden, and
 * is skipped entirely under prefers-reduced-motion.
 */

const GOLD = [
  [255, 240, 200],
  [240, 214, 155],
  [255, 250, 235],
  [214, 178, 110],
];

export function initSparkles(canvas) {
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let W = 0, H = 0, dpr = 1;
  let motes = [];
  let raf = 0;
  let running = false;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  };

  const seed = () => {
    // Fewer on small screens; the painting should breathe, not glitter.
    const n = W < 700 ? 26 : W < 1200 ? 38 : 52;
    motes = Array.from({ length: n }, () => spawn(true));
  };

  function spawn(anywhere) {
    const c = GOLD[(Math.random() * GOLD.length) | 0];
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.6 + Math.random() * 1.9,
      vy: -(3 + Math.random() * 11) / 100,   // drifting upward, very slowly
      vx: (Math.random() - 0.5) * 0.06,
      // each mote twinkles on its own cycle
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.7,
      peak: 0.35 + Math.random() * 0.6,
      c,
    };
  }

  let last = performance.now();
  const frame = (now) => {
    if (!running) return;
    const dt = Math.min(64, now - last);   // clamp after a background stall
    last = now;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      m.y += m.vy * dt;
      m.x += m.vx * dt;
      m.phase += (m.speed * dt) / 1000;

      if (m.y < -12 || m.x < -12 || m.x > W + 12) {
        motes[i] = spawn(false);
        continue;
      }

      const tw = (Math.sin(m.phase) + 1) / 2;      // 0..1
      const a = m.peak * (0.18 + 0.82 * tw * tw);  // bias toward dim
      const [r, g, b] = m.c;

      // soft halo
      const grd = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
      grd.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 5, 0, Math.PI * 2);
      ctx.fill();

      // bright core
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, a * 1.5)})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  };

  let pending = 0;
  const start = () => {
    if (running) return;
    if (!size()) {
      // The canvas has no box yet (still hidden, or laid out on a later
      // frame). Keep trying briefly rather than silently giving up.
      if (pending) return;
      let tries = 0;
      pending = setInterval(() => {
        if (++tries > 40) { clearInterval(pending); pending = 0; return; }
        if (size()) { clearInterval(pending); pending = 0; realStart(); }
      }, 100);
      return;
    }
    realStart();
  };
  const realStart = () => {
    if (running) return;
    if (!motes.length) seed();
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  // Start straight away; the observer below only pauses it when it scrolls
  // out of view. (Waiting for the observer to fire first is fragile: it does
  // not fire at all in some embedded contexts, which left the canvas blank.)
  start();

  const io = new IntersectionObserver(
    ([e]) => (e.isIntersecting && !document.hidden ? start() : stop()),
    { threshold: 0.01 }
  );
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (size()) seed(); }, 200);
  }, { passive: true });

  return { start, stop };
}
