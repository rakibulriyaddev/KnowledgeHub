---
id: mysql
title: "MySQL"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, sql]
parent: structured-database
children: []
status: draft
---

# MySQL

## Overview

MySQL is an open-source relational database valued for being simple, fast at reads, and used everywhere in web app stacks (the M in LAMP). What sets it apart from other relational engines is its pluggable storage engine setup — InnoDB today, but MyISAM and others in the past — which explains many of its quirks compared to Postgres.

## Key Concepts

- **Storage engine** — pluggable layer (InnoDB by default) determining transaction support, locking, and crash recovery behavior
- **InnoDB** — the default transactional storage engine: MVCC, row-level locking, foreign keys, crash recovery
- **Replication** — based on the binlog, async by default in the past, widely used for read replicas
- **Clustered primary key** — InnoDB physically stores table data in primary key order, unlike Postgres's heap tables
- **Query cache (removed)** — an old result-caching feature, dropped in MySQL 8 because it did not scale well
- **Default isolation level** — repeatable read (InnoDB), differing from Postgres's read committed default

## Core Knowledge

- InnoDB's clustered primary key means the table's physical row order follows the primary key. A poorly chosen key (for example, a random one) causes the same page-split and fragmentation problems seen generally with B-trees, but directly on the table itself
- The default isolation level is repeatable read, not read committed — this changes which concurrency problems can happen out of the box compared to Postgres, and it surprises engineers moving between the two databases
- Replication based on the binlog (statement-based, row-based, or mixed) is simple to set up and well-tested, and was async by default in the past. Semisynchronous and synchronous options exist, but they are not the default
- Storage engine choice still matters, even though InnoDB is now used almost everywhere: old MyISAM tables have no transactions and no crash safety, which is a common source of confusion in older codebases
- MySQL used to allow looser type conversion and ways to opt out of strict rules (before strict SQL mode became the default). This schema behavior can surprise engineers who expect Postgres-level enforcement
- Scaling with read replicas is a common, well-known pattern in the MySQL world, often the first horizontal scaling step teams reach for before sharding
- Full-text search and JSON support exist in MySQL, but are generally seen as less mature and less flexible than Postgres's versions (GIN indexes, JSONB) — not a main reason to pick MySQL
- Auto-increment primary keys fit naturally with InnoDB's clustered storage, making a design friendly to inserts in order the easiest path to take

## Interview Questions

**Q:** What's the practical effect of InnoDB's clustered primary key?
**A:** Table rows are physically stored in primary key order, so range scans on the primary key are fast. But a randomly ordered key (like a UUID) causes the same fragmentation problems as a clustered B-tree index would elsewhere.

**Q:** How does MySQL's default isolation level differ from Postgres's?
**A:** InnoDB defaults to repeatable read, while Postgres defaults to read committed — meaning out-of-the-box concurrency behavior differs between the two, even for the same application code.

**Q:** Why does storage engine choice matter in MySQL specifically?
**A:** Different engines (InnoDB vs old MyISAM) give fundamentally different guarantees — transactions, row-level locking, and crash recovery are InnoDB features not found in older engines still used in legacy schemas.

**Q:** What's the typical first horizontal scaling step for a MySQL-backed application?
**A:** Adding binlog-based read replicas to take read traffic off the main server — a simple, well-known pattern used before reaching for more complex sharding.

## Scenario

A team moves a legacy app that still uses MyISAM tables, and finds that a crash during a bulk update left the table half-updated, with no transactions and no way to roll back. Moving those tables to InnoDB brings transaction guarantees and crash recovery. Now, the same operation either fully commits or rolls back cleanly, closing the exact gap that caused the original problem.
