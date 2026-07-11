---
id: database-transaction
title: "Database Transaction"
created: 2026-07-10
modified: 2026-07-11
tags: [data, storage, acid]
parent: database
children: [isolation-levels, mvcc, acid]
status: draft
---

# Database Transaction

## Overview

A transaction groups multiple operations into a single unit that either fully commits or fully rolls back — it exists so multi-step changes never leave data in a partially-applied, inconsistent state. It's the mechanism behind the "A" and "C" (and much of the "I" and "D") in ACID, and underpins every multi-step write in a relational system.

## Key Concepts

- **ACID** — Atomicity, Consistency, Isolation, Durability — the four guarantees a transaction provides
- **Commit / rollback** — finalize all changes, or discard all changes, as one indivisible outcome
- **Isolation level** — how much one transaction can see of another's uncommitted or concurrent changes
- **Lock** — mechanism to prevent conflicting concurrent access to the same data
- **MVCC (multi-version concurrency control)** — readers see a consistent snapshot without blocking writers
- **Deadlock** — two transactions each waiting on a lock the other holds; resolved by aborting one

## Core Knowledge

- Atomicity means partial failure is impossible from the outside — a crash mid-transaction leaves no half-applied changes after recovery
- Isolation levels (read uncommitted, read committed, repeatable read, serializable) trade correctness anomalies (dirty read, non-repeatable read, phantom read) for concurrency — higher isolation costs more contention
- Most databases default to read committed, not serializable — full serializability is rarely the out-of-the-box behavior despite common assumption
- MVCC lets readers work from a snapshot without blocking writers, avoiding read locks entirely in many systems (Postgres, MySQL/InnoDB)
- Long-running transactions hold locks/resources and block others — keep transaction scope as short as the business operation actually requires
- Deadlocks are normal and expected under concurrency; the engine detects and aborts one side — application code must retry, not treat it as fatal
- Distributed transactions across multiple databases/services need two-phase commit or sagas — a single-node ACID transaction doesn't span systems
- Durability guarantees survive a crash only if the write actually reached durable storage (WAL/fsync) — misconfigured durability settings silently weaken this guarantee for performance

## Interview Questions

**Q:** What does atomicity actually guarantee?
**A:** All operations in the transaction apply, or none do — there's no state where only some of the writes took effect, even across a crash.

**Q:** What's the tradeoff behind isolation levels?
**A:** Stricter isolation prevents more concurrency anomalies (dirty/non-repeatable/phantom reads) but increases locking/contention and reduces throughput.

**Q:** How does MVCC avoid blocking readers?
**A:** Each transaction reads a consistent snapshot of data as of its start, so writers creating new versions don't block concurrent readers from seeing an older, still-valid version.

**Q:** What should application code do when it hits a deadlock error?
**A:** Retry the transaction — deadlocks are an expected concurrency outcome where the engine aborts one side to break the cycle, not a permanent failure.

## Scenario

A funds transfer must debit one account and credit another, and a crash between the two writes would either destroy or duplicate money. Wrapping both statements in a single transaction ensures the engine commits both or neither, and if the process dies mid-transaction, recovery rolls back the incomplete work — the account balances stay consistent no matter when the failure happens.
