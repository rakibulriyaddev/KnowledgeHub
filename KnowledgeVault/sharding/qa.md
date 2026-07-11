---
title: "Database Sharding — Q&A"
---

**Q: What is the definition of Sharding?**
A: Horizontally splitting one DB into many small shards — Sharding = horizontal partitioning across servers.

**Q: What is the difference between Sharding and Vertical Partitioning?**
A: Sharding is row-based, Vertical is column-based — Sharding splits rows; vertical partitioning splits columns.

**Q: What is the big problem with range-based sharding?**
A: Hot spot - all new users land on one shard — With auto-increment IDs, all new data goes to the last shard → hot spot.

**Q: What's the advantage of hash-based sharding?**
A: Uniform distribution — Hash gives a uniform spread → balanced load.

**Q: What is the disadvantage of hash-based sharding?**
A: Range queries are hard; resharding is hard — Hash output has no relation to sequence - range scans become complex.

**Q: What is the advantage of geographic sharding?**
A: Data close to the user → low latency + GDPR compliance — Asia user → Asia shard. Also handles region restrictions.

**Q: Which is a characteristic of a good shard key?**
A: High cardinality + uniform distribution — Many unique values → uniform spread.

**Q: A boolean field makes a good shard key.**
A: False — A boolean only has two values - it would only ever hit two shards. Worst case.

**Q: What is a Hot Partition?**
A: Disproportionate load on one shard — More traffic on one shard - a performance bottleneck.

**Q: What is the problem with cross-shard queries?**
A: Touching multiple shards - slow + complex — JOINs/aggregates require scatter-gather; latency increases.

**Q: Changing a shard key is generally easy.**
A: False — It's catastrophic - all data must be redistributed, with downtime.

**Q: Why is resharding hard?**
A: Almost all data must be redistributed, with downtime — With standard hashing, changing the shard count remaps almost every key.

**Q: A multi-tenant SaaS app - which shard key is better?**
A: tenant_id — All of a tenant's data lands on one shard - queries stay co-located.

**Q: A celebrity Twitter user's tweets all land on one shard - it's overwhelmed. Solution?**
A: Sub-shard / salting strategy — Sub-partition or virtual sub-shards on the hot key → distribute the load.

**Q: What should you try before sharding?**
A: Replicas + caching + vertical scaling + indexing — Sharding is a last resort - try simpler solutions first.

**Q: What is Vitess?**
A: YouTube's open-source MySQL sharding tool — Vitess provides sharding + replication abstraction on MySQL.

**Q: How does MongoDB handle sharding?**
A: Native built-in sharding — MongoDB shard clusters - auto-sharding, balancer.

**Q: In directory-based sharding?**
A: A lookup service tracks where each piece of data lives — Flexible - but the lookup service is a single point of failure.

**Q: Sharding also provides HA.**
A: True — One shard failing = other shards unaffected (if replicas exist).

**Q: What is Discord's scaling strategy?**
A: Cassandra + consistent hashing — Discord handles billions of messages in a Cassandra cluster.
