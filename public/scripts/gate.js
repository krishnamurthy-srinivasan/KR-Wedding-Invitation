/* The gate: sealed envelope -> side chooser.
 *
 * Flow: press the wax seal (the one user gesture that also unlocks audio),
 * the envelope unfolds, then the bride/groom chooser fades in over the
 * Radha-Krishna artwork. Picking a side stores it, so a returning guest goes
 * straight to their own invitation instead of choosing twice. */

import { ORN, mountCorners } from "./ornaments.js?v=f828ce9b";
import { initReveals, prepareDrawings, initAmbient } from "./motion.js?v=f977ae37";
import { initAudio } from "./audio.js?v=2951ae48";
import { initTheme } from "./theme.js?v=5dc7a2b3";

const SIDE_KEY = "kr-side";

function mountOrnaments() {
  document.querySelectorAll("[data-orn]").forEach((slot) => {
    const key = slot.dataset.orn;
    if (ORN[key]) slot.innerHTML = ORN[key];
  });
  document.querySelectorAll("[data-corners]").forEach(mountCorners);
}

function boot() {
  initTheme();
  mountOrnaments();
  prepareDrawings();
  initAmbient();

  const params = new URLSearchParams(location.search);

  // A returning guest who already picked a side skips straight through,
  // unless they explicitly asked to choose again (?choose=1).
  if (!params.has("choose")) {
    let saved = null;
    try { saved = localStorage.getItem(SIDE_KEY); } catch {}
    if (saved === "bride" || saved === "groom") {
      location.replace(`${saved}.html`);
      return;
    }
  }

  const overture = document.querySelector(".overture");
  const chooser = document.querySelector(".chooser");
  const seal = document.querySelector("#seal");
  const audio = initAudio();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showChooser = () => {
    // Opt into the fade only if we can actually animate it. The chooser is
    // visible by default, so if anything here fails the guest still sees it.
    if (!reduce) chooser.classList.add("is-fading");
    chooser.hidden = false;
    document.body.classList.remove("gate");

    void chooser.offsetHeight;          // register the pre-transition state
    chooser.classList.add("is-in");

    initReveals();
  };

  // Remember the side the moment it is chosen.
  document.querySelectorAll("[href$='.html']").forEach((a) => {
    a.addEventListener("click", () => {
      const side = a.getAttribute("href").replace(".html", "");
      try { localStorage.setItem(SIDE_KEY, side); } catch {}
    });
  });

  if (!overture) return showChooser();

  document.body.style.overflow = "hidden";
  seal?.focus({ preventScroll: true });

  let opening = false;
  const open = () => {
    if (opening) return;
    opening = true;
    audio?.start();                        // sound starts from this gesture

    const finish = () => {
      overture.classList.add("is-done");
      document.body.style.overflow = "";
      showChooser();
      setTimeout(() => overture.remove(), 1300);
    };

    if (reduce) return finish();
    overture.classList.add("is-opening");  // flaps unfold, card rises
    setTimeout(finish, 1750);
  };

  seal?.addEventListener("click", open);
  overture.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });

  document.documentElement.classList.add("is-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
