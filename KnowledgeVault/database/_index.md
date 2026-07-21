---
id: database
title: "Database"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage]
parent: null
children: [structured-database, unstructured-database, database-indexing, database-transaction, cap-theorem, database-schema, connection-pooling, database-replication, database-sharding, consistent-hashing, sql-vs-nosql, database-security, database-backup-recovery]
status: draft
---

# Database

## Overview

A database is an organized set of data stored and reached electronically through a DBMS. It exists to give apps reliable, shared, queryable access to data — replacing manual file handling, copying, and the risk of broken files. It sits at the base of almost every backend system.

## Key Concepts

- **DBMS** — the software layer that manages storage, queries, and access rules
- **Schema** — the structure/blueprint the data must follow
- **Query** — a request to read or write data
- **Index** — a helper structure that speeds up lookups
- **Transaction** — a group of operations that succeed or fail as one (ACID)
- **Replication / Sharding** — copying and splitting data for uptime and scale
- **OLTP vs OLAP** — many small, speed-sensitive transactions (orders, logins) vs a few large, read-heavy reporting queries (reports, BI)
- **Write-ahead log (WAL)** — changes are logged before being applied, so a crash can replay them instead of losing data

## Core Knowledge

- Two broad families: structured (SQL, fixed schema) and unstructured/semi-structured (NoSQL: document, key-value, wide-column, graph) — the choice is a trade-off, not a fashion; special families exist too (time-series like InfluxDB, search engines like Elasticsearch, NewSQL like Spanner/CockroachDB mixing relational guarantees with wide scale)
- OLTP systems (MySQL, PostgreSQL) are built for many small same-time transactions; OLAP systems (Snowflake, BigQuery, Redshift) are built for large read-heavy reporting scans — mixing both workloads on one engine hurts both
- A strict schema buys data correctness; a loose schema buys build speed
- Indexes speed up reads but slow down writes and use storage — index on purpose, not everywhere
- Transactions (ACID) protect multi-step operations from partial failure
- CAP theorem: a spread-out database picks trade-offs between consistency, availability, and surviving a network split — never all three
- Replication improves uptime and read scale; sharding improves write scale — each adds extra work to run
- Most speed problems are query/index/schema problems, not hardware problems
- Backups are worthless until a restore has been tested

## Interview Questions

**Q:** What is a database, and why use one instead of files on disk?
**A:** A managed, queryable data store; it gives same-time access control, durability, indexing, and correctness that raw files can't.

**Q:** When would you pick NoSQL over a relational database?
**A:** When the schema changes often, data naturally fits a document/graph shape, or wide write scale matters more than joins and strict correctness.

**Q:** What does an index cost you?
**A:** Slower writes and extra storage — every insert/update must also update the index.

**Q:** What does the CAP theorem force you to decide?
**A:** During a network split, whether the system stays correct (turns away some requests) or stays available (serves maybe-old data).

## Scenario

An e-commerce app stores orders in JSON files on disk. Two servers write at the same time, files break, and finding "all orders by customer X" means scanning everything. Moving to a database gives correct same-time writes, indexed lookups, and safe storage — the broken-file and scan problems disappear by design.
