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

## Editing content

All wording, dates, names, events and photos live in
`public/scripts/wedding-data.js` and `public/index.html`.
Text is taken verbatim from `assets/patrika.md`.

## Interactions

| Where | What |
|---|---|
| Opening | A sealed purple envelope. Pressing the gold wax seal unfolds all four flaps, lifts the invitation card out, and starts the music. Skipped for returning visitors in the same session and for reduced-motion. |
| Music | `public/audio/theme.mp3`. **Never autoplays.** Starts only from the seal press, fades 0 → 0.34 over ~5s so it arrives under the reveal. Persistent mute button, bottom-right. Ducks to silence when the tab is hidden. |
| Srirangam | The Rajagopuram gets a scroll-linked cinematic push-in (scale 1.28 → 1.02, always ≥ 1 so no edges show). Placed here because the groom's lineage in the Patrika is ஸ்ரீரங்கம். |
| Save the Date | A real canvas gold-foil scratch card. Clears itself past ~55%. A "Reveal instead" button gives the same result for keyboard/AT users, and the text underneath is always real DOM. |
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
