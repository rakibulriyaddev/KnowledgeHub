# Decisions

Lightweight ADR log — why things are built this way, not just what they are.
Add a new entry whenever you make a non-obvious tradeoff; don't let it live
only in chat history. Keep entries short: context, decision, consequence.

---

### ADR-001 — Flat topic folders, hierarchy via frontmatter

**Context:** Need a content structure that supports a tree (parent/child
topics) without deep, hard-to-navigate nesting.
**Decision:** Every topic is a folder at the vault *root*; `parent`/
`children` frontmatter fields express hierarchy, not folder nesting.
**Consequence:** Renaming/moving a topic's position in the tree never
requires moving files — just editing frontmatter on both sides of the
relationship (see the bidirectionality rule in `KnowledgeVault/CLAUDE.md`).

### ADR-002 — Bake the whole vault into one JSON asset at build time

**Context:** The app can't read an arbitrary host filesystem at runtime, and
`pubspec.yaml` asset declarations don't cleanly support enumerating ~140
dynamically-named per-topic markdown files (no recursive glob support for
unpredictable directory trees).
**Decision:** `tool/build_vault_data.dart` reads `../KnowledgeVault` and
writes one `assets/vault_data.json` containing every topic's frontmatter,
every panel's body/raw text, and the search index. The app loads it once at
startup (`VaultRepository.load()`) and serves everything from memory.
**Consequence:** The app has zero runtime vault access — it only knows what
was baked in at the last `dart run tool/build_vault_data.dart`. Any vault
content change requires re-running that script and rebuilding the app
before it shows up. This is the most important operational gotcha in this
repo (see WORKFLOWS.md).

### ADR-003 — Search is a hand-rolled fuzzy scorer, not a library port

**Context:** Fuzzy title/tag search is needed over a small (~140-entry)
corpus. No compelling reason to add a heavyweight fuzzy-search dependency
for that scale.
**Decision:** `lib/data/search.dart`'s `VaultSearch` implements a 3-tier
scorer (exact match → substring → in-order subsequence) with 0.7/0.3
title/tag weighting.
**Consequence:** Ranking is a reasonable approximation, not an
industrial-strength fuzzy match — acceptable given the corpus size; revisit
if search quality becomes a real complaint.

### ADR-004 — Android-only, single unified nav

**Context:** A phone is always "mobile" — there's no need for a
desktop/mobile responsive split the way a website would need one.
**Decision:** Scaffolded with `flutter create --platforms=android` only.
`AppScaffold` provides one drawer-based nav for every screen; there's no
desktop-style persistent sidebar variant.
**Consequence:** Simpler codebase, but adding iOS/web/desktop later would
need real layout work (the widgets currently assume a narrow phone
viewport), not just flipping a platform flag.

### ADR-005 — `flutter_markdown_plus` instead of `flutter_markdown`

**Context:** The original `flutter_markdown` package is discontinued
upstream.
**Decision:** Use the maintained fork, `flutter_markdown_plus` (same API
surface — `MarkdownBody`, `MarkdownStyleSheet`, `SyntaxHighlighter`,
`imageBuilder`).
**Consequence:** None functionally; just don't reintroduce the discontinued
package when adding Markdown features.

### ADR-006 — Code blocks: `package:highlight` with auto-detected language

**Context:** Flutter's `SyntaxHighlighter` interface (`format(String
source)`) doesn't pass the fenced code block's language through, only the
raw text.
**Decision:** `AppCodeSyntaxHighlighter` uses `highlight.parse(source,
autoDetection: true)` and themes the result with `githubTheme` (light) /
`atomOneDarkTheme` (dark) from `flutter_highlight`, switching on the app's
brightness.
**Consequence:** Auto-detection is usually right for common languages but
isn't guaranteed. If `flutter_markdown_plus` ever exposes language info
through a builder API, prefer wiring that through instead of relying on
auto-detection.

### ADR-007 — Topic images bundled as Flutter assets, links rewritten at render time

**Context:** Some Markdown bodies embed images via absolute paths like
`/vault/<topic-id>/<file>`. These binary assets can't live inside
`KnowledgeVault/` itself (that folder is Markdown-only content) and the app
has no server to fetch them from at runtime.
**Decision:** Image files are bundled directly under
`KnowledgeHub-Flutter/assets/vault_images/<topic-id>/<file>`, each listed
individually in `pubspec.yaml`'s `assets:` section (not declared as a
recursive folder — Flutter only auto-includes files directly inside a
declared asset folder, not subdirectories). `lib/widgets/markdown_view.dart`
supplies an `imageBuilder` that rewrites any `/vault/<topic>/<file>`
reference to `Image.asset('assets/vault_images/<topic>/<file>')` at render
time; `http(s)` URLs fall back to `Image.network`.
**Consequence:** Adding a new topic image means three manual steps (drop the
file, add a pubspec line, reference it from Markdown) — see
[WORKFLOWS.md](WORKFLOWS.md). There's no automation enforcing that a
referenced image actually has a bundled file and a pubspec entry; a typo in
any of the three shows the in-app fallback (italic `[image: alt]` text)
instead of a crash.

### ADR-008 — Minimal state management (provider, theme only)

**Context:** Most of this app's data is static (baked at build time) and
read-only; there's little genuine cross-cutting mutable state.
**Decision:** `provider`'s `ChangeNotifierProvider` is used for exactly one
cross-cutting concern (`ThemeController`). Everything else is local widget
state or plain constructor-passed data from the `VaultRepository` singleton.
**Consequence:** Adding a genuinely cross-cutting feature (e.g. favorites,
reading progress) will need a real decision about where that state lives —
don't reach for Bloc/Riverpod reflexively; consider whether it fits the
existing "provider for one thing" pattern first, and record the choice here
if it changes.

### ADR-009 — Removed the Next.js web client

**Context:** This repo originally also contained `KnowledgeHub-Client/`, a
Next.js 16 static-site-generated web app rendering the same vault, deployed
to Vercel. Its vault-reading logic was reimplemented by hand in Dart for the
Flutter app (no shared code between TypeScript and Dart), which was an
ongoing manual-sync burden between the two.
**Decision:** Removed `KnowledgeHub-Client/` entirely, by explicit request,
to keep this repo single-app and Android-only. Its topic images
(`public/vault/<topic>/...`) were migrated into the Flutter app as bundled
assets first (ADR-007) so no content was lost.
**Consequence:** This repo now has exactly one client. Don't reintroduce
references to `KnowledgeHub-Client` in code, docs, or `.claude/` config —
if a web client is wanted again in the future, it should be scoped as a new
decision, not a revival of the old one (its logic will be stale relative to
whatever the vault/Flutter app have evolved into by then).
