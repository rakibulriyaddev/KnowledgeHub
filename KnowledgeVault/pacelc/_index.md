---
id: pacelc
title: "PACELC Theorem"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, distributed-systems, consistency, cap-theorem]
parent: sd-databases
children: []
status: draft
---

## Overview

PACELC, proposed by Daniel Abadi in 2012, extends the CAP theorem by pointing out that CAP only describes a trade-off during a network partition — but even in normal operation, distributed systems constantly trade latency against consistency. It gives a fuller picture for classifying and choosing distributed databases.

## Key Concepts

- The formula — if Partition (P), choose Availability or Consistency; Else (E), choose Latency or Consistency.
- Four categories — PA/EL, PC/EC, PA/EC, PC/EL.
- Why normal-time latency-consistency trade-offs exist even without partitions.
- Classifying real databases by PACELC category.
- PACELC as a supplement to CAP, not a replacement.

## Core Knowledge

CAP says that during a network partition, a system must choose Availability or Consistency, but says nothing about the far more common case where there is no partition. PACELC fills that gap: absent a partition (Else), a system still must choose between low Latency (respond fast, maybe from a single/nearest replica) and strong Consistency (wait for synchronous replication across nodes). This trade-off exists because strong consistency requires waiting for acknowledgment from other replicas — inherently adding latency — while eventual consistency lets a node respond immediately at the risk of returning stale data.

The four PACELC categories: PA/EL (available during a partition, low-latency otherwise — the most relaxed, used by Cassandra, DynamoDB, Riak, Voldemort, favoring speed for social/high-throughput workloads); PC/EC (always consistent, both during and outside partitions, accepting higher latency — VoltDB, BigTable, HBase, used where correctness matters more than speed); PA/EC (available during a partition but consistent under normal conditions — MongoDB's default configuration, a hybrid); and PC/EL (consistent during a partition but latency-optimized otherwise — rare, e.g. Yahoo PNUTS). Classifying a database by both halves of PACELC gives a more complete picture than CAP's "CP vs AP" label alone: a system's partition-time behavior and its everyday behavior can differ, and many tunable systems (Cassandra with ONE/QUORUM/ALL, DynamoDB's read consistency setting) let you effectively choose the category per query. In practice: banking systems favor PC/EC (accuracy always), social feeds favor PA/EL (speed always), and hybrid document stores like MongoDB commonly land on PA/EC.

## Interview Questions

**Q: What gap in CAP does PACELC address?**
A: CAP only specifies a trade-off during a network partition; PACELC adds that even without a partition, systems still trade latency against consistency, since strong consistency requires synchronous replication overhead.

**Q: Where would Cassandra and HBase fall in the PACELC classification, and why?**
A: Cassandra is PA/EL — it stays available during a partition and favors low latency otherwise, fitting high-throughput, tolerant workloads; HBase is PC/EC — always consistent, accepting higher latency, fitting workloads needing correctness guarantees.

**Q: Why can a single database appear in different PACELC categories depending on configuration?**
A: Many databases expose tunable consistency (e.g., Cassandra's ONE/QUORUM/ALL, DynamoDB's strong vs. eventual reads), so the effective PACELC trade-off is chosen per query rather than fixed system-wide.

## Scenario

A team is choosing a database for a real-time social media feed versus a banking ledger. For the feed, they pick Cassandra (PA/EL) since partitions are rare but every request's latency matters and slightly stale likes are harmless; for the ledger, they pick a strongly consistent store like HBase or a tuned Cassandra QUORUM setting (PC/EC) since correctness must hold even at the cost of latency.
