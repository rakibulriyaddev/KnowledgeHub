---
id: unstructured-database
title: "Unstructured Database"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage, nosql]
parent: database
children: [document-database, key-value-store, wide-column-store, graph-database]
---

# Unstructured Database

## Overview

An unstructured (NoSQL) database stores data without a fixed, engine-enforced schema — documents, key-value pairs, graphs, or wide columns. It emerged to handle fluid data shapes and horizontal scale that relational systems handle poorly. Systems like MongoDB, Redis, Cassandra, DynamoDB, and Neo4j define this space.

## Key Concepts

- **Document store** — self-contained JSON-like records; nested, per-record shape (MongoDB)
- **Key-value store** — opaque value behind a key; fastest, simplest model (Redis, DynamoDB)
- **Wide-column store** — rows with dynamic column sets, partition-key driven (Cassandra)
- **Graph database** — nodes and edges as first-class citizens; relationship-heavy queries (Neo4j)
- **Schema-on-read** — structure interpreted by the application at read time, not enforced at write
- **Eventual consistency** — replicas converge over time instead of guaranteeing immediate agreement

## Core Knowledge

- "Schemaless" means the engine doesn't enforce a schema — the application still has one, implicitly, and must handle every historical shape it ever wrote
- Data is modeled around access patterns, not entities: know your queries first, then shape the data — the opposite of relational design
- Denormalization is the norm; joins are absent or expensive, so related data is embedded and duplicated deliberately
- Most NoSQL systems trade strict consistency for availability and partition tolerance — read-your-own-writes is not guaranteed by default
- Horizontal scaling is native: partition/shard keys distribute data, but a poorly chosen key creates hot partitions that no hardware fixes
- Multi-document/multi-key transactions are limited or costly — atomicity is typically per document/key
- Schema flexibility accelerates early development but shifts validation, migration, and integrity work into application code
- Wrong reason to choose NoSQL: "it's faster" — right reason: data shape, access pattern, or scale genuinely doesn't fit relational

## Interview Questions

**Q:** What does "schemaless" actually mean?
**A:** The engine skips schema enforcement; the schema moves into application code, which must validate writes and tolerate every shape ever stored.

**Q:** How does data modeling differ from relational design?
**A:** You design from queries backwards — embed and duplicate data to serve known access patterns, instead of normalizing entities and joining.

**Q:** What is eventual consistency and when is it acceptable?
**A:** Replicas converge over time, so reads may be stale; acceptable when brief staleness doesn't break correctness (feeds, counters, catalogs), not for balances or inventory.

**Q:** What goes wrong with a bad partition key?
**A:** Traffic concentrates on one shard (hot partition), throttling that node while the rest of the cluster idles — resharding later is painful.

## Scenario

A product catalog holds items with wildly different attributes — books have authors, laptops have specs, clothes have sizes — and every relational redesign adds nullable columns or entity-attribute-value contortions. A document database stores each product as one self-contained document with exactly the fields it needs, and the catalog's read-heavy, lookup-by-id access pattern fits document retrieval perfectly.
