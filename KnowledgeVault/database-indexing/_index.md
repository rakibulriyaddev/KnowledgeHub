---
id: database-indexing
title: "Database Indexing"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage, performance]
parent: database
children: []
---

# Database Indexing

## Overview

An index is an auxiliary data structure that lets the database locate rows without scanning the whole table — the single highest-leverage tool for read performance. It trades write speed and storage for read speed, and choosing what to index (and what not to) is a core schema-design decision in both relational and NoSQL systems.

## Key Concepts

- **B-tree index** — the default almost everywhere; supports equality and range scans in sorted order
- **Hash index** — equality lookups only; no ranges, no ordering
- **Composite index** — multiple columns in one index; column order determines usability
- **Covering index** — index contains every column the query needs, so the table is never touched
- **Clustered index** — the table itself stored in index order; one per table (e.g. InnoDB primary key)
- **Selectivity** — fraction of rows a value matches; low-selectivity columns make poor indexes

## Core Knowledge

- Every index taxes every write — insert/update/delete must maintain all indexes, so over-indexing degrades write-heavy tables
- Composite indexes serve leftmost prefixes only: an index on (a, b) helps queries filtering a or a+b, not b alone
- The planner ignores an index when it estimates a scan is cheaper — stale statistics or low selectivity commonly cause "why isn't my index used"
- Functions or type casts on an indexed column (WHERE UPPER(name) = …) disable the index unless a matching expression index exists
- Covering indexes eliminate table lookups entirely — the biggest win for hot read paths, at the cost of a fatter index
- Clustered index choice dictates physical row order; random keys (UUIDv4) cause page splits and fragmentation on insert
- Indexes on low-cardinality columns (status flags, booleans) rarely pay for themselves — partial/filtered indexes handle the skewed-value case
- Verify with the execution plan, not intuition — measure before and after adding any index

## Interview Questions

**Q:** Why not index every column?
**A:** Each index slows every write and consumes storage; unused indexes are pure cost with zero read benefit.

**Q:** Index on (a, b) — which queries can use it?
**A:** Queries filtering on a, or a and b together (leftmost-prefix rule); a filter on b alone cannot use it.

**Q:** Query is slow despite an index on the column — why?
**A:** Common causes: function/cast on the column, low selectivity making a scan cheaper, stale planner statistics, or a leading-wildcard LIKE.

**Q:** What is a covering index and why does it matter?
**A:** An index containing all columns a query needs; the engine answers from the index alone, skipping table lookups entirely.

## Scenario

A reporting page filters orders by customer and date range and has grown from instant to ten seconds as the table reached millions of rows — every request scans the full table. A composite index on customer id then order date lets the engine jump straight to that customer's slice and range-scan the dates; adding the few displayed columns makes it covering, and the query returns in milliseconds without touching the table.
