---
title: "Database Replication — Q&A"
---

**Q: What's the primary purpose of Database Replication?**
A: Same data on multiple servers - HA + read scale — Same data on multiple servers → fault tolerance and read scaling.

**Q: Where do writes happen in Master-Slave?**
A: On the master — Writes happen on the master; the slave copies that change.

**Q: What happens in Synchronous Replication?**
A: The master waits until the replica acknowledges — Sync = strong consistency, but slower.

**Q: In Asynchronous Replication, some data can be lost if the master crashes.**
A: True — Un-replicated transactions disappear when the master crashes.

**Q: What is Replication Lag?**
A: The time for data to reach a replica from the master — Replication lag = the sync delay between master and replica.

**Q: Why does read-your-writes inconsistency happen?**
A: A read from a replica right after a user's write returns stale data — The replica lags behind - so the user doesn't see their own update.

**Q: What's the biggest challenge with Master-Master?**
A: Conflict resolution (two writes to the same row) — When two masters write to the same row it conflicts - needs last-write-wins or vector clocks.

**Q: What is semi-synchronous replication?**
A: Hybrid - at least one replica acknowledges — Popular in MySQL - at least one replica syncs.

**Q: Replication = Backup.**
A: False — Replication copies every change - an accidental DELETE gets replicated too. Backup is separate.

**Q: What is AWS RDS Multi-AZ?**
A: Sync replication + auto failover within a region — Multi-AZ = a standby in a different AZ, sync replication, auto failover.

**Q: A user updates their profile, reloads, and still sees the old value. What's the issue?**
A: Replication lag - reading from a replica — Common with async replication. Fix: read from the master right after a critical write.

**Q: An app has 90% reads, 10% writes. What strategy?**
A: Master + multiple read replicas — Read-heavy → scale by adding read replicas.

**Q: What is failover?**
A: Automatic switch from a failed master to a healthy replica — Master fails → replica is promoted - an automated process.

**Q: Geographic replicas help reduce latency.**
A: True — A replica closer to the user → lower read latency.

**Q: What is Vitess?**
A: YouTube's open-source MySQL scaling solution — Vitess, from YouTube - orchestrates replication + sharding for MySQL.

**Q: Which is NOT a benefit of replication?**
A: Write scaling — Replication doesn't help scale writes (the master is a single node). Sharding is needed for that.

**Q: Which replication type for critical financial transactions?**
A: Sync or semi-sync — Sync minimizes the risk of data loss.

**Q: Which is more accurate: statement-based or row-based replication?**
A: Row-based — Row-based is deterministic; statement-based has issues with NOW(), RAND().

**Q: A replica can be used not just for reads, but for backups too.**
A: True — Taking backups from a replica avoids putting load on the master.

**Q: What is Patroni?**
A: A HA + auto-failover tool for PostgreSQL — Patroni is an Orchestrator-style failover tool for Postgres.
