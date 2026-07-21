---
id: mvcc
title: "MVCC"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, acid]
parent: database-transaction
children: []
status: draft
---

# MVCC

## Overview

Multi-version concurrency control (MVCC) lets readers see a steady snapshot of data without blocking writers, and lets writers keep going without blocking readers. It does this by keeping several versions of a row instead of locking it. It is the method most modern databases (Postgres, MySQL/InnoDB, Oracle) use under the hood to give isolation levels without the speed cost of locking every read.

## Key Concepts

- **Row version** — a snapshot of a row's data at a point in time, tagged with transaction/commit metadata
- **Snapshot** — the set of row versions a transaction is allowed to see, fixed at transaction/statement start
- **Visibility check** — logic run per row that decides if a given version can be seen by a given transaction's snapshot
- **Garbage collection (vacuum)** — freeing up old row versions that no active transaction can see anymore
- **Write-write conflict** — two transactions attempting to modify the same row version simultaneously
- **Undo log / tuple chain** — the mechanism (varies by engine) linking old versions to the current one

## Core Knowledge

- Under MVCC, readers never block writers, and writers never block readers — only writer-writer conflicts on the same row need locking or serialization
- Each transaction sees a snapshot fixed at one point in time (at transaction start, or per statement, depending on the isolation level), so commits happening at the same time stay invisible until the next snapshot
- Old row versions pile up until they are garbage collected — Postgres's autovacuum and MySQL's purge threads both handle this. Falling behind on this causes bloat and slower scans
- A long-running transaction that holds an old snapshot stops cleanup of every version newer than it, quietly bloating tables until it commits or is cancelled
- Write-write conflicts (two transactions changing the same row) still need locking, or a cancel-and-retry approach — MVCC solves read/write contention, not write/write contention
- MVCC is built differently across databases: Postgres stores full old row copies right in the table itself, while Oracle and InnoDB use separate undo or rollback areas. Same idea, different storage cost
- Index-only scans and other index-level speedups still must run a visibility check against MVCC metadata, unless a visibility map already confirms it is not needed
- MVCC is why `SELECT count(*)` can be slow in Postgres — there is no single, trusted row count stored anywhere. Visibility must be checked row by row against the snapshot making the request

## Interview Questions

**Q:** What problem does MVCC solve that plain locking doesn't?
**A:** It lets reads and writes happen at the same time without blocking each other, by giving each transaction its own steady snapshot instead of taking a read lock.

**Q:** What happens to old row versions after they're no longer needed?
**A:** They become ready for garbage collection (for example, Postgres autovacuum) once no active transaction's snapshot needs them anymore. Until they are cleaned up, they bloat storage.

**Q:** Does MVCC eliminate the need for locks entirely?
**A:** No — write-write conflicts on the same row still need locking or an abort-and-retry approach. MVCC only removes contention between readers and writers.

**Q:** Why can a long-idle open transaction hurt an otherwise healthy database?
**A:** It holds an old snapshot in place, which stops vacuum or garbage collection from freeing any row version newer than that snapshot, causing bloat with no limit until it closes.

## Scenario

A reporting connection opens a transaction and does not close it for hours, while the main app keeps updating rows heavily. The database's table bloat and query slowness keep climbing with no clear cause. Looking into it shows that the idle transaction's old snapshot is blocking garbage collection of every row version made since it started. Killing the stale connection lets vacuum catch up, and performance recovers right away.
