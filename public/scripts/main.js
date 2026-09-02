import { WEDDING } from "./wedding-data.js?v=9d18bcc2";
import { ORN, mountCorners } from "./ornaments.js?v=f828ce9b";
import { initReveals, prepareDrawings, initParallax, initAmbient } from "./motion.js?v=f977ae37";
import { initCountdown } from "./countdown.js?v=1f1955cd";
import { initLightbox } from "./lightbox.js?v=010ac977";
import { initNav, initOverture } from "./nav.js?v=b9be22ac";
import { initAudio } from "./audio.js?v=3e648893";
import { initScratch } from "./scratch.js?v=d59d69f4";
import { initGopuram } from "./gopuram.js?v=3fce13d0";
import { burst } from "./confetti.js?v=2b8b70a9";
import { initTheme } from "./theme.js?v=5dc7a2b3";

/* ---------- Fill in ornament placeholders ---------- */
function mountOrnaments() {
  document.querySelectorAll("[data-orn]").forEach((slot) => {
    const key = slot.dataset.orn;
    if (ORN[key]) slot.innerHTML = ORN[key];
  });
  document.querySelectorAll("[data-corners]").forEach(mountCorners);
}

/* ---------- Events timeline ---------- */
function buildEvents() {
  const host = document.querySelector(".events__list");
  if (!host) return;

  host.innerHTML = WEDDING.events
    .map(
      (day, di) => `
    <article class="day" data-reveal style="--delay:${di * 120}ms">
      <header class="day__when">
        <p class="day__weekday">${day.day}</p>
        <h3 class="day__date">${day.date}</h3>
        <p class="day__num">${day.dateShort}</p>
      </header>
      <div class="day__events">
        ${day.items
          .map(
            (ev) => `
          <div class="event">
            <span class="event__icon draw" aria-hidden="true">${ORN[ev.icon] || ORN.bud}</span>
            <div>
              <h4 class="event__name">${ev.name}</h4>
              <p class="event__time">${ev.time}</p>
              ${ev.note ? `<p class="event__note">${ev.note}</p>` : ""}
            </div>
          </div>`
          )
          .join("")}
      </div>
    </article>`
    )
    .join("");
}

/* ---------- Gallery: scrapbook ----------
   Photographs are pinned at deliberate angles like a keepsake album.
   The tilts/offsets are authored per-slot (not random) so the composition
   is the same every visit and can be tuned by eye. */
const SCRAP = [
  { rot: -2.4, tape: "tl", lift: 0    },
  { rot:  1.6, tape: "tr", lift: 3.5  },
  { rot:  2.6, tape: "tl", lift: -2   },
  { rot: -1.8, tape: "tr", lift: 4.5  },
  { rot:  1.9, tape: "tl", lift: 1    },
  { rot: -2.8, tape: "tr", lift: -3   },
];

function buildGallery() {
  const grid = document.querySelector(".gallery__grid");
  if (!grid) return;
  const slots = ["a", "b", "c", "d", "e", "f"];

  grid.innerHTML = WEDDING.gallery
    .map((shot, i) => {
      const s = SCRAP[i % SCRAP.length];
      return `
    <figure class="shot shot--${slots[i % slots.length]}" data-reveal
            style="--rot:${s.rot}deg; --lift:${s.lift}%; --delay:${(i % 3) * 120}ms">
      <span class="shot__tape shot__tape--${s.tape}" aria-hidden="true"></span>
      <button type="button" data-lb aria-label="View larger: ${shot.alt}">
        <img src="${shot.src}" width="${shot.w}" height="${shot.h}" alt="${shot.alt}"
             loading="lazy" decoding="async" sizes="(max-width: 899px) 88vw, 34vw">
      </button>
    </figure>`;
    })
    .join("");
}

/* ---------- Venue links ---------- */
function wireVenue() {
  const q = encodeURIComponent(WEDDING.venue.mapsQuery);
  document.querySelectorAll("[data-maps]").forEach((a) => {
    a.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  });
}

/* ---------- Boot ---------- */
function boot() {
  initTheme();
  mountOrnaments();
  buildEvents();
  buildGallery();
  wireVenue();

  // The gate already took the user's gesture. If they had music on there,
  // resume() carries it into this page; otherwise the control just appears.
  initAudio()?.resume();
  initNav();

  prepareDrawings();
  initReveals();
  initParallax();
  initAmbient();

  initCountdown(document.querySelector(".countdown"), WEDDING.date.muhurthamStartISO);
  initLightbox(document.querySelector(".gallery"));
  const scratchCard = document.querySelector(".scratch-card");
  initScratch(scratchCard);
  scratchCard?.addEventListener("scratch:done", () => {
    const card = scratchCard.querySelector(".scratch");
    if (card) burst(card);
  });
  initGopuram(document.querySelector(".gopuram"));

  document.documentElement.classList.add("is-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
