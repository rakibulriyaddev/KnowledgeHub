---
title: "PACELC Theorem — Q&A"
---

**Q: In PACELC, what is the trade-off in the "ELSE" case?**
A: Latency vs Consistency — In normal times, it's Latency vs Consistency.

**Q: In PACELC, what is the trade-off during "P"?**
A: Availability vs Consistency — During a partition it's the A/C trade-off (like CAP).

**Q: Who proposed PACELC?**
A: Daniel Abadi (2012) — Daniel Abadi proposed it in 2012.

**Q: Where does Cassandra fall in PACELC?**
A: PA/EL — Cassandra is AP during a partition, low-latency otherwise - PA/EL.

**Q: Where does HBase fall in PACELC?**
A: PC/EC — HBase is always consistent - PC/EC.

**Q: Which category does MongoDB (default) fall into?**
A: PA/EC — Leans AP during a partition, consistent otherwise - PA/EC.

**Q: PACELC replaces CAP.**
A: False — PACELC is a supplement - an extension of CAP.

**Q: Which limitation of CAP does PACELC solve?**
A: It doesn't cover the normal-time trade-off — CAP only talks about partitions; PACELC covers trade-offs in both cases.

**Q: What is the cost of strong consistency?**
A: Higher latency (synchronous waiting) — Synchronous replication = waiting → higher latency.

**Q: Eventual consistency gives low latency.**
A: True — Asynchronous replication - responds quickly.

**Q: A high-throughput social feed. Which PACELC category?**
A: PA/EL — Latency is critical, and eventual consistency is fine - PA/EL.

**Q: A banking core ledger system. Which PACELC category?**
A: PC/EC — Accuracy sometimes matters more than speed - PC/EC.

**Q: What is DynamoDB's default config?**
A: PA/EL — DynamoDB's default is eventual consistency - PA/EL.

**Q: What does PA/EC mean?**
A: Available during a partition, consistent otherwise — Hybrid - different trade-offs in each situation.

**Q: Choosing a distributed DB without PACELC is incomplete.**
A: True — Not knowing normal-time behavior can lead to picking the wrong DB.

**Q: Which trade-off is directly tied to network speed?**
A: PACELC's L (latency) — This trade-off is about latency.

**Q: Real-time IoT sensor data - which PACELC category is better?**
A: PA/EL — Massive writes, eventual consistency is fine - PA/EL.

**Q: Which category does VoltDB fall into?**
A: PC/EC — VoltDB is always strongly consistent - PC/EC.

**Q: PACELC can also be applied at the per-query level in tunable DBs.**
A: True — Choosing consistency at the query level effectively changes the category.

**Q: What causes the latency vs consistency trade-off?**
A: Synchronous replication takes time; async is fast but stale — Sync = waits for replicas; async = no wait but there's lag.
