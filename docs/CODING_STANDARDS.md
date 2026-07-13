# Coding Standards

Vault *content/authoring* rules are not here — see
[`KnowledgeVault/CLAUDE.md`](../KnowledgeVault/CLAUDE.md).

## Cross-cutting

- No comments explaining *what* code does — names should make that obvious.
  A comment is only warranted for a non-obvious *why* (a constraint, a
  workaround, an invariant that would surprise a reader).
- No speculative abstraction. Don't generalize past what the current task
  needs; three similar lines beat a premature helper.
- No error handling for cases that can't happen. Only validate at real
  boundaries (parsing vault content, which can genuinely be malformed).
- One widget per file, named after the thing it renders.
- Business logic (vault reading, search, formatting) stays out of
  widgets/screens — it lives in `lib/data/`, `lib/models/`, `lib/utils/`.

## KnowledgeHub-Flutter (Dart / Flutter)

- Prefer `StatelessWidget`; use `StatefulWidget` only for genuine local UI
  state (e.g. the active panel in `TopicScreen`, the query in
  `SearchField`).
- State management is intentionally minimal: `provider`'s
  `ChangeNotifierProvider` is used for exactly one thing, `ThemeController`.
  Don't introduce Riverpod/Bloc/GetX for new features — pass data down via
  constructors from the `VaultRepository` singleton instead.
- Navigation is `go_router`; keep paths flat and matching the screen table in
  [ARCHITECTURE.md](ARCHITECTURE.md) (`/`, `/explore`, `/about`,
  `/topic/:id`).
- Theming: `ColorScheme.fromSeed` seeded with blue (`#2563EB`), plus explicit
  light/dark color overrides in `lib/theme/app_theme.dart`. If you add a new
  UI color, keep it consistent with the existing neutral-gray/blue palette
  rather than introducing a new accent.
- `lib/data/vault_repository.dart` is the only place that touches
  `assets/vault_data.json` — screens/widgets always go through it (or
  `VaultSearch`), never `rootBundle` directly.
- This app is **Android-only** by design (`flutter create --platforms=android`
  was used) — don't add iOS/web/desktop platform folders back without
  discussing it first; the single-mobile-layout decisions throughout the UI
  (see ADR-005) assume a phone form factor.
- Verify a change compiles for the real target before calling it done:
  `flutter analyze`, `flutter test`, `flutter build apk --debug` (see
  [WORKFLOWS.md](WORKFLOWS.md)). There is usually no emulator available in
  the dev environment — a clean debug APK build is the practical bar.

## Git conventions

- Branch `development` is the working branch; `main` is the release branch,
  updated via PR merge.
- Commit messages are short, imperative, present tense: `"Add X topic"`,
  `"Fix Y"`, `"Remove Z"` — no bodies for routine content/small changes.
- Only commit when explicitly asked to.
