# BurkeBuild.com - website

Static site: no build step, no dependencies. Upload the contents of this `site/`
folder to any web host (Netlify, Vercel, cPanel, GitHub Pages, etc.) and it works.

To preview locally: `npx serve site` from the project root, or just open `index.html`.

## Contact details

Real details (mobile 086 843 6710, office 051 572 101, info@burkebuild.com,
Waterford / South-East) are in place, taken from the previous burkebuild.com site -
double-check they're still current.

Also worth reviewing:
- The contact form opens the visitor's email app (mailto). For a proper inbox
  form, connect a form service (e.g. Formspree/Netlify Forms) by giving the
  `<form>` an `action` and removing the mailto handler in `js/main.js`.
- Claims in the copy ("fully insured", grant scheme support, etc.) - confirm
  wording is accurate for the business.
- Project titles/categories in the gallery are my best read of the photos -
  rename to the real jobs.
- **WhatsApp**: the contact section and footer link to wa.me/353868436710 -
  confirm the 086 number actually has WhatsApp, otherwise remove those links.
- **Facebook / LinkedIn**: icon buttons are ready in the `index.html` footer,
  commented out with `YOUR-PAGE` placeholder URLs - paste the real page
  addresses and uncomment (the case-study pages can get the same block).
- **Case studies** (`projects/*.html`): the copy describes what's visible in
  the photos. Review it, and add real details (location, timeframe, more
  photos) when available.
- **Credentials**: if BurkeBuild has CIF membership, named insurance cover or
  certs, they should be added to the About section - kept generic for now.

## Before/after slider

A drag-to-compare slider component is built in (`.ba` styles in the CSS,
auto-wired in `js/main.js`). A ready-made commented-out example sits in
`projects/part-m-home-adaptation.html` - to use it: drop a "before" photo
into `assets/` (e.g. `partm-ramp-before.jpg`), uncomment the block, point
the two `<img>` tags at the before/after files. Works anywhere on any page.

## Structure

- `index.html` - the whole site (single page)
- `css/styles.css` - styling; brand colours are CSS variables at the top
- `js/main.js` - mobile menu, scroll reveal, gallery filter, lightbox, form
- `assets/` - photos in AVIF with JPEG fallbacks, logo, favicon
