---
id: cqrs
title: "CQRS"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, data-modeling, scalability, event-driven]
parent: architecture-patterns
children: []
status: draft
---

## Overview

CQRS (Command Query Responsibility Segregation) splits write actions (commands) and read actions (queries) into separate models — and often separate data stores — instead of forcing one schema to do both. It exists because write-friendly (normalized) and read-friendly (denormalized) needs pull a shared model in opposite directions.

## Key Concepts

- Origin: Bertrand Meyer's Command-Query Separation (CQS) principle, extended to architecture level by Greg Young.
- Command changes state and returns nothing; Query returns data and changes nothing.
- Write model is normalized for integrity; read model is denormalized for speed.
- Light CQRS (same DB, separate code models) vs Full CQRS (separate DBs, async sync).
- Pairs naturally with Event Sourcing: write side stores events, read side builds projections.

## Core Knowledge

In the usual CRUD approach, one model and one database serve both reads and writes — normalizing for write correctness forces JOIN-heavy, slow reads, even though reads and writes need very different scaling. CQRS splits these apart: commands go to a normalized write model, queries go to a denormalized read model built for each access pattern (Elasticsearch for search, a graph database for recommendations). The read side stays in sync with the write side through events or CDC, so it can lag behind — trading strong consistency for eventual consistency, in return for independent scaling and fast queries.

**Note:** CQRS is not Event Sourcing — they work well together, but each can exist alone. "CQRS without event sourcing" just means the read database is kept in sync with the write database using CDC (Debezium).

CQRS is worth its added complexity when the read-to-write ratio is very skewed (100:1 or more) or when several different read views are needed; it is too much for simple CRUD apps, even traffic, or cases that must have strong consistency. Good practice: use it at the bounded-context level, make read handlers idempotent, watch the sync lag, and move into it gradually through refactoring rather than starting a project with it.

## Interview Questions

**Q: What problem does CQRS solve?**
A: It removes the trade-off of one model serving both reads and writes, letting each be optimized and scaled on its own — important when reads far outnumber writes.

**Q: Is CQRS the same as Event Sourcing?**
A: No. They work well together, but CQRS can run on CDC-synced databases without an event log, and Event Sourcing can exist without split read/write models.

**Q: What's the main trade-off of adopting CQRS?**
A: Eventual consistency and doubled operational complexity, in exchange for independent scaling and better query performance.

## Scenario

A product catalog handles 10 million searches a day against only 1,000 admin updates. Writes go through a normalized SQL schema with ACID transactions, while reads are served from a denormalized Elasticsearch index kept in sync through events — the search experience stays fast and never touches the write path.
