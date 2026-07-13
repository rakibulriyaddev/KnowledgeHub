Add a new topic to KnowledgeVault following all vault conventions.

The user's input (topic name) is: $ARGUMENTS

---

## Core principles (read first — they govern every step)

1. **One request = one topic.** Add exactly the topic the user named — never silently create extra topics, sub-topics, or "helpful" siblings. A single topic cannot and should not cover everything.
2. **High-level, architect's altitude.** The topic body is an *overview*: what it is, why it exists, where it fits, its key concepts. Depth belongs in future child topics. If you feel the urge to go deep on a sub-area, that's a signal it should be a suggested child topic, not more paragraphs.
3. **Coverage through the tree, not the page.** Completeness comes from suggesting the right child/sibling topics at the end (Step 8), so the vault grows one well-scoped node at a time.
4. **Interactive.** Confirm with the user before writing any files.

---

## Step 1 — Get the topic name

If `$ARGUMENTS` is non-empty, use it as the topic name and proceed to Step 2.

If `$ARGUMENTS` is empty, ask the user:

> What topic would you like to add?

Wait for their answer, then proceed to Step 2.

**Scope check:** if the input names more than one topic (e.g. "React hooks and context"), tell the user each must be its own topic, ask which ONE to add now, and note the others as candidates for Step 8.

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
  Status   : draft                 (draft or complete)

Relevant topics (for parent / children):
  programming →  Programming
  javascript  →  JavaScript
  …

Reply with your choices, e.g.:
  Title: TypeScript
  Parent: programming
  Children: none
  Tags: [programming, web, typed, language]
  Status: draft
```

**Relevant topics list**: at most 5 entries, only topics plausibly related to the new one (candidates for parent or children) — never the full vault listing. Rank by relevance (best parent/child match first). Omit this list entirely if nothing in the vault is plausibly related.

**Status default**: always propose `draft`. Only use `complete` if the user explicitly says the topic content is already finished.

**Title default**: title-case of the raw input (`"react hooks"` → `"React Hooks"`).

**Parent suggestion logic**:
- If the slug starts with an existing topic id (e.g. `javascript-promises` → slug starts with `javascript`), propose that id as parent.
- Otherwise, if the topic is conceptually a sub-area of an existing topic (judge from titles), propose that id.
- Otherwise propose `none`.
- Read the proposed parent's `_index.md` to get its tags before generating tag suggestions.

**Children suggestion logic**:
- Scan existing topics whose `parent` field is `null` or whose id starts with `<slug>-` — these are orphan candidates. List them as suggestions if any exist; otherwise default to `none`.
- Only link *existing* topics as children. Never create new child topics in this run — missing children go to Step 8 suggestions.

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

**Frontmatter** (all 8 fields required — see `KnowledgeVault/CLAUDE.md`):

```yaml
---
id: <slug>
title: "<confirmed title>"
created: <today YYYY-MM-DD>
modified: <today YYYY-MM-DD>
tags: [<confirmed tags>]
parent: <confirmed parent id, or null>
children: [<confirmed child ids, or empty>]
status: <confirmed status, draft or complete>
---
```

**Body** — write a genuine, high-quality *overview* following the content standard in `CLAUDE.md` and the altitude rule below. The page is **section-wise**: use the fixed `##` sections below, in this order. Target reader: a 10+ year senior software engineer — assume fundamentals, focus on what actually matters at that level. Core information only, no deep explanations.

```markdown
## Overview
<2–3 sentences: what it is, why it exists, where it fits in the bigger picture>

## Key Concepts
<3–6 bullets, one line each — name the major sub-areas, breadth over depth>

## Core Knowledge
<the complete set of things a software engineer must know about THIS
 topic — cover everything essential, one line per point: tradeoffs,
 gotchas, failure modes, design decisions, when to use vs when not to.
 Completeness over brevity here, but still one-liners — 5–8 bullets>

## Interview Questions
<3–5 questions commonly asked about EXACTLY this topic — not its
 children, not the broader area. Each question followed by a concise
 1–2 line answer:
 **Q:** <question>
 **A:** <short, correct answer>>

## Scenario
<one simple, realistic problem scenario (2–3 sentences) and how this
 topic solves it (2–3 sentences) — a concrete "you'd reach for this
 when…" story, in plain prose, NO code>
```

Rules:
- Total body ~250–450 words. Every line must add value — no filler.
- **Topic-exact rule:** Core Knowledge and Interview Questions must be about *this* topic specifically. If a point or question really belongs to a sub-topic, leave it out and carry it to Step 8.
- **Altitude rule:** every bullet is *one line*, not a paragraph. If a concept, gotcha, or interview answer needs more than a sentence, it deserves its own topic — keep the one-liner here and carry it forward to Step 8.
- **No code snippets by default.** Add a code example ONLY if the user explicitly asks for one (e.g. "add code example" / "with syntax"); then append it as a final `## Example` section. The Scenario section is always prose.
- Omit a section only if genuinely inapplicable; never pad to fill one.
- Base the content on real, accurate knowledge. No placeholder text.

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

---

## Step 7 — Report what was created

```
Done! Created topic "<title>" at KnowledgeVault/<slug>/

  _index.md written with full frontmatter and content.
  <parent-id>/_index.md  → added "<slug>" to children.    (omit if no parent)
  <child-id>/_index.md   → set parent to "<slug>".        (repeat for each child)

To publish: commit and push the changed files in KnowledgeVault/ as usual.
If KnowledgeHub-Flutter/assets/vault_data.json needs the new content to show
in the Android app, re-run `dart run tool/build_vault_data.dart` there too.
```

---

## Step 8 — Gap analysis: suggest what's missing & what to add next

After reporting, always do a short coverage analysis. Think like an architect reviewing the knowledge tree:

1. **Missing children** — the major sub-areas of this topic (the one-liners from Step 5's Key Concepts / Core Knowledge sections, points excluded by the topic-exact rule, plus anything set aside in Step 1's scope check) that do NOT yet exist in the vault.
2. **Missing siblings / related topics** — topics at the same level that a reader of this topic would naturally look for next (compare against existing topics under the same parent).
3. **Prerequisites** — foundational topics this one assumes, if absent from the vault.

Present as a prioritized list (most valuable first, 3–7 items max — quality over quantity):

```
Coverage suggestions for "<title>":

  Missing sub-topics (children of <slug>):
    1. <candidate-slug>  — <one-line why it matters>
    2. …

  Related topics worth adding:
    3. <candidate-slug>  — <one-line why>

  Prerequisites not yet in vault:
    4. <candidate-slug>  — <one-line why>

  Recommended next: <the single best pick and one-sentence rationale>

Run /add-topic <name> to add any of these.
```

Skip any empty category. **Do not create these topics yourself** — suggestions only; each one is its own future `/add-topic` run.
