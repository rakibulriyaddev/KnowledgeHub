---
id: structured-database
title: "Structured Database"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage, sql]
parent: database
children: []
---

# Structured Database

## Overview

A structured (relational) database stores data in tables of rows and columns under a fixed schema, queried with SQL. It is the default choice when the data shape is known upfront and relationships between entities matter. Systems like PostgreSQL, MySQL, SQL Server, and Oracle dominate this space.

## Key Concepts

- **Table** — grid of rows (records) and columns (typed fields)
- **Schema** — structure declared before data is inserted; enforced by the engine
- **Primary key** — unique identifier per row
- **Foreign key** — link from a row to another table's primary key
- **SQL** — declarative language for creating, reading, updating, deleting data
- **ACID** — Atomicity, Consistency, Isolation, Durability — transaction guarantees

## Core Knowledge

- The schema is enforced by the engine: wrong types, missing columns, and broken references are rejected at write time
- Relationships are first-class — one-to-one, one-to-many, many-to-many (via junction table) — and joins recombine them at query time
- Normalization reduces duplication but multiplies joins; denormalize deliberately for read-heavy paths
- Constraints (primary key, foreign key, unique, not-null, check) push integrity into the engine — cheaper and safer than enforcing it in application code
- Isolation levels trade correctness for concurrency; the default is rarely serializable
- Schema migrations on large live tables are an operational risk — plan for locking and rollback
- The query planner, not the query text, decides performance — read execution plans
- Scaling is vertical-first; horizontal scaling (read replicas, sharding) costs complexity and weakens some guarantees

## Interview Questions

**Q:** What makes a database "structured"?
**A:** A fixed, engine-enforced schema — tables with typed columns declared before data is written.

**Q:** Primary key vs foreign key?
**A:** Primary key uniquely identifies a row in its own table; foreign key references a primary key in another table to form a relationship.

**Q:** How do you decide between normalizing and denormalizing?
**A:** Normalize by default for integrity; denormalize selectively when join cost hurts a proven read-heavy path.

**Q:** Why can two logically identical queries perform completely differently?
**A:** The query planner picks execution strategies based on indexes and statistics — different plans, different costs.

## Scenario

A banking app must transfer money between two accounts: debit one, credit the other. If the process crashes midway, money vanishes. A structured database wraps both updates in a single ACID transaction — either both apply or neither does — and foreign keys guarantee every transfer references real accounts.
