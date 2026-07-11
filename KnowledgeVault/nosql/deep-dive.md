---
title: "NoSQL Databases — Deep Dive"
---

![Graph database](/vault/nosql/Graph_database_diagram.jpeg)

Suppose you're building a social network - every user's profile has different fields. Some have a hobby, some don't; some have 10 phone numbers, some have 1. In SQL you have to define every column upfront. But in NoSQL - add whatever you need, whenever you need it.

## What is NoSQL?

**NoSQL** ("Not Only SQL") = a collection of databases outside the relational model. Born in the late 1990s and early 2000s out of the web's demand for scale.

## Why NoSQL?

- **Flexible schema:** Add/remove fields freely.
- **Horizontal scale:** Petabytes of data - distributed across many servers.
- **High throughput:** Millions of ops/sec.
- **Specialized data:** Graph, geospatial, time-series.
- **Developer speed:** No ORM overhead; JSON directly.

## The 4 Types of NoSQL

### 1. Document Database
Data is stored as JSON/BSON documents. Each document can have a different schema.

```json
{
  "id": "user_001",
  "name": "Mahfuz",
  "email": "mahfuz@example.com",
  "addresses": [
    { "type": "home", "city": "Sylhet" },
    { "type": "office", "city": "Dhaka" }
  ]
}
```

- **Examples:** MongoDB, CouchDB, Firestore.
- **Used for:** CMS, catalogs, user profiles, real-time data.
- **Pros:** Object-oriented friendly, nested data without JOINs.
- **Cons:** Weaker consistency, complex queries are hard.

### 2. Key-Value Store
The simplest kind - one key, one value. Like a hash map.

- **Examples:** Redis, Memcached, DynamoDB, etcd.
- **Used for:** Caching, session stores, real-time leaderboards, queues.
- **Pros:** Extremely fast (O(1)), simple API.
- **Cons:** Complex queries impossible - lookup by key only.

### 3. Wide-Column Store
A dynamic number of columns per row. The core idea behind Cassandra.

- **Examples:** Apache Cassandra, HBase, ScyllaDB.
- **Used for:** Time-series, IoT, message logs, write-heavy workloads.
- **Pros:** Massive write throughput, linear horizontal scale.
- **Cons:** Eventually consistent, complex queries are hard.

### 4. Graph Database
Nodes and Edges - relationships are the center of everything. Ideal for social networks.

- **Examples:** Neo4j, ArangoDB, JanusGraph.
- **Used for:** Social networks, fraud detection, recommendation engines.
- **Pros:** Multi-hop queries (friend-of-friend) are fast.
- **Cons:** Specialized - doesn't fit every use case.

## Comparing the 4 Types

**Document** — JSON-like, flexible, MongoDB, most popular.
**Key-Value** — Simplest, fastest, Redis, cache/session.
**Wide-Column** — Massive scale, write-heavy, Cassandra, time-series/log.
**Graph** — Relationship, multi-hop query, Neo4j, social/fraud.

## BASE Properties

NoSQL generally follows BASE (the opposite of ACID):

- **Basically Available:** Always responds - gives you something.
- **Soft state:** State can change even without input.
- **Eventually consistent:** All nodes will converge, even if it takes a while.

## When to Use NoSQL?

- Schema changes rapidly.
- Massive scale (terabytes+, millions of QPS).
- Read/write throughput matters more than consistency.
- Specialized data (graph, time-series, geospatial).
- Hierarchical/nested data (JSON documents).

## When Not to Use NoSQL?

- ACID transactions are critical (banking).
- Complex relationships + JOINs are needed.
- Strong consistency is mandatory.
- Reporting/analytics with ad-hoc queries across all columns.

## Real-World Examples

- **Facebook Messenger:** HBase (wide-column).
- **Instagram:** Cassandra (notifications, feed).
- **Netflix:** Cassandra (viewing history) + DynamoDB.
- **Uber:** Cassandra + Redis + custom Schemaless.
- **LinkedIn:** Voldemort (KV) + Espresso (document).

## Common Misconceptions

1. **"NoSQL = no SQL":** No - it's "Not Only SQL". Many NoSQL DBs have a SQL-like query language (Cassandra CQL).
2. **"There's no schema":** An implicit schema always exists - in the code. Just not enforced at the DB level.
3. **"NoSQL is always better":** Depends on the use case - the wrong choice is a disaster.

## Best Practices

- Design your query patterns first - then the schema.
- Denormalization is normal - accept duplicate data.
- Add indexes thoughtfully - they impact write performance.
- Enable backup and replication.
- Understand the implications of eventual consistency.

## Chapter Summary

- NoSQL = Not Only SQL - an alternative to relational.
- 4 types: Document, Key-Value, Wide-Column, Graph.
- BASE properties (Basically Available, Soft state, Eventually consistent).
- Ideal for massive scale and flexible schemas.
- SQL is preferred when ACID transactions are needed.
