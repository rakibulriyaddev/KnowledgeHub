---
id: mvcc
title: "MVCC"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage, acid]
parent: database-transaction
children: []
---

# MVCC

## Overview

Multi-version concurrency control (MVCC) lets readers see a consistent snapshot of data without blocking writers, and writers proceed without blocking readers, by keeping multiple versions of a row instead of locking it. It's the mechanism most modern databases (Postgres, MySQL/InnoDB, Oracle) use under the hood to deliver isolation levels without the throughput cost of pervasive read locks.

## Key Concepts

- **Row version** — a snapshot of a row's data at a point in time, tagged with transaction/commit metadata
- **Snapshot** — the set of row versions a transaction is allowed to see, fixed at transaction/statement start
- **Visibility check** — per-row logic deciding whether a given version is visible to a given transaction's snapshot
- **Garbage collection (vacuum)** — reclaiming old row versions no longer visible to any active transaction
- **Write-write conflict** — two transactions attempting to modify the same row version simultaneously
- **Undo log / tuple chain** — the mechanism (varies by engine) linking old versions to the current one

## Core Knowledge

- Readers never block writers and writers never block readers under MVCC — only writer-writer conflicts on the same row need locking/serialization
- Each transaction sees a snapshot fixed at a point in time (transaction start, or per-statement depending on isolation level), so concurrent commits are invisible until the next snapshot
- Old row versions accumulate until garbage collected — Postgres's autovacuum and MySQL's purge threads both do this; falling behind causes bloat and slower scans
- A long-running transaction holding an old snapshot prevents cleanup of every version newer than it, silently bloating tables until it commits or aborts
- Write-write conflicts (two transactions updating the same row) still require locking or an abort/retry protocol — MVCC solves read/write contention, not write/write contention
- MVCC implementations differ materially: Postgres stores full old tuples in the table itself; Oracle/InnoDB use separate undo/rollback segments — same concept, different storage cost profile
- Index-only scans and other index-level optimizations must still perform a visibility check against MVCC metadata unless a visibility map confirms it's unnecessary
- MVCC is why "SELECT count(*)" can be slow in Postgres — no single authoritative row count exists; visibility must be checked per row against the requesting snapshot

## Interview Questions

**Q:** What problem does MVCC solve that plain locking doesn't?
**A:** It lets reads and writes proceed concurrently without blocking each other, by giving each transaction its own consistent snapshot instead of taking a read lock.

**Q:** What happens to old row versions after they're no longer needed?
**A:** They become eligible for garbage collection (e.g. Postgres autovacuum) once no active transaction's snapshot still needs them; until cleaned up they bloat storage.

**Q:** Does MVCC eliminate the need for locks entirely?
**A:** No — write-write conflicts on the same row still require locking or an abort-and-retry mechanism; MVCC only removes contention between readers and writers.

**Q:** Why can a long-idle open transaction hurt an otherwise healthy database?
**A:** It pins an old snapshot, preventing vacuum/garbage collection from reclaiming any row version newer than that snapshot, causing unbounded bloat until it closes.

## Scenario

A reporting connection opens a transaction and forgets to close it for hours while the main application keeps updating rows heavily, and the database's table bloat and query latency climb steadily with no obvious cause. Investigation finds the idle transaction's old snapshot is blocking garbage collection of every row version created since it started; killing the stale connection lets vacuum catch up and performance recovers immediately.
