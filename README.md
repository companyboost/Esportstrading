# Esports Trading

Static marketing site for esportstrading.com. Plain HTML, CSS and JavaScript, no build step.

- `index.html` main landing page
- `blog/` news index and articles
- `css/style.css` design tokens and all styles
- `js/main.js` interactions, `js/arena.js` Three.js hero layer
- `assets/` logo, partner logos and photography (WebP with JPG fallbacks for social previews)
- `hero-options.html`, `eco-options.html` design option boards (excluded from search engines)

Run locally with any static server, for example:

```bash
python3 -m http.server 8765
```

Deploys on Vercel as a static site (see `vercel.json`). Newsletter form posts JSON to the `action` URL set on the form in `index.html`.
