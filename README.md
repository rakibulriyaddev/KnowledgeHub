# KnowledgeHub

A web client that renders and navigates **KnowledgeVault** — a folder of
interconnected Markdown notes linked by frontmatter. Built with Next.js 16
(App Router), Tailwind CSS v4, and Shiki-powered syntax highlighting.
Mobile-first, dark-mode, and deployable to Vercel.

This is a single-repo **monorepo**: the content (`KnowledgeVault/`) and the web
app (`KnowledgeHub-Client/`) live side by side. The client reads the vault from
the local filesystem at build time and prerenders every page as static HTML —
no database, no API, no runtime fetching.

## Repository layout

```
KnowledgeHub/
├── KnowledgeVault/         # Markdown content (the knowledge base)
│   ├── programming/
│   │   └── _index.md
│   ├── javascript/
│   │   ├── _index.md
│   │   ├── qa.md
│   │   └── resources.md
│   └── ...                 # one folder per topic, flat at the root
└── KnowledgeHub-Client/    # Next.js web app (this is what you deploy)
    ├── app/                # routes: / (home) and /topic/[id]
    ├── components/         # Navbar, SearchBar, MarkdownViewer, ...
    ├── lib/                # vault (fs reads), search index, markdown config
    ├── scripts/            # build-search-index.ts
    └── public/             # search-index.json (generated)
```

## KnowledgeVault structure

Each topic is a folder at the **root** of `KnowledgeVault/`. Hierarchy comes
from frontmatter, not nesting. A folder becomes a topic when it contains an
`_index.md`:

```yaml
---
id: javascript                 # informational; the folder name is the canonical id/URL
title: JavaScript
created: 2026-06-17
modified: 2026-06-17
tags: [programming, web, frontend]
parent: programming            # folder id of the parent topic, or null
children: [javascript-async, javascript-promises]
---

# JavaScript

Markdown body here. Fenced code blocks are syntax-highlighted, and GitHub
Flavored Markdown (tables, task lists, ...) is supported.
```

Add any number of sibling Markdown files to a topic folder (e.g. `qa.md`,
`resources.md`). They appear in the **"Also in this topic"** switcher and render
inline without a page reload. An optional `title:` in their frontmatter sets the
switcher label (otherwise the filename is humanized).

Routes:

- `/` — home: search bar + "Recently Added" / "Recently Updated"
- `/topic/<folder-name>` — topic detail (tree nav, rendered Markdown, file switcher)

## Getting started

```bash
cd KnowledgeHub-Client
npm install
npm run dev          # http://localhost:3000  (regenerates the search index first)
```

Build and run for production:

```bash
npm run build        # runs the search-index script, then `next build` (SSG)
npm run start
```

Other scripts:

- `npm run index` — regenerate `public/search-index.json` from the vault

### Environment

| Variable    | Default             | Purpose                                               |
| ----------- | ------------------- | ----------------------------------------------------- |
| `VAULT_DIR` | `../KnowledgeVault` | Path to the vault folder, relative to the client app. |

Copy `.env.example` to `.env.local` only if your vault lives somewhere other
than the sibling folder.

## How it works

- **Build time:** `scripts/build-search-index.ts` (run via the `prebuild` /
  `predev` hooks) reads every `_index.md`, parses frontmatter with
  `gray-matter`, and writes a compact `public/search-index.json`
  (`{ id, title, tags, parent, children, created, modified }`).
- **Pages:** `generateStaticParams` enumerates the vault folders and every topic
  page is prerendered as static HTML. Markdown is rendered **server-side** with
  `react-markdown` (`MarkdownAsync`) + `remark-gfm` + `rehype-pretty-code`
  (Shiki, dual light/dark themes), so Shiki never ships to the browser and there
  is no `dangerouslySetInnerHTML`.
- **Search:** the home page loads `search-index.json` and runs `fuse.js`
  client-side for live, fuzzy matching on `title` and `tags` (max 10 results).
- **Inline switching:** a topic's `_index.md` and every sibling are all rendered
  at build time and toggled by a small client component — instant, no reload.
- Content changes ship via a normal rebuild/redeploy (pure SSG; the app never
  reads the vault at runtime).

## Deploying to Vercel

1. Import the repository.
2. Set **Root Directory** to `KnowledgeHub-Client` and keep **"Include files
   outside the root directory in the build step"** enabled (the default) so the
   build can read `../KnowledgeVault`.
3. Framework preset: Next.js. Build command stays `next build` (the `prebuild`
   index script runs automatically). No environment variables are required.

Because everything is read at build time and baked into the static output, no
runtime filesystem access to the vault is needed.

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
`@tailwindcss/typography` · `react-markdown` + `remark-gfm` + `rehype-pretty-code`
(Shiki) · `gray-matter` · `fuse.js` · `next-themes`.

## Notes

- The vault is the single source of truth — no database, no auth (content is public).
- Editing content from the UI is out of scope (a planned future feature); edit
  the Markdown files in `KnowledgeVault/` directly for now.
- `Explore` and `About` are placeholder pages; tag chips are styled but not yet
  filterable.
