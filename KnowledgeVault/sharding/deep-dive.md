---
title: "Database Sharding — Deep Dive"
---

Your database has 10 billion user records. On a single SQL server - disk full, queries slow, backups run all night. The solution: split it across 10 DBs - 1 billion in each. Look at the user's ID and route to the right DB. This is Sharding.

## What is Sharding?

**Database Sharding** = splitting one large database into many small shards - each shard on a separate server. This is also called **horizontal partitioning**.

Each shard is an independent database - same schema but a subset of the data.

**Note:** Analogy — if Bangladesh Bank kept every account in one place, handling queries and storage would be impossible. So it's split branch-wise - Dhaka branch, Chittagong branch, and so on.

## Why Sharding?

- **Storage scale:** A single DB exceeds its disk limit.
- **Throughput scale:** Read/write load spread across multiple servers.
- **Performance:** Smaller indexes, faster queries.
- **Geographic distribution:** Data closer to the user.
- **Fault isolation:** One shard fails = other shards unaffected.

## Horizontal vs Vertical Partitioning

**Horizontal (Sharding)**
- Row-based partition
- Same columns, different rows in each shard
- Same schema
- Most effective at scale

**Vertical Partitioning**
- Column-based partition
- Same row split across different tables
- Different schemas
- Cold/hot columns separated

## Sharding Strategies

### 1. Range-based Sharding
Data distributed according to the shard key's range.
- User ID 1-1M → Shard 1
- User ID 1M-2M → Shard 2
- User ID 2M-3M → Shard 3

**Advantage:** Range queries are easy. **Disadvantage:** Hot spot - all new users land on one shard.

### 2. Hash-based Sharding
The shard is determined from a hash of the shard key.

```
shard_id = hash(user_id) % num_shards
```

**Advantage:** Uniform distribution. **Disadvantage:** Range queries are hard; resharding is hard.

### 3. Geographic Sharding
Shard by location.
- Asia → Shard 1
- Europe → Shard 2
- America → Shard 3

**Advantage:** Lower latency, GDPR compliance. **Disadvantage:** Cross-region queries are hard.

### 4. Directory-based Sharding
A lookup service physically tracks where each piece of data lives.

**Advantage:** Flexible. **Disadvantage:** The lookup service is a single point of failure.

## Choosing a Shard Key

The most important decision in sharding - one that's hard to change later.

### Characteristics of a Good Shard Key
- **High cardinality:** Many unique values (not boolean).
- **Uniform distribution:** Avoids hot spots.
- **Common in queries:** Appears in the WHERE clause.
- **Stable:** Value doesn't change.
- **Co-locate related data:** All of a user's data on the same shard.

### Examples
- Social media: user_id (good - high cardinality, common in queries).
- E-commerce: customer_id.
- Multi-tenant SaaS: tenant_id.
- IoT: device_id + timestamp.

## Problems and Solutions

### Hot Spot (Hot Partition)
Disproportionate load on one shard. Example: a celebrity user's data all lands on one shard.
- Solution: Better hash function, salting, sub-sharding.

### Cross-shard Query
Data from multiple shards - JOIN, GROUP BY. Usually expensive.
- Solution: Denormalize, merge at the application level, scatter-gather queries.

### Resharding (Rebalancing)
Changing the shard count means redistributing all the data. A massive operation.
- Solution: Consistent hashing.

### Distributed Transaction
Transactions that touch multiple shards - 2PC or Saga.

### Backup & Restore
Backups must maintain cross-shard consistency.

## Implementation

### Application-level
Sharding logic in the app - which shard holds which data is decided in code.

### Middleware/Proxy
Vitess (YouTube), ProxySQL - a proxy between the app and the DB.

### Built-in
MongoDB, Cassandra, DynamoDB have native sharding. Transparent to the app.

## Real-world Examples

- **Instagram:** Postgres + custom sharding (user-based).
- **YouTube:** Vitess on MySQL - billion-row scale.
- **WhatsApp:** User_id-based sharding.
- **Discord:** Cassandra auto-shards with consistent hashing.
- **Twitter:** User-based + tweet-based sharding.

## When Should You Shard?

Sharding is the last resort - try these first:
1. Vertical scaling (bigger server)
2. Read replicas
3. Caching
4. Indexing & query optimization
5. Vertical partitioning
6. Then - sharding.

## Common Misconceptions

1. **"Shard early":** Premature optimization - in practice the complexity cost is higher.
2. **"A wrong shard key is fixable":** No - changing it is catastrophic.
3. **"Sharding = scaling solved":** No - operational overhead, hard to debug.

## Best Practices

- Design the shard key carefully - it can't be changed easily later.
- Use consistent hashing for resharding.
- Carefully co-locate data to avoid cross-shard queries.
- Monitor per-shard - detect hot spots.
- Plan your backup strategy up front.
- Consider Vitess or MongoDB's built-in sharding.

## Chapter Summary

- Sharding = horizontally splitting one DB into many small shards.
- Strategies: Range, Hash, Geo, Directory.
- Choose the shard key carefully - high cardinality, uniform.
- Hot spots, cross-shard queries, resharding - the main challenges.
- Sharding is a last resort - try replicas, caching, vertical scaling first.
