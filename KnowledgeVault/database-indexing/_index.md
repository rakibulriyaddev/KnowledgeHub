---
id: database-indexing
title: "Database Indexing"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, performance]
parent: database
children: [query-execution-plan, b-tree-index, composite-index, covering-index, lsm-tree]
status: draft
---

# Database Indexing

## Overview

An index is a helper data structure that lets the database find rows without scanning the whole table — the single best tool for read speed. It trades write speed and storage space for read speed, and choosing what to index (and what not to) is a key schema-design choice in both relational and NoSQL systems.

## Key Concepts

- **B-tree index** — the default almost everywhere; supports exact matches and range scans in sorted order
- **Hash index** — exact matches only; no ranges, no order
- **Composite index** — many columns in one index; column order decides how useful it is
- **Covering index** — index holds every column the query needs, so the table is never touched
- **Clustered index** — the table itself stored in index order; one per table (e.g. InnoDB primary key)
- **Selectivity** — the share of rows a value matches; low-selectivity columns make poor indexes

## Core Knowledge

- Every index costs something on every write — insert/update/delete must update all indexes, so too many indexes slow down write-heavy tables
- Composite indexes serve only left-side matches: an index on (a, b) helps queries filtering on a or a+b, not b alone
- The planner skips an index when it thinks a scan is cheaper — old stats or low selectivity are common causes of "why isn't my index used"
- Functions or type changes on an indexed column (WHERE UPPER(name) = …) turn off the index unless a matching expression index exists
- Covering indexes remove table lookups entirely — the biggest win for busy read paths, at the cost of a bigger index
- Clustered index choice sets the physical row order; random keys (UUIDv4) cause page splits and scattering on insert
- Indexes on low-variety columns (status flags, booleans) rarely earn their cost — partial/filtered indexes handle the skewed-value case
- Check with the execution plan, not guesswork — measure before and after adding any index

## Interview Questions

**Q:** Why not index every column?
**A:** Each index slows every write and uses storage; unused indexes are pure cost with no read benefit.

**Q:** Index on (a, b) — which queries can use it?
**A:** Queries filtering on a, or a and b together (left-side rule); a filter on b alone can't use it.

**Q:** A query is slow despite an index on the column — why?
**A:** Common causes: a function/cast on the column, low selectivity making a scan cheaper, old planner stats, or a leading-wildcard LIKE.

**Q:** What is a covering index and why does it matter?
**A:** An index holding all columns a query needs; the engine answers from the index alone, skipping table lookups entirely.

## Scenario

A reporting page filters orders by customer and date range and has gone from instant to ten seconds as the table grew to millions of rows — every request scans the full table. A composite index on customer id then order date lets the engine jump right to that customer's slice and range-scan the dates; adding the few shown columns makes it covering, and the query returns in milliseconds without touching the table.
