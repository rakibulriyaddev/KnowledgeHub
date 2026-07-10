---
id: database
title: "Database"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage]
parent: null
children: []
---

# Database

Organized collection of data, stored and accessed electronically via a DBMS.

## Why database?

- Store data reliably (durability)
- Query/filter data fast
- Share data across apps/users
- Avoid manual file handling, duplication, corruption

## Types

- **Structured (SQL)** — tables, rows, columns, fixed schema
- **Unstructured / Semi-structured (NoSQL)** — documents, key-value, graph, flexible schema

*(each type — separate topic, deep dive later)*

## Key concepts

- DBMS — software managing the database
- Schema — structure/blueprint of data
- Table / Collection — where records live
- Primary key — unique row identifier
- Query — request to read/write data
- Index — speeds up lookups
- Transaction — group of operations, all-or-nothing (ACID)
- Relationship — link between tables (one-to-one, one-to-many, many-to-many)
- Normalization — reduce data duplication
- Replication / Sharding — scale & availability
