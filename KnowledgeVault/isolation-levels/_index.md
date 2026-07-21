---
id: isolation-levels
title: "Isolation Levels"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, acid]
parent: database-transaction
children: []
status: draft
---

# Isolation Levels

## Overview

Isolation levels set how much of one transaction's in-progress changes another transaction running at the same time is allowed to see. They exist because full isolation (serializable, as if transactions ran one at a time) is correct but costly under heavy load — the SQL standard sets four levels as a menu of correctness-vs-speed trade-offs.

## Key Concepts

- **Dirty read** — seeing another transaction's changes before they are saved
- **Non-repeatable read** — reading the same row twice in one transaction gives different values
- **Phantom read** — running the same query twice in one transaction returns different rows
- **Read uncommitted** — weakest level, allows dirty reads (rarely used in practice)
- **Read committed** — only sees saved data, but repeated reads can still change (the most common default)
- **Repeatable read** — a row read once stays the same for the rest of the transaction
- **Serializable** — strongest level, transactions act as if run strictly one after another

## Core Knowledge

- Each step up removes one more kind of error but costs more locking, waiting, or retry work
- Read committed is the default in most real databases (Postgres, SQL Server, Oracle) — not serializable, even though people often assume it is
- MySQL/InnoDB defaults to repeatable read, which is different from the Postgres default and changes what errors can happen out of the box
- Repeatable read using MVCC stops non-repeatable reads by reading a fixed snapshot, but plain locking versions can still allow phantoms unless combined with range locks
- Serializable is usually built as snapshot isolation plus conflict checks — transactions can be canceled and need a retry instead of waiting, which the app code must handle
- Isolation level is a per-session/per-transaction setting, not a fixed database property — different transactions in the same database can run at different levels at the same time
- Higher isolation doesn't fix every concurrency problem — write skew and app-level race conditions can still happen even at serializable if logic outside the transaction assumes old reads
- Picking a level is a business-correctness choice as much as a speed one: read committed is fine for a page view counter, not for balancing a financial ledger

## Interview Questions

**Q:** Difference between read committed and repeatable read?
**A:** Read committed only promises you never see unsaved data, but reading again can give a different value; repeatable read promises the same row gives the same value for the whole transaction.

**Q:** What is a phantom read and which level stops it?
**A:** Running the same query again returns a different set of rows (new matches showed up); serializable is the level guaranteed to stop it, repeatable read may not fully, depending on how it's built.

**Q:** Why does serializable isolation cause more transaction retries?
**A:** It's often built with conflict checks rather than heavy locking — transactions that clash get canceled and must be retried by the app instead of waiting.

**Q:** If the database defaults to read committed, is that always wrong?
**A:** No — it's the right trade-off for most workloads; higher isolation is a deliberate choice for specific work that truly can't handle those errors.

## Scenario

A report adds up account balances mid-transaction while other transactions at the same time move money between those same accounts, and under read committed the report reads a balance again that changed between two of its queries, giving a total that never matches reality at any single moment. Running the report under repeatable read (or serializable) instead locks it to one steady snapshot for its whole run, guaranteeing a matching total even with other writes happening around it.
