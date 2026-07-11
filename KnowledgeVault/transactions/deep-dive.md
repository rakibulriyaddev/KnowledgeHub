---
title: "Database Transactions — Deep Dive"
---

![SQL transaction flow with savepoint](/vault/transactions/SQL_Transaction_flow_with_Savepoint.jpeg)

An online purchase: you bought a product worth 1,000 taka. Three things need to happen together - (1) deduct 1,000 taka from the account (2) remove one unit of the product from inventory (3) create the order. If any one of these fails, everything before it must be rolled back - otherwise the data becomes inconsistent. This is a Transaction.

## What is a Transaction?

A **Database Transaction** = a collection of one or more operations that execute as a single *atomic* unit. If all operations succeed - COMMIT. If one fails - ROLLBACK.

## Basic Syntax

```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
  UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;

-- or if something goes wrong
  ROLLBACK;
```

## ACID recap

Transactions matter because of ACID:
- **A:** Atomic - either everything happens or nothing does.
- **C:** Consistent - the DB's rules always stay valid.
- **I:** Isolated - concurrent transactions don't interfere.
- **D:** Durable - permanent once committed.

## Transaction States

1. **Active:** The transaction is running.
2. **Partially Committed:** The last statement has executed, but it hasn't been written to disk yet.
3. **Committed:** Finished successfully - written to disk.
4. **Failed:** Couldn't execute due to some problem.
5. **Aborted:** Rolled back.

## COMMIT vs ROLLBACK

### COMMIT
Makes all of a transaction's changes permanent. Made durable on disk via the WAL. Once committed - there's no rolling back.

### ROLLBACK
Cancels all of a transaction's changes. Returns the DB to the state it was in at the start of the transaction.

## Savepoints

A checkpoint in the middle of a large transaction, allowing partial rollback to that point instead of rolling back everything.

## Isolation Level Anomalies

### Dirty Read
Transaction A makes an uncommitted change. Transaction B reads that data - but if A rolls back, B's read becomes invalid.

### Non-Repeatable Read
Transaction A reads a row. B updates that row and commits. When A reads it again - a different value.

### Phantom Read
Transaction A runs a query (like COUNT). B inserts a new row and commits. When A runs it again - the count changes.

### Which anomalies do the levels prevent?

**Read Uncommitted**
- Dirty read: allowed
- Non-repeatable: allowed
- Phantom: allowed
- Lowest, fastest

**Read Committed**
- Dirty read: prevented
- Non-repeatable: allowed
- Phantom: allowed
- PostgreSQL default

**Repeatable Read**
- Dirty read: prevented
- Non-repeatable: prevented
- Phantom: allowed
- MySQL default

**Serializable**
- Dirty read: prevented
- Non-repeatable: prevented
- Phantom: prevented
- Strongest, slowest

## Locking

### Pessimistic Locking
"Lock first, then do the work." The row is locked at the start of the transaction - other transactions wait.

```sql
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- this row is locked until commit/rollback
```

- Good for conflict-prone workloads.
- Risk of deadlock.

### Optimistic Locking
"Hopefully there won't be a conflict." Checked at commit time.

```sql
UPDATE accounts SET balance = 500, version = version + 1
WHERE id = 1 AND version = 5;
-- 0 rows affected = someone else already updated it
```

- Good for workloads where conflicts are rare.
- Needs retry logic.

## Deadlock

Two transactions are each waiting on a lock the other holds - neither can proceed.

```
T1: lock(A); ... wait for B
T2: lock(B); ... wait for A
```

### Solutions
- **Detection:** The DB detects the cycle and kills one transaction.
- **Prevention:** Keep lock ordering consistent.
- **Timeout:** Set a wait limit.

## MVCC (Multi-Version Concurrency Control)

Modern DBs (PostgreSQL, Oracle) keep multiple versions of data instead of relying purely on locks. Read transactions work on an older version; write transactions create a new version.

- **Benefit:** Reads and writes don't block each other.
- **Downside:** More storage (multiple versions), needs VACUUM.

## Real-world examples

- **Banking transfer:** Strict serializable transaction.
- **Booking.com:** Pessimistic lock - no double booking.
- **GitHub PR:** Optimistic lock (version field).
- **E-commerce:** Mixed - payment is ACID, views are eventual.

## Common misconceptions

1. **"Higher isolation is always better":** No - it's slower, with less throughput.
2. **"Transaction = backup":** No - it's durable, but after commit it's still the single source, not a backup.
3. **"Long transactions are fine":** No - they hold locks and block others.

## Best Practices

- The smaller the transaction, the better.
- Avoid network calls (API, email) inside a transaction.
- Use the minimum isolation level that's sufficient.
- Always handle ROLLBACK on error.
- Separate out long-running queries.
- Add indexes to reduce lock contention.

## Chapter Summary

- A transaction = an atomic unit of operations (ACID).
- COMMIT makes it permanent; ROLLBACK undoes it.
- Isolation levels prevent dirty/non-repeatable/phantom reads.
- Pessimistic vs Optimistic locking.
- Modern DBs use MVCC to run reads and writes in parallel.
