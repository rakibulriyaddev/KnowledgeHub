---
id: b-tree-index
title: "B-Tree Index"
created: 2026-07-10
modified: 2026-07-22
tags: [database, performance, index]
parent: database-indexing
children: []
status: draft
---

# B-Tree Index

## Overview

A B-tree (balanced tree) index is the default index structure in almost every relational database — it keeps keys sorted across a shallow, self-balancing tree so both exact-match and range lookups cost about the same small number of page reads. It's the workhorse behind primary keys, foreign keys, and most WHERE/ORDER BY speed-ups.

## Key Concepts

- **Node / page** — fixed-size block holding sorted keys and pointers; the unit of disk I/O
- **Leaf level** — bottom row of the tree, holding the real key values (and row pointers or data)
- **Fan-out** — number of children per node; high fan-out keeps the tree shallow
- **Balanced** — all leaves sit at the same depth, so lookup cost is the same everywhere
- **Range scan** — leaf nodes linked in sorted order, letting the engine walk a range without searching the tree again
- **Fill factor / page split** — how full pages are kept, and what happens when an insert doesn't fit

## Core Knowledge

- Lookup cost is O(log n) page reads, and high fan-out keeps that number small even at billions of rows — usually 3-4 levels deep
- Leaves are linked in sorted order, so a range query (BETWEEN, >, ORDER BY) walks forward through leaves instead of searching the tree again
- Insert order matters: keys in order (auto-increment) get added cleanly; random keys (UUIDv4) scatter inserts and cause frequent page splits and fragmenting
- A page split copies half a node's contents to a new page when an insert doesn't fit — this costs time and briefly lowers fill efficiency
- Exact-match and range queries both do well; B-tree is the general-purpose choice unless the workload is only exact-match lookups (where hash indexes can do a bit better)
- Leftmost-prefix rule for multi-column B-trees: the tree is sorted by the first column first, so only queries using a leading part of the columns can use it
- Columns with low selectivity (few distinct values) waste a B-tree's strength — the tree still narrows to a few pages, but if most rows match anyway, a full scan is cheaper
- Rebuilding/reindexing now and then gets back space and fixes fragmenting from heavy write activity and page splits

## Interview Questions

**Q:** Why is B-tree the default index type over hash?
**A:** It handles both exact-match and range/order queries well, while hash indexes only handle exact-match — B-tree is more broadly useful for typical query patterns.

**Q:** What does "balanced" guarantee in a B-tree?
**A:** Every leaf is at the same depth, so lookup cost stays the same no matter which key is searched.

**Q:** Why do random primary keys (UUIDs) hurt B-tree performance?
**A:** Inserts scatter across the tree instead of adding at the end, causing frequent page splits and pages that are fragmented and less cache-friendly.

**Q:** How does a B-tree serve a range query well?
**A:** It goes down once to the starting key, then walks the linked leaf level forward — no repeated tree searching per row.

## Scenario

A table uses random UUIDs as primary keys, and over months of heavy inserts the index grows bloated and range queries on recent rows slow down noticeably. Looking into it shows constant page splits scattering related rows across disk, ruining locality. Switching to a key added in order (or a sortable UUID version) for insert order, plus reindexing now and then, brings back compact pages and fast range scans.
