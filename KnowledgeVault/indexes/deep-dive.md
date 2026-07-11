---
title: "Database Indexes — Deep Dive"
---

![SQL EXPLAIN output](/vault/indexes/SQL_EXPLAIN_output_diagram.jpeg)

You need to find where the word "TCP" appears in a 500-page book. If the book has an index at the back - you'd see "TCP - pages 47, 142, 238". You could go straight there. Without an index - you'd have to start from page 1. A database index does exactly the same job.

## What is an Index?

A **Database Index** is a special data structure (usually a B-tree) that keeps a table's column values sorted - so queries can find records very quickly.

Without an index, the DB does a **full table scan** - reading every row, even if there are millions.

## How Does It Work?

Say you have a `users` table with a million rows. You run this query:

```
SELECT * FROM users WHERE email = 'm@example.com';
```

- **Without index:** Scans a million rows - slow.
- **With index on email:** A log(N) lookup in the B-tree. About 20 comparisons for 1M rows.

## Types of Indexes

### 1. B-Tree Index (Default)
A balanced tree - the most common. Fast for range queries (BETWEEN, >, <) and ORDER BY.
- **Pros:** Fast for both equality and range.
- **Used for:** IDs, dates, ordered columns.

### 2. Hash Index
Uses a hash function - equality (=) only. Doesn't work for ranges.
- **Pros:** O(1) equality lookup.
- **Cons:** No range, no sort.
- **Used for:** Memcached, Redis, some in-memory DB tables.

### 3. Composite (Multi-column) Index
An index across multiple columns - order matters.

```
CREATE INDEX idx_user_status_date
ON orders(user_id, status, created_at);
```

This index will be used for:
- WHERE user_id = X - ✓
- WHERE user_id = X AND status = Y - ✓
- WHERE user_id = X AND status = Y AND created_at > ... - ✓
- WHERE status = Y (without user_id) - ✗ (no left-most prefix)

**Note:** Left-most prefix rule — in a composite index, you must use columns starting from the left.

### 4. Unique Index
Index + uniqueness constraint. Used for fields like email, username.

### 5. Full-text Index
Text content search - MySQL FULLTEXT, PostgreSQL GIN.

### 6. Partial Index
Indexes a subset of rows - e.g. `WHERE deleted_at IS NULL`. Saves storage.

### 7. Covering Index
All the columns a query needs are in the index - no need to visit the table (index-only scan).

## When to Add an Index?

- Columns that frequently appear in the WHERE clause.
- Columns used in JOINs (ON foo.id = bar.foo_id).
- ORDER BY columns.
- GROUP BY columns.
- Foreign key columns.

## When NOT to Add an Index?

- **Write-heavy tables:** Every INSERT/UPDATE also updates the index - slow.
- **Small tables:** A full scan is already fast for a few thousand rows.
- **Low cardinality:** Boolean (true/false) - no benefit from an index.
- **Frequently updated columns:** Index maintenance overhead.
- **Rarely queried columns:** Uses storage for no benefit.

## The Cost of Indexes

- **Storage:** Index data structures live on disk. About 10-30% of the table's size.
- **Write performance:** Insert/Update/Delete also update the index. 3-5 indexes = slower writes.
- **Memory:** Hot indexes live in the buffer pool.
- **Maintenance:** Periodic rebuild/reorganize needed.

## EXPLAIN - Seeing Index Usage

Use the EXPLAIN command to optimize SQL queries and see the query execution plan, which index is used, and how many rows are scanned.

## Clustered vs Non-Clustered Index

**Clustered Index**
- The table's physical row order matches the index
- There can be only one (usually the primary key)
- Range queries are super fast
- InnoDB MySQL's default

**Non-Clustered Index**
- A separate structure → pointer to the table row
- There can be multiple
- Fast for equality, slightly slower for range
- Secondary index

## Real-World Examples

- **E-commerce:** Index on (user_id, status) - quickly find a user's orders.
- **Social media:** Index on (user_id, created_at DESC) - timeline.
- **Search:** Full-text index on product description.
- **Banking:** Composite index (account_id, transaction_date).

## Common Misconceptions

1. **"More indexes = faster":** No - writes get slower, storage gets wasted.
2. **"Indexes are automatic":** Primary key is automatic, but other columns need explicit indexes.
3. **"An index means the query is fast":** With a wrong index/usage, the DB skips it.

## Best Practices

- Monitor the slow query log - to see where an index is needed.
- Use EXPLAIN to check the query plan.
- Order composite index columns - high selectivity → low.
- Add indexes on foreign key columns.
- Drop unused indexes.
- Run periodic ANALYZE - to give the DB updated statistics.

## Chapter Summary

- Index = a data structure for fast search.
- B-Tree is default; Hash is equality-only; Composite spans multiple columns.
- Makes reads fast but slows down writes.
- The left-most prefix rule applies to composite indexes.
- Use EXPLAIN to check index usage.
