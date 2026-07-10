---
id: database-replication
title: "Database Replication"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, availability]
parent: database
children: []
---

# Database Replication

## Overview

Replication copies data from a primary node to one or more secondary nodes so the system survives node failure and can serve reads from more than one place. It exists because a single database instance is both a single point of failure and a read-throughput ceiling. It's the mechanism behind read scaling, failover, and the availability side of CAP tradeoffs.

## Key Concepts

- **Primary / replica** — the node accepting writes vs nodes receiving copies
- **Synchronous replication** — primary waits for replica acknowledgment before confirming a write
- **Asynchronous replication** — primary confirms immediately, replicas catch up afterward
- **Replication lag** — delay between a write on the primary and its visibility on a replica
- **Failover** — promoting a replica to primary when the original primary fails
- **Multi-primary / leaderless** — multiple nodes accept writes, requiring conflict resolution

## Core Knowledge

- Asynchronous replication is the common default because synchronous replication trades write latency (and sometimes availability) for zero data loss on failover
- Replication lag means reads from a replica can return stale data — "read your own writes" bugs happen when a read hits a lagging replica right after a write to the primary
- Failover isn't instant or free — detecting a dead primary, electing a new one, and rerouting clients all take time, and unacknowledged writes during that window can be lost
- Read replicas scale read throughput horizontally but do nothing for write throughput — writes still funnel through the primary (or require multi-primary/sharding)
- Multi-primary setups gain write availability across regions but must resolve conflicting concurrent writes to the same data — a real design cost, not a free upgrade
- Replication topology (single replica, chain, star) affects both failover complexity and how far behind the furthest replica can drift
- Synchronous replication to a second node is one way to strengthen durability beyond a single node's WAL/fsync, at a latency cost per write
- Monitoring replication lag is operationally essential — silent lag growth is a common precursor to failover surprises and stale-read incidents

## Interview Questions

**Q:** Why is asynchronous replication the common default despite the data-loss risk?
**A:** It keeps write latency low by not waiting on replica acknowledgment; synchronous replication trades that latency for stronger durability guarantees.

**Q:** What causes a "read your own write" bug in a replicated system?
**A:** The read is routed to a replica that hasn't yet applied a very recent write to the primary, due to replication lag.

**Q:** Do read replicas help with write scalability?
**A:** No — they only offload read traffic; writes still go through the primary (or a multi-primary/sharded design is needed for write scale).

**Q:** What's the core tradeoff multi-primary replication introduces?
**A:** Higher write availability across nodes/regions, at the cost of needing conflict resolution for concurrent writes to the same data.

## Scenario

A checkout service reads a user's freshly placed order immediately from a read replica and finds it missing, because replication lag hadn't caught the replica up yet. Routing that specific read-after-write to the primary (or waiting for replica catch-up) resolves the inconsistency, while unrelated reporting queries stay on replicas without issue.
