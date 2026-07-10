---
id: acid
title: "ACID"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, transaction]
parent: database-transaction
children: []
---

# ACID

## Overview

ACID is the set of guarantees — Atomicity, Consistency, Isolation, Durability — that a transaction provides so multi-step database operations behave predictably under failures and concurrency. Isolation has enough depth to warrant its own page; this one goes deeper on the other three: what Atomicity, Consistency, and Durability actually guarantee mechanically, and where each can quietly fail in practice.

## Key Concepts

- **Atomicity** — all-or-nothing execution; no partial application of a transaction's writes
- **Consistency** — a transaction moves the database from one valid state to another, respecting constraints
- **Durability** — once committed, a transaction's effects survive any subsequent crash
- **Write-ahead log (WAL)** — durability mechanism recording changes before they're applied to data files
- **Constraint enforcement** — the engine-level rules (foreign key, unique, check) that back consistency
- **fsync / flush to disk** — the actual point at which a write becomes durable, not just buffered

## Core Knowledge

- Atomicity is implemented via undo/rollback mechanisms — a crash mid-transaction is detected on recovery and incomplete changes are reverted, not left half-applied
- Consistency in ACID means constraint consistency (foreign keys, uniqueness, checks hold), not "the data is logically correct" — a transaction can commit valid-but-wrong business data and still be ACID-consistent
- Durability is only as strong as the actual write path: many engines buffer writes and only guarantee durability after an fsync to disk, and misconfigured settings (e.g. disabled fsync for speed) silently weaken this
- Write-ahead logging is the common mechanism behind both atomicity and durability — changes are logged sequentially before being applied, so recovery can replay or undo based on the log
- A committed transaction surviving a crash depends on the storage layer actually flushing to durable media — a write acknowledged by the OS page cache but not yet on disk is not truly durable
- Replication adds another durability dimension: synchronous replication to another node before acknowledging a commit protects against single-node data loss that WAL alone can't
- Turning off durability guarantees (e.g. asynchronous commit, disabled fsync) trades a small chance of losing recent commits on crash for meaningfully higher write throughput — a deliberate tradeoff, not a bug
- Atomicity applies per-transaction, not across transactions — two separate transactions each individually atomic can still leave data inconsistent relative to each other without proper isolation

## Interview Questions

**Q:** What does "consistency" mean in ACID, precisely?
**A:** The transaction leaves the database satisfying its declared constraints (foreign keys, uniqueness, checks) — it does not mean the data is business-logically correct, only structurally valid.

**Q:** How does a database implement atomicity across a crash?
**A:** Via a write-ahead log recording intended changes before applying them, so recovery can detect an incomplete transaction and undo its partial effects.

**Q:** Is an acknowledged commit always durable?
**A:** Only if the write actually reached persistent storage (fsync'd) — if durability settings are relaxed for performance, a crash shortly after commit can lose that transaction.

**Q:** Why would a team deliberately disable synchronous fsync on commit?
**A:** To trade a small window of potential data loss on crash for significantly higher write throughput — acceptable when the workload tolerates losing the last few commits, not when it can't.

## Scenario

A team disables synchronous commit to boost write throughput on a high-volume logging service, and after an unexpected power loss, the last few seconds of writes that were acknowledged to callers turn out to be missing on restart. The tradeoff was appropriate for that workload — logs tolerate small gaps — but the same configuration on a payments table would have silently lost confirmed financial transactions, illustrating that durability is a configurable guarantee, not an unconditional one.
