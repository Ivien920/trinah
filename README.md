# Trinah's UACE Good-Luck Surprise ❤️

A static website (HTML + CSS + vanilla JS). No build step, no database, no login.

## 1. Add her photos and videos (the only thing you need to edit)

1. Put photos in `assets/images/` and videos in `assets/videos/`.
2. Open `assets/media.js` and list them (examples are already in there, commented out).
   - The order of the list = the order on the site. Delete a line to remove one; move a line to rearrange.
   - Photo options: `caption`, `focus` (e.g. `"50% 20%"` keeps faces from being cropped), `fit: "contain"` (show a wide photo whole).
   - Video options: `poster` (thumbnail image) and `caption`.
3. If a list is empty, that whole section stays hidden, so nothing looks broken.

**Tips for speed on phones:** resize photos to about 1200px wide (JPG), and keep videos MP4 (H.264) and under ~20 MB each. iPhone videos (.mov) usually need converting to MP4 first.

## 2. Set the exam time

In `assets/media.js`, change `examStart` (Uganda time, +03:00). It is preset to **Monday 9 November 2026, 08:00**. Set it to her real first paper time, e.g. `"2026-11-09T09:00:00+03:00"`. Once that moment passes, the countdown automatically switches to *THE JOURNEY HAS BEGUN. GIVE IT YOUR BEST! ❤️*

## 3. Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000. (Photos work when opening the file directly; videos are most reliable through a server.)

## 4. Put it online (free, shareable link)

- **Netlify Drop** (easiest): go to https://app.netlify.com/drop and drag this whole folder in. You get a public link in seconds.
- **GitHub Pages / Cloudflare Pages / Vercel**: upload the folder as a static site.

The page has `noindex` set, so search engines won't list it. Only people with the link will find it.

## Files

```
index.html        page structure and text
css/style.css     all styling
js/app.js         all behaviour (sliders, animations, countdown)
assets/media.js   YOUR photo / video / exam-time list
assets/images/    put photos here
assets/videos/    put videos here
```
