---
id: wide-column-store
title: "Wide-Column Store"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, nosql]
parent: unstructured-database
children: [cassandra]
status: draft
---

# Wide-Column Store

## Overview

A wide-column store organizes data into rows marked by a partition key, where each row can hold a changing, sparse set of columns instead of a fixed shape — built for huge write speed and scaling out across many ordinary machines. It exists for workloads with huge, ever-growing datasets and predictable look-up-by-key patterns. Cassandra, HBase, and DynamoDB (in its wide-table mode) are examples of this space.

## Key Concepts

- **Partition key** — decides which node/shard owns a row; the single most important design choice
- **Clustering key** — sorts rows inside a partition, allowing ordered range reads within that partition
- **Column family / table** — a group of related wide rows, loosely like a table
- **Tunable consistency** — a per-query choice of how many copies must confirm a read/write
- **Wide row** — a row that can hold thousands of changing columns, common in time-series-style data
- **Compaction** — background merging of on-disk data files, freeing space from updates/deletes

## Core Knowledge

- Everything is built around the partition key: it decides both where data lives and how evenly the load spreads — a hot partition key slows one node while the rest of the cluster sits idle
- Data modeling is query-first, even more than in document stores: you usually design one table per query pattern, copying data on purpose and a lot
- Writes are optimized above reads — the storage engine (log-structured merge tree, LSM) is built for fast writes, with compaction paying the read-side cost later
- Tunable consistency (like Cassandra's quorum settings) lets each query pick its own balance of consistency, availability, and speed instead of one fixed level
- No joins, no free-form extra queries at scale — querying by anything other than the partition key means either a full scan or a kept-up secondary index/materialized view
- Deletes are often "tombstones" marking data for later removal during compaction, not removed right away — heavy delete workloads need compaction tuning
- Range queries work well inside a partition (via clustering key) but not across partitions — combining data across partitions needs a different tool or batch job
- Built to scale in a straight line by adding nodes, but reshaping/rebalancing after a poor partition key choice is a big operational job, not a simple config change

## Interview Questions

**Q:** Why is partition key choice the most important decision in this model?
**A:** It decides both where data sits and how load is spread — a skewed key piles traffic onto one node (a hot partition) no matter how big the cluster is.

**Q:** How does data modeling here differ from a document database?
**A:** It's even more query-first — usually one table per query pattern with data copied on purpose, since there's no free-form extra querying at scale.

**Q:** What is tunable consistency?
**A:** Per-operation control over how many copies must respond before a read/write counts as successful, trading consistency for speed/availability query by query.

**Q:** Why are deletes sometimes slower to free up space than expected?
**A:** Deletes are marked with tombstones and only truly removed during compaction — heavy delete workloads can bloat storage until compaction catches up.

## Scenario

A monitoring platform takes in millions of time-series metrics per second and a relational database can't keep up with the write volume even after scaling up on one machine. A wide-column store split by metric id and sorted by timestamp lets writes spread evenly across the cluster and serves the main query — "give me this metric's recent range" — as an efficient in-partition scan, at a write speed no single-machine relational engine could handle.
