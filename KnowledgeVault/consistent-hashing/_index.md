---
id: consistent-hashing
title: "Consistent Hashing"
created: 2026-07-11
modified: 2026-07-22
tags: [data, distributed-systems, scalability]
parent: database
children: []
status: draft
---

# Consistent Hashing

## Overview

Consistent hashing is a hashing method, first shown by Karger and others at MIT in 1997, that maps keys to nodes on a ring so that adding or removing a node only moves a small, limited share of keys, instead of nearly all of them like plain modulo hashing does. It exists because the simple `hash(key) % N` moves almost every key whenever N changes, making it very costly to resize a cluster. It is the base of sharding and clustering in Redis, Cassandra, DynamoDB, Memcached (on the client side), Akamai's CDN, and Discord's message store.

## Key Concepts

- **Hash ring** — conceptual circular space that both nodes and keys are hashed onto
- **Virtual nodes (vnodes)** — multiple ring positions per physical node, smoothing load distribution
- **Key ownership** — a key belongs to the first node found walking clockwise from its ring position
- **Rebalancing** — adding/removing a node only reassigns keys between it and its immediate ring neighbors
- **Hot spot** — uneven load when virtual nodes are too few or keys are skewed

## Core Knowledge

- With plain modulo hashing, changing the node count N remaps roughly (N-1)/N of all keys; consistent hashing limits this to about 1/N of keys per node change
- Virtual nodes fix the problem of one physical node getting an unlucky (too big or too small) piece of the ring — more vnodes per node smooths out the load
- The cost of rebalancing stays local: only keys between the changed node and its neighbors move, which is why consistent hashing makes elastic scaling practical
- Consistent hashing does not fix an uneven popular key (a "hot key") — it spreads out the key *space*, not the *traffic* going to individual keys
- Replication is added naturally on top: a key's data is stored not just at its owner node but also at the next N-1 nodes going clockwise, giving redundancy without needing a separate scheme
- Choosing too few virtual nodes per physical node causes an obvious load imbalance; too many raises the cost of metadata and lookups — real systems adjust this balance
- This is the mechanism, not the rule for deciding — the actual choice of which key goes to which shard still needs a real shard key design, just like in general database sharding
- Whether the client or the server knows about the ring matters: some systems (Cassandra) let clients know the ring layout directly, others hide it behind a coordinator or proxy
- Other options exist: rendezvous (highest-random-weight) hashing is simpler but costs O(N) per lookup, and Google's Jump Hash / Maglev hashing trade some flexibility for speed. A fast, non-cryptographic hash (MurmurHash, xxHash) is chosen over MD5/SHA, since avoiding collisions is not the goal here

## Interview Questions

**Q:** Why is plain `hash(key) % N` a bad fit for a growing/shrinking cluster?
**A:** Changing N remaps almost every key to a different node, forcing a near-total shuffle of data on every resize — consistent hashing limits that to a small share.

**Q:** What problem do virtual nodes solve?
**A:** Without them, each physical node owns one random piece of the ring that may be much bigger or smaller than others; several vnodes per node average out the imbalance.

**Q:** Does consistent hashing prevent hot-key problems?
**A:** No — it spreads out key space evenly across nodes, but if one specific key gets much more traffic than others, that traffic still lands on whichever single node owns it.

**Q:** How does consistent hashing relate to replication in systems like Cassandra?
**A:** A key's copies are simply the next N-1 nodes walking clockwise from its ring position, adding redundancy on top of the same ring used for placement.

## Scenario

A caching cluster grows from 4 to 5 nodes during a traffic ramp-up. With plain modulo hashing, this would throw away about 80% of cached keys at once, causing a rush of requests to the backing store. Using consistent hashing instead, only the keys between the new node and its neighbors move, so most of the cache stays warm through the resize.
