# Modern Portfolio — Narender Gaur

Static site (plain HTML/CSS/JS, no build step) built from resume content.

## Files
- `index.html` — all sections (hero, stack, experience, achievements, contact)
- `style.css` — design system
- `script.js` — scroll-reveal for the stack diagram
- `Narender_Gaur_Resume.pdf` — linked from the "Download résumé" button

## Push to your existing repo

Open a terminal on your own machine (not this sandbox) with these 4 files in a folder, then:

```bash
git clone https://github.com/gaurnarender89/Modern-Portfolio-Website.git
cp index.html style.css script.js Narender_Gaur_Resume.pdf Modern-Portfolio-Website/
cd Modern-Portfolio-Website
git add .
git commit -m "Add modern portfolio site"
git push origin main
```

(If your default branch is `master` instead of `main`, use that in the push command.)

## Make it live with GitHub Pages

1. Go to `https://github.com/gaurnarender89/Modern-Portfolio-Website`
2. **Settings** → **Pages** (left sidebar)
3. Under "Build and deployment" → Source: **Deploy from a branch**
4. Branch: **main** (or `master`), folder: **/ (root)** → **Save**
5. Wait ~1 minute, then your site is live at:
   `https://gaurnarender89.github.io/Modern-Portfolio-Website/`

No build tools, no Node install needed — it's plain HTML/CSS/JS so GitHub Pages serves it as-is.
