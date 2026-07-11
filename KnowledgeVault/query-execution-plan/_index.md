---
id: query-execution-plan
title: "Query Execution Plan"
created: 2026-07-10
modified: 2026-07-10
tags: [database, performance, query]
parent: database-indexing
children: [join-strategies, query-statistics]
status: draft
---

# Query Execution Plan

## Overview

A query execution plan is the step-by-step strategy the database engine picks to run a query — which scans, joins, and sorts it uses and in what order. It exists because SQL is declarative: you state what you want, and the planner decides how, based on statistics, indexes, and cost estimates. Reading plans is how performance claims get verified instead of guessed.

## Key Concepts

- **Planner/optimizer** — component that generates and costs candidate plans, picks the cheapest
- **Seq scan vs index scan** — full-table read vs indexed lookup
- **Join strategies** — nested loop, hash join, merge join — each fits different data shapes
- **Cost estimate vs actual** — planner's prediction vs real rows/time when actually executed
- **Statistics** — row counts, value distributions the planner uses to estimate costs
- **EXPLAIN / EXPLAIN ANALYZE** — commands to view estimated vs actual plans

## Core Knowledge

- EXPLAIN shows the estimated plan without running the query; EXPLAIN ANALYZE actually runs it and shows real rows/time — use the latter to catch bad estimates
- A big gap between estimated and actual row counts signals stale or missing statistics — the usual root cause of a bad plan
- Seq scan isn't inherently bad: for small tables or queries returning most rows, it's cheaper than an index scan
- Nested loop joins suit small outer sets; hash/merge joins suit large sets — the planner switches based on estimated sizes, and a bad estimate picks the wrong one
- Plans are read bottom-up and inside-out: innermost/deepest operations execute first, feeding outward
- The same query can get a different plan after data grows, an index is added/dropped, or statistics go stale — plans aren't fixed forever
- Parameter sniffing: a plan cached for one parameter value can be terrible for another with a very different value distribution
- Cost units are relative, engine-specific numbers — not milliseconds — don't compare costs across different databases

## Interview Questions

**Q:** Difference between EXPLAIN and EXPLAIN ANALYZE?
**A:** EXPLAIN estimates the plan without executing; EXPLAIN ANALYZE runs the query and reports actual rows and timing alongside the estimates.

**Q:** How do you spot a bad plan from its output?
**A:** Large divergence between estimated and actual row counts, or a seq scan where an index scan was expected on a selective filter.

**Q:** Why would adding an index not change the plan?
**A:** The planner estimated the scan is still cheaper — often due to low selectivity, small table size, or stale statistics undervaluing the index.

**Q:** What causes a query to suddenly get slow with no code change?
**A:** Data growth, statistics going stale, or a cached plan built for atypical parameter values (parameter sniffing) shifting the optimizer's choice.

## Scenario

A query that joined orders and customers ran fast in testing but crawled in production. EXPLAIN ANALYZE showed the planner estimated 100 matching rows but actually processed 2 million, having picked a nested loop join sized for the wrong estimate. Refreshing table statistics let the planner see the real distribution and switch to a hash join, cutting runtime from minutes to seconds.
