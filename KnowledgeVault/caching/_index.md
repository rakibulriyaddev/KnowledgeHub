---
id: caching
title: "Caching"
created: 2026-07-11
modified: 2026-07-11
tags: [performance, distributed-systems, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Caching keeps frequently accessed data in a fast storage location so subsequent requests skip the original, slower source. It exists because reading from memory is roughly 100x faster than disk, and cutting repeated work at every layer — browser, CDN, application, database — is one of the highest-leverage techniques for performance and scalability.

## Key Concepts

- Caching happens at many layers: browser, CDN, reverse proxy, application, distributed cache, database, disk, CPU
- Cache-Aside (Lazy Loading) — the most common strategy, app fetches on miss and populates cache
- Write-Through, Write-Behind, Read-Through, Refresh-Ahead — other write/read strategies
- Eviction policies: LRU (most common), LFU, FIFO, TTL
- Distributed caches (Redis, Memcached) scale beyond a single server
- Cache Stampede, Cache Penetration, Cache Avalanche — the three classic failure modes

## Core Knowledge

Caching trades a bit of staleness risk for large performance and cost gains: fewer database hits mean lower compute cost, faster page loads, and reduced network bandwidth (a CDN cache near the user saves the trip back to origin). A single request can pass through many cache layers before reaching the origin — browser cache, CDN edge, reverse proxy, application memory, a distributed cache like Redis, and even the database's own query cache.

The dominant strategy is Cache-Aside: the application checks the cache first, and on a miss fetches from the database and populates the cache for next time. It's memory-efficient since only requested data gets cached, though the first request is always slow. Write-Through keeps the cache always fresh by updating cache and DB together at write time, at the cost of higher write latency. Write-Behind writes to the cache immediately and pushes to the DB asynchronously, which is fast but risks data loss if the cache crashes before the write lands.

Because cache memory is finite, an eviction policy decides what gets removed when it's full — LRU (Least Recently Used) is the most common and Redis's default, LFU keeps frequently-used data but can unfairly evict new hot items, FIFO is simple but less optimal, and TTL-based expiry combines with any of these.

**Caution:** three recurring cache failure modes deserve attention: Cache Stampede (a hot key expires and thousands of requests hit the DB simultaneously — fixed with locking or refresh-ahead), Cache Penetration (repeated requests for non-existent keys bypass the cache every time — fixed with bloom filters or negative caching), and Cache Avalanche (many keys expire simultaneously, spiking the DB — fixed with randomized TTL jitter).

## Interview Questions

**Q: What is Cache-Aside and why is it the most common pattern?**
A: The application checks the cache first, and on a miss queries the database and writes the result back to the cache. It's the default for read-heavy workloads because it only caches what's actually requested.

**Q: What's the difference between Cache Stampede and Cache Avalanche?**
A: A stampede is many requests hitting the DB when one hot key expires; an avalanche is many different keys expiring around the same time, causing a broader spike. Randomized TTL jitter prevents avalanches; locking or request coalescing prevents stampedes.

**Q: When would you choose Redis over Memcached?**
A: When you need richer data structures (lists, hashes, sorted sets), persistence, or pub/sub — Memcached is simpler and purely key-value, sometimes faster for that narrow use case.

## Scenario

A social app's popular post cache key expires simultaneously with thousands of concurrent viewers reading it. Without protection, all those requests miss the cache and hit the database at once (a cache stampede) — a single-flight lock or refresh-ahead strategy that repopulates the cache just before expiry prevents the spike entirely.
