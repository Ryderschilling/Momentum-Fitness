# Momentum Fitness | 30A CrossFit: Build Notes

**v3 revamp, 2026-09-30.** Real photography, real pricing, in-site PushPress checkout, Resend contact form, GTM-ready tracking, full SEO kit. Static HTML/CSS/JS on Vercel with one serverless function. No build step.

## Launch checklist (in order)

1. **Vercel env var:** `RESEND_API_KEY` (required). Optional: `CONTACT_TO` (defaults to `info@momentum.fit`), `CONTACT_FROM` (defaults to `Momentum Fitness Website <leads@ryderschilling.com>`, must be a Resend-verified domain).
2. **Test the form on the preview URL.** Submit once, confirm it lands in info@momentum.fit.
3. **GTM:** create the container, paste the ID into `js/tag.js` (`window.MF_GTM_ID = 'GTM-XXXX'`). In GTM add the GA4 config tag plus event tags for `checkout_open`, `trial_click`, `generate_lead`, `phone_click`, `email_click` (every button already pushes these).
4. **Test checkout on an iPhone.** Open a plan in the drawer and get to the email step. If Safari ever misbehaves inside the drawer, the "Open in a new tab" link is always visible.
5. **DNS at GoDaddy** (John's account): point `30acrossfit.com` and `momentum.fit` to Vercel. Canonical domain is **30acrossfit.com** (keeps the old site's Google history and matches the GBP link). Make momentum.fit redirect to it.
6. Search Console: add the domain property, submit `/sitemap.xml`. Old Squarespace URLs are 301'd in `vercel.json`.
7. Switch `CONTACT_FROM` to an @momentum.fit address once momentum.fit is verified in Resend.
8. Cancel Squarespace only after the new site is live on the domain.

## Where things live

| Thing | File |
|---|---|
| Every PushPress link + price shown in the checkout drawer | `js/main.js` → `PLANS` |
| Prices shown on the cards | `memberships.html`, `drop-in.html`, `index.html` (doors) |
| GTM container ID + event list | `js/tag.js` |
| Contact form email (Resend) | `api/contact.js` |
| Redirects, clean URLs, cache headers | `vercel.json` |
| SEO | `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD graph in every page head |
| Photos (webp, 700/1200/2000 widths) | `img/p/` |

A `data-plan="<key>"` attribute on any link opens that plan in the checkout drawer. With JS off it's a plain link to PushPress.

## Photos

All from the gym's own Squarespace site (their content). Swap any file in `img/p/` with the same name to replace it.

**Still needed from Jordan:** coach photos for **Ben, Brooklyne, Lyla** (cards show a gradient "photo coming soon" tile) and one line per coach. **Confirm `coach-michael.webp` is the right Michael** (old site labeled it "Michael S"). John's photo is small (457px), a better one would help.

## Copy

Class descriptions, drop-in rules, Jordan's and John's quotes, and the mission line are the gym's own words from their current site. Reviews are real Google reviews, never invent them.

## Motion (all native, no GSAP)

- Home hero: sticky photo that shrinks into a rounded frame as you scroll (`--p` progress var).
- Best Hour: copy scrolls past a sticky photo card, frames wipe in, timeline fills.
- Crew wall: three photo columns at different scroll speeds.
- Doors: stacking sticky cards. About: horizontal facility rail driven by vertical scroll.
- Page transitions: brand-gradient curtain. Lenis smooth scroll on desktop pointer only.
- `prefers-reduced-motion`: everything static and visible.

⚠️ Never put `overflow: hidden` on body or a section ancestor of a sticky element. The build uses `overflow-x: clip`.

## Verified 2026-09-30

axe-core (WCAG 2.2 AA + best practice): 0 violations on all 6 pages at 1440 and 390. No horizontal scroll at 390. Checkout drawer: opens live PushPress, Escape closes, focus returns to the button. Form: validation, error fallback, success path, dataLayer event. API: 405/400/honeypot/success/Resend-failure paths.
