---
id: database-replication
title: "Database Replication"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, availability]
parent: database
children: []
status: draft
---

# Database Replication

## Overview

Replication copies data from a main node to one or more backup nodes so the system survives node failure and can serve reads from more than one place. It matters because a single database has one point of failure and a limit on how many reads it can serve. It's the tool behind read scaling, failover, and the availability side of CAP trade-offs.

## Key Concepts

- **Primary / replica** — the node taking writes vs nodes getting copies
- **Synchronous replication** — the primary waits for a replica to confirm before saying a write is done
- **Asynchronous replication** — the primary confirms right away, replicas catch up after
- **Replication lag** — the delay between a write on the primary and it showing up on a replica
- **Failover** — making a replica the new primary when the old primary fails
- **Multi-primary / leaderless** — many nodes accept writes, needing a way to settle conflicts

## Core Knowledge

- Asynchronous replication is the common default because synchronous replication trades write speed (and sometimes uptime) for zero data loss on failover
- Replication lag means reads from a replica can return old data — "read your own writes" bugs happen when a read hits a lagging replica right after a write to the primary
- Failover isn't instant or free — finding a dead primary, picking a new one, and rerouting clients all take time, and writes not yet confirmed during that gap can be lost
- Read replicas scale read speed but do nothing for write speed — writes still funnel through the primary (or need multi-primary/sharding)
- Multi-primary setups gain write uptime across regions but must settle conflicting writes to the same data — a real design cost, not a free upgrade
- Replication layout (single replica, chain, star) affects both failover difficulty and how far behind the furthest replica can fall
- Synchronous replication to a second node is one way to make durability stronger than a single node's log/save-to-disk, at a speed cost per write
- Watching replication lag is a must — silent lag growth is a common warning sign before failover surprises and stale-read problems

## Interview Questions

**Q:** Why is asynchronous replication the common default despite the data-loss risk?
**A:** It keeps write speed high by not waiting for a replica to confirm; synchronous replication trades that speed for stronger durability guarantees.

**Q:** What causes a "read your own write" bug in a replicated system?
**A:** The read is sent to a replica that hasn't yet applied a very recent write to the primary, because of replication lag.

**Q:** Do read replicas help with write scale?
**A:** No — they only take read traffic off the primary; writes still go through the primary (or a multi-primary/sharded design is needed for write scale).

**Q:** What's the core trade-off multi-primary replication brings?
**A:** More write uptime across nodes/regions, at the cost of needing to settle conflicts for writes to the same data.

## Scenario

A checkout service reads a user's just-placed order right away from a read replica and finds it missing, because replication lag hadn't caught the replica up yet. Sending that specific read-after-write to the primary (or waiting for the replica to catch up) fixes the mismatch, while unrelated reporting queries stay on replicas without issue.
