# Momentum Fitness | 30A CrossFit — Build Notes

**Hero + Google data 2026-08-13 (round 2):** the home hero is now the real crew photo pulled from their live Squarespace site (`img/hero.webp`). ⚠️ That file is only 1440x1083, the largest Squarespace will serve. Get the untouched original off Jordan's phone before launch. The reviews section now carries three REAL Google reviews from the live Business Profile, plus the real 4.7 / 44 headline linked to the profile. `index.html` also has canonical, OG tags and LocalBusiness JSON-LD with the real rating, address, phone and hours. The other four pages still need that block.

**Restyle 2026-08-13:** white/paper theme with the logo's sunset colors as accents. Type is now **Big Shoulders Display** (headlines, uppercase) + **Public Sans** (body), self-hosted in `fonts/`. The old `bricolage.woff2` and `archivo*.woff2` files are unused and can be deleted. Home hero and the feature splits are now real two-column splits instead of full-bleed photos with a dark scrim.

Mockup build, 2026-08-10. Static HTML/CSS/JS, self-hosted fonts (Bricolage Grotesque + Archivo), GSAP + ScrollTrigger, Lenis on desktop only. All integrations are honest previews until wired (see below). `tel:` and `sms:` links are live.

## Photo shot list for Jordan (17 shots)

Every photo slot on the site is labeled with a chip ("Photo 01" etc). Replace the matching `.ph` block with a real `<img>`.

| # | Shot | Where it goes |
|---|------|---------------|
| 01 | ~~Wide shot of the gym floor mid-class~~ **FILLED** with the crew photo from their old site. Still want the full-res original from Jordan. | Home hero |
| 02 | Coach at the whiteboard, class gathered around | Home, "Best Hour" :00 |
| 03 | Warm-up: rowers, bikes, people laughing | Home, "Best Hour" :10 |
| 04 | Barbell work, coach correcting someone's form | Home, "Best Hour" :25 |
| 05 | The WOD at peak effort, big energy | Home, "Best Hour" :40 |
| 06 | High fives / fist bumps right after class | Home, "Best Hour" :55 |
| 07 | Jordan, candid coaching shot (portrait) | Coaches strip |
| 08 | John, candid coaching shot (portrait) | Coaches strip |
| 09 | Michael S (portrait) | Coaches strip |
| 10 | Robby (portrait) | Coaches strip |
| 11 | Emily (portrait) | Coaches strip |
| 12 | Dan (portrait) | Coaches strip |
| 13 | CJ (portrait) | Coaches strip |
| 14 | Michael K (portrait) | Coaches strip |
| 15 | A first-timer mid-class with a coach beside them | Memberships, free trial banner (landscape) |
| 16 | Drop-in visitors post-class, sweaty and smiling | Drop-In page banner (landscape) |
| 17 | The empty facility, wide: rig, barbells, rowers, open floor | About, facility banner (landscape) |


**Logo: done.** The real logo is in place, `img/logo.webp` (dark wordmark, for light backgrounds) and `img/logo-light.webp` (bone wordmark, for the dark footer). Both were derived from `Momentum-Fitness-Logo-Color.webp`. `img/wave.svg` is now only used as the favicon.

## ⚠️ ScrollTrigger gotcha, do not undo

The hour section pins, which adds 2600px of spacer. Any trigger created before it in `main.js` measures 2600px too high, and `ScrollTrigger.refresh()` will not fix it because the refresh order is the problem. `#hourStage` carries `refreshPriority: 10` so it is always measured first. There is also a `ScrollTrigger.refresh()` on window load, on fonts ready, and on debounced resize, because positions are otherwise measured before webfonts settle.

## Every missing number and link

1. **Membership prices (3)** — `memberships.html`, each card has a `PRICE TBD` comment. Do not guess.
2. **Drop-in price** — `drop-in.html`, hero, `PRICE TBD` comment.
3. **PushPress URLs (5)** — `js/main.js`, the `INTEGRATIONS.pushpress` object: trial, dropin, membership-unlimited, membership-3x, punchcard. Paste each checkout/registration URL, one line each.
4. **Contact form endpoint** — `js/main.js`, `INTEGRATIONS.form` (Formspree or similar). Until set, submits show an honest preview notice.
5. **Class schedule link** — home page "See the class schedule" button currently routes through the trial preview. Point it at the live PushPress schedule when connected (`CLASS TIMES TBD` comment in `index.html`).
6. ~~3 real Google reviews~~ **DONE.** Three real ones are live on the home page, pulled from the Google Business Profile 2026-08-13. Never swap them for invented copy.
7. **Confirm with Jordan**: exact drop-in booking lead time (site says "book the night before"), punch card class count (site assumes 10), and whether the free trial is truly any class.

## How the integration previews work

Every PushPress button and the contact form are fully styled, real UI. While their `INTEGRATIONS` value is `null`, clicking shows an inline notice: "Booking isn't connected yet. This is a design preview." No `alert()`, no fake success. Paste the real URL and the same button opens live checkout: one line per service.
