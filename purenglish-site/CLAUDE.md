# PurEnglish — Project Master Document

> This file is read automatically by Claude at the start of every session.
> Update it whenever structure, pages, or dependencies change.

---

## What This Is

A static HTML website for PurEnglish — a teaching resource library for English teachers
in Israel's Ministry of Education (Haredi District). Teachers use it to access prepared
lesson materials (slideshows, flashcards, worksheets, songs) organized by school level and topic.

---

## Stack & Deployment

| What | Detail |
|------|--------|
| **Type** | Static HTML — no framework, no build step |
| **Repo** | `MamachEnglishEzra/purenglish-site` (GitHub) |
| **Hosting** | Cloudflare Pages |
| **Live URL** | `https://purenglish-site.pages.dev` (custom domain not yet connected) |
| **Deploy trigger** | Push/merge to `master` → Cloudflare auto-deploys |
| **Workflow** | commit → push → `gh pr create` → `gh pr merge` → live |

---

## Repository Structure

```
purenglish-site/               ← site root (served by Cloudflare)
  index.html                   ← Homepage
  sitemap.html
  css/
    style.css                  ← SINGLE source of truth for all design tokens & shared components
  js/
    components.js              ← Fetches and injects partials/header.html + partials/footer.html
  partials/
    header.html                ← Shared header (top-bar + nav) — edit nav HERE only
    footer.html                ← Shared footer — edit HERE only
  assets/
    images/                    ← Card images etc.
  elementary/
    index.html                 ← Elementary landing (markdown-loading shell)
    prepared-teaching-materials/
      index.html               ← Shell
      level-1/
        all-about-me/
          index.html           ← ✅ BUILT — first fully-built topic page (template for all others)
    assessments/index.html     ← Shell
    classroom-display/index.html
    games/index.html
    songs-activities/index.html
    speaking-practice/index.html
    teaching-basic-reading/index.html
    useful-links/index.html
    welcome-packet/index.html
  high-school/
    index.html                 ← Shell
    cobe-practice/index.html
    speaking-practice/index.html
    useful-links/index.html
  distance-learning/
    index.html                 ← Shell
  admin/
    index.html                 ← Admin panel (do not modify without care)
  _data/
    homepage.json              ← CMS data for homepage dynamic content
```

---

## Shared Components

### Header & Footer — JS Partials
All pages load the header and footer via `js/components.js`, which fetches:
- `/partials/header.html` → injected into `<div id="site-header"></div>`
- `/partials/footer.html` → injected into `<div id="site-footer"></div>`

**To change the nav:** edit `partials/header.html` only. It updates every page.

Every HTML page must have:
```html
<div id="site-header"></div>   <!-- near top of <body> -->
<div id="site-footer"></div>   <!-- near bottom of <body> -->
<script src="/js/components.js"></script>   <!-- before </body> -->
```

### Current Nav Items (partials/header.html)
- Home → `/`
- Elementary → `/elementary/`
- High School → `/high-school/`
- Welcome Packet → `/elementary/welcome-packet/`

---

## Design System (css/style.css)

### Colour Tokens
```css
--navy:       #1B3A6B   /* headings, header bg, footer bg, hero bg */
--gold:       #C9A84C   /* accents, card top borders, buttons, badges */
--blue:       #2E7DBF   /* links */
--bg:         #F6F0E4   /* page background (warm cream) */
--white:      #FFFFFF
--text:       #2C2C2C
--text-light: #6B6B6B
```

### Typography
- **Font:** `DM Sans` (loaded via Google Fonts inside `style.css`)

### Reusable Classes (from style.css)
| Class | Purpose |
|-------|---------|
| `.top-bar` | Ministry bar at very top |
| `.site-header` | Logo + nav bar |
| `.site-logo`, `.brand`, `.tagline` | Logo components |
| `.site-nav` | Nav `<ul>` |
| `.site-footer`, `.footer-name`, `.footer-copy` | Footer |
| `.btn-primary` | Gold filled button (designed for dark backgrounds) |
| `.btn-outline` | White outlined button (designed for dark backgrounds) |
| `.hero`, `.hero-content`, `.hero-buttons` | Homepage hero |
| `.cards-section`, `.cards-grid`, `.card`, `.card-body`, `.card-link` | Card grid |

> ⚠️ `.btn-primary` and `.btn-outline` are styled for **dark/navy backgrounds**.
> On white card backgrounds, override them in an inline `<style>` block — see
> `all-about-me/index.html` for the pattern.

---

## Page Types

### 1. Shell Pages (markdown-loading)
Most pages are shells that fetch a `.md` file and render it via `marked.js`.
They have a minimal inline `<style>` block and a `<script>` that loads content
from `/content/<path>.md`. Used for: elementary sub-sections, high-school, distance-learning.

### 2. Fully-Built Content Pages
Self-contained HTML with inline `<style>` for page-specific styles.
Links to `/css/style.css` for the shared design system.
**Template:** `elementary/prepared-teaching-materials/level-1/all-about-me/index.html`

---

## Topic Page Template (All About Me)

The `all-about-me` page is the **reference template** for all future topic pages.
Copy it and swap in new content. Structure (top to bottom):

1. `<div id="site-header"></div>` — injected header
2. **Breadcrumb bar** — `.breadcrumb` class, slim white bar with gold-bordered bottom
3. **Page Hero** — navy bg, gold level badge pill, `<h1>`, subtitle
4. **Quick-Nav Strip** — pill anchor links with gold bottom border → `#songs`, `#presentation`, `#flashcards`, `#worksheet`
5. **Section Cards** — white cards with gold top border (4px), shadow, rounded corners. Each has:
   - Section label badge
   - `<h2>` heading
   - Teacher tip callout (gold left border, cream bg, italic)
   - Large embed (iframe)
   - Button row (gold primary + navy outline)
6. `<div id="site-footer"></div>` — injected footer
7. `<script src="/js/components.js"></script>`

### Embed Types
| Section | Embed | Height |
|---------|-------|--------|
| Songs & Clips | YouTube (`youtube-nocookie.com`) 3-col grid | `aspect-ratio: 16/9` |
| Presentation | Google Drive video preview | 520px desktop / 300px mobile |
| Flashcards | Google Drive PDF preview | 600px desktop / 400px mobile |
| Worksheet | Google Drive PDF preview | 600px desktop / 400px mobile |

### YouTube Embed Format (use exactly)
```html
<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  title="..."
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
```
> Must use `youtube-nocookie.com` + `referrerpolicy` — otherwise Error 153.

### Google Drive Embed Format
```html
<iframe
  class="drive-embed"
  src="https://drive.google.com/file/d/FILE_ID/preview"
  title="..."
  allowfullscreen
></iframe>
```
Download button: `https://drive.google.com/uc?export=download&id=FILE_ID`
Open in Drive: `https://drive.google.com/file/d/FILE_ID/view`

---

## Built Topic Pages

| Page | Path | Status |
|------|------|--------|
| All About Me (Level 1) | `/elementary/prepared-teaching-materials/level-1/all-about-me/` | ✅ Live |

---

## Local Development

- **Serve locally:** `npx serve purenglish-site --listen 3000` (launch config at `.claude/launch.json`)
- **VS Code Live Server:** set `"liveServer.settings.root": "/purenglish-site"` in VS Code settings
- **Do not** open HTML files directly via `file://` — absolute paths (`/css/style.css`) won't resolve

---

## Known Issues / Decisions

- `btn-outline` in `style.css` uses white text/border — invisible on white backgrounds.
  Workaround: override in page-specific `<style>` block (see all-about-me template).
- YouTube videos require `youtube-nocookie.com` + `referrerpolicy` to embed correctly.
- Custom domain (`purenglish.org.il`) not yet connected to Cloudflare Pages.
- Nav inconsistency: `index.html` (homepage) was at one point updated to show "Distance Learning"
  but all other pages use "Welcome Packet". Now standardised to Welcome Packet via the shared partial.
