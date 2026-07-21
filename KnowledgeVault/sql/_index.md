---
id: sql
title: "SQL Databases — Relational Databases"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, relational-databases, acid, query-languages]
parent: sd-databases
children: []
status: draft
---

## Overview

A SQL (relational) database stores data in tables of rows and columns, linked together by relationships between tables, and is changed and read using Structured Query Language (SQL). It is fifty years old and still the default choice for most apps. Its strength is strong ACID guarantees and powerful queries, at the cost of harder scaling across many machines.

## Key Concepts

- Core structure — database, table, column, row, primary key, foreign key.
- Design built around a schema, with data types fixed before any data goes in.
- SQL command categories — DDL, DML, DQL, DCL, TCL.
- JOIN types — INNER, LEFT, RIGHT, FULL OUTER.
- ACID transaction guarantees.

## Core Knowledge

A relational database keeps data in tables (entities), where each row is one record and each column is one field; a primary key makes each row unique, and a foreign key points to another table, forming the "relations" the model is named after. The schema is set before data goes in — column types and rules must exist before you insert data, which keeps data correct but makes schema changes harder once the app is live. SQL commands fall into five groups: DDL (CREATE/ALTER/DROP) changes the schema, DML (INSERT/UPDATE/DELETE) changes data, DQL (SELECT) reads data, DCL (GRANT/REVOKE) controls who can do what, and TCL (COMMIT/ROLLBACK) controls transactions. JOINs combine tables: INNER JOIN returns only rows that match on both sides (the most common type), LEFT/RIGHT JOIN return all rows from one side and fill in NULL where there's no match, and FULL OUTER JOIN returns all rows from both sides.

The relational model's strengths are ACID transactions (atomicity, consistency, isolation, durability) for important work, strong consistency, powerful queries with JOINs and totals, schema rules that block bad data, and 50 years of solid, mature tools built around a standard (ANSI) language. Its limits are the flip side of those strengths: scaling across many machines (sharding) is hard because of the JOIN-centered model; schema changes are risky once the app is live; JOINs get slow as tables grow into millions of rows; and turning rows into objects in app code (the "object-relational mismatch") is tricky enough that ORMs exist just to make it easier. PostgreSQL and MySQL lead the open-source space, SQLite is used for embedded/local storage, and Oracle/SQL Server are common in enterprise and regulated industries. A common wrong belief is that SQL is always slow — a well-indexed query on a relational database runs in milliseconds even with millions of rows; the real risk is missing indexes and bad query plans, not the relational model itself.

## Interview Questions

**Q: What's the difference between INNER JOIN and LEFT JOIN?**
A: INNER JOIN returns only rows that match in both tables; LEFT JOIN returns every row from the left table plus any matches from the right, filling in NULL where there's no match.

**Q: Why is horizontal scaling harder for relational databases than for NoSQL?**
A: The relational model depends on JOINs and rules across tables that assume all related data is in one place; splitting rows across separate machines breaks JOINs and needs extra work in the app, or a Saga, to handle transactions across machines.

**Q: Is "SQL is slow" a fair criticism?**
A: No — with the right indexes and query design, relational databases return results in milliseconds even at millions of rows; slow performance usually comes from missing indexes or bad query plans, not from SQL itself.

## Scenario

A ticket-booking platform must make sure two customers can never buy the same seat, and that a payment and a seat booking either both succeed or both get undone together. It stores bookings, payments, and seat stock in PostgreSQL, using foreign keys to keep data correct and one ACID transaction to book the seat and record the payment together, as a single step.
