# KnowledgeHub-Flutter

Flutter Android client for the KnowledgeVault. Read
[`../CLAUDE.md`](../CLAUDE.md) first for the whole-repo picture; this file
only covers what's specific to this subproject.

Full architecture, data model, and conventions live in the root `docs/`
folder — don't duplicate them here:

- [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — folder structure, screens, widgets
- [`../docs/DATA_MODEL.md`](../docs/DATA_MODEL.md) — `vault_data.json` schema, model classes, image handling
- [`../docs/CODING_STANDARDS.md`](../docs/CODING_STANDARDS.md) — widget conventions, state management (provider, minimal)
- [`../docs/WORKFLOWS.md`](../docs/WORKFLOWS.md) — build/run/verify commands
- [`../docs/DECISIONS.md`](../docs/DECISIONS.md) — ADR-002 (baked JSON asset), ADR-003 (search scorer), ADR-004 (Android-only nav), ADR-005/006 (markdown/highlight packages), ADR-007 (bundled images)

## The one thing to never forget

**The vault is not read live.** `assets/vault_data.json` is a static asset
baked by `tool/build_vault_data.dart` at whatever point it was last run —
the app has zero runtime filesystem access. After any change to
`KnowledgeVault/` content:

```bash
dart run tool/build_vault_data.dart
```

...before `flutter run`/`flutter build`, or you're looking at stale data.

## Quick facts

- Android-only (`flutter create --platforms=android`) — don't add other
  platform folders without discussing it; the UI assumes a phone viewport.
- State management is deliberately minimal: `provider` for `ThemeController`
  only. Everything else flows from the `VaultRepository` singleton
  (`lib/data/vault_repository.dart`), loaded once in `main.dart`.
- Routing is `go_router`, paths: `/`, `/explore`, `/about`, `/topic/:id`.
- Topic images referenced from Markdown as `/vault/<topic>/<file>` resolve
  against `assets/vault_images/<topic>/<file>`, bundled directly and listed
  individually in `pubspec.yaml`. Adding a new one needs a pubspec line too
  — see [`../docs/WORKFLOWS.md`](../docs/WORKFLOWS.md).
- No emulator is typically available in the dev environment — a clean
  `flutter build apk --debug` is the practical verification bar; use a real
  device/emulator to check UI when one is available.
- Verify before calling a change done: `flutter analyze && flutter test &&
  flutter build apk --debug`.
