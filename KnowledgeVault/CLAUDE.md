# KnowledgeVault Conventions

This file is the single source of truth for authoring conventions in KnowledgeVault. The `/add-topic` skill reads this file at runtime — update it here and the skill picks it up automatically.

---

## Topic Structure

A **topic** is a folder at the root of `KnowledgeVault/` that contains an `_index.md` file. Hierarchy is expressed through frontmatter (`parent`/`children`), not through nested folders.

```
KnowledgeVault/
├── programming/
│   └── _index.md          ← root topic (parent: null)
├── javascript/
│   ├── _index.md          ← child topic (parent: programming)
│   ├── qa.md              ← sibling file (appears in switcher)
│   └── resources.md
└── javascript-async/
    └── _index.md          ← grandchild (parent: javascript)
```

---

## Naming Rules

| Thing | Convention | Example |
|---|---|---|
| Folder name | lowercase kebab-case | `javascript-async` |
| Topic id | equals folder name exactly | `javascript-async` |
| Title | human-readable, any casing | `Async / Await` |
| Sibling files | lowercase kebab-case `.md` | `qa.md`, `cheatsheet.md` |

### Case-Insensitive ID Rule

Topic ids are always lowercase kebab-case. Any casing of the same name maps to the same id:

- `"JavaScript"` → `javascript`
- `"JAvaScript"` → `javascript`
- `"React Hooks"` → `react-hooks`
- `"C++ Basics"` → `c-basics` *(special chars stripped)*

Before creating a topic, check all existing folder names case-insensitively against the derived slug.

---

## Required Frontmatter — All 7 Fields

Every `_index.md` must have exactly these fields:

```yaml
---
id: javascript-async          # must equal the folder name (lowercase kebab-case)
title: "Async / Await"        # human-readable; quote if it contains special chars
created: 2026-06-01           # YYYY-MM-DD, set once on creation
modified: 2026-06-18          # YYYY-MM-DD, update on every edit
tags: [javascript, async]     # array, never null, min 1 tag (see Tag Rules below)
parent: javascript            # folder id of direct parent, or null for root topics
children: []                  # array of direct-child folder ids; [] for leaf nodes
---
```

**Type constraints:**
- `id`, `title`: strings
- `created`, `modified`: `YYYY-MM-DD` strings
- `tags`: YAML inline array of lowercase-hyphenated strings — never `null`, never omitted
- `parent`: string id **or** the literal `null`
- `children`: YAML inline array of string ids — never `null`, never omitted (use `[]`)

---

## Bidirectionality Rule (Critical)

Parent–child links must be maintained on **both** sides. If topic B declares `parent: A`, then topic A must list `B` in its `children` array, and vice versa.

**When creating a new topic with a parent:**
1. Set `parent: <parent-id>` in the new topic's frontmatter.
2. Open the parent's `_index.md` and add the new id to its `children` array.
3. Update the parent's `modified` date.

Violating this rule breaks the tree navigation in the UI.

---

## Tag Rules

- All tags are **lowercase** and **hyphenated** (e.g. `computer-science`, not `computerScience`)
- Tags describe *what the topic is about*, not who uses it
- **No self-reference**: a topic's tags must not include its own id
  - Bad: `javascript/_index.md` with `tags: [javascript, web]` ← `javascript` is self-referencing
  - Good: `javascript/_index.md` with `tags: [programming, web, language]`
- **Inherit relevant parent tags** — pick the ones that still apply, don't copy blindly
- Aim for 2–5 tags; at least 1 is required

---

## Content Standard

The `_index.md` body (below the frontmatter) is section-wise — see `.claude/commands/add-topic.md` Step 5 for the full template:

- **~250–450 words** — complete but concise; no padding
- **Sections in order:** Overview, Key Concepts, Core Knowledge, Interview Questions (with answers), Scenario
- **One line per bullet** — depth belongs in child topics
- **No code by default** — add an `## Example` section only when explicitly requested
- No "learn more at X" filler, no repetition of the title

**Good examples in the vault:** `javascript/_index.md`, `javascript-async/_index.md`

---

## Sibling Files

Additional `.md` files in a topic folder appear in the **"Also in this topic"** switcher:

```yaml
---
title: "Q & A"    # optional; sets the switcher label (otherwise filename is humanized)
---
```

- Filename: lowercase kebab-case (e.g. `qa.md`, `resources.md`, `cheatsheet.md`)
- The `_index.md` name is reserved for the topic overview
- No required frontmatter beyond the optional `title:`

---

## Validation Checklist

Before saving a topic, verify:

- [ ] Folder name is lowercase kebab-case
- [ ] `id` in frontmatter equals the folder name exactly
- [ ] All 7 frontmatter fields are present
- [ ] `tags` is a non-empty array with no self-referencing tag
- [ ] `parent` points to a real existing topic id (or is `null`)
- [ ] `children` is an array (even if empty)
- [ ] If `parent` is set, the parent's `_index.md` lists this id in its `children`
- [ ] `created` ≤ `modified`
- [ ] Body is ~250–450 words, section-wise, with a clear overview
