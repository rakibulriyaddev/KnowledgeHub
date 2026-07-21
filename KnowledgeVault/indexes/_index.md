---
id: indexes
title: "Database Indexes"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, performance, data-structures, query-optimization]
parent: sd-databases
children: []
status: draft
---

## Overview

A database index is a data structure — usually a B-tree — that keeps column values in order so queries can find rows without checking the whole table. It trades extra storage and slower writes for much faster reads, the same trade-off as adding an index to the back of a book.

## Key Concepts

- Full table scan vs indexed lookup (checking every row vs a fast search).
- Index types — B-tree, hash, multi-column, unique, full-text, partial, covering.
- Left-most rule for multi-column indexes.
- Clustered vs non-clustered index.
- EXPLAIN to check if an index is actually used.
- Cost of indexes — storage, write overhead, upkeep.

## Core Knowledge

Without an index, a query checks every row; with a B-tree index on the filtered column, lookups drop to roughly log(N) checks — about 20 for a million rows. B-tree is the general-purpose default, good for exact matches and range checks (BETWEEN, >, <, ORDER BY). Hash indexes give instant exact matches but can't handle ranges or sorting. Multi-column indexes only help queries that use columns starting from the left-most column in the index — a query filtering only on the second column skips the index entirely. Covering indexes hold every column a query needs, so the database can answer from the index alone without touching the table. Clustered indexes (one per table, usually the primary key) store the table's rows in the same order as the index, making range scans very fast; non-clustered (secondary) indexes are separate structures that point back to rows, and a table can have many of these.

Indexing is a trade-off, not free: every INSERT/UPDATE/DELETE must also update each index, so write-heavy tables suffer if there are too many indexes (each one usually costs 10-30% of the table's storage). Don't index small tables (a full scan is already fast), columns with few unique values like true/false fields (no better than a scan), or columns rarely searched on. Good picks are WHERE, JOIN, ORDER BY, GROUP BY, and foreign-key columns, ordered in multi-column indexes from most to least selective. EXPLAIN shows whether the planner actually used an index — having one doesn't guarantee it gets used. Old statistics (fixed by ANALYZE) can also make the planner pick a bad plan even when the right indexes exist.

## Interview Questions

**Q: Why doesn't a hash index support range queries?**
A: A hash function scatters values with no order between them, so there's no way to step from one value to the next in order — only exact matches work.

**Q: What is the left-most rule?**
A: In a multi-column index on (a, b, c), the index only helps if the query filters on a, or on a+b, or on a+b+c — filtering on b or c alone skips the index.

**Q: When would you avoid adding an index?**
A: On write-heavy tables where the write cost is bigger than the read gain, on small tables where a full scan is already fast, and on columns with few unique values like true/false fields.

## Scenario

A `users` table with a million rows slows to a crawl on `SELECT * FROM users WHERE email = ?`. Adding a unique B-tree index on `email` turns a full table scan into a ~20-check lookup, at the cost of slightly slower inserts and roughly 10-30% extra storage for the index itself.
