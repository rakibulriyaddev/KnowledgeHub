---
id: replication
title: "Database Replication"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, high-availability, scaling, distributed-systems]
parent: sd-databases
children: []
status: draft
---

## Overview

Database Replication keeps the same data on multiple database instances — typically one primary (master) taking writes and one or more replicas receiving copies — to provide high availability, read scaling, disaster recovery, and reduced latency. It is the foundation most systems reach for before sharding.

## Key Concepts

- Topologies — master-slave, master-master, cascading, circular.
- Synchronous vs asynchronous vs semi-synchronous replication.
- Replication lag and the read-your-writes consistency problem.
- Replication methods — statement-based, row-based, mixed, logical.
- Automatic failover — health check, election, promotion, reconfiguration.

## Core Knowledge

Master-slave (primary-replica) is the simplest topology: all writes go to the master, replicas copy the changes, and there are no write conflicts — but the master is a single point of failure for writes. Master-master lets multiple nodes accept writes for higher write availability, at the cost of write conflicts that need resolution strategies like last-write-wins, vector clocks, or CRDTs. Synchronous replication makes the master wait for replica acknowledgment before committing — strong consistency but higher latency, used in banking; asynchronous replication commits immediately and replicates after, giving fast writes but risking data loss on master crash and introducing replication lag; semi-synchronous (popular in MySQL) waits for at least one replica to acknowledge while the rest sync asynchronously.

Replication lag — the delay between a master write and its arrival at a replica — causes the "read-your-writes" problem: a user updates their profile, reloads, gets routed to a lagging replica, and sees stale data, appearing as if the update failed. Fixes include sticky sessions (read from master right after the user's own write), waiting for replica acknowledgment on critical writes, or routing reads-after-writes to the master. Replication methods vary: statement-based replication sends SQL statements (compact but breaks on non-deterministic functions like NOW()/RAND()), row-based sends actual changed rows (larger but accurate), and logical replication replicates changes at a semantic level, allowing cross-version replication. Automatic failover requires health checks, an election process to pick the best replica (based on sync status), promotion to read-write, and reconfiguring clients — tools like Patroni, Orchestrator, and MHA handle this. Critically, replication is not a backup: it propagates every change, including accidental deletes, so a separate backup strategy is still required.

## Interview Questions

**Q: Why is replication not a substitute for backups?**
A: Replication copies every change including mistakes — an accidental DELETE propagates to every replica too — whereas a backup is a point-in-time snapshot that can be restored independently.

**Q: What causes "read-your-writes" inconsistency and how do you fix it?**
A: Asynchronous replication lag means a replica may not yet have a user's own recent write; fix it by reading from the master immediately after a critical write, or by using sticky sessions/sync replication for that path.

**Q: When would you choose master-master over master-slave replication?**
A: When you need write availability across regions or nodes and can tolerate the added complexity of conflict resolution (last-write-wins, vector clocks, CRDTs); master-slave is simpler and sufficient for most read-heavy workloads.

## Scenario

An application serves 90% reads and 10% writes. The team sets up one master handling all writes plus several read replicas behind a load balancer to absorb read traffic, using asynchronous replication for speed — except for the checkout flow, where they read from the master directly to avoid showing a customer a stale order status right after payment.
