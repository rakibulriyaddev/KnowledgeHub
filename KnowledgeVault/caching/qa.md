---
title: "Caching — Q&A"
---

**Q: What is the main purpose of Caching?**
A: Getting frequently accessed data quickly — Cache is keeping a copy of data for fast access.

**Q: Which caching strategy is the most common?**
A: Cache-Aside — Cache-Aside (Lazy Loading) - the most common pattern in read-heavy apps.

**Q: What does the LRU eviction policy remove?**
A: The least recently used item — LRU = Least Recently Used - removes the item accessed least recently.

**Q: Cache always lives in memory.**
A: False — Cache can also live on disk (browser disk cache, OS cache).

**Q: What is the default eviction policy in Redis?**
A: LRU — In Redis, allkeys-lru is the default option.

**Q: What happens in Write-through caching?**
A: Cache and DB are updated together — In Write-through, both cache and DB are synchronously updated on write.

**Q: What is Cache Stampede?**
A: Many requests hitting the DB at once — When a cache key expires, thousands of requests hitting the DB at once causes a stampede.

**Q: A cache key without a TTL never expires.**
A: True — Without a TTL, the key stays forever - it won't be removed unless the eviction policy removes it.

**Q: What kind of cache is a CDN?**
A: Edge/Geographic cache — A CDN caches static assets on geographically distributed edge servers.

**Q: What is the main difference between Memcached and Redis?**
A: Redis supports data structures — Redis has data structures like list, hash, sorted set etc.; Memcached is key-value only.

**Q: You cached many keys with the same TTL. When they all expire at once it causes a spike on the DB. What's the solution?**
A: Add random jitter to the TTL — Adding a random offset (jitter) to the TTL spreads out the expiries - preventing an avalanche.

**Q: An attacker keeps requesting with non-existent user IDs - all of them are reaching the DB. What's the solution?**
A: Bloom filter or negative caching — This is cache penetration. Caching a bloom filter or a null result saves DB hits.

**Q: Why is the first request slow in Cache-Aside?**
A: Cache miss -> has to fetch from the DB — The first time is a cache miss - it fetches from the DB and stores it in the cache. Later requests are fast.

**Q: Browser cache and CDN cache are at the same layer.**
A: False — Browser cache is on the user's device; CDN cache is on an edge server close to the ISP. Different layers.

**Q: What is the risk of Write-Behind caching?**
A: Data lost if cache crashes — Write happens to the cache and the DB gets it asynchronously - if the cache crashes, that data never reached the DB.

**Q: What's a good Cache Hit Ratio?**
A: 80%+ — 80%+ hit ratio is generally considered good. 100% isn't possible (warm-up + eviction).

**Q: When is the Refresh-Ahead strategy good?**
A: Latency-sensitive reads — Async refresh before the TTL expires - the user never sees the latency of a cache miss.

**Q: What format would you use for a user profile data cache key?**
A: user:123:profile — Hierarchical naming - namespace:id:field - readable and collision-free.

**Q: Cache invalidation is one of the hardest problems in distributed systems.**
A: True — "Cache invalidation and naming things - two hardest problems in CS" - Phil Karlton.

**Q: Between in-process cache (app memory) and distributed cache, which is better for a large system?**
A: Distributed (Redis) — Distributed cache is shared across all app instances - consistency is maintained.
