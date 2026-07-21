---
id: composite-index
title: "Composite Index"
created: 2026-07-10
modified: 2026-07-22
tags: [database, performance, index]
parent: database-indexing
children: []
status: draft
---

# Composite Index

## Overview

A composite (multi-column) index stores keys made from two or more columns joined in a fixed order, sorted by the first column, then the second, and so on. It lets one index serve queries that filter or sort by that combination of columns, but how useful it is depends fully on column order — this is why it is one of the most misunderstood tools in schema design.

## Key Concepts

- **Column order** — the sequence columns are declared in; defines sort order in the index
- **Leftmost-prefix rule** — a query can only use an unbroken run of the indexed columns, starting from the first one
- **Equality vs range column** — columns checked for equality can safely come before a range column; a range column ends the usable prefix
- **Index-only scan** — trailing columns can make a composite index covering for a query
- **Cardinality ordering** — the habit of putting columns with more unique values earlier, though there are exceptions
- **Redundant single-column index** — a composite index can make a separate leading-column index unnecessary

## Core Knowledge

- An index on (a, b, c) can serve filters on a, on a+b, or on a+b+c — never on b alone or c alone without a
- Once a range condition shows up in the column list (a > 5 AND b = ...), the columns after it cannot be used to narrow the index further — they only filter after the fact
- The standard rule is equality first, then range: put all columns checked for equality before the one range or sort column
- Matching the query's ORDER BY to the last index columns avoids a separate sort step in the query plan
- A composite index on (a, b) makes a plain index on just (a) unneeded — drop it to lower write cost, unless a is queried alone very often and b makes the index heavier than it needs to be
- Column order should follow the real query patterns, not just how many unique values a column has — a very selective column that is rarely used should still not come first if most queries filter on a different column first
- Adding extra columns at the end just to make an index covering trades a bigger index for skipping table lookups — worth it only for hot, read-heavy paths
- Making too many composite indexes for every possible filter combination raises write cost fast — design around your real, measured queries, not guessed ones

## Interview Questions

**Q:** Index on (last_name, first_name) — does a query filtering only on first_name use it?
**A:** No — the leftmost-prefix rule means first_name alone cannot use an index where it is not the first column.

**Q:** Why does column order matter more than which columns are included?
**A:** The index is physically sorted by the first column, then the second within it — changing the order changes which query shapes it can serve at all.

**Q:** Where should a range-filtered column sit in a composite index?
**A:** Last, after all equality-filtered columns — once a range condition is hit, the index cannot narrow further for anything after it.

**Q:** Can a composite index replace two single-column indexes?
**A:** Often yes — an index on (a, b) also covers queries on a alone, making a separate index on a unneeded and cutting write cost.

## Scenario

An orders table is filtered by customer_id and status, then sorted by created_at. The existing single-column index on customer_id forces a slow in-memory sort every time. A composite index on (customer_id, status, created_at) puts the equality columns first and the sort column last, so the engine can meet the filter and return already-sorted results straight from the index — no separate sort step, and no extra index to keep up.
