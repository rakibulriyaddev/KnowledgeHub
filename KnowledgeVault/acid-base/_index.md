---
id: acid-base
title: "ACID and BASE"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, consistency, transactions, distributed-systems]
parent: sd-databases
children: []
status: draft
---

## Overview

ACID and BASE are two opposite ways of thinking about how a database stays correct. ACID (Atomicity, Consistency, Isolation, Durability) is the strict, transaction-based model behind relational databases. BASE (Basically Available, Soft state, Eventually consistent) is the looser model behind most distributed NoSQL systems, which gives up some strictness for more scale and uptime.

## Key Concepts

- ACID's four guarantees and how they work (rollback, rules, isolation levels, WAL)
- Isolation levels from Read Uncommitted to Serializable
- BASE's three properties as NoSQL's answer to ACID
- ACID's "Consistency" vs CAP's "Consistency" — different ideas, same word
- Modern databases that let you tune consistency instead of picking one fixed choice

## Core Knowledge

Atomicity means a transaction can't be split — all its steps happen or none do, made sure by ROLLBACK when something fails. Consistency (in ACID) means the database's rules and foreign keys stay valid before and after every transaction — this is a different idea from CAP's Consistency, which is about all nodes having the same data, not about rules being valid. Isolation makes sure transactions running at the same time don't get in each other's way, as if run one after another; the four standard isolation levels trade correctness for speed: Read Uncommitted (dirty reads possible, fastest), Read Committed (PostgreSQL's default), Repeatable Read (MySQL/InnoDB's default), and Serializable (strongest, slowest, acts as if everything runs one at a time). Durability means data that has been saved survives crashes and power loss, usually done with a Write-Ahead Log (WAL) that gets written to disk before a commit is confirmed.

BASE flips these priorities to fit distributed scale: Basically Available means the system always gives back something, even if not fully correct; Soft state means the system's state can drift on its own as copies sync up later; Eventually Consistent means all copies end up matching given enough time, not right away. ACID puts correctness over speed and fits banking, inventory, booking, and healthcare systems, where a wrong result is a disaster. BASE puts scale and low delay over instant correctness and fits social feeds, like/view counters, live analytics, and caching, where being a bit stale for a second goes unnoticed. The line has become less clear in modern systems: MongoDB 4+ supports multi-document ACID transactions, Cassandra offers tunable consistency levels (ONE, QUORUM, ALL) per query, DynamoDB lets you pick strong or eventual consistency per read, and Google Spanner reaches globally distributed ACID using synced clocks (TrueTime).

## Interview Questions

**Q: How does ACID's "Consistency" differ from CAP's "Consistency"?**
A: ACID's C means the database's rules stay valid after a transaction; CAP's C means all nodes in a distributed system show the same data at the same time — they are unrelated ideas that just share a name.

**Q: Why isn't "higher isolation is always better" true?**
A: Stronger isolation levels like Serializable stop more errors but need more locking, which lowers throughput and raises delay — the right level depends on how much risk the use case can accept.

**Q: Give an example where BASE is enough and one where it is not.**
A: A social media like counter can be eventually consistent — a one-second-stale count goes unnoticed by users; a bank transfer cannot, since a partial or late update could make money appear or disappear.

## Scenario

An e-commerce site uses a strict ACID transaction for checkout — taking away stock and charging payment together, so a failure never leaves stock reduced without payment — while its product view counter and "customers also bought" suggestions run on a BASE-style NoSQL store, where a few seconds of staleness is a fine trade for handling huge read traffic.
