---
id: query-statistics
title: "Query Statistics"
created: 2026-07-10
modified: 2026-07-10
tags: [database, performance, query]
parent: query-execution-plan
children: []
---

# Query Statistics

## Overview

Query statistics are the metadata a database engine keeps about table and column contents — row counts, value distributions, null fractions — that the planner uses to estimate costs and choose a plan. Statistics exist because the planner never reads all the data before deciding; it guesses from a summary, and wrong or stale summaries are the single most common root cause of bad plans.

## Key Concepts

- **Row count / cardinality estimate** — planner's guess at how many rows a filter/join returns
- **Histogram** — bucketed distribution of column values, used for range and equality estimates
- **Most common values (MCV) list** — frequent values tracked explicitly for skewed columns
- **Null fraction** — share of rows with null in a column, affects filter estimates
- **Staleness** — statistics go out of date as data changes without being refreshed
- **ANALYZE / UPDATE STATISTICS** — commands that recompute statistics from a sample or full scan

## Core Knowledge

- Statistics are sampled, not exact — the engine scans a fraction of rows and extrapolates, so estimates carry inherent error
- Bulk inserts, deletes, or loads change data shape faster than autovacuum/auto-stats jobs catch up, leaving the planner blind right after
- Skewed columns (a status column that's 99% "active") need MCV tracking or the planner assumes uniform distribution and misestimates badly
- Multi-column correlations aren't captured by default — the planner assumes columns are independent unless extended/multi-column statistics are created
- After large data changes (bulk load, mass delete, restore), stats should be refreshed explicitly rather than waiting for the automatic job
- Statistics target/sample size trades planning accuracy for the cost of computing statistics — higher targets help skewed data, cost more to gather
- A "why is my simple query suddenly slow" investigation should check stats freshness before touching indexes or query text
- Cardinality misestimates compound across joins — a small error on one table can produce an order-of-magnitude error three joins deep

## Interview Questions

**Q:** What are database statistics used for?
**A:** The planner uses row counts, histograms, and value distributions to estimate how many rows each step of a query will produce, driving plan and join choice.

**Q:** Why would stats be wrong right after a big data load?
**A:** Automatic statistics jobs run periodically or on thresholds; a bulk change can outpace them, leaving the planner working from outdated distributions.

**Q:** Column is 90% one value — why does the planner still assume it's rare?
**A:** Without an MCV list or extended statistics, the planner may default to uniform-distribution assumptions and underestimate how common that value actually is.

**Q:** How do you fix a plan that regressed with no code or index change?
**A:** Refresh statistics (ANALYZE/UPDATE STATISTICS) first — data volume or shape likely changed and the planner's estimates are now stale.

## Scenario

After a nightly batch job deletes and reinserts millions of rows, a previously fast dashboard query starts timing out with no code change. EXPLAIN ANALYZE shows the planner still estimating the old, much smaller row count and picking a nested loop suited to that stale estimate. Running ANALYZE to refresh statistics lets the planner see the new row count and switch to a hash join, restoring normal performance immediately.
