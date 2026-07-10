---
id: isolation-levels
title: "Isolation Levels"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage, acid]
parent: database-transaction
children: []
---

# Isolation Levels

## Overview

Isolation levels define how much of one transaction's in-progress changes another concurrent transaction is allowed to see. They exist because full isolation (serializable, as if transactions ran one at a time) is correct but expensive under concurrency — the SQL standard defines four levels as a menu of correctness-vs-throughput tradeoffs.

## Key Concepts

- **Dirty read** — seeing another transaction's uncommitted changes
- **Non-repeatable read** — same row re-read within a transaction returns different values
- **Phantom read** — same query re-run within a transaction returns different rows
- **Read uncommitted** — weakest level, allows dirty reads (rarely used in practice)
- **Read committed** — sees only committed data, but repeated reads can still change (most common default)
- **Repeatable read** — a row read once stays the same for the transaction's duration
- **Serializable** — strongest level, transactions behave as if run strictly one after another

## Core Knowledge

- Each step up the isolation ladder eliminates one more anomaly but costs more locking, blocking, or abort/retry overhead
- Read committed is the default in most production databases (Postgres, SQL Server, Oracle) — not serializable, despite common assumption
- MySQL/InnoDB defaults to repeatable read, which differs from the Postgres default and changes what anomalies are possible out of the box
- Repeatable read via MVCC prevents non-repeatable reads by reading a fixed snapshot, but classic locking implementations can still allow phantoms unless combined with range locks
- Serializable is usually implemented as snapshot isolation plus conflict detection — transactions can abort and require retry rather than block, which application code must handle
- Isolation level is a session/transaction setting, not a schema property — different transactions in the same database can run at different levels simultaneously
- Higher isolation doesn't fix all concurrency problems — write skew and application-level race conditions can still occur even at serializable if logic outside the transaction assumes stale reads
- Choosing a level is a business-correctness decision as much as a performance one: read committed is fine for a page view counter, not for a financial ledger reconciliation

## Interview Questions

**Q:** Difference between read committed and repeatable read?
**A:** Read committed only guarantees you never see uncommitted data, but a re-read can return a different value; repeatable read guarantees the same row returns the same value for the whole transaction.

**Q:** What is a phantom read and which level prevents it?
**A:** Re-running the same query returns a different set of rows (new matches appeared); serializable is the level guaranteed to prevent it, repeatable read may not fully depending on implementation.

**Q:** Why does serializable isolation cause more transaction retries?
**A:** It's often implemented via conflict detection rather than heavy locking — conflicting concurrent transactions get aborted and must be retried by the application instead of blocking.

**Q:** If the database defaults to read committed, is that always wrong?
**A:** No — it's the right tradeoff for most workloads; higher isolation is a deliberate choice for specific operations that truly can't tolerate the associated anomalies.

## Scenario

A report sums account balances mid-transaction while other transactions concurrently transfer money between those same accounts, and under read committed the report re-reads a balance that changed between two of its queries, producing a total that never matches reality at any single instant. Running the report under repeatable read (or serializable) instead pins it to one consistent snapshot for its full duration, guaranteeing a coherent total even with concurrent writes happening around it.
