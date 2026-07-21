---
id: replication
title: "Database Replication"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, high-availability, scaling, distributed-systems]
parent: sd-databases
children: []
status: draft
---

## Overview

Database Replication keeps the same data on more than one database — usually one primary (main) taking writes and one or more replicas getting copies — to give high availability, faster reads, disaster recovery, and lower latency. It's the first tool most systems reach for before sharding.

## Key Concepts

- Layouts — master-slave, master-master, cascading, circular.
- Sync vs async vs semi-sync replication.
- Replication lag and the read-your-writes problem.
- Replication methods — statement-based, row-based, mixed, logical.
- Automatic failover — health check, election, promotion, reconfiguration.

## Core Knowledge

Master-slave (primary-replica) is the simplest layout: all writes go to the master, replicas copy the changes, and there are no write conflicts — but the master is a single point of failure for writes. Master-master lets more than one node take writes for higher write availability, at the cost of write conflicts that need fixing, using things like last-write-wins, vector clocks, or CRDTs. Sync replication makes the master wait for a replica to confirm before it finishes the write — strong correctness but slower, used in banking; async replication finishes right away and copies after, giving fast writes but risking lost data if the master crashes, and causing replication lag; semi-sync (common in MySQL) waits for at least one replica to confirm while the rest copy async.

Replication lag — the delay between a write on the master and its arrival at a replica — causes the "read-your-writes" problem: a user updates their profile, reloads, gets sent to a lagging replica, and sees old data, which looks like the update failed. Fixes include sticky sessions (read from the master right after the user's own write), waiting for a replica to confirm on important writes, or sending reads right after writes to the master. Replication methods differ: statement-based sends SQL statements (small but breaks on non-fixed functions like NOW()/RAND()), row-based sends the actual changed rows (bigger but correct), and logical replication copies changes at a meaning level, letting different versions replicate to each other. Automatic failover needs health checks, an election step to pick the best replica (based on how caught-up it is), promotion to read-write, and updating clients — tools like Patroni, Orchestrator, and MHA handle this. Importantly, replication is not a backup: it copies every change, including mistaken deletes, so a separate backup plan is still needed.

## Interview Questions

**Q: Why is replication not a stand-in for backups?**
A: Replication copies every change including mistakes — an accidental DELETE copies to every replica too — while a backup is a snapshot in time that can be restored on its own.

**Q: What causes "read-your-writes" problems and how do you fix it?**
A: Async replication lag means a replica may not yet have a user's own recent write; fix it by reading from the master right after an important write, or using sticky sessions/sync replication for that path.

**Q: When would you pick master-master over master-slave replication?**
A: When you need write availability across regions or nodes and can handle the added complexity of fixing conflicts (last-write-wins, vector clocks, CRDTs); master-slave is simpler and enough for most read-heavy work.

## Scenario

An app serves 90% reads and 10% writes. The team sets up one master handling all writes plus several read replicas behind a load balancer to soak up read traffic, using async replication for speed — except for checkout, where they read straight from the master to avoid showing a customer an old order status right after payment.
