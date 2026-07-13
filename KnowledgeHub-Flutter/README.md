# KnowledgeHub (Flutter, Android)

Android client for browsing and searching the KnowledgeVault, built with
Flutter, targeting Android only.

## How it works

The KnowledgeVault (a sibling folder in this monorepo) is a folder of
Markdown notes with YAML frontmatter. Since the Android app can't read the
host filesystem at runtime, `tool/build_vault_data.dart` bakes every topic's
frontmatter + panel bodies + a compact search index into a single
`assets/vault_data.json` asset, which the app loads once at startup
(`lib/data/vault_repository.dart`).

Topic images referenced from Markdown bodies via `/vault/<topic>/<file>`
links are bundled directly under `assets/vault_images/<topic>/<file>` and
resolved at render time by `lib/widgets/markdown_view.dart`.

## Running

```
dart run tool/build_vault_data.dart   # regenerate assets/vault_data.json from ../KnowledgeVault
flutter run                           # or: flutter build apk
```

Re-run the first command whenever KnowledgeVault content changes.

## Structure

- `lib/models/` — data model (Frontmatter, VaultNode, Panel, SearchIndexEntry)
- `lib/data/` — vault repository (loads the baked asset) + fuzzy search
- `lib/theme/` — light/dark theme + persisted theme mode
- `lib/widgets/` — shared UI (search field, topic card, markdown renderer, tag chips, etc.)
- `lib/screens/` — Home, Explore, About, Topic detail, Not found
- `assets/vault_images/` — topic images bundled into the app (see
  `../docs/DATA_MODEL.md` for how these get referenced and added)
