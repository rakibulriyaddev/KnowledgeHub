---
id: redis
title: "Redis"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, nosql]
parent: key-value-store
children: []
status: draft
---

# Redis

## Overview

Redis is the dominant in-memory data structure server, extending the plain key-value model with rich types (lists, sets, hashes, sorted sets, streams) and single-threaded atomic execution. It's the concrete engine behind most of the caching, session, and rate-limiting patterns described generically for key-value stores, and increasingly used as a lightweight message broker and primary store for specific workloads.

## Key Concepts

- **Single-threaded execution** — commands run one at a time, making individual operations atomic without explicit locking
- **Data structures** — lists, sets, hashes, sorted sets, bitmaps, streams — beyond plain string values
- **Persistence** — RDB (point-in-time snapshot) and AOF (append-only log), optional and configurable
- **Pub/Sub and Streams** — messaging primitives layered on top of the key-value core
- **Redis Cluster** — native sharding across nodes via hash slots
- **Pipelining** — batching multiple commands in one round trip to cut network overhead

## Core Knowledge

- Single-threaded command execution means one slow command (a large `KEYS` scan, a huge sorted-set operation) blocks everything else — command choice and Big-O awareness matter more here than in multi-threaded engines
- Persistence is opt-in and tunable: pure in-memory (fastest, data lost on crash), RDB snapshots (periodic, can lose recent writes), AOF (near-durable, higher write overhead) — pick based on how much loss is tolerable
- Sorted sets (ranked, range-queryable) are Redis's signature structure, powering leaderboards, rate limiters, and priority queues that plain key-value can't express
- Redis Cluster shards via hash slots automatically, but multi-key operations across slots are restricted unless keys are deliberately co-located (hash tags)
- Pub/Sub is fire-and-forget with no persistence or replay — Streams exist specifically because Pub/Sub can't support durable, replayable messaging
- Eviction under `maxmemory` follows configurable policies (LRU, LFU, random, or none) — misconfiguring this on a store expected to hold durable data silently loses writes
- Replication is asynchronous by default (same tradeoff as generic database-replication) — a failover can lose the last few unreplicated writes
- Using Redis as a primary store (not just a cache) requires deliberate persistence and replication configuration — the defaults are cache-oriented, not database-oriented

## Interview Questions

**Q:** Why does Redis's single-threaded model still perform well under load?
**A:** Most operations are O(1)/O(log n) and in-memory, so single-threaded execution avoids locking overhead entirely — the risk is a single expensive command blocking the whole server.

**Q:** RDB vs AOF — what's the practical tradeoff?
**A:** RDB is a periodic snapshot (fast recovery, can lose recent writes); AOF logs every write (near-durable, larger files, more write overhead) — many setups combine both.

**Q:** Why use Streams instead of Pub/Sub for messaging in Redis?
**A:** Pub/Sub delivers only to currently-connected subscribers with no persistence; Streams persist messages and support replay and consumer groups.

**Q:** What must change to use Redis safely as a primary datastore rather than a cache?
**A:** Persistence (AOF) and eviction policy must be configured deliberately — cache-oriented defaults (volatile, eviction-happy) will silently drop data otherwise.

## Scenario

A team builds a real-time leaderboard by re-querying and re-sorting scores from the primary database on every read, causing latency spikes under load. Moving scores into a Redis sorted set gives O(log n) rank updates and range queries natively, and the leaderboard reads directly from memory instead of re-computing rankings on every request.
