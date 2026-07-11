---
id: cqrs
title: "CQRS"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, data-modeling, scalability, event-driven]
parent: architecture-patterns
children: []
status: draft
---

## Overview

CQRS (Command Query Responsibility Segregation) splits write operations (commands) and read operations (queries) into separate models — and often separate data stores — instead of forcing one schema to serve both. It exists because write-optimized (normalized) and read-optimized (denormalized) needs pull a shared model in opposite directions.

## Key Concepts

- Origin: Bertrand Meyer's Command-Query Separation (CQS) principle, extended to architecture level by Greg Young.
- Command changes state and returns nothing; Query returns data and changes nothing.
- Write model is normalized for integrity; read model is denormalized for speed.
- Light CQRS (same DB, separate code models) vs Full CQRS (separate DBs, async sync).
- Pairs naturally with Event Sourcing: write side stores events, read side builds projections.

## Core Knowledge

In the traditional CRUD approach, one model and database serve both reads and writes — normalizing for write integrity forces JOIN-heavy, slow reads, even though the two have very different scaling needs. CQRS separates these: commands hit a normalized write model, queries hit a denormalized read model optimized per access pattern (Elasticsearch for search, a graph DB for recommendations). The read side syncs from the write side via events or CDC, so it lags — trading strong for eventual consistency in exchange for independent scaling and fast queries.

**Note:** CQRS is not Event Sourcing — they pair well but each can exist alone; "CQRS without event sourcing" just syncs the read DB from the write DB via CDC (Debezium).

CQRS earns its complexity when the read/write ratio is heavily skewed (100:1+) or multiple read views are needed; it's overkill for simple CRUD apps, balanced traffic, or mandatory strong consistency. Best practice: apply it at the bounded-context level, make read handlers idempotent, monitor sync lag, and migrate into it through refactoring rather than starting with it.

## Interview Questions

**Q: What problem does CQRS solve?**
A: It removes the compromise of one model serving both reads and writes, letting each be optimized and scaled independently — critical when reads vastly outnumber writes.

**Q: Is CQRS the same as Event Sourcing?**
A: No. They pair well, but CQRS can run on CDC-synced databases without an event log, and Event Sourcing can exist without split read/write models.

**Q: What's the main trade-off of adopting CQRS?**
A: Eventual consistency and doubled operational complexity in exchange for independent scaling and query performance.

## Scenario

A product catalog handles 10 million searches a day against only 1,000 admin updates: writes go through a normalized SQL schema with ACID transactions, while reads are served from a denormalized Elasticsearch index kept in sync via events — the search experience stays fast without ever touching the write path.
