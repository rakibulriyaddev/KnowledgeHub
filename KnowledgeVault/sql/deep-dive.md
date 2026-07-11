---
title: "SQL Databases — Deep Dive"
---

![Database users table](/vault/sql/Database_users_table_diagram.jpeg)

Imagine you have 3 diaries at home - one for family members, one for relatives, one for friends. Each has columns: name, age, phone. This tabular structure is the core idea behind a relational database.

## What is a SQL Database?

A **SQL Database (Relational Database)** stores data in tables, where each row is a record and each column is an attribute. Relationships exist between tables - hence "relational".

SQL = **Structured Query Language** - the language used to manipulate data in an RDBMS.

## Core Structure

- **Database:** The topmost container.
- **Table:** A specific entity (users, orders, products).
- **Column (field):** An attribute of the data - name, email, age.
- **Row (record/tuple):** A specific entry.
- **Primary Key:** Makes each row unique.
- **Foreign Key:** A link to another table.

## Schema and Data Types

Schema = the blueprint of a table's structure. SQL databases are schema-driven - column types and constraints must be defined ahead of time.

Common data types:
- `INT, BIGINT` - numbers
- `VARCHAR(n), TEXT` - strings
- `DATE, TIMESTAMP` - time
- `BOOLEAN` - true/false
- `DECIMAL(p,s)` - money/precision
- `JSON, JSONB` - flexible (PostgreSQL)

## Categories of SQL Commands

- **DDL (Data Definition):** CREATE, ALTER, DROP - changing the schema.
- **DML (Data Manipulation):** INSERT, UPDATE, DELETE - changing data.
- **DQL (Data Query):** SELECT - fetching data.
- **DCL (Data Control):** GRANT, REVOKE - permissions.
- **TCL (Transaction Control):** COMMIT, ROLLBACK.

## JOIN - Combining Tables

JOIN is used to bring together data from multiple tables.

**INNER JOIN** — Rows that match in both tables. The most common. Excludes rows with no match.

**LEFT JOIN** — All rows from the left table. NULL if there's no match on the right.

**RIGHT JOIN** — All rows from the right. NULL if there's no match on the left.

**FULL OUTER JOIN** — All rows from both tables. NULL where there's no match.

```sql
SELECT u.name, o.product
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.amount > 1000;
```

## Strengths of a Relational DB

- **ACID Transactions:** For critical operations like a bank transfer.
- **Strong consistency:** Everyone sees the latest data after a write.
- **Powerful queries:** JOIN, GROUP BY, complex aggregates.
- **Schema validation:** Invalid data can't enter the DB.
- **Mature ecosystem:** 50 years of tooling.
- **Standardized:** SQL is an ANSI standard.

## Limitations

- **Primarily vertical scaling:** Horizontal scaling (sharding) is hard.
- **Schema rigidity:** Changing a schema in production is hard.
- **JOINs get expensive at scale:** Slow with millions of rows.
- **Object-relational mismatch:** Mapping to OOP code is complex (this is why ORMs were born).

## Popular RDBMSes

- **PostgreSQL:** The most sought-after in the modern world - JSON, full-text search, advanced features.
- **MySQL:** The heart of the web - the most widely used (WordPress, early Facebook).
- **SQLite:** File-based, embedded - used in mobile, browsers.
- **Oracle:** Enterprise - banking, healthcare.
- **Microsoft SQL Server:** Windows ecosystem.
- **MariaDB:** A fork of MySQL - open-source-focused.

## ACID Properties

- **Atomicity:** Everything in a transaction happens, or nothing does.
- **Consistency:** DB constraints are always maintained.
- **Isolation:** Concurrent transactions don't interfere with each other.
- **Durability:** Once committed, it stays forever (even through a crash).

## Real-World Examples

- **Booking.com:** All bookings, rooms, payments in PostgreSQL.
- **Instagram:** Originally on PostgreSQL.
- **Banking:** Oracle/DB2 (SLA-bound, audit-heavy).
- **Stack Overflow:** Microsoft SQL Server.

## Common Misconceptions

1. **"SQL is slow":** With a correctly indexed query, a SQL DB is very fast - milliseconds even with millions of rows.
2. **"NoSQL is always modern":** No - relational DBs are still the primary store in over 70% of applications.
3. **"SQL = MySQL":** SQL is a language; MySQL is one implementation. PostgreSQL, Oracle are different DBs.

## Best Practices

- Default every column to NOT NULL - make nullable explicit.
- Enable foreign key constraints - referential integrity.
- Index frequently filtered/joined columns.
- Use prepared statements - to prevent SQL injection.
- Use a connection pool - not a direct connection.
- Analyze the query plan (EXPLAIN) - optimize slow queries.

## Chapter Summary

- A SQL DB has a table-row-column structure.
- Schema-driven; ACID guarantees.
- JOIN brings together data from multiple tables.
- PostgreSQL, MySQL, Oracle - the top RDBMSes.
- Strong consistency, but horizontal scaling is hard.
