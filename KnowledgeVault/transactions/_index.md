---
id: transactions
title: "Database Transactions"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, concurrency, acid, locking]
parent: sd-databases
children: []
status: draft
---

## Overview

A database transaction is a group of operations executed as a single atomic unit — either all commit or all roll back — preventing the kind of partial update that leaves data inconsistent (e.g., money deducted but an order never created). Transactions are the mechanical implementation of ACID guarantees inside a single database.

## Key Concepts

- Transaction states — Active, Partially Committed, Committed, Failed, Aborted.
- COMMIT/ROLLBACK and savepoints for partial rollback.
- Isolation anomalies — dirty read, non-repeatable read, phantom read.
- Pessimistic vs optimistic locking.
- Deadlocks and their resolution.
- MVCC (Multi-Version Concurrency Control) as the modern concurrency model.

## Core Knowledge

A transaction moves through states: Active while running, Partially Committed once the last statement executes but before disk write, Committed once durably written, or Failed/Aborted if something goes wrong and it rolls back to its starting state. COMMIT makes changes permanent (durable via the WAL); ROLLBACK undoes everything back to the transaction's start; savepoints allow rolling back to a mid-transaction checkpoint instead of the whole thing. Isolation levels exist to control which anomalies are allowed: a dirty read happens when a transaction reads another transaction's uncommitted (and possibly later rolled-back) data; a non-repeatable read happens when the same row read twice within one transaction returns different values because another transaction committed a change in between; a phantom read happens when a repeated query returns a different row count because rows were inserted/deleted in between. Read Uncommitted prevents none of these, Read Committed (PostgreSQL default) prevents dirty reads, Repeatable Read (MySQL default) additionally prevents non-repeatable reads, and Serializable prevents all three at the cost of the most locking and lowest throughput.

Concurrency control comes in two flavors: pessimistic locking ("lock first, then work") locks a row at the start via `SELECT ... FOR UPDATE`, making other transactions wait — good under high contention but carries deadlock risk; optimistic locking ("hope for no conflict") checks a version column at commit time and fails the write if it's stale — good when conflicts are rare, but requires retry logic. A deadlock occurs when two transactions each hold a lock the other is waiting for; databases resolve this via cycle detection (killing one transaction), consistent lock ordering to prevent cycles, or timeouts. Modern databases like PostgreSQL and Oracle use MVCC instead of relying purely on locks: readers see an older consistent snapshot while writers create new versions, so reads and writes don't block each other, at the cost of extra storage for old versions and the need for periodic cleanup (VACUUM). Best practice keeps transactions small, avoids external/network calls inside a transaction boundary, and uses the lowest isolation level sufficient for correctness.

## Interview Questions

**Q: What's the difference between a non-repeatable read and a phantom read?**
A: A non-repeatable read is the same row returning a different value on a second read because it was updated in between; a phantom read is the same query returning a different set of rows because rows were inserted or deleted in between.

**Q: When would you choose optimistic locking over pessimistic locking?**
A: When conflicts are expected to be rare and you want to avoid lock overhead — optimistic locking checks a version at commit and retries on conflict, whereas pessimistic locking pays the cost of holding a lock for the whole operation regardless of whether a conflict would have occurred.

**Q: How does MVCC let reads and writes proceed without blocking each other?**
A: Each write creates a new version of a row rather than overwriting it in place, so a concurrent read can continue working from an older, consistent snapshot while the write commits a new version — no lock contention between the two.

## Scenario

Ten users try to buy the last unit of the same inventory item simultaneously. The team uses `SELECT ... FOR UPDATE` (pessimistic locking) on the inventory row during checkout so only one transaction can decrement the stock at a time, avoiding a race condition where multiple orders could all read "1 in stock" and oversell the item.
