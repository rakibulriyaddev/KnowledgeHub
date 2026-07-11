---
title: "Databases and DBMS — Q&A"
---

**Q: What does DBMS stand for?**
A: Data Base Management System — DBMS = Database Management System.

**Q: What does persistence mean in a database?**
A: Data survives even after power off — Persistent storage - written to disk, not just RAM.

**Q: Which of these is a Document database?**
A: MongoDB — MongoDB is a JSON-like document store.

**Q: Which of these is a Graph database?**
A: Neo4j — Neo4j is a popular graph DB - node + edge structure.

**Q: Between OLTP and OLAP, what is OLTP for?**
A: Daily transactions (orders, payments) — OLTP = small transactions, latency-sensitive.

**Q: Which category do BigQuery and Snowflake belong to?**
A: OLAP — OLAP = analytical processing, large queries.

**Q: An Excel file is sufficient as a production database.**
A: False — No concurrent users, transactions, or security - a production system needs a DBMS.

**Q: Which of these is a Wide-column database?**
A: Cassandra — Cassandra and HBase are wide-column stores.

**Q: What is an example of NewSQL?**
A: Google Spanner — Google Spanner and CockroachDB are NewSQL - RDBMS reliability + NoSQL scale.

**Q: What is polyglot persistence?**
A: Using multiple DB types together — Different DBs for different data needs - a modern best practice.

**Q: You're building an e-commerce site for Bangladesh. Which DB for the user's order history?**
A: PostgreSQL/MySQL (RDBMS) — Order data is structured and transactional - a relational DB is ideal.

**Q: IoT sensor data is arriving every second - which DB?**
A: Time-series DB (InfluxDB) — A time-series DB is optimized for timestamped data.

**Q: Why does WAL (Write-Ahead Log) exist?**
A: Crash recovery — WAL - changes are written to the log before being committed to disk; replayed on crash.

**Q: The buffer pool keeps frequently accessed data in RAM.**
A: True — The buffer pool is the DB's memory cache, critical for performance.

**Q: Which DB is good for search?**
A: Elasticsearch — Elasticsearch is optimized for full-text search.

**Q: Why is a connection pool needed?**
A: To avoid the overhead of connecting every time — TCP handshake + auth are expensive - a pool provides prebuilt connections.

**Q: Which DB for banking transactions?**
A: PostgreSQL/Oracle (strong ACID) — ACID is critical in banking - an RDBMS is ideal.

**Q: For which use case is a Graph DB good?**
A: Social network connections — Friend-of-friend, recommendation graphs - Neo4j's territory.

**Q: NoSQL is always faster than SQL.**
A: False — An indexed RDBMS is often faster. NoSQL is fast - only for specific patterns.

**Q: What is an example of a schema migration tool?**
A: Flyway/Liquibase — Flyway, Liquibase - DB schema version control.
