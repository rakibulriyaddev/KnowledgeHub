---
id: postgresql
title: "PostgreSQL"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, sql]
parent: structured-database
children: []
status: draft
---

# PostgreSQL

## Overview

PostgreSQL is an open-source, object-relational database known for closely following standards, being easy to extend, and offering features that blur the line between relational and NoSQL — built-in JSON, arrays, full-text search, and custom types. It's the common default pick for teams who want relational correctness with no lock-in to one vendor, and it puts into practice the MVCC and B-tree indexing ideas already covered elsewhere in this vault.

## Key Concepts

- **MVCC setup** — Postgres keeps old row versions right in the table (not in a separate undo log)
- **Extensions** — add-on modules (PostGIS, pg_trgm, TimescaleDB) that add features without changing the core
- **JSONB** — a binary, indexable JSON type that lets Postgres hold semi-structured data relationally
- **Vacuum / autovacuum** — a background job that frees dead row versions and updates stats
- **Write-ahead log (WAL)** — the mechanism behind durability and copying data; the base for streaming/logical replication
- **Roles and custom types** — a fine-grained permission system and support for user-made data types

## Core Knowledge

- Postgres's MVCC keeps full old rows right in the table, so heavy update/delete work bloats tables until vacuum frees the space — this is the most common Postgres-specific surprise in running it
- Autovacuum falling behind (from long-running transactions, high write volume, or bad settings) causes bloat, and in extreme cases the risk of transaction ID wraparound
- JSONB gives semi-structured flexibility inside a relational engine, and can be indexed (GIN) for lookups — a real middle ground between relational and document models
- Following standards closely is a selling point but also a source of friction — Postgres won't do some MySQL-style shortcuts and silent conversions on purpose
- Extensions are why Postgres competes in areas relational engines usually didn't — PostGIS for maps/location, TimescaleDB for time-series, pg_vector for embeddings
- Copying data uses the WAL: physical (byte-level, whole-cluster) or logical (row-level, selective) — the choice affects what kind of setup and filtering is possible
- Handling connections is one process per connection by default, which makes connection pooling (PgBouncer, app-side pools) almost required at scale
- The default isolation level is read committed, matching the general idea covered elsewhere in isolation-levels, but Postgres's MVCC snapshot method is the real machinery behind it

## Interview Questions

**Q:** Why does Postgres need vacuuming when other databases with MVCC don't (as visibly)?
**A:** Postgres keeps old row versions right in the table instead of a separate undo/rollback area, so dead versions pile up there physically until vacuum frees the space.

**Q:** What's JSONB and when would you use it instead of a normalized table?
**A:** A binary, indexable JSON column type — useful for attributes that genuinely vary or nest, where forcing full normalization adds more schema churn than value, without giving up the relational core.

**Q:** Why is connection pooling almost required in production Postgres?
**A:** Each connection starts a full OS process with real memory cost, so an app with many connections needs a pooler (PgBouncer) rather than opening one connection per request/thread.

**Q:** Physical vs logical replication — what's the real difference?
**A:** Physical replication sends raw WAL bytes for an identical whole-cluster copy; logical replication sends decoded row-level changes, allowing selective table copying and moving across versions.

## Scenario

A Postgres-backed service runs frequent updates on a busy table, and over weeks its query speed drops even though the row count stays the same. Looking into it shows autovacuum falling behind because a long-idle transaction is pinning old row versions, letting dead rows pile up and bloat the table and its indexes. Ending the stale connection and letting autovacuum catch up brings back performance with no change to schema or queries.
