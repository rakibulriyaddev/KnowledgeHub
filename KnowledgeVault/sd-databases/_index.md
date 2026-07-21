---
id: sd-databases
title: "Databases (System Design)"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, distributed-systems, databases]
parent: system-design
children: [database-federation, indexes, nosql, replication, sharding, sql, acid-base, distributed-transactions, pacelc, transactions]
status: draft
---

## Overview

At system-design scale, database choices are tradeoff choices: correctness vs. availability, read speed vs. write speed, one big database vs. many small ones. This group covers those tradeoffs — SQL vs NoSQL, how data is split (sharding, federation) or copied (replication), how it's found fast (indexes), and how correctness is kept even through failures (ACID/BASE, transactions, PACELC).

## Key Concepts

- Choosing a data model — SQL vs NoSQL, when each fits.
- Scaling data — sharding, federation, replication.
- Fast lookups — indexes.
- Correctness guarantees — ACID, BASE, distributed transactions, PACELC.

## Core Knowledge

A single database server eventually hits limits on storage, speed, or availability. Replication copies data across nodes for faster reads and to survive failures; sharding and federation split data across nodes so no single node holds everything. Indexes make reads fast at the cost of slower writes and extra storage. The harder problem is correctness once data is spread out: ACID transactions guarantee correctness on one node, distributed transactions try to stretch that guarantee across many nodes, and PACELC (built on CAP) frames the tradeoff between correctness and speed even when there's no network split. NoSQL databases usually relax some of these guarantees in exchange for scale and flexibility.

## Interview Questions

**Q: What's the difference between sharding and federation?**
A: Sharding splits one logical set of data (like users) across many databases by a shard key; federation splits by function — separate databases for separate areas (like a users DB and an orders DB).

**Q: Why would you choose NoSQL over SQL?**
A: When the schema keeps changing, scale needs are extreme, or the data shape (documents, wide columns, graphs) doesn't fit naturally into tables.

**Q: What does PACELC add on top of CAP?**
A: CAP only covers tradeoffs during a network split; PACELC also covers the normal case — even with no split (E), you trade speed (L) for correctness (C).

## Scenario

An e-commerce platform shards its orders table by customer region for write speed, replicates each shard for read scaling and failover, and uses distributed transactions only for checkout, where correctness (not eventual correctness) can't be skipped.
