# KnowledgeVault

The content layer of KnowledgeHub — a flat collection of Markdown topics linked by frontmatter.

## Structure

Each topic is a folder at the root of this directory containing an `_index.md` file. Hierarchy (parent / child relationships) is expressed through frontmatter fields, not through nested folders.

```
KnowledgeVault/
├── CLAUDE.md               ← authoring conventions (read this first)
├── programming/
│   └── _index.md           ← root topic
├── javascript/
│   ├── _index.md           ← child of programming
│   ├── qa.md               ← sibling file (appears in topic switcher)
│   └── resources.md
├── javascript-async/
│   └── _index.md           ← child of javascript
└── javascript-promises/
    └── _index.md           ← child of javascript
```

## Conventions

All authoring rules — naming, required frontmatter fields, bidirectionality, tags, content length — are documented in **[CLAUDE.md](CLAUDE.md)**. Read it before creating or editing topics.

## Adding a topic

The fastest way is the `/add-topic` slash command in Claude Code:

```
/add-topic React
```

It derives the slug, checks for collisions, asks for title / parent / children / tags in one step, writes the `_index.md` with real content, and fixes parent–child bidirectionality automatically.

Alternatively, use the **Add Knowledge** button in the web app (`npm run dev` in `KnowledgeHub-Client/`), then edit the generated `_index.md` by hand to fill in `parent`, `children`, and `tags`.

## Publishing

Content changes are local until you commit. In the web app, click **Save**, enter a commit message, and the app stages + pushes all pending vault changes to the `development` branch.
