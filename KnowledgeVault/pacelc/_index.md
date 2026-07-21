---
id: pacelc
title: "PACELC Theorem"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, distributed-systems, consistency, cap-theorem]
parent: sd-databases
children: []
status: draft
---

## Overview

PACELC, put forward by Daniel Abadi in 2012, builds on the CAP theorem by pointing out that CAP only covers the trade-off during a network split — but even when things are running normally, distributed systems are always trading speed against consistency. It gives a fuller picture for sorting and picking distributed databases.

## Key Concepts

- The formula — if Partition (P), pick Availability or Consistency; Else (E), pick Latency or Consistency.
- Four groups — PA/EL, PC/EC, PA/EC, PC/EL.
- Why speed-vs-consistency trade-offs happen even without a network split.
- Sorting real databases into a PACELC group.
- PACELC adds to CAP, it doesn't replace it.

## Core Knowledge

CAP says that during a network split, a system must choose Availability or Consistency, but says nothing about the much more common case where there's no split at all. PACELC fills that gap: with no split (Else), a system still must choose between low Latency (answer fast, maybe from one nearby copy) and strong Consistency (wait for all copies to match up first). This trade-off happens because strong consistency means waiting for other copies to confirm — which always adds delay — while eventual consistency lets a copy answer right away, at the risk of giving out old data.

The four PACELC groups: PA/EL (available during a split, low-delay otherwise — the most relaxed, used by Cassandra, DynamoDB, Riak, Voldemort, choosing speed for social/high-traffic work); PC/EC (always consistent, both during and outside a split, accepting more delay — VoltDB, BigTable, HBase, used where being correct matters more than speed); PA/EC (available during a split but consistent under normal conditions — MongoDB's default setup, a mix of both); and PC/EL (consistent during a split but fast otherwise — rare, e.g. Yahoo PNUTS). Sorting a database by both halves of PACELC gives a fuller picture than CAP's simple "CP vs AP" label: a system's behavior during a split and its everyday behavior can differ, and many adjustable systems (Cassandra with ONE/QUORUM/ALL, DynamoDB's read setting) let you pick the group per query. In practice: banking systems favor PC/EC (correctness always), social feeds favor PA/EL (speed always), and mixed document stores like MongoDB often land on PA/EC.

## Interview Questions

**Q: What gap in CAP does PACELC fill?**
A: CAP only covers the trade-off during a network split; PACELC adds that even with no split, systems still trade speed against consistency, since strong consistency needs copies to confirm with each other first.

**Q: Where would Cassandra and HBase fall in PACELC, and why?**
A: Cassandra is PA/EL — it stays available during a split and picks low delay otherwise, fitting high-traffic, tolerant work; HBase is PC/EC — always consistent, accepting more delay, fitting work that needs correctness guarantees.

**Q: Why can one database show up in different PACELC groups depending on setup?**
A: Many databases let you adjust consistency (e.g., Cassandra's ONE/QUORUM/ALL, DynamoDB's strong vs. eventual reads), so the real PACELC trade-off is picked per query, not fixed for the whole system.

## Scenario

A team is picking a database for a live social media feed versus a bank ledger. For the feed, they pick Cassandra (PA/EL) since splits are rare, but every request's speed matters and a slightly old like-count is harmless; for the ledger, they pick a strongly consistent store like HBase or a tuned Cassandra QUORUM setting (PC/EC) since correctness must hold even at the cost of speed.
