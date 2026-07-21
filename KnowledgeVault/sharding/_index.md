---
id: sharding
title: "Database Sharding"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, scaling, distributed-systems, partitioning]
parent: sd-databases
children: []
status: draft
---

## Overview

Database Sharding (splitting rows) breaks one large database into many small shards, each on a separate server holding the same schema but a subset of the rows. It's the last-resort scaling method for billion-row datasets, reached for only after replication, caching, and vertical scaling stop being enough.

## Key Concepts

- Row-based splitting vs column-based splitting.
- Sharding strategies — range, hash, geographic, directory-based.
- Picking a shard key — the hardest and most important decision.
- Hot spots, cross-shard queries, and resharding as the main problems.
- App-level, middleware/proxy, and built-in sharding setups.

## Core Knowledge

Sharding splits by rows: each shard is an independent DB with the same schema but different rows, which is different from splitting by columns across tables. Range-based sharding (like user ID 1-1M → shard 1) makes range queries easy but creates hot spots since new data (auto-increment IDs) all lands on one shard. Hash-based sharding (`shard_id = hash(key) % num_shards`) spreads load evenly but makes range queries and resharding hard. Geographic sharding cuts latency and helps with rules like GDPR but makes cross-region queries harder. Directory-based sharding uses a lookup service for flexibility, at the cost of that service becoming a single point of failure.

The shard key is the hardest choice because it's hard to change later: a good key has many possible values, spreads evenly, shows up often in queries, stays the same over time, and keeps related data together (all of a user's data on one shard) — user_id, customer_id, and tenant_id are common picks; true/false values are a worst-case pick. The main operational problems are hot spots (too much load on one shard, like a celebrity account, fixed with better hashing, salting, or sub-sharding), cross-shard queries (JOINs/aggregates needing to gather from many shards, fixed with denormalizing or merging results in the app), and resharding (changing the shard count needs a huge reshuffle, best handled with consistent hashing), plus distributed transactions across shards (2PC or Saga) and backups that stay consistent across shards. Sharding can be built at the app level (logic in code), through middleware/proxy (Vitess, ProxySQL), or natively (MongoDB, Cassandra, DynamoDB have built-in sharding that's invisible to the app).

## Interview Questions

**Q: What makes a good shard key?**
A: Many possible values, an even spread, it appears often in query WHERE clauses, it stays stable over time, and it can keep a given entity's related data together on one shard.

**Q: Why is range-based sharding prone to hot spots?**
A: With auto-incrementing IDs, all new writes land on the shard holding the highest range, piling up load instead of spreading it.

**Q: What should you try before sharding?**
A: Vertical scaling, read replicas, caching, indexing/query tuning, and column-based splitting — sharding is the last resort because of its operational complexity and how hard it is to change a shard key later.

## Scenario

A social platform's single Postgres instance holds 10 billion user records — disk is full, queries are slow, backups run all night. The team shards by `user_id` using consistent hashing across 10 databases, keeping each user's posts and profile on the same shard to avoid cross-shard JOINs, while accepting that celebrity accounts need sub-sharding to avoid one overloaded partition.
