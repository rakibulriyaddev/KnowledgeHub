---
id: acid
title: "ACID"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, transaction]
parent: database-transaction
children: []
status: draft
---

# ACID

## Overview

ACID is the set of guarantees — Atomicity, Consistency, Isolation, Durability — that a transaction gives so multi-step database actions work as expected under failures and many things happening at once. Isolation has enough depth for its own page; this one goes deeper on the other three: what Atomicity, Consistency, and Durability really guarantee, and where each can quietly fail in real use.

## Key Concepts

- **Atomicity** — all-or-nothing action; no half-finished writes from a transaction
- **Consistency** — a transaction moves the database from one valid state to another, following the rules
- **Durability** — once saved, a transaction's changes survive any crash that comes after
- **Write-ahead log (WAL)** — durability method that records changes before they're applied to data files
- **Rule enforcement** — the database-level rules (foreign key, unique, check) that back consistency
- **fsync / flush to disk** — the real moment a write becomes durable, not just held in memory

## Core Knowledge

- Atomicity is built using undo/rollback methods — a crash in the middle of a transaction is caught on restart, and unfinished changes are undone, not left half-done
- Consistency in ACID means the rules hold (foreign keys, uniqueness, checks) — not "the data is logically right." A transaction can save valid-but-wrong business data and still count as ACID-consistent
- Durability is only as strong as the real write path: many engines hold writes in memory and only make them durable after an fsync to disk, and wrong settings (like turning off fsync for speed) quietly weaken this
- Write-ahead logging is the common method behind both atomicity and durability — changes are written down in order before being applied, so restart can redo or undo based on the log
- A saved transaction surviving a crash depends on the storage layer really writing to disk — a write confirmed by the OS's memory cache but not yet on disk is not truly durable
- Copying data to other machines (replication) adds another layer of safety: waiting for another node to confirm a write before saying it's done protects against data loss on one machine that WAL alone can't stop
- Turning off durability guarantees (like async commit, disabled fsync) trades a small chance of losing recent saves on crash for much higher write speed — a choice made on purpose, not a bug
- Atomicity applies to one transaction at a time, not across transactions — two separate transactions, each fine on their own, can still leave data out of step with each other without proper isolation

## Interview Questions

**Q:** What does "consistency" mean in ACID, exactly?
**A:** The transaction leaves the database following its stated rules (foreign keys, uniqueness, checks) — it does not mean the data is right for the business, only that it's structurally valid.

**Q:** How does a database keep atomicity across a crash?
**A:** With a write-ahead log that records planned changes before applying them, so restart can spot an unfinished transaction and undo its partial effects.

**Q:** Is a confirmed save always durable?
**A:** Only if the write really reached lasting storage (fsync'd) — if durability settings are relaxed for speed, a crash right after saving can lose that transaction.

**Q:** Why would a team choose to turn off synchronous fsync on commit?
**A:** To trade a small chance of losing data on crash for much higher write speed — fine when the workload can lose the last few saves, not fine when it can't.

## Scenario

A team turns off synchronous commit to boost write speed on a high-volume logging service, and after a sudden power loss, the last few seconds of writes that were confirmed to callers turn out missing on restart. The trade was fine for that workload — logs can handle small gaps — but the same setup on a payments table would have quietly lost confirmed money transactions. This shows that durability is a setting you can adjust, not an unconditional promise.
