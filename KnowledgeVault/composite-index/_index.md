---
id: composite-index
title: "Composite Index"
created: 2026-07-10
modified: 2026-07-10
tags: [database, performance, index]
parent: database-indexing
children: []
status: draft
---

# Composite Index

## Overview

A composite (multi-column) index stores keys built from two or more columns concatenated in a fixed order, sorted by the first column first, then the second, and so on. It lets a single index serve queries that filter or sort on that column combination, but its usefulness is governed entirely by column order — the same reason it's one of the most misunderstood tools in schema design.

## Key Concepts

- **Column order** — the sequence columns are declared in; defines sort order in the index
- **Leftmost-prefix rule** — only a contiguous prefix of the indexed columns can be used by a query
- **Equality vs range column** — equality columns can precede a range column usefully; a range column stops the prefix
- **Index-only scan** — trailing columns can make a composite index covering for a query
- **Cardinality ordering** — convention of putting higher-selectivity columns earlier, with exceptions
- **Redundant single-column index** — a composite index can make a separate leading-column index unnecessary

## Core Knowledge

- An index on (a, b, c) serves filters on a, on a+b, or on a+b+c — never on b alone or c alone without a
- Once a range condition appears in the column list (a > 5 AND b = ...), columns after it can't be used for further index narrowing, only post-filtering
- Equality-then-range ordering is the standard rule: put all equality-filtered columns before the one range/sort column
- Order by matching the query's ORDER BY to the trailing index columns avoids a separate sort step in the plan
- A composite index on (a, b) makes a standalone index on just (a) redundant — drop it to cut write cost, unless a is queried by itself constantly and b makes the index heavier than needed
- Column order should follow actual query patterns, not column cardinality alone — a highly selective column used rarely still shouldn't lead if most queries filter on a different column first
- Adding extra trailing columns purely to make an index covering trades a fatter index for skipping table lookups — worth it only on hot, read-heavy paths
- Too many composite indexes for every filter combination bloats write cost fast — design around the actual, measured query set, not hypothetical ones

## Interview Questions

**Q:** Index on (last_name, first_name) — does a query filtering only on first_name use it?
**A:** No — the leftmost-prefix rule means first_name alone can't use an index that isn't its leading column.

**Q:** Why does column order matter more than which columns are included?
**A:** The index is physically sorted by the first column, then the second within it — reordering changes which query shapes it can serve at all.

**Q:** Where should a range-filtered column sit in a composite index?
**A:** Last, after all equality-filtered columns — once a range condition is hit, index narrowing stops for anything after it.

**Q:** Can a composite index replace two single-column indexes?
**A:** Often yes — an index on (a, b) covers queries on a alone, making a separate index on a redundant and reducing write overhead.

## Scenario

An orders table is filtered by customer_id and status, then sorted by created_at, and the existing single-column index on customer_id forces a slow in-memory sort every time. A composite index on (customer_id, status, created_at) matches the equality columns first and the sort column last, letting the engine satisfy the filter and return pre-sorted results straight from the index — no separate sort step, no extra index to maintain.
