---
id: cap-theorem
title: "CAP Theorem"
created: 2026-07-10
modified: 2026-07-11
tags: [data, storage, distributed-systems]
parent: database
children: []
status: draft
---

# CAP Theorem

## Overview

CAP theorem states that a distributed data system can guarantee at most two of three properties — Consistency, Availability, Partition tolerance — at the same time, and since network partitions are inevitable in any real distributed system, the actual choice is between consistency and availability during a partition. It exists to name the fundamental tradeoff every distributed database's architecture reflects.

## Key Concepts

- **Consistency (C)** — every read receives the most recent write or an error, across all nodes
- **Availability (A)** — every request receives a non-error response, without guaranteeing it's the latest data
- **Partition tolerance (P)** — the system keeps operating despite network communication failures between nodes
- **CP system** — chooses consistency over availability during a partition (e.g. traditional consensus-based stores)
- **AP system** — chooses availability over consistency during a partition (e.g. many NoSQL defaults)
- **PACELC** — extension noting that even without a partition, you still trade latency against consistency

## Core Knowledge

- Partition tolerance isn't really optional in a real network — the practical choice CAP forces is CP vs AP when a partition occurs, not whether to pick P at all
- CP systems reject or block some requests during a partition to avoid serving stale/conflicting data — correctness over uptime
- AP systems keep answering during a partition but may return stale or conflicting data that must be reconciled later — uptime over immediate correctness
- Outside of a partition, most systems behave consistently and available simultaneously — CAP tradeoffs only bite when the network actually splits
- PACELC extends the idea: even with no partition, a system still trades latency for consistency (wait for all replicas vs respond fast from one)
- The choice is rarely all-or-nothing per database — many systems allow tunable consistency per operation (e.g. Cassandra's ONE/QUORUM/ALL read levels, or DynamoDB's eventually-vs-strongly-consistent reads) rather than a fixed global CP or AP stance
- Concretely: PostgreSQL/MySQL and ZooKeeper lean CP; Cassandra, DynamoDB, CouchDB, Riak, and even DNS lean AP — DNS is arguably the internet's largest AP system
- CAP is about behavior under partition, not a marketing label — "NoSQL is AP, SQL is CP" is a rough generalization, not a rule; specific configurations can shift either way
- Conflict resolution strategy (last-write-wins, vector clocks, application-level merge) is the real design work behind any AP choice — availability without a resolution plan just defers the problem

## Interview Questions

**Q:** Why can't a system just have all three of C, A, and P?
**A:** Because real networks do partition, the meaningful choice is what happens during that partition — serve possibly-stale data (A) or refuse/delay requests to stay correct (C); you can't do both at once when nodes can't communicate.

**Q:** Give an example of a CP vs an AP design choice.
**A:** A strongly consistent, quorum-based store (e.g. traditional RDBMS clusters, ZooKeeper) is CP; a store like Cassandra configured for eventual consistency and always-available writes is AP.

**Q:** What does PACELC add to CAP?
**A:** It notes that even absent a partition, there's still a latency-vs-consistency tradeoff — waiting for replica agreement costs latency, responding immediately risks staleness.

**Q:** Is "AP" a valid excuse to skip conflict resolution design?
**A:** No — choosing availability just means conflicting writes will happen; something (last-write-wins, vector clocks, merge logic) must resolve them, or the system just accumulates silent inconsistency.

## Scenario

A globally distributed shopping cart service loses connectivity between two data centers for a few minutes, and the team must decide what happens to cart updates during that window. Choosing availability (AP) lets both data centers keep accepting cart changes independently, with a merge strategy reconciling any conflicting updates once connectivity returns — accepting temporary inconsistency in exchange for the cart never appearing "down" to a shopper.
