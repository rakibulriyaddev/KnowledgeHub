---
id: sql-vs-nosql
title: "SQL vs NoSQL"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, architecture]
parent: database
children: []
---

# SQL vs NoSQL

## Overview

SQL (relational) and NoSQL (document, key-value, wide-column, graph) represent different bets about which properties to optimize: schema rigidity and joins, or flexibility and horizontal scale. Neither is universally "better" — the decision is a data-shape and access-pattern question, not a maturity or fashion question, and most real systems end up polyglot rather than picking one.

## Key Concepts

- **Schema-on-write vs schema-on-read** — enforced structure at insert time vs flexible structure interpreted by the application
- **Joins vs denormalization** — relational integrity through relationships vs NoSQL's query-first, duplicate-heavy modeling
- **Vertical vs horizontal scaling** — relational engines scale up first; most NoSQL families scale out natively
- **Consistency model** — relational defaults to strong consistency; many NoSQL systems offer tunable or eventual consistency
- **Polyglot persistence** — using different databases for different subsystems of the same application

## Core Knowledge

- The real decision driver is access pattern and data shape, not scale alone — a small dataset with deep relationships still benefits from relational modeling regardless of size
- Relational systems buy integrity and flexible ad hoc querying (joins, aggregates across any dimension) at the cost of harder horizontal write scaling
- NoSQL systems buy horizontal scale and modeling flexibility at the cost of needing to know the query patterns upfront — schema flexibility does not mean query flexibility
- Strong consistency (relational default) versus tunable/eventual consistency (common NoSQL default) is a real tradeoff visible directly in the CAP theorem framing already covered generically
- Choosing NoSQL doesn't remove the need for data modeling discipline — it moves the discipline from schema design to query-pattern design, done upfront and harder to change later
- Polyglot persistence is the common real-world outcome: relational for core transactional data, a cache for hot reads, a document store for flexible content, a graph store for relationship-heavy features — all in one system
- Migrating between the two models later is expensive in both directions — relational-to-NoSQL loses ad hoc query flexibility, NoSQL-to-relational requires retrofitting schema and relationships onto denormalized data
- "NoSQL scales better" is an oversimplification — modern relational engines (via replication, sharding, connection pooling) scale substantially further than commonly assumed; NoSQL's advantage is scaling with less operational effort for specific access patterns

## Interview Questions

**Q:** What's the actual decision criterion between SQL and NoSQL — is it about scale?
**A:** Primarily access pattern and data shape — relationships and ad hoc querying favor relational; known, high-volume, single-entity-lookup patterns favor NoSQL, regardless of raw data size.

**Q:** Does choosing a NoSQL database remove the need for upfront data modeling?
**A:** No — it shifts the modeling effort from schema design to query-pattern design, and that design is often harder to change later than a relational schema migration.

**Q:** What is polyglot persistence and why is it common in practice?
**A:** Using multiple database types within one system, each suited to a specific subsystem's access pattern — e.g. relational for transactions, a cache for hot reads, a graph store for relationship traversal — rather than forcing one model to fit every need.

**Q:** Is it true that relational databases can't scale horizontally?
**A:** No — sharding and read replicas let relational systems scale substantially, just with more operational complexity than NoSQL systems that were designed for horizontal scale from the start.

## Scenario

A growing e-commerce platform starts fully relational and later adds a product catalog with wildly varying attributes per category, a hot-path cache for session data, and a "customers who bought X" recommendation feature. Rather than forcing all three into the original relational schema, the team adds a document store for the catalog, a key-value store for sessions, and a graph store for recommendations — each chosen for its access pattern, with the core order/payment data staying relational for its integrity guarantees.
