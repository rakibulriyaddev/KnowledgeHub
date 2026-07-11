---
id: indexes
title: "Database Indexes"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, performance, data-structures, query-optimization]
parent: sd-databases
children: []
status: draft
---

## Overview

A database index is a data structure — usually a B-tree — that keeps column values sorted so queries can find rows without scanning the whole table. It trades extra storage and slower writes for dramatically faster reads, the same trade-off as adding an index to the back of a book.

## Key Concepts

- Full table scan vs indexed lookup (O(N) vs O(log N)).
- Index types — B-tree, hash, composite, unique, full-text, partial, covering.
- Left-most prefix rule for composite indexes.
- Clustered vs non-clustered index.
- EXPLAIN for verifying index usage.
- Cost of indexes — storage, write overhead, maintenance.

## Core Knowledge

Without an index, a query scans every row; with a B-tree index on the filtered column, lookups drop to roughly log(N) comparisons — about 20 for a million rows. B-tree is the general-purpose default, good for equality and range queries (BETWEEN, >, <, ORDER BY). Hash indexes give O(1) equality lookups but cannot support ranges or sorting. Composite (multi-column) indexes only serve queries that use columns starting from the left-most column in the index definition — a query filtering only on the second column skips the index entirely. Covering indexes hold every column a query needs, enabling an index-only scan that avoids touching the table at all. Clustered indexes (one per table, usually the primary key) physically order the table's rows to match the index, making range scans very fast; non-clustered (secondary) indexes are separate structures pointing back to rows, and a table can have many.

Indexing is a trade-off, not a free win: every INSERT/UPDATE/DELETE must also update each index, so write-heavy tables suffer with too many indexes (each index typically costs 10-30% of the table's storage). Don't index small tables (a full scan is already fast), low-cardinality columns like booleans (no better than a scan), or rarely-queried columns. Good candidates are WHERE, JOIN, ORDER BY, GROUP BY, and foreign-key columns, ordered in composite indexes from highest to lowest selectivity. EXPLAIN reveals whether the planner actually used an index — an index existing doesn't guarantee it gets used. Stale statistics (via ANALYZE) can also cause the planner to pick a bad plan even with correct indexes in place.

## Interview Questions

**Q: Why doesn't a hash index support range queries?**
A: A hash function scatters values with no ordering relationship, so there's no way to walk from one value to the next in sequence — only exact-match lookups work.

**Q: What is the left-most prefix rule?**
A: In a composite index on (a, b, c), the index can only be used if the query filters on a, or on a+b, or on a+b+c — filtering on b or c alone skips the index.

**Q: When would you avoid adding an index?**
A: On write-heavy tables where the write cost outweighs the read benefit, on small tables where a full scan is already fast, and on low-cardinality columns like booleans.

## Scenario

A `users` table with a million rows grinds to a halt on `SELECT * FROM users WHERE email = ?`. Adding a unique B-tree index on `email` turns a full table scan into a ~20-comparison lookup, at the cost of slightly slower inserts and roughly 10-30% extra storage for the index itself.
