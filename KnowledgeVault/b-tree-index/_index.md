---
id: b-tree-index
title: "B-Tree Index"
created: 2026-07-10
modified: 2026-07-10
tags: [database, performance, index]
parent: database-indexing
children: []
---

# B-Tree Index

## Overview

A B-tree (balanced tree) index is the default index structure in almost every relational database — it keeps keys sorted across a shallow, self-balancing tree so equality and range lookups both cost roughly the same, small number of page reads. It's the workhorse behind primary keys, foreign keys, and most WHERE/ORDER BY acceleration.

## Key Concepts

- **Node / page** — fixed-size block holding sorted keys and pointers; unit of disk I/O
- **Leaf level** — bottom row of the tree, holding actual key values (and row pointers or data)
- **Fan-out** — number of children per node; high fan-out keeps the tree shallow
- **Balanced** — all leaves sit at the same depth, so lookup cost is uniform
- **Range scan** — leaf nodes linked in sorted order, letting the engine walk a range without re-traversing
- **Fill factor / page split** — how full pages are kept and what happens when an insert doesn't fit

## Core Knowledge

- Lookup cost is O(log n) page reads, and high fan-out keeps that log small even at billions of rows — typically 3-4 levels deep
- Leaves are linked in sorted order, so a range query (BETWEEN, >, ORDER BY) walks forward through leaves instead of re-searching the tree
- Insert order matters: sequential keys (auto-increment) append cleanly; random keys (UUIDv4) scatter inserts and cause frequent page splits and fragmentation
- A page split copies half a node's contents to a new page when an insert overflows it — costs time and temporarily reduces fill efficiency
- Equality and range queries both perform well; B-tree is the general-purpose choice unless the workload is exclusively equality lookups (where hash indexes can edge it out)
- Leftmost-prefix rule for composite B-trees: the tree is sorted by the first column first, so only queries using a leading prefix of the columns can use it
- Low-selectivity columns waste a B-tree's strength — the tree still narrows to few pages, but if most rows match anyway, a scan is cheaper
- Rebuilding/reindexing periodically reclaims space and fixes fragmentation from heavy write churn and page splits

## Interview Questions

**Q:** Why is B-tree the default index type over hash?
**A:** It supports both equality and range/order queries efficiently, while hash indexes only handle equality — B-tree is more broadly useful for typical query patterns.

**Q:** What does "balanced" guarantee in a B-tree?
**A:** Every leaf is at the same depth, so lookup cost is consistent regardless of which key is searched.

**Q:** Why do random primary keys (UUIDs) hurt B-tree performance?
**A:** Inserts scatter across the tree instead of appending at the end, causing frequent page splits and fragmented, less cache-friendly pages.

**Q:** How does a B-tree serve a range query efficiently?
**A:** It descends once to the starting key, then walks the linked leaf level forward — no repeated tree traversal per row.

## Scenario

A table uses random UUIDs as primary keys, and over months of heavy inserts the index bloats and range queries on recent rows slow down noticeably. Investigation shows constant page splits scattering related rows across disk, destroying locality. Switching to a sequential key (or a sortable UUID variant) for insert order, plus a periodic reindex, restores compact pages and fast range scans.
