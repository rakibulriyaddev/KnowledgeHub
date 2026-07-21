---
id: database-transaction
title: "Database Transaction"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, acid]
parent: database
children: [isolation-levels, mvcc, acid]
status: draft
---

# Database Transaction

## Overview

A transaction groups many operations into one unit that either fully goes through or fully rolls back — it exists so multi-step changes never leave data half-done and inconsistent. It's the mechanism behind the "A" and "C" (and much of the "I" and "D") in ACID, and sits under every multi-step write in a relational system.

## Key Concepts

- **ACID** — Atomicity, Consistency, Isolation, Durability — the four guarantees a transaction gives
- **Commit / rollback** — finish all changes, or drop all changes, as one single outcome
- **Isolation level** — how much one transaction can see of another's unfinished or same-time changes
- **Lock** — a way to stop clashing same-time access to the same data
- **MVCC (multi-version concurrency control)** — readers see a steady snapshot without blocking writers
- **Deadlock** — two transactions each waiting on a lock the other holds; fixed by stopping one of them

## Core Knowledge

- Atomicity means a partial failure can't be seen from outside — a crash mid-transaction leaves no half-done changes after recovery
- Isolation levels (read uncommitted, read committed, repeatable read, serializable) trade correctness problems (dirty read, non-repeatable read, phantom read) for more same-time access — higher isolation costs more waiting
- Most databases default to read committed, not serializable — full serializable behavior is rarely the out-of-the-box setting despite what people often assume
- MVCC lets readers work from a snapshot without blocking writers, avoiding read locks entirely in many systems (Postgres, MySQL/InnoDB)
- Long-running transactions hold locks/resources and block others — keep a transaction's scope as short as the business step actually needs
- Deadlocks are normal and expected under same-time access; the engine finds and stops one side — app code must retry, not treat it as a fatal error
- Transactions spanning many databases/services need two-phase commit or sagas — a single-node ACID transaction doesn't cross systems
- Durability guarantees survive a crash only if the write truly reached durable storage (write log/disk save) — wrong durability settings quietly weaken this guarantee for speed

## Interview Questions

**Q:** What does atomicity actually guarantee?
**A:** All operations in the transaction happen, or none do — there's no state where only some of the writes took effect, even across a crash.

**Q:** What's the trade-off behind isolation levels?
**A:** Stricter isolation stops more same-time-access problems (dirty/non-repeatable/phantom reads) but adds more locking/waiting and lowers throughput.

**Q:** How does MVCC avoid blocking readers?
**A:** Each transaction reads a steady snapshot of data as of its start, so writers making new versions don't block same-time readers from seeing an older, still-valid version.

**Q:** What should app code do when it hits a deadlock error?
**A:** Retry the transaction — a deadlock is an expected same-time-access outcome where the engine stops one side to break the cycle, not a permanent failure.

## Scenario

A funds transfer must take money from one account and add it to another, and a crash between the two writes would either destroy or duplicate money. Wrapping both statements in a single transaction makes sure the engine finishes both or neither, and if the process dies mid-transaction, recovery undoes the incomplete work — the account balances stay correct no matter when the failure happens.
