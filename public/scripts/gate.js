/* The gate: sealed envelope -> side chooser.
 *
 * Flow: press the wax seal (the one user gesture that also unlocks audio),
 * the envelope unfolds, then the bride/groom chooser fades in over the
 * Radha-Krishna artwork. Picking a side stores it, so a returning guest goes
 * straight to their own invitation instead of choosing twice. */

import { ORN, mountCorners } from "./ornaments.js?v=f828ce9b";
import { initReveals, prepareDrawings, initAmbient } from "./motion.js?v=f977ae37";
import { initAudio } from "./audio.js?v=3e648893";
import { initSparkles } from "./sparkle.js?v=7f7a3358";
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

    initSparkles(chooser.querySelector(".chooser__sparks"));
    initReveals();
  };

  /* Cinematic exit: the painting is a diptych, so the curtain parts from the
     centre seam where their hands meet, then the chosen page loads. */
  const leaveTo = (href, side) => {
    const curtain = chooser.querySelector(".curtain");
    if (!curtain || reduce) { location.href = href; return; }

    chooser.classList.add("is-leaving");
    chooser.dataset.leaving = side;      // tints the wipe to that side's colour
    curtain.classList.add("is-closing");

    // Navigate as the wipe completes; the fallback guarantees we never stall.
    let gone = false;
    const go = () => { if (!gone) { gone = true; location.href = href; } };
    curtain.addEventListener("transitionend", go, { once: true });
    setTimeout(go, 1250);
  };

  // Remember the side, hand the music baton over, then play the exit wipe.
  document.querySelectorAll(".pick").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      const side = a.dataset.side || href.replace(".html", "");
      try {
        localStorage.setItem(SIDE_KEY, side);
        // If the guest had the melody playing, the next page carries on with
        // the wedding theme rather than falling silent.
        sessionStorage.setItem("kr-music", audio && audio.isOn() ? "on" : "off");
      } catch {}
      e.preventDefault();
      leaveTo(href, side);
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
