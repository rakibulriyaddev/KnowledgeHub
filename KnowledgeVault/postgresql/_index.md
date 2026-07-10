---
id: postgresql
title: "PostgreSQL"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, sql]
parent: structured-database
children: []
---

# PostgreSQL

## Overview

PostgreSQL is an open-source, object-relational database known for strict standards compliance, extensibility, and a feature set that blurs the relational/NoSQL line — native JSON, arrays, full-text search, and custom types. It's the common default choice for teams wanting relational correctness without vendor lock-in, and it underpins the MVCC and B-tree indexing concepts already covered generically in this vault.

## Key Concepts

- **MVCC implementation** — Postgres stores old row versions directly in the table (not a separate undo log)
- **Extensions** — pluggable modules (PostGIS, pg_trgm, TimescaleDB) adding capability without forking the core
- **JSONB** — binary, indexable JSON type letting Postgres serve semi-structured data relationally
- **Vacuum / autovacuum** — background process reclaiming dead row versions and updating statistics
- **Write-ahead log (WAL)** — durability and replication mechanism; basis for streaming/logical replication
- **Roles and extensible types** — fine-grained permission model and support for user-defined data types

## Core Knowledge

- Postgres's MVCC stores full old tuples in the table itself, so heavy update/delete workloads bloat tables until vacuum reclaims space — this is the most common Postgres-specific operational surprise
- Autovacuum falling behind (due to long-running transactions, high write volume, or misconfigured thresholds) causes both bloat and, in extreme cases, transaction ID wraparound risk
- JSONB gives semi-structured flexibility inside a relational engine, and can be indexed (GIN) for containment queries — a genuine middle ground between relational and document models
- Standards compliance is a selling point but also a friction point — some MySQL-style shortcuts and implicit conversions Postgres deliberately disallows
- Extensions are why Postgres competes in spaces relational engines traditionally didn't — PostGIS for geospatial, TimescaleDB for time-series, pg_vector for embeddings
- Replication is WAL-based: physical (byte-level, whole-cluster) or logical (row-level, selective) — the choice affects what kind of topology and filtering is possible
- Connection handling is process-per-connection by default, making connection pooling (PgBouncer, application-side pools) a near-mandatory addition at scale
- Default isolation is read committed, same general behavior discussed generically in isolation-levels, but Postgres's MVCC snapshot mechanics are the concrete implementation behind it

## Interview Questions

**Q:** Why does Postgres need vacuuming and other databases with MVCC don't (as visibly)?
**A:** Postgres stores old row versions directly in the table rather than a separate undo/rollback segment, so dead versions physically accumulate there until vacuum reclaims the space.

**Q:** What's JSONB and when would you use it over a normalized table?
**A:** A binary, indexable JSON column type — useful for genuinely variable or nested attributes where forcing full normalization adds more schema churn than value, without abandoning the relational core.

**Q:** Why is connection pooling almost mandatory in production Postgres?
**A:** Each connection spawns a full OS process with real memory overhead, so a high-connection-count application needs a pooler (PgBouncer) rather than opening one connection per request/thread.

**Q:** Physical vs logical replication — what's the practical difference?
**A:** Physical replication ships raw WAL bytes for an identical whole-cluster replica; logical replication ships decoded row-level changes, allowing selective table replication and cross-version upgrades.

## Scenario

A Postgres-backed service does frequent updates on a hot table, and over weeks query performance degrades even though row count stays flat. Investigation finds autovacuum falling behind due to a long-idle transaction pinning old row versions, letting dead tuples pile up and bloat the table and its indexes. Terminating the stale connection and letting autovacuum catch up restores performance without any schema or query change.
