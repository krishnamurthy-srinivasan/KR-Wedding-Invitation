/* Accessible gallery lightbox: focus trap, arrow keys, swipe, Esc. */

export function initLightbox(gallery) {
  if (!gallery) return;
  const triggers = [...gallery.querySelectorAll("[data-lb]")];
  if (!triggers.length) return;

  const shots = triggers.map((btn) => {
    const img = btn.querySelector("img");
    return {
      src: img.currentSrc || img.src,
      alt: img.alt,
      w: img.getAttribute("width") || "1080",
      h: img.getAttribute("height") || "1350",
    };
  });

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photograph viewer");
  box.dataset.open = "false";
  box.innerHTML = `
    <div class="lightbox__bar">
      <span class="lightbox__count"></span>
      <button class="lb-btn" data-act="close" aria-label="Close viewer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>
    </div>
    <img alt="" width="1080" height="1350">
    <p class="lightbox__cap"></p>
    <div class="lightbox__nav">
      <button class="lb-btn" data-act="prev" aria-label="Previous photograph">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg>
      </button>
      <button class="lb-btn" data-act="next" aria-label="Next photograph">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>
      </button>
    </div>`;
  document.body.appendChild(box);

  const imgEl   = box.querySelector("img");
  const capEl   = box.querySelector(".lightbox__cap");
  const countEl = box.querySelector(".lightbox__count");
  const focusables = () => [...box.querySelectorAll("button")];

  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + shots.length) % shots.length;
    const shot = shots[index];
    imgEl.src = shot.src;
    imgEl.alt = shot.alt;
    imgEl.width = shot.w;
    imgEl.height = shot.h;
    capEl.textContent = shot.alt;
    countEl.textContent = `${index + 1} / ${shots.length}`;
  };

  const open = (i, trigger) => {
    opener = trigger;
    show(i);
    box.dataset.open = "true";
    document.body.style.overflow = "hidden";
    box.querySelector('[data-act="close"]').focus();
  };

  const close = () => {
    box.dataset.open = "false";
    document.body.style.overflow = "";
    if (opener) opener.focus();
  };

  triggers.forEach((btn, i) => btn.addEventListener("click", () => open(i, btn)));

  box.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "close") return close();
    if (act === "prev")  return show(index - 1);
    if (act === "next")  return show(index + 1);
    // Click on the backdrop (not the photo) closes
    if (e.target === box) close();
  });

  document.addEventListener("keydown", (e) => {
    if (box.dataset.open !== "true") return;
    if (e.key === "Escape")     { e.preventDefault(); close(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); show(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    if (e.key === "Tab") {
      const items = focusables();
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Swipe on touch
  let startX = null;
  box.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 55) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
}
