---
id: mongodb
title: "MongoDB"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, nosql]
parent: document-database
children: []
status: draft
---

# MongoDB

## Overview

MongoDB is the most widely used document database. It stores data as BSON documents in collections, with no fixed schema by default. It made the document model popular for general-purpose app storage, and it drives most of the embed-vs-reference and schema-on-read tradeoffs talked about generally for document databases.

## Key Concepts

- **BSON** — a binary form of JSON, with extra types like dates and binary data, that MongoDB stores and sends internally
- **Replica set** — primary-secondary cluster providing failover and read scaling
- **Sharded cluster** — horizontal partitioning across shards using a shard key
- **Aggregation pipeline** — a multi-step query and transform framework, MongoDB's answer to SQL's GROUP BY and JOIN
- **WiredTiger** — default storage engine, provides document-level locking and compression
- **Schema validation** — optional JSON Schema rules layered on a collection

## Core Knowledge

- Replica sets pick a new primary on their own if one fails, but writes made during that election window can be rolled back if they were not acknowledged with enough write concern
- Write concern and read concern are separate settings you can tune — durability and consistency can be set per operation, not fixed for the whole database
- Choosing a shard key is close to permanent, since resharding is costly, and it directly decides how writes spread out and how queries get routed — a poor choice creates hot shards that get too much load
- Aggregation pipeline steps run on the server and can replace most data reshaping done in the app. But complex pipelines are harder to reason about and to index than simple finds
- Multi-document ACID transactions have existed since v4.0, but they cost noticeably more than single-document writes — try to design your schema to avoid needing them first
- WiredTiger's document-level locking (replacing older, whole-collection locking) is why modern MongoDB handles many writes at once far better than early versions did
- With no fixed schema by default, MongoDB will never fail an insert just because the shape does not match — the only enforcement is validation done in the app, or JSON Schema rules
- Indexes must be made on purpose for each query pattern, including for nested or array fields. Queries with no index fall back to scanning the whole collection

## Interview Questions

**Q:** What happens to in-flight writes during a MongoDB primary election?
**A:** Writes that were not acknowledged with a majority write concern can be rolled back once a new primary is elected, so the write concern you choose directly affects durability during failover.

**Q:** Why is shard key selection considered a near-irreversible decision?
**A:** It decides how data spreads and how queries get routed across the cluster, and reworking the shard key on a large existing cluster is an expensive, disruptive job.

**Q:** When would you use MongoDB's aggregation pipeline over a simple find query?
**A:** When the operation needs multi-step transforms, grouping, or joins across collections done on the server, instead of pulling raw data into the app to reshape it there.

**Q:** Are MongoDB multi-document transactions "free" to use like Postgres transactions?
**A:** No — they add real overhead compared to MongoDB's default single-document atomicity, so schemas are usually designed to avoid needing them where possible.

## Scenario

An online shop app models orders as documents that embed their line items. A poorly chosen shard key (the order's creation time) causes all new writes to land on one shard, which bottlenecks throughput. Reworking the shard key around one that spreads out better (customer id) spreads writes evenly across the cluster, fixing the hot-shard bottleneck without changing the document model itself.
