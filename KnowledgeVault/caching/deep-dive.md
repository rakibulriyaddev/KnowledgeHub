---
title: "Caching — Deep Dive"
---

You take the same route to the office every day. Do you open Google Maps to look up the route every single day? No - because your brain has *memorized* the route. Instead of thinking it through again each time, your brain quickly recalls the previous answer. That's exactly what **caching** is.

## What is Caching?

**Caching** means keeping frequently accessed data in a fast storage location so that the next time it's needed it can be fetched quickly - without going back to the original source.

**Note:** When a popular YouTube video is watched by many people repeatedly - YouTube doesn't fetch it from the origin server every single time. Browser cache + CDN cache + edge cache - copies exist everywhere. So even when watched from Bangladesh, it loads fast.

## Why is Caching needed?

- **Performance:** Reading data from RAM is 100x faster than from disk. Cache is usually in memory.
- **Scalability:** Fewer requests hit the database - the DB stays under less pressure.
- **Cost:** Fewer DB queries = lower compute cost.
- **User experience:** Page load < 1 second - user satisfaction goes up.
- **Network bandwidth:** CDN cache is close to the user - bandwidth is saved.

## Where does caching happen?

A single web request can hit cache at many layers along its journey:

1. **Browser cache:** CSS, JS, images - stored in the browser's disk.
2. **CDN cache:** Static assets on edge servers.
3. **Reverse proxy cache:** NGINX/Varnish, where the full HTML page is cached.
4. **Application cache:** In the app's memory (in-process).
5. **Distributed cache:** Redis/Memcached - shared.
6. **Database cache:** Query result cache (in PostgreSQL, MySQL).
7. **Disk cache:** OS level - read/write buffer.
8. **CPU cache:** L1/L2/L3 - hardware level.

## Caching Strategies

### 1. Cache-Aside (Lazy Loading)
The app checks the cache first. If not found, it fetches from the DB and stores it in the cache.

`App -> Cache (miss) -> DB -> cache.set(key) -> return`

- **Advantage:** Only requested data gets cached (memory efficient).
- **Disadvantage:** The first request is slow. Stale data is possible.
- **Use case:** Read-heavy apps - the most common pattern.

### 2. Write-Through
On write, both the DB and the cache are updated at the same time.
- **Advantage:** Cache is always fresh.
- **Disadvantage:** Higher write latency (writing to two places).

### 3. Write-Behind (Write-Back)
Write happens to the cache, and the DB is written asynchronously.
- **Advantage:** Writes are fast.
- **Disadvantage:** Data can be lost if the cache crashes.

### 4. Read-Through
The cache itself fetches data from the DB; the app only interacts with the cache.

### 5. Refresh-Ahead
The cache is refreshed asynchronously before it expires. Good for latency-sensitive apps.

## Eviction Policies

Cache memory is limited - old data has to be removed. An eviction policy decides what gets removed.

**LRU (Least Recently Used)**
- Removes the item accessed least recently
- The most common
- The default option in Redis

**LFU (Least Frequently Used)**
- Removes the least frequently accessed item
- Keeps hot data
- Issue: new hot items get unfairly evicted at cold-start

**FIFO (First In First Out)**
- What came in first goes out first
- Simple but less optimal

**TTL (Time To Live)**
- Time-based expiry
- Combines with all other strategies

## Distributed Cache (Redis/Memcached)

Keeping a cache on just one server doesn't scale and isn't HA. A distributed cache partitions data across a cluster.

- **Redis:** Data structures (list, hash, set, sorted set), persistence, pub/sub, replication. The most popular.
- **Memcached:** Key-value only, simpler, fewer features, but faster in some cases.

## Problems with Caching

### Cache Stampede (Thundering Herd)
A cache key suddenly expires - thousands of requests hit the DB at once. Solution: locking, request coalescing, refresh-ahead.

### Cache Penetration
An attacker repeatedly requests a non-existent key - cache miss -> DB hit -> pressure on the DB. Solution: bloom filter, negative caching.

### Cache Avalanche
Many keys expire at once -> a spike on the DB. Solution: random TTL jitter.

## Real-world examples

- **Twitter timeline:** Precomputed timeline in Redis.
- **Facebook newsfeed:** Memcached + Redis.
- **YouTube thumbnails:** CDN cache.
- **Wikipedia:** Varnish reverse proxy cache.

## Common misconceptions

1. **"Cache is always fast":** With network latency, a remote cache can be even slower than a local DB.
2. **"The more cache the better":** Cache invalidation is hard - stale data becomes a problem.
3. **"Cache has infinite memory":** Without an eviction policy, the cache fills up and crashes.

## Best Practices

- Follow a cache key naming convention: `user:123:profile`.
- Always set a TTL - at least as a fallback.
- Add jitter to the TTL - to avoid avalanches.
- Monitor the cache hit ratio - 80%+ is good.
- Think about security before caching sensitive data.

## Chapter Summary

- Cache is keeping a copy of data for fast access.
- Cache-Aside is the most common strategy.
- LRU is the most common eviction policy.
- Redis/Memcached for distributed caching.
- Stampede, Penetration, Avalanche - three cache problems.
