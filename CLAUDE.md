# CLAUDE.md — diegoromero.blog

## Project Overview

Personal blog by Diego Romero — a software engineer writing about technology, productivity, and non-fiction books. Built with Next.js 13 (App Router) + Contentlayer + Tailwind CSS. Deployed on Vercel at https://www.diegoromero.blog.

The visual design follows the **"Terminal Warm"** aesthetic — a developer-centric theme with monospace UI chrome, warm serif body text, amber/green accents on a dark charcoal or warm white background.

## Tech Stack

- **Framework:** Next.js 13.5.3 (App Router)
- **Content:** Contentlayer 0.3.4 (MDX → type-safe content)
- **Styling:** Tailwind CSS + `@tailwindcss/typography` prose
- **UI Library:** Pliny (search via KBar, analytics, newsletter, comments)
- **Syntax Highlighting:** Prism via `rehype-prism-plus`
- **Package Manager:** pnpm
- **Deployment:** Vercel (auto-deploy from `main` branch)
- **Node:** 20.x (specified in `engines`)
- **Testing:** Playwright (e2e tests in `e2e/` directory)

## Commands

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build (runs contentlayer + next build + postbuild RSS)
pnpm serve        # Start production server
pnpm lint         # ESLint with auto-fix
pnpm format       # Prettier formatting
pnpm test:e2e     # Run Playwright end-to-end tests
```

## Project Structure

```
app/                    # Next.js App Router pages
├── page.tsx            # Homepage (hero, recent posts, books)
├── layout.tsx          # Root layout (fonts, providers, SearchProvider)
├── blog/               # Blog listing + article pages
├── book/               # Book listing + detail pages
├── projects/           # Projects page
├── about/              # About page
├── tags/               # Tags listing + filtered views
├── theme-providers.tsx # next-themes dark/light mode
└── seo.tsx             # SEO metadata generation

components/             # React components
├── Header.tsx          # Nav bar — "diego@blog:~$" terminal prompt + links
├── Footer.tsx          # Terminal-styled footer
├── SearchButton.tsx    # KBar search trigger (/search)
├── ThemeSwitch.tsx     # Dark/light mode toggle (◐ DARK / ◑ LIGHT)
├── MobileNav.tsx       # Mobile hamburger navigation
├── Card.tsx            # Reusable card (projects, books)
├── Tag.tsx             # Tag badge component
├── MDXComponents.tsx   # Custom MDX rendering components
└── social-icons/       # SVG social icons

layouts/                # Page layout templates
├── PostLayout.tsx      # Full article layout (title, date, tags, TOC, content)
├── PostSimple.tsx      # Minimal article layout
├── PostBanner.tsx      # Article with banner image
├── ListLayout.tsx      # Blog/book listing with pagination
├── ListLayoutWithTags.tsx  # Listing with tag sidebar
└── AuthorLayout.tsx    # About/author page layout

data/                   # Content and configuration
├── blog/               # Blog posts (MDX files)
├── book/               # Book reviews (MDX files)
├── authors/            # Author profiles (MDX)
├── siteMetadata.js     # Global site config (title, URLs, analytics, search)
├── headerNavLinks.ts   # Navigation link definitions
├── projectsData.ts     # Projects page data
└── logo.svg            # Site logo

css/
├── tailwind.css        # Global styles + CSS custom properties + theme overrides
└── prism.css           # Syntax highlighting theme

contentlayer.config.ts  # Content model definitions (Blog, Book, Authors)
tailwind.config.js      # Tailwind theme (Terminal Warm colors, fonts, typography)
e2e/                    # Playwright end-to-end tests
playwright.config.ts    # Playwright configuration
```

## Design System — Terminal Warm

### Fonts

- **Space Mono** (`font-mono`) — Headers, nav, UI chrome, code-like elements
- **Lora** (`font-serif`) — Body text, article reading (warm serif for comfort)
- **Fira Code** (`font-code`) — Code blocks and inline code

Fonts loaded via Google Fonts in `app/layout.tsx` with CSS variable fallbacks.

### Colors

| Token       | Dark Mode | Light Mode | Usage                                    |
| ----------- | --------- | ---------- | ---------------------------------------- |
| `--bg`      | `#1A1A2E` | `#FAFAF5`  | Page background                          |
| `--fg`      | `#E8E8E0` | `#1A1A2E`  | Primary text                             |
| `--accent`  | `#FFB000` | `#FFB000`  | Amber — links, highlights, active states |
| `--accent2` | `#00D26A` | `#00A855`  | Green — secondary accent, prompts        |
| `--surface` | `#232338` | `#F0F0E8`  | Card/block backgrounds                   |
| `--border`  | `#2E2E4A` | `#D8D8C8`  | Borders, dividers                        |
| `--muted`   | `#B8B8B8` | `#6A6A7A`  | Secondary/muted text                     |

CSS custom properties defined in `css/tailwind.css`. Tailwind `primary` maps to amber, `gray` maps to the custom charcoal/cream scale.

### Design Principles

- Terminal prompt (`diego@blog:~$`) in nav as brand identity
- Monospace for UI chrome, serif for reading — clear visual hierarchy
- `$ whoami` hero block on homepage with cursor blink animation
- Blog post dates in monospace, content in serif
- Minimal color palette — amber and green accents only
- Code blocks with terminal-style presentation
- `▸` / `▹` bullets for post listings

## Content Model (Contentlayer)

### Blog Post (`data/blog/*.mdx`)

```yaml
---
title: string (required)
date: string (required, ISO date)
tags: string[] (optional)
draft: boolean (optional, hides in production)
summary: string (optional, used in listings)
authors: string[] (default: ["default"])
images: string[] (optional, for social/OG)
layout: string (optional: PostLayout | PostSimple | PostBanner)
---
```

Computed fields: `readingTime`, `slug`, `path`, `toc` (table of contents)

### Book Review (`data/book/*.mdx`)

Same schema as Blog. Stored in `data/book/` directory.

### Author (`data/authors/*.mdx`)

```yaml
---
name: string
avatar: string (image path)
occupation: string
company: string
email: string
twitter: string
linkedin: string
github: string
---
```

## Key Conventions

### Adding a Blog Post

1. Create `data/blog/my-post-slug.mdx` with frontmatter
2. Write content in MDX (supports JSX components, see `MDXComponents.tsx`)
3. Add images to `public/static/images/blog/my-post-slug/`
4. `pnpm build` to verify — Contentlayer generates types automatically
5. Tags are auto-collected and written to `app/tag-data.json`

### Adding a Book Review

Same as blog post but in `data/book/` directory.

### Adding a Project

Edit `data/projectsData.ts` — add an object with `title`, `description`, `imgSrc`, `href`.

### Modifying Navigation

Edit `data/headerNavLinks.ts` — array of `{ href, title }` objects.

### Styling Changes

1. **Theme colors** → `tailwind.config.js` (`primary`, `gray` palettes) + `css/tailwind.css` (CSS custom properties)
2. **Prose/article styles** → `.prose` overrides in `css/tailwind.css`
3. **Component styles** → Tailwind utility classes in component files
4. **KBar search modal** → Styled via Tailwind `primary`/`gray` color mappings (pliny hardcodes class names)

## Important Notes

### Build & Deploy

- Vercel auto-deploys from `main` branch (currently deploying from `redesign/terminal-warm`)
- Always run `pnpm build` locally before pushing — catches type errors and content issues
- Contentlayer generates `.contentlayer/` directory (gitignored) during build
- RSS feed generated by `scripts/postbuild.mjs` → `scripts/rss.mjs`
- Search index generated at build time → `public/search.json`

### Known Quirks

- `contentlayer` uses `assert` syntax for imports which triggers Node deprecation warnings — harmless
- KBar (search) component styles are hardcoded in pliny — override via Tailwind color config, not CSS selectors
- The `tsconfig.tsbuildinfo` must not be deleted or build may break
- Blog and Book types share the same schema but render at different URL paths (`/blog/*` vs `/book/*`)

### What NOT to Do

- Don't delete `data/blog/` or `data/book/` content without checking live site impact
- Don't change `contentlayer.config.ts` field names without updating all layouts
- Don't use `colors.pink` for Tailwind primary — it was replaced with amber for Terminal Warm
- Don't edit pliny source files in `node_modules` — override via Tailwind config
- Don't push directly to `main` without build verification

### Testing

- E2e tests live in `e2e/` — run with `pnpm test:e2e`
- Tests cover: homepage, blog, articles, books, projects, navigation, theme toggle, SEO
- Playwright config uses the dev server (auto-started) with Chromium
- Always run tests after design/layout changes

## Author & Site Info

- **Author:** Diego Romero
- **Site URL:** https://www.diegoromero.blog
- **GitHub:** https://github.com/Diego-Romero/blog
- **Repo:** `Diego-Romero/blog` (branch: `redesign/terminal-warm`)
- **Topics:** Software engineering, productivity, deep work, non-fiction books
- **Social:** GitHub, LinkedIn, Twitter (links in `data/siteMetadata.js`)
