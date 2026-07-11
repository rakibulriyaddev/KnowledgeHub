---
title: "CAP Theorem — System Design Notes"
---

![CAP theorem architecture](/vault/cap-theorem/CAP_Theorem_architecture_diagram.jpeg)

You have two bank branches - Dhaka and Chittagong. Both want to keep account balances in sync at every moment. Suddenly the internet line between Dhaka and Chittagong gets cut. There are two options:

- (1) Maintain Consistency - stop working until sync is restored. Everyone waits.
- (2) Maintain Availability - let both branches operate independently. Sync later.

This is the core trade-off of the **CAP Theorem**.

## What is the CAP Theorem?

The **CAP Theorem** (Brewer's theorem, 2000) says that in a distributed system, you can fully guarantee only two of the following three at the same time:

- **Consistency (C):** Every node always returns the same data.
- **Availability (A):** Every request gets a response (success or failure).
- **Partition Tolerance (P):** The system keeps running even if the network fails.

## Why is it impossible to have all three together?

In a distributed system, network partitions will happen (cable cuts, router failures, latency spikes). That means **P** is non-negotiable. So the real choice is - during a partition, do you keep **C** or **A**?

### During a partition

- The network between Node A and Node B is broken.
- A client writes to A.
- Another client reads from B.
- Choice 1 (CP): B won't respond - there's no sync, so it waits or errors.
- Choice 2 (AP): B returns stale data - but at least it responds.

## CP Systems - Consistency + Partition Tolerance

You want Consistency during a partition, and are willing to give up Availability.

### Examples

- **Traditional RDBMS:** PostgreSQL, MySQL (synchronous replication).
- **MongoDB:** In the default config, majority writes - the minority side rejects writes during a partition.
- **HBase:** Strong consistency.
- **Zookeeper:** A coordination service - must be consistent.

### Use cases

- Banking and finance.
- E-commerce inventory.
- Booking systems.
- Anywhere stale data causes harm.

## AP Systems - Availability + Partition Tolerance

You want Availability during a partition, and relax Consistency.

### Examples

- **Cassandra:** Eventually consistent (tunable).
- **DynamoDB:** Eventual consistency by default.
- **CouchDB.**
- **Riak.**
- **DNS:** Probably the internet's biggest AP system.

### Use cases

- Social media feeds.
- Real-time chat.
- Like/view counts.
- Anywhere availability > perfect accuracy.

## CA Systems - why don't they really exist?

In theory, CA (Consistency + Availability, no Partition tolerance) exists - but in practice, network partitions are inevitable. So a pure CA system is really just a single-node DB. Once you're distributed, P is mandatory - so you pick CP or AP.

**Caution:** Many people say "MySQL is a CA system" - that's wrong. A single-node MySQL is CA, but the moment you add any replication, you have to deal with P.

## In practice - Tunable Consistency

Modern systems aren't locked into strict CP/AP. You can choose per operation:

### Cassandra Consistency Levels

- **ONE:** One replica responds → leans AP.
- **QUORUM:** A majority responds → balanced.
- **ALL:** Every replica → CP-like.

### DynamoDB

- **Eventually consistent read:** Default, fast.
- **Strongly consistent read:** Higher latency.

## Triangle Visualization

In a real distributed system, you can reach the left side (CP) or the right side (AP) - the top corner (CA) is not reachable.

## Real-world examples

- **Banking transfer:** CP - during a partition, better to wait than to be wrong.
- **Facebook newsfeed:** AP - a slight delay is OK, but it must show something.
- **Amazon shopping cart:** AP - reconcile later.
- **Stock trading:** CP - a wrong price means loss.
- **Booking.com:** Mostly CP - no double bookings.

## The limitation of CAP - PACELC

CAP only talks about partitions. What about normal times? PACELC gives the complete picture - covered in detail in the next chapter.

## Common misconceptions

1. **"You can get all three at once":** No - Brewer's proven theorem says otherwise.
2. **"A CAP system is chosen permanently":** Modern DBs are tunable - you can choose at the query level.
3. **"P is optional":** No - network partitions are inevitable in a distributed system.
4. **"CP > AP":** Wrong - it depends on the use case.

## Best Practices

- Define the use case first - then choose CP/AP.
- Embrace tunable consistency - choose per operation.
- Handle inconsistency in the application - a "syncing" indicator at the UI level.
- Have a conflict resolution strategy - CRDT, last-write-wins, vector clock.
- Instead of memorizing CAP, understand the actual behavior during a partition.

## Chapter Summary

- CAP = Consistency, Availability, Partition Tolerance - 2 out of 3.
- Avoiding P isn't possible - so pick CP or AP.
- CP: RDBMS, MongoDB; AP: Cassandra, DynamoDB.
- Pure CA is really only possible on a single node.
- Modern DBs offer tunable consistency.
