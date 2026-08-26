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

`vibe-match-assets/` (the design references) is git-ignored — it is ~32 MB of
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

## Design system

Derived from `vibe-match-assets/` — the couple's own invitation references.

- **Ground** aged parchment `#f6efe1`, deep crimson-black `#2a1410` for sacred sections
- **Accent** kumkum crimson `#8e1717`
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
