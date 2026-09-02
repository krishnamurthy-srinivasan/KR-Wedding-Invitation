/* Hand-drawn ornament vocabulary: lotus, jasmine vine, kalasam, temple arch,
   kolam, peacock feather. Stroke-based so they can draw themselves on scroll. */

export const ORN = {
  /* Centred lotus flanked by a jasmine vine — the primary section divider */
  divider: `
<svg class="orn orn--divider" viewBox="0 0 420 44" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path class="d" d="M8 22h118"/>
    <path class="d" d="M294 22h118"/>
    <path class="d" d="M132 22c6-5 12-5 18 0-6 5-12 5-18 0z"/>
    <path class="d" d="M270 22c6-5 12-5 18 0-6 5-12 5-18 0z"/>
    <path class="d" d="M158 22h22"/><path class="d" d="M240 22h22"/>
    <!-- lotus -->
    <path class="d" d="M210 8c-4.5 5.4-6.8 10-6.8 14 0 4 2.6 7.2 6.8 7.2s6.8-3.2 6.8-7.2c0-4-2.3-8.6-6.8-14z"/>
    <path class="d" d="M210 29.2c-5.4 0-10.6-2.4-14.6-6.6 2 6.2 7.6 10.4 14.6 10.4s12.6-4.2 14.6-10.4c-4 4.2-9.2 6.6-14.6 6.6z"/>
    <path class="d" d="M198.4 15.6c-3.4 1.4-6 4-7.4 7.4M221.6 15.6c3.4 1.4 6 4 7.4 7.4"/>
    <circle class="d" cx="186" cy="22" r="2"/><circle class="d" cx="234" cy="22" r="2"/>
  </g>
</svg>`,

  /* Symmetrical flowering vine — drawn across the envelope's top flap */
  vine: `
<svg class="orn orn--vine" viewBox="0 0 200 70" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="0.9" stroke-linecap="round" fill="none">
    <path d="M100 68V22"/>
    <path d="M100 56c-10-2-16-8-18-17 9 1 15 6 18 14M100 56c10-2 16-8 18-17-9 1-15 6-18 14"/>
    <path d="M100 40c-8-1.6-13-6.4-14.6-13.6 7.4.8 12.4 5 14.6 11.4M100 40c8-1.6 13-6.4 14.6-13.6-7.4.8-12.4 5-14.6 11.4"/>
    <circle cx="100" cy="18" r="4.6"/><circle cx="100" cy="18" r="1.6"/>
    <path d="M86 62c-14 0-24-6-28-16 12-1 22 4 27 12M114 62c14 0 24-6 28-16-12-1-22 4-27 12"/>
    <circle cx="60" cy="44" r="3.2"/><circle cx="140" cy="44" r="3.2"/>
    <circle cx="42" cy="52" r="2.2"/><circle cx="158" cy="52" r="2.2"/>
  </g>
</svg>`,

  /* Small lotus bud used as an inline flourish */
  bud: `
<svg class="orn orn--bud" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1" stroke-linecap="round">
    <path class="d" d="M12 4c-3 3.8-4.5 7-4.5 9.6 0 2.7 1.9 4.6 4.5 4.6s4.5-1.9 4.5-4.6C16.5 11 15 7.8 12 4z"/>
    <path class="d" d="M12 18.2c-3.6 0-7-1.6-9.4-4.4M12 18.2c3.6 0 7-1.6 9.4-4.4"/>
  </g>
</svg>`,

  /* Temple arch (gopuram-derived) — frames the blessing & venue */
  arch: `
<svg class="orn orn--arch" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <path class="d" d="M4 196V86C4 40 69 6 150 6s146 34 146 80v110" stroke="currentColor" stroke-width="1"/>
  <path class="d" d="M16 196V88c0-40 60-70 134-70s134 30 134 70v108" stroke="currentColor" stroke-width="0.6" opacity="0.55"/>
</svg>`,

  /* Kolam — 4-fold dot lattice, drawn behind quiet sections */
  kolam: `
<svg class="orn orn--kolam" viewBox="0 0 200 200" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="0.9" stroke-linecap="round">
    <path class="d" d="M100 20c22 22 22 38 0 60s-38 22-60 0 -22-38 0-60 38-22 60 0z"/>
    <path class="d" d="M100 180c-22-22-22-38 0-60s38-22 60 0 22 38 0 60-38 22-60 0z"/>
    <path class="d" d="M20 100c22-22 38-22 60 0s22 38 0 60-38 22-60 0-22-38 0-60z"/>
    <path class="d" d="M180 100c-22 22-38 22-60 0s-22-38 0-60 38-22 60 0 22 38 0 60z"/>
    <circle class="d" cx="100" cy="100" r="7"/>
  </g>
</svg>`,

  /* Corner filigree — mirrored into all four corners of framed blocks */
  corner: `
<svg class="orn orn--corner" viewBox="0 0 88 88" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1" stroke-linecap="round" fill="none">
    <path class="d" d="M2 30V10a8 8 0 018-8h20"/>
    <path class="d" d="M10 42V18a8 8 0 018-8h24" opacity="0.6"/>
    <path class="d" d="M22 22c10-6 20-4 26 4-8 4-16 3-20-1"/>
    <path class="d" d="M22 22c-6 10-4 20 4 26 4-8 3-16-1-20"/>
    <circle class="d" cx="20" cy="20" r="2.4"/>
    <path class="d" d="M52 12c5-3 10-2 13 2-4 2-8 1.5-10-.5"/>
    <path class="d" d="M12 52c-3 5-2 10 2 13 2-4 1.5-8-.5-10"/>
  </g>
</svg>`,

  /* Kalasam (sacred pot with coconut & mango leaves) — muhurtham icon */
  kalasam: `
<svg class="orn-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
    <path class="d" d="M24 6c-3.4 2.6-5 5-5 7.2 0 2.6 2.2 4.2 5 4.2s5-1.6 5-4.2C29 11 27.4 8.6 24 6z"/>
    <path class="d" d="M14 17.4c3.2-2.4 6.4-1.6 8.6 1.6M34 17.4c-3.2-2.4-6.4-1.6-8.6 1.6"/>
    <path class="d" d="M15 20h18l-1.6 3.4H16.6L15 20z"/>
    <path class="d" d="M17 23.6c-3.6 2.8-5.6 6.4-5.6 10.4 0 5 5.4 8.4 12.6 8.4s12.6-3.4 12.6-8.4c0-4-2-7.6-5.6-10.4"/>
    <path class="d" d="M13 33.6h22" opacity="0.5"/>
  </g>
</svg>`,

  /* Garland (reception) */
  garland: `
<svg class="orn-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1.15" stroke-linecap="round">
    <path class="d" d="M8 10c0 16 7.2 27 16 27s16-11 16-27"/>
    <circle class="d" cx="8" cy="10" r="2.4"/><circle class="d" cx="40" cy="10" r="2.4"/>
    <circle class="d" cx="10.6" cy="20" r="2"/><circle class="d" cx="37.4" cy="20" r="2"/>
    <circle class="d" cx="15.4" cy="29" r="2"/><circle class="d" cx="32.6" cy="29" r="2"/>
    <circle class="d" cx="24" cy="35.4" r="2.4"/>
    <path class="d" d="M24 37.8v5" /><circle class="d" cx="24" cy="44" r="1.6"/>
  </g>
</svg>`,

  /* Kuthuvilakku (standing oil lamp) — reception / evening events */
  lamp: `
<svg class="orn-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
    <path class="d" d="M24 4c-2 2.6-3 4.6-3 6.2 0 1.9 1.3 3.2 3 3.2s3-1.3 3-3.2C27 8.6 26 6.6 24 4z"/>
    <path class="d" d="M15 16h18l-2.4 4H17.4L15 16z"/>
    <path class="d" d="M24 20v14"/>
    <path class="d" d="M19 27h10" opacity="0.6"/>
    <path class="d" d="M13 42c0-4.4 5-7.6 11-7.6S35 37.6 35 42H13z"/>
    <path class="d" d="M9 44h30" />
  </g>
</svg>`,

  /* Banana / betel leaf (dinner) */
  leaf: `
<svg class="orn-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
    <path class="d" d="M24 5c-9 7-13.4 14-13.4 21 0 8 5.8 13.4 13.4 13.4S37.4 34 37.4 26c0-7-4.4-14-13.4-21z"/>
    <path class="d" d="M24 39.4V13" opacity="0.7"/>
    <path class="d" d="M24 20l-7 5M24 20l7 5M24 28l-6 4.4M24 28l6 4.4" opacity="0.45"/>
    <path class="d" d="M24 39.4V44"/>
  </g>
</svg>`,

  /* Peacock feather — drifts in the ambient layer */
  feather: `
<svg class="orn-feather" viewBox="0 0 40 96" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="0.9" stroke-linecap="round" fill="none">
    <path d="M20 96V38"/>
    <path d="M20 38c-11 0-17-8-17-17S9 3 20 3s17 9 17 18-6 17-17 17z"/>
    <path d="M20 31c-6.4 0-10-4.4-10-9.6S13.6 12 20 12s10 4.2 10 9.4S26.4 31 20 31z"/>
    <circle cx="20" cy="21.4" r="4"/>
    <path d="M20 60c-5-3-8-7-9-12M20 72c5-3 8-7 9-12" opacity="0.5"/>
  </g>
</svg>`,
};

/** Insert the four mirrored corner filigrees into a framed element. */
export function mountCorners(el) {
  ["tl", "tr", "bl", "br"].forEach((pos) => {
    const w = document.createElement("span");
    w.className = `corner corner--${pos}`;
    w.setAttribute("aria-hidden", "true");
    w.innerHTML = ORN.corner;
    el.appendChild(w);
  });
}
