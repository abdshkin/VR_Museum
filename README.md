# Қазақ Суретшілері — Virtual Museum Prototype

A mobile-first virtual museum of Kazakh artists with a gyroscope 3D room viewer.  
**GitHub Pages ready — no server, no build step.**

---

## 📁 Folder Structure

```
museum/
├── index.html                        ← Entry point (all semantic HTML)
├── css/
│   └── main.css                      ← All styles (mobile-first, edit design tokens at top)
├── js/
│   └── app.js                        ← All JS logic (ES6, no bundler needed)
├── data/
│   └── artists.json                  ← ✏️ EDIT THIS to add/change artists & bios
├── assets/
│   ├── images/
│   │   ├── thumbs/                   ← Portrait photos (600×800px JPG)
│   │   │   └── {artist_id}_thumb.jpg
│   │   └── infographics/             ← Room wall images per language (1200×800px JPG)
│   │       └── {artist_id}_{lang}.jpg
│   └── models/
│       └── room_base.glb             ← Optional custom room model (see note inside)
├── generate_placeholders.py          ← Run once to generate test images (needs Pillow)
└── README.md
```

---

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `kazakh-museum`)
2. Upload this entire `museum/` folder as the repo root
3. Go to **Settings → Pages → Source: main branch / root**
4. Your site is live at `https://yourusername.github.io/kazakh-museum/`

---

## ✏️ Customization Guide

### Add or edit an artist
Edit `data/artists.json` — each artist object:

```json
{
  "id": "your_artist_id",         ← used for image filenames
  "name": {
    "kz": "Аты қазақша",
    "ru": "Имя по-русски",
    "en": "Name in English"
  },
  "years": "1900 – 1980",
  "bio": {
    "kz": "Биография на казахском...",
    "ru": "Биография на русском...",
    "en": "Bio in English..."
  },
  "thumb":  "assets/images/thumbs/your_artist_id_thumb.jpg",
  "color":  "#c4843a",            ← accent color for 3D room + placeholder
  "infographic": {
    "kz": "assets/images/infographics/your_artist_id_kz.jpg",
    "ru": "assets/images/infographics/your_artist_id_ru.jpg",
    "en": "assets/images/infographics/your_artist_id_en.jpg"
  }
}
```

Then add matching image files.

### Add a language
1. In `index.html` add: `<button class="lang-btn" data-lang="de">DE</button>`
2. In `js/app.js` → `LANG` object, add a `"de": { ... }` block
3. In `data/artists.json`, add `"de"` keys to each artist's `name`, `bio`, `infographic`

### Change colors / fonts
Edit CSS variables at the top of `css/main.css`:

```css
:root {
  --gold:   #d4a853;   /* main accent */
  --bg:     #0f0d0a;   /* background  */
  --cream:  #f5ede0;   /* text        */
  --accent: #c4843a;   /* buttons     */
  /* ... */
}
```

### Change auto-rotate speed
In `js/app.js` → `startAuto()`:
```js
state.autoTimer = setInterval(() => next(), 10000); // ← change ms
```

---

## 📱 Mobile Features

| Feature | Detail |
|---|---|
| Touch swipe | 50px threshold, left/right |
| Gyroscope | Auto-enabled; iOS 13+ requires first tap |
| Portrait lock | Camera stays at eye-level |
| Bio panel | Slides up from bottom on card stop |
| Auto-rotate | Pauses on touch, 10s interval |

---

## 🖼 Image Specs

| Type | Size | Format |
|---|---|---|
| Artist thumb | 600 × 800 px | JPG, quality 80+ |
| Infographic | 1200 × 800 px | JPG, quality 80+ |

Generate placeholder test images:
```bash
pip install Pillow
python3 generate_placeholders.py
```

---

## 🔧 Tech Stack

- **Three.js r128** (CDN) — 3D room renderer
- **Vanilla ES6** — no bundler, no framework
- **Google Fonts** (Playfair Display + Inter)
- **CSS custom properties** — design token system
- **Fetch API** — loads `artists.json` at runtime

No Node.js, no npm, no build step required.
