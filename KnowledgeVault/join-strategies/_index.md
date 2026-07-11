---
id: join-strategies
title: "Join Strategies"
created: 2026-07-10
modified: 2026-07-10
tags: [database, performance, query]
parent: query-execution-plan
children: []
status: draft
---

# Join Strategies

## Overview

Join strategies are the physical algorithms a database engine chooses from to combine rows from two tables — the planner picks one per join based on estimated sizes, indexes, and sort order. Choosing wrong (or the planner estimating wrong) turns a millisecond join into a multi-minute one, making this the single most common cause of a "suddenly slow" query.

## Key Concepts

- **Nested loop join** — for each outer row, scan/probe the inner table
- **Hash join** — build an in-memory hash table on the smaller side, probe with the other
- **Merge join** — both sides pre-sorted (or sorted on the fly), merged in one pass
- **Outer side / inner side** — driving table vs probed table in nested loop
- **Build side / probe side** — hashed table vs streamed table in hash join
- **Join order** — sequence in which multiple tables are combined, chosen by the planner

## Core Knowledge

- Nested loop wins when the outer set is small and the inner side has a usable index — cost scales with outer rows × inner lookup cost
- Hash join wins for large, unsorted, unindexed sets — cost is roughly linear but needs memory to hold the build side
- Merge join wins when both inputs are already sorted (e.g. on indexed columns) — avoids both hashing and repeated probing
- A misestimated row count is the top cause of a wrong join choice — planner picks nested loop expecting 100 rows, gets 2 million, and it crawls
- Join order matters as much as strategy: starting with the most selective filter shrinks every downstream step
- Hash joins spill to disk when the build side exceeds available memory, silently degrading performance
- Indexes help nested loop and merge joins directly; hash joins care less about indexes and more about available memory
- Forcing a join hint overrides the planner short-term but rots as data grows — fix statistics/indexes instead of hardcoding strategy

## Interview Questions

**Q:** When does the planner prefer nested loop over hash join?
**A:** When the outer (driving) set is small and the inner table has an index to probe efficiently — cost stays low even per-row.

**Q:** Why would a hash join suddenly get slow in production?
**A:** The build side no longer fits in memory and spills to disk, turning an in-memory operation into disk I/O.

**Q:** What's the practical fix when the planner picks a bad join strategy?
**A:** Refresh statistics or add a supporting index first — hints/forcing a strategy are a short-term patch that breaks again as data shifts.

**Q:** Does join order affect correctness or only performance?
**A:** Only performance for inner joins — the planner is free to reorder; it matters because starting from the most selective table minimizes intermediate row counts.

## Scenario

A dashboard query joins a filtered subset of orders (a few hundred rows) against a large unindexed customers table, and the planner — misjudging the customers side as small — picks a hash join that spills to disk under load. Adding an index on the join key and refreshing statistics lets the planner correctly switch to a nested loop keyed off the small filtered side, dropping runtime from tens of seconds to milliseconds.
