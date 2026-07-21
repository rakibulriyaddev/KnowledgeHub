---
id: caching
title: "Caching"
created: 2026-07-11
modified: 2026-07-22
tags: [performance, distributed-systems, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Caching keeps often-used data in a fast storage spot, so later requests skip the original, slower source. It exists because reading from memory is roughly 100x faster than disk, and cutting repeated work at every layer — browser, CDN, application, database — is one of the highest-payoff ways to improve speed and scale.

## Key Concepts

- Caching happens at many layers: browser, CDN, reverse proxy, application, distributed cache, database, disk, CPU
- Cache-Aside (Lazy Loading) — the most common strategy; the app fetches on a miss and fills the cache
- Write-Through, Write-Behind, Read-Through, Refresh-Ahead — other write/read strategies
- Eviction policies (rules for removing old data): LRU (most common), LFU, FIFO, TTL
- Distributed caches (Redis, Memcached) scale past a single server
- Cache Stampede, Cache Penetration, Cache Avalanche — the three classic failure types

## Core Knowledge

Caching trades a small risk of stale data for big gains in speed and cost: fewer database hits mean lower compute cost, faster page loads, and less network traffic (a CDN cache near the user saves the trip back to the origin). A single request can pass through many cache layers before reaching the origin — browser cache, CDN edge, reverse proxy, application memory, a distributed cache like Redis, and even the database's own query cache.

The main strategy is Cache-Aside: the application checks the cache first, and on a miss it fetches from the database and fills the cache for next time. It saves memory since only requested data gets cached, though the first request is always slow. Write-Through keeps the cache always fresh by updating cache and DB together at write time, at the cost of slower writes. Write-Behind writes to the cache right away and sends the update to the DB later, which is fast but risks losing data if the cache crashes before the write lands.

Since cache memory is limited, an eviction policy decides what gets removed when it's full — LRU (Least Recently Used) is the most common and Redis's default, LFU keeps often-used data but can unfairly remove new popular items, FIFO is simple but less good, and TTL-based expiry can combine with any of these.

**Caution:** three common cache failure types deserve attention: Cache Stampede (a popular key expires and thousands of requests hit the DB at once — fixed with locking or refresh-ahead), Cache Penetration (repeated requests for keys that don't exist skip the cache every time — fixed with bloom filters or negative caching), and Cache Avalanche (many keys expire at the same time, spiking the DB — fixed with random TTL jitter).

## Interview Questions

**Q: What is Cache-Aside and why is it the most common pattern?**
A: The application checks the cache first, and on a miss asks the database and writes the result back to the cache. It's the default for read-heavy workloads because it only caches what's actually requested.

**Q: What's the difference between Cache Stampede and Cache Avalanche?**
A: A stampede is many requests hitting the DB when one popular key expires; an avalanche is many different keys expiring around the same time, causing a bigger spike. Random TTL jitter prevents avalanches; locking or grouping requests prevents stampedes.

**Q: When would you choose Redis over Memcached?**
A: When you need richer data structures (lists, hashes, sorted sets), saved data, or pub/sub — Memcached is simpler and purely key-value, sometimes faster for that narrow use case.

## Scenario

A social app's popular post cache key expires at the same time thousands of people are viewing it. Without protection, all those requests miss the cache and hit the database at once (a cache stampede) — a single lock or a refresh-ahead strategy that refills the cache just before it expires stops the spike completely.
