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

## Structure

- `index.html` - the whole site (single page)
- `css/styles.css` - styling; brand colours are CSS variables at the top
- `js/main.js` - mobile menu, scroll reveal, gallery filter, lightbox, form
- `assets/` - photos in AVIF with JPEG fallbacks, logo, favicon
