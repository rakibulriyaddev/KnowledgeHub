---
title: "CAP Theorem — Q&A"
---

**Q: What are the three parts of CAP?**
A: Consistency, Availability, Partition Tolerance — CAP = Consistency, Availability, Partition Tolerance.

**Q: In CAP, how many can you guarantee at once?**
A: Only two — Brewer proved it - two out of three.

**Q: In a distributed system, which one is impossible to avoid?**
A: Partition Tolerance — Network partitions will happen - so P is non-negotiable.

**Q: What does a CP system choose?**
A: Consistency during a partition, giving up Availability — In CP, no stale data during a partition - it waits or errors instead.

**Q: What does an AP system choose?**
A: Availability during a partition, accepting eventual consistency — AP stays available, but stale data is possible.

**Q: Which category does Cassandra usually fall into?**
A: AP — Cassandra is eventually consistent - leans AP.

**Q: Which category does a traditional RDBMS (sync replication) fall into?**
A: CP — Strong consistency - CP.

**Q: A pure CA system is possible in practice.**
A: False — Network partitions are inevitable in a distributed system - P can't be avoided.

**Q: Which category is DNS in?**
A: AP — DNS is worldwide - eventually consistent, highly available.

**Q: Which does a banking system usually pick?**
A: CP — A wrong balance is a disaster - consistency is critical.

**Q: Social media like count - which does it pick?**
A: AP — A slight delay is fine, but it must stay available - AP.

**Q: Stock trading platform - which does it pick?**
A: CP — Seeing a wrong price causes loss - strong consistency.

**Q: What is Cassandra's QUORUM consistency?**
A: Majority of replicas respond — QUORUM = (replication_factor / 2) + 1 - balanced.

**Q: Modern DBs offer tunable consistency (choosable per query level).**
A: True — Cassandra, DynamoDB, and others offer query-time choice.

**Q: Which trait dominates MongoDB's default config?**
A: CP (majority write) — In the default replica set, majority write → leans CP.

**Q: What does an AP system do during a partition?**
A: Respond even with stale data — To stay available, it's willing to serve stale data.

**Q: When reserving a hotel room on Booking.com - which approach avoids double booking?**
A: CP (consistency critical) — Booking the same room twice is a disaster - CP.

**Q: What is the limitation of CAP?**
A: It doesn't talk about normal times - only partitions — PACELC also covers normal times.

**Q: A single-node DB can be CA.**
A: True — There's no partition on a single node - so CA is technically possible.

**Q: What are CRDT, Vector Clock, and Last-Write-Wins?**
A: Conflict resolution for AP systems — In AP, concurrent updates conflict - these strategies resolve them.
