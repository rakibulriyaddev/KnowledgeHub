---
id: cassandra
title: "Cassandra"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, nosql]
parent: wide-column-store
children: []
status: draft
---

# Cassandra

## Overview

Cassandra is the reference wide-column store, built for masterless, multi-datacenter write scale with no single point of failure. It's the concrete engine behind the generic wide-column-store concepts — partition keys, tunable consistency, LSM-based writes — and pairs directly with consistent-hashing for its ring-based data placement.

## Key Concepts

- **Ring topology** — nodes arranged via consistent hashing, every node is a peer (no primary/leader)
- **Replication factor (RF)** — number of nodes each piece of data is copied to
- **Quorum consistency** — tunable per-query read/write consistency (ONE, QUORUM, ALL, LOCAL_QUORUM)
- **CQL (Cassandra Query Language)** — SQL-like syntax, but query patterns still schema-first per partition key
- **Gossip protocol** — nodes exchange cluster state peer-to-peer instead of relying on a coordinator
- **Hinted handoff** — temporarily storing writes meant for a down node, replaying them once it recovers

## Core Knowledge

- Masterless design means there's no single point of failure and no leader election on node loss — any node can coordinate any request, unlike primary-based systems
- Replication factor and consistency level are independent knobs — RF=3 with QUORUM reads/writes tolerates one node being down while still guaranteeing strong-enough consistency for most use cases
- LOCAL_QUORUM is the common choice in multi-datacenter deployments — it avoids waiting on cross-datacenter network latency while still requiring majority agreement within the local DC
- Gossip-based membership means cluster state converges eventually across nodes, not instantly — very large clusters can see slower convergence on topology changes
- Hinted handoff plus read repair are the main mechanisms restoring consistency after a temporary node outage, rather than a central authority reconciling state
- Data modeling must be done per query, exactly like generic wide-column-store — CQL's SQL-like syntax hides but does not remove the query-first design requirement
- Anti-patterns carried over from relational thinking (secondary indexes on high-cardinality columns, unbounded partitions, `ALLOW FILTERING` queries) degrade badly at scale
- Compaction strategy choice (size-tiered vs leveled) trades write throughput against read amplification and space overhead — the wrong choice for a workload causes real production pain

## Interview Questions

**Q:** Why doesn't Cassandra have a single point of failure the way a primary/replica system does?
**A:** Every node is a peer capable of coordinating requests, and data is distributed via consistent hashing across the ring — there's no leader whose loss triggers failover.

**Q:** Why is LOCAL_QUORUM preferred over QUORUM in multi-datacenter clusters?
**A:** It requires majority agreement only within the local datacenter, avoiding the latency of waiting on cross-datacenter network round trips while still avoiding split-brain within the DC.

**Q:** Does CQL's SQL-like syntax mean Cassandra supports ad hoc queries like a relational database?
**A:** No — queries must still align with the partition key design; `ALLOW FILTERING` or secondary indexes on the wrong columns can force expensive full-cluster scans.

**Q:** What are hinted handoff and read repair for?
**A:** Hinted handoff temporarily buffers writes meant for a down node and replays them on recovery; read repair reconciles stale replicas detected during normal reads — together they restore consistency without central coordination.

## Scenario

An application team ports relational habits to Cassandra, adding a secondary index on a high-cardinality "email" column and querying by it directly, and the cluster grinds under the resulting scatter-gather query pattern. Redesigning the table around the actual access pattern — a dedicated table partitioned by email as the partition key — restores the single-partition lookup performance Cassandra is built for.
