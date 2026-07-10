---
id: consistent-hashing
title: "Consistent Hashing"
created: 2026-07-11
modified: 2026-07-11
tags: [data, distributed-systems, scalability]
parent: database
children: []
---

# Consistent Hashing

## Overview

Consistent hashing is a hashing scheme that maps keys to nodes on a ring such that adding or removing a node only remaps a small, bounded fraction of keys, instead of nearly all of them as with plain modulo hashing. It exists because naive `hash(key) % N` remaps almost every key when N changes, making cluster resizing prohibitively disruptive. It underpins sharding and clustering in Redis, Cassandra, DynamoDB, and CDNs.

## Key Concepts

- **Hash ring** — conceptual circular space that both nodes and keys are hashed onto
- **Virtual nodes (vnodes)** — multiple ring positions per physical node, smoothing load distribution
- **Key ownership** — a key belongs to the first node found walking clockwise from its ring position
- **Rebalancing** — adding/removing a node only reassigns keys between it and its immediate ring neighbors
- **Hot spot** — uneven load when virtual nodes are too few or keys are skewed

## Core Knowledge

- With plain modulo hashing, changing node count N remaps roughly (N-1)/N of all keys; consistent hashing bounds remapping to about 1/N of keys per node change
- Virtual nodes solve the problem of a single physical node getting an unlucky (too large or too small) arc of the ring — more vnodes per node smooths the distribution
- Rebalancing cost is localized: only keys between the changed node and its neighbors move, which is why consistent hashing makes elastic scaling practical
- Skewed key popularity (a hot key) is not solved by consistent hashing — it solves distribution of key *space*, not distribution of *traffic* to individual keys
- Replication is naturally layered on top: a key's data is stored not just at its ring owner but also at the next N-1 nodes clockwise, giving redundancy without a separate scheme
- Choosing too few virtual nodes per physical node causes visible load imbalance; too many increases metadata/lookup overhead — real systems tune this
- This is the mechanism, not the policy — the actual sharding/routing decision (which key maps to which shard) still needs a real shard key design, same as in generic database-sharding
- Client-side vs server-side ring awareness matters: some systems (Cassandra) have clients aware of ring topology directly, others hide it behind a coordinator/proxy

## Interview Questions

**Q:** Why is plain `hash(key) % N` a bad fit for a growing/shrinking cluster?
**A:** Changing N remaps almost every key to a different node, forcing a near-total data shuffle on every resize — consistent hashing bounds that to a small fraction.

**Q:** What problem do virtual nodes solve?
**A:** Without them, each physical node owns one arbitrary ring arc that may be much larger or smaller than others; multiple vnodes per node average out the imbalance.

**Q:** Does consistent hashing prevent hot-key problems?
**A:** No — it distributes key space evenly across nodes, but if one specific key gets disproportionate traffic, that traffic still concentrates on whichever single node owns it.

**Q:** How does consistent hashing relate to replication in systems like Cassandra?
**A:** A key's replicas are simply the next N-1 nodes walking clockwise from its ring position, layering redundancy on top of the same ring structure used for placement.

## Scenario

A caching cluster resizes from 4 to 5 nodes during a traffic ramp-up, and with naive modulo hashing this would invalidate ~80% of cached keys at once, causing a stampede to the backing store. Using consistent hashing instead, only the keys between the new node and its neighbors move, keeping the vast majority of the cache warm through the resize.
