---
id: database-schema
title: "Database Schema"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage]
parent: database
children: [schema-migration]
status: draft
---

# Database Schema

## Overview

A schema is the structure data must follow — the shape, types, and rules that define what's valid to store. It exists so a database (and everyone who uses it) can agree on what the data means, whether that agreement is enforced strictly at write time or read loosely at read time. Every database has a schema in some form; the real question is who enforces it, and when.

## Key Concepts

- **Schema-on-write** — structure set and enforced by the engine before data is accepted (the relational default)
- **Schema-on-read** — structure worked out by the app when data is read, not enforced at write time (the NoSQL default)
- **Constraint** — a rule the engine checks (type, not-null, unique, foreign key, check)
- **Migration** — a controlled, tracked change to schema structure over time
- **Schema evolution** — how a schema changes without breaking existing data or running code
- **Schema validation** — optional engine-level rule checks added on top of otherwise loose schemas

## Core Knowledge

- Schema-on-write rejects bad data right away; schema-on-read pushes that cost to every reader, which must handle every shape ever written
- A schema is never truly missing — "schemaless" systems just move the schema from the engine into app code, without saying so
- Changes to live, large tables carry real risk — locking, downtime, and rollback plans matter as much as the change itself
- Backward-friendly schema changes (adding fields, nullable new columns, versioned documents) avoid breaking old code during a rollout
- Strict schemas buy data correctness and catch bugs early; loose schemas buy build speed and less migration friction, at the cost of unchecked data
- Denormalizing (copying data on purpose) is a schema choice separate from strict vs loose — either style can copy data on purpose for read speed
- Schema design should follow real access patterns, not abstract "correctness" — a technically clean schema that doesn't serve real queries well is still a bad schema
- Changing a schema after live data exists is much harder than designing it right up front — most schema pain comes from fixing later, not designing first

## Interview Questions

**Q:** What's the real difference between schema-on-write and schema-on-read?
**A:** Schema-on-write enforces structure at the engine level before data is accepted; schema-on-read has no engine enforcement, so the app must check and handle every shape it meets.

**Q:** Is a "schemaless" database actually schemaless?
**A:** No — the schema still exists, just quietly in app code instead of enforced by the engine, which moves the checking work without removing it.

**Q:** Why are schema migrations risky on large live tables?
**A:** Structural changes can lock tables or take long enough to cause downtime or replication lag, so they need a clear rollout, locking, and rollback plan.

**Q:** How do you change a schema without breaking existing users of it?
**A:** Make changes additive and backward-friendly — new nullable fields, versioned formats — instead of renaming or removing fields others already depend on.

## Scenario

A team adds a new required field to a table with millions of existing rows, and the migration locks the table for minutes, taking the app down. Splitting the change into an additive nullable column first, filling it in batches, then requiring it only after the fill finishes avoids the lock — the schema changes without an outage, no matter whether the store enforces schema at write time or not.
