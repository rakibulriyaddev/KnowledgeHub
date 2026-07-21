---
id: key-value-store
title: "Key-Value Store"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, nosql]
parent: unstructured-database
children: [redis]
status: draft
---

# Key-Value Store

## Overview

A key-value store maps plain keys to values with no set shape on the value itself — the simplest data model there is, and the fastest. It exists for access patterns that are pure lookups by known key: caching, session storage, feature flags, rate limiting. Redis, Memcached, and DynamoDB (at its core) lead this space.

## Key Concepts

- **Key** — unique lookup name, usually a string
- **Value** — a plain blob to the store — string, binary, or a structured item (list, set, hash) in richer engines
- **TTL (time-to-live)** — a key expires on its own after a set time
- **Eviction policy** — the rule for removing keys when memory runs low (LRU, LFU, random)
- **In-memory vs persistent** — pure in-memory (fast, lost on restart) vs disk-backed/replicated (kept safe, slower)
- **Data structure server** — engines like Redis go beyond plain values to lists, sets, hashes, sorted sets

## Core Knowledge

- Lookup is instant by key — no query language, no joins, no secondary indexing by default, which is both the strength and the limit
- TTL and eviction are core features because the main uses (cache, session, rate limit) are naturally short-lived data
- Pure in-memory stores (classic Redis, Memcached) lose data on a crash unless saving to disk (snapshots, an append-only log) is turned on
- Cache-aside is the main pattern: the app checks the store first, falls back to the real source on a miss, then fills the cache
- Cache stampede (many requests miss at once when something expires, all hit the real store at once) needs a fix — jittered TTLs, locks, or merging requests
- Richer engines (Redis) offer safe, all-or-nothing actions on structured values (list push, set membership, sorted set ranking) that plain key-value can't do
- Scaling out across machines is easy using consistent hashing on the key, but one very busy key can't be split — busy-key problems have no fix at the split level
- Never treat a cache as the main copy of data unless the engine clearly promises to keep it safe — losing a plain cache should only cost speed, never data

## Interview Questions

**Q:** What is the cache-aside pattern and why is it common?
**A:** The app reads from the cache first, and on a miss reads from the real source then writes the result back to the cache — simple, and it still works fine if the cache is empty or down.

**Q:** What causes a cache stampede and how do you stop it?
**A:** Many keys expiring at once (or one busy key expiring under high load) send a burst of requests to the real store at the same time; jittering TTLs or merging requests for the same key stops it.

**Q:** Why can't splitting across machines fix a busy-key problem?
**A:** Splitting spreads different keys across machines, but all traffic for one specific key still lands on a single machine no matter how big the cluster is.

**Q:** When should you not use a key-value store as your main database?
**A:** When you need to search by fields other than the key, need relationships, or need actions spanning multiple keys — the model has no built-in support for any of that.

## Scenario

A product page loads slower during traffic spikes because every request re-runs the same costly total-calculating query against the main database. Adding a key-value cache in front, keyed by product id with a short TTL and cache-aside logic, absorbs most reads from memory, and jittering the TTL stops every cached entry from expiring at the same moment and flooding the database again.
