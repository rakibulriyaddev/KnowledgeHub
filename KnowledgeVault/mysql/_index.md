---
id: mysql
title: "MySQL"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, sql]
parent: structured-database
children: []
status: draft
---

# MySQL

## Overview

MySQL is an open-source relational database prized for simplicity, read-heavy performance, and ubiquity in web application stacks (the M in LAMP). Its defining trait among relational engines is a pluggable storage engine architecture — InnoDB today, but historically MyISAM and others — which shapes many of its behavioral quirks compared to Postgres.

## Key Concepts

- **Storage engine** — pluggable layer (InnoDB by default) determining transaction support, locking, and crash recovery behavior
- **InnoDB** — the default transactional storage engine: MVCC, row-level locking, foreign keys, crash recovery
- **Replication** — binlog-based, historically asynchronous by default, widely used for read replicas
- **Clustered primary key** — InnoDB physically orders table data by primary key, unlike Postgres's heap tables
- **Query cache (deprecated/removed)** — historical result-caching feature removed in MySQL 8 due to scalability limits
- **Default isolation level** — repeatable read (InnoDB), differing from Postgres's read committed default

## Core Knowledge

- InnoDB's clustered primary key means the table's physical row order follows the primary key — a poorly chosen (e.g. random) primary key causes the same page-split/fragmentation issues discussed generically for B-trees, directly on the table itself
- Default isolation is repeatable read, not read committed — this changes which concurrency anomalies are possible out of the box compared to Postgres, and surprises engineers moving between the two
- Binlog-based replication (statement-based, row-based, or mixed) is simple to set up and battle-tested, historically async by default — semisynchronous/synchronous options exist but aren't the default
- Storage engine choice matters even though InnoDB dominates today: legacy MyISAM tables lack transactions and crash safety, a common source of confusion in older codebases
- MySQL historically permitted looser type coercion and stricter-mode opt-outs (before strict SQL mode became default) — schema behavior can surprise engineers expecting Postgres-level enforcement
- Read replica scaling is a well-trodden, simple pattern in the MySQL ecosystem, often the first horizontal scaling step reached for before sharding
- Full-text search and JSON support exist but are generally considered less mature/less flexible than Postgres's equivalents (GIN indexes, JSONB) — not a primary reason to choose MySQL
- Auto-increment primary keys pair naturally with InnoDB's clustered storage, reinforcing sequential-insert-friendly design as the path of least resistance

## Interview Questions

**Q:** What's the practical effect of InnoDB's clustered primary key?
**A:** Table rows are physically stored in primary key order, so range scans on the primary key are fast, but a randomly ordered key (UUID) causes the same fragmentation problems as a clustered B-tree index elsewhere.

**Q:** How does MySQL's default isolation level differ from Postgres's?
**A:** InnoDB defaults to repeatable read; Postgres defaults to read committed — meaning out-of-the-box concurrency anomaly behavior differs between the two even for equivalent application code.

**Q:** Why does storage engine choice matter in MySQL specifically?
**A:** Different engines (InnoDB vs legacy MyISAM) offer fundamentally different guarantees — transactions, row-level locking, and crash recovery are InnoDB features not present in older engine choices still found in legacy schemas.

**Q:** What's the typical first horizontal scaling step for a MySQL-backed application?
**A:** Adding binlog-based read replicas to offload read traffic — a simple, well-established pattern reached for before more complex sharding solutions.

## Scenario

A team migrates a legacy application still using MyISAM tables and discovers that a crash during a bulk update left the table in a partially updated, non-transactional state with no way to roll back. Migrating those tables to InnoDB brings transactional guarantees and crash recovery, and the same operation afterward either fully commits or rolls back cleanly, closing the exact gap that caused the original incident.
