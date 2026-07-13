# Architecture

## System overview

```
                        ┌────────────────────┐
                        │   KnowledgeVault    │
                        │  (Markdown + YAML   │
                        │   frontmatter)      │
                        └─────────┬───────────┘
                                  │ read at build time
                                  │ (dart run tool/build_vault_data.dart)
                                  ▼
                        assets/vault_data.json
                                  │ bundled in APK
                                  ▼
                    ┌─────────────────────────────┐
                    │  KnowledgeHub-Flutter        │
                    │  Flutter (Android only)      │
                    │  → local APK builds           │
                    └─────────────────────────────┘
```

The app has no database, no backend API, and no authentication. It is a
**read-only renderer**. All state lives as files in `KnowledgeVault/`, and
content changes ship by re-baking the JSON asset and rebuilding the app.

## KnowledgeVault (content layer)

A flat folder of **topics** — one folder per topic at the vault root, each
containing an `_index.md` plus optional sibling `.md` files (e.g. `qa.md`,
`deep-dive.md`). Hierarchy (parent/child) is expressed through frontmatter
fields, not folder nesting. Full schema and authoring rules:
[`KnowledgeVault/CLAUDE.md`](../KnowledgeVault/CLAUDE.md) — that file is
authoritative; don't restate its rules elsewhere.

Some topic bodies embed images via absolute paths, e.g.
`![CAP theorem](/vault/cap-theorem/diagram.jpeg)`. These image files don't
live in `KnowledgeVault/` itself (Markdown content stays text-only) — they're
bundled directly as Flutter assets under
`KnowledgeHub-Flutter/assets/vault_images/<topic-id>/<file>`, and
`lib/widgets/markdown_view.dart` rewrites the `/vault/...` link to that
bundled path at render time. See [DATA_MODEL.md](DATA_MODEL.md).

## KnowledgeHub-Flutter (the app)

Android can't read the host filesystem at runtime, so the vault is **baked
into a single JSON asset at build time** instead of being read live:

```
KnowledgeVault/ ──(dart run tool/build_vault_data.dart)──> assets/vault_data.json ──(bundled in APK)──> app
```

```
KnowledgeHub-Flutter/
├── tool/build_vault_data.dart   # build-time generator: reads ../KnowledgeVault, writes assets/vault_data.json
├── assets/
│   ├── vault_data.json          # generated — { nodes: [...], searchIndex: [...] }; MUST be regenerated after vault edits
│   └── vault_images/<topic>/... # topic images, bundled directly (see above)
├── lib/
│   ├── models/vault_models.dart  # Frontmatter, VaultNode, Panel, SearchIndexEntry, TreeRef/TopicTree
│   ├── data/
│   │   ├── vault_repository.dart # loads assets/vault_data.json once, serves all screens from memory
│   │   └── search.dart           # VaultSearch — custom fuzzy scorer, title weight 0.7 / tags 0.3
│   ├── theme/
│   │   ├── app_theme.dart         # light/dark ThemeData
│   │   └── theme_controller.dart  # ChangeNotifier, persisted via shared_preferences
│   ├── widgets/                   # search field, topic card, tree nav, panel selector, markdown renderer, tag chip, status badge, metadata header, app scaffold
│   └── screens/                   # Home, Explore, About, Topic, NotFound
└── main.dart                       # ChangeNotifierProvider + FutureBuilder<VaultRepository> + GoRouter
```

### Screens

| Screen | Route | Purpose |
|---|---|---|
| `HomeScreen` | `/` | search field + Chapters (top-level topics) list |
| `ExploreScreen` | `/explore` | stub |
| `AboutScreen` | `/about` | stub |
| `TopicScreen` | `/topic/:id` | metadata header, parent/child tree nav, panel switcher, rendered Markdown |
| `NotFoundScreen` | (error fallback) | shown when a topic id doesn't resolve |

### Key widgets

| Widget | Role |
|---|---|
| `AppScaffold` | app bar + theme toggle + nav drawer, wraps every screen |
| `SearchField` | live fuzzy search with inline results list |
| `TopicCard` | home page Chapters list entry |
| `TopicTreeNav` | parent / current / children links on a topic screen |
| `PanelSelector` | chip row to switch between `_index.md` and sibling files |
| `MarkdownView` | renders a panel body: GFM, syntax-highlighted code, bundled topic images |
| `MetadataHeader` + `StatusBadge` + `TagChip` | topic title, draft/complete badge, tags, dates |

## State management

`provider`'s `ChangeNotifierProvider` is used for exactly one thing —
`ThemeController` (persisted light/dark/system preference). Everything else
is local `StatefulWidget` state or plain data passed down from the
`VaultRepository` singleton, loaded once in `main.dart`. No Riverpod/Bloc —
see ADR-009 in [DECISIONS.md](DECISIONS.md) for why this stays minimal.

Navigation is `go_router`; routes match the table above.

## No backend, ever

If a future task seems to need a database, an API, or auth, stop and
reconsider — the entire point of this architecture is "content is git,
render is static, nothing to run except the app itself." Introducing a
backend is a significant architecture change and should be raised with the
user, not done unilaterally.
