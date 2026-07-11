---
id: sd-databases
title: "Databases (System Design)"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, distributed-systems, databases]
parent: system-design
children: [database-federation, indexes, nosql, replication, sharding, sql, acid-base, distributed-transactions, pacelc, transactions]
status: draft
---

## Overview

At system-design scale, database decisions are trade-off decisions: consistency vs. availability, read speed vs. write speed, one big database vs. many small ones. This group covers those trade-offs — SQL vs NoSQL, how data is split (sharding, federation) or copied (replication), how it's found fast (indexes), and how correctness is guaranteed across failures (ACID/BASE, transactions, PACELC).

## Key Concepts

- Data model choice — SQL vs NoSQL, when each fits.
- Scaling data — sharding, federation, replication.
- Fast lookups — indexes.
- Correctness guarantees — ACID, BASE, distributed transactions, PACELC.

## Core Knowledge

A single database server eventually hits limits on storage, throughput, or availability. Replication copies data across nodes for read scaling and fault tolerance; sharding and federation split data across nodes so no single node holds everything. Indexes make reads fast at the cost of slower writes and extra storage. The harder problem is correctness once data is distributed: ACID transactions guarantee correctness on one node, distributed transactions try to extend that guarantee across many, and PACELC (an extension of CAP) frames the trade-off between consistency and latency even when there's no network partition. NoSQL databases typically relax some of these guarantees in exchange for scale and flexibility.

## Interview Questions

**Q: What's the difference between sharding and federation?**
A: Sharding splits one logical dataset (e.g. users) across multiple databases by a shard key; federation splits by function — separate databases for separate domains (e.g. users DB, orders DB).

**Q: Why would you choose NoSQL over SQL?**
A: When the schema is unstable, scale requirements are extreme, or the data model (documents, wide columns, graphs) doesn't fit naturally into relational tables.

**Q: What does PACELC add on top of CAP?**
A: CAP only describes trade-offs during a network partition; PACELC also covers the normal case — even without a partition (E), you trade latency (L) for consistency (C).

## Scenario

An e-commerce platform shards its orders table by customer region for write throughput, replicates each shard for read scaling and failover, and uses distributed transactions only for the checkout flow where correctness (not eventual consistency) is non-negotiable.
