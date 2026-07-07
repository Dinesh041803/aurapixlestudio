# Aura Pixels Studio

**Every Pixel Tells a Story** — luxury photography & cinematic films.

Premium single-page website for Aura Pixels Studio: weddings, pre-wedding, couples,
maternity, fashion, automotive, product, events, drone films and DJI drone rentals.

## Stack

Pure static site — no build step required.

- HTML + CSS + vanilla JS
- [GSAP](https://gsap.com) + ScrollTrigger (scroll animations, counters, parallax)
- [Lenis](https://lenis.darkroom.engineering/) (smooth scrolling)
- Fonts: Italiana (display) · Cormorant (accents) · Manrope (body)

## Structure

```
index.html               main site
assets/css/style.css     design tokens + all styles
assets/js/main.js        preloader, lightbox, filters, slider, booking form
assets/js/shader-bg.js   animated shader background
assets/img/              drop your photos here (see assets/img/README.txt)
tools/optimize_photos.py resize/compress camera originals for the web
robots.txt, sitemap.xml  SEO
drashan.html             previous version (kept for reference)
```

## Run locally

Any static server works:

```
python -m http.server 8137
```

Then open http://localhost:8137

## Deploy

Push to `main` — GitHub Pages serves `index.html` automatically.

## Editing content

- **Photos** — swap the Unsplash URLs in `index.html` with your own shots
  (portfolio images live in the `.masonry` section, one `<figure>` each).
- **Contact** — WhatsApp number and email appear in `index.html`; search `9019648309`.
- **Testimonials / FAQ / drone cards** — plain HTML sections, edit in place.
