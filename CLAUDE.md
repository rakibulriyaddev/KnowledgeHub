# KnowledgeHub — AI Onboarding Index

Read this file first, every session, before touching code. It's the map. It
stays short on purpose — depth lives in the linked docs, loaded only when a
task actually needs them.

This project is built with a **fully AI-driven workflow**: an AI (you) writes
and maintains almost all code, content, and docs. There is no separate "ask
the human" step for implementation detail — the docs in this repo *are* the
institutional knowledge. Keep them current as you work; a decision or
convention that only lives in your context window is lost the moment the
session ends.

## What this repo is

A personal knowledge base (**KnowledgeVault** — Markdown notes linked by
frontmatter) rendered by a single client: a **Flutter Android app**. The app
is a read-only viewer over *content* — there's no in-app authoring, and the
vault is still baked into the app at build time, never read live. It does,
however, have one small backend now: **KnowledgeHub-Api** (.NET + MongoDB)
tracks per-user "have you read this topic" state, identified by an email the
user enters once on a no-auth entry screen. See ADR-010 in
[docs/DECISIONS.md](docs/DECISIONS.md).

```
KnowledgeHub/
├── CLAUDE.md                 ← you are here (root index)
├── README.md                 ← human-facing overview
├── docs/                     ← deep-dive docs, read on demand
│   ├── ARCHITECTURE.md       ← system design, data flow, folder structure
│   ├── DATA_MODEL.md         ← frontmatter schema + the app's data contract
│   ├── CODING_STANDARDS.md   ← Flutter/Dart conventions
│   ├── WORKFLOWS.md          ← how to run/build/verify
│   ├── DECISIONS.md          ← ADR log — why things are built this way
│   └── PROMPTS.md            ← reusable task recipes for common changes
├── KnowledgeVault/            ← the content (single source of truth)
│   └── CLAUDE.md              ← authoring rules — READ before touching any topic
├── KnowledgeHub-Flutter/        ← the Flutter Android app
│   └── CLAUDE.md
├── KnowledgeHub-Api/             ← .NET + MongoDB backend, per-user read tracking only
│   └── CLAUDE.md
└── .claude/commands/add-topic.md ← /add-topic slash command
```

## The one rule that governs everything

**KnowledgeVault is the single source of truth.** The app is a read-only
renderer of it — it never writes back, and there is no in-app authoring.
Content changes happen by editing Markdown in `KnowledgeVault/` and
committing.

The app doesn't read the vault live: `KnowledgeHub-Flutter/tool/build_vault_data.dart`
bakes it into `assets/vault_data.json` at build time. **Any vault content
change needs that script re-run before it shows up in the app** — see
[docs/WORKFLOWS.md](docs/WORKFLOWS.md).

## Known gaps

- **Explore and About screens are stubs** (by original design, not a bug).
- **Search is an approximate fuzzy scorer**, not a mature search library —
  fine for the vault's current size (~140 topics); revisit if quality
  becomes a real complaint. See [docs/DATA_MODEL.md](docs/DATA_MODEL.md).

## Working conventions

- Only commit when explicitly asked. Branch `development` is where work
  lands; `main` is the release branch merged via PR.
- Before calling a change done: `flutter analyze && flutter test && flutter
  build apk --debug` (see [docs/WORKFLOWS.md](docs/WORKFLOWS.md)).
- No comments explaining *what* code does — only *why*, when non-obvious.
  See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md).
- Adding vault content → use `/add-topic` (see
  `.claude/commands/add-topic.md`) or follow `KnowledgeVault/CLAUDE.md`
  by hand. Never restate vault authoring rules elsewhere — that file is
  the single source of truth for them, and the `/add-topic` skill reads it
  live.
- When a change introduces a new convention or non-obvious tradeoff, record
  it in `docs/DECISIONS.md` — don't let it live only in chat history.

## History note

This repo previously also contained a Next.js web client
(`KnowledgeHub-Client/`) that rendered the same vault, deployed to Vercel.
It was removed by explicit decision to keep this repo Flutter/Android-only
— its git history is still recoverable if ever needed, but no code,
docs, or conventions in this repo should reference it going forward.
