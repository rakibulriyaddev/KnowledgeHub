---
title: "SQL Databases — Q&A"
---

**Q: What does SQL stand for?**
A: Structured Query Language — SQL = Structured Query Language.

**Q: What is each row called in a relational DB?**
A: Record/Tuple — A row = a record/tuple - a specific entry.

**Q: What does a Primary Key do?**
A: Makes a row unique — A Primary Key uniquely identifies each row.

**Q: What is a Foreign Key?**
A: A reference to another table's primary key — An FK creates a relationship with another table.

**Q: What does INNER JOIN return?**
A: Only matching rows — INNER JOIN returns rows that match in both tables.

**Q: What happens with LEFT JOIN?**
A: All rows from the left + matches — LEFT JOIN returns all rows from the left table + matches from the right (NULL if none).

**Q: CREATE, ALTER, DROP - which category?**
A: DDL — DDL = Data Definition Language (changes the schema).

**Q: INSERT, UPDATE, DELETE - which category?**
A: DML — DML = Data Manipulation Language.

**Q: SELECT belongs to which category?**
A: DQL — DQL = Data Query Language.

**Q: COMMIT, ROLLBACK belong to which category?**
A: TCL — TCL = Transaction Control Language.

**Q: A SQL database is schema-driven.**
A: True — The schema (column types, constraints) must be defined when the table is created.

**Q: What's different about PostgreSQL's JSONB?**
A: Binary JSON - faster queries — JSONB is binary-encoded - faster to index and query.

**Q: Which DB does Stack Overflow use?**
A: Microsoft SQL Server — Stack Overflow runs primarily on Microsoft SQL Server.

**Q: ACID is critical in banking. Which DB?**
A: PostgreSQL/Oracle (RDBMS) — ACID guarantees are the core strength of an RDBMS.

**Q: A mobile app needs local storage. Which DB?**
A: SQLite — SQLite is file-based, embedded - the default on Android and iOS.

**Q: What does the EXPLAIN command do?**
A: Shows the query execution plan — EXPLAIN shows the plan, used to optimize slow queries.

**Q: What is the most effective way to prevent SQL injection?**
A: Prepared statements — Prepared/parameterized statements - keep query and data separate in the DB.

**Q: Which of these is a limitation of a Relational DB?**
A: Horizontal scaling (sharding) is hard — RDBMSes are usually vertical-friendly; horizontal scaling is complex.

**Q: Both PostgreSQL and MySQL are open-source.**
A: True — PostgreSQL and MySQL - both open-source and widely used.

**Q: Which DB does WordPress use?**
A: MySQL/MariaDB — WordPress runs on MySQL/MariaDB - the most common on the web.
