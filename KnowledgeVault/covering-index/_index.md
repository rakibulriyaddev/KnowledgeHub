---
id: covering-index
title: "Covering Index"
created: 2026-07-10
modified: 2026-07-22
tags: [database, performance, index]
parent: database-indexing
children: []
status: draft
---

# Covering Index

## Overview

A covering index holds every column a query needs — filter, join, sort, and selected columns alike — so the engine answers fully from the index and never touches the actual table. It exists to remove the extra lookup step (a "bookmark lookup" or "heap fetch") that a normal non-clustered index still needs. This makes it one of the best tools for hot, read-heavy paths.

## Key Concepts

- **Index-only scan** — plan node that reads solely from the index, skipping the table
- **Key columns vs included columns** — columns that define sort order vs extra columns just carried along for coverage
- **INCLUDE clause** — syntax (Postgres, SQL Server) to add non-key columns to an index without affecting its sort order
- **Bookmark lookup / heap fetch** — the per-row trip back to the table a non-covering index still pays
- **Visibility map** — Postgres-specific mechanism that must confirm row visibility even for index-only scans

## Core Knowledge

- Making an index covering removes the per-row round trip to the table entirely — often the single biggest win you can get for a hot query
- Adding columns just for coverage makes the index bigger and raises its write and storage cost — only do this for paths proven to be hot, not just guessed ones
- Key columns (used for filtering and sorting) still follow the leftmost-prefix rule and the equality-then-range rule; included columns exist only for coverage and do not affect how matching works
- A `SELECT *` defeats covering by its very nature — covering only helps when the exact, narrow set of columns a query needs is known
- In Postgres, an index-only scan still needs the visibility map to be up to date (a recent VACUUM), or it falls back to checking the table anyway
- Wide included columns (big text or blob fields) make the index grow much more than expected — covering trades index size for skipping lookups, and that trade can turn out badly
- A composite index that already covers a query's key columns just needs INCLUDE columns added at the end to close the gap — no need to rebuild it from scratch
- Check the win with EXPLAIN: look for "Index Only Scan" (Postgres) or "covering" wording in the plan, not just whether the index exists

## Interview Questions

**Q:** What makes an index "covering" for a given query?
**A:** It contains every column the query needs — filter, sort, and selected columns — so the engine never has to fetch the actual table row.

**Q:** Difference between key columns and INCLUDE columns in a covering index?
**A:** Key columns set the index's sort order and support filtering and range logic; INCLUDE columns are just carried along for coverage and add no sort meaning.

**Q:** Why might an index-only scan still touch the table?
**A:** If visibility information is out of date (for example, Postgres's visibility map is not current after recent writes), the engine must check the table to confirm row visibility even though the index has all the needed data.

**Q:** When is making an index covering not worth it?
**A:** When the extra included columns are wide or many, making the index bigger for a query that is not actually hot enough to justify the storage and write cost.

## Scenario

A user-lookup query filters by email and returns only the user's id and display name, but it runs a bookmark lookup against a wide table on every call under heavy traffic. Adding id and display_name as INCLUDE columns to the existing email index turns the plan into an index-only scan, cutting I/O on every query and shaving real delay off a path called on every request.
