# KnowledgeHub

A Flutter Android app that renders and navigates **KnowledgeVault** — a
folder of interconnected Markdown notes linked by frontmatter. Mobile-first,
dark-mode, offline (the vault is baked into the app at build time; no
backend, no database, no runtime network calls for content).

This is a single-repo **monorepo**: the content (`KnowledgeVault/`) and the
Android app (`KnowledgeHub-Flutter/`) live side by side. The app reads the
vault via a build-time script that bakes it into a JSON asset bundled in the
APK — there's no filesystem access at runtime.

This project is developed with a fully AI-driven workflow — see
[`CLAUDE.md`](CLAUDE.md) and [`docs/`](docs/) for the architecture, data
model, conventions, and design-decision log an AI session should read before
making changes.

## Repository layout

```
KnowledgeHub/
├── KnowledgeVault/              # Markdown content (the knowledge base)
│   ├── CLAUDE.md                # Authoring conventions and frontmatter rules
│   ├── README.md                # Vault overview and quick-start
│   ├── system-design/
│   │   └── _index.md
│   ├── networking/
│   │   ├── _index.md            # child of system-design
│   │   └── ...
│   ├── tcp/
│   │   ├── _index.md            # child of networking
│   │   ├── deep-dive.md
│   │   └── qa.md
│   └── ...                      # one folder per topic, flat at the root
├── KnowledgeHub-Flutter/         # Flutter Android app (this is what you build/run)
│   ├── lib/
│   │   ├── models/                # Frontmatter, VaultNode, Panel, SearchIndexEntry
│   │   ├── data/                  # vault repository (loads the baked asset) + fuzzy search
│   │   ├── theme/                 # light/dark theme + persisted theme mode
│   │   ├── widgets/                # search field, topic card, markdown renderer, tag chips, ...
│   │   └── screens/                # Home, Explore, About, Topic detail, Not found
│   ├── tool/build_vault_data.dart # bakes KnowledgeVault into assets/vault_data.json
│   └── assets/
│       ├── vault_data.json         # generated — frontmatter + panel bodies + search index
│       └── vault_images/           # topic images referenced from Markdown bodies
├── docs/                          # architecture, data model, conventions, decisions (AI onboarding)
└── .claude/
    └── commands/
        └── add-topic.md          # /add-topic slash command (Claude Code)
```

## KnowledgeVault structure

Each topic is a folder at the **root** of `KnowledgeVault/`. Hierarchy comes
from frontmatter, not nesting. A folder becomes a topic when it contains an
`_index.md`.

All naming rules, required frontmatter fields, bidirectionality requirements,
tag conventions, and content standards are documented in
[`KnowledgeVault/CLAUDE.md`](KnowledgeVault/CLAUDE.md). See also
[`KnowledgeVault/README.md`](KnowledgeVault/README.md) for a vault overview.

```yaml
---
id: tcp                         # informational; the folder name is the canonical id
title: "TCP (Transmission Control Protocol)"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, transport-layer, networking-fundamentals]
parent: networking              # folder id of the parent topic, or null
children: []
status: draft                   # draft | complete
---

# TCP

Markdown body here. Fenced code blocks are syntax-highlighted, and GitHub
Flavored Markdown (tables, task lists, ...) is supported.
```

Add any number of sibling Markdown files to a topic folder (e.g. `qa.md`,
`resources.md`). They appear in the **"Also in this topic"** panel switcher.
An optional `title:` in their frontmatter sets the switcher label (otherwise
the filename is humanized).

Topic images are referenced from a Markdown body via an absolute path like
`/vault/<topic-id>/<file>` and physically live in
`KnowledgeHub-Flutter/assets/vault_images/<topic-id>/<file>` — see
[`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) for how that resolves at render
time.

## Getting started

```bash
cd KnowledgeHub-Flutter
dart run tool/build_vault_data.dart   # bake KnowledgeVault into assets/vault_data.json
flutter run                            # needs an Android device/emulator
```

Build an APK:

```bash
flutter build apk            # or --debug for a quick local build
```

**Re-run the bake step after every `KnowledgeVault/` content change** — the
app has no live filesystem access; without it you'll see stale content. See
[`KnowledgeHub-Flutter/README.md`](KnowledgeHub-Flutter/README.md) and
[`KnowledgeHub-Flutter/CLAUDE.md`](KnowledgeHub-Flutter/CLAUDE.md) for more.

## How it works

- **Build time:** `tool/build_vault_data.dart` reads every `_index.md` and
  sibling file, parses frontmatter, and writes a single
  `assets/vault_data.json` containing every topic's normalized frontmatter,
  every panel's rendered-ready body, and a compact search index.
- **Runtime:** `VaultRepository` loads that one JSON asset once at app
  startup and serves every screen from memory — no filesystem or network
  access after that.
- **Search:** a lightweight custom fuzzy scorer (title weight 0.7, tag
  weight 0.3) runs in-memory over the baked search index.
- **Images:** Markdown bodies embed images via absolute `/vault/<topic>/<file>`
  links; the Markdown renderer resolves these against
  `assets/vault_images/<topic>/<file>`, bundled directly in the app.
- Content changes ship by re-running the bake script and rebuilding the app —
  there's no in-app authoring and no runtime content fetching.

## Authoring content

There is no in-app authoring — the app is a read-only view of the vault.
Content is added by editing Markdown files directly and publishing through
normal git commits.

### `/add-topic` slash command (recommended)

Open Claude Code in this repo and run:

```
/add-topic <topic name>
```

The command derives the slug, checks for collisions, asks for title / parent /
children / tags in one step, writes a complete `_index.md` with real content,
and automatically maintains parent–child bidirectionality. See
[`.claude/commands/add-topic.md`](.claude/commands/add-topic.md) for the full
workflow.

### Editing by hand

You can always create or edit files in `KnowledgeVault/` directly, then commit
and push as usual. Follow the frontmatter schema and conventions in
[`KnowledgeVault/CLAUDE.md`](KnowledgeVault/CLAUDE.md), including the required
`status: draft | complete` field and the parent/children bidirectionality rule.

## Tech stack

Flutter 3 / Dart 3, Material 3 · `flutter_markdown_plus` + GFM ·
`package:highlight` + `flutter_highlight` (syntax highlighting) ·
`go_router` · `provider` (theme only) · `shared_preferences` (persisted
theme).

## Notes

- The vault is the single source of truth — no database, no auth (content is public).
- The app is read-only; edit Markdown in `KnowledgeVault/` directly and
  publish via git, then re-bake and rebuild the app.
- `Explore` and `About` are placeholder screens; tag chips are styled but not
  yet filterable.
- Android only, by design — see `docs/DECISIONS.md`.
