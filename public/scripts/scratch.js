/* Gold-foil scratch card.
 * A canvas of brushed gold sits over the content; pointer movement erases it.
 * Once ~55% is cleared the rest dissolves on its own so nobody has to scrub.
 * Fully keyboard/AT accessible: a "Reveal" button does the same job, and the
 * content underneath is real DOM text that screen readers always reach. */

export function initScratch(root) {
  if (!root) return;
  const canvas = root.querySelector("canvas");
  const reveal = root.querySelector("[data-scratch-reveal]");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let done = false;
  let painted = false;

  const paintFoil = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Brushed antique gold. Read the live token so each edition's foil
    // matches its own palette.
    const cs = getComputedStyle(document.documentElement);
    const warm = (cs.getPropertyValue("--gold-light").trim() || "#e6cd93");
    const deep = (cs.getPropertyValue("--gold-deep").trim() || "#8a6a26");
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0.00, deep);
    g.addColorStop(0.22, warm);
    g.addColorStop(0.42, deep);
    g.addColorStop(0.63, warm);
    g.addColorStop(0.82, deep);
    g.addColorStop(1.00, deep);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);

    // fine grain so it reads as foil, not flat paint
    ctx.globalAlpha = 0.10;
    for (let i = 0; i < r.width; i += 3) {
      ctx.fillStyle = i % 6 ? "#fff6dd" : "#6d5217";
      ctx.fillRect(i, 0, 1, r.height);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(72,54,15,0.62)";
    ctx.font = `600 ${Math.max(10, Math.min(13, r.width / 26))}px Jost, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.letterSpacing = "3px";
    ctx.fillText("SCRATCH TO REVEAL", r.width / 2, r.height / 2 + 4);

    ctx.globalCompositeOperation = "destination-out";
    painted = true;
  };

  const finish = () => {
    if (done) return;
    done = true;
    root.dataset.done = "true";
    root.querySelector(".scratch__hint")?.setAttribute("hidden", "");
    root.querySelector(".scratch")?.setAttribute("data-done", "true");
    reveal?.setAttribute("hidden", "");
    canvas.style.transition = "opacity .9s ease";
    canvas.style.opacity = "0";
    setTimeout(() => { canvas.style.pointerEvents = "none"; }, 900);
    root.dispatchEvent(new CustomEvent("scratch:done"));
  };

  const pct = () => {
    const { width, height } = canvas;
    if (!width) return 0;
    const step = 16; // sample, don't scan every pixel
    const d = ctx.getImageData(0, 0, width, height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 4 * step) { total++; if (d[i] < 40) clear++; }
    return total ? clear / total : 0;
  };

  let drawing = false, last = null, checks = 0;
  const at = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const scrub = (p) => {
    const rad = Math.max(16, canvas.getBoundingClientRect().width / 12);
    ctx.lineWidth = rad * 2;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.beginPath();
    if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
    ctx.fill();
    last = p;
  };

  canvas.addEventListener("pointerdown", (e) => {
    if (done) return;
    drawing = true; last = null;
    canvas.setPointerCapture(e.pointerId);
    scrub(at(e));
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing || done) return;
    e.preventDefault();
    scrub(at(e));
    if (++checks % 9 === 0 && pct() > 0.55) finish();
  }, { passive: false });
  const stop = () => {
    if (!drawing) return;
    drawing = false; last = null;
    if (!done && pct() > 0.42) finish();
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  canvas.addEventListener("pointerleave", stop);

  reveal?.addEventListener("click", finish);

  // Reduced motion / no pointer: show it plainly rather than demand scrubbing.
  if (reduce) { finish(); return; }

  // Paint only once it is actually on screen (canvas needs a real size).
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting && !painted && !done) { paintFoil(); io.disconnect(); }
    });
  }, { rootMargin: "150px" });
  io.observe(canvas);

  let rt;
  window.addEventListener("resize", () => {
    if (done || !painted) return;
    clearTimeout(rt);
    rt = setTimeout(() => { ctx.globalCompositeOperation = "source-over"; paintFoil(); }, 200);
  });
}
