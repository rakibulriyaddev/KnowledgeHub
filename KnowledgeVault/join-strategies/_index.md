---
id: join-strategies
title: "Join Strategies"
created: 2026-07-10
modified: 2026-07-22
tags: [database, performance, query]
parent: query-execution-plan
children: []
status: draft
---

# Join Strategies

## Overview

Join strategies are the actual methods a database engine picks from to combine rows from two tables — the planner picks one per join based on guessed sizes, indexes, and sort order. Picking the wrong one (or the planner guessing wrong) turns a millisecond join into a multi-minute one, making this the single most common reason a query "suddenly gets slow."

## Key Concepts

- **Nested loop join** — for each row on one side, check/search the other table
- **Hash join** — build an in-memory lookup table on the smaller side, check it with the other
- **Merge join** — both sides already sorted (or sorted on the spot), combined in one pass
- **Outer side / inner side** — the driving table vs the table being searched in nested loop
- **Build side / probe side** — the table turned into a lookup table vs the table streamed through in hash join
- **Join order** — the order in which several tables get combined, picked by the planner

## Core Knowledge

- Nested loop wins when the outer set is small and the inner side has a usable index — cost grows with outer rows x inner lookup cost
- Hash join wins for large, unsorted, un-indexed sets — cost grows roughly straight-line but needs memory to hold the build side
- Merge join wins when both sides are already sorted (e.g. on indexed columns) — avoids both building a lookup table and repeated checking
- A wrong guess on row count is the top reason for a bad join choice — planner picks nested loop expecting 100 rows, gets 2 million, and it crawls
- Join order matters as much as strategy: starting with the most narrowing filter shrinks every step after it
- Hash joins spill to disk when the build side is bigger than available memory, quietly making things slower
- Indexes help nested loop and merge joins directly; hash joins care less about indexes and more about available memory
- Forcing a join hint fixes the planner's choice short-term but goes stale as data grows — fix statistics/indexes instead of hardcoding the strategy

## Interview Questions

**Q:** When does the planner prefer nested loop over hash join?
**A:** When the outer (driving) set is small and the inner table has an index to search quickly — cost stays low even per row.

**Q:** Why would a hash join suddenly get slow in production?
**A:** The build side no longer fits in memory and spills to disk, turning an in-memory step into disk reads and writes.

**Q:** What's the practical fix when the planner picks a bad join strategy?
**A:** Refresh statistics or add a supporting index first — hints/forcing a strategy are a short-term patch that breaks again as data changes.

**Q:** Does join order affect correctness or only speed?
**A:** Only speed for inner joins — the planner is free to reorder; it matters because starting from the most narrowing table cuts down in-between row counts.

## Scenario

A dashboard query joins a filtered subset of orders (a few hundred rows) against a large un-indexed customers table, and the planner — wrongly guessing the customers side is small — picks a hash join that spills to disk under load. Adding an index on the join key and refreshing statistics lets the planner correctly switch to a nested loop built off the small filtered side, dropping runtime from tens of seconds to milliseconds.
