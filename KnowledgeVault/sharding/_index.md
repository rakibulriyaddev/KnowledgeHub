---
id: sharding
title: "Database Sharding"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, scaling, distributed-systems, partitioning]
parent: sd-databases
children: []
status: draft
---

## Overview

Database Sharding (horizontal partitioning) splits one large database into many small shards, each on a separate server holding the same schema but a subset of the rows. It's the last-resort scaling technique for billion-row datasets, reached for only after replication, caching, and vertical scaling stop being enough.

## Key Concepts

- Horizontal (row-based) vs vertical (column-based) partitioning.
- Sharding strategies — range, hash, geographic, directory-based.
- Shard key selection — the hardest and most consequential decision.
- Hot spots, cross-shard queries, and resharding as the core problems.
- Application-level, middleware/proxy, and built-in sharding implementations.

## Core Knowledge

Sharding is horizontal partitioning: each shard is an independent DB with identical schema but different rows, distinguished from vertical partitioning, which splits columns across tables. Range-based sharding (e.g., user ID 1-1M → shard 1) makes range queries easy but creates hot spots since new data (auto-increment IDs) piles onto one shard. Hash-based sharding (`shard_id = hash(key) % num_shards`) distributes load uniformly but makes range queries and resharding hard. Geographic sharding reduces latency and aids compliance (GDPR) but complicates cross-region queries. Directory-based sharding uses a lookup service for flexibility, at the cost of that service becoming a single point of failure.

The shard key is the single hardest decision because it's difficult to change later: a good key has high cardinality, distributes uniformly, appears commonly in queries, is stable, and co-locates related data (all of a user's data on one shard) — user_id, customer_id, and tenant_id are common choices; booleans are a worst-case choice. The main operational problems are hot spots (disproportionate load on one shard, e.g. a celebrity account, fixed via better hashing, salting, or sub-sharding), cross-shard queries (JOINs/aggregates needing scatter-gather, fixed via denormalization or application-level merging), and resharding (changing shard count requires massive redistribution, best handled with consistent hashing), plus distributed transactions across shards (2PC or Saga) and cross-shard-consistent backups. Sharding can be implemented at the application level (logic in code), via middleware/proxy (Vitess, ProxySQL), or natively (MongoDB, Cassandra, DynamoDB have built-in sharding transparent to the app).

## Interview Questions

**Q: What makes a good shard key?**
A: High cardinality, uniform distribution, frequent appearance in query WHERE clauses, stability over time, and the ability to co-locate a given entity's related data on one shard.

**Q: Why is range-based sharding prone to hot spots?**
A: With auto-incrementing IDs, all new writes land on the shard holding the highest range, concentrating load instead of spreading it.

**Q: What should you try before sharding?**
A: Vertical scaling, read replicas, caching, indexing/query optimization, and vertical partitioning — sharding is the last resort due to its operational complexity and the difficulty of changing a shard key later.

## Scenario

A social platform's single Postgres instance holds 10 billion user records — disk is full, queries are slow, backups run all night. The team shards by `user_id` using consistent hashing across 10 databases, co-locating each user's posts and profile on the same shard to avoid cross-shard JOINs, while accepting that celebrity accounts need sub-sharding to avoid a hot partition.
