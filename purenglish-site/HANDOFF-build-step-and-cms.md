# Handoff: CMS, Markdown Shells, and Build Step Discussion

## Context

During the School Supplies Level 1 migration, we noticed that the project currently uses three different content patterns:

1. **Homepage**
   - `purenglish-site/index.html` contains the layout and fallback text.
   - `purenglish-site/_data/homepage.json` contains editable homepage copy.
   - The homepage fetches the JSON file in the browser and swaps text into the page.

2. **Category / shell pages**
   - Pages like `/elementary/`, `/high-school/`, and `/elementary/prepared-teaching-materials/` are HTML shells.
   - They fetch Markdown files from `purenglish-site/content/...`.
   - They use `marked.js` in the browser to convert Markdown into HTML at runtime.

3. **Full topic pages**
   - Pages like `/elementary/prepared-teaching-materials/level-1/all-about-me/` and `/elementary/prepared-teaching-materials/level-1/school-supplies/` are straight static HTML.
   - They use the shared CSS and header/footer partials, but the page content itself is already in the HTML file.

This raised a concern: the CMS/editability goal may have led to client-side Markdown rendering, but the user expected the site to be straight source/static HTML.

## Key Clarification

Using a CMS does **not** require client-side Markdown rendering.

The current client-side Markdown pattern exists because the project has no build step. If content is stored as Markdown and no build process converts it to HTML before deployment, then the browser has to fetch and render the Markdown after the page loads.

Decap CMS can still be used without this runtime Markdown pattern.

## What a Build Step Means

A build step assembles the site before it goes live.

Current shell-page flow:

```text
Visitor opens page
-> Browser loads index.html shell
-> Browser runs JavaScript
-> JavaScript fetches Markdown
-> marked.js converts Markdown to HTML
-> Visitor sees content
```

Build-step flow:

```text
Editor changes Markdown/JSON/YAML in Decap CMS
-> CMS commits content to GitHub
-> Cloudflare Pages runs a build command
-> Build tool combines content with templates
-> Build outputs finished static HTML
-> Visitor receives complete HTML immediately
```

The visitor never needs to know Markdown existed.

## Why This Matters

Advantages of adding a build step:

- The deployed site contains real, finished HTML pages.
- Main content does not depend on browser-side JavaScript.
- Pages are more reliable on slow connections, older devices, and stricter browsers.
- Search engines, accessibility tools, and link previews can read page content directly.
- Shared templates reduce repeated HTML across topic pages.
- Future design changes can be made in one template and rebuilt across many pages.
- Content can remain CMS-editable through Decap.
- The build can catch missing titles, missing resource IDs, or invalid required fields before deployment.
- The growing roadmap can be managed with structured content rather than hand-building every repeated page.

Tradeoff:

- The project becomes slightly more technical.
- It needs a package/build setup and a Cloudflare Pages build command.
- Someone needs to define source folders, templates, and output behavior carefully so existing URLs do not break.

## Recommended Direction

Keep Decap CMS, but move Markdown/content rendering from the browser to build time.

Recommended lightweight option:

```text
Eleventy + Decap CMS + Cloudflare Pages
```

Why Eleventy is a good fit:

- Free and open source.
- Designed for Markdown/content sites.
- Outputs normal static HTML.
- Does not require a large frontend framework.
- Can be introduced gradually.
- Works well with existing static assets and custom CSS.
- Keeps content files separate from templates.

Other possible options:

- Astro: also good, but may be more framework than needed.
- Hugo/Jekyll: solid static-site generators, but introduce Go/Ruby toolchains.
- Custom Node script: smallest possible build, but less standard and may become harder to maintain.
- Next.js/Remix: powerful, but likely overkill for this content library.

## Suggested Migration Strategy

Do not rewrite the whole project at once.

Suggested phased approach:

1. Define the desired source/output structure.
2. Add a minimal build setup while preserving current public URLs.
3. Convert one shell page, such as `/elementary/prepared-teaching-materials/`, from runtime Markdown rendering to build-time HTML.
4. Verify Decap CMS can still edit the content source.
5. Configure Cloudflare Pages to publish the generated output.
6. Gradually convert the other shell pages.
7. Later, consider turning full topic pages into reusable templates driven by structured content.

Important: keep existing URLs stable. Teachers and old links should not break.

## Open Questions for Claude

- Should the project adopt Eleventy, or use a smaller custom build script?
- What should the new source/output folder structure be?
- Should generated HTML overwrite the current `purenglish-site/` files, or should source and output be separated?
- How should Decap CMS collections be adjusted?
- Should topic pages remain hand-authored HTML for now, or become data/template driven?
- How can the build preserve current shared header/footer behavior, or should header/footer also become build-time includes?
- How should existing local artifacts like `.claude/worktrees/` be ignored or cleaned up?

## Suggested Prompt for Claude

```text
I want to keep Decap CMS, but I do not want page content rendered client-side from Markdown. Please propose a minimal migration from the current markdown-loading shell pages to pre-rendered static HTML. Prefer Eleventy or a similarly lightweight build step over a large framework. Keep the current URLs, visual design, Decap CMS editing flow, Cloudflare Pages deployment, and topic page template direction. Do not implement yet; first give me the architecture plan, tradeoffs, and exact file changes you recommend.
```

## Current Status Reminder

The School Supplies trial page was built as straight static HTML:

```text
purenglish-site/elementary/prepared-teaching-materials/level-1/school-supplies/index.html
```

The prepared teaching materials landing page is still a Markdown-driven shell:

```text
purenglish-site/elementary/prepared-teaching-materials/index.html
purenglish-site/content/elementary/prepared-teaching-materials.md
```

That landing page currently depends on browser-side JavaScript and `marked.js` to render its content.
