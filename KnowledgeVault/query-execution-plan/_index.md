---
id: query-execution-plan
title: "Query Execution Plan"
created: 2026-07-10
modified: 2026-07-22
tags: [database, performance, query]
parent: database-indexing
children: [join-strategies, query-statistics]
status: draft
---

# Query Execution Plan

## Overview

A query execution plan is the step-by-step plan the database engine picks to run a query — which scans, joins, and sorts it uses, and in what order. It exists because SQL just says what you want, not how to get it. The database decides how, based on stats, indexes, and cost guesses. Reading plans is how you check performance claims instead of just guessing.

## Key Concepts

- **Planner/optimizer** — the part that builds and prices many possible plans, and picks the cheapest
- **Seq scan vs index scan** — reading the whole table vs using an index to jump straight to rows
- **Join strategies** — nested loop, hash join, merge join — each works best for different data shapes
- **Cost guess vs actual** — the planner's guess vs the real rows/time when the query actually runs
- **Statistics** — row counts and value spreads the planner uses to guess costs
- **EXPLAIN / EXPLAIN ANALYZE** — commands to see the guessed plan vs the real one

## Core Knowledge

- EXPLAIN shows the guessed plan without running the query; EXPLAIN ANALYZE actually runs it and shows the real rows/time — use this one to catch bad guesses
- A big gap between guessed and actual row counts is a sign of old or missing statistics — the usual cause of a bad plan
- A seq scan isn't always bad: for small tables, or queries that return most rows, it can be cheaper than an index scan
- Nested loop joins fit small outer sets; hash/merge joins fit large sets — the planner switches based on guessed sizes, and a bad guess picks the wrong one
- Plans are read bottom-up and inside-out: the deepest steps run first and feed the steps above them
- The same query can get a different plan after data grows, an index is added or removed, or statistics go stale — plans are not fixed forever
- Parameter sniffing: a plan saved for one input value can be very bad for another input with a very different value spread
- Cost numbers are relative and specific to each engine — not milliseconds — don't compare costs across different databases

## Interview Questions

**Q:** What is the difference between EXPLAIN and EXPLAIN ANALYZE?
**A:** EXPLAIN guesses the plan without running the query; EXPLAIN ANALYZE runs the query and shows real rows and timing next to the guesses.

**Q:** How do you spot a bad plan from its output?
**A:** A big gap between guessed and actual row counts, or a full table scan where an index scan was expected on a selective filter.

**Q:** Why would adding an index not change the plan?
**A:** The planner guessed the scan is still cheaper — often because of low selectivity, a small table, or old statistics that undervalue the index.

**Q:** What causes a query to suddenly get slow with no code change?
**A:** Data growth, statistics going stale, or a saved plan built for unusual input values (parameter sniffing) changing the planner's choice.

## Scenario

A query that joined orders and customers ran fast in testing but crawled in production. EXPLAIN ANALYZE showed the planner guessed 100 matching rows but actually processed 2 million, and had picked a nested loop join sized for the wrong guess. Refreshing table statistics let the planner see the real numbers and switch to a hash join, cutting the run time from minutes to seconds.
