# DEXANGEL — setup & hand-off notes

Everything on this page is a local placeholder so the site works fully offline.
Swap the items below before you publish.

---

## 1. Bracketed links (search for `[` in `index.html`)

| Placeholder | Where it appears | Replace with |
|---|---|---|
| `[STEAM_WISHLIST_URL]` | Hero, nav, final CTA, footer, JSON-LD | Your Steam app/store URL |
| `[YOUTUBE_TRAILER_URL]` | Hero "Watch trailer", trailer poster, footer | Trailer URL (see §3 for embed) |
| `[DISCORD_INVITE]` | Final CTA, footer | Discord invite link |
| `[TWITTER_URL]` | Footer | Twitter/X profile |
| `[PRESS_KIT_URL]` | Final CTA, footer | Press kit (Google Drive, Notion, etc.) |
| `[STUDIO_NAME]` | Footer (3 places) | Your studio name |
| `[CONTACT_EMAIL]` | Footer (`mailto:` + visible text) | `hello@yourstudio.com` |
| `[SITE_URL]` | `canonical`, `og:url` | Production URL (absolute) |
| `[PRIVACY_URL]`, `[TERMS_URL]` | Footer | Privacy / terms pages |

Optional: add `[TWITCH_URL]` / `[TIKTOK_URL]` to the footer list if you use them.

## 2. Images (all under `assets/`)

| File | Role | Recommended final size | Notes |
|---|---|---|---|
| `placeholder-hero.svg` | Hero background | **1920×1080** JPG/WebP (or 3840×2160 for 4K) | Swap the `src` in `.hero__bg`; keep it dark — text sits on top |
| `placeholder-trailer.svg` | Trailer poster | **1920×1080** (16:9) | Match your YouTube thumbnail |
| `screenshot-01…06.svg` | Media grid (6) | **1600×900** (16:9) JPG/WebP | Keep filenames to avoid editing HTML, or update `src` + `data-full` |
| `logo-dexangel.svg` | Footer wordmark | **800×200** SVG, or PNG @ 2× | Vector logo: drop in your own `.svg` |
| `favicon.svg` | Tab icon | 64×64 SVG (+ export `favicon.ico` 32/48, `apple-touch-icon.png` 180) | Add `<link rel="apple-touch-icon">` when ready |
| `og-image.png` | Social card | **1200×630** JPG/PNG (< 300 KB) | Regenerate with `tools/make-og-image.ps1`, or export real key art |
| — | Hero video (optional) | 1920×1080 MP4, H.264, < 8 MB, muted loop | Put a `<video autoplay muted loop playsinline>` inside `.hero__media` instead of the `<img>` |

**Also needed (not files):** trailer URL, Steam wishlist URL, Discord invite.

## 3. Trailer embed

The media section ships as poster + link (fast, works offline). To embed:

1. In `index.html`, find the comment `TRAILER PLACEHOLDER` above `<figure class="trailer">`.
2. Paste the `<iframe>` snippet from that comment (YouTube nocookie embed).
3. Keep `loading="lazy"` so Lighthouse stays high.

## 4. Newsletter / playtest forms (front-end only)

Two forms share the same handler: search `index.html` for `data-signup`
(roadmap card + final CTA band).

- Validation + fake success live in `js/main.js` → section **5. SIGN-UP FORMS**,
  marked `BACKEND HOOK-UP #1 of 2`.
- **Buttondown / Mailchimp / ConvertKit / Brevo:** replace the success block with a
  `fetch()` POST to their API (snippet is in the comment).
- **Netlify:** add `data-netlify="true"` + `name="email"` to each `<form>`, remove
  `novalidate` if you want native validation, and drop the `preventDefault` branch.
- **Formspree / Basin:** change `action="https://formspree.io/f/XXXX" method="POST"`
  and remove the JS override, or keep JS for the styled success message.
- Update `.signup__hint` copy so it stops saying "front-end only".

## 5. Optional hooks already wired

- **Sound toggle** (hero): button flips `aria-pressed` — attach an `<audio>` in the
  `AUDIO HOOK-UP` comment in `js/main.js`. Never autoplay with sound.
- **Dev room:** click the `FL. 13` badge in the nav 5 times.
- **Jump-scare flicker:** click the faint handprint in the hero (once per 30 s,
  visual only, respects `prefers-reduced-motion`).
- Add more Easter eggs inside `<dialog class="devroom">`.

## 6. Deploy

Static site — no build step.

- **Netlify / Vercel:** point at the `dexangel/` folder (publish directory).
- **GitHub Pages:** publish `dexangel/` (paths are relative, so a project sub-path works).
- **itch.io:** zip the folder → "Upload your project"; enable "Play in browser".
  For the itch HTML wrapper, set the start page to `index.html`.

## 7. Accessibility & motion (already handled, keep it that way)

- `prefers-reduced-motion: reduce` disables flicker, grain animation, parallax,
  reveals and the jump-scare flicker (static 900 ms instead).
- Focus states are amber outlines; the panic meter is keyboard-operable
  (arrow keys / Home / End).
- Red is only used for large text, borders and fills — body copy stays bone/ash
  (AA contrast on `#0a0708`).
- If you recolor, keep body text ≥ 4.5:1 and UI/large text ≥ 3:1.
