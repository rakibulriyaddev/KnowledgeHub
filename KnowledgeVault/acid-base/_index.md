---
id: acid-base
title: "ACID and BASE"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, consistency, transactions, distributed-systems]
parent: sd-databases
children: []
status: draft
---

## Overview

ACID and BASE are two opposing philosophies for how a database guarantees correctness. ACID (Atomicity, Consistency, Isolation, Durability) is the strict, transaction-oriented model behind relational databases; BASE (Basically Available, Soft state, Eventually consistent) is the relaxed model behind most distributed NoSQL systems that trades strictness for scale and availability.

## Key Concepts

- ACID's four guarantees and their implementations (rollback, constraints, isolation levels, WAL).
- Isolation levels from Read Uncommitted to Serializable.
- BASE's three properties as NoSQL's answer to ACID.
- ACID's "Consistency" vs CAP's "Consistency" — different concepts, same word.
- Modern databases offering tunable consistency instead of a fixed choice.

## Core Knowledge

Atomicity guarantees a transaction is indivisible — all steps happen or none do, enforced via ROLLBACK on failure. Consistency (ACID's version) means the database's constraints, rules, and foreign keys stay valid before and after every transaction — this is a different concept from CAP's Consistency, which is about identical data across distributed nodes, not constraint validity. Isolation ensures concurrent transactions don't interfere, as if run serially; the four standard isolation levels trade correctness for speed: Read Uncommitted (dirty reads possible, fastest), Read Committed (PostgreSQL's default), Repeatable Read (MySQL/InnoDB's default), and Serializable (strongest, slowest, behaves as fully sequential execution). Durability guarantees committed data survives crashes and power loss, typically implemented via a Write-Ahead Log (WAL) that's flushed to disk before a commit is acknowledged.

BASE inverts these priorities for distributed scale: Basically Available means the system always returns something, even if not fully correct; Soft state means the system's state can drift on its own as replicas asynchronously sync; Eventually Consistent means all replicas converge to the same value given enough time, not instantly. ACID favors accuracy over speed and fits banking, inventory, booking, and healthcare systems where a wrong result is a disaster; BASE favors scale and low latency over instant correctness and fits social feeds, like/view counters, real-time analytics, and caching where staleness for a second is invisible to users. The line has blurred in modern systems: MongoDB 4+ supports multi-document ACID transactions, Cassandra offers tunable consistency levels (ONE, QUORUM, ALL) per query, DynamoDB lets you choose strong or eventual consistency per read, and Google Spanner achieves globally distributed ACID using synchronized clocks (TrueTime).

## Interview Questions

**Q: How does ACID's "Consistency" differ from CAP's "Consistency"?**
A: ACID's C means database constraints and rules remain valid after a transaction; CAP's C means all nodes in a distributed system see the same data at the same time — they are unrelated concepts that happen to share a name.

**Q: Why isn't "higher isolation is always better" true?**
A: Stronger isolation levels like Serializable prevent more anomalies but require more locking, which reduces throughput and increases latency — the right level depends on how much anomaly risk the use case can tolerate.

**Q: Give an example where BASE is sufficient and one where it is not.**
A: A social media like counter can be eventually consistent — a one-second-stale count is invisible to users; a bank transfer cannot, since a partial or delayed update could make money appear or vanish.

## Scenario

An e-commerce platform uses a strict ACID transaction for checkout — deducting inventory and charging payment together, so a failure never leaves stock decremented without payment — while its product view counter and "customers also bought" recommendations run on a BASE-style NoSQL store where a few seconds of staleness is an acceptable trade for handling massive read traffic.
