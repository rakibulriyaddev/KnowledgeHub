---
id: database-sharding
title: "Database Sharding"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, scalability]
parent: database
children: []
status: draft
---

# Database Sharding

## Overview

Sharding partitions a dataset across multiple independent database nodes, each holding a subset of the data, so no single node needs to store or serve all of it. It exists because replication alone scales reads, not writes or total data volume — sharding is the lever for horizontal write and storage scale. It's the counterpart to replication, and the two are usually combined.

## Key Concepts

- **Shard** — one independent partition of the dataset, typically its own database instance
- **Shard key** — field(s) determining which shard a given row/document lives on
- **Routing** — logic (application, proxy, or engine-native) directing a query to the correct shard
- **Rebalancing / resharding** — redistributing data when shard count or key changes
- **Cross-shard query** — a query touching data on more than one shard, inherently more expensive
- **Hot shard** — a shard receiving disproportionate load due to skewed key distribution

## Core Knowledge

- Shard key choice is the single most consequential decision — it determines write distribution, query routing efficiency, and hot-shard risk, and is expensive to change later
- Range-based sharding preserves sortable locality but risks hot shards on sequential keys (e.g. timestamps); hash-based sharding distributes evenly but kills range-scan locality
- Cross-shard joins/transactions are either unsupported, slow, or require application-level fan-out and merge — schema design should minimize the need for them
- Resharding an existing large sharded cluster is a major operational undertaking, not a config change — this is why shard key choice is treated as near-permanent
- Sharding adds real operational complexity (more nodes, more failure modes, cross-shard consistency) — it's a scale lever reached for after replication and vertical scaling are exhausted, not a default
- Sharding and replication are usually layered together: each shard is itself a replica set, giving both write-scale and per-shard availability
- Some databases (MongoDB, Cassandra) have native sharding/partitioning built in; relational engines often need external tooling or application-level sharding logic
- Uneven data or access patterns across shards (hot keys, skewed tenants) undermine sharding's benefit even with a technically reasonable key choice

## Interview Questions

**Q:** Why doesn't replication alone solve write scalability?
**A:** Replicas serve reads but writes still funnel through the primary; sharding is what actually partitions write load across independent nodes.

**Q:** What's the tradeoff between range-based and hash-based shard keys?
**A:** Range-based preserves ordered locality for range scans but risks hot shards on sequential keys; hash-based distributes load evenly but loses range-scan efficiency.

**Q:** Why are cross-shard transactions avoided in schema design?
**A:** They require coordination across independent nodes (often two-phase commit or application-level fan-out), which is slower and more failure-prone than a single-shard transaction.

**Q:** Why is changing a shard key considered a major operation rather than routine?
**A:** It requires redistributing existing data across a live cluster (resharding), which is resource-intensive and operationally risky at scale.

## Scenario

A multi-tenant SaaS product shards by tenant id, and one enterprise tenant grows far larger than the rest, overloading its shard while others sit idle. Splitting that one hot tenant onto its own dedicated shard (a targeted resharding) rebalances load without having to redesign the sharding scheme for every other tenant.
