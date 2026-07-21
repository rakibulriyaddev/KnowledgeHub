---
id: unstructured-database
title: "Unstructured Database"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, nosql]
parent: database
children: [document-database, key-value-store, wide-column-store, graph-database]
status: draft
---

# Unstructured Database

## Overview

An unstructured (NoSQL) database stores data without a fixed, engine-forced shape — documents, key-value pairs, graphs, or wide columns. It came about to handle changing data shapes and wide scale that relational systems handle poorly. Systems like MongoDB, Redis, Cassandra, DynamoDB, and Neo4j are examples of this space.

## Key Concepts

- **Document store** — self-contained JSON-like records; each record can have its own shape (MongoDB)
- **Key-value store** — a hidden value behind a key; the fastest, simplest model (Redis, DynamoDB)
- **Wide-column store** — rows with a changing set of columns, driven by a partition key (Cassandra)
- **Graph database** — nodes and edges as first-class parts; good for relationship-heavy queries (Neo4j)
- **Schema-on-read** — structure is figured out by the app when reading, not forced when writing
- **Eventual consistency** — copies match up over time instead of guaranteeing they match right away

## Core Knowledge

- "Schemaless" means the engine doesn't force a shape — the app still has one, just not written down, and must handle every old shape it ever wrote
- Data is shaped around how it's used, not around entities: know your queries first, then shape the data — the opposite of relational design
- Repeating data on purpose is normal; joins are missing or costly, so related data is placed together and copied on purpose
- Most NoSQL systems trade strict correctness for staying available even when parts fail — reading your own writes right away is not guaranteed by default
- Scaling out to more machines is built in: partition/shard keys spread data out, but a poorly chosen key creates hot spots that no amount of hardware fixes
- Transactions across many documents/keys are limited or costly — all-or-nothing behavior is usually only per document/key
- Flexible shape speeds up early development but moves checking, migration, and integrity work into the app's code
- Wrong reason to pick NoSQL: "it's faster" — right reason: the data shape, access pattern, or scale truly doesn't fit relational

## Interview Questions

**Q:** What does "schemaless" actually mean?
**A:** The engine skips forcing a shape; the shape moves into the app's code, which must check writes and handle every shape ever stored.

**Q:** How does data modeling differ from relational design?
**A:** You design starting from your queries — copy and place data together to serve known access patterns, instead of splitting entities apart and joining them.

**Q:** What is eventual consistency and when is it okay?
**A:** Copies match up over time, so reads may be stale; okay when short staleness doesn't break correctness (feeds, counters, catalogs), not for account balances or stock counts.

**Q:** What goes wrong with a bad partition key?
**A:** Traffic piles up on one shard (a hot partition), slowing that machine down while the rest of the cluster sits idle — fixing it later is painful.

## Scenario

A product catalog holds items with very different attributes — books have authors, laptops have specs, clothes have sizes — and every relational redesign adds empty columns or awkward workarounds. A document database stores each product as one self-contained document with exactly the fields it needs, and the catalog's read-heavy, look-up-by-id pattern fits document storage well.
