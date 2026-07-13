# KnowledgeVault

The content layer of KnowledgeHub — a flat collection of Markdown topics linked by frontmatter.

## Structure

Each topic is a folder at the root of this directory containing an `_index.md` file. Hierarchy (parent / child relationships) is expressed through frontmatter fields, not through nested folders.

```
KnowledgeVault/
├── CLAUDE.md               ← authoring conventions (read this first)
├── system-design/
│   └── _index.md           ← root topic
├── networking/
│   └── _index.md           ← child of system-design
├── tcp/
│   ├── _index.md           ← child of networking
│   ├── deep-dive.md        ← sibling file (appears in topic switcher)
│   └── qa.md
└── udp/
    └── _index.md           ← child of networking
```

## Conventions

All authoring rules — naming, required frontmatter fields, bidirectionality, tags, content length — are documented in **[CLAUDE.md](CLAUDE.md)**. Read it before creating or editing topics.

## Adding a topic

The fastest way is the `/add-topic` slash command in Claude Code:

```
/add-topic React
```

It derives the slug, checks for collisions, asks for title / parent / children / tags in one step, writes the `_index.md` with real content, and fixes parent–child bidirectionality automatically.

Alternatively, create or edit files by hand directly in this folder, following the conventions in [CLAUDE.md](CLAUDE.md) — including the `status: draft | complete` field.

## Publishing

There is no in-app authoring. Content changes are local until you commit and push them with git as usual (the `KnowledgeHub-Flutter` app only reads the vault; it never writes to it, and needs `dart run tool/build_vault_data.dart` re-run to pick up changes).
