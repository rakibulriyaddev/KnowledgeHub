---
id: mongodb
title: "MongoDB"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, nosql]
parent: document-database
children: []
status: draft
---

# MongoDB

## Overview

MongoDB is the most widely deployed document database, storing data as BSON documents in collections with no enforced schema by default. It popularized the document model for general-purpose application storage and drives most of the embed-vs-reference and schema-on-read tradeoffs discussed generically for document databases.

## Key Concepts

- **BSON** — binary JSON superset MongoDB stores/transmits internally, adds types like dates and binary data
- **Replica set** — primary-secondary cluster providing failover and read scaling
- **Sharded cluster** — horizontal partitioning across shards using a shard key
- **Aggregation pipeline** — multi-stage query/transform framework, MongoDB's answer to SQL's GROUP BY/JOIN
- **WiredTiger** — default storage engine, provides document-level locking and compression
- **Schema validation** — optional JSON Schema rules layered on a collection

## Core Knowledge

- Replica sets elect a new primary automatically on failure, but writes during election windows can be rolled back if not acknowledged with sufficient write concern
- Write concern and read concern are separate, tunable knobs — durability and consistency are configurable per-operation, not fixed
- Shard key choice is permanent-ish (resharding is costly) and directly determines write distribution and query routing — a poor key creates hot shards
- Aggregation pipeline stages run server-side and can replace most application-side data reshaping, but complex pipelines are harder to reason about and index than simple finds
- Multi-document ACID transactions exist since v4.0 but carry meaningfully more overhead than single-document writes — reach for schema design that avoids needing them first
- WiredTiger's document-level locking (replacing older collection-level locking) is why modern MongoDB handles concurrent writes far better than early versions
- Default schema-less behavior means MongoDB will never fail an insert for shape mismatch — application-layer or JSON Schema validation is the only enforcement
- Indexes must be created deliberately per query pattern, including on nested/array fields — unindexed queries fall back to full collection scans

## Interview Questions

**Q:** What happens to in-flight writes during a MongoDB primary election?
**A:** Writes not acknowledged with majority write concern can be rolled back once a new primary is elected, so write concern choice directly affects durability during failover.

**Q:** Why is shard key selection considered a near-irreversible decision?
**A:** It determines data distribution and query routing across the cluster, and resharding an existing large cluster to change it is an expensive, disruptive operation.

**Q:** When would you use MongoDB's aggregation pipeline over a simple find query?
**A:** When the operation needs multi-stage transformation, grouping, or joins across collections server-side, avoiding pulling raw data into the application to reshape it.

**Q:** Are MongoDB multi-document transactions "free" to use like Postgres transactions?
**A:** No — they add real overhead compared to MongoDB's default single-document atomicity, so schemas are typically designed to avoid needing them where possible.

## Scenario

An e-commerce app models orders as documents embedding line items, and a poorly chosen shard key (order creation timestamp) causes all new writes to land on one shard, bottlenecking throughput. Resharding around a more distributed key (customer id) spreads writes evenly across the cluster, resolving the hot-shard bottleneck without changing the document model itself.
