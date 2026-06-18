Add a new topic to KnowledgeVault following all vault conventions.

The user's input (topic name) is: $ARGUMENTS

---

## Your job

Follow each step in order. Do not skip steps. Be interactive — confirm with the user before writing any files.

---

## Step 1 — Get the topic name

If `$ARGUMENTS` is non-empty, use it as the topic name and proceed to Step 2.

If `$ARGUMENTS` is empty, ask the user:

> What topic would you like to add?

Wait for their answer, then proceed to Step 2.

---

## Step 2 — Read vault conventions

Read the file `KnowledgeVault/CLAUDE.md`. This is your authoritative reference for all naming rules, frontmatter requirements, tag conventions, and content standards. Apply it throughout this workflow.

---

## Step 3 — Derive and validate the slug

Convert the topic name to a lowercase kebab-case slug (the canonical topic id):
- Lowercase everything
- Replace spaces and underscores with hyphens
- Strip characters that are not `a-z`, `0-9`, or `-`
- Collapse consecutive hyphens to one
- Trim leading/trailing hyphens

Examples: `"React Hooks"` → `react-hooks`, `"TypeScript"` → `typescript`, `"C++ Basics"` → `c-basics`

Then list all folders in `KnowledgeVault/` and compare each folder name case-insensitively against the derived slug.

- **If a match is found**: tell the user the topic already exists (show the matching folder name), and ask if they want to edit it instead. Stop here unless they give a different name.
- **If no match**: continue to Step 4.

---

## Step 4 — Single metadata prompt (one message, one reply)

Read all existing `KnowledgeVault/<folder>/_index.md` files to get every topic's id and title.

Compute smart defaults for each field (rules below), then send **one single message** that shows the proposed values and lists the available options. Wait for the user's **one reply** that covers all fields before proceeding. Do not ask about title, parent, children, or tags in separate follow-up messages.

Use this exact format:

```
New topic: `<slug>`

  Title    : <proposed title>
  Parent   : <proposed parent id>  (or "none")
  Children : none                  (list existing topic ids to link, or "none")
  Tags     : [<proposed tags>]

Available topics (for parent / children):
  none        →  (root, no parent)
  programming →  Programming
  javascript  →  JavaScript
  …

Reply with your choices, e.g.:
  Title: TypeScript
  Parent: programming
  Children: none
  Tags: [programming, web, typed, language]
```

**Title default**: title-case of the raw input (`"react hooks"` → `"React Hooks"`).

**Parent suggestion logic**:
- If the slug starts with an existing topic id (e.g. `javascript-promises` → slug starts with `javascript`), propose that id as parent.
- Otherwise propose `none`.
- Read the proposed parent's `_index.md` to get its tags before generating tag suggestions.

**Children suggestion logic**:
- Scan existing topics whose `parent` field is `null` or whose id starts with `<slug>-` — these are orphan candidates. List them as suggestions if any exist; otherwise default to `none`.

**Tag suggestion logic**:
- Inherit tags from the chosen parent that still apply to this topic.
- Add 1–2 keyword tags derived from the topic name.
- Drop any tag that equals the new topic's own slug (no self-referencing).
- Propose 2–4 tags.

Wait for the user's single reply, then proceed to Step 5.

---

## Step 5 — Write the new topic

Create the folder `KnowledgeVault/<slug>/` if it does not exist.

Write `KnowledgeVault/<slug>/_index.md` with:

**Frontmatter** (all 7 fields required — see `KnowledgeVault/CLAUDE.md`):

```yaml
---
id: <slug>
title: "<confirmed title>"
created: <today YYYY-MM-DD>
modified: <today YYYY-MM-DD>
tags: [<confirmed tags>]
parent: <confirmed parent id, or null>
children: []
---
```

**Body** — write a genuine, high-quality overview following the content standard in `CLAUDE.md`:
- 100–250 words
- Brief overview paragraph (what it is, why it matters)
- Key concepts list (3–6 bullet points)
- Minimal code example if the topic has syntax (one focused snippet)
- No filler, no padding — every sentence must add value

Base the content on real, accurate knowledge of the topic. Do not write placeholder text.

---

## Step 6 — Fix bidirectionality (update parent and children)

This step is critical. The in-app authoring UI skips both of these updates, which breaks tree navigation. Always do them here.

**6a — Update the parent (if parent ≠ null):**
1. Read the parent's `_index.md` in full.
2. Add `<slug>` to the end of its `children` array.
3. Set its `modified` to today.
4. Write it back — preserve everything else exactly.

**6b — Update each declared child (if children were specified):**
For every id the user listed in Children:
1. Read that topic's `_index.md` in full.
2. Set its `parent` field to `<slug>`.
3. Set its `modified` to today.
4. Write it back — preserve everything else exactly.

Also update Step 5's frontmatter: the `children:` line should list the user-confirmed child ids instead of `[]`.

---

## Step 7 — Done

Report what was created:

```
Done! Created topic "<title>" at KnowledgeVault/<slug>/

  _index.md written with full frontmatter and content.
  <parent-id>/_index.md  → added "<slug>" to children.    (omit if no parent)
  <child-id>/_index.md   → set parent to "<slug>".        (repeat for each child)

To publish: open the app (npm run dev in KnowledgeHub-Client), make any
edits you want, then click Save and enter a commit message.
```
