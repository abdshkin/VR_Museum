#!/usr/bin/env python3
"""
generate_placeholders.py
Run once to create placeholder images for GitHub Pages demo.
Replace with real images later — same filenames, same folders.

Usage:  python3 generate_placeholders.py
Needs:  Pillow  →  pip install Pillow
"""

import os
from PIL import Image, ImageDraw, ImageFont

ARTISTS = [
    {"id": "telzhanov",   "name": "Telzhanov",   "years": "1918–1979", "color": (196, 132, 58)},
    {"id": "galimbayeva", "name": "Galimbayeva", "years": "1917–1991", "color": (122, 92, 158)},
    {"id": "mullashev",   "name": "Mullashev",   "years": "1922–2001", "color": (58,  122, 92)},
    {"id": "ismailova",   "name": "Ismailova",   "years": "1929–2017", "color": (196, 74,  74)},
    {"id": "kasteev",     "name": "Kasteev",     "years": "1904–1973", "color": (74,  110, 158)},
]
LANGS = ["kz", "ru", "en"]


def darken(c, f=0.6):
    return tuple(int(x * f) for x in c)


def make_thumb(path, artist):
    w, h = 600, 800
    bg = darken(artist["color"], 0.25)
    img = Image.new("RGB", (w, h), bg)
    d   = ImageDraw.Draw(img)

    # Gradient-ish banding
    for i in range(h):
        alpha = i / h
        r = int(bg[0] * (1 - alpha * 0.4))
        g = int(bg[1] * (1 - alpha * 0.4))
        b = int(bg[2] * (1 - alpha * 0.4))
        d.line([(0, i), (w, i)], fill=(r, g, b))

    # Initial letter big
    letter = artist["name"][0]
    d.text((w//2, h//2 - 60), letter, fill=(*artist["color"], 80), anchor="mm")

    # Name + years
    d.text((w//2, h - 80), artist["name"],  fill=(245, 237, 224), anchor="mm")
    d.text((w//2, h - 50), artist["years"], fill=(*artist["color"],), anchor="mm")

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, quality=85)
    print(f"  ✓ {path}")


def make_infographic(path, artist, lang):
    w, h = 1200, 800
    bg = darken(artist["color"], 0.2)
    img = Image.new("RGB", (w, h), bg)
    d   = ImageDraw.Draw(img)

    # Background gradient bands
    for i in range(h):
        alpha = i / h
        r = int(bg[0] + (30 * alpha))
        g = int(bg[1] + (20 * alpha))
        b = int(bg[2] + (10 * alpha))
        d.line([(0, i), (w, i)], fill=(min(r,255), min(g,255), min(b,255)))

    # Gold bar
    d.rectangle([(60, 60), (w-60, 66)], fill=artist["color"])

    # Artist name large
    labels = {
        "kz": f"{artist['name']} · Залы",
        "ru": f"Зал · {artist['name']}",
        "en": f"{artist['name']} · Room",
    }
    d.text((w//2, 180), labels.get(lang, artist["name"]), fill=(245, 237, 224), anchor="mm")
    d.text((w//2, 260), artist["years"],                  fill=artist["color"],  anchor="mm")

    # Placeholder note
    note = {
        "kz": "Бұл орынды нақты инфографикамен ауыстырыңыз",
        "ru": "Замените этот файл реальной инфографикой",
        "en": "Replace this file with a real infographic image",
    }
    d.text((w//2, h//2), note.get(lang, ""), fill=(160, 150, 130), anchor="mm")

    # Gold bar bottom
    d.rectangle([(60, h-66), (w-60, h-60)], fill=artist["color"])

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, quality=85)
    print(f"  ✓ {path}")


print("Generating placeholder images…")
for a in ARTISTS:
    make_thumb(f"assets/images/thumbs/{a['id']}_thumb.jpg", a)
    for lang in LANGS:
        make_infographic(f"assets/images/infographics/{a['id']}_{lang}.jpg", a, lang)

print("\nDone! Replace with real photos when ready.")
print("Image naming convention:")
print("  Thumbs:        assets/images/thumbs/{artist_id}_thumb.jpg  (portrait, ~600×800px)")
print("  Infographics:  assets/images/infographics/{artist_id}_{lang}.jpg  (landscape, ~1200×800px)")
