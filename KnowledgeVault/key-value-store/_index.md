---
id: key-value-store
title: "Key-Value Store"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage, nosql]
parent: unstructured-database
children: []
---

# Key-Value Store

## Overview

A key-value store maps opaque keys to values with no structure imposed on the value itself — the simplest possible data model, and the fastest. It exists for access patterns that are pure lookups by known key: caching, session storage, feature flags, rate limiting. Redis, Memcached, and DynamoDB (at its core) anchor this space.

## Key Concepts

- **Key** — unique lookup identifier, typically a string
- **Value** — opaque blob to the store — string, binary, or structured (list, set, hash) in richer engines
- **TTL (time-to-live)** — automatic expiry of a key after a set duration
- **Eviction policy** — rule for removing keys under memory pressure (LRU, LFU, random)
- **In-memory vs persistent** — pure in-memory (fast, volatile) vs disk-backed/replicated (durable, slower)
- **Data structure server** — engines like Redis extend beyond plain values to lists, sets, hashes, sorted sets

## Core Knowledge

- Lookup is O(1) by key — no query language, no joins, no secondary indexing by default, which is both the strength and the ceiling
- TTL and eviction are first-class because the primary use cases (cache, session, rate limit) are inherently ephemeral data
- Pure in-memory stores (classic Redis, Memcached) lose data on crash unless persistence (snapshotting, append-only log) is explicitly configured
- Cache-aside is the dominant pattern: application checks the store first, falls back to the source of truth on miss, then populates the cache
- Cache stampede (many requests miss simultaneously on expiry, all hit the backing store at once) needs mitigation — jittered TTLs, locks, or request coalescing
- Richer engines (Redis) offer atomic operations on structured values (list push, set membership, sorted set ranking) that plain key-value can't express
- Horizontal scaling is straightforward via consistent hashing on the key, but a single hot key can't be split — hot-key problems have no partition-level fix
- Never treat a cache as the system of record unless the engine explicitly guarantees durability — losing a plain cache should never lose data, only performance

## Interview Questions

**Q:** What is the cache-aside pattern and why is it common?
**A:** The app reads from the cache first, and on a miss reads from the source of truth then writes the result back to the cache — simple, and it degrades gracefully if the cache is empty or down.

**Q:** What causes a cache stampede and how do you prevent it?
**A:** Many keys expiring at once (or one hot key expiring under high load) send a burst of requests to the backing store simultaneously; jittering TTLs or coalescing concurrent requests for the same key prevents it.

**Q:** Why can't sharding fix a hot-key problem?
**A:** Sharding distributes different keys across nodes, but all traffic for one specific key still lands on a single node regardless of cluster size.

**Q:** When should you not use a key-value store as your primary database?
**A:** When you need querying by non-key attributes, relationships, or transactions spanning multiple keys — the model has no native support for any of that.

## Scenario

A product page loads slower during traffic spikes because every request re-runs the same expensive aggregation query against the primary database. Adding a key-value cache in front, keyed by product id with a short TTL and cache-aside logic, absorbs the vast majority of reads from memory, and jittering the TTL avoids every cached entry expiring in the same instant and re-flooding the database.
