# KAUZMIK — Portfolio

Portfolio site for KAUZMIK, an independent music artist: vocalist, lyricist, composer, percussionist and guitarist.

It is a static site (plain HTML, CSS and JavaScript). There is no build step and nothing to install.

## Look and feel

Black-and-white torn-paper collage. Headings are cut-out lettering in cream with sparkles, sections are separated by ripped paper strips, and the live samples are vinyl records.

## Sections

- **Hero**: name, tagline and photo collage
- **Biography** and **Journey**
- **Roles**: vocalist, lyricist, composer, creative development
- **Live**: venues performed at
- **Moments**: photo wall with a click-to-enlarge viewer
- **Music**: live samples as records, plus acoustic covers
- **TAAJ**: release spotlight
- **Contact**: Instagram, email and phone

Extras: a loader, scroll animations, floating music icons, and a **Vibe** button in the nav that plays a lo-fi beat generated in the browser. Animations switch off for visitors who prefer reduced motion. The layout is responsive from phone to desktop.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

The fonts load from Google Fonts, so you need an internet connection.

## Edit your details

Everything personal lives in the `CONFIG` block at the top of [`script.js`](script.js):

| Key | What it does |
| --- | --- |
| `email`, `instagram`, `instagramHandle`, `phone` | Contact buttons and contact slips |
| `youtube`, `spotify` | Extra buttons appear when you fill them in |
| `taaj` | Link for the "Listen now" button in the TAAJ section |
| `samples` | A link for each live-samples record (Pt. 1, 2, 3) |
| `music` | Optional path to your own track, such as `assets/music.mp3`. It replaces the built-in beat |

## Photos

Images live in `assets/img/`. Replace a file with one of the same name to swap a photo. Photos start in black and white and turn to colour on hover. Only add photos you have the rights to use.

## Project files

```
index.html     page structure and content
styles.css     base layout and sections
type.css       cut-out lettering, logo, contact and finale styles
anim.css       loader, cursor, scroll and hover animation styles
gallery.css    Moments, covers, TAAJ and lightbox styles
script.js      CONFIG, lettering builder, contact links, nav
anim.js        loader, animations, floating icons and the Vibe beat
gallery.js     photo viewer
assets/img/    photos and cover art
```

## Deploy

On GitHub, go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`. The site will be live at `https://<username>.github.io/<repo>/`.
