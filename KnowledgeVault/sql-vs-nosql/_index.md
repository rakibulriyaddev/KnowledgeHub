---
id: sql-vs-nosql
title: "SQL vs NoSQL"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, architecture]
parent: database
children: []
status: draft
---

# SQL vs NoSQL

## Overview

SQL (relational) and NoSQL (document, key-value, wide-column, graph) are two different bets on what to make better: a fixed schema with joins, or flexible structure with easy scale across many machines. Neither one is always "better" — the choice depends on the shape of your data and how you use it, not on which is newer or more popular. Most real systems end up using more than one type together.

## Key Concepts

- **Schema-on-write vs schema-on-read** — structure forced at write time, vs flexible structure read and understood by the app
- **Joins vs denormalization** — keeping data correct through table links, vs NoSQL's habit of copying data to make reads fast
- **Vertical vs horizontal scaling** — relational systems first scale by using a bigger machine; most NoSQL systems are built to scale across many machines from the start
- **Consistency model** — relational systems default to strong consistency; many NoSQL systems let you choose weaker, "eventual" consistency for more speed
- **Polyglot persistence** — using different kinds of databases for different parts of the same app

## Core Knowledge

- The real thing driving the choice is how you access data and its shape, not just scale — even a small dataset with deep links between parts still does better as a relational model
- Relational systems give you correctness and flexible, ad hoc queries (joins, totals across any field) but pay for that with harder scaling across many machines for writes
- NoSQL systems give you scale across many machines and flexible modeling, but you must know your query patterns ahead of time — flexible schema does not mean flexible queries
- Strong consistency (the relational default) versus tunable or "eventual" consistency (common in NoSQL) is a real tradeoff, and it maps to the CAP theorem idea covered elsewhere
- Picking NoSQL doesn't remove the need for careful data planning — it just moves that planning from schema design to query-pattern design, done early and hard to change later
- Using more than one database type together is the common real-world result: relational for core transaction data, a cache for fast reads, a document store for flexible content, a graph store for features about relationships — all inside one system (for example, Facebook uses MySQL, Cassandra, Memcached, and its own graph store called TAO)
- When you're not sure of the data shape yet, hybrid engines like PostgreSQL (relational plus JSONB documents) are a safe starting point, instead of jumping straight into a pure NoSQL store
- Moving from one model to the other later costs a lot either way — relational-to-NoSQL loses flexible ad hoc queries, NoSQL-to-relational means adding schema and relationships onto data that was copied everywhere
- "NoSQL scales better" is too simple a claim — modern relational systems (through replication, sharding, connection pooling) scale much further than people think; NoSQL's real edge is scaling with less setup work for certain access patterns

## Interview Questions

**Q:** What's the actual decision criterion between SQL and NoSQL — is it about scale?
**A:** Mainly how you access data and its shape — relationships and ad hoc queries favor relational; known, high-volume, single-record lookups favor NoSQL, no matter the raw data size.

**Q:** Does choosing a NoSQL database remove the need for upfront data modeling?
**A:** No — it moves the planning work from schema design to query-pattern design, and that design is often harder to change later than a relational schema change.

**Q:** What is polyglot persistence and why is it common in practice?
**A:** Using more than one type of database in one system, each fitted to a subsystem's needs — like relational for transactions, a cache for fast reads, a graph store for relationship lookups — instead of forcing one model to fit every need.

**Q:** Is it true that relational databases can't scale horizontally?
**A:** No — sharding and read replicas let relational systems scale a good amount, just with more setup work than NoSQL systems, which were built to scale across machines from the start.

## Scenario

A growing online store starts fully relational, then later adds a product catalog where each category has very different fields, a fast cache for session data, and a "customers who bought X" recommendation feature. Instead of forcing all three into the original relational schema, the team adds a document store for the catalog, a key-value store for sessions, and a graph store for recommendations — each one picked for how it's used, while the core order and payment data stays relational for its strong correctness guarantees.
