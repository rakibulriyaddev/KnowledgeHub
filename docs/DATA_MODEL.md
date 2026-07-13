# Data Model

## Canonical schema (authoritative source: `KnowledgeVault/CLAUDE.md`)

Every topic is a folder containing `_index.md` with exactly 8 frontmatter
fields. **Do not restate the full ruleset here** — read
[`KnowledgeVault/CLAUDE.md`](../KnowledgeVault/CLAUDE.md) for naming rules,
tag rules, the bidirectionality requirement, and the content standard. This
doc only covers how that schema is *consumed* by the app.

```yaml
---
id: tcp
title: "TCP (Transmission Control Protocol)"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, transport-layer, networking-fundamentals]
parent: networking
children: []
status: draft            # draft | complete
---
```

Sibling files (`qa.md`, `deep-dive.md`, ...) in the same folder carry an
optional `title:` frontmatter field (sets their label in the panel switcher)
and no other required fields.

## The build-time pipeline

`KnowledgeHub-Flutter/tool/build_vault_data.dart` reads every topic folder in
`../KnowledgeVault`, parses frontmatter, and writes one
`assets/vault_data.json`:

```json
{
  "nodes": [
    {
      "id": "tcp",
      "frontmatter": { "id": "tcp", "title": "...", "tags": [...], "parent": "networking", "children": [], "status": "draft", "created": "...", "modified": "..." },
      "panels": [
        { "name": "_index.md", "label": "Overview", "body": "...", "raw": "..." },
        { "name": "qa.md", "label": "Q&A", "body": "...", "raw": "..." }
      ]
    }
  ],
  "searchIndex": [
    { "id": "tcp", "title": "...", "tags": [...], "parent": "networking", "children": [], "created": "...", "modified": "...", "status": "draft" }
  ]
}
```

This is the **entire** data the app will ever show — unlike a server-rendered
site, there's no filesystem to fall back to at request time, so panel bodies
(not just metadata) are baked in up front.

`VaultRepository.load()` (in `lib/data/vault_repository.dart`) loads this
asset once at app startup and serves every screen from the in-memory
`List<VaultNode>` / `List<SearchIndexEntry>` it parses out.

## Model classes (`lib/models/vault_models.dart`)

| Class | Fields | Notes |
|---|---|---|
| `Frontmatter` | `id, title, created, modified, tags, parent, children, status` | mirrors the schema above exactly |
| `TopicStatus` | enum `draft \| complete` | |
| `Panel` | `name, label, body, raw` | one Markdown file within a topic; `_index.md` is always first, always labelled `"Overview"` |
| `VaultNode` | `id, frontmatter, panels` | a topic folder — panels already assembled at build time, no lazy fs reads |
| `SearchIndexEntry` | `id, title, tags, parent, children, created, modified, status` | metadata-only projection, used for search + the home Chapters list |
| `TreeRef` / `TopicTree` | `id, title` / `parent, current, children` | resolved parent/child links with dangling references dropped |

## Normalization rules (`tool/build_vault_data.dart`)

- `id`/`title` fall back to the folder name if frontmatter is missing/blank.
- `created`/`modified` normalize to `YYYY-MM-DD` (handles YAML auto-parsing
  dates into native `DateTime` objects).
- `tags`/`children` accept a YAML array or comma-separated string; always
  normalize to `List<String>`, trimmed, empty entries dropped.
- `parent`: the string literal `"null"` (or blank) normalizes to `null`.
- `status`: anything other than the literal `"complete"` normalizes to
  `"draft"`.
- Sibling file labels: `_humanizeFilename()` — `"qa.md"` → `"Q&A"` (special
  case), everything else kebab/snake → Title Case.

If you change the frontmatter schema itself, update in this order: 1)
`KnowledgeVault/CLAUDE.md`'s schema table, 2) the normalization logic in
`tool/build_vault_data.dart`, 3) the `Frontmatter` class in
`lib/models/vault_models.dart`, 4) this doc, 5) re-run the bake script
against the real vault.

## Search

`lib/data/search.dart`'s `VaultSearch` is a hand-rolled fuzzy scorer over
`title` (weight 0.7) and `tags` (weight 0.3), three tiers per field: exact
match (1.0) → substring (0.8) → in-order subsequence (0.5). Top 10 results
(`kMaxSearchResults`). This is a deliberate lightweight approximation, not a
port of any particular search library — see ADR-004 in
[DECISIONS.md](DECISIONS.md). Don't assume it produces optimal ranking for
adversarial/typo-heavy queries; it's tuned for a small (~140-entry), curated
corpus.

## Images

Markdown bodies may embed images via absolute paths like
`/vault/<topic-id>/<file>` (e.g. `cap-theorem/system-design-notes.md`
references `/vault/cap-theorem/CAP_Theorem_architecture_diagram.jpeg`).
These files are bundled directly as Flutter assets at
`assets/vault_images/<topic-id>/<file>` (each listed explicitly in
`pubspec.yaml`'s `assets:` section — not declared as a recursive folder,
since Flutter only auto-includes files directly inside a declared asset
folder). `lib/widgets/markdown_view.dart`'s `imageBuilder` rewrites any
`/vault/<topic>/<file>` reference to `Image.asset('assets/vault_images/<topic>/<file>')`
at render time; `http(s)` image URLs fall back to `Image.network`.

**Adding a new topic image:** drop the file under
`KnowledgeHub-Flutter/assets/vault_images/<topic-id>/`, add its path as a new
line in `pubspec.yaml`'s `assets:` list, reference it from the Markdown body
as `/vault/<topic-id>/<file>`.
