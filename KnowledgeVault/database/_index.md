---
id: database
title: "Database"
created: 2026-07-10
modified: 2026-07-11
tags: [data, storage]
parent: null
children: [structured-database, unstructured-database, database-indexing, database-transaction, cap-theorem, database-schema, connection-pooling, database-replication, database-sharding, consistent-hashing, sql-vs-nosql, database-security, database-backup-recovery]
status: draft
---

# Database

## Overview

A database is an organized collection of data stored and accessed electronically through a DBMS. It exists to give applications reliable, concurrent, queryable access to shared data — replacing manual file handling, duplication, and corruption risk. It sits at the foundation of nearly every backend system.

## Key Concepts

- **DBMS** — software layer that manages storage, queries, and access control
- **Schema** — the structure/blueprint the data conforms to
- **Query** — a request to read or write data
- **Index** — auxiliary structure that speeds up lookups
- **Transaction** — group of operations that succeed or fail as one (ACID)
- **Replication / Sharding** — copying and partitioning data for availability and scale

## Core Knowledge

- Two broad families: structured (SQL, fixed schema) and unstructured/semi-structured (NoSQL: document, key-value, graph) — the choice is a tradeoff, not a fashion
- Schema rigidity buys data integrity; schema flexibility buys development velocity
- Indexes speed reads but slow writes and consume storage — index deliberately, not everywhere
- Transactions (ACID) protect multi-step operations from partial failure
- CAP theorem: a distributed database picks tradeoffs between consistency, availability, and partition tolerance — never all three
- Replication improves availability and read scale; sharding improves write scale — each adds operational complexity
- Most performance problems are query/index/schema problems, not hardware problems
- Backups are worthless until a restore has been tested

## Interview Questions

**Q:** What is a database, and why use one over files on disk?
**A:** A managed, queryable data store; it provides concurrency control, durability, indexing, and integrity that raw files cannot.

**Q:** When would you choose NoSQL over a relational database?
**A:** When the schema is fluid, data is naturally document/graph shaped, or horizontal write scale outweighs the need for joins and strict integrity.

**Q:** What does an index cost you?
**A:** Slower writes and extra storage — every insert/update must also maintain the index.

**Q:** What does the CAP theorem force you to decide?
**A:** During a network partition, whether the system stays consistent (rejects some requests) or available (serves possibly stale data).

## Scenario

An e-commerce app stores orders in JSON files on disk. Two servers write simultaneously, files corrupt, and finding "all orders by customer X" means scanning everything. Moving to a database gives atomic concurrent writes, indexed lookups, and durable storage — the corruption and scan problems disappear by design.
