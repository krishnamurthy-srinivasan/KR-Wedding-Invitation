# Krishnamurthy & Roshini — Wedding Invitation

A single-page digital wedding invitation. **Friday, 30 October 2026**, Chennai.

## Deploy to Vercel

The site is static — **there is no build step**.

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. In the settings, set **Root Directory** to `public`.
   Leave Framework Preset as **Other**, and leave Build Command / Install
   Command **empty**.
4. Deploy.

### After the first deploy — one thing to check

The Open Graph tags in `public/index.html` currently point at:

```
https://krishnamurthy-roshini.vercel.app
```

WhatsApp requires an **absolute** URL for the preview image, so if Vercel gives
you a different domain, update the four URLs near the top of
`public/index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`) to match.
You can also just rename the Vercel project to `krishnamurthy-roshini` so the
existing URLs are correct.

Then test the preview at
[developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
before sharing the link.

## Run it locally

The site is a static site with no build step and no dependencies:

```bash
cd public
python3 -m http.server 4321
# open http://localhost:4321
```

To deploy, upload the contents of `public/` to any static host
(Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages).

> Note: Next.js/React were not used because the npm registry was unreachable
> from this machine. A hand-built static site was the better trade here anyway —
> it loads instantly over mobile data from a WhatsApp link, which is how most
> guests will open it, and it needs no build step on Vercel.

`vibe-match-assets/` and `example-pages/` (the design references) are git-ignored — it is ~32 MB of
source inspiration that never gets served. It stays on your machine.

## Structure

```
public/
  index.html            all sections, semantic markup
  styles/
    tokens.css          colour, type scale, spacing, motion tokens
    main.css            reset, layout, ornament + reveal primitives
    sections.css        per-section styling
  scripts/
    wedding-data.js     single source of truth for all wedding content
    ornaments.js        hand-drawn SVG motif library (lotus, kalasam, kolam…)
    motion.js           scroll reveals, self-drawing ornaments, parallax, petals
    countdown.js        live countdown to the muhurtham
    lightbox.js         accessible gallery viewer
    nav.js              nav reveal, scroll-spy, mobile sheet, overture
  photos/               photography + generated venue QR
  patrika/patrika.pdf   the printed invitation
  og-image.jpg          1200x630 WhatsApp/social preview
```

### Handy URL flags

- `?open=1` skips the envelope and lands straight on the invitation.
  Useful for testing, or for sharing a direct link to a section.

## After editing CSS or JS: re-stamp

Every local stylesheet and script is referenced with a content hash
(`main.css?v=f5b06295`) so a browser can never serve a stale mix of old and
new files. Inner ES-module imports and the CSS `@import` are stamped too.

**Run this after any change to `public/styles/` or `public/scripts/`:**

```bash
python3 build-cachebust.py
```

Forgetting it means returning visitors may keep the previous version until
they hard-reload.

## Editing content

All wording, dates, names, events and photos live in
`public/scripts/wedding-data.js` and `public/index.html`.
Text is taken verbatim from `assets/patrika.md`.

## Two editions

Each family printed its own Patrika, and the two differ, so each side gets its
own invitation rather than a compromise between them.

| | Groom's edition | Bride's edition |
|---|---|---|
| Page | `groom.html` | `bride.html` |
| Theme | Royal purple | Sky blue (deep sky blue in dark) |
| Names | Krishnamurthy first | Roshini first |
| Muhurtham | 5:30 – 7:20 a.m. | **6:00 – 7:20 a.m.** |
| Reception | 6:00 p.m. | 6:30 p.m. |
| Also | — | Viratham 7:30 a.m., Nichayathartham 10:30 a.m. |
| Tradition | Sri Kalyana Venkataramana, Uttaradi Matha | Sri Maha Ganapathi, Kanchi Kamakoti Peetam |
| Hosts | Kousalya & Gopinathan | Gayathri & Ravishankar |
| Patrika | `patrika/patrika.pdf` | `patrika/patrika-bride.pdf` |

**The timings genuinely differ between the two printed cards.** Neither is a
typo on our side: each edition reproduces its own family's card. If the
families later agree one is wrong, fix it in
`scripts/wedding-data.js` (groom) or `scripts/wedding-data-bride.js` (bride),
and in the corresponding `*.html`.

`index.html` is the gate: the sealed envelope, then the bride/groom chooser
over the Radha-Krishna artwork. The chosen side is remembered in
`localStorage`, so a returning guest goes straight to their own invitation.
`index.html?choose=1` forces the chooser again, and every footer has a
"Change side" link.

## Interactions

| Where | What |
|---|---|
| Theme | Dark / light toggle, bottom-right. **Dark is the default.** In dark mode the ivory bands become light royal purple. Applied by an inline script before first paint, so there is no flash; the choice is remembered in `localStorage`. |
| Opening | A sealed envelope on `index.html`. Pressing the gold wax seal unfolds all four flaps, starts the music, and reveals the side chooser. Skipped for returning visitors in the same session and for reduced-motion. |
| Music | `public/audio/theme.mp3`. **Never autoplays.** Starts only from the seal press, fades 0 → 0.34 over ~5s so it arrives under the reveal. Persistent mute button, bottom-right. Ducks to silence when the tab is hidden. |
| Srirangam | The Rajagopuram eases OUT as you scroll (scale 1.34 → 1.00) via a native CSS `animation-timeline: view()`, with a rAF fallback. Placed here because the groom's lineage in the Patrika is ஸ்ரீரங்கம். |
| Save the Date | A real canvas gold-foil scratch card. Clears itself past ~55%. A "Reveal instead" button gives the same result for keyboard/AT users, and the text underneath is always real DOM. |
| Celebration | Clearing the scratch card fires a full-viewport celebration: two corner cannons, a shower from above, and a burst from the card. 200 particles over ~5s, then the layer removes itself. |
| Background | Five ambient layers: drifting aurora fields, slowly rotating kolam geometry, a twinkling starfield (dark mode), rising diya embers, and falling jasmine. All pure CSS animation. Density scales to the device; skipped under reduced motion and paused when the tab is hidden. |
| Gallery | Scrapbook layout — photos on white mounts, tilted at authored angles with washi tape. Tilts are fixed per slot, not random, so the composition is identical every visit. |

## Design system

Derived from `vibe-match-assets/` — the couple's own invitation references.

- **Ground** warm ivory `#f7f2ea`, royal purple `#2b1145` for the cinematic sections
- **Accent** royal purple `#6d2c91`, kumkum-rose `#8e1749`
- **Metal** antique/temple brass `#a8823c` (never a bright yellow gold)
- **Type** Cormorant Garamond (display) · Marcellus (body) · Jost (eyebrows)
  · Noto Serif Tamil / Devanagari, each with local macOS fallbacks
- **Motifs** lotus, jasmine vine, kalasam, temple arch, kolam, corner filigree —
  all hand-drawn SVG that draws itself on scroll

## Accessibility & performance

- Full `prefers-reduced-motion` support (overture skipped, petals off,
  all content rendered statically)
- Keyboard-accessible lightbox with focus trap, arrow keys and Escape
- Semantic landmarks, skip link, labelled controls, alt text,
  decorative SVG hidden from assistive tech
- Every image carries intrinsic `width`/`height` (no layout shift);
  below-the-fold images lazy-load; fonts load non-blocking
