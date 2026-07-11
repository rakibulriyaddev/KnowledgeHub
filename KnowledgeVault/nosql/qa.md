---
title: "NoSQL Databases — Q&A"
---

**Q: What does NoSQL actually stand for?**
A: Not Only SQL — NoSQL = Not Only SQL - many NoSQL DBs have a SQL-like query language.

**Q: Which of these is a Document database?**
A: MongoDB — MongoDB is primarily a document store.

**Q: Which of these is a Key-Value store?**
A: Redis — Redis is the most popular KV store.

**Q: What type of DB is Cassandra?**
A: Wide-column — Cassandra is wide-column - massive write scale.

**Q: What type of DB is Neo4j?**
A: Graph — Neo4j is a top graph DB - node + edge structure.

**Q: In a Document DB, each document can have a different schema.**
A: True — Schema-less / flexible schema - the main feature.

**Q: Which of these is one of the BASE properties?**
A: Eventually Consistent — BASE = Basically Available, Soft state, Eventually Consistent.

**Q: Which DB is best for a friend-of-friend query on a social network?**
A: Neo4j (Graph) — Multi-hop relationship queries are fast on graph DBs.

**Q: Which NoSQL DB is best for time-series IoT data?**
A: Cassandra (wide-column) — Cassandra excels at write-heavy time-series data.

**Q: Which NoSQL DB is best for caching and sessions?**
A: Redis — Redis is an in-memory KV store - ideal for caching and sessions.

**Q: NoSQL is always faster than SQL.**
A: False — It depends on the use case. Indexed RDBMS is often faster.

**Q: What does eventually consistent mean?**
A: All nodes will converge eventually, even if it takes a while — Eventually consistent = all replicas reach the same state after some time.

**Q: You need banking transactions. Should you go with NoSQL?**
A: No - ACID is needed, RDBMS is preferred — Strong ACID is critical in banking - RDBMS.

**Q: An e-commerce site has widely varying fields on user profiles. Which DB?**
A: MongoDB (flexible) — Variable fields are the strength of a document DB.

**Q: Why is denormalization normal in NoSQL?**
A: No JOINs - duplicating data makes reads fast — There are no JOINs, so data is duplicated to be fetched in a single read query.

**Q: What is CQL?**
A: Cassandra Query Language — Cassandra Query Language - SQL-like syntax, but for NoSQL.

**Q: You need to build a real-time leaderboard. Which DB?**
A: Redis (sorted set) — Redis sorted sets - perfect for leaderboards.

**Q: Which DB does Facebook Messenger use?**
A: HBase (wide-column) — Facebook Messenger runs on HBase.

**Q: In NoSQL DBs, it's good to design query patterns first and build the schema after.**
A: True — NoSQL: query → schema (RDBMS: schema → query).

**Q: What is BSON?**
A: Binary JSON — BSON = Binary JSON - MongoDB's internal storage format.
