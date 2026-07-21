---
id: cap-theorem
title: "CAP Theorem"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, distributed-systems]
parent: database
children: []
status: draft
---

# CAP Theorem

## Overview

CAP theorem says a distributed data system can guarantee at most two of three things at once — Consistency, Availability, Partition tolerance — and since network splits (partitions) are bound to happen in any real distributed system, the real choice is between consistency and availability during a partition. It exists to name the basic tradeoff that every distributed database's design reflects.

## Key Concepts

- **Consistency (C)** — every read gets back the most recent write, or an error, across all nodes
- **Availability (A)** — every request gets a non-error response, without a promise it's the newest data
- **Partition tolerance (P)** — the system keeps working even when nodes can't talk to each other over the network
- **CP system** — picks consistency over availability during a partition (e.g. traditional consensus-based stores)
- **AP system** — picks availability over consistency during a partition (e.g. many NoSQL defaults)
- **PACELC** — extra idea noting that even without a partition, you still trade delay against consistency

## Core Knowledge

- Partition tolerance isn't really a choice in a real network — the real choice CAP forces is CP vs AP when a partition happens, not whether to accept P at all
- CP systems reject or delay some requests during a partition to avoid giving out stale/conflicting data — correctness over uptime
- AP systems keep answering during a partition but may give back stale or conflicting data that must be fixed later — uptime over instant correctness
- Outside of a partition, most systems act consistent and available at the same time — CAP tradeoffs only matter when the network actually splits
- PACELC adds to the idea: even with no partition, a system still trades delay for consistency (wait for all copies vs answer fast from one)
- The choice is rarely all-or-nothing for a whole database — many systems allow tuning consistency per action (e.g. Cassandra's ONE/QUORUM/ALL read levels, or DynamoDB's choice of eventual vs strong reads) instead of one fixed global CP or AP stance
- Concretely: PostgreSQL/MySQL and ZooKeeper lean CP; Cassandra, DynamoDB, CouchDB, Riak, and even DNS lean AP — DNS is arguably the internet's biggest AP system
- CAP is about behavior during a partition, not a marketing label — "NoSQL is AP, SQL is CP" is a rough rule of thumb, not a fixed law; specific setups can lean either way
- The plan for fixing conflicts (last-write-wins, vector clocks, app-level merge) is the real design work behind any AP choice — availability without a plan to fix conflicts just puts off the problem

## Interview Questions

**Q:** Why can't a system just have all three of C, A, and P?
**A:** Because real networks do split, the real choice is what happens during that split — give out maybe-stale data (A) or refuse/delay requests to stay correct (C); you can't do both at once when nodes can't talk to each other.

**Q:** Give an example of a CP vs an AP design choice.
**A:** A strongly consistent, quorum-based store (e.g. traditional RDBMS clusters, ZooKeeper) is CP; a store like Cassandra set up for eventual consistency and always-available writes is AP.

**Q:** What does PACELC add to CAP?
**A:** It notes that even without a partition, there's still a delay-vs-consistency tradeoff — waiting for copies to agree costs delay, answering right away risks staleness.

**Q:** Is "AP" a valid excuse to skip designing conflict fixes?
**A:** No — choosing availability just means conflicting writes will happen; something (last-write-wins, vector clocks, merge logic) must fix them, or the system just builds up silent inconsistency.

## Scenario

A globally distributed shopping cart service loses connection between two data centers for a few minutes, and the team must decide what happens to cart updates during that time. Choosing availability (AP) lets both data centers keep accepting cart changes on their own, with a merge plan fixing any conflicting updates once the connection returns — accepting short-term inconsistency in exchange for the cart never looking "down" to a shopper.
