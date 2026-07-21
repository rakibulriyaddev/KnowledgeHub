---
id: cassandra
title: "Cassandra"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, nosql]
parent: wide-column-store
children: []
status: draft
---

# Cassandra

## Overview

Cassandra is the main example of a wide-column store. It is built for masterless, multi-datacenter write scale, with no single point of failure. It is the real engine behind general wide-column-store ideas — partition keys, tunable consistency, LSM-based writes — and works directly with consistent-hashing for placing data on its ring.

## Key Concepts

- **Ring topology** — nodes are placed using consistent hashing; every node is equal (no primary or leader)
- **Replication factor (RF)** — number of nodes each piece of data is copied to
- **Quorum consistency** — read/write consistency you can set per query (ONE, QUORUM, ALL, LOCAL_QUORUM)
- **CQL (Cassandra Query Language)** — looks like SQL, but you must still design your table around the partition key first
- **Gossip protocol** — nodes share cluster state directly with each other, with no central coordinator
- **Hinted handoff** — for a short time, store writes meant for a down node, then send them again once it comes back

## Core Knowledge

- Masterless design means there is no single point of failure, and no leader election when a node is lost — any node can handle any request. This is not true for primary-based systems.
- Replication factor and consistency level are two separate settings — RF=3 with QUORUM reads/writes can handle one node being down while still giving strong enough consistency for most use cases.
- LOCAL_QUORUM is the usual choice for multi-datacenter setups — it avoids waiting for slow cross-datacenter network trips, while still needing most nodes in the local datacenter to agree.
- Because membership uses gossip, cluster state matches across nodes eventually, not right away — very large clusters can be slower to update after a change.
- Hinted handoff and read repair are the main ways consistency is restored after a node is down for a while — there is no central authority fixing the state.
- You must design your data model around each query, just like in a general wide-column store — CQL looks like SQL, but this does not remove the need to design for your queries first.
- Habits carried over from relational databases (secondary indexes on high-cardinality columns, partitions with no limit, `ALLOW FILTERING` queries) work badly at scale.
- The compaction strategy you choose (size-tiered vs leveled) trades write speed against extra reads and disk space. The wrong choice for your workload causes real problems in production.

## Interview Questions

**Q:** Why doesn't Cassandra have a single point of failure the way a primary/replica system does?
**A:** Every node is a peer that can handle requests, and data is spread with consistent hashing across the ring — there is no leader whose loss causes a failover.

**Q:** Why is LOCAL_QUORUM preferred over QUORUM in multi-datacenter clusters?
**A:** It only needs agreement from most nodes in the local datacenter, so it avoids the delay of cross-datacenter network trips, while still avoiding a split inside the local datacenter.

**Q:** Does CQL's SQL-like syntax mean Cassandra supports ad hoc queries like a relational database?
**A:** No — queries must still match the partition key design. `ALLOW FILTERING` or secondary indexes on the wrong columns can force slow scans across the whole cluster.

**Q:** What are hinted handoff and read repair for?
**A:** Hinted handoff stores writes for a down node for a while and sends them again once it recovers. Read repair fixes stale copies found during normal reads. Together they restore consistency without a central coordinator.

## Scenario

A team brings relational habits into Cassandra: they add a secondary index on a high-cardinality "email" column and query it directly. The cluster slows down badly under the resulting scatter-gather query. Redesigning the table around the real query — a separate table using email as the partition key — brings back the fast, single-partition lookups Cassandra is built for.
