---
id: redis
title: "Redis"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, nosql]
parent: key-value-store
children: []
status: draft
---

# Redis

## Overview

Redis is the top in-memory data structure server. It extends the plain key-value model with rich types (lists, sets, hashes, sorted sets, streams) and runs commands one at a time so each one is atomic. It's the real engine behind most of the caching, session, and rate-limiting patterns described in general terms for key-value stores, and it's more and more used as a light message broker and as the main store for some workloads.

## Key Concepts

- **Single-threaded execution** — commands run one at a time, so each one is atomic with no locking needed
- **Data structures** — lists, sets, hashes, sorted sets, bitmaps, streams — beyond plain string values
- **Persistence** — RDB (a point-in-time snapshot) and AOF (a log of every write), both optional and configurable
- **Pub/Sub and Streams** — messaging tools built on top of the key-value core
- **Redis Cluster** — built-in sharding across nodes using hash slots
- **Pipelining** — batching many commands into one round trip to cut network overhead

## Core Knowledge

- Single-threaded execution means one slow command (a huge `KEYS` scan, a giant sorted-set operation) blocks everything else — picking the right command and knowing its cost matters more here than in multi-threaded engines
- Persistence is optional and tunable: pure in-memory (fastest, data lost on crash), RDB snapshots (periodic, can lose recent writes), AOF (near-safe, higher write cost) — pick based on how much loss you can accept
- Sorted sets (ranked, searchable by range) are Redis's signature structure, powering leaderboards, rate limiters, and priority queues that a plain key-value store can't do
- Redis Cluster shards data across hash slots on its own, but operations touching many keys across slots are limited unless keys are placed together on purpose (hash tags)
- Pub/Sub is fire-and-forget with no saving or replay — Streams exist because Pub/Sub can't support messages that are saved and can be replayed
- Eviction under `maxmemory` follows settable rules (LRU, LFU, random, or none) — getting this wrong on a store meant to hold important data quietly loses writes
- Replication is async by default (the same tradeoff as regular database replication) — a failover can lose the last few writes that hadn't copied over yet
- Using Redis as a main store (not just a cache) needs persistence and replication set up on purpose — the defaults are built for caching, not for being a database

## Interview Questions

**Q:** Why does Redis's single-threaded model still perform well under load?
**A:** Most operations are fast and in-memory, so single-threaded execution avoids locking costs entirely — the risk is a single expensive command blocking the whole server.

**Q:** RDB vs AOF — what's the real tradeoff?
**A:** RDB is a periodic snapshot (fast recovery, can lose recent writes); AOF logs every write (near-safe, bigger files, more write cost) — many setups use both together.

**Q:** Why use Streams instead of Pub/Sub for messaging in Redis?
**A:** Pub/Sub only delivers to subscribers connected right now and saves nothing; Streams save messages and support replay and consumer groups.

**Q:** What must change to use Redis safely as a main datastore instead of a cache?
**A:** Persistence (AOF) and the eviction rule must be set on purpose — cache-style defaults (quick to evict) will quietly drop data otherwise.

## Scenario

A team builds a real-time leaderboard by re-querying and re-sorting scores from the main database on every read, causing slow spikes under load. Moving scores into a Redis sorted set gives fast rank updates and range lookups straight from memory, so the leaderboard no longer needs to recompute rankings on every request.
