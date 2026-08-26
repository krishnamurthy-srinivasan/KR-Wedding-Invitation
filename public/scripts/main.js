import { WEDDING } from "./wedding-data.js";
import { ORN, mountCorners } from "./ornaments.js";
import { initReveals, prepareDrawings, initParallax, initAmbient } from "./motion.js";
import { initCountdown } from "./countdown.js";
import { initLightbox } from "./lightbox.js";
import { initNav, initOverture } from "./nav.js";

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

/* ---------- Gallery ---------- */
function buildGallery() {
  const grid = document.querySelector(".gallery__grid");
  if (!grid) return;
  const slots = ["a", "b", "c", "d", "e", "f"];

  grid.innerHTML = WEDDING.gallery
    .map(
      (shot, i) => `
    <figure class="shot shot--${slots[i % slots.length]}" data-reveal style="--delay:${(i % 3) * 110}ms">
      <button type="button" data-lb aria-label="View larger: ${shot.alt}">
        <img src="${shot.src}" width="${shot.w}" height="${shot.h}" alt="${shot.alt}"
             loading="lazy" decoding="async" sizes="(max-width: 899px) 50vw, 33vw">
      </button>
    </figure>`
    )
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
  mountOrnaments();
  buildEvents();
  buildGallery();
  wireVenue();

  initOverture();
  initNav();

  prepareDrawings();
  initReveals();
  initParallax();
  initAmbient();

  initCountdown(document.querySelector(".countdown"), WEDDING.date.muhurthamStartISO);
  initLightbox(document.querySelector(".gallery"));

  document.documentElement.classList.add("is-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
