# PurEnglish — Project Master Document

> This file is read automatically by Claude at the start of every session.
> Update it whenever structure, pages, or dependencies change.

---

## What This Is

A static HTML website for PurEnglish — a teaching resource library for English teachers
in Israel's Ministry of Education (Haredi District). Teachers use it to access prepared
lesson materials (slideshows, flashcards, worksheets, songs) organized by school level and topic.

**Brand guide:** `purenglish-site/brand-guide.md` — voice, tone, messaging pillars, copy rules, and community sensitivities. Read before writing or reviewing any site copy.

---

## End-of-Session Checklist

Before closing every session:
1. Commit and push any changes to master (directly or via PR)
2. If a worktree branch was used but has no unique commits, confirm nothing needs pushing
3. Verify the remote branch is clean — stale worktree branches on GitHub cause confusion

---

## Stack & Deployment

| What | Detail |
|------|--------|
| **Type** | Static HTML — no framework, no build step |
| **Repo** | `MamachEnglishEzra/purenglish-site` (GitHub) |
| **Hosting** | Cloudflare Pages |
| **Live URL** | `https://purenglish-site.pages.dev` (custom domain not yet connected) |
| **Deploy trigger** | Push/merge to `master` → Cloudflare auto-deploys |
| **Workflow** | commit → push → `gh pr create` → `gh pr merge --squash` → live |

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
   - Labels use inline SVG icons (Heroicons, MIT) with `.icon` class — no emojis
5. **Section Cards** — white cards with gold top border (4px), shadow, rounded corners. Each has:
   - Section label badge — uses same inline SVG + `.icon` class as quick-nav
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

## Content Roadmap

Legend: ✅ Fully built | 🏗️ Shell (markdown-loaded, not styled) | ⬜ Not started | ❓ Needs design decision

> Update statuses as pages are built. "Shell" = renders markdown but lacks the full topic-page treatment (hero, quick-nav, styled section cards).

### Top-level
- ✅ Homepage — `/`
- ✅ Sitemap — `/sitemap.html`
- ✅ Admin panel — `/admin/`

### Elementary
- 🏗️ Elementary landing — `/elementary/`
  - 🏗️ Welcome packet — `/elementary/welcome-packet/`
  - 🏗️ Assessments — `/elementary/assessments/`
  - 🏗️ Classroom display — `/elementary/classroom-display/`
  - 🏗️ Games — `/elementary/games/`
  - 🏗️ Songs & activities — `/elementary/songs-activities/`
    - ⬜ Shabbat — `/elementary/songs-activities/shabbat/`
    - ⬜ Am Yisrael Chai — `/elementary/songs-activities/am-yisrael-chai/`
    - ⬜ Purim — `/elementary/songs-activities/purim/`
  - 🏗️ Speaking practice — `/elementary/speaking-practice/`
  - 🏗️ Teaching basic reading — `/elementary/teaching-basic-reading/`
  - 🏗️ Useful links — `/elementary/useful-links/`
    - ⬜ Speaking scripts — `/elementary/useful-links/speaking-scripts/`
  - 🏗️ Prepared teaching materials (landing) — `/elementary/prepared-teaching-materials/`
    - ⬜ Level 1 landing — `/elementary/prepared-teaching-materials/level-1/`
      - ✅ All About Me — `/elementary/prepared-teaching-materials/level-1/all-about-me/`
      - ⬜ School Supplies
      - ⬜ Days of the Week
      - ⬜ Hobbies
      - ⬜ Food
      - ⬜ Clothes
      - ⬜ Units of Time
      - ⬜ What Time Is It?
    - ⬜ Level 2 landing — `/elementary/prepared-teaching-materials/level-2/`
      - ⬜ All About Me
      - ⬜ Weather
      - ⬜ Transportation
      - ⬜ Hobbies
      - ⬜ Food
      - ⬜ Clothes
      - ⬜ My Day: Time and Daily Routine
      - ⬜ Time Phrases: Past, Present, & Future
    - ⬜ Level 3 landing — `/elementary/prepared-teaching-materials/level-3/`
      - ⬜ All About Me
      - ⬜ Summer Vacation
      - ⬜ New Year
      - ⬜ What I'm Good At
    - ⬜ Special Days (Chagim) landing — `/elementary/prepared-teaching-materials/special-days-chagim/`
      - ⬜ Rosh Hashanah
      - ❓ Rachel Imenu — has level-2 and level-3 variants (no level-1). Needs multi-variable browsing solution (see design decisions below).
      - ❓ Chanuka — has level-1, level-2, level-3 variants. Same.
      - ⬜ Tu B'shvat
      - ⬜ Purim
      - ⬜ Pesach
      - ⬜ Lag Ba'omer

### High School
- 🏗️ High school landing — `/high-school/`
  - ❓ COBE practice — video clips and slideshows must be differentiated; don't have to be separate pages but the distinction must be clear to teachers (see design decisions below).
  - ❓ Speaking practice — same as COBE practice above.
  - 🏗️ Useful links — `/high-school/useful-links/`

### Distance Learning
- 🏗️ Distance learning landing — `/distance-learning/`
  - ⬜ Audio-only lessons — `/distance-learning/audio-only-lessons/`

---

## Open Design Decisions

These are unresolved structural/UX questions that must be decided before the affected pages can be built.

### 1. Multi-variable browsing for Prepared Teaching Materials
The current one-page-per-topic structure doesn't scale well. Teachers need to find content by multiple dimensions: level (1/2/3), topic (All About Me, Food, etc.), and time of year (Chagim). The old site's approach (separate pages per level, a separate "by month" view) is confusing. A better solution is needed — e.g. a filterable/tagged card grid on the landing page — before building out the remaining topic pages.

### 2. Chagim topics with level variants (Rachel Imenu, Chanuka)
Some Chagim topics have per-level content (e.g. Chanuka has Level 1, 2, 3). The old site gives each variant its own page. This ties into decision #1 — the multi-variable browsing solution should handle this naturally.

### 3. High School: COBE Practice & Speaking Practice
Each has two content types: video clips and slideshows. Teachers often want one or the other, so the distinction must be clear. Does not have to be separate pages — could be tabs or sections — but must not be buried.

### 4. Songs & Activities subpages
These pages (Shabbat, Am Yisrael Chai, Purim) are media-heavy (songs, video clips). They likely need a different layout from the standard topic-page template — more visual, more focused on playing/browsing content than downloading files.

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
