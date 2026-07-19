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
if it changes. (Read status became the second such feature — see ADR-011 —
still `provider`, no new state management library.)

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

### ADR-010 — Per-user read tracking via a new .NET + MongoDB backend, identity via a no-auth entry screen

**Context:** Topic "status" (draft/complete) was baked from frontmatter —
a content-authoring concept, the same for every reader. The user wanted a
*per-person* "have I read this topic" state instead, with no login/auth,
just a name + email entered once.
**Decision:** Added `KnowledgeHub-Api/`, a .NET 10 minimal API with two
endpoints (`GET /api/topic-status`, `POST /api/topic-status/mark-read`)
backed by a single MongoDB collection (`topic_status`, unique index on
`(email, topicId)`). The Flutter app gained: an `EntryScreen` (full name +
email, no validation beyond non-empty/format, saved via
`flutter_secure_storage`) shown once at startup when both fields are absent;
and `ReadStatusBadge`, which replaced the old frontmatter-driven
`StatusBadge` on the topic detail page — it calls the API on open (loading
spinner while pending) and shows **Done** (green) or **Draft** (amber) + a
**Mark as read** button that POSTs the same `{topicId, email}` payload.
**Consequence:** The app now has its first runtime network dependency and
its first persisted user identity — see the updated system diagram in
[ARCHITECTURE.md](ARCHITECTURE.md). The API's base URL is supplied at build
time via `--dart-define=API_BASE_URL=...` (see
[WORKFLOWS.md](WORKFLOWS.md)), so a debug build against a local backend and
a build against a deployed one differ only in that flag. The old
`Frontmatter.status`/`TopicStatus` model and frontmatter field were left in
place (still baked from `KnowledgeVault/`, still a legitimate
content-authoring concept) — they're just no longer rendered anywhere, since
ripping them out would mean touching ~140 vault topic files for no
functional gain. This backend is scoped narrowly to read-tracking; see the
"KnowledgeHub-Api (the one backend)" section in ARCHITECTURE.md before
expanding it.
*(Schema superseded by ADR-011: one document per user instead of one per
`(email, topicId)` pair. Endpoint request shapes are unchanged.)*

### ADR-011 — Read status: one doc per user, on-device cache, indicators everywhere

**Context:** ADR-010's one-doc-per-`(email, topicId)` model made "is this
topic read" expensive to know anywhere except the detail page — there was
no cheap way to get a user's whole read set, and every screen re-hit the API
with no local caching.
**Decision:** `UserTopicStatusDocument` replaces `TopicStatusDocument` —
one Mongo doc per user (`_id` = lowercase email) holding `ReadTopicIds`, a
plain list. `GET /api/topic-status?email=...` now returns the whole set
(`{ topicIds: [...] }`); mark-read/unread use `$addToSet`/`$pull` against
that array. No migration of old per-topic data — dropped and started fresh
(personal, single-user app, not worth the migration code). On the Flutter
side, `TopicStatusController` (a second `ChangeNotifier`, alongside
`ThemeController` per ADR-008) holds the set in memory, mirrors it to
`shared_preferences` (`TopicStatusCache`), and is hydrated once at startup
(`main.dart`'s existing `_loadStartupData` gate) — cache first, API only if
the cache is empty. Every mark-read/unread call hits the API first, then
updates the shared in-memory set and the cache together, so the detail page
badge, search results, and the topic tree all reflect the same state.
`ReadStatusDot` (`lib/widgets/read_status_dot.dart`) is a small display-only
indicator (filled green check = read, outline = unread) added to search
result rows and topic tree nodes; toggling still only happens via the
existing `ReadStatusBadge` button on the topic detail page — the list/tree
dots are deliberately not tappable.
**Consequence:** Reading the status of every topic on screen is now O(1)
against an in-memory set instead of one API call per topic. The tradeoff is
staleness: the cache is refreshed only at app startup and by user-initiated
toggles, so a status changed on another device won't show up until the next
cold start.
