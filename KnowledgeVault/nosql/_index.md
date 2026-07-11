---
id: nosql
title: "NoSQL Databases"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, distributed-systems, scaling, data-modeling]
parent: sd-databases
children: []
status: draft
---

## Overview

NoSQL ("Not Only SQL") is a family of non-relational databases born from the web's need for flexible schemas and massive horizontal scale. Instead of one relational model, it splits into four distinct types — document, key-value, wide-column, and graph — each optimized for a different access pattern.

## Key Concepts

- Four types — Document, Key-Value, Wide-Column, Graph.
- Flexible/implicit schema vs SQL's enforced schema.
- BASE properties as the consistency philosophy (vs ACID).
- Query-pattern-first schema design.
- Denormalization as the norm, not the exception.

## Core Knowledge

Document databases (MongoDB, CouchDB, Firestore) store JSON/BSON documents where each record can have a different shape — ideal for catalogs, CMS content, and profiles with variable fields, but weaker on complex cross-document queries and consistency. Key-value stores (Redis, Memcached, DynamoDB) are the simplest and fastest — O(1) lookup by key only, perfect for caching, sessions, and leaderboards, but incapable of complex queries. Wide-column stores (Cassandra, HBase, ScyllaDB) allow a dynamic number of columns per row and are built for massive write throughput — time-series, IoT, logs — at the cost of eventual consistency and query flexibility. Graph databases (Neo4j, ArangoDB) model nodes and edges directly, making multi-hop queries (friend-of-friend) fast in ways relational JOINs cannot match, but they're specialized and don't generalize to arbitrary workloads.

Most NoSQL systems follow BASE (Basically Available, Soft state, Eventually consistent) rather than ACID: the system always responds, state can shift without new input as replicas sync, and all replicas eventually converge rather than being instantly consistent. This trades strict correctness for availability and horizontal scale. NoSQL fits when the schema changes often, scale is extreme (terabytes, millions of QPS), or the data is naturally hierarchical/specialized (graph, geospatial, time-series); it's the wrong choice when ACID transactions are non-negotiable (banking), when heavy relational JOINs and ad-hoc analytics are core requirements, or when strong consistency is mandatory. In practice the schema design flow inverts: NoSQL asks you to define query patterns first, then shape the schema around them — the opposite of SQL's schema-first, query-later approach — and duplicating data to avoid JOINs is expected, not a smell.

## Interview Questions

**Q: Why would you choose a wide-column store over a document store?**
A: Wide-column stores like Cassandra are built for massive write throughput and linear horizontal scale — ideal for time-series/IoT/log data — while document stores optimize for flexible, nested records read as a whole.

**Q: What does "eventually consistent" actually guarantee?**
A: That all replicas will converge to the same state given enough time without new writes — not that reads are ever inconsistent forever, and not that reads are instantly correct either.

**Q: Why is denormalization considered normal in NoSQL design?**
A: Without JOINs, satisfying a read in a single query requires the needed data to already live together, so duplicating it across documents/rows is a deliberate trade-off for read speed.

## Scenario

A social network needs user profiles where some users have ten phone numbers and others have none, plus a friend-of-friend recommendation feature and a real-time online-status cache. The team stores profiles in MongoDB (document, flexible schema), models the social graph in Neo4j (multi-hop queries), and caches online status in Redis (key-value, O(1) reads) — three NoSQL types, each matched to its access pattern.
