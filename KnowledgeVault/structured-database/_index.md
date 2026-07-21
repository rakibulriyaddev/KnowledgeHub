---
id: structured-database
title: "Structured Database"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, sql]
parent: database
children: [normalization, postgresql, mysql]
status: draft
---

# Structured Database

## Overview

A structured (relational) database stores data in tables of rows and columns, under a fixed schema, and is read and changed using SQL. It's the default choice when you know the shape of your data ahead of time, and the relationships between entities matter. Systems like PostgreSQL, MySQL, SQL Server, and Oracle lead this space.

## Key Concepts

- **Table** — a grid of rows (records) and columns (typed fields)
- **Schema** — the structure set before any data is added; the engine enforces it
- **Primary key** — a unique ID for each row
- **Foreign key** — a link from a row to another table's primary key
- **SQL** — a language for creating, reading, updating, and deleting data by describing what you want, not how
- **ACID** — Atomicity, Consistency, Isolation, Durability — the guarantees a transaction makes

## Core Knowledge

- The engine enforces the schema: wrong types, missing columns, and broken links are rejected the moment you try to write them
- Relationships are a core part of the model — one-to-one, one-to-many, many-to-many (through a junction table) — and joins put them back together at query time
- Normalizing data cuts down on duplication but adds more joins; denormalize on purpose only for paths that are read a lot
- Rules (primary key, foreign key, unique, not-null, check) push correctness into the engine — cheaper and safer than checking it yourself in app code
- Isolation levels trade off correctness for how many things can run at once; the default setting is rarely the strictest one (serializable)
- Changing the schema on large, live tables is risky while the app is running — plan for locking and for rolling back if it goes wrong
- The query planner, not the words in your query, decides how fast it runs — read the execution plan to know why
- Scaling starts with a bigger machine; scaling across many machines (read replicas, sharding) adds complexity and weakens some guarantees

## Interview Questions

**Q:** What makes a database "structured"?
**A:** A fixed schema, enforced by the engine — tables with typed columns set up before any data is written.

**Q:** Primary key vs foreign key?
**A:** A primary key uniquely identifies a row in its own table; a foreign key points to a primary key in another table, forming a relationship.

**Q:** How do you decide between normalizing and denormalizing?
**A:** Normalize by default, for correctness; denormalize only in specific cases, when join cost is hurting a read-heavy path that's proven to need it.

**Q:** Why can two logically identical queries perform completely differently?
**A:** The query planner picks how to run the query based on indexes and stored statistics — different plans lead to different costs, even for queries that look the same.

## Scenario

A banking app must move money between two accounts: take money from one, add it to the other. If the process crashes halfway through, money could disappear. A structured database wraps both updates in a single ACID transaction — either both happen or neither does — and foreign keys make sure every transfer points to real accounts.
