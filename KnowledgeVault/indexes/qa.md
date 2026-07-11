---
title: "Database Indexes — Q&A"
---

**Q: What is a Database Index at its core?**
A: A data structure for fast search — An index is a sorted data structure that speeds up search.

**Q: What does a DB do without an index?**
A: Full table scan - reads every row — Without an index, even a table with 1M rows gets scanned in full.

**Q: What is the search complexity of a B-Tree index?**
A: O(log N) — A balanced tree → log N height.

**Q: What is the limitation of a Hash Index?**
A: Range queries / sorting don't work — Hash gives O(1) equality lookup but range/order doesn't work.

**Q: What is the left-most prefix rule in a Composite Index?**
A: Using the left-side column is mandatory — In an (a, b, c) index, a query without "a" → the index goes unused.

**Q: Indexes improve write performance.**
A: False — Indexes reduce write performance - every INSERT/UPDATE also needs to update the index.

**Q: Should you index a boolean column?**
A: No - low cardinality, no benefit — With only two values (true/false) - it's a 50% match, same as a full scan.

**Q: What does the EXPLAIN command show?**
A: Query execution plan — EXPLAIN shows how the DB will run the query, which index it uses, and how many rows are scanned.

**Q: What happens with a Clustered Index?**
A: The table row's physical order matches the index — With a clustered index, the table itself is sorted.

**Q: What is a Covering Index?**
A: All columns a query needs are in the index - no need to visit the table — An index-only scan - reduces disk I/O.

**Q: Foreign key columns should be indexed.**
A: True — Needed for JOIN performance and referential checks.

**Q: What is a Partial Index?**
A: An index on a subset of rows (e.g. WHERE active=true) — A partial index saves storage - not every row needs to be indexed.

**Q: A table has 10 indexes. Inserts are slow. What should you do?**
A: Drop unused indexes — More indexes = higher write cost. Drop the unused ones.

**Q: A query with WHERE created_at BETWEEN ... is slow. What should you do?**
A: B-tree index on created_at — B-tree is best for range queries. Hash doesn't work here.

**Q: What is the role of a Unique Index?**
A: Index + uniqueness constraint — For email, username - prevents duplicates and gives fast lookup.

**Q: Where is a Full-text Index used?**
A: Text content search — Used for word-based search on articles, product descriptions.

**Q: How do you choose column order when designing a composite index?**
A: High selectivity → low — Put the most selective column (closest to unique) first - narrows results quickly.

**Q: Roughly what percentage of table size does an index's storage cost usually take?**
A: 10-30% — Each index is ~10-30% of the base table size - four of them together can add 50%+.

**Q: If the table's data gets corrupted, the index gets corrupted too.**
A: True — The index points to table rows; corruption there invalidates the index too.

**Q: Why do you need to run ANALYZE or UPDATE STATISTICS?**
A: To give the DB up-to-date statistics - so query plans stay accurate — Stale stats → wrong query plan → slow query.
