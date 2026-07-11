---
title: "Databases and DBMS — System Design Notes"
---

Picture a phone book in your head - names next to numbers, sorted alphabetically. If you look up a name, you find it quickly. You can add a new entry, update an old one, delete a mistake - all of it possible. That's a small database. In reality Facebook's database holds 3 billion users' data - but the concept is the same.

## What is a Database?

A **Database** is a collection of organized data - from which you can quickly search, retrieve, update, and delete. It's typically managed by a **DBMS (Database Management System)**.

**Note:** An Excel file is also a kind of database - but it has no concurrent users, transactions, or security. So production systems need an RDBMS like MySQL, PostgreSQL, and so on.

## What is a DBMS?

DBMS = Database + Management Software. What it does:

- **Data storage:** Storing data on disk in a structured way.
- **Data retrieval:** Fetching data via a query language.
- **Concurrency:** Many users can work at the same time.
- **Transactions:** ACID guarantees.
- **Security:** User permissions, encryption.
- **Backup/Recovery:** Recovering from a crash.

## Why do you need a database?

- **Persistence:** Data survives even after power off.
- **Concurrent access:** Thousands of users at once.
- **Integrity:** Constraints block invalid data.
- **Querying:** Complex searches made easy - with SQL.
- **Scalability:** Scaling via replication and sharding.

## Types of Databases

### 1. Relational (RDBMS)

Table-based, schema-driven, uses SQL. MySQL, PostgreSQL, Oracle, SQL Server.

### 2. NoSQL

Flexible schema. Four subtypes:

- **Document:** MongoDB, CouchDB - JSON-like documents.
- **Key-Value:** Redis, DynamoDB - a simple hash map.
- **Wide-column:** Cassandra, HBase - column families.
- **Graph:** Neo4j, ArangoDB - nodes + edges.

### 3. Time-series

InfluxDB, TimescaleDB - for IoT and monitoring metric data.

### 4. Search

Elasticsearch, Solr - full-text search.

### 5. NewSQL

Google Spanner, CockroachDB - RDBMS reliability + NoSQL scale.

## OLTP vs OLAP

**OLTP (Online Transaction Processing)**
- Daily operations - orders, payments, logins
- Lots of small transactions
- Reads + writes balanced
- Latency-sensitive (ms)
- Example: MySQL, PostgreSQL

**OLAP (Online Analytical Processing)**
- Analytics, reporting, BI
- Few large queries
- Read-heavy
- Latency-tolerant (sec/min)
- Example: Snowflake, BigQuery, Redshift

## Core Components of a Database

- **Storage Engine:** How data is stored on disk - InnoDB, RocksDB.
- **Query Processor:** Parses, optimizes, and executes SQL.
- **Transaction Manager:** Enforces ACID.
- **Buffer Pool:** Caches frequently used data in RAM.
- **Write-Ahead Log (WAL):** For crash recovery.
- **Index Manager:** B-tree, hash index.

## Real-World Examples

- **Facebook:** MySQL (user data) + Cassandra (messaging) + Memcached.
- **Netflix:** Cassandra (viewing history) + DynamoDB + MySQL.
- **Banking:** Oracle/DB2 (strong ACID, audit).
- **Twitter:** Manhattan (custom KV) + MySQL + Redis.

## Common Misconceptions

1. **"NoSQL is always faster":** No - it depends on the query pattern. An indexed RDBMS is often faster.
2. **"One DB solves everything":** Modern systems use polyglot persistence - different DBs for different data types.
3. **"DB scaling is vertical only":** Horizontal scaling is possible via replication and sharding.

## Best Practices

- Understand the use case first - then choose the DB.
- Configure backup and point-in-time recovery.
- Set up monitoring (slow query log, connection pool).
- Security: encryption at rest + in transit, least privilege.
- Use a schema migration tool (Flyway, Liquibase).
- Use a connection pool - not direct connections.

## Chapter Summary

- DBMS = data + management software.
- Relational, NoSQL (document/KV/wide-column/graph), Time-series, Search, NewSQL.
- OLTP handles daily operations; OLAP handles analytics.
- Polyglot persistence - using multiple DBs together is common.
- DB selection depends on the use case.
