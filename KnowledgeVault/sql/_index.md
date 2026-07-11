---
id: sql
title: "SQL Databases — Relational Databases"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, relational-databases, acid, query-languages]
parent: sd-databases
children: []
status: draft
---

## Overview

A SQL (relational) database stores data in tables of rows and columns, linked by relationships between tables, and is manipulated via Structured Query Language. Fifty years old and still the default choice for the majority of applications, its strength is strong ACID guarantees and powerful querying at the cost of harder horizontal scaling.

## Key Concepts

- Core structure — database, table, column, row, primary key, foreign key.
- Schema-driven design with fixed data types defined ahead of time.
- SQL command categories — DDL, DML, DQL, DCL, TCL.
- JOIN types — INNER, LEFT, RIGHT, FULL OUTER.
- ACID transaction guarantees.

## Core Knowledge

A relational database organizes data into tables (entities), where each row is a record and each column an attribute; a primary key makes each row unique and a foreign key links to another table, forming the "relations" the model is named for. Schemas are defined upfront — column types and constraints must exist before data is inserted, which enforces data integrity but makes schema changes in production harder. SQL commands split into five categories: DDL (CREATE/ALTER/DROP) changes the schema, DML (INSERT/UPDATE/DELETE) changes data, DQL (SELECT) queries data, DCL (GRANT/REVOKE) manages permissions, and TCL (COMMIT/ROLLBACK) controls transactions. JOINs combine tables: INNER JOIN returns only matching rows (most common), LEFT/RIGHT JOIN return all rows from one side with NULLs where there's no match, and FULL OUTER JOIN returns all rows from both sides.

The relational model's strengths are ACID transactions (atomicity, consistency, isolation, durability) for critical operations, strong consistency, powerful aggregate/JOIN queries, schema validation that blocks invalid data, and 50 years of mature tooling around a standardized (ANSI) language. Its limits are the flip side of those strengths: horizontal scaling (sharding) is hard because of the relational, JOIN-centric model; schema changes are risky in production; JOINs get expensive as tables grow into the millions of rows; and mapping rows to objects in application code (object-relational mismatch) is complex enough that ORMs exist specifically to paper over it. PostgreSQL and MySQL dominate the open-source space, with SQLite for embedded/local storage and Oracle/SQL Server common in enterprise and regulated industries. A widespread misconception is that SQL is inherently slow — a properly indexed query on a relational database runs in milliseconds even against millions of rows; the real risk is missing indexes and unoptimized query plans, not the relational model itself.

## Interview Questions

**Q: What's the difference between INNER JOIN and LEFT JOIN?**
A: INNER JOIN returns only rows with a match in both tables; LEFT JOIN returns every row from the left table plus matches from the right, filling in NULL where there's no match.

**Q: Why is horizontal scaling harder for relational databases than for NoSQL?**
A: The relational model relies on JOINs and cross-table constraints that assume all related data is reachable in one place; splitting rows across independent shards breaks JOINs and requires application-level merging or a Saga for cross-shard transactions.

**Q: Is "SQL is slow" a fair criticism?**
A: No — with correct indexing and query design, relational databases return millisecond-level results even at millions of rows; performance problems usually trace back to missing indexes or bad query plans, not SQL itself.

## Scenario

A ticket-booking platform needs to guarantee that two customers can never buy the same seat and that a payment and a seat reservation either both succeed or both roll back. It stores bookings, payments, and seat inventory in PostgreSQL, relying on foreign keys for referential integrity and a single ACID transaction to atomically reserve the seat and record the payment.
