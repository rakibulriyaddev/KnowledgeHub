---
id: database-sharding
title: "Database Sharding"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, scalability]
parent: database
children: []
status: draft
---

# Database Sharding

## Overview

Sharding splits a dataset across many separate database nodes, each holding part of the data, so no single node needs to store or serve all of it. It matters because replication alone scales reads, not writes or total data size — sharding is the lever for growing writes and storage across many machines. It's the partner to replication, and the two are usually used together.

## Key Concepts

- **Shard** — one separate slice of the dataset, usually its own database instance
- **Shard key** — the field(s) that decide which shard a given row/document lives on
- **Routing** — logic (in the app, a proxy, or the engine) that sends a query to the right shard
- **Rebalancing / resharding** — spreading data out again when the shard count or key changes
- **Cross-shard query** — a query touching data on more than one shard, always more costly
- **Hot shard** — a shard getting more than its share of load due to an uneven key spread

## Core Knowledge

- The shard key choice is the single biggest decision — it decides write spread, query routing speed, and hot-shard risk, and is costly to change later
- Range-based sharding keeps sortable closeness but risks hot shards on in-order keys (like timestamps); hash-based sharding spreads load evenly but loses range-scan closeness
- Cross-shard joins/transactions are either not supported, slow, or need the app to fan out and merge results itself — schema design should avoid needing them
- Reshaping an existing large sharded cluster is a major task, not a config change — this is why shard key choice is treated as close to permanent
- Sharding adds real extra work (more nodes, more ways to fail, cross-shard consistency) — it's a scale lever used after replication and bigger machines run out, not a default choice
- Sharding and replication are usually stacked together: each shard is itself a set of replicas, giving both write scale and per-shard uptime
- Some databases (MongoDB, Cassandra) have built-in sharding; relational engines often need outside tools or app-level sharding logic
- Uneven data or access patterns across shards (hot keys, skewed tenants) can ruin sharding's benefit even with a reasonable key choice

## Interview Questions

**Q:** Why doesn't replication alone solve write scale?
**A:** Replicas serve reads but writes still funnel through the primary; sharding is what actually splits write load across separate nodes.

**Q:** What's the trade-off between range-based and hash-based shard keys?
**A:** Range-based keeps ordered closeness for range scans but risks hot shards on in-order keys; hash-based spreads load evenly but loses range-scan speed.

**Q:** Why are cross-shard transactions avoided in schema design?
**A:** They need coordination across separate nodes (often two-phase commit or app-level fan-out), which is slower and more failure-prone than a single-shard transaction.

**Q:** Why is changing a shard key seen as a major task rather than routine?
**A:** It needs spreading out existing data across a live cluster (resharding), which uses a lot of resources and carries real risk at scale.

## Scenario

A multi-tenant SaaS product shards by tenant id, and one big enterprise tenant grows far larger than the rest, overloading its shard while others sit idle. Moving that one busy tenant onto its own dedicated shard (a targeted resharding) rebalances load without having to redesign the sharding scheme for every other tenant.
