---
title: "Database Replication — Deep Dive"
---

![Master-replica database architecture](/vault/replication/Master-Replica_database_architecture.jpeg)

Suppose an important document of yours exists only on one laptop - what happens if it gets stolen or the hard drive crashes? For safety, you keep a copy on Google Drive. That's exactly what Replication is - the same data in more than one place.

## What is Replication?

**Database Replication** = keeping the same data on multiple DB instances. Usually one primary (master) takes writes, and they get copied to replicas (slaves).

## Why Replication?

- **High Availability:** If the master fails, a replica can take over.
- **Read scaling:** Distribute queries across read replicas.
- **Backup:** A replica can serve as a backup.
- **Disaster Recovery:** Geographic replicas - in case a region goes down.
- **Reduced latency:** Geographic replicas closer to the user.
- **Maintenance:** Replicas serve traffic while the master is under maintenance.

## Topologies

### 1. Master-Slave (Primary-Replica)
One master, one or more replicas. All writes go to the master; replicas get copies.
- **Pros:** Simple, no write conflicts.
- **Cons:** Master is a single point of failure (for writes).

### 2. Master-Master (Multi-master)
Multiple masters - each can accept writes. They replicate to each other.
- **Pros:** Write availability - if one fails, the other keeps going.
- **Cons:** Write conflicts - when two nodes write to the same row.
- **Conflict resolution:** Last-write-wins, vector clock, CRDT.

### 3. Cascading Replication
A replica itself forwards data to another replica - a chain approach.

### 4. Circular Replication
A → B → C → A - less common, complex.

## Synchronous vs Asynchronous

**Synchronous Replication**
- Master waits until the write is replicated
- Guarantees data reaches the replica
- Strong consistency
- Slower - depends on network latency
- Used in banking/financial systems

**Asynchronous Replication**
- Replicates after the master commits
- Fast writes
- Replication lag exists
- Master crash → some data may be lost
- The most common approach

### Semi-synchronous
Hybrid - commit happens once at least one replica acknowledges, the rest are async. A popular option in MySQL.

## Replication Lag

**Replication lag** = the time between a write on the master and it reaching a replica. Usually milliseconds to seconds. But it can be minutes if the network is slow.

**Caution:** If a user updates their profile and reloads - and the load balancer routes them to a replica (with stale data) - they'll think the update didn't happen! This is called "read-your-writes" inconsistency.

### Solutions
- **Sticky session:** Read from the master right after the user's own write.
- **Wait for replica:** Use sync replication for critical parts.
- **Read from master:** For reads immediately following a critical write.

## Replication Methods

### Statement-based
SQL statements (UPDATE...) are sent to the replica. Compact, but non-deterministic functions (NOW(), RAND()) cause problems.

### Row-based
Each changed row is sent to the replica. Larger but accurate.

### Mixed
MySQL's default - switches depending on the case.

### Logical Replication
Replicates a logical change (insert row X) - possible across different DB versions.

## Automatic Failover

When the master fails, promoting a replica needs to be automated:
- **Health check:** Periodically ping the master.
- **Election:** Decide which replica becomes master - based on sync status.
- **Promotion:** Switch the selected replica to read-write mode.
- **Reconfigure clients:** Point them to the new master.

Tools: **MHA, Orchestrator, Patroni (Postgres), AWS RDS auto-failover**.

## Real-World Examples

- **Facebook:** MySQL master + many read replicas (region-wise).
- **YouTube:** Vitess (MySQL + replication + sharding) - open-sourced by Google.
- **GitHub:** MySQL multi-region replication (failover via Orchestrator).
- **AWS RDS:** Multi-AZ standby - sync replication + auto failover.

## Common Misconceptions

1. **"Replication = backup":** No - replication copies every change. An accidental DELETE goes to the replica too.
2. **"Async replication never loses data":** If the master crashes, un-replicated transactions are lost.
3. **"Multi-master is always better":** Conflict resolution is complex; master-slave is simple and sufficient in many cases.

## Best Practices

- Monitor replication - track lag and failures.
- Read from the master if read-your-writes consistency is needed.
- Use semi-sync or sync replication for critical writes.
- Keep backups separate - distinct from replication.
- Test failover drills - no surprises in production.
- Use geographic replicas for DR and latency.

## Chapter Summary

- Replication = the same data in multiple places.
- Master-slave is simple; multi-master is complex.
- Sync = strong consistency but slow; Async = fast but lag.
- Replication lag → "read-your-writes" problems.
- Replication is not a substitute for backup.
