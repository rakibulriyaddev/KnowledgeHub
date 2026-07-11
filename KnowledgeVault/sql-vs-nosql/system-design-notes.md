---
title: "SQL vs NoSQL — System Design Notes"
---

In a system design interview, this question is almost guaranteed: "SQL or NoSQL for this use case?" - the *why* behind your answer matters more than the answer itself.

## At a Glance

**SQL (Relational)**
- Structured table
- Fixed schema
- SQL query language
- ACID transaction
- Vertical scaling
- JOIN supported
- Strong consistency

**NoSQL**
- Document/KV/Column/Graph
- Flexible schema
- Custom API/CQL/etc.
- BASE (eventually consistent)
- Horizontal scaling
- Limited JOIN
- Eventual consistency

## Comparing Across Dimensions

### 1. Schema
- **SQL:** Strict - columns and types defined upfront. Schema changes are expensive.
- **NoSQL:** Flexible - any field, anytime.

### 2. Scalability
- **SQL:** Vertical scale is primary. Sharding is possible but complex.
- **NoSQL:** Designed for horizontal scale. Auto-sharding.

### 3. Consistency
- **SQL:** Strong consistency (ACID).
- **NoSQL:** Generally eventual consistency (BASE). Some DBs are tunable.

### 4. Query Power
- **SQL:** Powerful - JOIN, GROUP BY, subqueries, complex aggregates.
- **NoSQL:** Limited - primarily key/index based; complex queries are hard.

### 5. Transactions
- **SQL:** Multi-row, multi-table ACID transactions.
- **NoSQL:** Single document/row guaranteed; multi-document is limited (MongoDB 4+).

### 6. Data Relationships
- **SQL:** Strong relational integrity via foreign keys and JOINs.
- **NoSQL:** Embed (denormalize) or reference (manual JOIN in code).

### 7. Maturity
- **SQL:** 50 years of maturity - tools, libraries, experts.
- **NoSQL:** 15-20 years - but maturing fast.

## Through the Lens of the CAP Theorem

In a distributed system, only two of CAP's three properties are possible at once:

- **SQL DB:** Generally CP - Consistency and Partition tolerance.
- **NoSQL DB:** Many are AP - Availability and Partition tolerance. (Cassandra, DynamoDB)
- Some NoSQL DBs are CP (MongoDB single-node default).

## When SQL?

- **ACID transactions are critical:** Banking, payments, inventory.
- **Complex queries:** Reporting, BI, analytics.
- **Strong relationships:** User → Order → Product → Inventory.
- **Data integrity is essential:** Healthcare, legal, government.
- **Stable schema:** Established business logic.
- **Small to medium scale:** MySQL is fine for 1M users.

## When NoSQL?

- **Massive scale:** Petabytes of data, millions of QPS.
- **Flexible schema:** Rapid product evolution.
- **Specialized data:** Time-series, graph, geospatial.
- **Real-time:** Cache, leaderboard, session.
- **Hierarchical/nested:** JSON documents directly.
- **Eventually consistent is fine:** Social feed, news, view counts.

## Real-World Use Cases

**Good fit for SQL**
- E-commerce order/payment
- HR system
- Banking
- Inventory management
- Booking system
- CRM

**Good fit for NoSQL**
- Social media feed
- IoT sensor data
- Real-time chat
- Analytics dashboard
- Content CMS
- Caching/session

## Polyglot Persistence - Using Both

Modern systems often use multiple DBs within a single app, e.g. an e-commerce architecture:
- PostgreSQL → orders, payments (ACID)
- MongoDB → product catalog (flexible)
- Redis → session, cache
- Elasticsearch → product search
- Cassandra → user activity log

## Real-World Examples

- **Facebook:** MySQL (user, post) + Cassandra (messaging) + Memcached + TAO (graph).
- **Netflix:** MySQL (billing) + Cassandra (history) + DynamoDB.
- **Uber:** Schemaless on MySQL (custom) + Cassandra + Redis.

## Common Misconceptions

1. **"NoSQL is modern, SQL is old":** Both are modern. PostgreSQL got an update in 2024 - very advanced.
2. **"You must pick just one":** Polyglot persistence is normal - use both.
3. **"NoSQL = schema-less":** A schema exists - it just isn't enforced at the DB level, but it lives in the code.
4. **"SQL can't scale":** Twitter and Facebook started on MySQL - they scaled well through sharding.

## Best Practices

- Define the use case first - then pick the DB.
- Don't drop SQL just because "NoSQL is trendy".
- Using multiple DBs in the same app is acceptable.
- Consider tooling and team expertise.
- When in doubt - start with PostgreSQL (it has JSON support - flexibility built in).

## Chapter Summary

- SQL: structured, ACID, vertical scale, complex queries.
- NoSQL: flexible, BASE, horizontal scale, specialized.
- SQL = banking, transactions; NoSQL = social, IoT, real-time.
- Polyglot persistence - modern systems use both.
- The use case is the real decision driver.
