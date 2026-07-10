---
id: covering-index
title: "Covering Index"
created: 2026-07-10
modified: 2026-07-10
tags: [database, performance, index]
parent: database-indexing
children: []
---

# Covering Index

## Overview

A covering index contains every column a query needs — filter, join, sort, and selected columns alike — so the engine answers entirely from the index and never touches the underlying table. It exists to eliminate the extra lookup step ("bookmark lookup" / "heap fetch") that a normal non-clustered index still requires, making it one of the sharpest tools for hot, read-heavy paths.

## Key Concepts

- **Index-only scan** — plan node that reads solely from the index, skipping the table
- **Key columns vs included columns** — columns that define sort order vs extra columns just carried along for coverage
- **INCLUDE clause** — syntax (Postgres, SQL Server) to add non-key columns to an index without affecting its sort order
- **Bookmark lookup / heap fetch** — the per-row trip back to the table a non-covering index still pays
- **Visibility map** — Postgres-specific mechanism that must confirm row visibility even for index-only scans

## Core Knowledge

- Turning an index covering removes the per-row table round-trip entirely — often the biggest single win available for a hot query
- Adding columns purely for coverage grows the index and its write/storage cost — apply this only to proven hot paths, not speculatively
- Key columns (used for filtering/sorting) still follow the leftmost-prefix and equality-then-range rules; included columns exist only for coverage and don't affect match logic
- A `SELECT *` defeats covering by definition — covering only pays off when the exact column set a query needs is known and narrow
- In Postgres, an index-only scan still needs the visibility map current (recent VACUUM) or it falls back to checking the heap anyway
- Wide included columns (large text/blob fields) bloat the index disproportionately — covering trades index size for lookup elimination, and that trade can go negative
- Composite indexes already covering a query's key columns just need trailing INCLUDE columns to close the gap — don't rebuild from scratch
- Verify the win with EXPLAIN: look for "Index Only Scan" (Postgres) or "covering" language in the plan, not just the index's existence

## Interview Questions

**Q:** What makes an index "covering" for a given query?
**A:** It contains every column the query references — filter, sort, and selected columns — so the engine never needs to fetch the actual table row.

**Q:** Difference between key columns and INCLUDE columns in a covering index?
**A:** Key columns define the index's sort order and support filtering/range logic; INCLUDE columns are just carried along for coverage and add no sort semantics.

**Q:** Why might an index-only scan still touch the table?
**A:** If visibility information is stale (e.g. Postgres visibility map not current after recent writes), the engine must check the heap to confirm row visibility despite the index containing all needed data.

**Q:** When is making an index covering not worth it?
**A:** When the extra included columns are wide or numerous, bloating the index for a query that isn't actually hot enough to justify the storage/write cost.

## Scenario

A user-lookup query filters by email and returns just the user's id and display name, but runs a bookmark lookup against a wide table on every call under heavy traffic. Adding id and display_name as INCLUDE columns to the existing email index turns the plan into an index-only scan, cutting per-query I/O and shaving meaningful latency off a path called on every request.
