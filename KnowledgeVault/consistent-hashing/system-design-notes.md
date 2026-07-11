---
title: "Consistent Hashing — System Design Notes"
---

You're distributing data across 4 cache servers: `shard = hash(key) % 4`. Suddenly one server fails - now there are 3. You change the formula to `% 3`. But that changes the shard for almost every key - 75% of the data has to move! The solution to this problem is **Consistent Hashing**.

## The Problem with Regular Hashing

With modulo-based hashing:

- Going from N to N+1 servers: almost every key's location changes.
- Going from 4 → 5 servers reshuffles ~80% of keys.
- Resharding = downtime + massive data movement.

## What is Consistent Hashing?

**Consistent Hashing** (1997, MIT) - a hashing technique where adding/removing a server only remaps *K/N* of the data (K = total keys, N = total servers). Every other key's location stays unchanged.

## How Does It Work?

### Step 1: Hash Ring

Imagine a virtual circular ring - from 0 to 2³² (the hash space).

### Step 2: Server Placement

Hash each server's IP/name → a position on the ring.

### Step 3: Key Placement

Hash the key → a position on the ring. Then move clockwise to the first server.

### Step 4: Adding/Removing a Server

Adding a new server → the keys in a specific section of the ring move to the new server. All other keys stay unchanged.

## Virtual Nodes (vNodes)

With naive consistent hashing, distribution across 3 servers won't be uniform - one might get 50%, another 10%. Solution:

Give each physical server 100-500 **virtual node** positions on the ring. Each vNode gets its own hash position.

- **Advantage:** Better load distribution.
- **Heterogeneous servers:** A more powerful server gets more vNodes → more traffic.
- **Smooth rebalancing:** When a server fails - its vNodes' data spreads across many servers.

## Benefits

- **Minimal remapping:** Adding/removing a server only moves K/N of the data.
- **Scalability:** The cluster can grow gradually.
- **Fault tolerance:** A server failing = its data automatically goes to the next server.
- **Load balancing:** Uniform distribution (with vNodes).
- **No central coordinator:** Distributed-friendly.

## With Replication

Each key is replicated to the first *N* servers along the ring. If one fails, it's served from the next.

Example: Key X → Server A (primary), Server B (replica), Server C (replica). If A fails → B promotes / C reads.

## Consistent vs Naive Hashing

**Naive (modulo)**
- Server change = ~80% remap
- OK for a static cluster
- Simple to implement
- Unsuitable for distributed scale

**Consistent Hashing**
- Server change = K/N remap
- Ideal for a dynamic cluster
- Complex to implement
- The distributed system standard

## Real-world Use

- **Amazon DynamoDB:** Uses consistent hashing internally.
- **Apache Cassandra:** Core to Cassandra's key distribution.
- **Memcached:** Client-side consistent hashing.
- **Akamai CDN:** Server selection.
- **Discord:** Cassandra cluster (using consistent hashing).
- **Apache Riak:** Distributed KV store.

## Modern Alternatives

### Rendezvous Hashing

Highest Random Weight (HRW) - computes a hash against every server for each key and picks the highest. Simple but O(N).

### Jump Hash

Built by Google - very fast, but the server order is fixed.

### Maglev Hashing

Google's load balancer hashing.

## Implementation

Simple pseudo-code:

```
class ConsistentHash:
    def __init__(self):
        self.ring = SortedDict() # hash → server

    def add_server(self, server, vnodes=150):
        for i in range(vnodes):
            h = hash(f"{server}#{i}")
            self.ring[h] = server

    def get_server(self, key):
        h = hash(key)
        # Find first server with hash >= h (clockwise)
        idx = self.ring.bisect_right(h)
        if idx == len(self.ring): idx = 0
        return self.ring.values()[idx]
```

## Common Misconceptions

1. **"Consistent hashing automatically balances load":** Without vNodes → uneven distribution.
2. **"The implementation is simple":** Production-grade is hard - use a library to be safe.
3. **"It always uses MD5/SHA":** Fast non-crypto hashes (MurmurHash, xxHash) are preferred.

## Best Practices

- Use virtual nodes (100-500 vNodes per physical server).
- Use a fast non-cryptographic hash (MurmurHash3).
- Replication factor of 3 (typical).
- Monitor per-server load - adjust vNode count if uneven.
- Use an established library (jump hash, hashring) - don't reinvent it.

## Chapter Summary

- Consistent Hashing = minimal data movement when servers change.
- Hash ring + clockwise lookup.
- Virtual nodes give uniform distribution + smooth failover.
- DynamoDB, Cassandra, Memcached - all use it.
- The foundation of distributed caches/DBs.
