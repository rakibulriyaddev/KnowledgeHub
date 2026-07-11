---
title: "Normalization and Denormalization — Q&A"
---

**Q: What's the main purpose of Normalization?**
A: Reduce data redundancy and anomalies — Normalization reduces redundancy and increases data integrity.

**Q: What is the condition for 1NF?**
A: Every column holds an atomic value — 1NF = every column holds a single value, not a list/array.

**Q: What is the condition for 2NF?**
A: 1NF + no partial dependency — 2NF = every non-key column depends on the whole PK (no partial dependency with a composite key).

**Q: What does 3NF prevent?**
A: Transitive dependency — 3NF blocks a non-key column from depending on another non-key column.

**Q: BCNF is generally a stricter version of 3NF.**
A: True — Almost every 3NF table is also BCNF - except for a few edge cases.

**Q: Which of these is an example of an Update Anomaly?**
A: A teacher's phone number change → updating many rows — The same data across many rows → missing an update causes inconsistency.

**Q: What is an Insert Anomaly?**
A: A new entry is impossible without sub-data — For example: adding a course requires a student - otherwise it can't be added.

**Q: Which normal form does the industry generally aim for?**
A: 3NF (or BCNF) — 3NF is the most balanced choice for OLTP. Higher normal forms are mostly of academic interest.

**Q: What is Denormalization?**
A: The opposite of normalize - duplicating data to speed up reads — Deliberately adding redundancy for the sake of performance.

**Q: When is it good to denormalize?**
A: Read-heavy + slow JOINs — Denormalize when JOINs are expensive in a read-dominant workload.

**Q: Denormalization is common in NoSQL.**
A: True — JOINs are expensive or don't exist - embedding/duplication is normal.

**Q: Banking systems are generally denormalized.**
A: False — Data integrity is critical in banking - highly normalized.

**Q: Reading a product's reviews requires joining 5 tables. Reads are slow. What do you do?**
A: Selective denormalization (copy product_name into the review) — Carefully duplicating frequently-joined data lets reads happen in a single shot.

**Q: You embedded category_name in the Product table. The category got renamed. What happens?**
A: All products will have the old category_name - a manual update is needed — Denormalized data has an update propagation problem.

**Q: Which is NOT an advantage of Normalizing?**
A: Fast reads (single table) — Reads are slower - JOINs are required.

**Q: What approach is used in data warehouses?**
A: Heavily denormalized (star/snowflake schema) — Fast reads matter in OLAP - long JOINs are avoided.

**Q: How is Twitter's timeline storage designed?**
A: A pre-computed denormalized timeline cache — Twitter uses a precomputed timeline (Redis) for fast reads.

**Q: Foreign key constraints are a tool for normalization's integrity.**
A: True — FKs enforce referential integrity.

**Q: What's good to try before going from Normalize to Denormalize?**
A: Try index, cache, read replica first — Try the cheap solutions first - denormalization is a last resort.

**Q: What is typical in an OLTP system?**
A: 3NF (normalized) — Data integrity is critical in OLTP - 3NF is preferred.
