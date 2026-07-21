---
id: transactions
title: "Database Transactions"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, concurrency, acid, locking]
parent: sd-databases
children: []
status: draft
---

## Overview

A database transaction is a group of steps run as one single unit — either all of them succeed, or none do — stopping the kind of half-finished update that leaves data wrong (like money taken out but an order never made). Transactions are how ACID guarantees actually work inside a single database.

## Key Concepts

- Transaction states — Active, Partially Committed, Committed, Failed, Aborted.
- COMMIT/ROLLBACK and savepoints for partial rollback.
- Isolation problems — dirty read, non-repeatable read, phantom read.
- Pessimistic vs optimistic locking.
- Deadlocks and how they're fixed.
- MVCC (Multi-Version Concurrency Control) as the modern way to handle many transactions at once.

## Core Knowledge

A transaction moves through states: Active while it's running, Partially Committed once the last step runs but before it's written to disk, Committed once it's safely written, or Failed/Aborted if something goes wrong and it rolls back to where it started. COMMIT makes changes permanent (safely written via the WAL); ROLLBACK undoes everything back to the start; savepoints let you roll back to a point in the middle instead of the whole thing. Isolation levels control which problems are allowed: a dirty read happens when a transaction reads another transaction's not-yet-saved (and maybe later cancelled) data; a non-repeatable read happens when the same row read twice in one transaction gives different values because another transaction saved a change in between; a phantom read happens when a repeated query returns a different number of rows because rows were added or removed in between. Read Uncommitted stops none of these, Read Committed (PostgreSQL default) stops dirty reads, Repeatable Read (MySQL default) also stops non-repeatable reads, and Serializable stops all three but costs the most locking and lowest speed.

There are two ways to handle many transactions at once: pessimistic locking ("lock first, then work") locks a row right away using `SELECT ... FOR UPDATE`, making other transactions wait — good under heavy competition but can cause deadlocks; optimistic locking ("hope for no conflict") checks a version column when saving and fails the write if it's outdated — good when conflicts are rare, but needs retry logic. A deadlock happens when two transactions each hold a lock the other is waiting for; databases fix this by finding the cycle (stopping one transaction), keeping a fixed lock order to prevent cycles, or using timeouts. Modern databases like PostgreSQL and Oracle use MVCC instead of relying only on locks: readers see an older steady snapshot while writers make new versions, so reads and writes don't block each other, at the cost of extra storage for old versions and needing regular cleanup (VACUUM). Good practice keeps transactions short, avoids outside/network calls inside a transaction, and uses the lowest isolation level that's still correct.

## Interview Questions

**Q: What's the difference between a non-repeatable read and a phantom read?**
A: A non-repeatable read is the same row giving a different value on a second read because it was changed in between; a phantom read is the same query returning a different set of rows because rows were added or removed in between.

**Q: When would you choose optimistic locking over pessimistic locking?**
A: When conflicts are expected to be rare and you want to skip lock overhead — optimistic locking checks a version when saving and retries on conflict, while pessimistic locking pays the cost of holding a lock the whole time whether or not a conflict would have happened.

**Q: How does MVCC let reads and writes go on without blocking each other?**
A: Each write makes a new version of a row instead of overwriting it, so a read at the same time can keep working from an older, steady snapshot while the write saves a new version — no lock fight between the two.

## Scenario

Ten users try to buy the last unit of the same item at the same time. The team uses `SELECT ... FOR UPDATE` (pessimistic locking) on the inventory row during checkout so only one transaction can lower the stock count at a time, avoiding a case where many orders could all read "1 in stock" and sell it more than once.
