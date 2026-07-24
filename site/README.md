# BurkeBuild.com - website (v2 design)

Static site: no build step, no dependencies. Upload the contents of this `site/`
folder to any web host and it works. Deployed via Vercel from the repo root
(`vercel.json` points at this folder).

To preview locally: `npx serve site` from the project root.

## v2 notes (July 2026)

The design was rebuilt from Jamie's Claude-designed export ("Website design
improvement.zip" at the repo root). During integration these were restored on
top of the export: working mailto form submission, the photo lightbox, mobile
menu accessibility (aria-expanded + Escape), clean URLs (no .html) and the
no-em-dash copy rule.

**Part M / accessibility works were removed deliberately** with this redesign -
service card, section, case study, photos and FAQ entry are all gone. The
Part M photos survive in git history and as originals in the repo root.

## Contact details

Mobile (+353) 86 843 6710 and info@burkebuild.com, shown site-wide.
The 051 landline was removed at Jamie's request.

## Still to do (needs a human)

- Point burkebuild.com DNS at Vercel (site currently at burkebuild.vercel.app).
- Confirm the 086 number is on WhatsApp (contact card links to wa.me).
- Contact form opens the visitor's email app (mailto). For a real inbox form,
  add a Formspree/similar `action` and swap the handler in `js/main.js`.
- Original high-res photos from the old jobs - current images are low-res
  rips from the old Wix site.
- Credentials (CIF membership, insurance specifics) if worth naming.
- Case-study copy (`projects/*.html`) describes what's visible in the photos -
  worth a fact-check.

## Structure

- `index.html` - single-page site (hero, services track, projects, about,
  process track, contact + form, FAQ)
- `projects/` - two case-study pages
- `css/styles.css`, `js/main.js` - all styling and vanilla-JS interactions
  (tilt cards, magnetic buttons, drag tracks, filters, lightbox, form)
- `assets/` - images (.jpg in use; matching .avif kept for a future
  performance pass), logos, favicons
