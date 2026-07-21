---
id: nosql
title: "NoSQL Databases"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, distributed-systems, scaling, data-modeling]
parent: sd-databases
children: []
status: draft
---

## Overview

NoSQL ("Not Only SQL") is a group of non-relational databases that grew from the web's need for flexible schemas and huge scale across many machines. Instead of one relational model, it splits into four separate types — document, key-value, wide-column, and graph — each built for a different way of using data.

## Key Concepts

- Four types — Document, Key-Value, Wide-Column, Graph.
- Flexible/open schema vs SQL's fixed schema.
- BASE properties as the consistency idea (vs ACID).
- Schema design starts from query patterns, not the other way around.
- Copying data on purpose is normal here, not the exception.

## Core Knowledge

Document databases (MongoDB, CouchDB, Firestore) store JSON/BSON documents where each record can have a different shape — great for catalogs, CMS content, and profiles with fields that vary, but weaker at complex queries across documents and at consistency. Key-value stores (Redis, Memcached, DynamoDB) are the simplest and fastest — instant lookup by key only, perfect for caching, sessions, and leaderboards, but they can't do complex queries. Wide-column stores (Cassandra, HBase, ScyllaDB) allow a different number of columns per row and are built for very high write speed — time-series, IoT, logs — at the cost of eventual consistency and less query flexibility. Graph databases (Neo4j, ArangoDB) store nodes and edges directly, making multi-step queries (friend-of-friend) fast in ways relational JOINs can't match, but they're specialized and don't fit every job.

Most NoSQL systems follow BASE (Basically Available, Soft state, Eventually consistent) instead of ACID: the system always answers, its state can shift on its own as copies sync up, and all copies eventually match rather than being instantly the same. This trades strict correctness for uptime and scale across many machines. NoSQL fits well when the schema changes often, scale is huge (terabytes, millions of requests per second), or the data naturally fits a special shape (graph, location, time-series); it's the wrong pick when ACID transactions are a must (banking), when heavy relational JOINs and ad-hoc analytics are core needs, or when strong consistency is required. In practice the design order flips: NoSQL asks you to define how you'll query the data first, then shape the schema around that — the opposite of SQL's shape-first, query-later way — and copying data to avoid JOINs is expected here, not a bad sign.

## Interview Questions

**Q: Why would you choose a wide-column store over a document store?**
A: Wide-column stores like Cassandra are built for very high write speed and easy scale across machines — great for time-series/IoT/log data — while document stores are better for flexible, nested records read as a whole.

**Q: What does "eventually consistent" actually promise?**
A: That all copies will match given enough time with no new writes — not that reads are wrong forever, and not that reads are instantly correct either.

**Q: Why is copying data seen as normal in NoSQL design?**
A: Without JOINs, answering a read in one query needs the data it wants already sitting together, so copying it across documents/rows is a deliberate trade for read speed.

## Scenario

A social network needs user profiles where some users have ten phone numbers and others have none, plus a friend-of-friend suggestion feature and a live online-status cache. The team stores profiles in MongoDB (document, flexible schema), builds the social graph in Neo4j (multi-step queries), and caches online status in Redis (key-value, instant reads) — three NoSQL types, each matched to its job.
