---
title: "PACELC Theorem — Deep Dive"
---

The CAP Theorem says - during a partition, choose C or A. But what about the normal times (when there's no partition) for a distributed system - is everything fine then? No - there's still a Latency vs Consistency trade-off. That's what PACELC addresses.

## What is the PACELC Theorem?

**PACELC** (2012, Daniel Abadi) is an extended form of CAP:

```
If Partition (P), choose Availability (A) or Consistency (C);
Else (E), choose Latency (L) or Consistency (C).
```

In short:
- **P + A/C:** During a partition - Availability vs Consistency.
- **E + L/C:** Else (normal times) - Latency vs Consistency.

## Why does PACELC matter?

CAP says nothing outside of partitions (which are rare). But in a distributed DB, even though partitions are rare, the latency-consistency trade-off is always present. Examples:

- Strong consistency = synchronous replication = waiting → higher latency.
- Eventual consistency = asynchronous = fast response → lower latency, but risk of staleness.

## PACELC Categories

**PA/EL**
- Availability during a partition
- Latency otherwise
- Most relaxed
- Cassandra, DynamoDB

**PC/EC**
- Always Consistency
- Higher latency
- Strong guarantee
- VoltDB, BigTable, HBase

**PA/EC**
- Availability during a partition
- Consistency otherwise
- Hybrid
- MongoDB (default config)

**PC/EL**
- Consistency during a partition
- Latency otherwise
- Rare
- Less common

## PACELC Classification of Databases

- **PA/EL:** Cassandra, DynamoDB, Riak, Voldemort - speed prioritized.
- **PC/EC:** VoltDB, BigTable, HBase - always consistent.
- **PA/EC:** MongoDB (default) - available during a partition, consistent under normal conditions.
- **PC/EL:** Yahoo PNUTS - an uncommon hybrid.

## Real-world examples

### Cassandra (PA/EL)
- Partition: AP - stays available.
- Normal: one replica responds → fast.
- Trade-off: risk of stale data.
- Use: massive scale, social media.

### HBase (PC/EC)
- Partition: CP - strong consistency.
- Normal: synchronous replication → slower.
- Trade-off: higher latency.
- Use: financial-grade accuracy.

### MongoDB (PA/EC by default)
- During a partition: the minority side rejects writes (leans CP).
- Normal: reads from primary, synchronous replication within the majority.
- Configurable: read concern, write concern.

## Why does this matter in practice?

When designing a system, looking only at CAP's "CP vs AP" gives you an incomplete picture:

- Twitter feed - partitions are rare, but latency is critical on every request → PA/EL fits well.
- Banking - can't tolerate a partition, and needs accuracy under normal conditions → PC/EC.
- E-commerce search - eventual consistency is mostly fine → PA/EL.

## CAP vs PACELC

**CAP (1999)**
- 2 out of 3
- Only talks about partitions
- Silent on normal times
- Simple

**PACELC (2012)**
- 2 trade-offs
- Partition + Normal
- Also covers latency-consistency
- Complete picture

## Common misconceptions

1. **"PACELC replaces CAP":** No - it's a supplement.
2. **"Every AP system is PA/EL":** No - some AP systems are consistent under normal conditions (PA/EC).
3. **"PACELC is just theory":** No - it has practical implications for DB choice.

## Best Practices

- Think about both partition behavior and normal-time behavior for your use case.
- Look up a DB's PACELC classification in its documentation.
- If tunable consistency is available - match it at the query level.
- Banking → PC/EC; Social → PA/EL.
- Define your latency budget upfront - understand your ms-level dependencies.

## Chapter Summary

- PACELC = CAP + a normal-time trade-off.
- P + A/C; Else + L/C.
- PA/EL: Cassandra, DynamoDB. PC/EC: HBase, VoltDB.
- MongoDB is PA/EC (default).
- PACELC is more useful for real DB choices.
