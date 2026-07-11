---
title: "ACID and BASE — Q&A"
---

**Q: What does the A in ACID stand for?**
A: Atomicity — A = Atomicity - either everything happens or nothing does.

**Q: What does Atomicity mean?**
A: Either everything in a transaction happens, or nothing does — Indivisible unit - there's no partial commit.

**Q: What guarantee does Durability provide?**
A: Data is permanent after commit (even through a crash) — Committed data survives power loss and crashes.

**Q: What is Isolation?**
A: Concurrent transactions don't interfere with each other — Concurrent transactions behave as if run serially.

**Q: What is PostgreSQL's default isolation level?**
A: Read Committed — PostgreSQL's default is Read Committed.

**Q: What is MySQL's default isolation level?**
A: Repeatable Read — InnoDB's default is Repeatable Read.

**Q: At which isolation level is Dirty Read possible?**
A: Read Uncommitted — In Read Uncommitted, uncommitted data can be read.

**Q: What is the E in BASE?**
A: Eventually Consistent — Eventually Consistent - everything converges over time.

**Q: BASE = no consistency.**
A: False — "Eventually consistent" - it becomes consistent, even if delayed.

**Q: What does BASE's "Soft state" mean?**
A: State can change even without external input (replica sync) — Replicas are syncing - so the state is self-healing.

**Q: Banking transfer (A to B) - which property is critical?**
A: ACID (specifically Atomicity) — If it fails midway - deducted from A but never credited to B = disaster.

**Q: Twitter's like count - which property is sufficient?**
A: BASE (eventual consistency OK) — It doesn't matter to the user if the like count updates a second later.

**Q: What's the difference between ACID's C and CAP's C?**
A: ACID = constraint validity; CAP = node sync — Different concepts. ACID's C = DB rule; CAP's C = distributed sync.

**Q: WAL is the implementation of Durability.**
A: True — The Write-Ahead Log is written to disk before commit - replayed on crash.

**Q: Which of these is NOT a benefit of ACID?**
A: Massive horizontal scale — ACID makes horizontal scaling difficult.

**Q: What is Cassandra's tunable consistency?**
A: You can choose the level per query (ONE, QUORUM, ALL) — In Cassandra you pick the consistency level at query time - flexibility.

**Q: Which property matters for inventory management?**
A: ACID (stock count race conditions) — Stock accuracy is critical - race conditions are a disaster.

**Q: What is the downside of Serializable isolation?**
A: Slow due to heavy locking — Strongest isolation but lower throughput - heavy lock contention.

**Q: MongoDB 4+ supports multi-document ACID transactions.**
A: True — MongoDB added ACID transactions starting in 2018.

**Q: What is special about Google Spanner?**
A: Globally distributed ACID — Google achieved globally distributed ACID using the TrueTime API.
