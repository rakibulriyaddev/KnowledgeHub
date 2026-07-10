---
id: database-schema
title: "Database Schema"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage]
parent: database
children: [schema-migration]
---

# Database Schema

## Overview

A schema is the structure data conforms to — the shape, types, and constraints defining what's valid to store. It exists so a database (and every consumer of it) can agree on what the data means, whether that agreement is enforced strictly at write time or interpreted loosely at read time. Every database has a schema in some form; the real question is who enforces it, and when.

## Key Concepts

- **Schema-on-write** — structure declared and enforced by the engine before data is accepted (relational default)
- **Schema-on-read** — structure interpreted by the application when data is read, not enforced at write (NoSQL default)
- **Constraint** — rule the engine checks (type, not-null, unique, foreign key, check)
- **Migration** — a controlled, versioned change to schema structure over time
- **Schema evolution** — how a schema changes without breaking existing data or running code
- **Schema validation** — optional engine-level rule enforcement layered onto otherwise flexible schemas

## Core Knowledge

- Schema-on-write rejects bad data immediately; schema-on-read defers that cost to every reader, which must handle every shape ever written
- A schema is never truly absent — "schemaless" systems just move the schema from the engine into application code, implicitly
- Migrations on live, large tables carry real operational risk — locking, downtime, and rollback plans matter as much as the change itself
- Backward-compatible schema evolution (additive changes, nullable new columns, versioned documents) avoids breaking old code during a rollout
- Strict schemas buy data integrity and catch bugs early; flexible schemas buy development speed and reduce migration friction, at the cost of validation debt
- Denormalization is a schema design decision independent of strict vs flexible — either model can duplicate data deliberately for read performance
- Schema design should follow known access patterns, not abstract "correctness" — a technically pure schema that doesn't serve real queries well is still a bad schema
- Changing a schema after production data exists is fundamentally harder than designing it right upfront — most schema pain is retrofitting, not initial design

## Interview Questions

**Q:** What's the real difference between schema-on-write and schema-on-read?
**A:** Schema-on-write enforces structure at the engine level before data is accepted; schema-on-read has no engine enforcement, so the application must validate and handle every shape it encounters.

**Q:** Is a "schemaless" database actually schemaless?
**A:** No — the schema still exists, just implicitly in application code rather than enforced by the engine, which shifts validation burden without eliminating it.

**Q:** Why are schema migrations risky on large live tables?
**A:** Structural changes can lock tables or take long enough to cause downtime or replication lag, so they need explicit rollout, locking, and rollback plans.

**Q:** How do you evolve a schema without breaking existing consumers?
**A:** Make changes additive and backward-compatible — new nullable fields, versioned formats — rather than renaming or removing fields consumers already depend on.

## Scenario

A team ships a new required field to a table with millions of existing rows, and the migration locks the table for minutes, taking the app down. Splitting the change into an additive nullable column first, backfilling in batches, then enforcing not-null only after backfill completes avoids the lock — the schema evolves without an outage, regardless of whether the underlying store enforces schema at write time or not.
