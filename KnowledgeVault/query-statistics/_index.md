---
id: query-statistics
title: "Query Statistics"
created: 2026-07-10
modified: 2026-07-22
tags: [database, performance, query]
parent: query-execution-plan
children: []
status: draft
---

# Query Statistics

## Overview

Query statistics are the extra facts a database engine keeps about the contents of tables and columns — row counts, value spreads, share of empty (null) values — that the planner uses to guess costs and pick a plan. Statistics exist because the planner never reads all the data before deciding; it guesses from a summary, and wrong or old summaries are the most common cause of bad plans.

## Key Concepts

- **Row count / row guess** — the planner's guess at how many rows a filter or join will return
- **Histogram** — a bucketed spread of column values, used to guess ranges and matches
- **Most common values (MCV) list** — frequent values tracked directly for uneven columns
- **Null share** — the share of rows with an empty value in a column, which affects filter guesses
- **Staleness** — statistics go out of date as data changes without being refreshed
- **ANALYZE / UPDATE STATISTICS** — commands that recompute statistics from a sample or a full scan

## Core Knowledge

- Statistics are sampled, not exact — the engine scans part of the rows and estimates the rest, so guesses always carry some error
- Bulk inserts, deletes, or loads change the data faster than the automatic stats job can keep up, leaving the planner blind right after
- Uneven columns (a status column that's 99% "active") need an MCV list, or the planner assumes an even spread and guesses badly
- Links between columns aren't seen by default — the planner assumes columns are unrelated unless extended, multi-column statistics are made
- After big data changes (bulk load, mass delete, restore), stats should be refreshed by hand instead of waiting for the automatic job
- The statistics target/sample size trades planning accuracy against the cost of gathering statistics — bigger targets help uneven data but cost more to collect
- A "why did my simple query suddenly get slow" check should look at stats freshness before touching indexes or the query text
- Wrong row guesses stack up across joins — a small error on one table can turn into a huge error three joins deep

## Interview Questions

**Q:** What are database statistics used for?
**A:** The planner uses row counts, histograms, and value spreads to guess how many rows each step of a query will return, which drives the plan and join choice.

**Q:** Why would stats be wrong right after a big data load?
**A:** Automatic statistics jobs run on a schedule or a threshold; a bulk change can outpace them, leaving the planner working from old numbers.

**Q:** A column is 90% one value — why does the planner still assume it's rare?
**A:** Without an MCV list or extended statistics, the planner may assume an even spread and underestimate how common that value really is.

**Q:** How do you fix a plan that got worse with no code or index change?
**A:** Refresh statistics (ANALYZE/UPDATE STATISTICS) first — the data volume or shape likely changed and the planner's guesses are now old.

## Scenario

After a nightly batch job deletes and reinserts millions of rows, a once-fast dashboard query starts timing out with no code change. EXPLAIN ANALYZE shows the planner still guessing the old, much smaller row count and picking a nested loop that fits that old guess. Running ANALYZE to refresh statistics lets the planner see the new row count and switch to a hash join, fixing performance right away.
