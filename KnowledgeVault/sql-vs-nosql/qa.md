---
title: "SQL vs NoSQL — Q&A"
---

**Q: Which of these is generally a characteristic of SQL DBs?**
A: ACID transaction — SQL DBs are known for ACID transactions.

**Q: NoSQL is generally good at which type of scaling?**
A: Horizontal — NoSQL scales horizontally - distributed clusters.

**Q: Which is better for banking transactions?**
A: SQL — ACID is needed - SQL DB.

**Q: Which is better for storing IoT sensor data?**
A: NoSQL (time-series/wide-column) — Massive write volume, time-series - NoSQL is better.

**Q: NoSQL is always more scalable than SQL.**
A: False — A properly designed sharded RDBMS also handles huge scale. NoSQL is just easier to scale.

**Q: In CAP terms, SQL DBs are generally which combination?**
A: CP — SQL DBs choose consistency (CP).

**Q: What does polyglot persistence mean?**
A: Using multiple DB types together — Different DBs for different data types - a modern best practice.

**Q: Which has more schema flexibility?**
A: NoSQL — NoSQL is schema-on-read; SQL is schema-on-write.

**Q: Which one is easier for complex JOINs and aggregate queries?**
A: SQL — SQL's powerful query language - NoSQL is limited here.

**Q: Facebook and Twitter used SQL DBs initially.**
A: True — Twitter started with MySQL; later diversified. Facebook still uses MySQL.

**Q: A startup needs to launch an MVP quickly. What would you choose?**
A: PostgreSQL (versatile) — PostgreSQL has JSON support, ACID, complex queries - ideal for a quick MVP.

**Q: A large social media platform needs to serve a news feed. Which DB?**
A: Polyglot - SQL for profiles, NoSQL for feed cache — User profiles in SQL, real-time feed in Redis/Cassandra - polyglot.

**Q: What replaces JOINs in NoSQL?**
A: Denormalization (duplicate data via embedding) — JOINs are expensive or unavailable - so data is embedded for fast reads.

**Q: Horizontal scaling is impossible in SQL DBs.**
A: False — It's possible via sharding - but complex.

**Q: Which is better for real-time chat?**
A: NoSQL (HBase/Cassandra) — Massive write throughput, eventual consistency is fine - NoSQL is better.

**Q: Which is NOT an advantage of SQL?**
A: Massive horizontal scale — Massive horizontal scale is RDBMS's weak side.

**Q: What's needed for inventory management?**
A: SQL (transaction critical) — Stock count race conditions require strong ACID.

**Q: What does having JSONB in PostgreSQL mean?**
A: Document-style data can live inside a SQL DB — PostgreSQL is hybrid - both relational and JSON document capable.

**Q: Using SQL and NoSQL together in the same app is acceptable.**
A: True — Polyglot persistence - a normal modern practice.

**Q: What should you start with when in doubt?**
A: PostgreSQL (versatile) — PostgreSQL has ACID + JSON + complex queries - the most flexibility.
